const fs = require("fs");

const name = process.argv[2];

const stream = fs.createReadStream(name, "utf-8");

let WordCount = 0;
let ByteCount = 0;

stream.on("data", (chunk) => {
  let ch = "";
  for (let i = 0; i < chunk.length; i++) {
    if ((chunk[i] === " " || chunk[i] === "\n" || chunk[i] === "\t") && ch) {
      WordCount++;
    }
    ch = chunk[i];
  }
  ByteCount += chunk.length;
});

stream.on("end", () => {
  console.log(++WordCount);
  console.log(ByteCount);
  console.log("Streamin End");
});
