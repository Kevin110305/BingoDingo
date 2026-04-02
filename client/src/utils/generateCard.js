function getRandomNumbers(min, max, count) {
  const pool = []
  for (let i = min; i <= max; i++) {
    pool.push(i)
  }

  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[pool[i], pool[j]] = [pool[j], pool[i]]
  }

  return pool.slice(0, count).sort((a, b) => a - b)
}

export function generateCard() {
  const card = Array.from({ length: 3 }, () => Array(9).fill(null))

  const columnRanges = [
    [1, 9],
    [10, 19],
    [20, 29],
    [30, 39],
    [40, 49],
    [50, 59],
    [60, 69],
    [70, 79],
    [80, 90],
  ]

  const numbersPerColumn = columnRanges.map(([min, max]) =>
    getRandomNumbers(min, max, 3)
  )

  for (let col = 0; col < 9; col++) {
    for (let row = 0; row < 3; row++) {
      card[row][col] = numbersPerColumn[col][row]
    }
  }

  for (let row = 0; row < 3; row++) {
    const filledPositions = Array.from({ length: 9 }, (_, i) => i)

    for (let i = filledPositions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[filledPositions[i], filledPositions[j]] = [filledPositions[j], filledPositions[i]]
    }

    const toRemove = filledPositions.slice(0, 4)
    for (const col of toRemove) {
      card[row][col] = null
    }
  }

  return card
}
