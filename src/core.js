import { bech32, bech32m, base58check, base64urlnopad } from '@scure/base';
import { sha256 } from '@noble/hashes/sha2.js';
import { blake2b } from '@noble/hashes/blake2.js';
const utf8=new TextEncoder();
const text=new TextDecoder('utf-8',{fatal:true});
const fail=m=>{throw new Error(m)};
export const hex=b=>Array.from(b,v=>v.toString(16).padStart(2,'0')).join('');
export const unhex=s=>Uint8Array.from(s.match(/../g)||[],x=>parseInt(x,16));
const concat=(...xs)=>Uint8Array.from(xs.flatMap(x=>Array.from(x)));
const xor=(a,b)=>a.map((v,i)=>v^b[i]);
function H(i,m,n){return blake2b(m,{dkLen:n,personalization:concat(utf8.encode('UA_F4Jumble_H'),[i,0,0])})}
function G(i,m,n){const out=new Uint8Array(n);for(let j=0;j<Math.ceil(n/64);j++){const block=blake2b(m,{dkLen:64,personalization:concat(utf8.encode('UA_F4Jumble_G'),[i,j&255,j>>8])});out.set(block.slice(0,Math.min(64,n-j*64)),j*64)}return out}
export function f4jumble(bytes,inverse=false){if(bytes.length<38||bytes.length>4096)fail('F4Jumble input outside this prototype’s 38–4096-byte limit.');const l=Math.min(64,Math.floor(bytes.length/2));const a=bytes.slice(0,l),b=bytes.slice(l);if(inverse){const y=xor(a,H(1,b,l));const x=xor(b,G(1,y,b.length));const aa=xor(y,H(0,x,l));return concat(aa,xor(x,G(0,aa,b.length)))}const x=xor(b,G(0,a,b.length));const y=xor(a,H(0,x,l));const d=xor(x,G(1,y,b.length));return concat(xor(y,H(1,d,l)),d)}
const types={0:{name:'P2PKH',bytes:20,shielded:false},1:{name:'P2SH',bytes:20,shielded:false},2:{name:'Sapling',bytes:43,shielded:true},3:{name:'Orchard',bytes:43,shielded:true}};
function compact(bytes,state){let n=bytes[state.i++];if(n===undefined)fail('Truncated CompactSize value.');if(n<253)return n;const size=n===253?2:n===254?4:8;if(state.i+size>bytes.length)fail('Truncated CompactSize value.');let value=0n;for(let k=0;k<size;k++)value|=BigInt(bytes[state.i++])<<BigInt(8*k);if(value<(size===2?253n:size===4?65536n:4294967296n))fail('Non-canonical CompactSize value.');if(value>0x2000000n)fail('Type or length exceeds the ZIP-316 bound.');return Number(value)}
export function decodeAddress(address,expected='any'){
 if(typeof address!=='string'||!address||address.length>7000)fail('Enter a public address within the 7,000-character limit.');
 if(/\s/.test(address))fail('Address contains whitespace.');
 if(/^(secret|uview|uivk|uvf|uvi|zxview|zviews)/i.test(address))fail('Keys are not accepted. Use a public payment address only.');
 if(/^(zu|tu|zutest|tutest)1/i.test(address))fail('Revision 2 Unified Addresses are not supported by Veil 0.1. Do not treat this as an invalid address.');
 let kind,network,receivers;
 const low=address.toLowerCase();
 if(/^u(test)?1/.test(low)){
  let dec;try{dec=bech32m.decode(address,12000)}catch{fail('Unified Address Bech32m checksum or encoding failed.')}
  network=dec.prefix==='u'?'mainnet':dec.prefix==='utest'?'testnet':fail('Unsupported Unified Address network.');
  let bytes;try{bytes=bech32m.fromWords(dec.words)}catch{fail('Non-canonical Unified Address bit padding.')}
  bytes=f4jumble(bytes,true);const padding=new Uint8Array(16);padding.set(utf8.encode(dec.prefix));if(hex(bytes.slice(-16))!==hex(padding))fail('Unified Address network padding mismatch.');
  const payload=bytes.slice(0,-16),state={i:0};receivers=[];let previous=-1;
  while(state.i<payload.length){const type=compact(payload,state),len=compact(payload,state);if(type<=previous)fail('Receivers must be unique and ordered by typecode.');previous=type;if(state.i+len>payload.length)fail('Truncated receiver data.');const def=types[type];if(def&&len!==def.bytes)fail(`${def.name} receiver has the wrong length.`);receivers.push({type,name:def?.name||`Unknown type ${type}`,shielded:def?.shielded??null,bytes:len,hex:hex(payload.slice(state.i,state.i+len))});state.i+=len;}
  if(receivers.some(r=>r.type===0)&&receivers.some(r=>r.type===1))fail('A Unified Address cannot contain both P2PKH and P2SH receivers.');
  if(!receivers.some(r=>r.type>=2))fail('Revision 0 requires a non-transparent receiver.');kind='Unified Address (revision 0)';
 }else if(/^(zs|ztestsapling)1/.test(low)){
  let dec;try{dec=bech32.decode(address,200)}catch{fail('Sapling Bech32 checksum or encoding failed.')}
  network=dec.prefix==='zs'?'mainnet':dec.prefix==='ztestsapling'?'testnet':fail('Unsupported Sapling network.');
  const bytes=bech32.fromWords(dec.words);if(bytes.length!==43)fail('Sapling addresses must contain 43 bytes.');kind='Sapling address';receivers=[{type:2,name:'Sapling',shielded:true,bytes:43,hex:hex(bytes)}];
 }else{
  let bytes;try{bytes=base58check(sha256).decode(address)}catch{fail('Address checksum failed or address family is unsupported.')}
  if(bytes.length!==22)fail('Only transparent, Sapling and revision-0 Unified payment addresses are supported.');
  const prefix=hex(bytes.slice(0,2)),def={'1cb8':['mainnet',0],'1cbd':['mainnet',1],'1d25':['testnet',0],'1cba':['testnet',1]}[prefix];if(!def)fail('Unsupported address prefix; Sprout addresses are not accepted.');
  [network]=def;const type=def[1];kind='Transparent address';receivers=[{type,...types[type],hex:hex(bytes.slice(2))}];
 }
 if(expected!=='any'&&network!==expected)fail(`Network mismatch: expected ${expected}, received ${network}.`);
 return {address,kind,network,receivers,encodingVerified:true,ownershipVerified:false,curvePointsVerified:false,warnings:receivers.some(r=>r.shielded===null)?['Unknown receiver types are exposed for inspection but never selected by Veil.']:[]};
}
export function parseAmount(value){if(!/^[0-9]+(?:\.[0-9]{1,8})?$/.test(value))fail('Amount must be a non-negative decimal with at most 8 places.');const [whole,fraction='']=value.split('.');if(whole.length>16)fail('Amount exceeds the ZEC supply limit.');const amount=BigInt(whole)*100000000n+BigInt(fraction.padEnd(8,'0'));if(amount>2100000000000000n)fail('Amount exceeds 21 million ZEC.');return amount.toString()}
function memoInfo(s){if(!/^[A-Za-z0-9_-]*$/.test(s))fail('Memo must be unpadded base64url.');let bytes;try{bytes=base64urlnopad.decode(s)}catch{fail('Invalid memo base64url encoding.')};if(base64urlnopad.encode(bytes)!==s)fail('Memo has non-canonical padding bits.');if(bytes.length>512)fail('Memo exceeds 512 bytes.');let value;try{value=text.decode(bytes)}catch{value=null}return {bytes:bytes.length,text:value,encoding:'base64url',hex:hex(bytes)}}
export const encodeMemo=s=>base64urlnopad.encode(utf8.encode(s));
function decodeQuery(s){if(!/^(?:[A-Za-z0-9\-._~!$'()*+,;:@]|%[0-9a-fA-F]{2})*$/.test(s))fail('Label/message contains invalid URI characters; percent-encode spaces and Unicode.');try{return decodeURIComponent(s)}catch{fail('Invalid UTF-8 percent encoding.')}}
export function parseRequest(input,expected='any'){
 if(typeof input!=='string'||!input.trim())fail('Paste an address or payment request first.');const value=input.trim();if(value.length>32768)fail('Request exceeds the 32 KB prototype limit.');if(!/^zcash:/i.test(value)){const a=decodeAddress(value,expected);return {format:'address',network:a.network,recipients:[{index:0,...a,amount:null,zatoshis:null}],warnings:[...a.warnings],settlementVerified:false}}
 const body=value.slice(6);if(body.startsWith('//')||body.includes('#'))fail('ZIP-321 requests cannot contain // or a fragment.');const q=body.indexOf('?');const path=q<0?body:body.slice(0,q),query=q<0?'':body.slice(q+1);if(query.includes('?'))fail('Unexpected question mark in query.');
 const groups=new Map(),warnings=[];function group(i){if(!groups.has(i))groups.set(i,{});return groups.get(i)}if(path)group(0).address=path;
 for(const part of query?query.split('&'):[]){if(!part)fail('Empty request parameter.');const p=part.indexOf('=');if(p<0)fail('Each parameter requires a value.');const key=part.slice(0,p),v=part.slice(p+1),match=/^([a-zA-Z][a-zA-Z0-9+-]*)(?:\.([1-9][0-9]{0,3}))?$/.exec(key);if(!match)fail('Invalid parameter name or recipient index (use .1 to .9999).');const name=match[1],i=Number(match[2]||0);if(name.startsWith('req-'))fail(name==='req-asset'?'Custom-asset requests are not supported by Veil 0.1.':'Unknown required parameter: '+name);if(!['address','amount','memo','label','message'].includes(name)){decodeQuery(v);warnings.push(`Ignored optional parameter: ${key}`);continue}const g=group(i);if(Object.hasOwn(g,name))fail(`Duplicate parameter: ${key}`);g[name]=v;}
 if(!groups.size)fail('Request contains no recipient.');if(groups.size>32)fail('This prototype supports at most 32 recipients.');
 const recipients=[...groups].sort((a,b)=>a[0]-b[0]).map(([index,g])=>{if(!g.address)fail(`Recipient ${index} has no address.`);const a=decodeAddress(g.address,expected);const amount=g.amount??null,zatoshis=amount===null?null:parseAmount(amount);const memo=g.memo===undefined?null:memoInfo(g.memo);if(memo&&!a.receivers.some(r=>r.shielded))fail('Memo cannot be attached to a transparent-only recipient.');return {index,...a,amount,zatoshis,memo,label:g.label===undefined?'':decodeQuery(g.label),message:g.message===undefined?'':decodeQuery(g.message)}});
 if(new Set(recipients.map(r=>r.network)).size!==1)fail('A payment request cannot mix mainnet and testnet recipients.');
 for(const r of recipients){warnings.push(...r.warnings);if(r.zatoshis===null)warnings.push(`Recipient ${r.index}: amount is unspecified; the wallet would need user input.`);if(r.zatoshis==='0')warnings.push(`Recipient ${r.index}: zero-amount request.`);if(r.receivers.every(x=>x.shielded===false))warnings.push(`Recipient ${r.index}: transparent-only destination; not a shielded payment.`)}
 return {format:'ZIP-321 (ZEC subset)',network:recipients[0].network,recipients,warnings,settlementVerified:false};
}
export function composeRequest(rows,network='testnet'){
 if(!Array.isArray(rows)||rows.length<1||rows.length>32)fail('Provide 1–32 recipients.');const parts=[];
 rows.forEach((r,i)=>{const suffix=i?'.'+i:'';parts.push(`address${suffix}=${r.address.trim()}`);if(r.amount!=='')parts.push(`amount${suffix}=${r.amount}`);if(r.label)parts.push(`label${suffix}=${encodeURIComponent(r.label)}`);if(r.memo)parts.push(`memo${suffix}=${encodeMemo(r.memo)}`)});
 const uri='zcash:?'+parts.join('&');return {uri,result:parseRequest(uri,network)};
}
export function selectReceiver(address,capabilities=[3,2,0,1],strict=true){
 const info=typeof address==='string'?decodeAddress(address):address;
 const selected=[3,2,0,1].map(type=>info.receivers.find(r=>r.type===type)).find(r=>r&&capabilities.includes(r.type)&&(!strict||r.shielded));
 return {selected:selected||null,blocked:!selected,reason:selected?`${selected.name} is the highest-priority compatible ${selected.shielded?'shielded':'transparent'} receiver.`:strict?'No compatible shielded receiver. Stop instead of falling back to transparent.':'No compatible supported receiver. Stop.',simulated:true};
}
export function safeInspect(value,network){try{return {ok:true,...parseRequest(value,network)}}catch(error){return {ok:false,error:error.message,settlementVerified:false}}}
