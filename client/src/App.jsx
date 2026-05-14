import { useState, useEffect, useCallback } from 'react'
import BingoCard from './components/BingoCard'
import PremioAlert from './components/PremioAlert'
import Chat from './components/Chat'
import LoginPage from './components/LoginPage'
import SalaEspera from './components/SalaEspera'
import MenuInicio from './components/MenuInicio'
import { useSocket } from './hooks/useSocket'

const PANTALLAS = { LOGIN: 'login', INICIO: 'inicio', ESPERA: 'espera', JUGANDO: 'jugando' }

export default function App() {
  const {
    isConnected,
    jugadoresEnSala,
    mensajesSala,
    cuentaAtras,
    unirseASala,
    enviarMensajeSala,
    drawnNumbers,
    carton,
    estadoPartida,
    premioResult,
    lineaCantada,
    verificandoPremio,
    gameKey,
    mensajesChat,
    cantarLinea,
    cantarBingo,
    cantarReinicio,
    marcarNumero,
    enviarMensaje,
    clearPremioResult,
    nuevoSaldo,
  } = useSocket()

  const [pantalla, setPantalla] = useState(PANTALLAS.LOGIN)
  const [playerName, setPlayerName] = useState('')
  const [playerSaldo, setPlayerSaldo] = useState(0)
  const [hasCantado, setHasCantado] = useState(false)

  useEffect(() => {
    if (nuevoSaldo !== null) {
      setPlayerSaldo(nuevoSaldo)
      try {
        localStorage.setItem('bingo_saldo', nuevoSaldo)
      } catch (e) {
        console.error('Error al guardar saldo:', e)
      }
    }
  }, [nuevoSaldo])


  useEffect(() => {
    const nombreGuardado = localStorage.getItem('bingo_nombre')
    const saldoGuardado = localStorage.getItem('bingo_saldo')
    if (nombreGuardado) {
      setPlayerName(nombreGuardado)
      if (saldoGuardado) setPlayerSaldo(Number(saldoGuardado))
      setPantalla(PANTALLAS.INICIO)
    }
  }, [])

  useEffect(() => {
    if (estadoPartida === 'jugando' || estadoPartida === 'pausada') {
      if (pantalla === PANTALLAS.ESPERA) {
        setPantalla(PANTALLAS.JUGANDO)
      }
    }
    if (estadoPartida === 'esperando' && pantalla === PANTALLAS.JUGANDO) {
      setPantalla(PANTALLAS.ESPERA)
    }
  }, [estadoPartida, pantalla])

  function handleLoginOk(nombre, saldo) {
    setPlayerName(nombre)
    setPlayerSaldo(saldo)
    setPantalla(PANTALLAS.INICIO)
  }

  function handleStartPlay() {
    setPantalla(PANTALLAS.ESPERA)
    unirseASala(playerName)
  }

  function handleCerrarSesion() {
    localStorage.removeItem('bingo_nombre')
    localStorage.removeItem('bingo_saldo')
    setPantalla(PANTALLAS.LOGIN)
    setPlayerName('')
    setPlayerSaldo(0)
  }

  const handleCantarLinea = () => {
    cantarLinea()
    setHasCantado(true)
  }

  const handleCantarBingo = () => {
    cantarBingo()
    setHasCantado(true)
  }

  useEffect(() => {
    if (premioResult && !premioResult.valido) {
      setHasCantado(false)
    } else if (!premioResult) {
      setHasCantado(false)
    }
  }, [premioResult])

  const handleDismissInvalido = useCallback(() => {
    setHasCantado(false)
    clearPremioResult()
  }, [clearPremioResult])

  const currentNumber = drawnNumbers.length > 0 ? drawnNumbers[0] : null
  const pastNumbers = drawnNumbers.length > 1 ? drawnNumbers.slice(1) : []
  const lineaDeshabilitada = lineaCantada || estadoPartida !== 'jugando' || hasCantado
  const bingoDeshabilitado = estadoPartida !== 'jugando' || hasCantado


  if (pantalla === PANTALLAS.LOGIN) {
    return <LoginPage onLoginOk={handleLoginOk} />
  }

  if (pantalla === PANTALLAS.INICIO) {
    return (
      <MenuInicio
        playerName={playerName}
        playerSaldo={playerSaldo}
        onPlay={handleStartPlay}
        onLogout={handleCerrarSesion}
      />
    )
  }

  if (pantalla === PANTALLAS.ESPERA) {
    return (
      <SalaEspera
        nombreJugador={playerName}
        jugadores={jugadoresEnSala}
        mensajes={mensajesSala}
        cuentaAtras={cuentaAtras}
        onEnviarMensaje={enviarMensajeSala}
      />
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-bingo-dark via-[#1a1145] to-bingo-dark flex flex-col px-4 py-8">
      { }
      <header className="text-center mb-8 shrink-0">
        <h1
          className="text-5xl sm:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-bingo-accent via-amber-300 to-orange-500 bg-clip-text text-transparent drop-shadow-lg"
          style={{ fontFamily: 'Outfit, sans-serif' }}
        >
          BingoDingo
        </h1>
        <p className="mt-3 text-white/50 text-sm tracking-widest uppercase">
          El bingo más divertido
        </p>

        <div className="mt-4 flex items-center justify-center gap-4">
          <div className="flex items-center gap-2">
            <span
              className={`w-2.5 h-2.5 rounded-full ${isConnected
                ? 'bg-bingo-green shadow-[0_0_8px_var(--color-bingo-green)]'
                : 'bg-bingo-red shadow-[0_0_8px_var(--color-bingo-red)] animate-pulse'
                }`}
            />
            <span className="text-sm text-white/60">
              {isConnected ? 'Conectado' : 'Desconectado'}
            </span>
          </div>
          <button
            onClick={handleCerrarSesion}
            className="text-xs text-white/30 hover:text-white/60 transition-colors border border-white/10 hover:border-white/20 rounded-lg px-2.5 py-1"
          >
            Salir
          </button>
        </div>
      </header>

      { }
      <main className="flex flex-1 gap-6 items-start w-full max-w-7xl mx-auto">
        { }
        <div className="flex-1 min-w-0 flex flex-col items-center animate-in fade-in slide-in-from-bottom-4 duration-500">
          <PremioAlert
            verificandoPremio={verificandoPremio}
            premioResult={premioResult}
            onDismissInvalido={handleDismissInvalido}
          />

          <div className="w-full max-w-2xl">
            <div className="mb-4 flex justify-between items-center px-2">
              <span className="inline-block px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-white/80 font-medium text-sm">
                Jugador: <span className="text-bingo-accent font-bold">{playerName}</span>
              </span>
            </div>

            { }
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

            { }
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

            { }
            <div className="flex gap-4 mb-6 w-full">
              <button
                onClick={handleCantarLinea}
                disabled={lineaDeshabilitada}
                className="flex-1 bg-gradient-to-r from-bingo-marked to-purple-600 hover:from-purple-500 hover:to-purple-400 text-white font-bold py-3 px-4 rounded-lg shadow-[0_0_15px_rgba(124,58,237,0.4)] hover:shadow-[0_0_25px_rgba(124,58,237,0.6)] transform hover:-translate-y-0.5 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:hover:shadow-[0_0_15px_rgba(124,58,237,0.4)]"
              >
                CANTAR LÍNEA
              </button>
              <button
                onClick={handleCantarBingo}
                disabled={bingoDeshabilitado}
                className="flex-1 bg-gradient-to-r from-bingo-accent to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white font-bold py-3 px-4 rounded-lg shadow-[0_0_15px_rgba(245,158,11,0.4)] hover:shadow-[0_0_25px_rgba(245,158,11,0.6)] transform hover:-translate-y-0.5 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:hover:shadow-[0_0_15px_rgba(245,158,11,0.4)]"
              >
                CANTAR BINGO
              </button>
            </div>

            {estadoPartida === 'finalizada' && (
              <button
                onClick={cantarReinicio}
                className="w-full mb-6 bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-bold py-3 px-4 rounded-lg shadow-[0_0_15px_rgba(99,102,241,0.4)] hover:shadow-[0_0_25px_rgba(99,102,241,0.6)] transform hover:-translate-y-0.5 transition-all cursor-pointer"
              >
                🔄 NUEVA PARTIDA
              </button>
            )}

            <BingoCard key={gameKey} carton={carton} drawnNumbers={drawnNumbers} onMarcarNumero={marcarNumero} />
          </div>
        </div>

        { }
        <aside className="w-72 xl:w-80 shrink-0 sticky top-8 h-[calc(100vh-8rem)] animate-in fade-in slide-in-from-right-4 duration-500">
          <Chat
            mensajes={mensajesChat}
            onEnviarMensaje={enviarMensaje}
            nombreJugador={playerName}
          />
        </aside>
      </main>
    </div>
  )
}
