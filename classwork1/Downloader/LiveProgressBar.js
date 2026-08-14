const { EventEmitter } = require("events");

class Downloader extends EventEmitter {
  constructor() {
    super();
    this.step = 0;
  }

  start() {
    const interval = setInterval(() => {
      this.step++;
      let percentage = this.step * 10;
      this.emit("progress", percentage);
      if (percentage === 100) {
        clearInterval(interval);
        this.emit("done");
      }
    }, 1000);
  }
}

const downloader = new Downloader();

downloader.on("progress", (val) => {
  let filled = (val / 100) * 20;
  let filledBar = "#".repeat(filled);
  let res = 20 - filled;
  let filledBar1 = "-".repeat(res);
  let fillRes = filledBar + filledBar1;
  process.stdout.write(`\r[${fillRes} ${val}%]`);
});

downloader.on("done", () => {
  console.log("\nDownload complete!");
});

downloader.start()