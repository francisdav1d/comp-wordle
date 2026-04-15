import { supabase } from './supabase'

const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000'

async function getAuthHeaders() {
  const { data } = await supabase.auth.getSession()
  const token = data.session?.access_token

  if (!token) {
    throw new Error('No active session found.')
  }

  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  }
}

async function request(path, options = {}) {
  const headers = await getAuthHeaders()
  const response = await fetch(`${apiBaseUrl}${path}`, {
    ...options,
    headers: {
      ...headers,
      ...(options.headers || {}),
    },
  })

  const payload = await response.json().catch(() => ({}))
  if (!response.ok) {
    throw new Error(payload.error || 'Request failed.')
  }

  return payload
}

export function joinMatchmaking(mode) {
  return request('/api/matchmaking/join', {
    method: 'POST',
    body: JSON.stringify({ mode }),
  })
}

export function createPrivateLobby() {
  return request('/api/lobbies/private', {
    method: 'POST',
  })
}

export function joinPrivateLobby(code) {
  return request('/api/lobbies/private/join', {
    method: 'POST',
    body: JSON.stringify({ code }),
  })
}

export function startGame(gameId) {
  return request(`/api/games/${gameId}/start`, {
    method: 'POST',
  })
}

export function submitGuess(gameId, guess) {
  return request(`/api/games/${gameId}/guess`, {
    method: 'POST',
    body: JSON.stringify({ guess }),
  })
}

export function getGame(gameId) {
  return request(`/api/games/${gameId}`)
}

export function getGameParticipants(gameId) {
  return request(`/api/games/${gameId}/participants`)
}

export function getLeaderboard(mode) {
  return request(`/api/leaderboard?mode=${mode}`)
}

export function initApp() {
  return request('/api/init-app')
}
