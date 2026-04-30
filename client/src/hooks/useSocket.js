import { useEffect, useState } from 'react'
import { io } from 'socket.io-client'

const socket = io()

export function useSocket() {
  const [isConnected, setIsConnected] = useState(socket.connected)
  const [drawnNumbers, setDrawnNumbers] = useState([])
  const [carton, setCarton] = useState(null)
  const [estadoPartida, setEstadoPartida] = useState('jugando')
  const [premioResult, setPremioResult] = useState(null)
  const [lineaCantada, setLineaCantada] = useState(false)
  const [verificandoPremio, setVerificandoPremio] = useState(null)
  const [gameKey, setGameKey] = useState(0)

  useEffect(() => {
    function handleConnect() {
      setIsConnected(true)
    }

    function handleDisconnect() {
      setIsConnected(false)
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
    }

    function handlePartidaReiniciada() {
      setDrawnNumbers([])
      setEstadoPartida('jugando')
      setPremioResult(null)
      setVerificandoPremio(null)
      setLineaCantada(false)
      setGameKey((prev) => prev + 1)
    }

    socket.on('connect', handleConnect)
    socket.on('disconnect', handleDisconnect)
    socket.on('numeroExtraido', handleNumeroExtraido)
    socket.on('cartonAsignado', handleCartonAsignado)
    socket.on('estadoActual', handleEstadoActual)
    socket.on('verificandoPremio', handleVerificandoPremio)
    socket.on('premioValidado', handlePremioValidado)
    socket.on('reanudarPartida', handleReanudarPartida)
    socket.on('partidaReiniciada', handlePartidaReiniciada)

    return () => {
      socket.off('connect', handleConnect)
      socket.off('disconnect', handleDisconnect)
      socket.off('numeroExtraido', handleNumeroExtraido)
      socket.off('cartonAsignado', handleCartonAsignado)
      socket.off('estadoActual', handleEstadoActual)
      socket.off('verificandoPremio', handleVerificandoPremio)
      socket.off('premioValidado', handlePremioValidado)
      socket.off('reanudarPartida', handleReanudarPartida)
      socket.off('partidaReiniciada', handlePartidaReiniciada)
    }
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

  function cantarReinicio() {
    socket.emit('reiniciarPartida')
  }

  return {
    socket,
    isConnected,
    drawnNumbers,
    carton,
    estadoPartida,
    premioResult,
    lineaCantada,
    verificandoPremio,
    gameKey,
    registrarJugador,
    cantarLinea,
    cantarBingo,
    cantarReinicio,
  }
}
