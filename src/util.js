function range(a, b) {
  [a, b] = b > a ? [a, b] : [b, a];
  return Array.apply(null, Array(b - a + 1)).map((e, i) => a + i);
}

function getRegion(x1, y1, x2, y2) {
  return range(y1, y2)
    .map(y => range(x1, x2).map(x => x + y * 8))
    .reduce((acc, curr) => acc.concat(curr), []);
}

function getCorners(x1, y1, x2, y2) {
  let xs = [x1, x2];
  let ys = [y1, y2];
  return xs
    .map(x => ys.map(y => x + y * 8))
    .reduce((acc, curr) => acc.concat(curr), []);
}

function getEdges(x1, y1, x2, y2) {
  let xs = [x1, x2];
  let ys = [y1, y2];
  return xs.map( x=> range(y1,y2).map( y => x + y * 8))
    .reduce((acc, curr) => acc.concat(curr), [])
    .concat(
    ys.map( y=> range(x1,x2).map( x => x + y * 8))
    .reduce((acc, curr) => acc.concat(curr), [])  
    )
    .filter((value,index,self) => self.indexOf(value) === index) //Unique value
    .sort((a,b) => a - b) // sort Number
    ;
}

function getNextMobilityAverage(gameTree){
  let sum = 0;
  for( let index in gameTree.moves ) {
    let move = gameTree.moves[index];
    let value = othello.force(move.gameTreePromise).moves.length;
    sum = sum + value;
  }
  return sum / gameTree.moves.length;
}

function getRiskyCornerRegion() {
  
}
