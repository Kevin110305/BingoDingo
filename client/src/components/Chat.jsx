import { useState, useEffect, useRef } from 'react'

export default function Chat({ mensajes, onEnviarMensaje, nombreJugador, titulo = 'Chat' }) {
  const [texto, setTexto] = useState('')
  const endRef = useRef(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [mensajes])

  const handleEnviar = (e) => {
    e.preventDefault()
    if (texto.trim() === '') return
    onEnviarMensaje(texto.trim())
    setTexto('')
  }

  return (
    <div className="flex flex-col h-full bg-bingo-card/80 backdrop-blur-md rounded-2xl border border-white/5 shadow-2xl overflow-hidden">
      { }
      <div className="px-4 py-3 border-b border-white/5 flex items-center gap-2 shrink-0">
        <span className="w-2 h-2 rounded-full bg-bingo-green shadow-[0_0_6px_var(--color-bingo-green)]" />
        <h2
          className="text-sm font-bold tracking-widest uppercase text-white/70"
          style={{ fontFamily: 'Outfit, sans-serif' }}
        >
          {titulo}
        </h2>
      </div>

      { }
      <div className="flex-1 overflow-y-auto px-3 py-3 flex flex-col gap-2 min-h-0">
        {mensajes.length === 0 && (
          <p className="text-center text-white/20 text-xs mt-4 select-none">
            Ningún mensaje aún...
          </p>
        )}
        {mensajes.map((msg, idx) => {
          const esMio = msg.nombre === nombreJugador
          return (
            <div
              key={idx}
              className={`flex flex-col gap-0.5 animate-in fade-in slide-in-from-bottom-2 duration-200 ${esMio ? 'items-end' : 'items-start'}`}
            >
              {!esMio && (
                <span className="text-[10px] font-semibold text-bingo-accent/80 px-1">
                  {msg.nombre}
                </span>
              )}
              <div
                className={`max-w-[85%] px-3 py-1.5 rounded-xl text-sm font-medium break-words leading-snug ${esMio
                  ? 'bg-bingo-marked text-white rounded-br-sm shadow-[0_0_10px_rgba(124,58,237,0.3)]'
                  : 'bg-bingo-cell text-white/85 rounded-bl-sm'
                  }`}
              >
                {msg.texto}
              </div>
              <span className="text-[10px] text-white/25 px-1">
                {msg.hora}
              </span>
            </div>
          )
        })}
        <div ref={endRef} />
      </div>

      { }
      <form
        onSubmit={handleEnviar}
        className="px-3 py-3 border-t border-white/5 flex gap-2 shrink-0"
      >
        <input
          type="text"
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          placeholder="Escribe un mensaje..."
          maxLength={200}
          className="flex-1 min-w-0 px-3 py-2 rounded-lg bg-bingo-cell text-white text-sm border border-white/10 focus:outline-none focus:ring-2 focus:ring-bingo-accent focus:border-transparent placeholder-white/25 transition-all"
        />
        <button
          type="submit"
          disabled={texto.trim() === ''}
          className="shrink-0 px-3 py-2 rounded-lg bg-gradient-to-br from-bingo-accent to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white font-bold text-sm shadow-[0_0_10px_rgba(245,158,11,0.3)] hover:shadow-[0_0_18px_rgba(245,158,11,0.5)] transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:shadow-none"
        >
          ➤
        </button>
      </form>
    </div>
  )
}
