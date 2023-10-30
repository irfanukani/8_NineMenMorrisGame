import React, { useState } from 'react'
import AudioPlayer from './AudioPlayer'
import useStore from '../state/gameState';

export default function PreScreen() {
    const roomId = window.location.href.split('/')[4];
    const [selectedBetAmount, setSelectedBetAmount] = useState(0);

    const copyRoomId = () => {
        navigator.clipboard.writeText(roomId);
    }

    return (
        <section className='bg-gray-800 h-screen w-full text-white grid place-items-center'>
            <AudioPlayer src={'/audio/bg-music.mp3'} />
            <div>
                <div className='text-4xl text-center py-8'>
                    Waiting for players to join!
                </div>

                <div className='flex gap-2 justify-between my-[17.5px]'>
                    <div onClick={() => setSelectedBetAmount(0)} className={`px-4 py-2 border border-yellow-600 rounded flex gap-8 items-center ${selectedBetAmount === 0 ? 'bg-yellow-600' : 'hover:bg-yellow-600'} cursor-pointer`}>
                        <img src='/gold.png' className='w-20' /> 0
                    </div>
                    <div onClick={() => setSelectedBetAmount(25)} className={`px-4 py-2 border border-yellow-600 rounded flex gap-8 items-center ${selectedBetAmount === 25 ? 'bg-yellow-600' : 'hover:bg-yellow-600'} cursor-pointer`}>
                        <img src='/gold.png' className='w-20' /> 25
                    </div>
                    <div onClick={() => setSelectedBetAmount(50)} className={`px-4 py-2 border border-yellow-600 rounded flex gap-8 items-center ${selectedBetAmount === 50 ? 'bg-yellow-600' : 'hover:bg-yellow-600'} cursor-pointer`}>
                        <img src='/gold.png' className='w-20' /> 50
                    </div>
                </div>

                <div className='bg-gray-900 px-12 py-4 text-4xl flex gap-8 items-center'>
                    <span className='text-2xl'>{roomId}</span>
                    <i className="fa-regular text-2xl cursor-pointer fa-copy" onClick={copyRoomId}></i>
                </div>
                <p className='mt-2'>
                    <i className="fa-solid fa-circle-info"></i> &nbsp;
                    You can share this room Id with your friend
                </p>
            </div>
        </section>
    )
}
