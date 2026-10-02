import vectors from './fixtures/official.json' with {type:'json'};
import {decodeAddress,f4jumble,hex,unhex,parseRequest,parseAmount,composeRequest,selectReceiver,encodeMemo} from './core.js';
export const SAPLING='ztestsapling10yy2ex5dcqkclhc7z7yrnjq2z6feyjad56ptwlfgmy77dmaqqrl9gyhprdx59qgmsnyfska2kez';
export const TRANSPARENT='tmEZhbWHTpdKMw5it8YDspUXSMGQyFwovpU';
export const UA=vectors.unified.find(v=>v.receivers.some(r=>r.type===3)&&v.receivers.some(r=>r.type===2)&&v.receivers.some(r=>r.type===0)).address;
export const EXAMPLE=`zcash:${SAPLING}?amount=1&memo=VGhpcyBpcyBhIHNpbXBsZSBtZW1vLg&message=Thank%20you%20for%20your%20purchase`;
export const MULTI=`zcash:?address=${TRANSPARENT}&amount=123.456&address.1=${SAPLING}&amount.1=0.789&memo.1=VGhpcyBpcyBhIHVuaWNvZGUgbWVtbyDinKjwn6aE8J-PhvCfjok`;
const same=(a,b)=>{if(JSON.stringify(a)!==JSON.stringify(b))throw Error('Result differs from expected value.')};
const rejects=(fn,part)=>{let error;try{fn()}catch(e){error=e}if(!error)throw Error('Expected rejection, but input was accepted.');if(part&&!error.message.includes(part))throw Error('Rejected for an unexpected reason: '+error.message)};
export const cases=[];
const add=(name,group,run)=>cases.push({name,group,run});
for(const v of vectors.unified)add(`Unified Address reference #${v.id+1}`,'Official ZIP-316 fixture',()=>same(decodeAddress(v.address).receivers.map(r=>({type:r.type,hex:r.hex})),v.receivers));
for(const v of vectors.jumble){add(`F4Jumble forward #${v.id+1}`,'Official F4Jumble fixture',()=>same(hex(f4jumble(unhex(v.normal))),v.jumbled));add(`F4Jumble inverse #${v.id+1}`,'Official F4Jumble fixture',()=>same(hex(f4jumble(unhex(v.jumbled),true)),v.normal))}
add('ZIP-321 published single-recipient example','Specification example',()=>{const r=parseRequest(EXAMPLE,'testnet');same(r.recipients[0].zatoshis,'100000000');same(r.recipients[0].memo.text,'This is a simple memo.')});
add('ZIP-321 published multi-recipient example','Specification example',()=>{const r=parseRequest(MULTI,'testnet');same(r.recipients.length,2);same(r.recipients[1].zatoshis,'78900000')});
add('Exact zatoshi arithmetic','Boundary',()=>same(parseAmount('0.00000001'),'1'));
add('Maximum ZEC amount','Boundary',()=>same(parseAmount('21000000'),'2100000000000000'));
add('Percent-decoded label keeps plus literal','Boundary',()=>same(parseRequest(`zcash:${SAPLING}?label=A+B%20C`).recipients[0].label,'A+B C'));
add('Unknown optional parameter warns','Boundary',()=>same(parseRequest(`zcash:${SAPLING}?future=1`).warnings.some(x=>x.includes('Ignored')),true));
add('Unspecified amount stays unspecified','Boundary',()=>same(parseRequest(`zcash:${SAPLING}`).recipients[0].amount,null));
add('512-byte memo accepted','Boundary',()=>same(parseRequest(`zcash:${SAPLING}?memo=${encodeMemo('x'.repeat(512))}`).recipients[0].memo.bytes,512));
add('UTF-8 composition roundtrip','Composition',()=>{const r=composeRequest([{address:SAPLING,amount:'0.01234567',label:'Bhopal + lab',memo:'नमस्ते / test only'}]);same(r.result.recipients[0].memo.text,'नमस्ते / test only');same(r.result.recipients[0].label,'Bhopal + lab')});
add('Multi-recipient composition roundtrip','Composition',()=>same(composeRequest([{address:SAPLING,amount:'1',label:'A',memo:''},{address:TRANSPARENT,amount:'2',label:'B',memo:''}]).result.recipients.length,2));
add('Orchard preferred when supported','Receiver policy',()=>same(selectReceiver(UA,[3,2,0]).selected.type,3));
add('Sapling selected when Orchard unsupported','Receiver policy',()=>same(selectReceiver(UA,[2,0]).selected.type,2));
add('Strict policy blocks transparent fallback','Receiver policy',()=>same(selectReceiver(UA,[0],true).blocked,true));
add('Explicit opt-in permits transparent fallback','Receiver policy',()=>same(selectReceiver(UA,[0],false).selected.type,0));
const bad=[
 ['Checksum mutation',()=>decodeAddress(UA.slice(0,-1)+(UA.endsWith('q')?'p':'q')),'checksum'],
 ['Mixed-case Unified Address',()=>decodeAddress(UA.slice(0,3).toUpperCase()+UA.slice(3)),'checksum'],
 ['Network mismatch',()=>decodeAddress(SAPLING,'mainnet'),'Network mismatch'],
 ['Unsupported revision 2',()=>decodeAddress('zu1unsupported'),'Revision 2'],
 ['Viewing key rejected',()=>decodeAddress('uview1example'),'Keys are not accepted'],
 ['Empty request',()=>parseRequest('zcash:'),'no recipient'],
 ['URL-style slashes rejected',()=>parseRequest('zcash://'+SAPLING),'//'],
 ['Fragment rejected',()=>parseRequest('zcash:'+SAPLING+'#memo'),'fragment'],
 ['Negative amount',()=>parseAmount('-1'),'non-negative'],
 ['Exponent amount',()=>parseAmount('1e2'),'decimal'],
 ['Excess precision',()=>parseAmount('0.000000001'),'8 places'],
 ['Supply bound',()=>parseAmount('21000000.00000001'),'21 million'],
 ['Duplicate amount',()=>parseRequest(`zcash:${SAPLING}?amount=1&amount=2`),'Duplicate'],
 ['Duplicate path/query address',()=>parseRequest(`zcash:${SAPLING}?address=${SAPLING}`),'Duplicate'],
 ['Recipient index .0',()=>parseRequest(`zcash:?address.0=${SAPLING}`),'index'],
 ['Recipient index leading zero',()=>parseRequest(`zcash:?address.01=${SAPLING}`),'index'],
 ['Recipient without address',()=>parseRequest(`zcash:${SAPLING}?amount.1=1`),'no address'],
 ['Mixed network recipients',()=>parseRequest(`zcash:?address=${SAPLING}&address.1=${UA}`),'mix mainnet'],
 ['Unknown required parameter',()=>parseRequest(`zcash:${SAPLING}?req-future=1`),'Unknown required'],
 ['Custom asset not silently ignored',()=>parseRequest(`zcash:${UA}?req-asset=x`),'Custom-asset'],
 ['Memo forbidden for transparent',()=>parseRequest(`zcash:${TRANSPARENT}?memo=eA`),'transparent-only'],
 ['Padded memo forbidden',()=>parseRequest(`zcash:${SAPLING}?memo=eA==`),'unpadded'],
 ['Non-canonical memo bits',()=>parseRequest(`zcash:${SAPLING}?memo=eB`),'encoding'],
 ['513-byte memo rejected',()=>parseRequest(`zcash:${SAPLING}?memo=${encodeMemo('x'.repeat(513))}`),'512'],
 ['Raw spaces rejected',()=>parseRequest(`zcash:${SAPLING}?label=hello world`),'percent-encode'],
 ['Broken percent encoding',()=>parseRequest(`zcash:${SAPLING}?label=%XX`),'invalid URI'],
 ['Invalid UTF-8 rejected',()=>parseRequest(`zcash:${SAPLING}?label=%FF`),'UTF-8'],
 ['Percent-encoded amount forbidden',()=>parseRequest(`zcash:${SAPLING}?amount=%31`),'decimal'],
 ['Trailing empty parameter',()=>parseRequest(`zcash:${SAPLING}?amount=1&`),'Empty request'],
 ['Resource limit enforced',()=>parseRequest('x'.repeat(32769)),'32 KB'],
];
for(const [name,fn,part] of bad)add(name,'Negative case',()=>rejects(fn,part));
export function runSuite(){const start=performance.now();const results=cases.map(t=>{try{t.run();return {name:t.name,group:t.group,passed:true}}catch(e){return {name:t.name,group:t.group,passed:false,error:e.message}}});return {project:'Veil',version:'0.1.0',generatedAt:new Date().toISOString(),fixtureSource:vectors.source,fixtureCommit:vectors.commit,total:results.length,passed:results.filter(r=>r.passed).length,failed:results.filter(r=>!r.passed).length,durationMs:Math.round(performance.now()-start),scope:'Local encoding and ZEC payment-request tests. No chain, ownership, curve validity, wallet interoperability or settlement verification.',results}}
