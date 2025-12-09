export interface SolveOptions {
  tol?: number;
  maxIter?: number;
}

// Solve f(x)=0 using Newton-Raphson with numeric derivative and fallback to bisection when needed.
export function solveRoot(f: (x:number)=>number, a?: number, b?: number, guess?: number, opts: SolveOptions = {}){
  const tol = opts.tol ?? 1e-10;
  const maxIter = opts.maxIter ?? 100;

  // numeric derivative
  const fd = (x:number) => {
    const h = 1e-8;
    return (f(x+h) - f(x-h)) / (2*h);
  };

  // if bracket provided, try bisection first to get a good initial guess
  let x = guess ?? 0;
  if (a !== undefined && b !== undefined){
    let fa = f(a), fb = f(b);
    if (fa === 0) return a;
    if (fb === 0) return b;
    if (fa*fb > 0){
      // no sign change; fall back to midpoint
      x = (a+b)/2;
    } else {
      // bisection for a few iterations
      let lo = a, hi = b, fm = f((lo+hi)/2);
      for (let i=0;i<20 && Math.abs(hi-lo) > tol;i++){
        const mid = (lo+hi)/2;
        const fm = f(mid);
        if (fm === 0) return mid;
        if (fa*fm < 0) { hi = mid; fb = fm; } else { lo = mid; fa = fm; }
      }
      x = (lo+hi)/2;
    }
  }

  // Newton iterations
  for (let i=0;i<maxIter;i++){
    const fx = f(x);
    if (Math.abs(fx) < tol) return x;
    const d = fd(x);
    if (!isFinite(d) || Math.abs(d) < 1e-14){
      // derivative too small — perturb or break to bisection if bracket known
      x += (Math.random()-0.5) * 1e-3;
      continue;
    }
    const nx = x - fx / d;
    if (!isFinite(nx)) break;
    if (Math.abs(nx - x) < tol) return nx;
    x = nx;
  }

  throw new Error('Root not found (maxIter)');
}

export default { solveRoot };
