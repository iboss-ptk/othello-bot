const MAX_DEPTH = 8;
const ALPHA = -Infinity;
const BETA = Infinity;

/**
 * Two options avilable: 1 and -1
 * color is used to determine to which player's point of view
 * on a particular depth the calculation belongs
 */
const COLOR = 1;

/**
 * negamax() returns an object consist of
 * value:int and move:Object
 * which has the best heuristic value 
 * among all child nodes
 *
 * @param {Object} state of the game
 * @param {Int} depth of current iteration
 * @param {Int} alpha value boundary
 * @param {Int} beta value boundary
 * @param {Int} indicator the player's point of view
 * @return {Object}
 */

function negamax(gameTree, depth=MAX_DEPTH, alpha=ALPHA, beta=BETA, color=COLOR) {
  if ( depth === 0 || gameTree.moves.length === 0) {
    return {
      move: null, // TODO: check pass condition
      value: color * heuristic(gameTree)
    };
  }

  let bestMove = {
    move: gameTree.moves[0],
    value: -Infinity
  };

  for( let index in gameTree.moves ) {
    let move = gameTree.moves[index];
    let value = -negamax(
      othello.force(move.gameTreePromise), depth - 1, -beta, -alpha, -color).value;

    bestMove = value > bestMove.value ? { move, value } : bestMove;
    alpha = Math.max( alpha, value );

    if ( alpha >= beta ) {
      break;
    }
  }

  return bestMove;
}

/**
 * heuristic() returns score of a game state
 * to indicate if a particular game state good
 * for a player
 *
 * @param {Object} state of the game
 * @return {int}
 */

function heuristic(gameTree) {
  let currentPlayer = gameTree.player;
  let chipCount = 0;
  for( let index in gameTree.board ) {
    if( gameTree.board[index] === currentPlayer ){
      chipCount = chipCount + 1;
    }
  }
  return chipCount;
}

