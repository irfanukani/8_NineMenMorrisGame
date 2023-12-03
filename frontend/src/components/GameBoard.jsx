import { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import useStore from '../state/gameState'
import socket from '../socket'
import Timer from './Timer'
import { useNavigate } from 'react-router-dom'

const circles = [
  {
    cx: 50,
    cy: 50,
  },
  {
    cx: 175,
    cy: 50,
  },
  {
    cx: 300,
    cy: 50,
  },
  {
    cx: 90,
    cy: 110,
  },
  {
    cx: 175,
    cy: 110,
  },
  {
    cx: 260,
    cy: 110,
  },
  {
    cx: 130,
    cy: 170,
  },
  {
    cx: 175,
    cy: 170,
  },
  {
    cx: 220,
    cy: 170,
  },
  {
    cx: 50,
    cy: 230,
  },
  {
    cx: 90,
    cy: 230,
  },
  {
    cx: 130,
    cy: 230,
  },
  {
    cx: 220,
    cy: 230,
  },
  {
    cx: 260,
    cy: 230,
  },
  {
    cx: 300,
    cy: 230,
  },
  {
    cx: 130,
    cy: 290,
  },
  {
    cx: 175,
    cy: 290,
  },
  {
    cx: 220,
    cy: 290,
  },
  {
    cx: 90,
    cy: 350,
  },
  {
    cx: 175,
    cy: 350,
  },
  {
    cx: 260,
    cy: 350,
  },
  {
    cx: 50,
    cy: 410,
  },
  {
    cx: 175,
    cy: 410,
  },
  {
    cx: 300,
    cy: 410,
  },
]

function GameBoard() {
  const { gameBoard, setGameBoard, currentUser } = useStore()
  const [turn, setTurn] = useState(currentUser === 'host')
  const [checkers, setCheckers] = useState(9)
  const [specialIndices, setSpecialIndices] = useState([])
  const [audio] = useState(new Audio('/audio/tap-sound.mp3'))
  const [successAudio] = useState(new Audio('/audio/success-trio.mp3'))
  const [winAudio] = useState(new Audio('/audio/win-music.mp3'))
  const [loseAudio] = useState(new Audio('/audio/lose-music.mp3'))
  const [indices, setIndices] = useState([])
  const [hostTime, setHostTime] = useState(0)
  const [guestTime, setGuestTime] = useState(0)
  const [betAmount, setBetAmount] = useState()

  useEffect(() => {
    socket.on('move-registered', (gameInfo) => {
      audio.play()
      setGameBoard(gameInfo.boardState)
      setTurn(gameInfo.turn === currentUser ? true : false)
      if (gameInfo?.special) {
        // play music
        successAudio.play()
        setSpecialIndices(gameInfo?.indices)
      } else {
        setSpecialIndices([])
      }
    })

    socket.on('game-over', (gameInfo) => {
      // gameInfo.winner won!
      if (checkers == 0 && gameInfo.winner === currentUser) {
        winAudio.play()
      } else if (checkers == 0 && gameInfo.winner !== currentUser) {
        loseAudio.play()
      }
    })
    socket.on(`game-time-update`, (timerInfo) => {
      if (currentUser === timerInfo.player) {
        setHostTime(timerInfo.timer)
      } else {
        setGuestTime(timerInfo.timer)
      }
    })
    socket.on('room-info', (roomInfo) => {
      setBetAmount(roomInfo.betAmount)
      setHostTime(roomInfo.gameTimer)
      setGuestTime(roomInfo.gameTimer)
      setGameBoard(roomInfo.boardState)
    })
  }, [
    audio,
    successAudio,
    currentUser,
    setGameBoard,
    checkers,
    winAudio,
    loseAudio,
  ])

  const handleClick = (index) => {
    if (!turn) return

    // special case happened [a trio matched, capture!]
    if (specialIndices.length) {
      socket.emit('game-move', {
        roomName: window.location.href.split('/')[4],
        moveInfo: {
          moveType: 'capture',
          indices: [index],
        },
      })
      return
    }

    // set up phase is going on
    if (checkers > 0) {
      // It's a normal setup move!
      socket.emit('game-move', {
        roomName: window.location.href.split('/')[4],
        moveInfo: {
          moveType: 'setup',
          indices: [index],
        },
      })

      setCheckers(checkers - 1)
      return
    }

    // slide move - first click!
    // check if it is on a checker which is owned by current user!!
    if (gameBoard[index] === currentUser) {
      setIndices([index])
    } else {
      socket.emit('game-move', {
        roomName: window.location.href.split('/')[4],
        moveInfo: {
          moveType: 'slide',
          indices: [...indices, index],
        },
      })
      setIndices([])
    }
  }

  const navigate = useNavigate()

  useEffect(() => {
    socket.emit('get-room-info', {
      roomName: window.location.href.split('/')[4],
    })

    socket.on('player-disconnect', () => {
      winAudio.play()
      navigate('/')
    })

    // return () => {
    //   socket.emit('player-disconnect', {
    //     roomName: window.location.href.split('/')[4],
    //   })
    // }
  }, [navigate, winAudio])

  return (
    <div className="grid h-screen w-full place-content-center bg-gray-800">
      <div className="fixed w-full h-28 text-white place-content-center grid text-2xl lg:text-4xl">
        Bet Amount : {betAmount}
        <div className="flex gap-4 items-center">
          {'Opponent'}
          <Timer seconds={guestTime} user={currentUser} />
        </div>
      </div>
      <svg
        width="350"
        height="480"
        xmlns="http://www.w3.org/2000/svg"
        className="md:scale-[1.35] xl:scale-[1.5] rounded bg-white shadow-md gamified"
      >
        {circles.map((circle, index) => (
          <circle
            onClick={() => handleClick(index)}
            className={'cursor-pointer'}
            style={{ pointerEvents: 'all' }}
            key={index}
            cx={circle.cx}
            cy={circle.cy}
            r="10"
            fill={
              gameBoard[index] === 'host'
                ? 'yellow'
                : gameBoard[index] === 'guest'
                ? 'blue'
                : 'none'
            }
            stroke={
              specialIndices.includes(index)
                ? 'red'
                : indices.includes(index)
                ? 'green'
                : 'blue'
            }
            strokeWidth={
              specialIndices.includes(index)
                ? '2'
                : indices.includes(index)
                ? '2'
                : '1.5'
            }
          />
        ))}

        <line
          x1="60"
          y1="50"
          x2="165"
          y2="50"
          stroke="black"
          strokeWidth="1.2"
        />
        <line
          x1="185"
          y1="50"
          x2="290"
          y2="50"
          stroke="black"
          strokeWidth="1.2"
        />
        <line
          x1="100"
          y1="110"
          x2="165"
          y2="110"
          stroke="black"
          strokeWidth="1.2"
        />
        <line
          x1="185"
          y1="110"
          x2="250"
          y2="110"
          stroke="black"
          strokeWidth="1.2"
        />
        <line
          x1="140"
          y1="170"
          x2="165"
          y2="170"
          stroke="black"
          strokeWidth="1.2"
        />
        <line
          x1="185"
          y1="170"
          x2="210"
          y2="170"
          stroke="black"
          strokeWidth="1.2"
        />
        <line
          x1="60"
          y1="230"
          x2="80"
          y2="230"
          stroke="black"
          strokeWidth="1.2"
        />
        <line
          x1="100"
          y1="230"
          x2="120"
          y2="230"
          stroke="black"
          strokeWidth="1.2"
        />
        <line
          x1="230"
          y1="230"
          x2="250"
          y2="230"
          stroke="black"
          strokeWidth="1.2"
        />
        <line
          x1="270"
          y1="230"
          x2="290"
          y2="230"
          stroke="black"
          strokeWidth="1.2"
        />
        <line
          x1="140"
          y1="290"
          x2="165"
          y2="290"
          stroke="black"
          strokeWidth="1.2"
        />
        <line
          x1="185"
          y1="290"
          x2="210"
          y2="290"
          stroke="black"
          strokeWidth="1.2"
        />
        <line
          x1="100"
          y1="350"
          x2="165"
          y2="350"
          stroke="black"
          strokeWidth="1.2"
        />
        <line
          x1="185"
          y1="350"
          x2="250"
          y2="350"
          stroke="black"
          strokeWidth="1.2"
        />
        <line
          x1="60"
          y1="410"
          x2="167"
          y2="410"
          stroke="black"
          strokeWidth="1.2"
        />
        <line
          x1="183"
          y1="410"
          x2="290"
          y2="410"
          stroke="black"
          strokeWidth="1.2"
        />
        <line
          x1="50"
          y1="60"
          x2="50"
          y2="220"
          stroke="black"
          strokeWidth="1.2"
        />
        <line
          x1="50"
          y1="240"
          x2="50"
          y2="400"
          stroke="black"
          strokeWidth="1.2"
        />
        <line
          x1="175"
          y1="60"
          x2="175"
          y2="100"
          stroke="black"
          strokeWidth="1.2"
        />
        <line
          x1="175"
          y1="120"
          x2="175"
          y2="160"
          stroke="black"
          strokeWidth="1.2"
        />
        <line
          x1="90"
          y1="120"
          x2="90"
          y2="220"
          stroke="black"
          strokeWidth="1.2"
        />
        <line
          x1="90"
          y1="240"
          x2="90"
          y2="340"
          stroke="black"
          strokeWidth="1.2"
        />
        <line
          x1="130"
          y1="180"
          x2="130"
          y2="220"
          stroke="black"
          strokeWidth="1.2"
        />
        <line
          x1="130"
          y1="240"
          x2="130"
          y2="280"
          stroke="black"
          strokeWidth="1.2"
        />
        <line
          x1="220"
          y1="180"
          x2="220"
          y2="220"
          stroke="black"
          strokeWidth="1.2"
        />
        <line
          x1="220"
          y1="240"
          x2="220"
          y2="280"
          stroke="black"
          strokeWidth="1.2"
        />
        <line
          x1="260"
          y1="120"
          x2="260"
          y2="220"
          stroke="black"
          strokeWidth="1.2"
        />
        <line
          x1="260"
          y1="240"
          x2="260"
          y2="340"
          stroke="black"
          strokeWidth="1.2"
        />
        <line
          x1="300"
          y1="60"
          x2="300"
          y2="220"
          stroke="black"
          strokeWidth="1.2"
        />
        <line
          x1="300"
          y1="240"
          x2="300"
          y2="400"
          stroke="black"
          strokeWidth="1.2"
        />
        <line
          x1="175"
          y1="300"
          x2="175"
          y2="340"
          stroke="black"
          strokeWidth="1.2"
        />
        <line
          x1="175"
          y1="360"
          x2="175"
          y2="400"
          stroke="black"
          strokeWidth="1.2"
        />
      </svg>
      <div className="fixed bottom-0 w-full bg-yellow-400  h-20 text-white place-content-center grid text-2xl lg:text-4xl">
        <div className="flex gap-4 items-center">
          {currentUser}
          <Timer
            seconds={hostTime}
            user={currentUser === 'host' ? 'guest' : 'host'}
          />
        </div>
      </div>
    </div>
  )
}

GameBoard.propTypes = {
  gameBoardArray: PropTypes.array,
}

export default GameBoard
