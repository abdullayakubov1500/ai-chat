import { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import styles from './chatBackground3D.module.css';

const SHAPES = [
  { type: 'torus', position: [-1.8, 0.9, -3], scale: 0.55, speed: 0.22 },
  { type: 'box', position: [1.6, -0.4, -2.5], scale: 0.45, speed: 0.18 },
  { type: 'octa', position: [0.3, 1.1, -4], scale: 0.5, speed: 0.15 },
  { type: 'torus', position: [1.9, 1.2, -3.5], scale: 0.35, speed: 0.25 },
  { type: 'box', position: [-1.4, -1, -2.8], scale: 0.4, speed: 0.2 },
];

function Shape({ type, position, scale, speed, paused }) {
  const ref = useRef(null);
  const geometry = useMemo(() => {
    if (type === 'torus') return new THREE.TorusGeometry(1, 0.32, 12, 24);
    if (type === 'box') return new THREE.BoxGeometry(1, 1, 1);
    return new THREE.OctahedronGeometry(1, 0);
  }, [type]);

  useFrame((state) => {
    if (!ref.current || paused) return;
    const t = state.clock.elapsedTime;
    ref.current.rotation.x = t * speed;
    ref.current.rotation.y = t * speed * 1.15;
    ref.current.position.y = position[1] + Math.sin(t * speed * 2) * 0.08;
  });

  return (
    <mesh ref={ref} position={position} scale={scale} geometry={geometry}>
      <meshBasicMaterial
        color="#5b9cff"
        wireframe
        transparent
        opacity={0.22}
        depthWrite={false}
      />
    </mesh>
  );
}

function Scene({ paused }) {
  return (
    <>
      <ambientLight intensity={0.6} />
      {SHAPES.map((item, index) => (
        <Shape key={index} {...item} paused={paused} />
      ))}
    </>
  );
}

export default function ChatBackground3D() {
  const [paused, setPaused] = useState(() =>
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  );

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setPaused(media.matches);
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  return (
    <div className={styles.wrap}>
      <Canvas
        className={styles.canvas}
        camera={{ position: [0, 0, 3.2], fov: 50 }}
        dpr={[1, 1.5]}
        gl={{ alpha: true, antialias: true, powerPreference: 'low-power' }}
      >
        <Scene paused={paused} />
      </Canvas>
      <div className={styles.veil} />
    </div>
  );
}
