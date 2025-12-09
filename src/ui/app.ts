import RPNStack from '../core/rpnStack';
import ModeManager from '../core/modes';

export interface CalculatorConfig {
  containerId?: string;
  displayId?: string;
  stackDisplayId?: string;
  keypadId?: string;
}

export class Calculator {
  private stack: RPNStack;
  private modes: ModeManager;
  private currentInput: string = '';
  private displayEl?: HTMLElement | null;
  private stackDisplayEl?: HTMLElement | null;
  private container?: HTMLElement | null;

  constructor(config: CalculatorConfig = {}) {
    this.stack = new RPNStack();
    this.modes = new ModeManager('ALG');
    
    this.displayEl = document.getElementById(config.displayId || 'calc-display');
    this.stackDisplayEl = document.getElementById(config.stackDisplayId || 'calc-stack');
    this.container = document.getElementById(config.containerId || 'calc-container');

    if (this.container) {
      this.renderUI();
      this.attachEventListeners();
    }
  }

  private renderUI() {
    if (!this.container) return;
    
    this.container.innerHTML = `
      <div class="calc-wrapper" style="font-family: monospace; border: 1px solid #ccc; padding: 10px; background: #f5f5f5; border-radius: 4px; max-width: 400px;">
        <div style="margin-bottom: 10px;">
          <button id="calc-mode-btn" style="padding: 5px 10px; cursor: pointer;">Mode: ALG</button>
        </div>
        <div id="calc-display" style="background: #000; color: #0f0; padding: 10px; border-radius: 3px; margin-bottom: 10px; min-height: 30px; text-align: right; font-size: 18px;">0</div>
        <div id="calc-stack" style="background: #fff; padding: 8px; border: 1px solid #ddd; margin-bottom: 10px; min-height: 60px; font-size: 12px; white-space: pre;">X: 0</div>
        <div id="calc-keypad" style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 4px;">
          <!-- Buttons added below -->
        </div>
      </div>
    `;

    // Buttons (numeric, operators, functions)
    const keypad = document.getElementById('calc-keypad') as HTMLElement;
    const buttons = [
      ['7', '8', '9', '/'],
      ['4', '5', '6', '*'],
      ['1', '2', '3', '-'],
      ['0', '.', '=', '+'],
      ['CLR', 'ENTER', 'SWAP', 'CHS'],
      ['SIN', 'COS', 'TAN', 'LN'],
      ['√', '^', 'NPV', 'IRR'],
    ];

    buttons.forEach(row => {
      row.forEach(label => {
        const btn = document.createElement('button');
        btn.textContent = label;
        btn.id = `btn-${label}`;
        btn.style.cssText = 'padding: 8px; cursor: pointer; border: 1px solid #999; background: #e0e0e0; border-radius: 3px;';
        btn.addEventListener('click', () => this.handleButtonClick(label));
        keypad.appendChild(btn);
      });
    });

    this.updateDisplay();
  }

  private attachEventListeners() {
    const modeBtn = document.getElementById('calc-mode-btn');
    if (modeBtn) {
      modeBtn.addEventListener('click', () => this.toggleMode());
    }
  }

  private toggleMode() {
    const newMode = this.modes.getMode() === 'ALG' ? 'RPN' : 'ALG';
    this.modes.setMode(newMode);
    const modeBtn = document.getElementById('calc-mode-btn');
    if (modeBtn) modeBtn.textContent = `Mode: ${newMode}`;
    this.currentInput = '';
    this.updateDisplay();
  }

  private handleButtonClick(label: string) {
    switch (label) {
      case 'CLR':
        this.stack.clear();
        this.currentInput = '';
        break;
      case 'ENTER':
        if (this.currentInput) {
          const val = parseFloat(this.currentInput);
          if (!isNaN(val)) {
            this.stack.push(val);
            this.currentInput = '';
          }
        } else {
          this.stack.enter();
        }
        break;
      case 'SWAP':
        this.stack.swap();
        break;
      case 'CHS':
        this.stack.chs();
        break;
      case '=':
        if (this.modes.isRPN()) {
          // In RPN, = might just confirm (already entered)
          if (this.currentInput) {
            const val = parseFloat(this.currentInput);
            if (!isNaN(val)) {
              this.stack.push(val);
              this.currentInput = '';
            }
          }
        } else {
          // In ALG, = evaluates the expression
          this.evaluateALG();
        }
        break;
      case '+':
      case '-':
      case '*':
      case '/':
        if (this.modes.isRPN()) {
          if (this.currentInput) {
            const val = parseFloat(this.currentInput);
            if (!isNaN(val)) {
              this.stack.push(val);
              this.currentInput = '';
            }
          }
          try {
            if (label === '+') this.stack.add();
            else if (label === '-') this.stack.sub();
            else if (label === '*') this.stack.mul();
            else if (label === '/') this.stack.div();
          } catch (e) {
            console.error(e);
          }
        } else {
          // In ALG, accumulate operator
          if (this.currentInput) {
            const val = parseFloat(this.currentInput);
            if (!isNaN(val)) {
              this.stack.push(val);
              this.currentInput = '';
            }
          }
          if (!this.currentInput) {
            this.currentInput = label;
          }
        }
        break;
      case 'SIN':
      case 'COS':
      case 'TAN':
      case 'LN':
      case '√':
      case '^':
        if (this.currentInput) {
          const val = parseFloat(this.currentInput);
          if (!isNaN(val)) {
            this.stack.push(val);
            this.currentInput = '';
          }
        }
        const x = this.stack.pop();
        if (x !== undefined) {
          let res = x;
          if (label === 'SIN') res = Math.sin(x);
          else if (label === 'COS') res = Math.cos(x);
          else if (label === 'TAN') res = Math.tan(x);
          else if (label === 'LN') res = Math.log(x);
          else if (label === '√') res = Math.sqrt(x);
          else if (label === '^') {
            const y = this.stack.pop();
            if (y !== undefined) res = Math.pow(y, x);
            else this.stack.push(x);
          }
          this.stack.push(res);
        }
        break;
      case 'NPV':
      case 'IRR':
        // Placeholder for financial functions (would require input dialog)
        console.log(`${label} not yet integrated`);
        break;
      default:
        // Numeric or decimal
        this.currentInput += label;
    }
    this.updateDisplay();
  }

  private evaluateALG() {
    // Simple ALG evaluation: pop two values and the operator, compute
    try {
      const x = this.stack.pop();
      const op = this.currentInput; // should be +, -, *, /
      const y = this.stack.pop();
      if (x !== undefined && y !== undefined) {
        let res = y;
        if (op === '+') res = y + x;
        else if (op === '-') res = y - x;
        else if (op === '*') res = y * x;
        else if (op === '/') {
          if (x === 0) throw new Error('Division by zero');
          res = y / x;
        }
        this.stack.push(res);
        this.currentInput = '';
      }
    } catch (e) {
      console.error(e);
    }
  }

  private updateDisplay() {
    if (this.displayEl) {
      this.displayEl.textContent = this.currentInput || this.stack.peek()?.toString() || '0';
    }
    if (this.stackDisplayEl) {
      const snapshot = this.stack.snapshot();
      let text = 'X: ' + (snapshot[0] ?? 0) + '\n';
      if (snapshot[1] !== undefined) text += 'Y: ' + snapshot[1] + '\n';
      if (snapshot[2] !== undefined) text += 'Z: ' + snapshot[2] + '\n';
      if (snapshot[3] !== undefined) text += 'T: ' + snapshot[3];
      this.stackDisplayEl.textContent = text;
    }
  }

  getStack(): RPNStack {
    return this.stack;
  }

  getModeManager() {
    return this.modes;
  }

  setMode(m: 'RPN' | 'ALG') {
    this.modes.setMode(m);
    const modeBtn = document.getElementById('calc-mode-btn');
    if (modeBtn) modeBtn.textContent = `Mode: ${m}`;
  }
}

export function initApp(): void {
  const calc = new Calculator({
    containerId: 'calc-app',
    displayId: 'calc-display',
    stackDisplayId: 'calc-stack',
    keypadId: 'calc-keypad',
  });
  console.log('Cosmos Calc Fusion initialized with Calculator UI');
  (window as any).calculator = calc;
}

export default Calculator;
