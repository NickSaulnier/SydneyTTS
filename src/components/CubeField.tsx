import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const CUBE_COUNT = 400;
const SPREAD = 25;
const CUBE_SIZE = 0.5;

interface InstanceData {
  position: [number, number, number];
  rotationSpeed: [number, number, number];
  color: number;
}

function randomGray(): number {
  const g = 0.75 + Math.random() * 0.25;
  return new THREE.Color(g, g, g).getHex();
}

function createInstanceData(): InstanceData[] {
  const data: InstanceData[] = [];
  for (let i = 0; i < CUBE_COUNT; i++) {
    data.push({
      position: [
        (Math.random() - 0.5) * SPREAD * 2,
        (Math.random() - 0.5) * SPREAD * 2,
        (Math.random() - 0.5) * SPREAD * 2,
      ],
      rotationSpeed: [
        (Math.random() - 0.5) * 2,
        (Math.random() - 0.5) * 2,
        (Math.random() - 0.5) * 2,
      ],
      color: randomGray(),
    });
  }
  return data;
}

export function CubeField() {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const rotationsRef = useRef<[number, number, number][]>(
    Array.from({ length: CUBE_COUNT }, () => [0, 0, 0])
  );
  const initializedRef = useRef(false);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const instanceData = useMemo(() => createInstanceData(), []);

  useFrame((_, delta) => {
    const mesh = meshRef.current;
    if (!mesh) return;

    if (!initializedRef.current) {
      instanceData.forEach((data, i) => {
        dummy.position.set(...data.position);
        dummy.rotation.set(0, 0, 0);
        dummy.updateMatrix();
        mesh.setMatrixAt(i, dummy.matrix);
        mesh.setColorAt(i, new THREE.Color(data.color));
      });
      mesh.instanceMatrix.needsUpdate = true;
      if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
      initializedRef.current = true;
    }

    const rotations = rotationsRef.current;
    instanceData.forEach((data, i) => {
      rotations[i][0] += data.rotationSpeed[0] * delta;
      rotations[i][1] += data.rotationSpeed[1] * delta;
      rotations[i][2] += data.rotationSpeed[2] * delta;
      dummy.position.set(...data.position);
      dummy.rotation.set(rotations[i][0], rotations[i][1], rotations[i][2]);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    });
    mesh.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, CUBE_COUNT]} castShadow receiveShadow>
      <boxGeometry args={[CUBE_SIZE, CUBE_SIZE, CUBE_SIZE]} />
      <meshStandardMaterial vertexColors />
    </instancedMesh>
  );
}
