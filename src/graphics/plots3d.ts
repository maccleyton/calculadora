import * as THREE from 'three';

export interface SurfaceOptions {
  xmin?:number; xmax?:number; ymin?:number; ymax?:number;
  steps?: number; color?: number;
}

export function addSurface(scene: any, f:(x:number,y:number)=>number, opts: SurfaceOptions = {}){
  const xmin = opts.xmin ?? -5, xmax = opts.xmax ?? 5;
  const ymin = opts.ymin ?? -5, ymax = opts.ymax ?? 5;
  const nx = opts.steps ?? 60, ny = opts.steps ?? 60;
  const dx = (xmax - xmin)/nx, dy = (ymax - ymin)/ny;

  const geo = new THREE.BufferGeometry();
  const positions = new Float32Array((nx+1)*(ny+1)*3);

  let k=0;
  for(let i=0;i<=nx;i++){
    const x = xmin + i*dx;
    for(let j=0;j<=ny;j++){
      const y = ymin + j*dy;
      const z = f(x,y);
      positions[k++] = x;
      positions[k++] = y;
      positions[k++] = Number.isFinite(z) ? z : 0;
    }
  }
  geo.setAttribute('position', new THREE.BufferAttribute(positions,3));

  const indices: number[] = [];
  for(let i=0;i<nx;i++){
    for(let j=0;j<ny;j++){
      const a = i*(ny+1)+j;
      const b = (i+1)*(ny+1)+j;
      const c = (i+1)*(ny+1)+j+1;
      const d = i*(ny+1)+j+1;
      indices.push(a,b,d, b,c,d);
    }
  }
  geo.setIndex(indices);
  geo.computeVertexNormals();

  const mat = new THREE.MeshPhongMaterial({
    color: opts.color ?? 0x6699ff,
    side: THREE.DoubleSide,
    shininess: 50,
    wireframe: false
  });
  const mesh = new THREE.Mesh(geo, mat);
  scene.add(mesh);
  return mesh;
}

export function addScatter2D(scene: any, data: Array<{x:number,y:number}>, color=0x2222aa, size=0.08){
  const group = new THREE.Group();
  const geom = new THREE.SphereGeometry(size, 8, 8);
  const mat = new THREE.MeshBasicMaterial({ color });
  for(const p of data){
    const sp = new THREE.Mesh(geom, mat);
    sp.position.set(p.x, p.y, 0);
    group.add(sp);
  }
  scene.add(group);
  return group;
}
