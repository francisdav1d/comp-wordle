import 'dotenv/config'
import cors from 'cors'
import express from 'express'
import { createClient } from '@supabase/supabase-js'
import { evaluateGuess, isValidGuess } from './wordle.js'

const {
  PORT = 4000,
  FRONTEND_URL = 'http://localhost:5173',
  SUPABASE_URL,
  SUPABASE_SERVICE_ROLE_KEY,
} = process.env

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error('SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required.')
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

// PERFORMANCE CACHE: Load words into memory to avoid repeated DB calls
let wordCache = new Set()
let wordList = []
async function refreshWordCache() {
  const { data, error } = await supabase.from('words').select('word')
  if (error) {
    throw createHttpError(500, error.message)
  }

  if (data) {
    wordList = data.map((entry) => entry.word.toLowerCase())
    wordCache = new Set(wordList)
    console.log(`🚀 Cached ${wordCache.size} words for instant lookup.`)
  }
}

const app = express()

const allowedOrigins = (FRONTEND_URL || '').split(',').map(url => url.trim())
app.use(cors({ 
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
      callback(null, true)
    } else {
      console.log(`🚫 CORS Blocked: ${origin}`)
      callback(new Error('Not allowed by CORS'))
    }
  }, 
  credentials: true 
}))
app.use(express.json())

// SPEED LOGGER: See exactly how long each request takes
app.use((req, res, next) => {
  const start = Date.now()
  res.on('finish', () => {
    const duration = Date.now() - start
    console.log(`⏱️ ${req.method} ${req.originalUrl} - ${duration}ms`)
  })
  next()
})

function createHttpError(status, message) {
  const error = new Error(message)
  error.status = status
  return error
}

function getModeConfig(mode, isPrivate = false) {
  if (isPrivate) {
    return { mode: 'private', playerLimit: 8 }
  }

  const modes = {
    duel: 2,
    trio: 3,
    quad: 4,
  }

  const playerLimit = modes[mode]
  if (!playerLimit) {
    throw createHttpError(400, 'Unsupported matchmaking mode.')
  }

  return { mode, playerLimit }
}

function generateLobbyCode() {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  return Array.from({ length: 6 }, () => alphabet[Math.floor(Math.random() * alphabet.length)]).join('')
}

// AUTH CACHE: Remembers users for 5 minutes to avoid redundant server calls
const authCache = new Map()

async function requireAuth(request, _response, next) {
  try {
    const authStart = Date.now()
    const authorization = request.headers.authorization || ''
    const token = authorization.startsWith('Bearer ') ? authorization.slice(7) : null

    if (!token) {
      throw createHttpError(401, 'Missing bearer token.')
    }

    // Check if we already verified this token recently
    const cached = authCache.get(token)
    if (cached && (Date.now() - cached.timestamp < 5 * 60 * 1000)) {
      request.user = cached.user
      console.log(`⚡ Auth CACHE HIT! Save: ${Date.now() - authStart}ms`)
      return next()
    }

    const { data, error } = await supabase.auth.getUser(token)
    console.log(`🔒 Auth verification took: ${Date.now() - authStart}ms`)

    if (error || !data.user) {
      throw createHttpError(401, 'Invalid access token.')
    }

    // Save to cache
    authCache.set(token, { user: data.user, timestamp: Date.now() })
    
    request.user = data.user
    next()
  } catch (error) {
    next(error)
  }
}

async function getRandomWord() {
  if (wordCache.size > 0) {
    const wordsArray = Array.from(wordCache)
    return wordsArray[Math.floor(Math.random() * wordsArray.length)]
  }

  const words = await getWords();
  if (!words.length) return 'alert'
  return words[Math.floor(Math.random() * words.length)]
}

async function getProfile(userId) {
  const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single()
  if (error) {
    throw createHttpError(500, error.message)
  }

  return data
}

async function updateProfile(userId, values) {
  const { error } = await supabase.from('profiles').update(values).eq('id', userId)
  if (error) {
    throw createHttpError(500, error.message)
  }
}

function buildMultiplayerProfilePatch(profile, isWin, attemptsUsed) {
  const currentRating = profile.multiplayer_elo || 0
  const totalMatches = (profile.total_matches || 0) + 1
  const wins = isWin ? (profile.wins || 0) + 1 : (profile.wins || 0)
  const currentWinStreak = isWin ? (profile.current_win_streak || 0) + 1 : 0
  const maxWinStreak = Math.max(currentWinStreak, profile.max_win_streak || 0)

  let change = 0
  if (isWin) {
    const kFactor = currentRating < 1000 ? 50 : 25
    const multipliers = [2.0, 1.5, 1.2, 1.0, 0.8, 0.6]
    const multiplier = multipliers[Math.max(0, attemptsUsed - 1)] || 0.5
    change = Math.max(5, Math.floor(kFactor * multiplier))
  } else {
    change = -(15 + Math.floor(currentRating / 200))
  }

  return {
    total_matches: totalMatches,
    wins,
    win_rate: totalMatches > 0 ? (wins / totalMatches) * 100 : 0,
    current_win_streak: currentWinStreak,
    max_win_streak: maxWinStreak,
    multiplayer_elo: Math.max(0, currentRating + change),
    updated_at: new Date().toISOString(),
    _ratingChange: change,
  }
}

async function settleParticipantOutcome(participant, isWin, attemptsUsed) {
  if (participant.finished_at) {
    return
  }

  const profile = await getProfile(participant.user_id)
  const profilePatch = buildMultiplayerProfilePatch(profile, isWin, attemptsUsed)

  await updateProfile(participant.user_id, {
    total_matches: profilePatch.total_matches,
    wins: profilePatch.wins,
    win_rate: profilePatch.win_rate,
    current_win_streak: profilePatch.current_win_streak,
    max_win_streak: profilePatch.max_win_streak,
    multiplayer_elo: profilePatch.multiplayer_elo,
    updated_at: profilePatch.updated_at,
  })

  const participantPatch = {
    finished_at: new Date().toISOString(),
    score: profilePatch._ratingChange,
  }

  const { error } = await supabase.from('game_participants').update(participantPatch).eq('id', participant.id)
  if (error) {
    throw createHttpError(500, error.message)
  }
}

async function getGameForUser(gameId, userId) {
  const { data: participant, error: participantError } = await supabase
    .from('game_participants')
    .select('id')
    .eq('game_id', gameId)
    .eq('user_id', userId)
    .maybeSingle()

  if (participantError) {
    throw createHttpError(500, participantError.message)
  }

  const { data: game, error: gameError } = await supabase
    .from('games')
    .select('id, status, mode, player_limit, created_at, started_at, finished_at, host_id, lobby_code, is_private')
    .eq('id', gameId)
    .maybeSingle()

  if (gameError) {
    throw createHttpError(500, gameError.message)
  }

  if (!game) {
    throw createHttpError(404, 'Game not found.')
  }

  const canAccess = Boolean(participant) || game.host_id === userId
  if (!canAccess) {
    throw createHttpError(403, 'You do not have access to this game.')
  }

  return game
}

async function getParticipants(gameId) {
  const { data, error } = await supabase
    .from('game_participants')
    .select('id, game_id, user_id, guesses, score, finished_at, created_at, profiles(username, avatar_url)')
    .eq('game_id', gameId)
    .order('created_at', { ascending: true })

  if (error) {
    throw createHttpError(500, error.message)
  }

  return data ?? []
}

async function getParticipantCount(gameId) {
  const { count, error } = await supabase
    .from('game_participants')
    .select('*', { count: 'exact', head: true })
    .eq('game_id', gameId)

  if (error) {
    throw createHttpError(500, error.message)
  }

  return count ?? 0
}

async function findActivePublicGameForUser(userId, mode) {
  const { data, error } = await supabase
    .from('game_participants')
    .select('game_id, games!inner(id, status, mode, is_private)')
    .eq('user_id', userId)
    .eq('games.mode', mode)
    .eq('games.is_private', false)
    .in('games.status', ['PENDING', 'IN_PROGRESS'])
    .limit(1)
    .maybeSingle()

  if (error) {
    throw createHttpError(500, error.message)
  }

  return data?.games ?? null
}

async function createPrivateLobbyGame({ userId, playerLimit, mode, word }) {
  for (let attempt = 0; attempt < 5; attempt += 1) {
    const lobbyCode = generateLobbyCode()
    const { data, error } = await supabase
      .from('games')
      .insert({
        word,
        status: 'PENDING',
        mode,
        player_limit: playerLimit,
        is_private: true,
        host_id: userId,
        lobby_code: lobbyCode,
      })
      .select('id, lobby_code')
      .single()

    if (!error) {
      return data
    }

    if (error.code !== '23505') {
      throw createHttpError(500, error.message)
    }
  }

  throw createHttpError(500, 'Failed to generate a unique lobby code.')
}

app.get('/health', (_request, response) => {
  response.json({ ok: true })
})

// PUBLIC: Get profile by username
app.get('/api/profiles/:username', async (request, response, next) => {
  try {
    const { username } = request.params
    const { data, error } = await supabase
      .from('profiles')
      .select('username, avatar_url, multiplayer_elo, single_player_elo, tier, wins, total_matches, current_win_streak, max_win_streak, guess_distribution, created_at')
      .eq('username', username)
      .single()

    if (error || !data) {
      throw createHttpError(404, 'User not found.')
    }

    response.json({ profile: data })
  } catch (error) {
    next(error)
  }
})

app.use('/api', requireAuth)

app.get('/api/games/:gameId', async (request, response, next) => {
  try {
    const game = await getGameForUser(request.params.gameId, request.user.id)
    response.json({ game })
  } catch (error) {
    next(error)
  }
})

app.get('/api/games/:gameId/participants', async (request, response, next) => {
  try {
    await getGameForUser(request.params.gameId, request.user.id)
    const participants = await getParticipants(request.params.gameId)
    response.json({ participants })
  } catch (error) {
    next(error)
  }
})

app.get('/api/leaderboard', async (request, response, next) => {
  try {
    const mode = request.query.mode === 'multiplayer' ? 'multiplayer_elo' : 'single_player_elo'
    const { data, error } = await supabase.from('profiles').select('*').order(mode, { ascending: false }).limit(30)

    if (error) {
      throw createHttpError(500, error.message)
    }

    response.json({ players: data ?? [] })
  } catch (error) {
    next(error)
  }
})

// SUPER ENDPOINT: Get everything for the initial load in ONE trip
app.get('/api/init-app', async (request, response, next) => {
  try {
    const userId = request.user.id
    console.log(`🔍 Starting initialization for user: ${userId}`)
    
    // 1. Try to get the profile
    let { data: profile, error } = await supabase.from('profiles').select('*').eq('id', userId).single()

    // 2. If profile doesn't exist (new user!), create it now!
    if (error && error.code === 'PGRST116') {
      console.log(`🆕 New operative detected! Creating profile for: ${userId}`)
      const newProfile = {
        id: userId,
        username: request.user.user_metadata?.username || request.user.email.split('@')[0].toLowerCase(),
        multiplayer_elo: 0,
        single_player_elo: 0,
        tier: 'Bronze',
        wins: 0,
        total_matches: 0,
        avatar_url: `https://ui-avatars.com/api/?name=${request.user.email}&background=random`
      }
      
      const { data: created, error: createError } = await supabase
        .from('profiles')
        .insert(newProfile)
        .select()
        .single()
      
      if (createError) throw createError
      profile = created
    } else if (error) {
      throw error
    }

    // 3. Fetch the rest of the app data in parallel
    const [leaderboard, activeGames] = await Promise.all([
      supabase.from('profiles').select('id, username, avatar_url, multiplayer_elo').order('multiplayer_elo', { ascending: false }).limit(10),
      supabase.from('game_participants').select('id, game_id, games(status, mode)').eq('user_id', userId)
    ])

    response.json({
      profile: profile,
      leaderboard: leaderboard.data ?? [],
      activeGames: activeGames.data ?? []
    })
  } catch (error) {
    next(error)
  }
})

app.post('/api/matchmaking/join', async (request, response, next) => {
  try {
    const { mode } = request.body
    const { playerLimit } = getModeConfig(mode)
    const userId = request.user.id

    const activeGame = await findActivePublicGameForUser(userId, mode)

    if (activeGame?.id) {
      return response.json({ gameId: activeGame.id, status: activeGame.status })
    }

    const { data: pendingGames, error: pendingError } = await supabase
      .from('games')
      .select('id, status, player_limit')
      .eq('status', 'PENDING')
      .eq('mode', mode)
      .eq('is_private', false)
      .order('created_at', { ascending: true })
      .limit(10)

    if (pendingError) {
      throw createHttpError(500, pendingError.message)
    }

    let targetGame = null
    for (const game of pendingGames ?? []) {
      const count = await getParticipantCount(game.id)

      if (count < game.player_limit) {
        targetGame = game
        break
      }
    }

    if (!targetGame) {
      const word = await getRandomWord()
      const { data: createdGame, error: createError } = await supabase
        .from('games')
        .insert({
          word,
          status: 'PENDING',
          mode,
          player_limit: playerLimit,
          is_private: false,
        })
        .select('id, status')
        .single()

      if (createError) {
        throw createHttpError(500, createError.message)
      }

      targetGame = createdGame
    }

    const { error: joinError } = await supabase.from('game_participants').upsert({
      game_id: targetGame.id,
      user_id: userId,
    }, { onConflict: 'game_id,user_id' })

    if (joinError) {
      throw createHttpError(500, joinError.message)
    }

    const participantCount = await getParticipantCount(targetGame.id)
    let status = targetGame.status
    if (participantCount >= playerLimit) {
      status = 'IN_PROGRESS'
      const { error: startError } = await supabase
        .from('games')
        .update({ status, started_at: new Date().toISOString() })
        .eq('id', targetGame.id)

      if (startError) {
        throw createHttpError(500, startError.message)
      }
    }

    response.json({ gameId: targetGame.id, status })
  } catch (error) {
    next(error)
  }
})

app.post('/api/lobbies/private', async (request, response, next) => {
  try {
    const userId = request.user.id
    const { playerLimit, mode } = getModeConfig('private', true)
    const word = await getRandomWord()
    const game = await createPrivateLobbyGame({ userId, playerLimit, mode, word })

    const { error: participantError } = await supabase.from('game_participants').insert({
      game_id: game.id,
      user_id: userId,
    })

    if (participantError) {
      throw createHttpError(500, participantError.message)
    }

    response.status(201).json({ gameId: game.id, lobbyCode: game.lobby_code })
  } catch (error) {
    next(error)
  }
})

app.post('/api/lobbies/private/join', async (request, response, next) => {
  try {
    const userId = request.user.id
    const code = String(request.body.code || '').trim().toUpperCase()

    if (!/^[A-Z0-9]{6}$/.test(code)) {
      throw createHttpError(400, 'Lobby code must be 6 characters.')
    }

    const { data: game, error: gameError } = await supabase
      .from('games')
      .select('id, status, player_limit')
      .eq('lobby_code', code)
      .eq('is_private', true)
      .maybeSingle()

    if (gameError) {
      throw createHttpError(500, gameError.message)
    }

    if (!game || game.status !== 'PENDING') {
      throw createHttpError(404, 'Private lobby not found or no longer joinable.')
    }

    const [{ data: existingParticipant, error: existingParticipantError }, participantCount] = await Promise.all([
      supabase
        .from('game_participants')
        .select('id')
        .eq('game_id', game.id)
        .eq('user_id', userId)
        .maybeSingle(),
      getParticipantCount(game.id),
    ])

    if (existingParticipantError) {
      throw createHttpError(500, existingParticipantError.message)
    }

    const alreadyJoined = Boolean(existingParticipant)
    if (!alreadyJoined && participantCount >= game.player_limit) {
      throw createHttpError(409, 'This lobby is already full.')
    }

    if (!alreadyJoined) {
      const { error: joinError } = await supabase.from('game_participants').insert({
        game_id: game.id,
        user_id: userId,
      })

      if (joinError) {
        throw createHttpError(500, joinError.message)
      }
    }

    response.json({ gameId: game.id })
  } catch (error) {
    next(error)
  }
})

app.post('/api/games/:gameId/start', async (request, response, next) => {
  try {
    const game = await getGameForUser(request.params.gameId, request.user.id)
    if (!game.is_private) {
      throw createHttpError(400, 'Only private lobbies can be started manually.')
    }

    if (game.host_id !== request.user.id) {
      throw createHttpError(403, 'Only the host can start this lobby.')
    }

    const participantCount = await getParticipantCount(game.id)
    if (participantCount < 2) {
      throw createHttpError(400, 'At least two players are required to start.')
    }

    const word = await getRandomWord()
    const { error } = await supabase
      .from('games')
      .update({
        status: 'IN_PROGRESS',
        word,
        started_at: new Date().toISOString(),
      })
      .eq('id', game.id)

    if (error) {
      throw createHttpError(500, error.message)
    }

    response.json({ gameId: game.id, status: 'IN_PROGRESS' })
  } catch (error) {
    next(error)
  }
})

app.post('/api/games/:gameId/guess', async (request, response, next) => {
  try {
    const guess = String(request.body.guess || '').toLowerCase()
    if (!isValidGuess(guess)) {
      throw createHttpError(400, 'Guess must be exactly 5 letters.')
    }

    const { gameId } = request.params
    const userId = request.user.id

    // OPTIMIZATION: Check Game and Participant in parallel
    const [gameResult, participantResult] = await Promise.all([
      supabase.from('games').select('id, word, status, finished_at').eq('id', gameId).single(),
      supabase.from('game_participants').select('*').eq('game_id', gameId).eq('user_id', userId).single()
    ])

    const { data: game, error: gameError } = gameResult
    const { data: participant, error: participantError } = participantResult

    if (gameError) throw createHttpError(500, gameError.message)
    if (participantError || !participant) throw createHttpError(403, 'You are not part of this game.')
    if (game.status !== 'IN_PROGRESS') throw createHttpError(409, 'This game is not in progress.')
    if (participant.finished_at) throw createHttpError(409, 'Your match is already complete.')

    // INSTANT CHECK: Use the memory cache instead of a SQL query
    if (!wordCache.has(guess)) {
      throw createHttpError(400, 'Guess is not in the word list.')
    }

    const attempts = Array.isArray(participant.guesses) ? participant.guesses : []
    if (attempts.length >= 6) {
      throw createHttpError(409, 'No guesses remaining.')
    }

    const result = evaluateGuess(game.word, guess)
    const updatedGuesses = [...attempts, { guess, result }]
    const isWin = guess === game.word.toLowerCase()
    const isLoss = !isWin && updatedGuesses.length >= 6
    const participantStatus = isWin ? 'won' : isLoss ? 'lost' : 'playing'

    const { error: updateGuessError } = await supabase
      .from('game_participants')
      .update({ guesses: updatedGuesses })
      .eq('id', participant.id)

    if (updateGuessError) {
      throw createHttpError(500, updateGuessError.message)
    }

    const refreshedParticipant = { ...participant, guesses: updatedGuesses }

    if (isWin || isLoss) {
      await settleParticipantOutcome(refreshedParticipant, isWin, updatedGuesses.length)
    }

    let gameStatus = game.status
    if (isWin) {
      const everyone = await getParticipants(gameId)
      for (const otherParticipant of everyone) {
        if (otherParticipant.user_id !== userId) {
          await settleParticipantOutcome(otherParticipant, false, 6)
        }
      }

      gameStatus = 'FINISHED'
      const { error: finishError } = await supabase
        .from('games')
        .update({ status: gameStatus, finished_at: new Date().toISOString() })
        .eq('id', gameId)

      if (finishError) {
        throw createHttpError(500, finishError.message)
      }
    } else if (isLoss) {
      const everyone = await getParticipants(gameId)
      const allFinished = everyone.every((entry) => entry.finished_at || entry.user_id === userId)
      if (allFinished) {
        gameStatus = 'FINISHED'
        const { error: finishError } = await supabase
          .from('games')
          .update({ status: gameStatus, finished_at: new Date().toISOString() })
          .eq('id', gameId)

        if (finishError) {
          throw createHttpError(500, finishError.message)
        }
      }
    }

    response.json({
      result,
      guess,
      attemptNumber: updatedGuesses.length,
      participantStatus,
      gameStatus,
      answer: isWin || isLoss ? game.word.toUpperCase() : null,
    })
  } catch (error) {
    next(error)
  }
})

app.use((error, _request, response, _next) => {
  const status = error.status || 500
  response.status(status).json({ error: error.message || 'Internal server error.' })
})

async function startServer() {
  try {
    await refreshWordCache()
  } catch (error) {
    console.error('Failed to warm word cache on boot:', error.message)
  }

  app.listen(PORT, () => {
    console.log(`CompWordle backend listening on port ${PORT}`)
  })
}

startServer()
