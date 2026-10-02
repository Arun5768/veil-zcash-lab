import { build } from 'esbuild';
import {readFile,writeFile} from 'node:fs/promises';
const result=await build({entryPoints:['src/app.js'],bundle:true,format:'esm',outfile:'dist/app.js',target:'es2022',minify:false,metafile:true});
const packages=[...new Set(Object.keys(result.metafile.inputs).map(p=>p.match(/node_modules\/((?:@[^/]+\/)?[^/]+)/)?.[1]).filter(Boolean))].sort();
const notices=['Third-party notices for code bundled in Veil.\nOriginal project license: MIT.\n'];
for(const name of packages){const root=`node_modules/${name}`;const pkg=JSON.parse(await readFile(`${root}/package.json`,'utf8'));let license='';for(const file of ['LICENSE','LICENSE.md','LICENSE-MIT','license','license.md']){try{license=await readFile(`${root}/${file}`,'utf8');break}catch{}}if(!license)throw new Error(`Missing bundled-package license: ${name}`);notices.push(`\n${name} ${pkg.version}\n${license}`)}
notices.push('\nZcash reference vectors\n'+await readFile('src/fixtures/LICENSE-MIT','utf8'));
await writeFile('dist/THIRD-PARTY-NOTICES.txt',notices.join('\n'));
console.log('Veil built. Static output: dist/');
