import { useState, useEffect, useRef } from 'react'
import Chat from './Chat'

export default function SalaEspera({ nombreJugador, jugadores, mensajes, cuentaAtras, onEnviarMensaje }) {
  const necesarios = 2
  const faltan = Math.max(0, necesarios - jugadores.length)
  const listoParaEmpezar = cuentaAtras !== null

  const [animKey, setAnimKey] = useState(cuentaAtras)
  useEffect(() => {
    setAnimKey(cuentaAtras)
  }, [cuentaAtras])

  return (
    <div className="min-h-screen bg-gradient-to-br from-bingo-dark via-[#1a1145] to-bingo-dark flex flex-col px-4 py-8">
      { }
      <header className="text-center mb-10 shrink-0">
        <h1
          className="text-5xl sm:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-bingo-accent via-amber-300 to-orange-500 bg-clip-text text-transparent drop-shadow-lg"
          style={{ fontFamily: 'Outfit, sans-serif' }}
        >
          BingoDingo
        </h1>
        <p className="mt-2 text-white/40 text-sm tracking-widest uppercase">Sala de espera</p>
      </header>

      <main className="flex flex-1 gap-6 items-start w-full max-w-4xl mx-auto">

        { }
        <div className="flex-1 flex flex-col gap-5 animate-in fade-in slide-in-from-left-4 duration-500">

          { }
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-bingo-card/60 border border-white/5 backdrop-blur-sm">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-bingo-accent to-orange-500 flex items-center justify-center font-bold text-white text-sm shrink-0 shadow-[0_0_12px_rgba(245,158,11,0.4)]">
              {nombreJugador.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-[10px] text-white/40 uppercase tracking-widest font-semibold">Conectado como</p>
              <p className="text-white font-bold text-sm" style={{ fontFamily: 'Outfit, sans-serif' }}>{nombreJugador}</p>
            </div>
          </div>

          { }
          {listoParaEmpezar ? (
            <div className="flex flex-col items-center py-8 px-4 rounded-2xl bg-bingo-card/60 border border-bingo-accent/30 backdrop-blur-sm shadow-[0_0_30px_rgba(245,158,11,0.15)] animate-in zoom-in duration-300">
              <p className="text-white/70 text-sm uppercase tracking-widest font-semibold mb-3">¡La partida empieza en!</p>
              <div
                key={animKey}
                className="w-28 h-28 rounded-full bg-gradient-to-br from-bingo-accent to-orange-500 flex items-center justify-center shadow-[0_0_40px_rgba(245,158,11,0.6)] animate-in zoom-in spin-in-6 duration-500"
              >
                <span className="text-6xl font-black text-white" style={{ fontFamily: 'Outfit, sans-serif' }}>
                  {cuentaAtras}
                </span>
              </div>
              <p className="mt-4 text-bingo-accent/80 text-xs font-semibold tracking-widest uppercase animate-pulse">
                ¡Prepárate!
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center py-8 px-4 rounded-2xl bg-bingo-card/60 border border-white/5 backdrop-blur-sm">
              { }
              <div className="relative w-20 h-20 mb-4">
                <div className="absolute inset-0 rounded-full border-4 border-white/5" />
                <div className="absolute inset-0 rounded-full border-4 border-t-bingo-accent/80 border-r-transparent border-b-transparent border-l-transparent animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl">⏳</span>
                </div>
              </div>
              {faltan > 0 ? (
                <>
                  <p className="text-white/70 text-sm font-semibold text-center">
                    Esperando jugadores...
                  </p>
                  <p className="mt-1.5 text-white/35 text-xs text-center">
                    Faltan <span className="text-bingo-accent font-bold">{faltan}</span> jugador{faltan !== 1 ? 'es' : ''} más para empezar
                  </p>
                </>
              ) : (
                <p className="text-bingo-green text-sm font-semibold text-center animate-pulse">
                  ¡Suficientes jugadores! Iniciando...
                </p>
              )}
            </div>
          )}

          { }
          <div className="rounded-2xl bg-bingo-card/60 border border-white/5 backdrop-blur-sm overflow-hidden">
            <div className="px-4 py-3 border-b border-white/5 flex items-center justify-between">
              <h2 className="text-xs font-bold tracking-widest uppercase text-white/50" style={{ fontFamily: 'Outfit, sans-serif' }}>
                Jugadores en sala
              </h2>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-bingo-accent/20 text-bingo-accent font-bold border border-bingo-accent/30">
                {jugadores.length}
              </span>
            </div>
            <ul className="divide-y divide-white/5 max-h-52 overflow-y-auto" style={{ scrollbarWidth: 'none' }}>
              {jugadores.length === 0 ? (
                <li className="px-4 py-4 text-center text-white/25 text-xs">Nadie aquí todavía...</li>
              ) : (
                jugadores.map((nombre, idx) => (
                  <li
                    key={idx}
                    className="flex items-center gap-3 px-4 py-2.5 animate-in fade-in slide-in-from-left-2 duration-300"
                  >
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs shrink-0 text-white"
                      style={{
                        background: `hsl(${(nombre.charCodeAt(0) * 37) % 360}, 70%, 50%)`,
                        boxShadow: `0 0 8px hsl(${(nombre.charCodeAt(0) * 37) % 360}, 70%, 50%, 0.4)`,
                      }}
                    >
                      {nombre.charAt(0).toUpperCase()}
                    </div>
                    <span className={`text-sm font-medium ${nombre === nombreJugador ? 'text-bingo-accent' : 'text-white/80'}`}>
                      {nombre}
                      {nombre === nombreJugador && <span className="ml-1.5 text-[10px] text-white/30">(tú)</span>}
                    </span>
                    {idx === 0 && (
                      <span className="ml-auto text-[10px] text-yellow-400/60">👑</span>
                    )}
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>

        { }
        <aside className="w-72 xl:w-80 shrink-0 sticky top-8 h-[calc(100vh-10rem)] animate-in fade-in slide-in-from-right-4 duration-500">
          <Chat
            mensajes={mensajes}
            onEnviarMensaje={onEnviarMensaje}
            nombreJugador={nombreJugador}
            titulo="Chat de sala"
          />
        </aside>

      </main>
    </div>
  )
}
