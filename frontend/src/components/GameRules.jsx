export default function GameRules() {
  return (
    <section className="bg-gray-800 h-screen w-full bg-yellow-100 bg-white text-gray-900 p-8">
      <h1 className='text-center text-2xl py-4 underline'>Nine Men's Morris Game Rules</h1>
      <p>
        <strong className='underline'>Criteria:-</strong> 
        <p>
        The crietria of Nine Men's Morris game is to
        create a line of three of your pieces (called "mills") on the board
        while preventing your opponent from doing the same.
        </p>
      </p>

      <p className='my-4'>
        <strong className='underline'>Overview:-</strong>
        <p>
        This game is played on a board with 24 circles connected by lines,
        forming an inner square, a middle square, and an outer square. This
        creates a total of 24 intersections or points. Each player begins with
        nine pieces of one color (typically, one player's pieces are white, and
        the other's are black).
        </p>
      </p>

      <p className='my-4'>
        <strong className='underline'>Stages of the Game:-</strong> Nine Men's Morris is played in two
        main stages:-
      </p>

      <ul>
        <li>
          <strong>stage 1 - Placing Pieces:</strong>
          <ol>
            <li>
              Players take turns placing their pieces on empty intersections.
              This continues until all 18 pieces are on the board.
            </li>
            <li>Once all the pieces are placed, players move on to stage 2.</li>
          </ol>
        </li>

        <li className='my-4'>
          <strong>stage 2 - Moving Pieces:</strong>
          <ol>
            <li>
              During this stage, players take turns moving one of their pieces
              to an adjacent empty point connected by a line.
            </li>
            <li>
              The pieces can only move to adjacent points along the lines.
            </li>
            <li>
              Players can't jump over or occupy points that are already occupied
              by their own pieces.
            </li>
          </ol>
        </li>
      </ul>

      <p>
        <strong className='underline'>Creating Mills:</strong>
        <br />
        If a player forms a line of three of their pieces along a straight line
        on the board (a "mill"), they remove one of their opponent's pieces from
        the board. The removed piece is out of the game and cannot be used
        again. Mills can be formed horizontally or vertically but not
        diagonally.
      </p>

      <p className='py-4'>
        <strong className='underline'>Loosing condition:</strong>
        The game continues until one of the following conditions is met:-
      </p>

      <ul>
        <li>
          A player is reduced to only two pieces and is unable to form a mill.
          In this case, he/she lose the game.
        </li>
        <li>
          A player is unable to make a legal move (all their pieces are
          blocked). In this case, he/she lose the game.
        </li>
      </ul>

      <p className='py-4'>
        <strong className='underline'>Rules:</strong>
      </p>
      <ul>
        <li>
          Once a player has only three pieces left, they can "fly" their pieces
          to any empty point on the board during the movement stage.
        </li>
        <li>
          Players cannot break and reform the same mill in consecutive turns to
          remove two pieces in one turn.
        </li>
        <li>
          The game can result in a draw if the same board position occurs three
          times in a row.
        </li>
      </ul>

      <p>
        <strong>Winning Condition:</strong>
        The player who successfully forms a mill and captures enough of their
        opponent's pieces to reduce their count to two or blocks all their
        opponent's moves wins the game.
      </p>
    </section>
  )
}
