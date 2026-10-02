import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';
const root=resolve('dist');
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json','.svg':'image/svg+xml'};
http.createServer(async(req,res)=>{
 try{
  const url=new URL(req.url,'http://localhost');
  const name=decodeURIComponent(url.pathname);
  const path=resolve(root,'.'+(name==='/'?'/index.html':name));
  if(!path.startsWith(root+sep) && path!==root){res.writeHead(403);return res.end('Forbidden');}
  let bytes;
  try{bytes=await readFile(path);}catch(e){if(extname(name))throw e;bytes=await readFile(resolve(root,'index.html'));}
  res.writeHead(200,{'Content-Type':types[extname(path)]||'text/html; charset=utf-8','Cache-Control':'no-store','Content-Security-Policy':"default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; connect-src 'self'; object-src 'none'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'",'Referrer-Policy':'no-referrer','X-Content-Type-Options':'nosniff'});res.end(bytes);
 }catch{res.writeHead(404);res.end('Not found');}
}).listen(8797,'127.0.0.1',()=>console.log('Veil preview: http://127.0.0.1:8797'));
