const fs = require("fs");

const buffer = fs.readFileSync("input.txt");

let i = 0;

const shift = Number(process.argv[3] || 2);

while (i < buffer.length) {
  if (buffer[i] >= 97 && buffer[i] <= 122) {
    buffer[i] = ((((buffer[i] - 97 + shift) % 26) + 26) % 26) + 97;
  } else if (buffer[i] >= 65 && buffer[i] <= 90) {
    buffer[i] = ((((buffer[i] - 65 + shift) % 26) + 26) % 26) + 65;
  }
  i++;
}

fs.writeFileSync("output.txt", buffer);

console.log("successfully");
