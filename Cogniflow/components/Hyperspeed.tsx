import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import './Hyperspeed.css';

interface HyperspeedProps {
  effectOptions: any;
}

const Hyperspeed: React.FC<HyperspeedProps> = ({ effectOptions }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const requestRef = useRef<number>();

  useEffect(() => {
    if (!containerRef.current) return;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(effectOptions.colors.background);

    // Camera
    const camera = new THREE.PerspectiveCamera(effectOptions.fov, width / height, 0.1, 1000);
    camera.position.z = -5;
    camera.position.y = 7;
    camera.lookAt(new THREE.Vector3(0, 0, 50));

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Road and Lights logic
    const roadGroup = new THREE.Group();
    scene.add(roadGroup);

    // Simple implementation of moving light trails
    const createTrail = (color: number, x: number, zOffset: number) => {
      const geometry = new THREE.BoxGeometry(0.1, 0.1, 10);
      const material = new THREE.MeshBasicMaterial({ color });
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(x, 0.05, zOffset);
      return mesh;
    };

    const trails: THREE.Mesh[] = [];
    const trailCount = 100;
    
    // Left side trails (white/gray)
    for (let i = 0; i < trailCount / 2; i++) {
      const color = effectOptions.colors.leftCars[Math.floor(Math.random() * effectOptions.colors.leftCars.length)];
      const trail = createTrail(color, -effectOptions.roadWidth / 4 - Math.random() * 2, Math.random() * 400);
      trails.push(trail);
      roadGroup.add(trail);
    }

    // Right side trails (white/gray)
    for (let i = 0; i < trailCount / 2; i++) {
      const color = effectOptions.colors.rightCars[Math.floor(Math.random() * effectOptions.colors.rightCars.length)];
      const trail = createTrail(color, effectOptions.roadWidth / 4 + Math.random() * 2, Math.random() * 400);
      trails.push(trail);
      roadGroup.add(trail);
    }

    // Ground/Road
    const roadGeo = new THREE.PlaneGeometry(effectOptions.roadWidth * 2, 1000);
    const roadMat = new THREE.MeshBasicMaterial({ color: effectOptions.colors.roadColor });
    const road = new THREE.Mesh(roadGeo, roadMat);
    road.rotation.x = -Math.PI / 2;
    road.position.z = 250;
    roadGroup.add(road);

    // Sticks / Vertical Lights
    for (let i = 0; i < effectOptions.totalSideLightSticks; i++) {
       const stickGeo = new THREE.BoxGeometry(0.05, 10, 0.05);
       const stickMat = new THREE.MeshBasicMaterial({ color: effectOptions.colors.sticks });
       const stick = new THREE.Mesh(stickGeo, stickMat);
       const side = Math.random() > 0.5 ? 1 : -1;
       stick.position.set(side * (effectOptions.roadWidth + 2), 5, Math.random() * 400);
       trails.push(stick);
       roadGroup.add(stick);
    }

    const animate = () => {
      requestRef.current = requestAnimationFrame(animate);
      
      trails.forEach(trail => {
        trail.position.z -= effectOptions.speedUp;
        if (trail.position.z < -50) {
          trail.position.z = 400;
        }
      });

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!containerRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      if (rendererRef.current) {
        rendererRef.current.dispose();
        if (containerRef.current?.contains(rendererRef.current.domElement)) {
          containerRef.current.removeChild(rendererRef.current.domElement);
        }
      }
    };
  }, [effectOptions]);

  return <div ref={containerRef} className="hyperspeed-container" />;
};

export default Hyperspeed;