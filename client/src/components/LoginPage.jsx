import { useState } from 'react'

const API = ''

export default function LoginPage({ onLoginOk }) {
  const [modo, setModo] = useState('login')
  const [nombre, setNombre] = useState('')
  const [password, setPassword] = useState('')
  const [confirmar, setConfirmar] = useState('')
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(false)

  const esRegistro = modo === 'registro'

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    if (nombre.trim().length < 3) {
      setError('El nombre debe tener al menos 3 caracteres.')
      return
    }
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.')
      return
    }
    if (esRegistro && password !== confirmar) {
      setError('Las contraseñas no coinciden.')
      return
    }

    setCargando(true)
    try {
      const endpoint = esRegistro ? `${API}/api/registro` : `${API}/api/login`
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre: nombre.trim(), password }),
      })
      const datos = await res.json()

      if (datos.ok) {
        localStorage.setItem('bingo_nombre', datos.nombre)
        onLoginOk(datos.nombre)
      } else {
        setError(datos.mensaje || 'Ha ocurrido un error.')
      }
    } catch {
      setError('No se pudo conectar con el servidor.')
    } finally {
      setCargando(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-bingo-dark via-[#1a1145] to-bingo-dark flex flex-col items-center justify-center px-4 py-8">
      { }
      <div className="mb-10 text-center">
        <h1
          className="text-6xl sm:text-7xl font-extrabold tracking-tight bg-gradient-to-r from-bingo-accent via-amber-300 to-orange-500 bg-clip-text text-transparent drop-shadow-lg"
          style={{ fontFamily: 'Outfit, sans-serif' }}
        >
          BingoDingo
        </h1>
        <p className="mt-3 text-white/40 text-sm tracking-widest uppercase">
          El bingo más divertido
        </p>
      </div>

      { }
      <div className="w-full max-w-sm">
        { }
        <div className="flex rounded-xl bg-white/5 border border-white/10 p-1 mb-6">
          {['login', 'registro'].map((tab) => (
            <button
              key={tab}
              onClick={() => { setModo(tab); setError('') }}
              className={`flex-1 py-2 rounded-lg text-sm font-bold tracking-wide transition-all ${modo === tab
                  ? 'bg-gradient-to-r from-bingo-accent to-orange-500 text-white shadow-[0_0_12px_rgba(245,158,11,0.4)]'
                  : 'text-white/40 hover:text-white/70'
                }`}
              style={{ fontFamily: 'Outfit, sans-serif' }}
            >
              {tab === 'login' ? 'Iniciar sesión' : 'Registrarse'}
            </button>
          ))}
        </div>

        { }
        <div className="bg-bingo-card/80 backdrop-blur-md rounded-2xl p-6 md:p-8 shadow-2xl border border-white/5">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            { }
            <div>
              <label htmlFor="loginNombre" className="block text-xs font-semibold text-white/50 uppercase tracking-widest mb-1.5">
                Nombre de usuario
              </label>
              <input
                id="loginNombre"
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Ej: Jugador123"
                maxLength={20}
                autoComplete="username"
                required
                className="w-full px-4 py-3 rounded-lg bg-bingo-cell text-white border border-white/10 focus:outline-none focus:ring-2 focus:ring-bingo-accent focus:border-transparent placeholder-white/25 transition-all font-medium text-sm"
              />
            </div>

            { }
            <div>
              <label htmlFor="loginPassword" className="block text-xs font-semibold text-white/50 uppercase tracking-widest mb-1.5">
                Contraseña
              </label>
              <input
                id="loginPassword"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mínimo 6 caracteres"
                minLength={6}
                autoComplete={esRegistro ? 'new-password' : 'current-password'}
                required
                className="w-full px-4 py-3 rounded-lg bg-bingo-cell text-white border border-white/10 focus:outline-none focus:ring-2 focus:ring-bingo-accent focus:border-transparent placeholder-white/25 transition-all font-medium text-sm"
              />
            </div>

            { }
            {esRegistro && (
              <div>
                <label htmlFor="loginConfirmar" className="block text-xs font-semibold text-white/50 uppercase tracking-widest mb-1.5">
                  Confirmar contraseña
                </label>
                <input
                  id="loginConfirmar"
                  type="password"
                  value={confirmar}
                  onChange={(e) => setConfirmar(e.target.value)}
                  placeholder="Repite tu contraseña"
                  autoComplete="new-password"
                  required
                  className="w-full px-4 py-3 rounded-lg bg-bingo-cell text-white border border-white/10 focus:outline-none focus:ring-2 focus:ring-bingo-accent focus:border-transparent placeholder-white/25 transition-all font-medium text-sm"
                />
              </div>
            )}

            { }
            {error && (
              <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-bingo-red/15 border border-bingo-red/30 text-bingo-red text-sm font-medium animate-in fade-in duration-200">
                <span>⚠️</span>
                <span>{error}</span>
              </div>
            )}

            { }
            <button
              id="loginSubmit"
              type="submit"
              disabled={cargando}
              className="mt-1 w-full bg-gradient-to-r from-bingo-accent to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white font-bold py-3 px-4 rounded-lg shadow-[0_0_15px_rgba(245,158,11,0.4)] hover:shadow-[0_0_25px_rgba(245,158,11,0.6)] transform hover:-translate-y-0.5 transition-all disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
              style={{ fontFamily: 'Outfit, sans-serif' }}
            >
              {cargando ? (
                <>
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Procesando...
                </>
              ) : (
                esRegistro ? '🎉 CREAR CUENTA' : '🎮 ENTRAR AL JUEGO'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
