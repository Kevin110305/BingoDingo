import { useState } from 'react'
import BingoCard from './components/BingoCard'
import { useSocket } from './hooks/useSocket'

export default function App() {
  const { isConnected } = useSocket()
  const [playerName, setPlayerName] = useState('')
  const [isRegistered, setIsRegistered] = useState(false)

  const handleJoin = (e) => {
    e.preventDefault();
    if (playerName.trim() !== '') {
      setIsRegistered(true);
    }
  };

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
          className={`w-2.5 h-2.5 rounded-full ${isConnected
              ? 'bg-bingo-green shadow-[0_0_8px_var(--color-bingo-green)]'
              : 'bg-bingo-red shadow-[0_0_8px_var(--color-bingo-red)] animate-pulse'
            }`}
        />
        <span className="text-sm text-white/60">
          {isConnected ? 'Conectado al servidor' : 'Desconectado'}
        </span>
      </div>

      <main className="w-full max-w-2xl flex flex-col flex-1 items-center justify-center">
        {!isRegistered ? (
          <div className="w-full max-w-sm bg-bingo-card/80 backdrop-blur-md rounded-2xl p-6 md:p-8 shadow-2xl border border-white/5 transform transition-all">
            <h2 className="text-2xl font-bold text-center text-white mb-6" style={{ fontFamily: 'Outfit, sans-serif' }}>
              Únete a la partida
            </h2>
            <form onSubmit={handleJoin} className="flex flex-col gap-4">
              <div>
                <label htmlFor="playerName" className="block text-sm font-medium text-white/70 mb-1">
                  Tu Nombre
                </label>
                <input
                  type="text"
                  id="playerName"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  placeholder="Ej: Jugador123"
                  className="w-full px-4 py-3 rounded-lg bg-bingo-cell text-white border border-white/10 focus:outline-none focus:ring-2 focus:ring-bingo-accent focus:border-transparent placeholder-white/30 transition-all font-medium"
                  required
                  autoComplete="off"
                />
              </div>
              <button
                type="submit"
                disabled={!playerName.trim()}
                className="mt-2 w-full bg-gradient-to-r from-bingo-accent to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white font-bold py-3 px-4 rounded-lg shadow-[0_0_15px_rgba(245,158,11,0.4)] hover:shadow-[0_0_25px_rgba(245,158,11,0.6)] transform hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:hover:shadow-[0_0_15px_rgba(245,158,11,0.4)]"
              >
                JUGAR
              </button>
            </form>
          </div>
        ) : (
          <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="mb-4 text-center">
              <span className="inline-block px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-white/80 font-medium text-sm">
                Jugador: <span className="text-bingo-accent font-bold">{playerName}</span>
              </span>
            </div>
            <BingoCard />
          </div>
        )}
      </main>
    </div>
  )
}
