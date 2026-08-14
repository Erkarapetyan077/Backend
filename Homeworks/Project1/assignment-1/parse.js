const fs = require("fs");
const buffer = fs.readFileSync("records.bin");

const magic = buffer.toString("ascii", 0, 4);

if (magic !== "SNSR") {
  throw new Error("Invalid file format: bad magic");
}

const version = buffer.readUInt8(4);

if (version !== 1) {
  throw new Error("Unsupported version");
}

console.log("File format valid (SNSR v1)");

const recordCount = buffer.readUInt16BE(5);

let offset = 7;
let records = [];
let i = 0;

while (i < recordCount) {
  const timestamp = new Date(buffer.readUInt32BE(offset) * 1000);
  const temperature = buffer.readFloatBE(offset + 4);
  const sensorId = buffer.readUInt8(offset + 8);

  records.push({
    timestamp,
    temperature,
    sensorId,
  });

  i++;
  offset += 9;
}

let totalTemperature = 0;

for (const record of records) {
  totalTemperature += record.temperature;
}

const averageTemperature = totalTemperature / records.length;

console.log(`Records parsed: ${recordCount}`);
console.log(`Average temperature: ${averageTemperature.toFixed(2)}°C`);

const sensorCounts = {};

for (const record of records) {
  if (sensorCounts[record.sensorId]) {
    sensorCounts[record.sensorId]++;
  } else {
    sensorCounts[record.sensorId] = 1;
  }
}

let mostActiveSensor = 0;
let maxReadings = 0;

for (const sensorId in sensorCounts) {
  if (sensorCounts[sensorId] > maxReadings) {
    maxReadings = sensorCounts[sensorId];
    mostActiveSensor = sensorId;
  }
}

console.log(`Most active sensor: #${mostActiveSensor} (${maxReadings} readings)`);