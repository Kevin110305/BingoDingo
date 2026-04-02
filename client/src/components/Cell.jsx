import { useState } from 'react'

export default function Cell({ number }) {
  const [isMarked, setIsMarked] = useState(false)

  if (number === null) {
    return (
      <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg bg-bingo-empty" />
    )
  }

  return (
    <button
      onClick={() => setIsMarked(!isMarked)}
      className={`
        w-12 h-12 sm:w-14 sm:h-14 rounded-lg font-bold text-lg
        transition-all duration-200 ease-out cursor-pointer
        flex items-center justify-center select-none
        ${
          isMarked
            ? 'bg-bingo-marked text-white shadow-[0_0_15px_var(--color-bingo-marked-glow)] scale-95'
            : 'bg-bingo-cell text-white/80 hover:bg-bingo-cell-hover hover:scale-105'
        }
      `}
    >
      {number}
    </button>
  )
}
