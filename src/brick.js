import * as THREE from 'three';

let material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
let geo = new THREE.BoxBufferGeometry(1, 1, 1);

function lerp(a, b, t) {
  return a * (1 - t) + b * t;
}

export function getBrick(index, number, space) {
  // create shape
  let detail = 100;
  let angle = index * 2 * Math.PI / number + space;
  let angle1 = (index + 1) * 2 * Math.PI / number - space;
  let r1 = 1;
  let r2 = 0.95;
  let dots = [];

  for (let i = 0; i <= detail; i++) {
    dots.push([
      r2 * Math.sin(lerp(angle1, angle, i / detail)),
      r2 * Math.cos(lerp(angle1, angle, i / detail))
    ]);
  }

  for (let i = 0; i <= detail; i++) {
    dots.push([
      r1 * Math.sin(lerp(angle1, angle, i / detail)),
      r1 * Math.cos(lerp(angle1, angle, i / detail))
    ]);
  }

  let shape = new THREE.Shape();
  shape.moveTo(dots[0][0], dots[0][1]);
  dots.forEach(dot => {
    shape.lineTo(dot[0], dot[1]);
  });
  // shape.moveTo(0, 0);
  // shape.lineTo(1, 0);
  // shape.lineTo(2, 1);
  // shape.lineTo(0, 1);
  // shape.lineTo(0, 0);

  let geometry = new THREE.ExtrudeBufferGeometry(shape, {
    steps: 2,
    depth: 0.2,
    bevelEnabled: false,
  });
  geometry.rotateX(Math.PI / 2);
  let mesh = new THREE.Mesh(geometry, material);
  return mesh;
}