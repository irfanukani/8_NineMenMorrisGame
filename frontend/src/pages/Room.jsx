import { useEffect } from 'react'
import PreScreen from '../components/PreScreen'
import { useNavigate } from 'react-router-dom'
import socket from '../socket'

export default function Room() {
  const navigate = useNavigate()

  useEffect(() => {
    socket.on('room-joined', (message) => {
      navigate('/game/' + message?.roomId)
    })

    return () => {
      // socket.disconnect();
    }
  }, [])
  return <PreScreen />
}
