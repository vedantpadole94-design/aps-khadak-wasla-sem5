import React, { useRef, useState, useEffect, useMemo, Suspense } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';

// Exact polygon boundary contour of the shield extracted from the logo
const SHAPE_POINTS = [
  [1.552, -1.916], [1.552, -1.852], [1.552, -1.788], [1.552, -1.725], [1.552, -1.661],
  [1.552, -1.597], [1.552, -1.533], [1.552, -1.469], [1.552, -1.405], [1.552, -1.341],
  [1.552, -1.277], [1.552, -1.214], [1.552, -1.15], [1.552, -1.086], [1.504, -1.022],
  [1.408, -0.958], [1.344, -0.894], [1.28, -0.83], [1.264, -0.766], [1.232, -0.703],
  [1.216, -0.639], [1.2, -0.575], [1.184, -0.511], [1.168, -0.447], [1.168, -0.383],
  [1.152, -0.319], [1.152, -0.255], [1.152, -0.192], [1.152, -0.128], [1.152, -0.064],
  [1.152, 0.0], [1.168, 0.064], [1.168, 0.128], [1.184, 0.192], [1.2, 0.255],
  [1.216, 0.319], [1.232, 0.383], [1.248, 0.447], [1.264, 0.511], [1.296, 0.575],
  [1.312, 0.639], [1.344, 0.703], [1.376, 0.766], [1.408, 0.83], [1.44, 0.894],
  [1.472, 0.958], [1.504, 1.022], [1.552, 1.086], [1.552, 1.15], [1.472, 1.214],
  [1.344, 1.277], [1.216, 1.341], [1.088, 1.405], [0.96, 1.469], [0.448, 1.533],
  [0.432, 1.597], [0.432, 1.661], [0.4, 1.725], [0.304, 1.788], [0.176, 1.852],
  [0.048, 1.916], [-0.08, 1.9], [-0.208, 1.836], [-0.352, 1.772], [-0.432, 1.709],
  [-0.432, 1.645], [-0.448, 1.581], [-0.864, 1.517], [-0.992, 1.453], [-1.12, 1.389],
  [-1.248, 1.325], [-1.392, 1.261], [-1.504, 1.198], [-1.568, 1.134], [-1.536, 1.07],
  [-1.504, 1.006], [-1.472, 0.942], [-1.44, 0.878], [-1.392, 0.814], [-1.376, 0.75],
  [-1.344, 0.687], [-1.312, 0.623], [-1.296, 0.559], [-1.264, 0.495], [-1.264, 0.431],
  [-1.232, 0.367], [-1.216, 0.303], [-1.2, 0.24], [-1.2, 0.176], [-1.168, 0.112],
  [-1.168, 0.048], [-1.168, -0.016], [-1.152, -0.08], [-1.152, -0.144], [-1.136, -0.208],
  [-1.168, -0.271], [-1.168, -0.335], [-1.168, -0.399], [-1.184, -0.463], [-1.2, -0.527],
  [-1.2, -0.591], [-1.232, -0.655], [-1.248, -0.719], [-1.264, -0.782], [-1.312, -0.846],
  [-1.36, -0.91], [-1.424, -0.974], [-1.536, -1.038], [-1.536, -1.102], [-1.536, -1.166],
  [-1.536, -1.23], [-1.536, -1.293], [-1.536, -1.357], [-1.536, -1.421], [-1.536, -1.485],
  [-1.536, -1.549], [-1.536, -1.613], [-1.536, -1.677], [-1.536, -1.74], [-1.536, -1.804],
  [-1.536, -1.868], [-1.536, -1.932]
];

// True 3D Volumetric Extruded Logo Model
const VolumetricLogoModel = () => {
  const groupRef = useRef();
  const [hovered, setHovered] = useState(false);
  const currentSpeed = useRef((2 * Math.PI) / 15); // Idle: 1 full rotation every 15s

  // Unlit crisp textures for front and back faces
  const frontTexture = useLoader(THREE.TextureLoader, '/school-logo-clean.png');
  const backTexture = useLoader(THREE.TextureLoader, '/school-logo-back.png');

  useEffect(() => {
    [frontTexture, backTexture].forEach((tex) => {
      if (tex) {
        tex.colorSpace = THREE.SRGBColorSpace;
        tex.minFilter = THREE.LinearFilter;
        tex.magFilter = THREE.LinearFilter;
        tex.needsUpdate = true;
      }
    });
  }, [frontTexture, backTexture]);

  // Create 3D Extrude Geometry matching the exact shield contour
  const extrudeGeometry = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(SHAPE_POINTS[0][0], SHAPE_POINTS[0][1]);
    for (let i = 1; i < SHAPE_POINTS.length; i++) {
      shape.lineTo(SHAPE_POINTS[i][0], SHAPE_POINTS[i][1]);
    }
    shape.closePath();

    const geom = new THREE.ExtrudeGeometry(shape, {
      depth: 0.36,
      bevelEnabled: true,
      bevelThickness: 0.04,
      bevelSize: 0.03,
      bevelSegments: 3,
    });
    geom.center();
    return geom;
  }, []);

  useFrame((_, delta) => {
    if (!groupRef.current) return;

    // Idle: 1 rev per 15s (~0.42 rad/s) | Hover: 1 rev per 2s (~3.14 rad/s)
    const targetSpeed = hovered ? (2 * Math.PI) / 2 : (2 * Math.PI) / 15;
    currentSpeed.current = THREE.MathUtils.lerp(currentSpeed.current, targetSpeed, delta * 3.5);

    // Continuous 3D Y-axis rotation
    groupRef.current.rotation.y += currentSpeed.current * delta;
  });

  return (
    <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.3}>
      <group
        ref={groupRef}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
        }}
        onPointerOut={() => setHovered(false)}
      >
        {/* 1. Extruded Solid 3D Red Shield Body (giving realistic physical depth & thickness) */}
        <mesh geometry={extrudeGeometry}>
          <meshBasicMaterial color="#a71b1b" toneMapped={false} />
        </mesh>

        {/* 2. Front Face: High-resolution unlit emblem (vibrant red, deep blue, bright gold) */}
        <mesh position={[0, 0, 0.222]}>
          <planeGeometry args={[3.2, 3.96]} />
          <meshBasicMaterial
            map={frontTexture}
            transparent={true}
            alphaTest={0.4}
            toneMapped={false}
          />
        </mesh>

        {/* 3. Back Face: Clean red back view shield */}
        <mesh position={[0, 0, -0.222]} rotation={[0, Math.PI, 0]}>
          <planeGeometry args={[3.2, 3.96]} />
          <meshBasicMaterial
            map={backTexture}
            transparent={true}
            alphaTest={0.4}
            toneMapped={false}
          />
        </mesh>
      </group>
    </Float>
  );
};

const Hero3DLogo = () => {
  return (
    <div className="w-full h-[380px] sm:h-[440px] md:h-[500px] lg:h-[540px] flex items-center justify-center select-none">
      <Canvas
        camera={{ position: [0, 0, 5.8], fov: 45 }}
        gl={{ alpha: true, antialias: true }}
        style={{ width: '100%', height: '100%' }}
      >
        <Suspense fallback={null}>
          <VolumetricLogoModel />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default Hero3DLogo;
