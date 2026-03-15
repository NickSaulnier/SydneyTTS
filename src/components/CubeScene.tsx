import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const GRID_X = 6;
const GRID_Y = 6;
const GRID_Z = 4;
const GRID_SPACING = 2.0;
const CUBE_SIZE = 0.5;

// MUI error/button red: #d32f2f (rgb 211, 47, 47)
function randomRed(): number {
  const r = 0.8 + Math.random() * 0.2; // 0.8–1.0
  const g = 0.15 + Math.random() * 0.1; // 0.15–0.25
  const b = 0.15 + Math.random() * 0.1; // 0.15–0.25
  return new THREE.Color(r, g, b).getHex();
}

export function CubeScene() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const cont = container;

    let renderer: THREE.WebGLRenderer | undefined;
    let scene: THREE.Scene;
    let camera: THREE.PerspectiveCamera;
    let cubes: { mesh: THREE.Mesh; speed: THREE.Vector3 }[] = [];
    let animationId: number | undefined;
    let lastTime = 0;

    function init() {
      const width = cont.clientWidth;
      const height = cont.clientHeight;
      if (width === 0 || height === 0) return;

      scene = new THREE.Scene();
      scene.background = null;

      camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
      camera.position.set(0, 0, 12);
      camera.lookAt(0, 0, 0);

      const canvas = document.createElement('canvas');
      canvas.style.display = 'block';
      canvas.style.position = 'absolute';
      canvas.style.top = '0';
      canvas.style.left = '0';
      canvas.style.width = '100%';
      canvas.style.height = '100%';
      canvas.width = width;
      canvas.height = height;
      cont.appendChild(canvas);

      renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
      renderer.setClearColor(0x000000, 0);
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

      const geometry = new THREE.BoxGeometry(CUBE_SIZE, CUBE_SIZE, CUBE_SIZE);
      cubes = [];

      const offsetX = ((GRID_X - 1) * GRID_SPACING) / 2;
      const offsetY = ((GRID_Y - 1) * GRID_SPACING) / 2;
      const offsetZ = ((GRID_Z - 1) * GRID_SPACING) / 2;

      for (let ix = 0; ix < GRID_X; ix++) {
        for (let iy = 0; iy < GRID_Y; iy++) {
          for (let iz = 0; iz < GRID_Z; iz++) {
            const material = new THREE.MeshBasicMaterial({
              color: randomRed(),
            });
            const mesh = new THREE.Mesh(geometry, material);
            mesh.position.x = ix * GRID_SPACING - offsetX;
            mesh.position.y = iy * GRID_SPACING - offsetY;
            mesh.position.z = iz * GRID_SPACING - offsetZ;
            scene.add(mesh);
            cubes.push({
              mesh,
              speed: new THREE.Vector3(
                (Math.random() - 0.5) * 2,
                (Math.random() - 0.5) * 2,
                (Math.random() - 0.5) * 2
              ),
            });
          }
        }
      }

      lastTime = performance.now();

      function animate() {
        if (!renderer) return;
        animationId = requestAnimationFrame(animate);
        const now = performance.now();
        const delta = (now - lastTime) / 1000;
        lastTime = now;

        cubes.forEach(({ mesh, speed }) => {
          mesh.rotation.x += speed.x * delta;
          mesh.rotation.y += speed.y * delta;
          mesh.rotation.z += speed.z * delta;
        });

        renderer.render(scene, camera);
      }
      animate();
    }

    function onResize() {
      const w = cont.clientWidth;
      const h = cont.clientHeight;
      if (w === 0 || h === 0) return;
      if (renderer !== undefined && camera) {
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      }
    }

    const ro = new ResizeObserver(() => {
      if (cont.clientWidth > 0 && cont.clientHeight > 0) {
        if (!renderer) {
          init();
        } else {
          onResize();
        }
      }
    });
    ro.observe(cont);

    const rafId = requestAnimationFrame(() => {
      if (cont.clientWidth > 0 && cont.clientHeight > 0) {
        init();
      }
    });

    return () => {
      cancelAnimationFrame(rafId);
      ro.disconnect();
      if (animationId != null) cancelAnimationFrame(animationId);
      if (renderer) {
        renderer.dispose();
        const canvas = renderer.domElement;
        if (canvas.parentNode === cont) cont.removeChild(canvas);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100%',
        height: '100%',
        minHeight: '100vh',
      }}
    />
  );
}
