import { useEffect } from 'react'

export default function PremioAlert({ verificandoPremio, premioResult, onDismissInvalido }) {
  const isVisible = verificandoPremio !== null || premioResult !== null
  const enVerificacion = verificandoPremio !== null && premioResult === null

  const tipo = (premioResult?.tipo || verificandoPremio?.tipo || '').toUpperCase()
  const nombre = premioResult?.nombreGanador || verificandoPremio?.nombreJugador

  useEffect(() => {
    if (!premioResult || premioResult.valido) return
    const timer = setTimeout(onDismissInvalido, 4000)
    return () => clearTimeout(timer)
  }, [premioResult, onDismissInvalido])

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm animate-in fade-in duration-300">
      <div
        className={`relative w-full max-w-sm mx-4 rounded-3xl p-8 shadow-2xl border text-center animate-in zoom-in-95 duration-500 ${enVerificacion
            ? 'bg-bingo-card/95 border-white/10'
            : premioResult?.valido
              ? premioResult.tipo === 'bingo'
                ? 'bg-bingo-card/95 border-bingo-accent/50 shadow-[0_0_60px_rgba(245,158,11,0.25)]'
                : 'bg-bingo-card/95 border-bingo-green/50 shadow-[0_0_60px_rgba(16,185,129,0.25)]'
              : 'bg-bingo-card/95 border-bingo-red/50 shadow-[0_0_60px_rgba(239,68,68,0.25)]'
          }`}
      >
        {enVerificacion ? (
          <VerificandoContent tipo={tipo} nombre={nombre} />
        ) : premioResult?.valido ? (
          <ValidoContent premioResult={premioResult} nombre={nombre} />
        ) : (
          <InvalidoContent premioResult={premioResult} nombre={nombre} />
        )}
      </div>
    </div>
  )
}

function VerificandoContent({ tipo, nombre }) {
  return (
    <>
      <div className="relative w-20 h-20 mx-auto mb-6">
        <div className="absolute inset-0 rounded-full border-4 border-white/10" />
        <div className="absolute inset-0 rounded-full border-4 border-t-bingo-accent border-r-transparent border-b-transparent border-l-transparent animate-spin" />
        <div className="absolute inset-2 rounded-full bg-bingo-accent/10 flex items-center justify-center">
          <span className="text-2xl">{tipo === 'BINGO' ? '🎰' : '🎯'}</span>
        </div>
      </div>
      <p className="text-white/40 text-xs tracking-widest uppercase mb-2 font-semibold">
        Verificando
      </p>
      <h2
        className="text-4xl font-black text-white mb-4"
        style={{ fontFamily: 'Outfit, sans-serif' }}
      >
        {tipo}
      </h2>
      <p className="text-white/60 text-base">
        <span className="text-bingo-accent font-bold">{nombre}</span>
        {' '}está cantando {tipo.toLowerCase()}...
      </p>
    </>
  )
}

function ValidoContent({ premioResult, nombre }) {
  const esBingo = premioResult.tipo === 'bingo'

  return (
    <>
      {esBingo ? (
        <div className="text-6xl mb-5 animate-in zoom-in-50 duration-700">🏆</div>
      ) : (
        <div className="w-20 h-20 mx-auto mb-5 rounded-full bg-bingo-green/20 border-4 border-bingo-green flex items-center justify-center animate-in zoom-in-50 duration-500">
          <span className="text-bingo-green text-4xl font-black">✓</span>
        </div>
      )}
      <p
        className={`text-xs tracking-widest uppercase mb-2 font-bold ${esBingo ? 'text-bingo-accent' : 'text-bingo-green'}`}
      >
        {esBingo ? '¡Partida finalizada!' : '¡Línea válida!'}
      </p>
      <h2
        className="text-3xl font-black text-white mb-3"
        style={{ fontFamily: 'Outfit, sans-serif' }}
      >
        ¡{nombre}!
      </h2>
      <p className={`text-base font-medium ${esBingo ? 'text-bingo-accent/80' : 'text-bingo-green/80'}`}>
        {esBingo
          ? '¡Ha ganado la partida con BINGO! 🎉'
          : '¡Ha completado una línea! El juego continúa en breve...'}
      </p>
    </>
  )
}

function InvalidoContent({ premioResult, nombre }) {
  return (
    <>
      <div className="w-20 h-20 mx-auto mb-5 rounded-full bg-bingo-red/20 border-4 border-bingo-red flex items-center justify-center animate-in zoom-in-50 duration-500">
        <span className="text-bingo-red text-4xl font-black">✗</span>
      </div>
      <p className="text-bingo-red text-xs tracking-widest uppercase mb-2 font-bold">
        ¡Incorrecto!
      </p>
      <h2
        className="text-3xl font-black text-white mb-3"
        style={{ fontFamily: 'Outfit, sans-serif' }}
      >
        {premioResult.tipo.toUpperCase()} inválido
      </h2>
      <p className="text-white/60 text-base">
        El {premioResult.tipo} de{' '}
        <span className="text-bingo-accent font-bold">{nombre}</span>{' '}
        no es válido. El juego continúa.
      </p>
    </>
  )
}
