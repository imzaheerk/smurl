import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';

function disposeObject(object: THREE.Object3D) {
  object.traverse((child) => {
    const mesh = child as THREE.Mesh;
    if (!mesh.isMesh) return;
    mesh.geometry?.dispose();
    const mat = mesh.material;
    if (Array.isArray(mat)) {
      mat.forEach((m) => m.dispose());
    } else {
      mat?.dispose();
    }
  });
}

export function NotFoundScene() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x020617, 0.06);

    const camera = new THREE.PerspectiveCamera(46, 1, 0.1, 100);
    camera.position.set(0, 0.15, 7.1);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    mount.appendChild(renderer.domElement);

    const rig = new THREE.Group();
    scene.add(rig);

    const shardMaterial = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      emissive: 0x14b8a6,
      emissiveIntensity: 0.4,
      metalness: 0.5,
      roughness: 0.25,
      wireframe: true
    });
    const shardGeometry = new THREE.IcosahedronGeometry(1.2, 0);
    const shard = new THREE.Mesh(shardGeometry, shardMaterial);
    rig.add(shard);

    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(2.1, 0.04, 18, 220),
      new THREE.MeshBasicMaterial({
        color: 0xa78bfa,
        transparent: true,
        opacity: 0.5
      })
    );
    ring.rotation.set(Math.PI * 0.62, 0.4, 0.2);
    rig.add(ring);

    const ring2 = new THREE.Mesh(
      new THREE.TorusGeometry(2.45, 0.02, 12, 220),
      new THREE.MeshBasicMaterial({
        color: 0x22d3ee,
        transparent: true,
        opacity: 0.32
      })
    );
    ring2.rotation.set(Math.PI * 0.24, -0.3, 0);
    rig.add(ring2);

    const pointsCount = 240;
    const pos = new Float32Array(pointsCount * 3);
    for (let i = 0; i < pointsCount; i++) {
      const i3 = i * 3;
      pos[i3] = (Math.random() - 0.5) * 10;
      pos[i3 + 1] = (Math.random() - 0.5) * 6;
      pos[i3 + 2] = (Math.random() - 0.5) * 5;
    }
    const pointsGeo = new THREE.BufferGeometry();
    pointsGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const points = new THREE.Points(
      pointsGeo,
      new THREE.PointsMaterial({
        color: 0x5eead4,
        size: 0.028,
        opacity: 0.64,
        transparent: true,
        depthWrite: false
      })
    );
    scene.add(points);

    scene.add(new THREE.AmbientLight(0xffffff, 0.6));
    const keyLight = new THREE.PointLight(0xffffff, 1.2, 22);
    keyLight.position.set(4, 3, 4);
    scene.add(keyLight);
    const rimLight = new THREE.PointLight(0x22d3ee, 1.2, 18);
    rimLight.position.set(-3, -1.5, 3);
    scene.add(rimLight);

    const onResize = () => {
      const width = mount.clientWidth;
      const height = mount.clientHeight;
      if (!width || !height) return;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
    };
    const ro = new ResizeObserver(onResize);
    ro.observe(mount);
    onResize();

    const rotateTween = gsap.to(rig.rotation, {
      y: `+=${Math.PI * 2}`,
      x: `+=${Math.PI * 2}`,
      duration: 24,
      ease: 'none',
      repeat: -1
    });
    const pulseTween = gsap.to(shard.scale, {
      x: 1.08,
      y: 1.08,
      z: 1.08,
      duration: 2.4,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1
    });
    const ringTween = gsap.to([ring.rotation, ring2.rotation], {
      z: `+=${Math.PI * 2}`,
      duration: 20,
      ease: 'none',
      repeat: -1,
      stagger: 3
    });

    const pointer = { x: 0, y: 0 };
    const onPointerMove = (event: PointerEvent) => {
      pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
      pointer.y = (event.clientY / window.innerHeight) * 2 - 1;
      gsap.to(camera.position, {
        x: pointer.x * 0.22,
        y: 0.15 - pointer.y * 0.12,
        duration: 0.8,
        ease: 'power2.out'
      });
    };
    window.addEventListener('pointermove', onPointerMove, { passive: true });

    let raf = 0;
    const clock = new THREE.Clock();
    const animate = () => {
      const t = clock.getElapsedTime();
      points.rotation.y = t * 0.02;
      points.rotation.x = t * 0.01;
      rig.position.y = Math.sin(t * 0.5) * 0.1;
      renderer.render(scene, camera);
      raf = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      cancelAnimationFrame(raf);
      ro.disconnect();
      rotateTween.kill();
      pulseTween.kill();
      ringTween.kill();
      pointsGeo.dispose();
      disposeObject(scene);
      renderer.dispose();
      if (renderer.domElement.parentNode === mount) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div className="pointer-events-none absolute inset-0 opacity-90" aria-hidden>
      <div ref={mountRef} className="h-full w-full" />
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/15 via-slate-950/55 to-slate-950/90" />
    </div>
  );
}
