import * as THREE from 'three';

function initAntigravity() {
  const container = document.getElementById('antigravity-bg');
  if (!container) return;

  if (window.__antigravityInitialized) return;
  window.__antigravityInitialized = true;

  const count = 400;
  const magnetRadius = 12;
  const ringRadius = 8;
  const waveSpeed = 0.45;
  const waveAmplitude = 1.2;
  const particleSize = 1.8;
  const lerpSpeed = 0.06;
  const color = '#4ba3d8';
  const autoAnimate = true;
  const particleVariance = 1;
  const rotationSpeed = 0.12;
  const depthFactor = 1.2;
  const pulseSpeed = 2.5;
  const fieldStrength = 10;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(0, 0, 50);

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
  } catch (err) {
    console.warn('WebGL not available for Antigravity:', err);
    return;
  }

  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.domElement.style.display = 'block';
  renderer.domElement.style.width = '100%';
  renderer.domElement.style.height = '100%';
  renderer.domElement.style.position = 'absolute';
  renderer.domElement.style.inset = '0';
  renderer.domElement.style.pointerEvents = 'none';

  container.innerHTML = '';
  container.appendChild(renderer.domElement);

  const geometry = new THREE.CapsuleGeometry(0.1, 0.4, 4, 8);
  const material = new THREE.MeshBasicMaterial({ color: new THREE.Color(color) });
  const mesh = new THREE.InstancedMesh(geometry, material, count);
  scene.add(mesh);

  const dummy = new THREE.Object3D();

  let vFov = (camera.fov * Math.PI) / 180;
  let vHeight = 2 * Math.tan(vFov / 2) * 50;
  let vWidth = vHeight * camera.aspect;

  const particles = [];
  for (let i = 0; i < count; i++) {
    const t = Math.random() * 100;
    const factor = 20 + Math.random() * 100;
    const speed = 0.01 + Math.random() / 200;
    const xFactor = -50 + Math.random() * 100;
    const yFactor = -50 + Math.random() * 100;
    const zFactor = -50 + Math.random() * 100;

    const x = (Math.random() - 0.5) * (vWidth * 1.2);
    const y = (Math.random() - 0.5) * (vHeight * 1.2);
    const z = (Math.random() - 0.5) * 30;
    const randomRadiusOffset = (Math.random() - 0.5) * 2;

    particles.push({
      t, factor, speed, xFactor, yFactor, zFactor,
      mx: x, my: y, mz: z,
      cx: x, cy: y, cz: z,
      randomRadiusOffset
    });
  }

  const windowPointer = { x: 0, y: 0 };
  window.addEventListener('pointermove', (e) => {
    windowPointer.x = (e.clientX / window.innerWidth) * 2 - 1;
    windowPointer.y = -(e.clientY / window.innerHeight) * 2 + 1;
  }, { passive: true });

  const lastMousePos = { x: 0, y: 0 };
  let lastMouseMoveTime = 0;
  const virtualMouse = { x: 0, y: 0 };
  let startTime = performance.now();

  function animate() {
    requestAnimationFrame(animate);

    const elapsedTime = (performance.now() - startTime) / 1000;
    const mouseDist = Math.hypot(windowPointer.x - lastMousePos.x, windowPointer.y - lastMousePos.y);
    if (mouseDist > 0.001) {
      lastMouseMoveTime = Date.now();
      lastMousePos.x = windowPointer.x;
      lastMousePos.y = windowPointer.y;
    }

    let destX = (windowPointer.x * vWidth) / 2;
    let destY = (windowPointer.y * vHeight) / 2;

    if (autoAnimate && Date.now() - lastMouseMoveTime > 1800) {
      destX = Math.sin(elapsedTime * 0.45) * (vWidth / 3.5);
      destY = Math.cos(elapsedTime * 0.45 * 1.8) * (vHeight / 3.5);
    }

    const smoothFactor = 0.05;
    virtualMouse.x += (destX - virtualMouse.x) * smoothFactor;
    virtualMouse.y += (destY - virtualMouse.y) * smoothFactor;

    const targetX = virtualMouse.x;
    const targetY = virtualMouse.y;
    const globalRotation = elapsedTime * rotationSpeed;

    for (let i = 0; i < count; i++) {
      const particle = particles[i];
      particle.t += particle.speed / 2;
      const t = particle.t;

      const ambientX = particle.mx + Math.sin(t * 0.35 + particle.xFactor) * 2.2;
      const ambientY = particle.my + Math.cos(t * 0.35 + particle.yFactor) * 2.2;
      const ambientZ = (particle.mz + Math.sin(t * 0.45) * 2) * depthFactor;

      const projectionFactor = 1 - particle.cz / 50;
      const projectedTargetX = targetX * projectionFactor;
      const projectedTargetY = targetY * projectionFactor;

      const dx = ambientX - projectedTargetX;
      const dy = ambientY - projectedTargetY;
      const dist = Math.hypot(dx, dy);

      let targetXPos = ambientX;
      let targetYPos = ambientY;
      let targetZPos = ambientZ;

      if (dist < magnetRadius) {
        const angle = Math.atan2(dy, dx) + globalRotation;
        const wave = Math.sin(t * waveSpeed + angle) * (0.6 * waveAmplitude);
        const deviation = particle.randomRadiusOffset * (5 / (fieldStrength + 0.1));
        const currentRingRadius = ringRadius + wave + deviation;

        targetXPos = projectedTargetX + currentRingRadius * Math.cos(angle);
        targetYPos = projectedTargetY + currentRingRadius * Math.sin(angle);
        targetZPos = ambientZ + Math.sin(t) * (1.2 * waveAmplitude * depthFactor);
      }

      particle.cx += (targetXPos - particle.cx) * lerpSpeed;
      particle.cy += (targetYPos - particle.cy) * lerpSpeed;
      particle.cz += (targetZPos - particle.cz) * lerpSpeed;

      dummy.position.set(particle.cx, particle.cy, particle.cz);
      dummy.lookAt(projectedTargetX, projectedTargetY, particle.cz);
      dummy.rotateX(Math.PI / 2);

      const currentDistToMouse = Math.hypot(particle.cx - projectedTargetX, particle.cy - projectedTargetY);
      const distFromRing = Math.abs(currentDistToMouse - ringRadius);
      const ringProximity = Math.max(0, 1 - distFromRing / 8);
      const scaleFactor = 0.45 + ringProximity * 0.55;
      const finalScale = scaleFactor * (0.85 + Math.sin(t * pulseSpeed) * 0.2 * particleVariance) * particleSize;
      dummy.scale.set(finalScale, finalScale, finalScale);

      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    }

    mesh.instanceMatrix.needsUpdate = true;
    renderer.render(scene, camera);
  }

  animate();

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);

    vFov = (camera.fov * Math.PI) / 180;
    vHeight = 2 * Math.tan(vFov / 2) * 50;
    vWidth = vHeight * camera.aspect;
  }, { passive: true });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAntigravity);
} else {
  initAntigravity();
}
