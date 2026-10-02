import test from 'node:test';
import {cases} from '../src/suite.js';
for(const c of cases)test(`${c.group}: ${c.name}`,c.run);
