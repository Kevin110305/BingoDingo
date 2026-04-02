import BingoCard from './components/BingoCard'
import { useSocket } from './hooks/useSocket'

export default function App() {
  const { isConnected } = useSocket()

  return (
    <div className="min-h-screen bg-gradient-to-br from-bingo-dark via-[#1a1145] to-bingo-dark flex flex-col items-center px-4 py-8">
      <header className="text-center mb-10">
        <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-bingo-accent via-amber-300 to-orange-500 bg-clip-text text-transparent drop-shadow-lg"
            style={{ fontFamily: 'Outfit, sans-serif' }}>
          BingoDingo
        </h1>
        <p className="mt-3 text-white/50 text-sm tracking-widest uppercase">
          El bingo más divertido
        </p>
      </header>

      <div className="mb-6 flex items-center gap-2">
        <span
          className={`w-2.5 h-2.5 rounded-full ${
            isConnected
              ? 'bg-bingo-green shadow-[0_0_8px_var(--color-bingo-green)]'
              : 'bg-bingo-red shadow-[0_0_8px_var(--color-bingo-red)] animate-pulse'
          }`}
        />
        <span className="text-sm text-white/60">
          {isConnected ? 'Conectado al servidor' : 'Desconectado'}
        </span>
      </div>

      <main className="w-full max-w-2xl">
        <BingoCard />
      </main>
    </div>
  )
}
