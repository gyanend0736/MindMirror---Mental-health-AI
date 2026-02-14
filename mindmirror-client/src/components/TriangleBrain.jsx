import React, { useRef,useEffect, useMemo, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { a, useSpring } from '@react-spring/three';
import * as THREE from 'three';

function Triangle({ position, index, hoveredPos, setHoveredPos }) {
  const [hovered, setHovered] = useState(false);

  const distance = hoveredPos
    ? Math.sqrt(
        Math.pow(position[0] - hoveredPos[0], 2) +
        Math.pow(position[1] - hoveredPos[1], 2) +
        Math.pow(position[2] - hoveredPos[2], 2)
      )
    : Infinity;

  const isNear = distance < 1;

  const { scale, pos } = useSpring({
    scale: hovered || isNear ? 1.8 : 1,
    pos:
      hovered || isNear
        ? [
            position[0] + (Math.random() - 0.5) * 1,
            position[1] + (Math.random() - 0.5) * 1,
            position[2] + (Math.random() - 0.5) * 1,
          ]
        : position,
    config: { tension: 170, friction: 20 },
  });

  return (
    <a.mesh
      position={pos}
      scale={scale}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        setHoveredPos(position); // <== this is crucial
      }}
      onPointerOut={() => {
        setHovered(false);
        setHoveredPos(null);
      }}
    >
      <coneGeometry args={[0.03, 0.06, 3]} />
      <meshStandardMaterial
        color={`hsl(${(index * 5) % 360}, 100%, 60%)`}
        emissive={`hsl(${(index * 5) % 360}, 100%, 60%)`}
        emissiveIntensity={hovered ? 2 : 1}
        flatShading
      />
    </a.mesh>
  );
}

function TriangleParticles({ count = 800 }) {
  const groupRef = useRef();
  const [hoveredPos, setHoveredPos] = useState(null);

  const particles = useMemo(() => {
    const arr = [];
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * 2 * Math.PI;
      const phi = Math.acos(2 * Math.random() - 1);
      const radius = 2 + Math.random() * 0.3;
      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);
      arr.push([x, y, z]);
    }
    return arr;
  }, [count]);
    // useEffect(() => {
    // const handleScroll = () => {
    //     const scrollY = window.scrollY;
    //     // const scrollX = window.scrollX;
    //     if (groupRef.current) {
    //     groupRef.current.position.x = scrollY * 0.01;
    //     groupRef.current.position.y = -scrollY * 0.01; // or -scrollY * 0.01
    //     }
    // };

    // window.addEventListener("scroll", handleScroll);
    // return () => window.removeEventListener("scroll", handleScroll);
    // }, []);
  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.003;
      groupRef.current.rotation.x += 0.001;
    }
  });

  return (
    <group ref={groupRef}>
      {particles.map((pos, i) => (
        <Triangle
          key={i}
          position={pos}
          index={i}
          hoveredPos={hoveredPos}
          setHoveredPos={setHoveredPos}
        />
      ))}
    </group>
  );
}

export default function TriangleBrain() {
  return (
    <>
      <ambientLight intensity={1.5} />
      <pointLight position={[5, 5, 5]} intensity={1.5} />
      <TriangleParticles count={2000} />
   </>
  );
}
