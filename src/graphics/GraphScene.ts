import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export type Mode = '2D' | '3D';

export class GraphScene {
  public scene: any;
  public renderer: any;
  public camera: any;
  public controls?: any;

  constructor(private canvas: HTMLCanvasElement, opts: {
    mode: Mode;
    width?: number; height?: number;
    background?: number;
  }) {
    this.scene = new THREE.Scene();
    if (opts.background !== undefined) this.scene.background = new THREE.Color(opts.background);

    const width = opts.width ?? canvas.clientWidth;
    const height = opts.height ?? canvas.clientHeight;

    if (opts.mode === '2D') {
      const frustum = 20;
      const aspect = width / height;
      this.camera = new THREE.OrthographicCamera(
        -frustum * aspect/2, frustum * aspect/2,
        frustum/2, -frustum/2, 0.1, 1000
      );
      this.camera.position.set(0, 0, 100);
    } else {
      this.camera = new THREE.PerspectiveCamera(45, width/height, 0.1, 1000);
      this.camera.position.set(20, 20, 20);
      this.controls = new OrbitControls(this.camera, canvas);
      this.controls.enableDamping = true;
    }

    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, preserveDrawingBuffer: true });
    this.renderer.setSize(width, height);

    this.addAxesAndGrid(opts.mode);

    if (opts.mode === '3D') {
      const light = new THREE.DirectionalLight(0xffffff, 1.0);
      light.position.set(20, 20, 30);
      this.scene.add(light);
      this.scene.add(new THREE.AmbientLight(0x404040));
    }
  }

  private addAxesAndGrid(mode: Mode) {
    const axes = new THREE.AxesHelper(10);
    this.scene.add(axes);

    if (mode === '3D') {
      const grid = new THREE.GridHelper(40, 40, 0x888888, 0xcccccc);
      this.scene.add(grid);
    } else {
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

  render() {
    this.controls?.update();
    this.renderer.render(this.scene, this.camera);
  }
}
