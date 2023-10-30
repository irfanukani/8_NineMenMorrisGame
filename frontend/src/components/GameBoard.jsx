import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import useStore from '../state/gameState'
import socket from '../socket'
const circles = [{
    cx: 50,
    cy: 50
}, {
    cx: 175,
    cy: 50
}, {
    cx: 300,
    cy: 50
}, {
    cx: 90,
    cy: 110
},
{
    cx: 175,
    cy: 110
}, {
    cx: 260,
    cy: 110
}, {
    cx: 130,
    cy: 170
}, {
    cx: 175,
    cy: 170
}, {
    cx: 220,
    cy: 170
}, {
    cx: 50,
    cy: 230
}, {
    cx: 90,
    cy: 230
}, {
    cx: 130,
    cy: 230
}, {
    cx: 220,
    cy: 230
},
{
    cx: 260,
    cy: 230
}, {
    cx: 300,
    cy: 230
},
{
    cx: 130,
    cy: 290
}, {
    cx: 175,
    cy: 290
}, {
    cx: 220,
    cy: 290
}, {
    cx: 90,
    cy: 350
}, {
    cx: 175,
    cy: 350
}, {
    cx: 260,
    cy: 350
}, {
    cx: 50,
    cy: 410
}, {
    cx: 175,
    cy: 410
}, {
    cx: 300,
    cy: 410
}
]

function GameBoard() {
    const { gameBoard, setGameBoard, currentUser } = useStore();
    const [turn, setTurn] = useState(currentUser === 'host');
    const [checkers, setCheckers] = useState(9);
    const [specialIndices, setSpecialIndices] = useState([]);
    const [audio] = useState(new Audio('/audio/tap-sound.mp3'));
    const [successAudio] = useState(new Audio('/audio/success-trio.mp3'));

    useEffect(() => {
        socket.on('move-registered', gameInfo => {
            audio.play();
            setGameBoard(gameInfo.boardState);
            setTurn(gameInfo.turn === currentUser ? true : false)
            if (gameInfo?.special) {
                // play music
                successAudio.play();
                setSpecialIndices(gameInfo?.indices);
            } else {
                setSpecialIndices([])
            }
        });
    }, [audio, successAudio]);

    const handleClick = (index) => {
        if (!turn) return;

        if (checkers > 0) {
            socket.emit('game-move', {
                roomName: window.location.href.split('/')[4],
                moveInfo: {
                    moveType: 'setup',
                    indices: [index]
                }
            });
            setCheckers(checkers - 1);
            return;
        }

        // if (specialIndices.length > 0) {
        //     socket.emit('game-move', {
        //         roomName: window.location.href.split('/')[4],
        //         moveInfo: {
        //             moveType: 'capture',
        //             indices: [index]
        //         }
        //     });
        // }
    }

    return (
        <div className="grid h-screen w-full place-content-center bg-gray-800">
            <svg width="350" height="500" xmlns="http://www.w3.org/2000/svg" className="scale-[1.2] rounded bg-white shadow-md">
                {circles.map((circle, index) => <circle onClick={() => handleClick(index)} className={'cursor-pointer'} style={{ pointerEvents: 'all' }} key={index} cx={circle.cx} cy={circle.cy} r="10" fill={gameBoard[index] === 'host' ? 'yellow' : (gameBoard[index] === 'guest' ? 'blue' : 'none')} stroke={specialIndices.includes(index) ? 'red' : 'blue'} strokeWidth="1.5" />)}

                <line x1="60" y1="50" x2="165" y2="50" stroke="black" strokeWidth="1.2" />
                <line x1="185" y1="50" x2="290" y2="50" stroke="black" strokeWidth="1.2" />
                <line x1="100" y1="110" x2="165" y2="110" stroke="black" strokeWidth="1.2" />
                <line x1="185" y1="110" x2="250" y2="110" stroke="black" strokeWidth="1.2" />
                <line x1="140" y1="170" x2="165" y2="170" stroke="black" strokeWidth="1.2" />
                <line x1="185" y1="170" x2="210" y2="170" stroke="black" strokeWidth="1.2" />
                <line x1="60" y1="230" x2="80" y2="230" stroke="black" strokeWidth="1.2" />
                <line x1="100" y1="230" x2="120" y2="230" stroke="black" strokeWidth="1.2" />
                <line x1="230" y1="230" x2="250" y2="230" stroke="black" strokeWidth="1.2" />
                <line x1="270" y1="230" x2="290" y2="230" stroke="black" strokeWidth="1.2" />
                <line x1="140" y1="290" x2="165" y2="290" stroke="black" strokeWidth="1.2" />
                <line x1="185" y1="290" x2="210" y2="290" stroke="black" strokeWidth="1.2" />
                <line x1="100" y1="350" x2="165" y2="350" stroke="black" strokeWidth="1.2" />
                <line x1="185" y1="350" x2="250" y2="350" stroke="black" strokeWidth="1.2" />
                <line x1="60" y1="410" x2="167" y2="410" stroke="black" strokeWidth="1.2" />
                <line x1="183" y1="410" x2="290" y2="410" stroke="black" strokeWidth="1.2" />
                <line x1="50" y1="60" x2="50" y2="220" stroke="black" strokeWidth="1.2" />
                <line x1="50" y1="240" x2="50" y2="400" stroke="black" strokeWidth="1.2" />
                <line x1="175" y1="60" x2="175" y2="100" stroke="black" strokeWidth="1.2" />
                <line x1="175" y1="120" x2="175" y2="160" stroke="black" strokeWidth="1.2" />
                <line x1="90" y1="120" x2="90" y2="220" stroke="black" strokeWidth="1.2" />
                <line x1="90" y1="240" x2="90" y2="340" stroke="black" strokeWidth="1.2" />
                <line x1="130" y1="180" x2="130" y2="220" stroke="black" strokeWidth="1.2" />
                <line x1="130" y1="240" x2="130" y2="280" stroke="black" strokeWidth="1.2" />
                <line x1="220" y1="180" x2="220" y2="220" stroke="black" strokeWidth="1.2" />
                <line x1="220" y1="240" x2="220" y2="280" stroke="black" strokeWidth="1.2" />
                <line x1="260" y1="120" x2="260" y2="220" stroke="black" strokeWidth="1.2" />
                <line x1="260" y1="240" x2="260" y2="340" stroke="black" strokeWidth="1.2" />
                <line x1="300" y1="60" x2="300" y2="220" stroke="black" strokeWidth="1.2" />
                <line x1="300" y1="240" x2="300" y2="400" stroke="black" strokeWidth="1.2" />
                <line x1="175" y1="300" x2="175" y2="340" stroke="black" strokeWidth="1.2" />
                <line x1="175" y1="360" x2="175" y2="400" stroke="black" strokeWidth="1.2" />
            </svg>
            <div className=' text-white relative top-36 z-20 text-center'>
                {turn ? '' : 'waiting for opponent!'}
            </div>
        </div>
    )
}

GameBoard.propTypes = {
    gameBoardArray: PropTypes.array
}

export default GameBoard
