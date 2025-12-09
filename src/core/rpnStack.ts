export type RegisterName = 'X'|'Y'|'Z'|'T';

export class RPNStack {
  private stack: number[] = [];

  constructor(initial: number[] = []){
    this.stack = initial.slice().reverse(); // top at index 0
  }

  // push a value onto the stack (becomes X)
  push(v: number){
    this.stack.unshift(v);
    return v;
  }

  // pop the top value
  pop(): number | undefined {
    return this.stack.shift();
  }

  // duplicate top (ENTER)
  enter(): number | undefined {
    const top = this.peek();
    if (top !== undefined) this.push(top);
    return top;
  }

  // peek top
  peek(): number | undefined { return this.stack[0]; }

  // drop top
  drop(){ this.stack.shift(); }

  // swap X and Y
  swap(){
    if (this.stack.length >= 2){
      const a = this.stack[0];
      this.stack[0] = this.stack[1];
      this.stack[1] = a;
    }
  }

  // roll n (positive moves top down n times)
  roll(n: number){
    if (this.stack.length === 0) return;
    const len = this.stack.length;
    const k = ((n % len) + len) % len;
    for (let i=0;i<k;i++){
      const v = this.stack.shift()!;
      this.stack.push(v);
    }
  }

  // clear entire stack
  clear(){ this.stack = []; }

  // depth (number of items)
  depth(){ return this.stack.length; }

  // get register by name (X=top, Y=next, Z, T)
  getRegister(r: RegisterName): number | undefined {
    const idx = {X:0,Y:1,Z:2,T:3}[r];
    return this.stack[idx];
  }

  // set register value (sets the stack position)
  setRegister(r: RegisterName, value: number){
    const idx = {X:0,Y:1,Z:2,T:3}[r];
    while (this.stack.length <= idx) this.stack.push(0);
    this.stack[idx] = value;
  }

  // arithmetic helpers: pop two, apply, push result
  binaryOp(fn: (a:number,b:number)=>number){
    const a = this.pop();
    const b = this.pop();
    if (a === undefined || b === undefined) throw new Error('Stack underflow');
    const res = fn(b,a); // note order: b op a
    this.push(res);
    return res;
  }

  add(){ return this.binaryOp((a,b)=>a+b); }
  sub(){ return this.binaryOp((a,b)=>a-b); }
  mul(){ return this.binaryOp((a,b)=>a*b); }
  div(){ return this.binaryOp((a,b)=>{
    if (b === 0) throw new Error('Division by zero');
    return a/b;
  }); }

  // change sign of top
  chs(){
    const v = this.peek();
    if (v === undefined) return undefined;
    this.stack[0] = -v; return this.stack[0];
  }

  // snapshot of stack (top-first)
  snapshot(){ return this.stack.slice(); }
}

export default RPNStack;
