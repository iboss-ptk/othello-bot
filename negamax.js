/**
 * theNextBot() returns next move of the game
 * 
 * @param {GameTree} gameTree
 * @return {function} selected move
 */

function theNextBot (gameTree) {
  gameTree.moves.forEach(function(move) {
    console.log(move.gameTreePromise());
  });

  return gameTree.moves[Math.floor(Math.random() * gameTree.moves.length)];
}


/******** registering AI ********/

othello.registerAI({
  findTheBestMove: theNextBot
});