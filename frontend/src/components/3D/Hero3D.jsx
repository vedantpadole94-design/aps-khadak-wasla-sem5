import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';

const Hero3D = () => {
  return (
    <div className="absolute inset-0 z-0 bg-primary">
      <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1.5} color="#ffffff" />
        <directionalLight position={[-10, -10, -5]} intensity={0.5} color="#d4af37" />
        
        {/* Background Particles */}
        <Stars radius={100} depth={50} count={3000} factor={4} saturation={0} fade speed={1} />
        
        {/* Subtle camera movement, disabled zoom for scroll sanity */}
        <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} maxPolarAngle={Math.PI / 2} minPolarAngle={Math.PI / 3} />
      </Canvas>
      {/* Overlay gradient to keep the hero starry background deep and clean */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/20 to-primary/90 z-10 pointer-events-none"></div>
    </div>
  );
};

export default Hero3D;
