import React from 'react'

export default function MenuInicio({ playerName, playerSaldo, onPlay, onLogout }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] flex items-center justify-center px-4 relative overflow-hidden">
      <button
        onClick={onLogout}
        className="absolute top-6 right-6 text-white/40 hover:text-white/90 flex items-center gap-2 transition-all group"
      >
        <span className="text-xs uppercase tracking-widest font-bold">Cerrar Sesión</span>
        <div className="p-2 rounded-full bg-white/5 border border-white/10 group-hover:bg-red-500/20 group-hover:border-red-500/40 transition-all">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
        </div>
      </button>

      <div className="max-w-md w-full bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-3xl shadow-2xl text-center animate-in zoom-in duration-500">
        <div className="mb-6 flex justify-center">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-600 flex items-center justify-center text-4xl shadow-lg shadow-orange-500/20">
            👤
          </div>
        </div>

        <h1 className="text-4xl font-extrabold text-white mb-2 tracking-tight" style={{ fontFamily: 'Outfit, sans-serif' }}>
          ¡Hola, <span className="text-amber-400">{playerName}</span>!
        </h1>

        <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-full mb-8">
          <span className="text-green-400 font-bold">💰 Saldo:</span>
          <span className="text-white font-black text-xl">{playerSaldo.toLocaleString()} </span>
        </div>

        <button
          onClick={onPlay}
          className="group relative w-full py-4 px-6 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white text-2xl font-black rounded-2xl shadow-[0_0_20px_rgba(245,158,11,0.4)] hover:shadow-[0_0_35px_rgba(245,158,11,0.6)] transform hover:-translate-y-1 transition-all duration-300 overflow-hidden"
        >
          <span className="relative z-10 flex items-center justify-center gap-3">
            <span className="text-3xl">🎮</span> ¡JUGAR AHORA!
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
        </button>
      </div>
    </div>
  )
}
