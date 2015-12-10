/**
 * @dependencies
 * - negamax.js
 */

/**
 * findTheBestMove() returns the best possible move
 * selected by a given strategy 
 * 
 * @param {Object} state of the game
 * @return {Object}
 * 
 */

function findTheBestMove (gameTree) {
  let bestMove = negamax(gameTree);
  console.log(bestMove.value);
  return bestMove.move;
}


/******** registering AI ********/

othello.registerAI({
  findTheBestMove: findTheBestMove
});
