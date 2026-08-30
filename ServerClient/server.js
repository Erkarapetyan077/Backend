const net = require("net");

let set = new Set();
let map = new Map();

const server = net.createServer((socket) => {
  console.log("New client connected");

  socket.write("Enter username:\n");
  socket.buffer = "";

  socket.on("error", (err) => {
    console.log(`${socket.username || "Unknown user"} error`);
  });

  socket.on("close", () =>  {
    if (!socket.username) {
      return;
    }

    const username = socket.username;

    map.delete(username);
    set.delete(username);

    for (const [name, clientSocket] of map) {
      clientSocket.write(`*** ${username} disconnected ***\n`);
    }

    console.log(`${username} Disconnected`);
  });

  socket.on("data", (data) => {
    const chunk = data.toString();
    socket.buffer += chunk;
    while (socket.buffer.includes("\n")) {
      const index = socket.buffer.indexOf("\n");
      let message = socket.buffer.slice(0, index);
      socket.buffer = socket.buffer.slice(index + 1, socket.buffer.length);

      if (!socket.username) {
        if (message === "") {
          socket.write("Username cannot be empty\n");
          socket.write("Enter username:\n");
          continue;
        }
        socket.username = message;

        console.log("username:", socket.username);

        if (set.has(socket.username)) {
          socket.write("Username already taken");
          socket.write("Enter username:\n");
          socket.username = "";
          continue;
        }
        set.add(socket.username);
        map.set(socket.username, socket);

        socket.write(`Connected as ${socket.username}\n`);

        for (const [username, clientSocket] of map) {
          if (clientSocket !== socket) {
            clientSocket.write(`*** ${socket.username} joined ***\n`);
          }
        }
      } else {
        console.log("message:", message);

        if (message === "/quit") {
          for (const [username, clientSocket] of map) {
            if (clientSocket !== socket) {
              clientSocket.write(`*** ${socket.username} left ***\n`);
            }
          }

          map.delete(socket.username);
          set.delete(socket.username);
          socket.username = "";
          socket.end();
        } else if (message === "/who") {
          let users = [...map.keys()];
          socket.write("Online users:\n");
          for (let username of users) {
            socket.write(`${username}\n`);
          }
        } else if (message.startsWith("/msg ")) {
          const parts = message.split(" ");
          const target = parts[1];
          const text = parts.slice(2).join(" ");
          const targetSocket = map.get(target);
          if (targetSocket) {
            targetSocket.write(`[DM from ${socket.username}]: ${text}\n`);
            socket.write(`[you -> ${target}]: ${text}\n`);
          } else {
            socket.write(`User ${target} not connected\n`);
          }
        } else {
          for (const [username, clientSocket] of map) {
            if (clientSocket !== socket) {
              clientSocket.write(`[${socket.username}]: ${message}\n`);
            }
          }
        }
      }
    }
  });
});

server.listen(3000, () => {
  console.log("Server is running...");
});


