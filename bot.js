"use strict";

var MAX_DEPTH = 8;
var ALPHA = -Infinity;
var BETA = Infinity;

/**
 * Two options avilable: 1 and -1
 * color is used to determine to which player's point of view
 * on a particular depth the calculation belongs
 */
var COLOR = 1;

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

function negamax(gameTree) {
  var depth = arguments.length <= 1 || arguments[1] === undefined ? MAX_DEPTH : arguments[1];
  var alpha = arguments.length <= 2 || arguments[2] === undefined ? ALPHA : arguments[2];
  var beta = arguments.length <= 3 || arguments[3] === undefined ? BETA : arguments[3];
  var color = arguments.length <= 4 || arguments[4] === undefined ? COLOR : arguments[4];

  if (depth === 0 || gameTree.moves.length === 0) {
    return {
      move: null, // TODO: check pass condition
      value: color * heuristic(gameTree)
    };
  }

  var bestMove = {
    move: gameTree.moves[0],
    value: -Infinity
  };

  for (var index in gameTree.moves) {
    var move = gameTree.moves[index];
    var value = -negamax(othello.force(move.gameTreePromise), depth - 1, -beta, -alpha, -color).value;

    bestMove = value > bestMove.value ? { move: move, value: value } : bestMove;
    alpha = Math.max(alpha, value);

    if (alpha >= beta) {
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
  var currentPlayer = gameTree.player;
  var chipCount = 0;
  for (var index in gameTree.board) {
    if (gameTree.board[index] === currentPlayer) {
      chipCount = chipCount + 1;
    }
  }
  return chipCount;
}
"use strict";

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

function findTheBestMove(gameTree) {
  var bestMove = negamax(gameTree);
  console.log(bestMove.value);
  return bestMove.move;
}

/******** registering AI ********/

othello.registerAI({
  findTheBestMove: findTheBestMove
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5lZ2FtYXguanMiLCJtYWluLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDOUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJib3QuanMiLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBzdHJpY3RcIjtcblxudmFyIE1BWF9ERVBUSCA9IDg7XG52YXIgQUxQSEEgPSAtSW5maW5pdHk7XG52YXIgQkVUQSA9IEluZmluaXR5O1xuXG4vKipcbiAqIFR3byBvcHRpb25zIGF2aWxhYmxlOiAxIGFuZCAtMVxuICogY29sb3IgaXMgdXNlZCB0byBkZXRlcm1pbmUgdG8gd2hpY2ggcGxheWVyJ3MgcG9pbnQgb2Ygdmlld1xuICogb24gYSBwYXJ0aWN1bGFyIGRlcHRoIHRoZSBjYWxjdWxhdGlvbiBiZWxvbmdzXG4gKi9cbnZhciBDT0xPUiA9IDE7XG5cbi8qKlxuICogbmVnYW1heCgpIHJldHVybnMgYW4gb2JqZWN0IGNvbnNpc3Qgb2ZcbiAqIHZhbHVlOmludCBhbmQgbW92ZTpPYmplY3RcbiAqIHdoaWNoIGhhcyB0aGUgYmVzdCBoZXVyaXN0aWMgdmFsdWUgXG4gKiBhbW9uZyBhbGwgY2hpbGQgbm9kZXNcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gc3RhdGUgb2YgdGhlIGdhbWVcbiAqIEBwYXJhbSB7SW50fSBkZXB0aCBvZiBjdXJyZW50IGl0ZXJhdGlvblxuICogQHBhcmFtIHtJbnR9IGFscGhhIHZhbHVlIGJvdW5kYXJ5XG4gKiBAcGFyYW0ge0ludH0gYmV0YSB2YWx1ZSBib3VuZGFyeVxuICogQHBhcmFtIHtJbnR9IGluZGljYXRvciB0aGUgcGxheWVyJ3MgcG9pbnQgb2Ygdmlld1xuICogQHJldHVybiB7T2JqZWN0fVxuICovXG5cbmZ1bmN0aW9uIG5lZ2FtYXgoZ2FtZVRyZWUpIHtcbiAgdmFyIGRlcHRoID0gYXJndW1lbnRzLmxlbmd0aCA8PSAxIHx8IGFyZ3VtZW50c1sxXSA9PT0gdW5kZWZpbmVkID8gTUFYX0RFUFRIIDogYXJndW1lbnRzWzFdO1xuICB2YXIgYWxwaGEgPSBhcmd1bWVudHMubGVuZ3RoIDw9IDIgfHwgYXJndW1lbnRzWzJdID09PSB1bmRlZmluZWQgPyBBTFBIQSA6IGFyZ3VtZW50c1syXTtcbiAgdmFyIGJldGEgPSBhcmd1bWVudHMubGVuZ3RoIDw9IDMgfHwgYXJndW1lbnRzWzNdID09PSB1bmRlZmluZWQgPyBCRVRBIDogYXJndW1lbnRzWzNdO1xuICB2YXIgY29sb3IgPSBhcmd1bWVudHMubGVuZ3RoIDw9IDQgfHwgYXJndW1lbnRzWzRdID09PSB1bmRlZmluZWQgPyBDT0xPUiA6IGFyZ3VtZW50c1s0XTtcblxuICBpZiAoZGVwdGggPT09IDAgfHwgZ2FtZVRyZWUubW92ZXMubGVuZ3RoID09PSAwKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG1vdmU6IG51bGwsIC8vIFRPRE86IGNoZWNrIHBhc3MgY29uZGl0aW9uXG4gICAgICB2YWx1ZTogY29sb3IgKiBoZXVyaXN0aWMoZ2FtZVRyZWUpXG4gICAgfTtcbiAgfVxuXG4gIHZhciBiZXN0TW92ZSA9IHtcbiAgICBtb3ZlOiBnYW1lVHJlZS5tb3Zlc1swXSxcbiAgICB2YWx1ZTogLUluZmluaXR5XG4gIH07XG5cbiAgZm9yICh2YXIgaW5kZXggaW4gZ2FtZVRyZWUubW92ZXMpIHtcbiAgICB2YXIgbW92ZSA9IGdhbWVUcmVlLm1vdmVzW2luZGV4XTtcbiAgICB2YXIgdmFsdWUgPSAtbmVnYW1heChvdGhlbGxvLmZvcmNlKG1vdmUuZ2FtZVRyZWVQcm9taXNlKSwgZGVwdGggLSAxLCAtYmV0YSwgLWFscGhhLCAtY29sb3IpLnZhbHVlO1xuXG4gICAgYmVzdE1vdmUgPSB2YWx1ZSA+IGJlc3RNb3ZlLnZhbHVlID8geyBtb3ZlOiBtb3ZlLCB2YWx1ZTogdmFsdWUgfSA6IGJlc3RNb3ZlO1xuICAgIGFscGhhID0gTWF0aC5tYXgoYWxwaGEsIHZhbHVlKTtcblxuICAgIGlmIChhbHBoYSA+PSBiZXRhKSB7XG4gICAgICBicmVhaztcbiAgICB9XG4gIH1cblxuICByZXR1cm4gYmVzdE1vdmU7XG59XG5cbi8qKlxuICogaGV1cmlzdGljKCkgcmV0dXJucyBzY29yZSBvZiBhIGdhbWUgc3RhdGVcbiAqIHRvIGluZGljYXRlIGlmIGEgcGFydGljdWxhciBnYW1lIHN0YXRlIGdvb2RcbiAqIGZvciBhIHBsYXllclxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBzdGF0ZSBvZiB0aGUgZ2FtZVxuICogQHJldHVybiB7aW50fVxuICovXG5cbmZ1bmN0aW9uIGhldXJpc3RpYyhnYW1lVHJlZSkge1xuICB2YXIgY3VycmVudFBsYXllciA9IGdhbWVUcmVlLnBsYXllcjtcbiAgdmFyIGNoaXBDb3VudCA9IDA7XG4gIGZvciAodmFyIGluZGV4IGluIGdhbWVUcmVlLmJvYXJkKSB7XG4gICAgaWYgKGdhbWVUcmVlLmJvYXJkW2luZGV4XSA9PT0gY3VycmVudFBsYXllcikge1xuICAgICAgY2hpcENvdW50ID0gY2hpcENvdW50ICsgMTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGNoaXBDb3VudDtcbn0iLCJcInVzZSBzdHJpY3RcIjtcblxuLyoqXG4gKiBAZGVwZW5kZW5jaWVzXG4gKiAtIG5lZ2FtYXguanNcbiAqL1xuXG4vKipcbiAqIGZpbmRUaGVCZXN0TW92ZSgpIHJldHVybnMgdGhlIGJlc3QgcG9zc2libGUgbW92ZVxuICogc2VsZWN0ZWQgYnkgYSBnaXZlbiBzdHJhdGVneSBcbiAqIFxuICogQHBhcmFtIHtPYmplY3R9IHN0YXRlIG9mIHRoZSBnYW1lXG4gKiBAcmV0dXJuIHtPYmplY3R9XG4gKiBcbiAqL1xuXG5mdW5jdGlvbiBmaW5kVGhlQmVzdE1vdmUoZ2FtZVRyZWUpIHtcbiAgdmFyIGJlc3RNb3ZlID0gbmVnYW1heChnYW1lVHJlZSk7XG4gIGNvbnNvbGUubG9nKGJlc3RNb3ZlLnZhbHVlKTtcbiAgcmV0dXJuIGJlc3RNb3ZlLm1vdmU7XG59XG5cbi8qKioqKioqKiByZWdpc3RlcmluZyBBSSAqKioqKioqKi9cblxub3RoZWxsby5yZWdpc3RlckFJKHtcbiAgZmluZFRoZUJlc3RNb3ZlOiBmaW5kVGhlQmVzdE1vdmVcbn0pOyJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
