const fs = require("fs/promises");

(async () => {
  const commandFileHandler = await fs.open("./command.txt", "r");

  commandFileHandler.on("change", async () => {
    // get the size of our file
    const size = (await commandFileHandler.stat()).size;

    // allocate size to the buffer
    const buffer = Buffer.alloc(size);

    // the location at wihich we want to fiiling our buffer
    const offset = 0;

    // how many bytes we want to read
    const length = buffer.byteLength;

    // the postion that we want to start reading the file from
    const position = 0;

    // we always the read the content from start to end
     await commandFileHandler.read(buffer, offset, length, position);

    // console.log(buffer)

    const content = buffer.toString("utf-8");

    console.log("content", content);
  });
  const watcher = fs.watch("./command.txt");
  for await (const event of watcher) {
    if (event.eventType === "change") {
      commandFileHandler.emit("change");
    }
  }
})();
