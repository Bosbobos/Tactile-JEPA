import fs from 'node:fs';
import assert from 'node:assert/strict';
const base=new URL('../data/',import.meta.url);
for(const [key,n] of [['xela',368],['socks',453],['deco',528]]){
 const d=JSON.parse(fs.readFileSync(new URL(`${key}.json`,base)));assert.equal(d.positions.length,n);assert.equal(d.labels.length,n);assert(d.positions.every(p=>p.length===3&&p.every(Number.isFinite)));
 const adj=Array.from({length:n},()=>new Set());for(const [a,b]of d.edges){assert(a>=0&&a<n&&b>=0&&b<n);assert.equal(d.groups[a],d.groups[b]);adj[a].add(b);adj[b].add(a)}
 const connected=nodes=>{const allowed=new Set(nodes),seen=new Set([nodes[0]]),stack=[nodes[0]];while(stack.length){for(const j of adj[stack.pop()])if(allowed.has(j)&&!seen.has(j)){seen.add(j);stack.push(j)}}return seen.size===allowed.size};
 for(const [mode,samples]of Object.entries(d.masks)){assert.equal(samples.length,8);for(const s of samples){assert.equal(s.targets.length,4);const union=new Set(s.targets.flat());s.targets.forEach((t,i)=>{assert(t.every(v=>v>=0&&v<n));assert.equal(t.length,new Set(t).size);if(s.kinds[i]==='local')assert(connected(t));if(key!=='xela')assert(t.every(v=>d.groups[v]===Math.floor(i/2)));});for(const [name,c]of Object.entries(s.contexts)){assert(c.visible.every(v=>c.raw.includes(v)&&!union.has(v)));assert.equal(c.visible.length,c.raw.filter(v=>!union.has(v)).length);assert(c.visible.length>=Math.ceil(n*.15));if(name==='connected')for(const g of new Set(d.groups))assert(connected(c.raw.filter(v=>d.groups[v]===g)));}}}
 console.log(`${key}: ${n} nodes, ${d.edges.length} edges; all 24 mask sets and 48 contexts valid.`);
}
