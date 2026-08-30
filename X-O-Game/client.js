const net = require("node:net");

const client = net.createConnection({
  port: 3000,
  host: "localhost",
});

client.on("connect", () => {
  console.log("connected");
});

client.on("data", (data) => {
  console.log(data.toString());
});

process.stdin.on("data", (data) => {
  client.write(data);
});
