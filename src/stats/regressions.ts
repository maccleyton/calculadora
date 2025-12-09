export interface LinearResult {
  slope: number;
  intercept: number;
  r2?: number;
}

export function linearRegression(points: Array<{x:number,y:number}>): LinearResult{
  const n = points.length;
  if (n === 0) throw new Error('No data');
  let sx=0, sy=0, sxx=0, sxy=0;
  for (const p of points){ sx += p.x; sy += p.y; sxx += p.x*p.x; sxy += p.x*p.y; }
  const denom = n*sxx - sx*sx;
  if (Math.abs(denom) < 1e-12) throw new Error('Degenerate data');
  const slope = (n*sxy - sx*sy)/denom;
  const intercept = (sy - slope*sx)/n;
  // R^2
  let ssres = 0, sstot = 0; const meanY = sy/n;
  for (const p of points){ const yhat = slope*p.x + intercept; ssres += (p.y - yhat)*(p.y - yhat); sstot += (p.y - meanY)*(p.y - meanY); }
  const r2 = sstot === 0 ? 1 : 1 - ssres/sstot;
  return { slope, intercept, r2 };
}

export default { linearRegression };
