const fs = require("fs");

const buffer = Buffer.alloc(97);

buffer.write("SNSR", 0, 4, "ascii");
buffer.writeUInt8(1, 4);
buffer.writeUInt16BE(10, 5);

let offset = 7;
let i = 0;

while (i < 10) {
  buffer.writeUInt32BE(Math.floor(Math.random() * 10000), offset);
  buffer.writeFloatBE(Math.random() * 30, offset + 4);
  buffer.writeUInt8(Math.floor(Math.random() * 3) + 1, offset + 8);

  offset += 9;
  i++;
}

fs.writeFileSync("records.bin", buffer);
