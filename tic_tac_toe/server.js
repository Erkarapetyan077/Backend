const net = require("node:net");

const board = new Array(9).fill("_");
let set = new Set();
let gamer = "X";
let GameOver = false;

function sendBoard() {
  for (const player of set) {
    player.write(
      `BOARD|\n` +
        `╔═══╦═══╦═══╗\n` +
        `║ ${board[0]} ║ ${board[1]} ║ ${board[2]} ║\n` +
        `╠═══╬═══╬═══╣\n` +
        `║ ${board[3]} ║ ${board[4]} ║ ${board[5]} ║\n` +
        `╠═══╬═══╬═══╣\n` +
        `║ ${board[6]} ║ ${board[7]} ║ ${board[8]} ║\n` +
        `╚═══╩═══╩═══╝\n`
    );
  }
}

function Draw() {
  return board.every((cell) => cell !== "_");
}

function Winner() {
  if (
    (board[0] !== "_" && board[0] === board[1] && board[1] === board[2]) ||
    (board[3] !== "_" && board[3] === board[4] && board[4] === board[5]) ||
    (board[6] !== "_" && board[6] === board[7] && board[7] === board[8]) ||
    (board[0] !== "_" && board[0] === board[3] && board[3] === board[6]) ||
    (board[1] !== "_" && board[1] === board[4] && board[4] === board[7]) ||
    (board[2] !== "_" && board[2] === board[5] && board[5] === board[8]) ||
    (board[0] !== "_" && board[0] === board[4] && board[4] === board[8]) ||
    (board[2] !== "_" && board[2] === board[4] && board[4] === board[6])
  )
    return true;
}

const server = net.createServer((socket) => {
  console.log("Client connected");

  set.add(socket);

  if (set.size === 1) {
    socket.player = "X";
    socket.write(`You ${socket.player}`);
    console.log(`${socket.player} connected`);
  } else if (set.size === 2) {
    socket.player = "O";
    socket.write(`You ${socket.player}\n`);
    console.log(`${socket.player} connected`);
  } else {
    console.log("Server is full");
    socket.write("Server is full\n");
    socket.end();
  }

  if (set.size === 2) {
    for (const el of set) {
      el.write("Game started\n");
    }

    for (const el of set) {
      if (el.player === "X") {
        el.write(`Your turn ${el.player}\n`);
      }
    }

    sendBoard();
  }

  let buffer = "";

  socket.on("data", (data) => {
    buffer += data.toString();

    if (GameOver) {
      socket.write("REJECTED|Game is over\n");
      return;
    }

    while (buffer.includes("\n")) {
      const message = buffer.split("\n")[0];
      buffer = buffer.slice(message.length + 1);

      const [command, value] = message.split("|");

      if (command === "MOVE") {
        if (+value >= 0 && +value <= 8) {
          if (board[+value] === "_") {
            if (socket.player !== gamer) {
              socket.write(`REJECTED|not your turn: ${socket.player} `);
              return;
            }
            board[+value] = socket.player;
            sendBoard();

            let winner = Winner();

            if (winner) {
              for (const el of set) {
                el.write(`${socket.player}| WIN\n`);
              }
              GameOver = true;
              return;
            }

            let draw = Draw();

            if (draw) {
              for (const el of set) {
                el.write(`DRAW\n`);
              }
              

              GameOver = true;
              return;
            }

            if (socket.player === "X") {
              gamer = "O";
            } else {
              gamer = "X";
            }

            for (const el of set) {
              if (el.player === gamer) {
                el.write(`Your turn ${gamer}\n`);
              }
            }
          } else {
            socket.write(`REJECTED|cell occupied: ${socket.player}`);
          }
        } else {
          socket.write(`REJECTED|invalid cell: ${socket.player}`);
        }
      } else {
        socket.write(`REJECTED|You wrote a wrong command:${socket.player}`);
      }
    }
  });
});

server.listen(3001, () => {
  console.log("Server is running...");
});
