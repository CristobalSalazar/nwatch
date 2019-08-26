# nwatch
A helpful Node js devtool application that executes a file on save.

nwatch also watches local dependencies in the file excluding npm packages.

ie) if you have a local dependency such as: 
<code>require('./file')</code>
any changes in file.js and all recursive dependencies will trigger a re-execution of code.

## Linking

In order to use nwatch without typing <code>node watch fileToWatch.js</code>
Run <code>npm link</code>
You can now watch files by typing <code>nwatch fileToWatch.js</code>

