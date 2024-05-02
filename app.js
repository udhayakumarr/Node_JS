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

  async function deleteFile(path) {
    try {
      await fs.unlink(path);
      console.log("File is deleted");
    } catch (e) {
      if (e.code === "ENOENT") {
        console.log("File is not exist");
      } else {
        console.log("A error occurred while removing the file", e);
      }
    }
  }

  async function renameFile(oldPath, newPath) {
    try {
      await fs.rename(oldPath, newPath)
      console.log("Rename is done")
    } catch {
      console.log("A error occurred while renaming the file")
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

    // create a file <apth>
    if (command.includes("create a file")) {
      const filePath = command.substring("create a file".length + 1);
      createFile(filePath);
    }

    // delete the file <path>
    if (command.includes("delete the file")) {
      const filePath = command.substring("delete the file".length + 1);
      deleteFile(filePath);
    }

    // rename the file <path> to <path>
    if (command.includes("rename the file")) {
      const _idx = command.indexOf(" to ");
      const oldPath = command.substring("rename the file".length + 1, _idx);
      const newPath = command.substring(_idx + 4);
      renameFile(oldPath, newPath)
    }
  });
  const watcher = fs.watch("./command.txt");
  for await (const event of watcher) {
    if (event.eventType === "change") {
      commandFileHandler.emit("change");
    }
  }
})();
