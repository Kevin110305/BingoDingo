import Cell from './Cell'

export default function BingoCard({ carton, drawnNumbers }) {
  if (!carton) {
    return null
  }

  return (
    <div className="bg-bingo-card/80 backdrop-blur-md rounded-2xl p-4 sm:p-6 shadow-2xl border border-white/5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-white/70 tracking-wide uppercase">
          Tu Cartón
        </h2>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
            <span
              key={n}
              className="w-12 sm:w-14 text-center text-xs text-bingo-accent font-bold opacity-60"
            >
              {n * 10 - 9}-{n === 9 ? 90 : n * 10}
            </span>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        {carton.map((row, rowIndex) => (
          <div key={rowIndex} className="flex gap-2 justify-center">
            {row.map((number, colIndex) => (
              <Cell
                key={`${rowIndex}-${colIndex}`}
                number={number}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
