# nwatch
A Node js application that executes a file on save.

nwatch also watches local dependencies in the file excluding npm packages.

If you have
<code>
require('./file')
</code>

any changes in file.js and it's dependencies will also trigger a re-execution of code.

# linking

in order to use nwatch without typing <code>node watch fileToWatch.js</code>

<ol>
	<li>Mark watch.js as executable by typing <code>chmod +x watch.js</code>.
	<li>run <code>npm link</code>
	<li>You can now run nwatch from your command line by typing <code>nwatch fileToWatch.js</code>
</ol>


