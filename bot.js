"use strict";

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; })();

function range(a, b) {
  var _ref = b > a ? [a, b] : [b, a];

  var _ref2 = _slicedToArray(_ref, 2);

  a = _ref2[0];
  b = _ref2[1];

  return Array.apply(null, Array(b - a + 1)).map(function (e, i) {
    return a + i;
  });
}

function getRegion(x1, y1, x2, y2) {
  return range(y1, y2).map(function (y) {
    return range(x1, x2).map(function (x) {
      return x + y * 8;
    });
  }).reduce(function (acc, curr) {
    return acc.concat(curr);
  }, []);
}

function getCorners(x1, y1, x2, y2) {
  var xs = [x1, x2];
  var ys = [y1, y2];
  return xs.map(function (x) {
    return ys.map(function (y) {
      return x + y * 8;
    });
  }).reduce(function (acc, curr) {
    return acc.concat(curr);
  }, []);
}

function getEdges(x1, y1, x2, y2) {
  var xs = [x1, x2];
  var ys = [y1, y2];
  return xs.map(function (x) {
    return range(y1, y2).map(function (y) {
      return x + y * 8;
    });
  }).reduce(function (acc, curr) {
    return acc.concat(curr);
  }, []).concat(ys.map(function (y) {
    return range(x1, x2).map(function (x) {
      return x + y * 8;
    });
  }).reduce(function (acc, curr) {
    return acc.concat(curr);
  }, [])).filter(function (value, index, self) {
    return self.indexOf(value) === index;
  }) //Unique value
  .sort(function (a, b) {
    return a - b;
  }) // sort Number
  ;
}

function getNextMobilityAverage(gameTree) {
  var sum = 0;
  for (var index in gameTree.moves) {
    var move = gameTree.moves[index];
    var value = othello.force(move.gameTreePromise).moves.length;
    sum = sum + value;
  }
  return sum / gameTree.moves.length;
}

function getRiskyCornerRegion() {}
"use strict";

/**
 * @dependencies
 * - util.js
 */

var MAX_DEPTH = 4;
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
      move: null,
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
  var bot = gameTree.player;
  var enemy = othello.nextPlayer(bot);

  function parity(w) {
    var botChips = countChips(gameTree.board, bot);
    var enemyChips = countChips(gameTree.board, enemy);

    return w * normalizedScore(botChips, enemyChips);
  }

  function corner(w) {
    var selectedBlocks = getCorners(0, 0, 7, 7);
    var botChips = countChips(gameTree.board, bot, selectedBlocks);
    var enemyChips = countChips(gameTree.board, enemy, selectedBlocks);
    return w * normalizedScore(botChips, enemyChips);
  }

  function mobility(w) {
    var botMobility = gameTree.moves.length;
    var enemyMobility = getNextMobilityAverage(gameTree);
    return w * normalizedScore(botMobility, enemyMobility);
  }

  return parity(1) + corner(10) + mobility(1);
}

function normalizedScore(botChips, enemyChips) {
  if (botChips + enemyChips === 0) {
    return 0;
  }
  return (botChips - enemyChips) / (botChips + enemyChips);
}

function countChips(board, target, selectedBlocks) {
  return board.filter(function (b, i) {
    return selectedBlocks ? selectedBlocks.indexOf(i) !== -1 : true;
  }).filter(function (block) {
    return block === target;
  }).length;
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
  return bestMove.move;
}

/******** registering AI ********/

othello.registerAI({
  findTheBestMove: findTheBestMove
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInV0aWwuanMiLCJuZWdhbWF4LmpzIiwibWFpbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDekVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbEhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiYm90LmpzIiwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBfc2xpY2VkVG9BcnJheSA9IChmdW5jdGlvbiAoKSB7IGZ1bmN0aW9uIHNsaWNlSXRlcmF0b3IoYXJyLCBpKSB7IHZhciBfYXJyID0gW107IHZhciBfbiA9IHRydWU7IHZhciBfZCA9IGZhbHNlOyB2YXIgX2UgPSB1bmRlZmluZWQ7IHRyeSB7IGZvciAodmFyIF9pID0gYXJyW1N5bWJvbC5pdGVyYXRvcl0oKSwgX3M7ICEoX24gPSAoX3MgPSBfaS5uZXh0KCkpLmRvbmUpOyBfbiA9IHRydWUpIHsgX2Fyci5wdXNoKF9zLnZhbHVlKTsgaWYgKGkgJiYgX2Fyci5sZW5ndGggPT09IGkpIGJyZWFrOyB9IH0gY2F0Y2ggKGVycikgeyBfZCA9IHRydWU7IF9lID0gZXJyOyB9IGZpbmFsbHkgeyB0cnkgeyBpZiAoIV9uICYmIF9pW1wicmV0dXJuXCJdKSBfaVtcInJldHVyblwiXSgpOyB9IGZpbmFsbHkgeyBpZiAoX2QpIHRocm93IF9lOyB9IH0gcmV0dXJuIF9hcnI7IH0gcmV0dXJuIGZ1bmN0aW9uIChhcnIsIGkpIHsgaWYgKEFycmF5LmlzQXJyYXkoYXJyKSkgeyByZXR1cm4gYXJyOyB9IGVsc2UgaWYgKFN5bWJvbC5pdGVyYXRvciBpbiBPYmplY3QoYXJyKSkgeyByZXR1cm4gc2xpY2VJdGVyYXRvcihhcnIsIGkpOyB9IGVsc2UgeyB0aHJvdyBuZXcgVHlwZUVycm9yKFwiSW52YWxpZCBhdHRlbXB0IHRvIGRlc3RydWN0dXJlIG5vbi1pdGVyYWJsZSBpbnN0YW5jZVwiKTsgfSB9OyB9KSgpO1xuXG5mdW5jdGlvbiByYW5nZShhLCBiKSB7XG4gIHZhciBfcmVmID0gYiA+IGEgPyBbYSwgYl0gOiBbYiwgYV07XG5cbiAgdmFyIF9yZWYyID0gX3NsaWNlZFRvQXJyYXkoX3JlZiwgMik7XG5cbiAgYSA9IF9yZWYyWzBdO1xuICBiID0gX3JlZjJbMV07XG5cbiAgcmV0dXJuIEFycmF5LmFwcGx5KG51bGwsIEFycmF5KGIgLSBhICsgMSkpLm1hcChmdW5jdGlvbiAoZSwgaSkge1xuICAgIHJldHVybiBhICsgaTtcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIGdldFJlZ2lvbih4MSwgeTEsIHgyLCB5Mikge1xuICByZXR1cm4gcmFuZ2UoeTEsIHkyKS5tYXAoZnVuY3Rpb24gKHkpIHtcbiAgICByZXR1cm4gcmFuZ2UoeDEsIHgyKS5tYXAoZnVuY3Rpb24gKHgpIHtcbiAgICAgIHJldHVybiB4ICsgeSAqIDg7XG4gICAgfSk7XG4gIH0pLnJlZHVjZShmdW5jdGlvbiAoYWNjLCBjdXJyKSB7XG4gICAgcmV0dXJuIGFjYy5jb25jYXQoY3Vycik7XG4gIH0sIFtdKTtcbn1cblxuZnVuY3Rpb24gZ2V0Q29ybmVycyh4MSwgeTEsIHgyLCB5Mikge1xuICB2YXIgeHMgPSBbeDEsIHgyXTtcbiAgdmFyIHlzID0gW3kxLCB5Ml07XG4gIHJldHVybiB4cy5tYXAoZnVuY3Rpb24gKHgpIHtcbiAgICByZXR1cm4geXMubWFwKGZ1bmN0aW9uICh5KSB7XG4gICAgICByZXR1cm4geCArIHkgKiA4O1xuICAgIH0pO1xuICB9KS5yZWR1Y2UoZnVuY3Rpb24gKGFjYywgY3Vycikge1xuICAgIHJldHVybiBhY2MuY29uY2F0KGN1cnIpO1xuICB9LCBbXSk7XG59XG5cbmZ1bmN0aW9uIGdldEVkZ2VzKHgxLCB5MSwgeDIsIHkyKSB7XG4gIHZhciB4cyA9IFt4MSwgeDJdO1xuICB2YXIgeXMgPSBbeTEsIHkyXTtcbiAgcmV0dXJuIHhzLm1hcChmdW5jdGlvbiAoeCkge1xuICAgIHJldHVybiByYW5nZSh5MSwgeTIpLm1hcChmdW5jdGlvbiAoeSkge1xuICAgICAgcmV0dXJuIHggKyB5ICogODtcbiAgICB9KTtcbiAgfSkucmVkdWNlKGZ1bmN0aW9uIChhY2MsIGN1cnIpIHtcbiAgICByZXR1cm4gYWNjLmNvbmNhdChjdXJyKTtcbiAgfSwgW10pLmNvbmNhdCh5cy5tYXAoZnVuY3Rpb24gKHkpIHtcbiAgICByZXR1cm4gcmFuZ2UoeDEsIHgyKS5tYXAoZnVuY3Rpb24gKHgpIHtcbiAgICAgIHJldHVybiB4ICsgeSAqIDg7XG4gICAgfSk7XG4gIH0pLnJlZHVjZShmdW5jdGlvbiAoYWNjLCBjdXJyKSB7XG4gICAgcmV0dXJuIGFjYy5jb25jYXQoY3Vycik7XG4gIH0sIFtdKSkuZmlsdGVyKGZ1bmN0aW9uICh2YWx1ZSwgaW5kZXgsIHNlbGYpIHtcbiAgICByZXR1cm4gc2VsZi5pbmRleE9mKHZhbHVlKSA9PT0gaW5kZXg7XG4gIH0pIC8vVW5pcXVlIHZhbHVlXG4gIC5zb3J0KGZ1bmN0aW9uIChhLCBiKSB7XG4gICAgcmV0dXJuIGEgLSBiO1xuICB9KSAvLyBzb3J0IE51bWJlclxuICA7XG59XG5cbmZ1bmN0aW9uIGdldE5leHRNb2JpbGl0eUF2ZXJhZ2UoZ2FtZVRyZWUpIHtcbiAgdmFyIHN1bSA9IDA7XG4gIGZvciAodmFyIGluZGV4IGluIGdhbWVUcmVlLm1vdmVzKSB7XG4gICAgdmFyIG1vdmUgPSBnYW1lVHJlZS5tb3Zlc1tpbmRleF07XG4gICAgdmFyIHZhbHVlID0gb3RoZWxsby5mb3JjZShtb3ZlLmdhbWVUcmVlUHJvbWlzZSkubW92ZXMubGVuZ3RoO1xuICAgIHN1bSA9IHN1bSArIHZhbHVlO1xuICB9XG4gIHJldHVybiBzdW0gLyBnYW1lVHJlZS5tb3Zlcy5sZW5ndGg7XG59XG5cbmZ1bmN0aW9uIGdldFJpc2t5Q29ybmVyUmVnaW9uKCkge30iLCJcInVzZSBzdHJpY3RcIjtcblxuLyoqXG4gKiBAZGVwZW5kZW5jaWVzXG4gKiAtIHV0aWwuanNcbiAqL1xuXG52YXIgTUFYX0RFUFRIID0gNDtcbnZhciBBTFBIQSA9IC1JbmZpbml0eTtcbnZhciBCRVRBID0gSW5maW5pdHk7XG5cbi8qKlxuICogVHdvIG9wdGlvbnMgYXZpbGFibGU6IDEgYW5kIC0xXG4gKiBjb2xvciBpcyB1c2VkIHRvIGRldGVybWluZSB0byB3aGljaCBwbGF5ZXIncyBwb2ludCBvZiB2aWV3XG4gKiBvbiBhIHBhcnRpY3VsYXIgZGVwdGggdGhlIGNhbGN1bGF0aW9uIGJlbG9uZ3NcbiAqL1xudmFyIENPTE9SID0gMTtcblxuLyoqXG4gKiBuZWdhbWF4KCkgcmV0dXJucyBhbiBvYmplY3QgY29uc2lzdCBvZlxuICogdmFsdWU6aW50IGFuZCBtb3ZlOk9iamVjdFxuICogd2hpY2ggaGFzIHRoZSBiZXN0IGhldXJpc3RpYyB2YWx1ZSBcbiAqIGFtb25nIGFsbCBjaGlsZCBub2Rlc1xuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBzdGF0ZSBvZiB0aGUgZ2FtZVxuICogQHBhcmFtIHtJbnR9IGRlcHRoIG9mIGN1cnJlbnQgaXRlcmF0aW9uXG4gKiBAcGFyYW0ge0ludH0gYWxwaGEgdmFsdWUgYm91bmRhcnlcbiAqIEBwYXJhbSB7SW50fSBiZXRhIHZhbHVlIGJvdW5kYXJ5XG4gKiBAcGFyYW0ge0ludH0gaW5kaWNhdG9yIHRoZSBwbGF5ZXIncyBwb2ludCBvZiB2aWV3XG4gKiBAcmV0dXJuIHtPYmplY3R9XG4gKi9cblxuZnVuY3Rpb24gbmVnYW1heChnYW1lVHJlZSkge1xuICB2YXIgZGVwdGggPSBhcmd1bWVudHMubGVuZ3RoIDw9IDEgfHwgYXJndW1lbnRzWzFdID09PSB1bmRlZmluZWQgPyBNQVhfREVQVEggOiBhcmd1bWVudHNbMV07XG4gIHZhciBhbHBoYSA9IGFyZ3VtZW50cy5sZW5ndGggPD0gMiB8fCBhcmd1bWVudHNbMl0gPT09IHVuZGVmaW5lZCA/IEFMUEhBIDogYXJndW1lbnRzWzJdO1xuICB2YXIgYmV0YSA9IGFyZ3VtZW50cy5sZW5ndGggPD0gMyB8fCBhcmd1bWVudHNbM10gPT09IHVuZGVmaW5lZCA/IEJFVEEgOiBhcmd1bWVudHNbM107XG4gIHZhciBjb2xvciA9IGFyZ3VtZW50cy5sZW5ndGggPD0gNCB8fCBhcmd1bWVudHNbNF0gPT09IHVuZGVmaW5lZCA/IENPTE9SIDogYXJndW1lbnRzWzRdO1xuXG4gIGlmIChkZXB0aCA9PT0gMCB8fCBnYW1lVHJlZS5tb3Zlcy5sZW5ndGggPT09IDApIHtcbiAgICByZXR1cm4ge1xuICAgICAgbW92ZTogbnVsbCxcbiAgICAgIHZhbHVlOiBjb2xvciAqIGhldXJpc3RpYyhnYW1lVHJlZSlcbiAgICB9O1xuICB9XG5cbiAgdmFyIGJlc3RNb3ZlID0ge1xuICAgIG1vdmU6IGdhbWVUcmVlLm1vdmVzWzBdLFxuICAgIHZhbHVlOiAtSW5maW5pdHlcbiAgfTtcblxuICBmb3IgKHZhciBpbmRleCBpbiBnYW1lVHJlZS5tb3Zlcykge1xuICAgIHZhciBtb3ZlID0gZ2FtZVRyZWUubW92ZXNbaW5kZXhdO1xuICAgIHZhciB2YWx1ZSA9IC1uZWdhbWF4KG90aGVsbG8uZm9yY2UobW92ZS5nYW1lVHJlZVByb21pc2UpLCBkZXB0aCAtIDEsIC1iZXRhLCAtYWxwaGEsIC1jb2xvcikudmFsdWU7XG5cbiAgICBiZXN0TW92ZSA9IHZhbHVlID4gYmVzdE1vdmUudmFsdWUgPyB7IG1vdmU6IG1vdmUsIHZhbHVlOiB2YWx1ZSB9IDogYmVzdE1vdmU7XG4gICAgYWxwaGEgPSBNYXRoLm1heChhbHBoYSwgdmFsdWUpO1xuXG4gICAgaWYgKGFscGhhID49IGJldGEpIHtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBiZXN0TW92ZTtcbn1cblxuLyoqXG4gKiBoZXVyaXN0aWMoKSByZXR1cm5zIHNjb3JlIG9mIGEgZ2FtZSBzdGF0ZVxuICogdG8gaW5kaWNhdGUgaWYgYSBwYXJ0aWN1bGFyIGdhbWUgc3RhdGUgZ29vZFxuICogZm9yIGEgcGxheWVyXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IHN0YXRlIG9mIHRoZSBnYW1lXG4gKiBAcmV0dXJuIHtpbnR9XG4gKi9cblxuZnVuY3Rpb24gaGV1cmlzdGljKGdhbWVUcmVlKSB7XG4gIHZhciBib3QgPSBnYW1lVHJlZS5wbGF5ZXI7XG4gIHZhciBlbmVteSA9IG90aGVsbG8ubmV4dFBsYXllcihib3QpO1xuXG4gIGZ1bmN0aW9uIHBhcml0eSh3KSB7XG4gICAgdmFyIGJvdENoaXBzID0gY291bnRDaGlwcyhnYW1lVHJlZS5ib2FyZCwgYm90KTtcbiAgICB2YXIgZW5lbXlDaGlwcyA9IGNvdW50Q2hpcHMoZ2FtZVRyZWUuYm9hcmQsIGVuZW15KTtcblxuICAgIHJldHVybiB3ICogbm9ybWFsaXplZFNjb3JlKGJvdENoaXBzLCBlbmVteUNoaXBzKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGNvcm5lcih3KSB7XG4gICAgdmFyIHNlbGVjdGVkQmxvY2tzID0gZ2V0Q29ybmVycygwLCAwLCA3LCA3KTtcbiAgICB2YXIgYm90Q2hpcHMgPSBjb3VudENoaXBzKGdhbWVUcmVlLmJvYXJkLCBib3QsIHNlbGVjdGVkQmxvY2tzKTtcbiAgICB2YXIgZW5lbXlDaGlwcyA9IGNvdW50Q2hpcHMoZ2FtZVRyZWUuYm9hcmQsIGVuZW15LCBzZWxlY3RlZEJsb2Nrcyk7XG4gICAgcmV0dXJuIHcgKiBub3JtYWxpemVkU2NvcmUoYm90Q2hpcHMsIGVuZW15Q2hpcHMpO1xuICB9XG5cbiAgZnVuY3Rpb24gbW9iaWxpdHkodykge1xuICAgIHZhciBib3RNb2JpbGl0eSA9IGdhbWVUcmVlLm1vdmVzLmxlbmd0aDtcbiAgICB2YXIgZW5lbXlNb2JpbGl0eSA9IGdldE5leHRNb2JpbGl0eUF2ZXJhZ2UoZ2FtZVRyZWUpO1xuICAgIHJldHVybiB3ICogbm9ybWFsaXplZFNjb3JlKGJvdE1vYmlsaXR5LCBlbmVteU1vYmlsaXR5KTtcbiAgfVxuXG4gIHJldHVybiBwYXJpdHkoMSkgKyBjb3JuZXIoMTApICsgbW9iaWxpdHkoMSk7XG59XG5cbmZ1bmN0aW9uIG5vcm1hbGl6ZWRTY29yZShib3RDaGlwcywgZW5lbXlDaGlwcykge1xuICBpZiAoYm90Q2hpcHMgKyBlbmVteUNoaXBzID09PSAwKSB7XG4gICAgcmV0dXJuIDA7XG4gIH1cbiAgcmV0dXJuIChib3RDaGlwcyAtIGVuZW15Q2hpcHMpIC8gKGJvdENoaXBzICsgZW5lbXlDaGlwcyk7XG59XG5cbmZ1bmN0aW9uIGNvdW50Q2hpcHMoYm9hcmQsIHRhcmdldCwgc2VsZWN0ZWRCbG9ja3MpIHtcbiAgcmV0dXJuIGJvYXJkLmZpbHRlcihmdW5jdGlvbiAoYiwgaSkge1xuICAgIHJldHVybiBzZWxlY3RlZEJsb2NrcyA/IHNlbGVjdGVkQmxvY2tzLmluZGV4T2YoaSkgIT09IC0xIDogdHJ1ZTtcbiAgfSkuZmlsdGVyKGZ1bmN0aW9uIChibG9jaykge1xuICAgIHJldHVybiBibG9jayA9PT0gdGFyZ2V0O1xuICB9KS5sZW5ndGg7XG59IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qKlxuICogQGRlcGVuZGVuY2llc1xuICogLSBuZWdhbWF4LmpzXG4gKi9cblxuLyoqXG4gKiBmaW5kVGhlQmVzdE1vdmUoKSByZXR1cm5zIHRoZSBiZXN0IHBvc3NpYmxlIG1vdmVcbiAqIHNlbGVjdGVkIGJ5IGEgZ2l2ZW4gc3RyYXRlZ3kgXG4gKiBcbiAqIEBwYXJhbSB7T2JqZWN0fSBzdGF0ZSBvZiB0aGUgZ2FtZVxuICogQHJldHVybiB7T2JqZWN0fVxuICogXG4gKi9cblxuZnVuY3Rpb24gZmluZFRoZUJlc3RNb3ZlKGdhbWVUcmVlKSB7XG4gIHZhciBiZXN0TW92ZSA9IG5lZ2FtYXgoZ2FtZVRyZWUpO1xuICByZXR1cm4gYmVzdE1vdmUubW92ZTtcbn1cblxuLyoqKioqKioqIHJlZ2lzdGVyaW5nIEFJICoqKioqKioqL1xuXG5vdGhlbGxvLnJlZ2lzdGVyQUkoe1xuICBmaW5kVGhlQmVzdE1vdmU6IGZpbmRUaGVCZXN0TW92ZVxufSk7Il0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
