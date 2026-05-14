import { useEffect, useState, useCallback, useRef } from 'react'
import { io } from 'socket.io-client'


const socket = io()

export function useSocket() {

  const [isConnected, setIsConnected] = useState(socket.connected)


  const [jugadoresEnSala, setJugadoresEnSala] = useState([])
  const [mensajesSala, setMensajesSala] = useState([])
  const [cuentaAtras, setCuentaAtras] = useState(null)
  const cuentaAtrasRef = useRef(null)

  const [drawnNumbers, setDrawnNumbers] = useState([])
  const [carton, setCarton] = useState(null)
  const [estadoPartida, setEstadoPartida] = useState('esperando')
  const [premioResult, setPremioResult] = useState(null)
  const [lineaCantada, setLineaCantada] = useState(false)
  const [verificandoPremio, setVerificandoPremio] = useState(null)
  const [gameKey, setGameKey] = useState(0)
  const [mensajesChat, setMensajesChat] = useState([])
  const [nuevoSaldo, setNuevoSaldo] = useState(null)

  useEffect(() => {

    function handleConnect() { setIsConnected(true) }
    function handleDisconnect() { setIsConnected(false) }


    function handleActualizarSala({ jugadores }) {
      setJugadoresEnSala(jugadores)
    }

    function handleMensajeSala(mensaje) {
      setMensajesSala((prev) => [...prev, mensaje])
    }

    function handleIniciarCuentaAtras({ segundos }) {
      setCuentaAtras(segundos)


      let restantes = segundos - 1
      if (cuentaAtrasRef.current) clearInterval(cuentaAtrasRef.current)
      cuentaAtrasRef.current = setInterval(() => {
        if (restantes <= 0) {
          clearInterval(cuentaAtrasRef.current)
          cuentaAtrasRef.current = null
          setCuentaAtras(0)
        } else {
          setCuentaAtras(restantes)
          restantes--
        }
      }, 1000)
    }

    function handleCancelarCuentaAtras() {
      if (cuentaAtrasRef.current) {
        clearInterval(cuentaAtrasRef.current)
        cuentaAtrasRef.current = null
      }
      setCuentaAtras(null)
    }

    function handlePartidaIniciada() {
      setCuentaAtras(null)
      if (cuentaAtrasRef.current) {
        clearInterval(cuentaAtrasRef.current)
        cuentaAtrasRef.current = null
      }
      setEstadoPartida('jugando')
      setMensajesSala([])
    }


    function handleNumeroExtraido({ numerosExtraidos }) {
      setDrawnNumbers([...numerosExtraidos].reverse())
    }

    function handleCartonAsignado(datos) {
      setCarton(datos.carton)
    }

    function handleEstadoActual({ numerosExtraidos, estado }) {
      setDrawnNumbers([...numerosExtraidos].reverse())
      setEstadoPartida(estado)
    }

    function handleVerificandoPremio({ tipo, nombreJugador }) {
      setVerificandoPremio({ tipo, nombreJugador })
      setPremioResult(null)
    }

    function handlePremioValidado(resultado) {
      setVerificandoPremio(null)
      setPremioResult(resultado)
      if (resultado.valido && resultado.tipo === 'linea') {
        setEstadoPartida('pausada')
        setLineaCantada(true)
      } else if (resultado.valido && resultado.tipo === 'bingo') {
        setEstadoPartida('finalizada')
      }
    }

    function handleReanudarPartida() {
      setEstadoPartida('jugando')
      setPremioResult(null)
      setVerificandoPremio(null)
      setLineaCantada(false)
    }

    function handlePartidaReiniciada() {
      setDrawnNumbers([])
      setEstadoPartida('esperando')
      setPremioResult(null)
      setVerificandoPremio(null)
      setLineaCantada(false)
      setMensajesChat([])
      setGameKey((prev) => prev + 1)
    }

    function handleMensajeChat(mensaje) {
      setMensajesChat((prev) => [...prev, mensaje])
    }

    function handleActualizarSaldo({ saldo }) {
      setNuevoSaldo(saldo)
    }


    socket.on('connect', handleConnect)
    socket.on('disconnect', handleDisconnect)
    socket.on('actualizarSala', handleActualizarSala)
    socket.on('mensajeSala', handleMensajeSala)
    socket.on('iniciarCuentaAtras', handleIniciarCuentaAtras)
    socket.on('cancelarCuentaAtras', handleCancelarCuentaAtras)
    socket.on('partidaIniciada', handlePartidaIniciada)
    socket.on('numeroExtraido', handleNumeroExtraido)
    socket.on('cartonAsignado', handleCartonAsignado)
    socket.on('estadoActual', handleEstadoActual)
    socket.on('verificandoPremio', handleVerificandoPremio)
    socket.on('premioValidado', handlePremioValidado)
    socket.on('reanudarPartida', handleReanudarPartida)
    socket.on('partidaReiniciada', handlePartidaReiniciada)
    socket.on('mensajeChat', handleMensajeChat)
    socket.on('actualizarSaldo', handleActualizarSaldo)

    return () => {
      socket.off('connect', handleConnect)
      socket.off('disconnect', handleDisconnect)
      socket.off('actualizarSala', handleActualizarSala)
      socket.off('mensajeSala', handleMensajeSala)
      socket.off('iniciarCuentaAtras', handleIniciarCuentaAtras)
      socket.off('cancelarCuentaAtras', handleCancelarCuentaAtras)
      socket.off('partidaIniciada', handlePartidaIniciada)
      socket.off('numeroExtraido', handleNumeroExtraido)
      socket.off('cartonAsignado', handleCartonAsignado)
      socket.off('estadoActual', handleEstadoActual)
      socket.off('verificandoPremio', handleVerificandoPremio)
      socket.off('premioValidado', handlePremioValidado)
      socket.off('reanudarPartida', handleReanudarPartida)
      socket.off('partidaReiniciada', handlePartidaReiniciada)
      socket.off('mensajeChat', handleMensajeChat)
      socket.off('actualizarSaldo', handleActualizarSaldo)
    }
  }, [])

  const unirseASala = useCallback((nombre) => {
    socket.emit('unirseASalaEspera', { nombre })
  }, [])

  const enviarMensajeSala = useCallback((texto) => {
    socket.emit('mensajeSala', { texto })
  }, [])

  function registrarJugador(nombre) {
    socket.emit('registrarJugador', { nombre })
  }

  function cantarLinea() {
    socket.emit('cantarLinea')
  }

  function cantarBingo() {
    socket.emit('cantarBingo')
  }

  function marcarNumero(numero, marcado) {
    socket.emit('marcarNumero', { numero, marcado })
  }

  function enviarMensaje(texto) {
    socket.emit('mensajeChat', { texto })
  }

  function cantarReinicio() {
    socket.emit('reiniciarPartida')
  }

  const clearPremioResult = useCallback(() => {
    setPremioResult(null)
  }, [])

  return {
    socket,
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
    registrarJugador,
    cantarLinea,
    cantarBingo,
    cantarReinicio,
    marcarNumero,
    enviarMensaje,
    clearPremioResult,
    nuevoSaldo,
  }
}
