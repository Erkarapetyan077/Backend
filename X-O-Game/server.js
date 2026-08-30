const net = require("node:net");

let set = new Set();
const board = new Array(9).fill("_");
let currentPlayer = "X";
let gameOver = false;
let gameStarted = false;

function sendBoard() {
  for (const player of set) {
    player.write(
      `BOARD|\n` +
        `${board.slice(0, 3).join(" | ")}\n` +
        `-----------\n` +
        `${board.slice(3, 6).join(" | ")}\n` +
        `-----------\n` +
        `${board.slice(6, 9).join(" | ")}\n`
    );
  }
}

const server = net.createServer((socket) => {
  let buffer = "";

  socket.on("error", (err) => {
    console.log(`${socket.username || "Unknown player"} error`);
  });

  if (set.size >= 2) {
    socket.write("Server is full!\n");
    socket.end();
    return;
  }

  set.add(socket);

  console.log("New player connected");
  console.log("Players:", set.size);

  socket.on("close", () => {
    set.delete(socket);

    console.log("Player disconnected");
    console.log("Players:", set.size);

    if (gameStarted && !gameOver && set.size === 1) {
      for (const player of set) {
        player.write("OPPONENT_LEFT\n");
      }
    }

    if (set.size === 0) {
      board.fill("_");
      currentPlayer = "X";
      gameOver = false;
      gameStarted = false;

      console.log("Game reset");
    }
  });

  socket.write("Enter your username:\n");

  socket.on("data", (data) => {
    buffer += data.toString();

    const messages = buffer.split("\n");

    buffer = messages.pop();

    for (const message of messages) {
      const line = message.trim();

      if (!line) continue;

      if (!socket.username) {
        socket.username = line;

        if (set.size === 1) {
          socket.player = "X";
        } else {
          socket.player = "O";
        }

        socket.write(`SYMBOL|${socket.player}\n`);

        if (
          !gameStarted &&
          set.size === 2 &&
          [...set].every((player) => player.username)
        ) {
          gameStarted = true;

          console.log("2 players are ready");

          for (const player of set) {
            player.write("The game started.\n");
          }

          sendBoard();

          for (const player of set) {
            if (player.player === currentPlayer) {
              player.write(`TURN|${currentPlayer}\n`);
            }
          }

          return;
        }

        return;
      }

      console.log(`${socket.username}: ${socket.player}`);

      if (!gameStarted) {
        socket.write("Waiting for another player.\n");
        continue;
      }

      if (gameOver) {
        socket.write("Game is over.\n");
        continue;
      }

      let player1;

      if (line.startsWith("MOVE|")) {
        player1 = +line.split("|")[1];
      } else {
        player1 = +line;
      }

      if (currentPlayer !== socket.player) {
        socket.write("REJECTED|not your turn\n");
        continue;
      }

      if (!Number.isInteger(player1) || player1 < 0 || player1 > 8) {
        socket.write("REJECTED|invalid cell\n");
        continue;
      }

      console.log(`${socket.username} chose: ${player1}`);

      if (board[player1] !== "_") {
        socket.write("REJECTED|cell occupied\n");
        continue;
      }

      board[player1] = socket.player;

      sendBoard();

      if (
        (board[0] !== "_" && board[0] === board[1] && board[1] === board[2]) ||
        (board[3] !== "_" && board[3] === board[4] && board[4] === board[5]) ||
        (board[6] !== "_" && board[6] === board[7] && board[7] === board[8]) ||
        (board[0] !== "_" && board[0] === board[3] && board[3] === board[6]) ||
        (board[1] !== "_" && board[1] === board[4] && board[4] === board[7]) ||
        (board[2] !== "_" && board[2] === board[5] && board[5] === board[8]) ||
        (board[0] !== "_" && board[0] === board[4] && board[4] === board[8]) ||
        (board[2] !== "_" && board[2] === board[4] && board[4] === board[6])
      ) {
        console.log(`${socket.player} wins!`);

        gameOver = true;

        for (const player of set) {
          player.write(`WIN|${socket.player}\n`);
        }

        continue;
      }

      if (board.every((cell) => cell !== "_")) {
        console.log("DRAW!");

        gameOver = true;

        for (const player of set) {
          player.write("DRAW\n");
        }

        continue;
      }

      if (socket.player === "X") {
        currentPlayer = "O";
      }

      if (socket.player === "O") {
        currentPlayer = "X";
      }

      for (const player of set) {
        if (player.player === currentPlayer) {
          player.write(`TURN|${currentPlayer}\n`);
        }
      }
    }
  });
});

server.listen(3000, () => {
  console.log("Server is running...");
});
