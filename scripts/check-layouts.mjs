import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {buildLayouts, layoutDescription} from '../layouts.js';

for (const key of ['xela', 'socks', 'deco']) {
  const data = JSON.parse(readFileSync(new URL(`../data/${key}.json`, import.meta.url)));
  const original = JSON.stringify(data);
  const layouts = buildLayouts(key, data);
  assert.equal(JSON.stringify(data), original, `${key}: display must not mutate graph or masks`);
  for (const [name, points] of Object.entries(layouts)) {
    assert.equal(points.length, data.positions.length);
    assert(points.every(p => p.length === 3 && p.every(Number.isFinite)));
    assert(layoutDescription(key, name).detail.includes('Paper:'));
  }
  assert(layouts.flat.every(p => p[2] === 0), `${key}: flat coordinates must really be planar`);
  for (const group of new Set(data.groups)) {
    const p = layouts.spatial.filter((_, i) => data.groups[i] === group);
    const depth = Math.max(...p.map(v => v[2])) - Math.min(...p.map(v => v[2]));
    assert(depth > .1, `${key}/${group}: each part needs visible depth`);
    // A camera tilt alone must not pass as a curved surface: check volume spanned
    // by four vertices. Xela's saved geometry and both curved maps are nonplanar.
    const sub = (a, b) => a.map((v, i) => v - b[i]);
    const cross = (a, b) => [a[1]*b[2]-a[2]*b[1], a[2]*b[0]-a[0]*b[2], a[0]*b[1]-a[1]*b[0]];
    const dot = (a, b) => a.reduce((sum, v, i) => sum + v*b[i], 0);
    let volume = 0;
    for (let i = 1; i < p.length; i += 7) {
      for (let j = i + 1; j < p.length; j += 11) {
        const normal = cross(sub(p[i], p[0]), sub(p[j], p[0]));
        volume = Math.max(volume, ...p.map(v => Math.abs(dot(normal, sub(v, p[0])))));
      }
    }
    assert(volume > .001, `${key}/${group}: 3D surface must not lie on a tilted plane`);
  }
  console.log(`${key}: flat/3D geometry valid; node order, graph and masks preserved`);
}
