const fs = require("fs");
const path = require("path");
const buffer = fs.readdirSync("messy/");

fs.mkdirSync("organized", { recursive: true });

for (let i = 0; i < buffer.length; i++) {
  const file = buffer[i];

  const parsed = path.parse(file);

  const name = parsed.name;
  let newName = name.toLowerCase();
  newName = newName.replace(/[^a-z0-9]+/g, "-");
  newName = newName.replace(/^-+|-+$/g, "");
  const ext = parsed.ext;
  let newExt = ext.toLowerCase();
  newName += newExt;

  const source = path.join("messy", file);
  const destination = path.join("organized", newName);

  fs.copyFileSync(source, destination);
}
