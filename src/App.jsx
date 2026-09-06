import React from 'react';
import Antigravity from './components/Antigravity';

export default function App() {
  return (
    <div style={{ width: '100%', height: '100%', position: 'absolute', inset: 0 }}>
      <Antigravity
        count={400}
        magnetRadius={12}
        ringRadius={8}
        waveSpeed={0.45}
        waveAmplitude={1.2}
        particleSize={1.8}
        lerpSpeed={0.06}
        color="#4ba3d8"
        autoAnimate={true}
        particleVariance={1}
        rotationSpeed={0.12}
        particleShape="capsule"
      />
    </div>
  );
}
