import { useState } from 'react'
import AudioPlayer from './AudioPlayer'
import socket from '../socket'
 
export default function PreScreen() {
  const roomId = window.location.href.split('/')[4]
  const [selectedBetAmount, setSelectedBetAmount] = useState(0)
 
  const emitRoomUpdate = (amount) => {
    socket.emit('update-room', {
      roomName: roomId,
      gameTimer: amount === 50 ? 7 * 60 : amount === 25 ? 10 * 60 : 15 * 60,
      betAmount: amount,
    })
  }
 
  const copyRoomId = () => {
    navigator.clipboard.writeText(roomId)
  }
 
  return (
    <section className="bg-gray-800 h-screen w-full text-white grid place-items-center pattern">
      <AudioPlayer src={'/audio/bg-music.mp3'} />
      <div className="flex flex-col items-center">
        <div className="text-2xl xl:text-4xl text-center py-8 text-gray-900">
          Waiting for players to join!
        </div>
 
        <div className="flex gap-4 px-1 justify-between my-[17.5px]">
          <div
            onClick={() => {
              setSelectedBetAmount(0)
              emitRoomUpdate(0)
            }}
            className={`px-4 py-2 border border-yellow-600 rounded flex gap-6 items-center gamified ${
              selectedBetAmount === 0 ? 'bg-yellow-600' : 'hover:bg-yellow-600'
            } cursor-pointer`}
          >
            <img src="/gold.png" className="w-12 xl:w-20" />
            <p className="text-gray-900">0</p>
          </div>
          <div
            onClick={() => {
              setSelectedBetAmount(25)
              emitRoomUpdate(25)
            }}
            className={`px-4 py-2 border border-yellow-600 rounded flex gap-6 items-center gamified ${
              selectedBetAmount === 25 ? 'bg-yellow-600' : 'hover:bg-yellow-600'
            } cursor-pointer`}
          >
            <img src="/gold.png" className="w-12 xl:w-20" />
            <p className="text-gray-900">25</p>
          </div>
          <div
            onClick={() => {
              setSelectedBetAmount(50)
              emitRoomUpdate(50)
            }}
            className={`px-4 py-2 border border-yellow-600 rounded flex gap-6 items-center gamified ${
              selectedBetAmount === 50 ? 'bg-yellow-600' : 'hover:bg-yellow-600'
            } cursor-pointer`}
          >
            <img src="/gold.png" className="w-12 xl:w-20" />
            <p className="text-gray-900">50</p>
          </div>
        </div>
 
        <div className="bg-gray-900 mt-8 rounded text-white px-12 py-4 text-2xl xl:text-4xl flex gap-8 items-center w-60">
          <p className="text-center">{roomId}</p>
          <i
            className="fa-regular text-2xl cursor-pointer fa-copy"
            onClick={copyRoomId}
          ></i>
        </div>
 
        <p className="mt-8 text-gray-900">
          <i className="fa-solid fa-circle-info"></i> &nbsp; You can share this
          room Id with your friend
        </p>
      </div>
    </section>
  )
}