const { expect } = require('chai')
const io = require('socket.io-client')

const PORT = 3001

describe('Socket.IO Connection', () => {
  let socket

  before((done) => {
    // Connect to the Socket.IO server before running the tests
    socket = io(`http://localhost:${PORT}`)
    socket.on('connect', () => {
      done()
    })
  })

  after((done) => {
    // Disconnect the socket after all tests in this suite
    socket.disconnect()
    done()
  })

  it('should connect to the Socket.IO server', () => {})
})

describe('9-Man Morris Game', () => {
  let socket
  let roomId

  before((done) => {
    socket = io(`http://localhost:${PORT}`)
    socket.on('connect', () => {
      done()
    })
  })

  after((done) => {
    socket.disconnect()
    done()
  })

  it('should create a room and return the room ID', (done) => {
    socket.emit('create-room', { user: 'irfan', betAmount: 500 })
    socket.on('room-created', (uuid) => {
      roomId = uuid
      expect(roomId).to.be.a('string')
      done()
    })
  })

  it('should join a room', (done) => {
    socket.emit('join-room', { roomName: roomId, user: 'anotherPlayer' })
    // Add assertions to verify the joining process here
    done()
  })
})
