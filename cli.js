#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
const { execFile } = require("child_process");
const util = require("./util");
const { Command } = require("commander");
const program = new Command();
program.version = require("./package.json").version;
program.option("-a, --attach", "Attach stdin and stdout to terminal").option("-f, --file", "File to watch");
program.parse(process.argv);

var mainProcess;
const entryFile = path.join(process.cwd(), getArgs()[0]);

async function main() {
  watchFile(entryFile);
  await watchDependencies(entryFile);
  startProcess(entryFile);
}

main();

function getArgs() {
  return process.argv.slice(2, process.argv.length);
}

async function watchDependencies(filepath) {
  const fileContent = await util.readFile(filepath);
  const filepaths = util.getLocalFilePaths(fileContent);
  const baseDir = path.dirname(filepath);

  filepaths.map((filepath) => {
    const dependencyPath = filepath.join(baseDir, filepath);
    watchFile(dependencyPath);
    watchDependencies(dependencyPath);
  });
}

function watchFile(path) {
  const stats = fs.statSync(path);
  if (fs.existsSync(path) && stats.isFile()) {
    fs.watchFile(path, { interval: 100 }, (curr, prev) => {
      if (curr !== prev) {
        startProcess();
      }
    });
  }
}

function startProcess() {
  program.attach && console.clear();
  if (mainProcess) mainProcess.kill();
  mainProcess = execFile(entryFile, { shell: program.attach });
}
