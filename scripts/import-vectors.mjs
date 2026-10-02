import {mkdir, writeFile} from 'node:fs/promises';
const commit='78321beacb0e0477e33cd002b56585a107c2708c';
const base=`https://raw.githubusercontent.com/zcash/zcash-test-vectors/${commit}/`;
async function json(path){const r=await fetch(base+path);if(!r.ok)throw Error(r.status);return r.json();}
const [ua,f4]=await Promise.all([json('test-vectors/json/unified_address.json'),json('test-vectors/json/f4jumble.json')]);
const vectors={source:'https://github.com/zcash/zcash-test-vectors',commit,unified:ua.slice(2).map((r,i)=>({id:i,address:r[6],receivers:[{type:0,hex:r[0]},{type:1,hex:r[1]},{type:2,hex:r[2]},{type:3,hex:r[3]},...(r[4]===null?[]:[{type:r[4],hex:r[5]}])].filter(x=>x.hex!==null).sort((a,b)=>a.type-b.type)})),jumble:f4.slice(2).filter(r=>r[0].length<=8192).map((r,i)=>({id:i,normal:r[0],jumbled:r[1]}))};
await mkdir('src/fixtures',{recursive:true});await writeFile('src/fixtures/official.json',JSON.stringify(vectors,null,2)+'\n');
const license=await fetch(base+'COPYING.md');if(!license.ok)throw Error('License fetch failed');
await writeFile('src/fixtures/ZCASH-VECTORS-LICENSE.md',await license.text());
const mit=await fetch(base+'LICENSE-MIT');if(!mit.ok)throw Error('MIT license fetch failed');await writeFile('src/fixtures/LICENSE-MIT',await mit.text());
console.log(JSON.stringify({unified:vectors.unified.length,jumble:vectors.jumble.length,commit}));
