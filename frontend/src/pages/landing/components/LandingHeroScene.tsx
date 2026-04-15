import { type RefObject, useEffect, useRef } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

function disposeObject3D(object: THREE.Object3D) {
  object.traverse((child) => {
    if (child instanceof THREE.InstancedMesh) {
      child.geometry?.dispose();
      const mat = child.material;
      if (Array.isArray(mat)) {
        mat.forEach((m) => m.dispose());
      } else {
        mat?.dispose();
      }
      return;
    }
    if (child instanceof THREE.Mesh) {
      child.geometry?.dispose();
      const mat = child.material;
      if (Array.isArray(mat)) {
        mat.forEach((m) => m.dispose());
      } else {
        mat?.dispose();
      }
      return;
    }
    if (child instanceof THREE.Points) {
      child.geometry?.dispose();
      const mat = child.material;
      if (Array.isArray(mat)) {
        mat.forEach((m) => m.dispose());
      } else {
        mat?.dispose();
      }
    }
  });
}

export interface LandingHeroSceneProps {
  /** When set, scroll through the hero scrubs camera / rig motion (GSAP ScrollTrigger). */
  scrollRootRef?: RefObject<HTMLElement | null>;
}

/** WebGL hero: torus knot, wireframe shell, rings, instanced orbit nodes, particles; scroll + pointer reactive. */
export function LandingHeroScene({ scrollRootRef }: LandingHeroSceneProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const isMobile = window.matchMedia('(max-width: 767px)').matches;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const config = {
      cameraFov: isMobile ? 52 : 42,
      cameraStartY: isMobile ? 0.2 : 0.12,
      cameraStartZ: isMobile ? 8.2 : 7.25,
      knotScale: isMobile ? 0.88 : 1,
      ringCount: isMobile ? 2 : 3,
      orbitNodeCount: isMobile ? 9 : 14,
      particleCount: isMobile ? 280 : 480,
      pointerX: isMobile ? 0.24 : 0.48,
      pointerY: isMobile ? 0.18 : 0.38,
      rigLerp: isMobile ? 0.03 : 0.045,
      scrollRigX: isMobile ? 0.34 : 0.55,
      scrollRigY: isMobile ? 0.2 : 0.35,
      scrollCamZ: isMobile ? 0.65 : 1.15,
      scrollCamY: isMobile ? 0.2 : 0.35
    };

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x020617, 0.038);

    const camera = new THREE.PerspectiveCamera(config.cameraFov, 1, 0.1, 100);
    camera.position.set(0, config.cameraStartY, config.cameraStartZ);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    renderer.domElement.className =
      'absolute inset-0 h-full w-full block pointer-events-none touch-none';
    container.appendChild(renderer.domElement);

    const rig = new THREE.Group();
    scene.add(rig);

    const knotGeo = new THREE.TorusKnotGeometry(1.05, 0.34, 200, 32, 2, 3);
    const knotMat = new THREE.MeshStandardMaterial({
      color: 0x080f1a,
      emissive: new THREE.Color(0x14b8a6),
      emissiveIntensity: 0.48,
      metalness: 0.78,
      roughness: 0.18
    });
    const knot = new THREE.Mesh(knotGeo, knotMat);
    knot.scale.setScalar(config.knotScale);
    rig.add(knot);

    const wireGeo = knotGeo.clone();
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0x7dd3fc,
      wireframe: true,
      transparent: true,
      opacity: 0.11
    });
    const wire = new THREE.Mesh(wireGeo, wireMat);
    wire.scale.setScalar(1.035);
    rig.add(wire);

    const ringGroup = new THREE.Group();
    const ringColors = [0x2dd4bf, 0x38bdf8, 0xc4b5fd];
    for (let i = 0; i < config.ringCount; i++) {
      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(2.05 + i * 0.52, 0.016, 10, 128),
        new THREE.MeshBasicMaterial({
          color: ringColors[i],
          transparent: true,
          opacity: 0.2 - i * 0.035
        })
      );
      ring.rotation.x = Math.PI / 2 + i * 0.32;
      ring.rotation.y = i * 0.38;
      ringGroup.add(ring);
    }
    scene.add(ringGroup);

    const orbitNodeCount = config.orbitNodeCount;
    const nodeGeo = new THREE.IcosahedronGeometry(0.09, 0);
    const nodeMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      emissive: new THREE.Color(0x34d399),
      emissiveIntensity: 0.65,
      metalness: 0.55,
      roughness: 0.25
    });
    const orbitNodes = new THREE.InstancedMesh(nodeGeo, nodeMat, orbitNodeCount);
    orbitNodes.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    scene.add(orbitNodes);

    const radii = [1.55, 1.95, 2.35, 2.75];
    const phases: number[] = [];
    const speeds: number[] = [];
    const planeTilt: number[] = [];
    for (let i = 0; i < orbitNodeCount; i++) {
      phases.push((i / orbitNodeCount) * Math.PI * 2);
      speeds.push(0.35 + (i % 4) * 0.12);
      planeTilt.push((i % 5) * 0.35 - 0.7);
      const dummy = new THREE.Object3D();
      dummy.updateMatrix();
      orbitNodes.setMatrixAt(i, dummy.matrix);
    }

    const dummy = new THREE.Object3D();

    const particleCount = config.particleCount;
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      const r = 2.8 + Math.random() * 3.8;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.52;
      positions[i * 3 + 2] = r * Math.cos(phi);
    }
    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const pMat = new THREE.PointsMaterial({
      color: 0x5eead4,
      size: 0.032,
      transparent: true,
      opacity: 0.32,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    });
    const particles = new THREE.Points(pGeo, pMat);
    scene.add(particles);

    const hemi = new THREE.HemisphereLight(0xcffafe, 0x0f172a, 0.35);
    scene.add(hemi);
    const ambient = new THREE.AmbientLight(0xffffff, 0.12);
    scene.add(ambient);
    const key = new THREE.DirectionalLight(0xe0f2fe, 0.52);
    key.position.set(5, 4.5, 6);
    scene.add(key);
    const fill = new THREE.PointLight(0xa78bfa, 1.05, 26);
    fill.position.set(-4.8, -1.2, 4.2);
    scene.add(fill);
    const rim = new THREE.PointLight(0x2dd4bf, 1.75, 24);
    rim.position.set(4.2, 2.8, 3.2);
    scene.add(rim);

    const pointer = { x: 0, y: 0 };
    const targetRot = { x: 0, y: 0 };

    const onPointer = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;
      pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    };

    if (!isMobile) {
      window.addEventListener('pointermove', onPointer, { passive: true });
    }

    const scrollState = { progress: 0 };
    let scrollTrigger: ScrollTrigger | null = null;
    const rootEl = scrollRootRef?.current;
    if (rootEl) {
      scrollTrigger = ScrollTrigger.create({
        trigger: rootEl,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 0.55,
        onUpdate: (self) => {
          scrollState.progress = self.progress;
        }
      });
      requestAnimationFrame(() => ScrollTrigger.refresh());
    }

    const clock = new THREE.Clock();
    let raf = 0;

    const setSize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      if (w === 0 || h === 0) return;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h, false);
    };
    setSize();

    const onResize = () => setSize();
    window.addEventListener('resize', onResize);

    const animate = () => {
      const t = clock.getElapsedTime();
      const sp = scrollState.progress;

      targetRot.x = pointer.y * config.pointerY;
      targetRot.y = pointer.x * config.pointerX;

      const timeFactor = prefersReducedMotion ? 0.03 : 0.1;
      const rotYTimeFactor = prefersReducedMotion ? 0.05 : 0.16;
      rig.rotation.x +=
        (t * timeFactor + targetRot.x * 0.22 + sp * config.scrollRigX - rig.rotation.x) *
        config.rigLerp;
      rig.rotation.y +=
        (t * rotYTimeFactor + targetRot.y * 0.22 + sp * config.scrollRigY - rig.rotation.y) *
        config.rigLerp;

      ringGroup.rotation.z = t * 0.055 + sp * 0.4;
      ringGroup.rotation.x = Math.sin(t * 0.11) * 0.07 + sp * 0.12;

      ringGroup.children.forEach((child, i) => {
        child.rotation.z = t * (0.095 + i * 0.028);
      });

      const camZ = config.cameraStartZ - sp * config.scrollCamZ;
      const camY = config.cameraStartY + sp * config.scrollCamY;
      camera.position.z += (camZ - camera.position.z) * 0.08;
      camera.position.y += (camY - camera.position.y) * 0.08;
      camera.lookAt(0, sp * 0.15, 0);

      for (let i = 0; i < orbitNodeCount; i++) {
        const r = radii[i % radii.length];
        const ang = t * speeds[i] + phases[i];
        const tilt = planeTilt[i];
        const x = Math.cos(ang) * r;
        const z = Math.sin(ang) * r;
        const y = Math.sin(ang * 0.7 + tilt) * 0.55;
        dummy.position.set(x, y, z);
        const s = 0.85 + (i % 3) * 0.12;
        dummy.scale.setScalar(s);
        dummy.rotation.set(t * 0.4 + i, t * 0.25, t * 0.15);
        dummy.updateMatrix();
        orbitNodes.setMatrixAt(i, dummy.matrix);
      }
      orbitNodes.instanceMatrix.needsUpdate = true;
      orbitNodes.rotation.y = t * 0.04;

      particles.rotation.y = t * 0.028 + sp * 0.2;

      renderer.render(scene, camera);
      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(raf);
      scrollTrigger?.kill();
      window.removeEventListener('resize', onResize);
      if (!isMobile) {
        window.removeEventListener('pointermove', onPointer);
      }
      disposeObject3D(scene);
      renderer.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [scrollRootRef]);

  return (
    <div
      ref={containerRef}
      className="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden
    />
  );
}
