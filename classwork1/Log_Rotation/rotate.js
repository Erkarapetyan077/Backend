const fs = require("fs/promises");

const path = require("path");

const LogFileName = process.argv[2];

const limit = 1000;

async function CheckLog() {
  try {
    const stats = await fs.stat(LogFileName);
    if (stats.size < limit) {
      console.log(
        `${LogFileName} is ${stats.size} bytes -- under the limit, no rotation needed.`
      );
      return;
    }
    let timestamp = new Date().toISOString();
    timestamp = timestamp.replace(/:/g, "-");
    const parsed = path.parse(LogFileName);
    
    const archiveName = `${parsed.name}-${timestamp}${parsed.ext}`;

    await fs.rename(LogFileName, archiveName);
    await fs.writeFile(LogFileName, "");

    console.log(
      `Rotated: ${LogFileName} -> ${archiveName} (fresh log created)`
    );
  } catch (error) {
    if (error.code === "ENOENT") {
      console.log(`No log file yet at ${LogFileName} -- nothing to rotate.`);
      return;
    } else {
      throw error;
    }
  }
}

CheckLog();
