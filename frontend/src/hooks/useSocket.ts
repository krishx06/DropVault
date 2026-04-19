import { useEffect, useRef } from 'react'
import { io, Socket } from 'socket.io-client'

const SOCKET_URL = 'http://localhost:5000'

export function useDropSocket(
  dropId: string | undefined,
  onEvent: (event: string, payload: unknown) => void
) {
  const socketRef = useRef<Socket | null>(null)
  const onEventRef = useRef(onEvent)
  onEventRef.current = onEvent

  useEffect(() => {
    if (!dropId) return

    const socket = io(SOCKET_URL, { transports: ['websocket'] })
    socketRef.current = socket

    socket.on('connect', () => {
      socket.emit('subscribe:drop', dropId)
    })

    const events = ['drop:activated', 'drop:ended', 'drop:sold_out']
    events.forEach((ev) => {
      socket.on(ev, (payload: unknown) => onEventRef.current(ev, payload))
    })

    return () => {
      socket.emit('unsubscribe:drop', dropId)
      socket.disconnect()
    }
  }, [dropId])
}
