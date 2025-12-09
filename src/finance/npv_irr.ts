export function npv(rate:number, cashflows: number[]){
  return cashflows.reduce((acc, cf, i) => acc + cf / Math.pow(1 + rate, i), 0);
}

// IRR using Newton-Raphson on NPV(rate) = 0
export function irr(cashflows: number[], guess = 0.1, maxIter = 100, tol = 1e-8){
  let x = guess;
  function f(r: number){
    return cashflows.reduce((acc, cf, i) => acc + cf / Math.pow(1 + r, i), 0);
  }
  function df(r: number){
    return cashflows.reduce((acc, cf, i) => acc - i * cf / Math.pow(1 + r, i+1), 0);
  }
  for (let i=0;i<maxIter;i++){
    const fx = f(x);
    if (!isFinite(fx)) break;
    if (Math.abs(fx) < tol) return x;
    const dfx = df(x);
    if (Math.abs(dfx) < 1e-12) break;
    x = x - fx/dfx;
  }
  // fallback: try scanning for sign change and bisection
  let low = -0.9999, high = 10;
  let fLow = f(low), fHigh = f(high);
  if (fLow * fHigh > 0) throw new Error('IRR not found in fallback range');
  for (let i=0;i<100;i++){
    const mid = (low+high)/2; const fm = f(mid);
    if (Math.abs(fm) < tol) return mid;
    if (fLow * fm < 0){ high = mid; fHigh = fm; } else { low = mid; fLow = fm; }
  }
  throw new Error('IRR not found');
}

export default { npv, irr };
