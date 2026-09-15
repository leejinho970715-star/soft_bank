import fs from 'node:fs/promises';

const output = 'public';
const directories = ['assets', 'subpages'];
const files = ['index.html', 'styles.css', 'app.js', '.nojekyll'];

await fs.rm(output, {recursive: true, force: true});
await fs.mkdir(output, {recursive: true});

for (const directory of directories) {
  await fs.cp(directory, `${output}/${directory}`, {recursive: true});
}

for (const file of files) {
  await fs.copyFile(file, `${output}/${file}`);
}

console.log(`Vercel output prepared in ${output}/`);
