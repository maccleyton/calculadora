export type InputMode = 'RPN' | 'ALG';

export class ModeManager {
  private mode: InputMode = 'ALG';

  constructor(initial: InputMode = 'ALG'){
    this.mode = initial;
  }

  setMode(m: InputMode){ this.mode = m; }
  getMode(): InputMode { return this.mode; }
  isRPN(): boolean { return this.mode === 'RPN'; }
}

export default ModeManager;
