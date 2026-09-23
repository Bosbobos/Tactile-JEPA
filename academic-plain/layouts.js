// Display coordinates only. Never rebuild edges or resample masks from these views.
const bounds = points => [0, 1, 2].map(d => [
  Math.min(...points.map(p => p[d])), Math.max(...points.map(p => p[d]))
]);
const arc = (distance, radius) => [
  radius * Math.sin(distance / radius), radius * (1 - Math.cos(distance / radius))
];

function curveSole([x, y], box) {
  const [[xmin, xmax], [ymin, ymax]] = box;
  const length = ymax - ymin;
  const v = (y - ymin) / length;
  const u = (x - (xmin + xmax) / 2) / ((xmax - xmin) / 2);
  // Arch towards the inner side of each foot; a small toe bend and cupped rim.
  // These amplitudes are illustrative, not measured anatomy or motion data.
  const medial = (1 + u * (x < 0 ? 1 : -1)) / 2;
  const arch = length * .17 * Math.exp(-(((v - .46) / .19) ** 2)) * (.4 + .6 * medial);
  const toe = Math.max(0, y - (ymin + length * .76));
  const [toeY, toeZ] = arc(toe, length * .30);
  return [x, y - toe + toeY, arch + toeZ + length * .025 * u * u];
}

function curveHand([displayX, y], group, label) {
  // Undo the canonical right-hand mirror, bend both hands in local coordinates,
  // then restore their original separated placement. Node order is unchanged.
  const x = group === 1 ? 18 - displayX : displayX;
  let outX = x, outY = y, z;
  if (label.includes('Thumb')) {
    const dx = x - 5, dy = y - 1.4;
    const along = Math.max(0, dx * .58 + dy * .815);
    const across = dx * .815 - dy * .58;
    const [bent, depth] = arc(along, 4.6);
    outX = 5 + bent * .58 + across * .815;
    outY = 1.4 + bent * .815 - across * .58;
    z = depth + .12;
  } else {
    const base = 2.8;
    const distance = Math.max(0, y - base);
    const [bent, depth] = arc(distance, 5.3);
    outY = Math.min(y, base) + bent;
    z = depth + .045 * (x - 3) ** 2; // shallow transverse palm cup
  }
  return [group === 1 ? 18 - outX : outX, outY, z];
}

export function buildLayouts(dataset, data) {
  const source = data.positions.map(p => dataset === 'xela' ? [-p[1], p[2], p[0]] : [...p]);
  const groupBounds = new Map([...new Set(data.groups)].map(group => [
    group, bounds(source.filter((_, i) => data.groups[i] === group))
  ]));
  const spatial = dataset === 'xela' ? source : source.map((p, i) => dataset === 'socks'
    ? curveSole(p, groupBounds.get(data.groups[i]))
    : curveHand(p, data.groups[i], data.labels[i]));
  const flat = source.map(([x, y]) => [x, y, 0]);
  // One scale for both layouts. Center each view without changing node identity.
  const extent = Math.max(...bounds(source).map(([a, b]) => b - a));
  const normalize = points => {
    const center = bounds(points).map(([a, b]) => (a + b) / 2);
    return points.map(p => p.map((v, d) => (v - center[d]) / extent * 2));
  };
  return {flat: normalize(flat), spatial: normalize(spatial)};
}

export function layoutDescription(dataset, layout) {
  const flat = layout === 'flat';
  const descriptions = {
    xela: {
      status: flat ? 'Flat · projection for visualization' : '3D · saved sensor geometry',
      detail: 'Paper: fixed sensor adjacency. This 3D view uses a saved hand configuration; Flat projects it onto a plane.',
      source: 'Sparsh-skin: saved 3D taxel coordinates; flat view is a projection.'
    },
    socks: {
      status: flat ? 'Flat · source sensor map' : '3D · illustrative curved soles',
      detail: 'Paper: fixed adjacency on the flat sensor map. 3D adds an illustrative arch and toe bend, not measured coordinates.',
      source: 'Socks: planar physical map; curved 3D view is for visualization only.'
    },
    deco: {
      status: flat ? 'Flat · canonical graph layout' : '3D · illustrative curved hands',
      detail: 'Paper: fixed region adjacency, without measured taxel coordinates. Flat is the canonical graph layout; 3D is visualization only.',
      source: 'DECO: canonical planar layout; curved 3D view is not a measured hand pose.'
    }
  };
  return descriptions[dataset];
}
