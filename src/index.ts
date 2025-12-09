import { GraphScene } from './graphics/GraphScene';
import { addPlot2D } from './graphics/plots2d';
import { addSurface } from './graphics/plots3d';
import { initApp } from './ui/app';

// Initialize Calculator UI
initApp();

// Get canvas elements (optional, for graphics)
const canvas2d = document.getElementById('canvas2d') as HTMLCanvasElement | null;
const canvas3d = document.getElementById('canvas3d') as HTMLCanvasElement | null;

if (canvas2d && canvas3d) {
  // 2D scene
  const scene2d = new GraphScene(canvas2d, { mode: '2D', background: 0xffffff });
  addPlot2D(scene2d.scene, x => Math.sin(x), { xmin: -10, xmax: 10, samples: 1200, color: 0x0066ff });
  scene2d.render();

  // 3D scene
  const scene3d = new GraphScene(canvas3d, { mode: '3D', background: 0xf7f7f7 });
  addSurface(scene3d.scene, (x,y) => Math.sin(x)*Math.cos(y), { xmin:-5, xmax:5, ymin:-5, ymax:5, steps:120, color: 0x6699ff });

  function animate(){
    requestAnimationFrame(animate);
    scene3d.render();
  }
  animate();
} else {
  console.log('Canvas elements not found - graphics disabled');
}
