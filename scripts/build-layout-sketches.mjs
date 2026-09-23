// Small dataset identifiers, generated from the same planar node coordinates as the explorer.
import fs from 'node:fs';
import {buildLayouts} from '../layouts.js';
for (const key of ['xela','socks','deco']) {
 const data=JSON.parse(fs.readFileSync(new URL(`../data/${key}.json`,import.meta.url),'utf8'));
 const points=buildLayouts(key,data).flat;
 const box=[0,1].map(d=>[Math.min(...points.map(p=>p[d])),Math.max(...points.map(p=>p[d]))]);
 const scale=42/Math.max(...box.map(([a,b])=>b-a));
 const dots=points.map(([x,y])=>`<circle cx="${(24+(x-(box[0][0]+box[0][1])/2)*scale).toFixed(2)}" cy="${(24-(y-(box[1][0]+box[1][1])/2)*scale).toFixed(2)}" r="0.57"/>`).join('');
 fs.writeFileSync(new URL(`../images/layout-${key}.svg`,import.meta.url),`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><g fill="#426f80">${dots}</g></svg>\n`);
}
