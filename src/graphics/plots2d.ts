import * as THREE from 'three';

export interface Plot2DOptions {
  xmin?: number; xmax?: number; samples?: number; color?: number;
}

export function addPlot2D(scene: any, f:(x:number)=>number, opts: Plot2DOptions = {}){
  const xmin = opts.xmin ?? -10, xmax = opts.xmax ?? 10;
  const samples = opts.samples ?? 1000; const color = opts.color ?? 0x0066ff;
  const pts: any[] = [];
  const step = (xmax - xmin) / samples;

  for (let i=0; i<=samples; i++){
    const x = xmin + i*step;
    const y = f(x);
    if (Number.isFinite(y)) pts.push(new THREE.Vector3(x, y, 0));
  }
  const geo = new THREE.BufferGeometry().setFromPoints(pts);
  const mat = new THREE.LineBasicMaterial({ color });
  const line = new THREE.Line(geo, mat);
  scene.add(line); return line;
}

export function addParametric2D(scene: any, x:(t:number)=>number, y:(t:number)=>number,
  tmin=0, tmax=2*Math.PI, samples=1000, color=0xff6600){
  const pts: any[] = [];
  const dt = (tmax - tmin) / samples;
  for (let i=0;i<=samples;i++){
    const t = tmin + i*dt;
    pts.push(new THREE.Vector3(x(t), y(t), 0));
  }
  const geo = new THREE.BufferGeometry().setFromPoints(pts);
  const mat = new THREE.LineBasicMaterial({ color });
  const line = new THREE.Line(geo, mat);
  scene.add(line); return line;
}

export function addPolar(scene: any, g:(theta:number)=>number,
  thMin=0, thMax=2*Math.PI, samples=1000, color=0x00aa55){
  return addParametric2D(scene,
    (th)=> g(th)*Math.cos(th),
    (th)=> g(th)*Math.sin(th),
    thMin, thMax, samples, color
  );
}
