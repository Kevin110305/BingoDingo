import { useState, useEffect } from 'react'
import BingoCard from './components/BingoCard'
import { useSocket } from './hooks/useSocket'

export default function App() {
  const { isConnected } = useSocket()
  const [playerName, setPlayerName] = useState('')
  const [isRegistered, setIsRegistered] = useState(false)
  const [drawnNumbers, setDrawnNumbers] = useState([])

  useEffect(() => {
    let intervalId;
    if (isRegistered) {
      const generateNumber = () => {
        setDrawnNumbers((prev) => {
          if (prev.length >= 100) return prev;

          let newNum;
          do {
            newNum = Math.floor(Math.random() * 100);
          } while (prev.includes(newNum));

          return [newNum, ...prev];
        });
      };

      generateNumber();
      intervalId = setInterval(generateNumber, 10000);
    }
    return () => clearInterval(intervalId);
  }, [isRegistered]);

  const currentNumber = drawnNumbers.length > 0 ? drawnNumbers[0] : null;
  const pastNumbers = drawnNumbers.length > 1 ? drawnNumbers.slice(1) : [];
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
            <div className="mb-4 flex justify-between items-center px-2">
              <span className="inline-block px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-white/80 font-medium text-sm">
                Jugador: <span className="text-bingo-accent font-bold">{playerName}</span>
              </span>
            </div>

            <div className="flex flex-col items-center mb-8">
              <p className="text-white/50 text-sm tracking-widest uppercase mb-3 font-semibold">
                Número Obtenido
              </p>
              <div
                key={currentNumber}
                className="w-24 h-24 rounded-full bg-gradient-to-br from-bingo-card to-bingo-dark border-[3px] border-bingo-accent/80 flex flex-col items-center justify-center shadow-[0_0_25px_rgba(245,158,11,0.3)] animate-in zoom-in spin-in-1 duration-500"
              >
                <span className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-white/70" style={{ fontFamily: 'Outfit, sans-serif' }}>
                  {currentNumber !== null ? currentNumber : '--'}
                </span>
              </div>
            </div>

            {pastNumbers.length > 0 && (
              <div className="w-full mb-8 max-w-[90%] mx-auto">
                <p className="text-white/40 text-xs tracking-widest uppercase mb-3 font-semibold text-center">
                  Anteriores
                </p>
                <div className="flex flex-row overflow-x-auto gap-3 py-2 px-1 snap-x scroll-smooth" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                  {pastNumbers.map((num, idx) => (
                    <div
                      key={idx}
                      className="min-w-[44px] h-11 rounded-full bg-bingo-cell border border-white/5 flex items-center justify-center shadow-lg shrink-0 snap-center animate-in fade-in zoom-in duration-300"
                    >
                      <span className="text-white/70 font-semibold text-sm">{num}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <BingoCard />
          </div>
        )}
      </main>
    </div>
  )
}
