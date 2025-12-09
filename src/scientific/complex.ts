export class Complex {
  constructor(public re: number, public im: number = 0){}

  add(b: Complex){ return new Complex(this.re + b.re, this.im + b.im); }
  sub(b: Complex){ return new Complex(this.re - b.re, this.im - b.im); }
  mul(b: Complex){
    return new Complex(this.re*b.re - this.im*b.im, this.re*b.im + this.im*b.re);
  }
  div(b: Complex){
    const den = b.re*b.re + b.im*b.im;
    return new Complex((this.re*b.re + this.im*b.im)/den, (this.im*b.re - this.re*b.im)/den);
  }
  conj(){ return new Complex(this.re, -this.im); }
  abs(){ return Math.hypot(this.re, this.im); }
  toString(){ return `${this.re}${this.im>=0?'+':''}${this.im}i`; }
}

export default Complex;
