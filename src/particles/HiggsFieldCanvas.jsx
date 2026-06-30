import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

const PHI = (1 + Math.sqrt(5)) / 2;
const TAU = Math.PI * 2;

function makeFieldGeometry(count = 1728) {
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);

  for (let i = 0; i < count; i += 1) {
    const t = i / count;
    const angle = i * TAU * (1 - 1 / PHI);
    const shell = Math.pow(t, 0.58);
    const radius = 1.1 + shell * 4.7 + Math.sin(i * 0.0369) * 0.42;
    const y = (t - 0.5) * 6.8 + Math.sin(angle * 0.33) * 0.45;

    positions[i * 3] = Math.cos(angle) * radius;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = Math.sin(angle) * radius;

    const warm = 0.42 + Math.sin(i * 0.0069) * 0.18;
    colors[i * 3] = 0.28 + warm;
    colors[i * 3 + 1] = 0.55 + t * 0.35;
    colors[i * 3 + 2] = 0.88;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  return geometry;
}

function makeOrbit(radius, z, hueShift) {
  const points = [];
  for (let i = 0; i <= 216; i += 1) {
    const a = (i / 216) * TAU;
    const wobble = Math.sin(a * 3 + hueShift) * 0.18;
    points.push(new THREE.Vector3(Math.cos(a) * (radius + wobble), Math.sin(a) * (radius - wobble), z));
  }
  return new THREE.BufferGeometry().setFromPoints(points);
}

export default function HiggsFieldCanvas({ channel, intensity, onTelemetry }) {
  const mountRef = useRef(null);
  const canvasRef = useRef(null);
  const pointerRef = useRef({ x: 0, y: 0 });
  const [engineLabel, setEngineLabel] = useState('detecting GPU canvas');

  useEffect(() => {
    const mount = mountRef.current;
    const canvas = canvasRef.current;
    if (!mount || !canvas) return undefined;

    const testCanvas = document.createElement('canvas');
    const hasWebGL2 = Boolean(testCanvas.getContext('webgl2'));
    setEngineLabel(hasWebGL2 ? 'WEBGL2 READY' : 'WEBGL FALLBACK');

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(54, 1, 0.1, 120);
    camera.position.set(0, 0.45, 11.4);

    const root = new THREE.Group();
    scene.add(root);

    const particles = new THREE.Points(
      makeFieldGeometry(1728),
      new THREE.PointsMaterial({
        size: 0.038,
        vertexColors: true,
        transparent: true,
        opacity: 0.88,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      })
    );
    root.add(particles);

    const orbitMaterial = new THREE.LineBasicMaterial({
      color: 0x8eeaff,
      transparent: true,
      opacity: 0.34,
      blending: THREE.AdditiveBlending
    });

    const orbits = new THREE.Group();
    for (let i = 1; i <= 9; i += 1) {
      const orbit = new THREE.Line(makeOrbit(i * 0.52, (i - 5) * 0.12, i * 0.369), orbitMaterial.clone());
      orbit.rotation.x = (i % 3) * 0.36;
      orbit.rotation.y = i * 0.18;
      orbit.material.opacity = 0.1 + i * 0.026;
      orbits.add(orbit);
    }
    root.add(orbits);

    const torus = new THREE.Mesh(
      new THREE.TorusKnotGeometry(1.05, 0.19, 180, 18, 2, 3),
      new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true, transparent: true, opacity: 0.58 })
    );
    root.add(torus);

    const core = new THREE.Mesh(
      new THREE.IcosahedronGeometry(0.78, 2),
      new THREE.MeshBasicMaterial({ color: 0x76ffe4, wireframe: true, transparent: true, opacity: 0.44 })
    );
    root.add(core);

    const leftBeam = new THREE.Mesh(
      new THREE.CylinderGeometry(0.025, 0.025, 14, 12),
      new THREE.MeshBasicMaterial({ color: 0xffd166, transparent: true, opacity: 0.65 })
    );
    leftBeam.rotation.z = Math.PI / 2;
    root.add(leftBeam);

    const rightBeam = leftBeam.clone();
    rightBeam.material = leftBeam.material.clone();
    rightBeam.material.color = new THREE.Color(0x8ec5ff);
    rightBeam.rotation.z = Math.PI / 2;
    rightBeam.rotation.y = Math.PI / 9;
    root.add(rightBeam);

    let animationFrame = 0;
    let lastTelemetry = 0;

    const resize = () => {
      const width = mount.clientWidth || 900;
      const height = mount.clientHeight || 620;
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };

    const onPointerMove = (event) => {
      const bounds = mount.getBoundingClientRect();
      pointerRef.current.x = ((event.clientX - bounds.left) / bounds.width - 0.5) * 2;
      pointerRef.current.y = ((event.clientY - bounds.top) / bounds.height - 0.5) * -2;
    };

    const animate = (ms) => {
      const t = ms * 0.001;
      const pulse = 0.5 + Math.sin(t * 1.369) * 0.5;
      const channelFactor = channel === 'four-lepton' ? 0.82 : channel === 'field-map' ? 1.18 : 1;
      const power = Math.max(0.1, intensity) * channelFactor;

      root.rotation.y = t * 0.075 + pointerRef.current.x * 0.16;
      root.rotation.x = pointerRef.current.y * 0.08;
      particles.rotation.y = -t * 0.055;
      particles.rotation.z = Math.sin(t * 0.21) * 0.035;
      particles.material.size = 0.028 + pulse * 0.028 * power;
      particles.material.opacity = 0.62 + pulse * 0.26;

      orbits.rotation.y = t * 0.18;
      orbits.rotation.x = Math.sin(t * 0.3) * 0.14;

      torus.rotation.x = t * 0.57;
      torus.rotation.y = t * 0.39;
      torus.scale.setScalar(1 + pulse * 0.18 * power);

      core.rotation.x = -t * 0.31;
      core.rotation.y = t * 0.48;
      core.scale.setScalar(0.85 + pulse * 0.22 * power);

      leftBeam.scale.y = 0.62 + pulse * 0.42;
      rightBeam.scale.y = 0.62 + (1 - pulse) * 0.42;

      renderer.render(scene, camera);

      if (onTelemetry && ms - lastTelemetry > 900) {
        lastTelemetry = ms;
        onTelemetry({
          engine: hasWebGL2 ? 'WebGL2' : 'WebGL',
          particles: 1728,
          phi: Number(PHI.toFixed(6)),
          pulse: Number(pulse.toFixed(3))
        });
      }

      animationFrame = requestAnimationFrame(animate);
    };

    resize();
    mount.addEventListener('pointermove', onPointerMove);
    window.addEventListener('resize', resize);
    animationFrame = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrame);
      mount.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('resize', resize);
      particles.geometry.dispose();
      particles.material.dispose();
      torus.geometry.dispose();
      torus.material.dispose();
      core.geometry.dispose();
      core.material.dispose();
      leftBeam.geometry.dispose();
      leftBeam.material.dispose();
      rightBeam.material.dispose();
      orbitMaterial.dispose();
      renderer.dispose();
    };
  }, [channel, intensity, onTelemetry]);

  return (
    <div className="field-stage" ref={mountRef}>
      <canvas ref={canvasRef} aria-label="Animated ParticleForge369 field visualization" />
      <div className="engine-pill">{engineLabel}</div>
      <div className="field-caption">
        <span>369 lattice</span>
        <span>phi spiral</span>
        <span>simulated collision pulse</span>
      </div>
    </div>
  );
}
