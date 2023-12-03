/* eslint-disable react/prop-types */
function Timer(props) {
  const { seconds, user } = props
  const min = Math.floor(seconds / 60)
  const sec = seconds % 60 < 10 ? '0' + (seconds % 60) : seconds % 60

  return (
    <section className={`p-4 comic-button ${user === 'host' ? 'bg-white' : 'bg-blue-400'}`}>
      <div className={min <= 1 ? 'text-red-600 animate-pulse' : 'text-gray-800'}>
        {min}:{sec}
      </div>
    </section>
  )
}

export default Timer
