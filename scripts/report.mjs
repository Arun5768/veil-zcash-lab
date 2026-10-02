import {mkdir,writeFile} from 'node:fs/promises';
import {runSuite} from '../src/suite.js';
const report=runSuite();await mkdir('evidence',{recursive:true});await writeFile('evidence/test-report.json',JSON.stringify(report,null,2)+'\n');
console.log(`${report.passed}/${report.total} passed; ${report.failed} failed.`);if(report.failed)process.exitCode=1;
