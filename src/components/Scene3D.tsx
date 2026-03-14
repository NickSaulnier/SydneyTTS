import { Canvas, useThree } from '@react-three/fiber';
import { useEffect } from 'react';
import { CubeField } from './CubeField';

function TransparentBackground() {
  const { scene } = useThree();
  useEffect(() => {
    scene.background = null;
  }, [scene]);
  return null;
}

export function Scene3D() {
  return (
    <Canvas
      camera={{ position: [0, 0, 20], fov: 60 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
    >
      <TransparentBackground />
      <ambientLight intensity={0.4} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <directionalLight position={[-10, -10, -5]} intensity={0.3} />
      <CubeField />
    </Canvas>
  );
}
