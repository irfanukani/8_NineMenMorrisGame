import { useEffect, useState } from 'react'
import AudioPlayer from './components/AudioPlayer'
import { useNavigate } from 'react-router-dom'
import Modal from './components/Modal'
import socket from './socket'
import useStore from './state/gameState'

export default function App() {
  const navigate = useNavigate()
  const { setCurrentUser } = useStore()

  const createRoom = () => {
    setCurrentUser('host')
    socket.emit('create-room', { user: 'host', betAmount: 0 })
  }

  useEffect(() => {
    socket.on('room-created', (roomId) => {
      navigate('/room/' + roomId)
    })

    socket.on('room-joined', (message) => {
      navigate('/game/' + message?.roomId)
    })

    return () => {}
  }, [])

  const [isModalOpen, setIsModalOpen] = useState(false)

  const openModal = () => {
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
  }

  const [joinRoomInput, setJoinRoomInput] = useState('')

  const handleJoinRoomInput = (e) => {
    setJoinRoomInput(e.target.value)
  }

  const joinRoom = () => {
    console.log(joinRoomInput)
    if (joinRoomInput) setCurrentUser('guest')
    socket.emit('join-room', { user: 'guest', roomName: joinRoomInput })
  }

  return (
    <div className="bg-gray-800 h-screen w-full grid place-items-center text-white pattern">
      <Modal isOpen={isModalOpen} closeModal={closeModal}>
        <div className="p-4 flex flex-col">
          <h2 className="text-lg font-semibold mb-2">Join Room</h2>
          <input
            type="text"
            placeholder="paste room id here..."
            value={joinRoomInput}
            onChange={handleJoinRoomInput}
            className="outline-none border-b-2 bg-transparent px-2 py-1"
          />
          <button
            onClick={joinRoom}
            className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Join Room
          </button>
          <button
            onClick={closeModal}
            className="mt-4 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          >
            Close
          </button>
        </div>
      </Modal>
      <AudioPlayer src="/audio/bg-music.mp3" />
      <div className="flex flex-col gap-4 w-60 xl:w-96">
        <button
          className="gamified px-8 py-4 text-4xl bg-blue-700 rounded"
          onClick={createRoom}
        >
          Create Room
        </button>
        <button
          className="gamified bg-gray-700 px-8 py-4 text-4xl border border-blue-700 rounded"
          onClick={openModal}
        >
          Join Room
        </button>
        <button className="gamified bg-gray-700 px-8 py-4 text-4xl border border-blue-700 rounded">
          Game Rules
        </button>
      </div>
      <div className="fixed bottom-2 text-gray-900 text-xl">
        Made with ❤️ by Team Trie!
      </div>
    </div>
  )
}
