# nwatch
A Node js application that executes a file on save.

nwatch also watches local dependencies in the file excluding npm packages.

If you have
<code>
require('./file')
</code>

any changes in file.js will trigger a re-execution of code.

# linking

in order to use nwatch without typing <kbd>node watch fileToWatch.js</kbd>.

<ol>
	<li>Mark watch.js as executable by typing <kbd>chmod +x watch.js<kbd>.
	<li>run <kbd>npm link<kbd>
	<li>You can now run nwatch from your command line by typing <kbd>nwatch fileToWatch.js<kbd>
</ol>


