#!/usr/bin/env node
var fs = require('fs');
var path = require('path');
var {spawn} = require('child_process');
var child;
const watchInterval = 100;
const watchFiles = [];
const arg1 = getArgs()[0];

// nwatch file args
function getArgs(flatten = false) {
  const args = [];
  for (let i = 2; i < process.argv.length; i++) {
    args.push(process.argv[i]);
  }
  return flatten ? args.join(' ') : args;
}

function climbDependencies(filepath) {
  dirpath = path.dirname(filepath);
  fs.readFile(filepath, {encoding: 'utf8'}, (err, data) => {
    if (err) throw err;
    if (!data) return;

    const matches = data.match(/\srequire\(("|'|`)(.*)("|'|`)\)/g);

    if (matches) {
      for (let i of matches) {
        i = i.trim();
        const indexOfSingleQuote = i.indexOf("'");
        const indexOfDoubleQuote = i.indexOf('"');
        const indexOfBackTick = i.indexOf('`');
        let finalIndex;

        if (indexOfSingleQuote !== -1) {
          finalIndex = indexOfSingleQuote;
        } else if (indexOfDoubleQuote !== -1) {
          finalIndex = indexOfDoubleQuote;
        } else if (indexOfBackTick !== -1) {
          finalIndex = indexOfBackTick;
        }

        i = i.substring(finalIndex + 1, i.length - 2);
        if (i.substring(i.length - 3, i.length) !== '.js') {
          i += '.js';
        }
        if (i[0] === '.' || i[0] === '/') {
          // match is a local require and not a node_module
          const dependencyPath = path.join(dirpath, i);
          if (!watchFiles.includes(dependencyPath)) {
            watchFiles.push(dependencyPath);
            console.log(dependencyPath);
            fs.watchFile(
              dependencyPath,
              {interval: watchInterval},
              (curr, prev) => {
                onFileChange();
              },
            );
            climbDependencies(dependencyPath);
          }
        }
      }
    }
  });
}

function onFileChange() {
  if (child) child.kill();
  console.clear();
  child = spawn('node ' + arg1, {stdio: 'inherit', shell: true});
}

function main() {
  fs.stat(arg1, (err, stats) => {
    if (err) console.error(err);
    if (stats.isFile()) {
      fs.watchFile(arg1, {interval: watchInterval}, (curr, prev) => {
        onFileChange();
      });
    } else {
      console.log('first argument need to be a file.');
      return;
    }
  });
  climbDependencies(path.join(process.cwd(), arg1));
}
main();
