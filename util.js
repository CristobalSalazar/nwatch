const fs = require("fs");
module.exports = { getLocalFilePaths, readFile };

function getLocalFilePaths(content) {
  const regex = /(?:require\s*\(\s*("|'|`))((\.{0,2}\/)+\w+)+\.\w+(?:("|'|`)\s*\))/g;
  const quoteRegex = /("|'|`)/;
  const matches = content.match(regex) || [];
  // not ideal, would like to use exclusion groups
  const filepaths = matches.map((match) => {
    const start = match.search(quoteRegex) + 1;
    const revstr = match.split("").reverse().join("");
    const end = match.length - revstr.search(quoteRegex) - 1;
    return match.substring(start, end);
  });
  return filepaths;
}

async function readFile(filepath) {
  return new Promise((res, rej) => {
    fs.readFile(filepath, { encoding: "utf8" }, (err, data) => {
      err ? rej(err) : res(data);
    });
  });
}
