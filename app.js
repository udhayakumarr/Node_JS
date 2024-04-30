const fs = require("fs/promises");

(async () => {
  async function createFile(path) {
    try {
      const existingFileHandler = await fs.open(path, "r");
      console.log("File is already exist");
      existingFileHandler.close();
    } catch {
      const newFileHandler = await fs.open(path, "w");
      console.log("New file is created");
      newFileHandler.close();
    }
  }

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

    const command = buffer.toString("utf-8");

    if (command.includes("create a file")) {
      const filePath = command.substring("create a file".length + 1);
      createFile(filePath);
    }
  });
  const watcher = fs.watch("./command.txt");
  for await (const event of watcher) {
    if (event.eventType === "change") {
      commandFileHandler.emit("change");
    }
  }
})();
