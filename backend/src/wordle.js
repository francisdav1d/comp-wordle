export function evaluateGuess(answer, guess) {
  const normalizedAnswer = answer.toLowerCase()
  const normalizedGuess = guess.toLowerCase()
  const result = Array.from({ length: 5 }, () => 'absent')
  const remaining = normalizedAnswer.split('')

  for (let index = 0; index < normalizedGuess.length; index += 1) {
    if (normalizedGuess[index] === normalizedAnswer[index]) {
      result[index] = 'correct'
      remaining[index] = null
    }
  }

  for (let index = 0; index < normalizedGuess.length; index += 1) {
    if (result[index] === 'correct') {
      continue
    }

    const matchIndex = remaining.indexOf(normalizedGuess[index])
    if (matchIndex !== -1) {
      result[index] = 'present'
      remaining[matchIndex] = null
    }
  }

  return result
}

export function isValidGuess(value) {
  return typeof value === 'string' && /^[a-zA-Z]{5}$/.test(value)
}
