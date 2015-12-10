#Othello Bot
(ชื่อชั่วคราว)

เป็นบอทเกม othello ที่เขียนขึ้นด้วยภาษา javascript เพื่อให้ใช้กับ platform [kana othello-js](http://kana.github.io/othello-js/) ซึ่งรองรับ custom AI

##setup
```bash
$ npm install -g gulp
$ npm install
$ gulp build
$ gulp watch
```

จากนั้นเปิด terminal/cmd อีกหน้าเพื่อรัน web sever

```bash
$ gulp serve
```

จะพบโค้ดที่ build แล้วอยู่ที่ http://localhost:3000/bot.js ให้ copy ไป Add new AI ใน http://kana.github.io/othello-js/

#kana othello-js

ตัวอย่างการสร้าง random bot

```javascript
othello.registerAI({
  findTheBestMove: function (gameTree) {
    return gameTree.moves[Math.floor(Math.random() * gameTree.moves.length)];
  }
});
```
โค้ดที่เห็นเป็นการสุ่มเลือกหนึ่งตาเดินจากทุก ๆ ทางเลือกที่เป็นไปได้ และ return ตาเดินนั้น ๆ ออกไป

จะเห็นได้ว่า function `findTheBestMove` จะมี parameter อยู่ตัวหนึ่งชื่อว่า `gameTree` ซึ่งตัว gameTree เป็น Object ที่ประกอบไปด้วย

* `board`
* `player`
* `moves`

ซึ่งกล่าวได้ว่า gameTree ก็คือ state ของ game นั่นเอง

###gameTree.board
เป็น array ขนาด 64 (8x8) ช่อง ซึ่งแต่ละช่อง มี element ที่เป็นไปได้คือ `BLACK`, `WHITE` หรือ `EMPTY` ซึ่งเป็น constant (ใน javascript ตั้งแต่ es5 ลงไปยังไม่มี constant จริงๆ ที่เห็นยังเป็นแค่ convention ให้รู้ว่าอย่าไปแก้ค่ามัน) ถ้าจะเปรียบเทียบ ให้ใช้ `othello.BLACK` เป็นต้น เช่น

```javascript
var n = Math.floor(Math.random() * gameTree.board.length;
if (gameTree.board[n] === othello.BLACK) {
  // ...
}
```

###gameTree.player
เป็นผู้เล่นในรอบนั้น ๆ ซึ่งประกอบไปด้วย `othello.BLACK` และ `othello.WHITE`

###gameTree.moves
เป็น array ของตาเดินที่เป็นไปได้ทั้งหมดของผู้เล่นใน state ของ game ปัจจุบัน ซึ่งประกอบไปด้วย

* `x`และ `y` เป็นคู่อันดับของตำแหน่งที่สามารถเดินได้บนกระดาน ซึ่งสามารถคำนวณ index ใน board ได้โดย function `othello.ix(x, y)`
* `gameTreePromise` เป็น promise ของ function ที่สร้าง gameTree ใหม่ขึ้นมาจาก move นั้นๆ ซึ่งสามารถบังคับให้มัน execute function เพื่อสร้าง gameTree ได้เลยโดยใช้ `othello.force(promise)`

##Public API ที่สำคัญ

```
othello.force = force;
othello.delay = delay;
othello.EMPTY = EMPTY;
othello.WHITE = WHITE;
othello.BLACK = BLACK;
othello.nextPlayer = nextPlayer;
othello.registerAI = registerAI;
othello.N = N;
othello.ix = ix;
othello.makeInitialGameBoard = makeInitialGameBoard;
othello.judge = judge;
othello.addNewAI = addNewAI;
othello.makeAI = makeAI;
othello.makeInitialGameTree = makeInitialGameTree;
othello.nameMove = nameMove;
```
