const fse = require("fs-extra");
const path = require("path");

// This is the root folder where will be placed all the files
// It is relative to the folder of the main process
const ROOT = "storage";

module.exports = {
  saveFile,
  deleteFile,
  isBase64
};

async function saveFile(target, name, base64) {
  // Validate name (i.e.: "my-file-name")
  //const slugReg = /^[a-z-\d]+$/;
  //if (!slugReg.test(name)) throw new Error("Invalid name");

  // Decode base64
  const { mime, buffer } = decodeBase64File(base64);

  // Set final target
  const fullname = name + "." + mime.split("/")[1];

  // Ensure if directory exists
  const targetPath = path.join(ROOT, target, fullname); // i.e: storage/sierra/cusco/home.jpg

  // Finally write the file
  await fse.outputFile(targetPath, buffer);
  return "/" + ROOT + "/" + target + "/" + fullname;
}

async function deleteFile(targetPath) {
  // const target = path.join(ROOT, targetPath)
  await fse.remove(targetPath);
}

function isBase64(text) {
  return /^data:/.test(text);
}

// Utils
function decodeBase64File(dataString) {
  const base64Reg = /^data:([A-Za-z-+/]+);base64,(.+)$/;
  if (!base64Reg.test(dataString)) throw new Error("Invalid base64");
  const matches = dataString.match(/^data:([A-Za-z-+/]+);base64,(.+)$/);
  if (matches.length !== 3) throw new Error("Invalid base64");
  return {
    mime: matches[1],
    buffer: Buffer.from(matches[2], "base64")
  };
}
