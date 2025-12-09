export interface TVM { n?: number; i?: number; PV?: number; PMT?: number; FV?: number; due?: 'END'|'BEGIN'; }

export function solveFV({n=0,i=0,PV=0,PMT=0,due='END'}: TVM){
  const r = i/100;
  if (n === 0) return -PV - PMT;
  const factor = Math.pow(1+r, n);
  const shift = (due==='BEGIN') ? (1+r) : 1;
  const ann = PMT ? PMT * shift * ((factor - 1)/r) : 0;
  return -( PV*factor + ann );
}

export function solvePMT({n=0,i=0,PV=0,FV=0,due='END'}: TVM){
  const r = i/100;
  if (n === 0) return 0;
  const factor = Math.pow(1+r, n);
  const annEnd = (PV*r) / (1 - Math.pow(1+r, -n)) + (FV*r) / (factor - 1);
  const shift = (due==='BEGIN') ? (1+r) : 1;
  return -annEnd / shift;
}
