import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF, OrbitControls } from "@react-three/drei";
import { useRef, useMemo, useEffect, useState } from "react";
import * as THREE from "three";

// ============================================
// SCENE CONFIGURATION
// ============================================

const SCENE_CONFIG = {
  // Model & Assets
  model: {
    path: "/base.glb",
    scale: 1,
  },

  // Leaf Textures
  leafTextures: ["/leaf1.png", "/leaf2.png", "/leaf3.png"],

  // Falling Leaves Settings
  leaves: {
    count: 240,
    treeHeight: 2.5,
    canopyRadius: 1,
    velocityX: 0.015,
    velocityY: 0.015,
    velocityYMin: 0.008,
    velocityZ: 0.015,
    rotationSpeed: 0.04,
    swayStrength: 0.5,
    swaySpeedMin: 0.5,
    swaySpeedMax: 1.0,
    scaleMin: 0.02,
    scaleMax: 0.04,
    spawnHeightVariation: 1.5,
    resetHeight: -0.5,
  },

  // Camera Settings
  camera: {
    // Initial position (start)
    initialPosition: { x: 10, y: 0.5, z: 2.5 },
    // Target position (after zoom)
    targetPosition: { x: 2.5, y: 0.5, z: -1.5 },
    // Look at point
    lookAt: { x: 0, y: 0.5, z: 0 },
    // Camera properties
    fov: 40,
    near: 1.5,
    far: 20,
    // Animation
    zoomSpeed: 0.35,
  },

  // Orbit Controls
  controls: {
    enablePan: false,
    enableZoom: true,
    enableRotate: true,
    minDistance: 2,
    maxDistance: 8,
    minPolarAngle: Math.PI / 2.5,
    maxPolarAngle: Math.PI / 2.1,
    target: { x: 0, y: 0.5, z: 0 },
  },

  // Lighting
  lighting: {
    ambient: {
      intensity: 0.6,
    },
    directional: {
      position: { x: 10, y: 15, z: 5 },
      intensity: 1.2,
      color: "#fff",
      shadowMapSize: 2048,
      shadowCameraSize: 20,
      shadowCameraFar: 50,
    },
    hemisphere: {
      skyColor: "#e0c7f4",
      groundColor: "#e0c7f4",
      intensity: 0.4,
    },
  },

  // Ground Plane
  ground: {
    radius: 10,
    segments: 6,
    color: "#e0c7f4",
    roughness: 1,
    position: { x: 0, y: -0.05, z: 0 },
  },

  // Scene Colors
  colors: {
    background: {
      top: "#e0c7f4",
      bottom: "#fff3e0",
    },
    fog: {
      color: "#e0c7f4",
      near: 8,
      far: 18,
    },
  },

  // Loading
  loadDelay: 100,
};

// ============================================
// COMPONENT CODE (Use CONFIG above)
// ============================================

// Leaf particle system component - spawns from tree canopy area
function FallingLeaves({ count, treeHeight, canopyRadius }) {
  const meshRef = useRef();
  const leafTextures = useMemo(() => {
    const loader = new THREE.TextureLoader();
    return SCENE_CONFIG.leafTextures.map((path) => loader.load(path));
  }, []);

  // Initialize leaf positions, velocities, rotations
  const leafData = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const velocities = [];
    const rotations = [];
    const textureIndices = [];
    const scales = [];

    for (let i = 0; i < count; i++) {
      // Spread leaves within the tree canopy area only
      const radius = Math.random() * canopyRadius;
      const angle = Math.random() * Math.PI * 2;
      positions[i * 3] = Math.cos(angle) * radius;
      // Start height within the tree canopy (not above it)
      positions[i * 3 + 1] =
        treeHeight - Math.random() * SCENE_CONFIG.leaves.spawnHeightVariation;
      positions[i * 3 + 2] = Math.sin(angle) * radius;

      velocities.push({
        x: (Math.random() - 0.5) * SCENE_CONFIG.leaves.velocityX,
        y: -(
          Math.random() * SCENE_CONFIG.leaves.velocityY +
          SCENE_CONFIG.leaves.velocityYMin
        ),
        z: (Math.random() - 0.5) * SCENE_CONFIG.leaves.velocityZ,
        rotX: (Math.random() - 0.5) * SCENE_CONFIG.leaves.rotationSpeed,
        rotY: (Math.random() - 0.5) * SCENE_CONFIG.leaves.rotationSpeed,
        rotZ: (Math.random() - 0.5) * SCENE_CONFIG.leaves.rotationSpeed,
        swayPhase: Math.random() * Math.PI * 2,
        swaySpeed:
          Math.random() * SCENE_CONFIG.leaves.swayStrength +
          SCENE_CONFIG.leaves.swaySpeedMin,
      });

      rotations.push({
        x: Math.random() * Math.PI * 2,
        y: Math.random() * Math.PI * 2,
        z: Math.random() * Math.PI * 2,
      });

      textureIndices.push(Math.floor(Math.random() * 3));
      scales.push(
        Math.random() *
          (SCENE_CONFIG.leaves.scaleMax - SCENE_CONFIG.leaves.scaleMin) +
          SCENE_CONFIG.leaves.scaleMin
      );
    }

    return {
      positions,
      velocities,
      rotations,
      textureIndices,
      scales,
      treeHeight,
      canopyRadius,
    };
  }, [count, treeHeight, canopyRadius]);

  // Create individual leaf meshes
  const leaves = useMemo(() => {
    return leafData.textureIndices.map((texIdx, i) => ({
      position: [
        leafData.positions[i * 3],
        leafData.positions[i * 3 + 1],
        leafData.positions[i * 3 + 2],
      ],
      rotation: leafData.rotations[i],
      textureIndex: texIdx,
      scale: leafData.scales[i],
      velocity: leafData.velocities[i],
      treeHeight: leafData.treeHeight,
      canopyRadius: leafData.canopyRadius,
    }));
  }, [leafData]);

  return (
    <group ref={meshRef}>
      {leaves.map((leaf, i) => (
        <Leaf
          key={i}
          initialPosition={leaf.position}
          initialRotation={leaf.rotation}
          texture={leafTextures[leaf.textureIndex]}
          scale={leaf.scale}
          velocity={leaf.velocity}
          treeHeight={leaf.treeHeight}
          canopyRadius={leaf.canopyRadius}
        />
      ))}
    </group>
  );
}

// Individual leaf component with animation
function Leaf({
  initialPosition,
  initialRotation,
  texture,
  scale,
  velocity,
  treeHeight,
  canopyRadius,
}) {
  const meshRef = useRef();
  const time = useRef(Math.random() * 100);

  useFrame((state, delta) => {
    if (meshRef.current) {
      time.current += delta;

      // Sway motion
      const sway =
        Math.sin(time.current * velocity.swaySpeed + velocity.swayPhase) * 0.5;

      // Update position
      meshRef.current.position.x += velocity.x + sway * 0.01;
      meshRef.current.position.y += velocity.y;
      meshRef.current.position.z += velocity.z + sway * 0.01;

      // Update rotation for tumbling effect
      meshRef.current.rotation.x += velocity.rotX * delta * 2;
      meshRef.current.rotation.y += velocity.rotY * delta * 2;
      meshRef.current.rotation.z += velocity.rotZ * delta * 2;

      // Reset leaf back to canopy when it falls below ground
      if (meshRef.current.position.y < SCENE_CONFIG.leaves.resetHeight) {
        const radius = Math.random() * canopyRadius;
        const angle = Math.random() * Math.PI * 2;
        meshRef.current.position.x = Math.cos(angle) * radius;
        meshRef.current.position.y =
          treeHeight - Math.random() * SCENE_CONFIG.leaves.spawnHeightVariation;
        meshRef.current.position.z = Math.sin(angle) * radius;
      }
    }
  });

  return (
    <mesh
      ref={meshRef}
      position={initialPosition}
      rotation={[initialRotation.x, initialRotation.y, initialRotation.z]}
      scale={scale}
    >
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial
        map={texture}
        transparent={true}
        side={THREE.DoubleSide}
        alphaTest={0.5}
        depthWrite={false}
      />
    </mesh>
  );
}

// Camera controller for zoom animation - horizontal movement toward tree
function CameraController({ isLoaded, onLoadComplete }) {
  const { camera } = useThree();
  const cfg = SCENE_CONFIG.camera;
  const targetPosition = useRef(
    new THREE.Vector3(
      cfg.targetPosition.x,
      cfg.targetPosition.y,
      cfg.targetPosition.z
    )
  );
  const initialPosition = useRef(
    new THREE.Vector3(
      cfg.initialPosition.x,
      cfg.initialPosition.y,
      cfg.initialPosition.z
    )
  );
  const animationProgress = useRef(0);
  const animationStarted = useRef(false);

  useEffect(() => {
    if (isLoaded && !animationStarted.current) {
      animationStarted.current = true;
      camera.position.copy(initialPosition.current);
      camera.lookAt(cfg.lookAt.x, cfg.lookAt.y, cfg.lookAt.z);
    }
  }, [isLoaded, camera, cfg]);

  useFrame((state, delta) => {
    if (isLoaded && animationProgress.current < 1) {
      animationProgress.current += delta * cfg.zoomSpeed;
      animationProgress.current = Math.min(animationProgress.current, 1);

      // Smooth easing
      const eased = 1 - Math.pow(1 - animationProgress.current, 3);

      camera.position.lerpVectors(
        initialPosition.current,
        targetPosition.current,
        eased
      );
      camera.lookAt(cfg.lookAt.x, cfg.lookAt.y, cfg.lookAt.z);

      if (animationProgress.current >= 1 && onLoadComplete) {
        onLoadComplete();
      }
    }
  });

  return null;
}

// Sakura tree model component - preserves original materials
function SakuraModel() {
  const { scene } = useGLTF(SCENE_CONFIG.model.path);
  const clonedScene = useMemo(() => scene.clone(true), [scene]);

  useEffect(() => {
    clonedScene.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        // Ensure materials are properly rendered with correct settings
        if (child.material) {
          // Clone material to avoid modifying the cached version
          child.material = child.material.clone();
          child.material.needsUpdate = true;
          child.material.side = THREE.DoubleSide;
          // Ensure textures are visible
          if (child.material.map) {
            child.material.map.needsUpdate = true;
          }
        }
      }
    });
  }, [clonedScene]);

  return <primitive object={clonedScene} scale={SCENE_CONFIG.model.scale} />;
}

// Main scene content
function SakuraScene({ isLoaded, onLoadComplete }) {
  const ctrl = SCENE_CONFIG.controls;
  const light = SCENE_CONFIG.lighting;
  const ground = SCENE_CONFIG.ground;

  return (
    <>
      <CameraController isLoaded={isLoaded} onLoadComplete={onLoadComplete} />
      <OrbitControls
        enablePan={ctrl.enablePan}
        enableZoom={ctrl.enableZoom}
        enableRotate={ctrl.enableRotate}
        minDistance={ctrl.minDistance}
        maxDistance={ctrl.maxDistance}
        minPolarAngle={ctrl.minPolarAngle}
        maxPolarAngle={ctrl.maxPolarAngle}
        target={[ctrl.target.x, ctrl.target.y, ctrl.target.z]}
      />

      {/* Lighting */}
      <ambientLight intensity={light.ambient.intensity} />
      <directionalLight
        position={[
          light.directional.position.x,
          light.directional.position.y,
          light.directional.position.z,
        ]}
        intensity={light.directional.intensity}
        color={light.directional.color}
        castShadow
        shadow-mapSize-width={light.directional.shadowMapSize}
        shadow-mapSize-height={light.directional.shadowMapSize}
        shadow-camera-far={light.directional.shadowCameraFar}
        shadow-camera-left={-light.directional.shadowCameraSize}
        shadow-camera-right={light.directional.shadowCameraSize}
        shadow-camera-top={light.directional.shadowCameraSize}
        shadow-camera-bottom={-light.directional.shadowCameraSize}
      />
      <hemisphereLight
        color={light.hemisphere.skyColor}
        groundColor={light.hemisphere.groundColor}
        intensity={light.hemisphere.intensity}
      />

      {/* Sakura tree */}
      <SakuraModel />

      {/* Falling leaves */}
      <FallingLeaves
        count={SCENE_CONFIG.leaves.count}
        treeHeight={SCENE_CONFIG.leaves.treeHeight}
        canopyRadius={SCENE_CONFIG.leaves.canopyRadius}
      />

      {/* Ground plane */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[ground.position.x, ground.position.y, ground.position.z]}
        receiveShadow
      >
        <circleGeometry args={[ground.radius, ground.segments]} />
        <meshStandardMaterial
          color={ground.color}
          roughness={ground.roughness}
        />
      </mesh>
    </>
  );
}

export function ThreeEnv({ channel = 0, onSceneReady }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [animationComplete, setAnimationComplete] = useState(false);
  const cam = SCENE_CONFIG.camera;
  const colors = SCENE_CONFIG.colors;

  // Start loading after a brief delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, SCENE_CONFIG.loadDelay);
    return () => clearTimeout(timer);
  }, []);

  const handleLoadComplete = () => {
    setAnimationComplete(true);
    if (onSceneReady) {
      onSceneReady();
    }
  };

  // Only render Sakura scene for channel 0
  if (channel !== 0) {
    return null;
  }

  return (
    <Canvas
      id="canvas-id"
      shadows
      camera={{
        position: [
          cam.initialPosition.x,
          cam.initialPosition.y,
          cam.initialPosition.z,
        ],
        fov: cam.fov,
        near: cam.near,
        far: cam.far,
      }}
      style={{
        background: `linear-gradient(to bottom, ${colors.background.top}, ${colors.background.bottom})`,
      }}
    >
      <fog
        attach="fog"
        args={[colors.fog.color, colors.fog.near, colors.fog.far]}
      />
      <SakuraScene isLoaded={isLoaded} onLoadComplete={handleLoadComplete} />
    </Canvas>
  );
}

// Preload the model
useGLTF.preload(SCENE_CONFIG.model.path);
