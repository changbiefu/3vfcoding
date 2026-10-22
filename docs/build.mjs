import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const dir=path.dirname(fileURLToPath(import.meta.url));
const read=f=>fs.readFileSync(path.join(dir,f),'utf8');
const html=read('index.template.html').replace('/*__STYLE__*/',()=>read('style.css')).replace('/*__BRAND__*/',()=>read('brand-assets.json')).replace('/*__SCRIPT__*/',()=>read('domain.js')+'\n'+read('app.js').replace('/*__MODULES__*/',()=>read('modules.js')));
fs.writeFileSync(path.join(dir,'index.html'),html);
console.log('Built docs/index.html: '+Buffer.byteLength(html)+' bytes');
