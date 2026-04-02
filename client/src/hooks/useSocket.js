import { useEffect, useState } from 'react'
import { io } from 'socket.io-client'

const socket = io()

export function useSocket() {
  const [isConnected, setIsConnected] = useState(socket.connected)
  const [drawnNumbers, setDrawnNumbers] = useState([])

  useEffect(() => {
    function handleConnect() {
      setIsConnected(true)
    }

    function handleDisconnect() {
      setIsConnected(false)
    }

    function handleNumberDrawn(number) {
      setDrawnNumbers((prev) => [...prev, number])
    }

    socket.on('connect', handleConnect)
    socket.on('disconnect', handleDisconnect)
    socket.on('numberDrawn', handleNumberDrawn)

    return () => {
      socket.off('connect', handleConnect)
      socket.off('disconnect', handleDisconnect)
      socket.off('numberDrawn', handleNumberDrawn)
    }
  }, [])

  return { socket, isConnected, drawnNumbers }
}
