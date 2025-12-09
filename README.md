# Cosmos Calc Fusion

**Uma calculadora unificada** que combina:

*   **Financeira** (HP‑12C/10bII+/17bII+),
*   **Científica** (Casio ClassWiz/HP 35s/HP 50g),
*   **Gráfica 2D/3D** (Casio FX‑CG50, HP Prime, TI Nspire),
*   **Solver e Programação** (macros RPN, equações nomeadas e scripts),
    em uma **aplicação web/desktop** (PWA + Tauri) com **execução offline**, e **gráficos via Three.js**.

## Sumário

*   1.  Visão e Escopo
*   2.  Arquitetura
*   3.  Instalação (offline)
*   4.  Estrutura de Pastas
*   5.  Módulos e Funcionalidades
*   6.  API Interna (contratos)
*   7.  Gráficos com Three.js
*   8.  Exemplos de Código (comentados)
*   9.  Build e Distribuição (PWA/Tauri)
*   10. Performance e Precisão
*   11. Roadmap (Sprints)
*   12. Contribuindo
*   13. Licença

***

## 1. Visão e Escopo

**Objetivo**: fornecer uma única calculadora profissional, com **modo dual de entrada ALG/RPN** (como na **HP 35s**), cobrindo finanças, ciência, estatística e gráficos interativos. [\[hp.com\]](https://www.hp.com/ctg/Manual/c02989763.pdf)

**Referências de domínio**:

*   **HP‑12C** (financeira): TVM (n, i, PV, PMT, FV), NPV/IRR, amortização, depreciação, títulos, datas, *Continuous Memory*. [\[ti.com\]](https://www.ti.com/about-ti/newsroom/news-releases/2019/2019-03-07-texas-instruments-unveils-the-new-and-improved-ti-nspire-cx-ii-line-of-graphing-calculators.html)
*   **HP 10bII+**: atalhos a funções financeiras/estatísticas e probabilidade. [\[hpcalcs.com\]](https://www.hpcalcs.com/downloads/HP12c_user_guide_Portuguese_PT.pdf)
*   **HP 17bII+**: **HP Solver** (equações nomeadas com variáveis), TVM, fluxos listados, bonds, depreciação. [\[manual.nz\]](https://www.manual.nz/hp/10bii+/specifications)
*   **Casio ClassWiz FX‑991CW**: **catálogo de funções**, **47 constantes e 40 conversões**, **Spreadsheet** e visualizações via **QR** (ClassPad.net). [\[manuals.ca\]](https://www.manuals.ca/casio/fx-cg50/manual), [\[manualzz.com\]](https://manualzz.com/doc/47928595/casio-fx-cg50-calculator-user-manual)
*   **Casio FX‑CG50**: **gráficos 2D/3D**, **Paramétrico/Polar/Sequência**, **Geometry**, **Python**. [\[manualslib.com\]](https://www.manualslib.com/products/Hp-Prime-9603514.html), [\[manualzz.com\]](https://manualzz.com/doc/2116506/hp-12c-financial-programmable-calculator-manual-do-usu%C3%A1rio)
*   **HP Prime**: **apps** de Função/Gráfico Avançado/Paramétrico/Polar/Sequência, **Spreadsheet**, **Statistics 1Var/2Var**, **Solve**, **Finance**, **CAS (opcional)**. [\[h10032.www1.hp.com\]](https://h10032.www1.hp.com/ctg/Manual/bpia5239.pdf)
*   **TI Nspire CX II**: graphing **2D/3D**, **geometry**, **listas & planilha**, estatística avançada, **CAS (na versão CAS)**. [\[youtube.com\]](https://www.youtube.com/watch?v=fn4Gdq3CzdA)

**Gráficos**: implementados com **Three.js** (**WebGLRenderer**, **BufferGeometry**, **OrthographicCamera** para 2D e **PerspectiveCamera + OrbitControls** para 3D). [\[threejs.org\]](https://threejs.org/docs/), [\[threejs.org\]](https://threejs.org/docs/pages/BufferGeometry.html), [\[threejs.org\]](https://threejs.org/docs/pages/OrthographicCamera.html)

***

## 2. Arquitetura

*   **Frontend**: TypeScript + Vite (PWA)
*   **Desktop**: Tauri (binário leve, offline)
*   **Renderização Gráfica**: Three.js (sem CDN; pacote `three` via npm) [\[threejs.org\]](https://threejs.org/docs/)
*   **Entrada**: **RPN** (pilha X/Y/Z/T) e **ALG** (parser) alternáveis (como na HP 35s). [\[hp.com\]](https://www.hp.com/ctg/Manual/c02989763.pdf)
*   **Módulos**: `finance/`, `scientific/`, `stats/`, `graphics/`, `solver/`, `programming/`
*   **Persistência**: IndexedDB + exportação/importação JSON/CSV
*   **Relatórios**: exportação de gráficos em PNG e relatórios em Markdown.

***

## 3. Instalação (offline)

> **Importante:** **todas as bibliotecas devem ser baixadas e empacotadas localmente**. Não usar CDN. Isso garante execução offline tanto no navegador (PWA) quanto no desktop (Tauri).

1.  **Criar projeto (Vite + TS)**:
    ```bash
    npm create vite@latest cosmos-calc-fusion -- --template vanilla-ts
    cd cosmos-calc-fusion
    npm i
    ```

2.  **Instalar libs (offline):**
    ```bash
    # Core gráfico
    npm i three

    # (Opcional) utilitários/controle de câmera; importar dos 'addons/examples' empacotados no pacote
    # OrbitControls não faz parte do core, precisa import explicito do módulo de exemplos/addons:
    # ver docs e tutoriais: three/examples/jsm/... ou three/addons/... conforme versão. [14](https://docs.tresjs.org/cookbook/orbit-controls/)[15](https://www.tutorialspoint.com/threejs/threejs_orbit_controls.htm)
    ```

3.  **Sem CDN**: qualquer script/estilo/imagem deve estar em `public/` ou empacotado pelo bundler.

4.  **Tauri (opcional agora, desktop depois):**
    ```bash
    npm i -D @tauri-apps/cli
    npx tauri init
    # siga o wizard e confirme as pastas. (Padrão: src/ e dist/)
    ```

***

## 4. Estrutura de Pastas

    cosmos-calc-fusion/
    ├─ public/                  # assets offline (texturas, ícones, fontes)
    ├─ src/
    │  ├─ core/                 # RPN/ALG, registros, utilidades
    │  │  ├─ rpnStack.ts
    │  │  └─ modes.ts
    │  ├─ finance/              # TVM, NPV/IRR, amortização, datas, %...
    │  │  └─ tvm.ts
    │  ├─ scientific/           # trig, log, complexos, matrizes, base-n, integrais...
    │  │  ├─ complex.ts
    │  │  └─ matrix.ts
    │  ├─ stats/                # 1Var/2Var, regressões, testes/intervalos
    │  │  └─ regressions.ts
    │  ├─ solver/               # Equations (HP Solver-style)
    │  │  └─ solver.ts
    │  ├─ graphics/             # Three.js
    │  │  ├─ GraphScene.ts
    │  │  ├─ plots2d.ts
    │  │  └─ plots3d.ts
    │  ├─ ui/
    │  │  └─ app.ts             # boot da aplicação
    │  └─ index.ts
    ├─ package.json
    ├─ tsconfig.json
    ├─ vite.config.ts
    └─ README.md

***

## 5. Módulos e Funcionalidades

### 5.1 Financeiro (base HP‑12C/10bII+/17bII+)

*   **TVM**: n, i (% período), PV, PMT, FV; modo **BEGIN/END** (parcelas adiantadas/postecipadas). [\[ti.com\]](https://www.ti.com/about-ti/newsroom/news-releases/2019/2019-03-07-texas-instruments-unveils-the-new-and-improved-ti-nspire-cx-ii-line-of-graphing-calculators.html)
*   **Juros simples/compostos**, **porcentagens**; **amortização**. [\[ti.com\]](https://www.ti.com/about-ti/newsroom/news-releases/2019/2019-03-07-texas-instruments-unveils-the-new-and-improved-ti-nspire-cx-ii-line-of-graphing-calculators.html)
*   **Fluxos de caixa** (**NPV/IRR**), listas `CF0..CFn`. [\[ti.com\]](https://www.ti.com/about-ti/newsroom/news-releases/2019/2019-03-07-texas-instruments-unveils-the-new-and-improved-ti-nspire-cx-ii-line-of-graphing-calculators.html)
*   **Títulos (bonds)** e **depreciação** (SL/DB/SOYD/ACRS). [\[ti.com\]](https://www.ti.com/about-ti/newsroom/news-releases/2019/2019-03-07-texas-instruments-unveils-the-new-and-improved-ti-nspire-cx-ii-line-of-graphing-calculators.html)
*   **Datas**: diferença de dias (30/360, calendário). [\[ti.com\]](https://www.ti.com/about-ti/newsroom/news-releases/2019/2019-03-07-texas-instruments-unveils-the-new-and-improved-ti-nspire-cx-ii-line-of-graphing-calculators.html)
*   **Solver** (equações nomeadas com variáveis), estilo **HP 17bII+**. [\[manual.nz\]](https://www.manual.nz/hp/10bii+/specifications)

### 5.2 Científica (Casio ClassWiz/HP 35s/HP 50g)

*   **Trig/hyperb, log/exp**, **complexos**, **matrizes/vetores**, **base‑n**. [\[manuals.ca\]](https://www.manuals.ca/casio/fx-cg50/manual), [\[hp.com\]](https://www.hp.com/ctg/Manual/c02989763.pdf)
*   **Integração/derivação numérica** (simbólica via módulo CAS opcional). [\[manua.ls\]](https://www.manua.ls/hp/50g/manual)
*   **Constantes (47)** e **conversões (40)** como no **ClassWiz**; **Catálogo** de funções. [\[manuals.ca\]](https://www.manuals.ca/casio/fx-cg50/manual)

### 5.3 Gráficos (Casio FX‑CG50 / HP Prime / TI Nspire)

*   **Função 2D y=f(x)**, **Paramétrico 2D**, **Polar**, **Sequência**. [\[manualslib.com\]](https://www.manualslib.com/products/Hp-Prime-9603514.html)
*   **Superfície 3D z=f(x,y)**, **curvas 3D**. [\[youtube.com\]](https://www.youtube.com/watch?v=fn4Gdq3CzdA)
*   **Estatísticos**: dispersão 2D, regressões com linha ajustada. [\[youtube.com\]](https://www.youtube.com/watch?v=fn4Gdq3CzdA)
*   **Geometry** (formas, construção visual). [\[manualslib.com\]](https://www.manualslib.com/products/Hp-Prime-9603514.html)

### 5.4 CAS (opcional)

*   **Simbólico** (simplificação, derivação/integral simbólica, fatoração). Inspirado em **HP Prime/Nspire CAS**. [\[h10032.www1.hp.com\]](https://h10032.www1.hp.com/ctg/Manual/bpia5239.pdf), [\[youtube.com\]](https://www.youtube.com/watch?v=fn4Gdq3CzdA)

***

## 6. API Interna (contratos)

```ts
// Financeiro
export interface TVM {
  n?: number;      // número de períodos
  i?: number;      // taxa (% por período)
  PV?: number;     // valor presente (saída -> usar CHS como na HP 12C)
  PMT?: number;    // pagamento periódico
  FV?: number;     // valor futuro
  due?: 'END' | 'BEGIN'; // parcelas postecipadas (END) / adiantadas (BEGIN)
}

export function solveFV(args: TVM): number;
export function solvePMT(args: TVM): number;
// ... NPV(cf: number[], i: number) e IRR(cf: number[], guess?: number)
```

```ts
// Gráficos
export interface Plot2DOptions {
  xmin: number; xmax: number;
  samples?: number; color?: number;
}
export function addPlot2D(scene: THREE.Scene, f:(x:number)=>number, opts?: Plot2DOptions): THREE.Line;

export interface SurfaceOptions {
  xmin:number; xmax:number; ymin:number; ymax:number;
  steps?: number; color?: number;
}
export function addSurface(scene: THREE.Scene, f:(x:number,y:number)=>number, opts?: SurfaceOptions): THREE.Mesh;
```

***

## 7. Gráficos com Three.js

*   **Renderer**: `WebGLRenderer` com `antialias` e `preserveDrawingBuffer` para exportar PNG localmente. [\[threejs.org\]](https://threejs.org/docs/)
*   **Câmeras**:
    *   2D: `OrthographicCamera` (tamanho constante sem distorção). [\[threejs.org\]](https://threejs.org/docs/pages/OrthographicCamera.html)
    *   3D: `PerspectiveCamera` + `OrbitControls` (rotação/zoom/pan interativos). **OrbitControls** não está no núcleo; importa-se de **examples/addons**. [\[tutorialspoint.com\]](https://www.tutorialspoint.com/threejs/threejs_orbit_controls.htm), [\[docs.tresjs.org\]](https://docs.tresjs.org/cookbook/orbit-controls/)
*   **Geometrias**: curvas/linhas com `BufferGeometry` para performance; superfícies com índices e normais. [\[threejs.org\]](https://threejs.org/docs/pages/BufferGeometry.html)
*   **Paramétrico**: para curvas/superfícies, é possível usar geometrias paramétricas (hoje nos *examples* da Three.js). [\[stackoverflow.com\]](https://stackoverflow.com/questions/61363413/parametricbuffergeometry-in-three-js), [\[threejs.org\]](https://threejs.org/docs/pages/ParametricGeometry.html)

***

## 8. Exemplos de Código (comentados)

> **Observação:** Todos os trechos abaixo são **offline** (importando via npm), sem CDNs. Ajuste caminhos conforme sua versão da `three`.

### 8.1 `src/graphics/GraphScene.ts` — Cena base 2D/3D

```ts
// GraphScene.ts
// Cena básica com Three.js para 2D (OrthographicCamera) e 3D (PerspectiveCamera + OrbitControls),
// com grade/eixos, iluminação e renderer offline.
// Referências: three.js docs (câmeras, renderer, BufferGeometry). [11](https://threejs.org/docs/)[13](https://threejs.org/docs/pages/OrthographicCamera.html)

import * as THREE from 'three';
// OrbitControls é um addon fora do core; importa-se dos "examples/jsm" (ou "addons").
// Ver docs: não está no núcleo e precisa import manual. [15](https://www.tutorialspoint.com/threejs/threejs_orbit_controls.htm)
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export type Mode = '2D' | '3D';

export class GraphScene {
  public scene: THREE.Scene;
  public renderer: THREE.WebGLRenderer;
  public camera: THREE.Camera;
  public controls?: OrbitControls;

  constructor(private canvas: HTMLCanvasElement, opts: {
    mode: Mode;
    width?: number; height?: number;
    background?: number; // cor de fundo (hex)
  }) {
    this.scene = new THREE.Scene();
    if (opts.background !== undefined) this.scene.background = new THREE.Color(opts.background);

    const width = opts.width ?? canvas.clientWidth;
    const height = opts.height ?? canvas.clientHeight;

    if (opts.mode === '2D') {
      // OrthographicCamera mantém escala constante — ideal para gráficos 2D. [13](https://threejs.org/docs/pages/OrthographicCamera.html)
      const frustum = 20; // tamanho do "mundo" visível (ajustável via zoom)
      const aspect = width / height;
      this.camera = new THREE.OrthographicCamera(
        -frustum * aspect/2, frustum * aspect/2,
        frustum/2, -frustum/2, 0.1, 1000
      );
      (this.camera as THREE.OrthographicCamera).position.set(0, 0, 100);
    } else {
      // PerspectiveCamera para 3D; controles interativos com OrbitControls. [11](https://threejs.org/docs/)[15](https://www.tutorialspoint.com/threejs/threejs_orbit_controls.htm)
      this.camera = new THREE.PerspectiveCamera(45, width/height, 0.1, 1000);
      (this.camera as THREE.PerspectiveCamera).position.set(20, 20, 20);
      this.controls = new OrbitControls(this.camera as THREE.PerspectiveCamera, canvas);
      this.controls.enableDamping = true;
    }

    // Renderer local (sem CDN), com antialias e preservação para exportar PNG
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, preserveDrawingBuffer: true });
    this.renderer.setSize(width, height);

    // Eixos auxiliares (XYZ) e grade
    this.addAxesAndGrid(opts.mode);

    // Luz para 3D (Phong/Standard); em 2D, geralmente não é necessário
    if (opts.mode === '3D') {
      const light = new THREE.DirectionalLight(0xffffff, 1.0);
      light.position.set(20, 20, 30);
      this.scene.add(light);
      this.scene.add(new THREE.AmbientLight(0x404040));
    }
  }

  private addAxesAndGrid(mode: Mode) {
    const axes = new THREE.AxesHelper(10); // (X vermelho, Y verde, Z azul)
    this.scene.add(axes);

    if (mode === '3D') {
      const grid = new THREE.GridHelper(40, 40, 0x888888, 0xcccccc);
      this.scene.add(grid);
    } else {
      // Grade 2D no plano XY
      const group = new THREE.Group();
      const material = new THREE.LineBasicMaterial({ color: 0xcccccc });
      const range = 10, step = 1;
      for (let x = -range; x <= range; x += step) {
        const geo = new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(x, -range, 0),
          new THREE.Vector3(x,  range, 0),
        ]);
        group.add(new THREE.Line(geo, material));
      }
      for (let y = -range; y <= range; y += step) {
        const geo = new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(-range, y, 0),
          new THREE.Vector3( range, y, 0),
        ]);
        group.add(new THREE.Line(geo, material));
      }
      this.scene.add(group);
    }
  }

  // tick do render
  render() {
    this.controls?.update(); // OrbitControls precisa de update por frame. [15](https://www.tutorialspoint.com/threejs/threejs_orbit_controls.htm)
    this.renderer.render(this.scene, this.camera);
  }
}
```

### 8.2 `src/graphics/plots2d.ts` — Funções/Paramétrico/Polar 2D

```ts
// plots2d.ts
// Curvas 2D com BufferGeometry, para y=f(x), paramétrico e polar.
// BufferGeometry é mais performático para linhas/pontos. [12](https://threejs.org/docs/pages/BufferGeometry.html)

import * as THREE from 'three';

export interface Plot2DOptions {
  xmin?: number; xmax?: number; samples?: number; color?: number;
}

export function addPlot2D(scene: THREE.Scene, f:(x:number)=>number, opts: Plot2DOptions = {}){
  const xmin = opts.xmin ?? -10, xmax = opts.xmax ?? 10;
  const samples = opts.samples ?? 1000; const color = opts.color ?? 0x0066ff;
  const pts: THREE.Vector3[] = [];
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

// Paramétrico: x(t), y(t)
export function addParametric2D(scene: THREE.Scene, x:(t:number)=>number, y:(t:number)=>number,
  tmin=0, tmax=2*Math.PI, samples=1000, color=0xff6600){
  const pts: THREE.Vector3[] = [];
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

// Polar: r = g(θ) → x = r cos θ, y = r sin θ
export function addPolar(scene: THREE.Scene, g:(theta:number)=>number,
  thMin=0, thMax=2*Math.PI, samples=1000, color=0x00aa55){
  return addParametric2D(scene,
    (th)=> g(th)*Math.cos(th),
    (th)=> g(th)*Math.sin(th),
    thMin, thMax, samples, color
  );
}
```

### 8.3 `src/graphics/plots3d.ts` — Superfície 3D e Dispersão

```ts
// plots3d.ts
// Superfície z=f(x,y) com malha (índices e normais) + luz direcional.
// E nuvem de pontos (estatística). Referências de materiais/luzes em docs. [11](https://threejs.org/docs/)

import * as THREE from 'three';

export interface SurfaceOptions {
  xmin?:number; xmax?:number; ymin?:number; ymax?:number;
  steps?: number; color?: number;
}

export function addSurface(scene: THREE.Scene, f:(x:number,y:number)=>number, opts: SurfaceOptions = {}){
  const xmin = opts.xmin ?? -5, xmax = opts.xmax ?? 5;
  const ymin = opts.ymin ?? -5, ymax = opts.ymax ?? 5;
  const nx = opts.steps ?? 120, ny = opts.steps ?? 120;
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
      positions[k++] = Number.isFinite(z) ? z : NaN;
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

export function addScatter2D(scene: THREE.Scene, data: Array<{x:number,y:number}>, color=0x2222aa, size=0.08){
  const group = new THREE.Group();
  const geom = new THREE.SphereGeometry(size, 16, 16);
  const mat = new THREE.MeshBasicMaterial({ color });
  for(const p of data){
    const sp = new THREE.Mesh(geom, mat);
    sp.position.set(p.x, p.y, 0);
    group.add(sp);
  }
  scene.add(group);
  return group;
}
```

### 8.4 `src/finance/tvm.ts` — TVM básico (comentado)

```ts
// tvm.ts
// Implementação básica de TVM (juros compostos) inspirada na organização HP-12C.
// Campos seguem a notação clássica da HP (n, i, PV, PMT, FV).
// Referência do escopo financeiro: guia HP-12C (funções e registros financeiros). [2](https://www.ti.com/about-ti/newsroom/news-releases/2019/2019-03-07-texas-instruments-unveils-the-new-and-improved-ti-nspire-cx-ii-line-of-graphing-calculators.html)

export interface TVM { n?: number; i?: number; PV?: number; PMT?: number; FV?: number; due?: 'END'|'BEGIN'; }

// Valor Futuro: FV = -( PV*(1+r)^n + PMT * ((1+r)^(n) - 1)/r * shift_due )
export function solveFV({n=0,i=0,PV=0,PMT=0,due='END'}: TVM){
  const r = i/100;
  const factor = Math.pow(1+r, n);
  const shift = (due==='BEGIN') ? (1+r) : 1; // pagamentos adiantados (BEGIN) equivalem a multiplicar por (1+r)
  const ann = PMT ? PMT * shift * ((factor - 1)/r) : 0;
  return -( PV*factor + ann );
}

// Pagamento (PMT) dado n, i, PV, FV:
// PMT = - ( PV*r/(1 - (1+r)^(-n)) + FV*r/( (1+r)^n - 1 ) ) ajustando BEGIN/END
export function solvePMT({n=0,i=0,PV=0,FV=0,due='END'}: TVM){
  const r = i/100;
  const factor = Math.pow(1+r, n);
  const annEnd = (PV*r) / (1 - Math.pow(1+r, -n)) + (FV*r) / (factor - 1);
  const shift = (due==='BEGIN') ? (1+r) : 1;
  return -annEnd / shift;
}
```

### 8.5 `src/index.ts` — Bootstrap mínimo

```ts
// index.ts
// Inicializa a aplicação e exibe um gráfico 2D simples y = sin(x) e uma superfície 3D z = sin(x)*cos(y).
// Demonstra uso de GraphScene e módulos de plotagem, para validar Three.js offline.
// Referências: Three.js docs (renderer/câmeras/controls). [11](https://threejs.org/docs/)[15](https://www.tutorialspoint.com/threejs/threejs_orbit_controls.htm)

import { GraphScene } from './graphics/GraphScene';
import { addPlot2D } from './graphics/plots2d';
import { addSurface } from './graphics/plots3d';

// Canvas deve existir no index.html (offline, sem CDN).
const canvas2d = document.getElementById('canvas2d') as HTMLCanvasElement;
const canvas3d = document.getElementById('canvas3d') as HTMLCanvasElement;

// Cena 2D (Orthographic)
const scene2d = new GraphScene(canvas2d, { mode: '2D', background: 0xffffff });
addPlot2D(scene2d.scene, x => Math.sin(x), { xmin: -10, xmax: 10, samples: 1200, color: 0x0066ff });
scene2d.render();

// Cena 3D (Perspective + OrbitControls)
const scene3d = new GraphScene(canvas3d, { mode: '3D', background: 0xf7f7f7 });
addSurface(scene3d.scene, (x,y) => Math.sin(x)*Math.cos(y), { xmin:-5, xmax:5, ymin:-5, ymax:5, steps:120, color: 0x6699ff });

// Loop simples de animação para 3D
function animate(){
  requestAnimationFrame(animate);
  scene3d.render();
}
animate();
```

***

## 9. Build e Distribuição (PWA/Tauri)

### 9.1 PWA (web offline)

*   **Instale** via `npm i` (sem internet na execução da app, apenas para instalação inicial).
*   **Build**:
    ```bash
    npm run build
    ```
*   **Servir local**: `vite preview` ou hospedar no GitHub Pages (a app continuará funcionando offline após o primeiro uso, se você implementar um Service Worker PWA).

### 9.2 Tauri (desktop offline)

*   `npx tauri init` e configure para apontar o **dist** do Vite.
*   Build:
    ```bash
    npm run tauri build
    ```
*   O binário inclui todos os assets/libs **offline**.

***

## 10. Performance e Precisão

*   Use **BufferGeometry** para linhas/curvas e **atributos** compactos para superfícies (normais e índices). [\[threejs.org\]](https://threejs.org/docs/pages/BufferGeometry.html)
*   **Amostragem adaptativa**: mais pontos onde `|f’(x)|` é grande.
*   **2D** com **OrthographicCamera** (sem distorção, zoom via `camera.zoom`) para gráficos consistentes. [\[threejs.org\]](https://threejs.org/docs/pages/OrthographicCamera.html)
*   **OrbitControls** apenas em 3D; atualize em cada frame (performance suave). [\[tutorialspoint.com\]](https://www.tutorialspoint.com/threejs/threejs_orbit_controls.htm)

***

## 11. Roadmap (Sprints)

1.  **Núcleo RPN/ALG** (pilha X/Y/Z/T, parser ALG) — ref. **HP 35s**. [\[hp.com\]](https://www.hp.com/ctg/Manual/c02989763.pdf)
2.  **Finance TVM/NPV/IRR/Amortização/Porcentagens/Datas** — ref. **HP‑12C**. [\[ti.com\]](https://www.ti.com/about-ti/newsroom/news-releases/2019/2019-03-07-texas-instruments-unveils-the-new-and-improved-ti-nspire-cx-ii-line-of-graphing-calculators.html)
3.  **Científica** (trig/log, complexos, base‑n, matrizes, integrais/derivadas numéricas) — ref. **ClassWiz/FX‑991ES Plus‑2**. [\[manuals.ca\]](https://www.manuals.ca/casio/fx-cg50/manual), [\[manua.ls\]](https://www.manua.ls/hp/50g/manual)
4.  **Estatística** (1Var/2Var, regressões, testes, intervalos) — ref. **Nspire**. [\[youtube.com\]](https://www.youtube.com/watch?v=fn4Gdq3CzdA)
5.  **Gráficos** (2D/Paramétrico/Polar/Sequência, 3D/superfícies, Geometry) — ref. **FX‑CG50/HP Prime/Nspire**. [\[manualslib.com\]](https://www.manualslib.com/products/Hp-Prime-9603514.html), [\[h10032.www1.hp.com\]](https://h10032.www1.hp.com/ctg/Manual/bpia5239.pdf), [\[youtube.com\]](https://www.youtube.com/watch?v=fn4Gdq3CzdA)
6.  **Solver/Programação/Spreadsheet** (HP 17bII+ / ClassWiz) + **CAS opcional** (HP Prime/Nspire CAS). [\[manual.nz\]](https://www.manual.nz/hp/10bii+/specifications), [\[manuals.ca\]](https://www.manuals.ca/casio/fx-cg50/manual), [\[h10032.www1.hp.com\]](https://h10032.www1.hp.com/ctg/Manual/bpia5239.pdf)

***

## 12. Contribuindo

*   **Padrões de código**: TypeScript, comentários JSDoc, funções puras onde possível.
*   **Commits** com mensagens semânticas.
*   **Issues**: abrir com exemplo mínimo reproduzível.

***

## 13. Licença

Defina a licença (ex.: MIT).

> **Atenção:** o projeto é uma **implementação original** inspirada em recursos documentados das calculadoras citadas. Não inclui firmware nem trechos dos manuais; apenas reproduz **funcionalidades públicas** e **interfaces usuais** como referência. (Ver manuais: HP‑12C, HP Prime, Casio FX‑CG50, TI Nspire). [\[ti.com\]](https://www.ti.com/about-ti/newsroom/news-releases/2019/2019-03-07-texas-instruments-unveils-the-new-and-improved-ti-nspire-cx-ii-line-of-graphing-calculators.html), [\[h10032.www1.hp.com\]](https://h10032.www1.hp.com/ctg/Manual/bpia5239.pdf), [\[manualslib.com\]](https://www.manualslib.com/products/Hp-Prime-9603514.html), [\[youtube.com\]](https://www.youtube.com/watch?v=fn4Gdq3CzdA)

***

### Anexo A — Referências (selecionadas)

*   **Three.js Docs** (Câmeras, Renderer, BufferGeometry): [threejs.org/docs](https://threejs.org/docs/) • [BufferGeometry](https://threejs.org/docs/pages/BufferGeometry.html) • [OrthographicCamera](https://threejs.org/docs/pages/OrthographicCamera.html)
*   **OrbitControls** (addon, não core): [Tutorial/Docs](https://www.tutorialspoint.com/threejs/threejs_orbit_controls.htm) • [Guia TresJS sobre OrbitControls](https://docs.tresjs.org/cookbook/orbit-controls/)
*   **HP‑12C — Guia do Usuário** (Português): [PDF oficial](https://www.ti.com/about-ti/newsroom/news-releases/2019/2019-03-07-texas-instruments-unveils-the-new-and-improved-ti-nspire-cx-ii-line-of-graphing-calculators.html)
*   **HP Prime — User Guide/Quick Start/Apps**: [HP Support / Literature](https://h10032.www1.hp.com/ctg/Manual/bpia5239.pdf)
*   **Casio FX‑CG50 — Manual (PT/EN)**: [Manual PT](https://www.manualslib.com/products/Hp-Prime-9603514.html) • [User’s Guide EN](https://www.hpcc.org/calculators/hpprime/HP_Prime_User_Guide_EN.pdf)
*   **Casio ClassWiz FX‑991CW** — Especificações/Curso: [Casio Education](https://www.manuals.ca/casio/fx-cg50/manual) • [Página do produto](https://manualzz.com/doc/47928595/casio-fx-cg50-calculator-user-manual)
*   **TI Nspire CX II — Especificações**: [TI Education specs](https://www.youtube.com/watch?v=fn4Gdq3CzdA)

***

## Como executar (Desenvolvimento)

- Certifique-se de ter executado `npm install` no diretório do projeto (você mencionou que já executou).
- Rodar servidor de desenvolvimento (Vite):

```bash
cd /workspaces/calculadora
npm run dev
```

Isso iniciará o Vite e servirá a aplicação em `http://localhost:5173` (porta padrão). O servidor permite recarga ao vivo enquanto desenvolve.

- Build de produção:

```bash
npm run build
npm run preview
```

Observações:
- O projeto usa `three` (Three.js) via `npm`; o `OrbitControls` é importado de `three/examples/jsm/controls/OrbitControls.js` e funciona quando `three` está instalado via npm.
- Para empacotar como aplicativo desktop com Tauri, rode `npx tauri init` e depois `npm run tauri build` (consulte docs do Tauri para requisitos do sistema).

