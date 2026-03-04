import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

const SCENE_CONFIG = {
  environmentSpacing: 36,
  renderDistance: 15,
  camera: {
    fov: 40,
    near: 0.1,
    far: 34,
    height: 3.2,
    zOffset: 9,
    lookAtHeight: 1.1,
    moveSpeed: 3.4,
  },
  fog: {
    near: 5.5,
    far: 16.5,
  },
  wind: {
    sakuraCount: 72,
    desertCount: 180,
    neonCount: 120,
  },
};

const SAKURA_MODEL_PATH = "/free_low_poly_sakura_tree.glb";
const SAKURA_GRASS_PATH = "/low_poly_grass_pack.glb";
const SAKURA_STONE_PATH = "/stylized_low-poly_stone.glb";
const SAKURA_BRIDGE_PATH = "/japanese_bridge_garden.glb";
const WINTER_SCENE_PATH = "/low_poly_winter_scene.glb";
const SOVIET_TV_PATH = "/soviet_retro_tv.glb";

const DEFAULT_TV_VISUALS = {
  model: {
    position: [0, -0.44, -0.08],
    rotation: [0, Math.PI, 0],
    scale: 0.46,
  },
  screen: {
    position: [0, 0.03, -0.24],
    rotation: [0, Math.PI, 0],
    size: [0.62, 0.44],
  },
};

const CHANNEL_CONTROLS = [
  {
    anchorOffsetX: 0,
    sceneOffset: [0, 0, 0],
    sceneScale: 1,
    sakuraBridgeModel: {
      position: [-0.05, -1.08, 1],
      rotation: [0, Math.PI * 0.5, 0],
      scale: 1,
    },
    tvLayout: {
      position: [0.12, 1.22, -0.12],
      rotation: [0, Math.PI * 0.95, 0],
    },
    tvVisuals: {
      model: { scale: 1.1 },
    },
  },
  {
    anchorOffsetX: 0,
    sceneOffset: [0, 0, 0],
    sceneScale: 1,
    tvLayout: {
      position: [0.75, 0.72, 2.35],
      rotation: [0, Math.PI * 0.95, 0],
    },
    tvVisuals: {
      model: { scale: 1.65 },
    },
  },
  {
    anchorOffsetX: 0,
    sceneOffset: [0, 0, 0],
    sceneScale: 1,
    winterModel: {
      position: [0.15, -0.25, -0.75],
      rotation: [0, Math.PI * 0.08, 0],
      scale: 2.3,
    },
    tvLayout: {
      position: [0.75, 0.72, 2.35],
      rotation: [0, Math.PI * 0.95, 0],
    },
    tvVisuals: {
      model: { scale: 1.65 },
    },
  },
  {
    anchorOffsetX: 0,
    sceneOffset: [0, 0, 0],
    sceneScale: 1,
    tvLayout: {
      position: [0.75, 0.72, 2.35],
      rotation: [0, Math.PI * 0.95, 0],
    },
    tvVisuals: {
      model: { scale: 1.65 },
    },
  },
];

const UI_THEMES = {
  light: {
    backgroundTop: "#d6d8ff",
    backgroundBottom: "#fff6ef",
    fogColor: "#d6d8ff",
    planeColor: "#d3d7ea",
    hemisphereGround: "#c2bce7",
    ambientIntensity: 0.45,
    directionalIntensity: 1.0,
  },
  dark: {
    backgroundTop: "#0d1322",
    backgroundBottom: "#171229",
    fogColor: "#111b2d",
    planeColor: "#1c2336",
    hemisphereGround: "#201d38",
    ambientIntensity: 0.3,
    directionalIntensity: 0.72,
  },
};

const ENVIRONMENT_MODES = [
  {
    name: "SAKURA",
    day: {
      scene: {
        backgroundTop: "#ffdfe9",
        backgroundBottom: "#fff5ed",
        fogColor: "#f2c8da",
        planeColor: "#efd8e8",
        hemisphereGround: "#d8bbcc",
        ambientIntensity: 0.54,
        directionalIntensity: 0.92,
      },
      palette: {
        ground: "#f6dbe8",
        accent: "#ff6a9f",
        prop: "#a37dc9",
        trunk: "#5b3f34",
        blossom: "#ffb3d2",
        blossomInner: "#ffe1ef",
        benchWood: "#7a4d3f",
        benchMetal: "#3d3646",
        water: "#76d5ff",
        waterGlow: "#b8f1ff",
        stone: "#c5b4bf",
      },
    },
    night: {
      scene: {
        backgroundTop: "#2e1832",
        backgroundBottom: "#120a1b",
        fogColor: "#2f1a36",
        planeColor: "#3a2746",
        hemisphereGround: "#281932",
        ambientIntensity: 0.35,
        directionalIntensity: 0.72,
      },
      palette: {
        ground: "#442d4e",
        accent: "#ff8dca",
        prop: "#b38be1",
        trunk: "#3b2825",
        blossom: "#f08cc3",
        blossomInner: "#ffd5ec",
        benchWood: "#5d3b34",
        benchMetal: "#bca8d9",
        water: "#4db7ff",
        waterGlow: "#8ce7ff",
        stone: "#7d6f86",
      },
    },
  },
  {
    name: "DESERT",
    day: {
      scene: {
        backgroundTop: "#ffd7a8",
        backgroundBottom: "#fff0d6",
        fogColor: "#f2cc98",
        planeColor: "#ecd0a3",
        hemisphereGround: "#cda774",
        ambientIntensity: 0.52,
        directionalIntensity: 1.02,
      },
      palette: {
        ground: "#f2d2a0",
        accent: "#ff9c4c",
        prop: "#9b7742",
        dune: "#e9bb78",
        duneShadow: "#d29d5d",
        cactus: "#3d855f",
        cactusDark: "#2c5f44",
        rock: "#ab8a5d",
      },
    },
    night: {
      scene: {
        backgroundTop: "#35231a",
        backgroundBottom: "#1d130d",
        fogColor: "#332117",
        planeColor: "#402a1e",
        hemisphereGround: "#2a1b13",
        ambientIntensity: 0.32,
        directionalIntensity: 0.74,
      },
      palette: {
        ground: "#5e4331",
        accent: "#ffb26d",
        prop: "#c09763",
        dune: "#7a563f",
        duneShadow: "#624532",
        cactus: "#4aa679",
        cactusDark: "#2f7553",
        rock: "#7b6247",
      },
    },
  },
  {
    name: "ARCTIC",
    day: {
      scene: {
        backgroundTop: "#d8f0ff",
        backgroundBottom: "#eef9ff",
        fogColor: "#cde9f9",
        planeColor: "#d8ecf8",
        hemisphereGround: "#b7d2e6",
        ambientIntensity: 0.48,
        directionalIntensity: 0.96,
      },
      palette: {
        ground: "#d7eef8",
        accent: "#51c3ff",
        prop: "#6d8da4",
        iceberg: "#b8e6ff",
        icebergDark: "#89b8d7",
        snow: "#ecf8ff",
        iceWater: "#59baff",
        iceGlow: "#a4ecff",
        aurora: "#7df2ff",
      },
    },
    night: {
      scene: {
        backgroundTop: "#122633",
        backgroundBottom: "#0b1a24",
        fogColor: "#0f2230",
        planeColor: "#183444",
        hemisphereGround: "#122735",
        ambientIntensity: 0.31,
        directionalIntensity: 0.72,
      },
      palette: {
        ground: "#1b3647",
        accent: "#7fddff",
        prop: "#8ca9bf",
        iceberg: "#4a708e",
        icebergDark: "#314f66",
        snow: "#9ab8cf",
        iceWater: "#3f9fdc",
        iceGlow: "#82d7ff",
        aurora: "#7be9ff",
      },
    },
  },
  {
    name: "NEON",
    day: {
      scene: {
        backgroundTop: "#1c1f3a",
        backgroundBottom: "#090b1d",
        fogColor: "#171830",
        planeColor: "#1a2040",
        hemisphereGround: "#20164f",
        ambientIntensity: 0.34,
        directionalIntensity: 0.8,
      },
      palette: {
        ground: "#1c1f3a",
        accent: "#00ffd0",
        prop: "#7a3fff",
      },
    },
    night: {
      scene: {
        backgroundTop: "#30143d",
        backgroundBottom: "#12061c",
        fogColor: "#291235",
        planeColor: "#35154a",
        hemisphereGround: "#210b30",
        ambientIntensity: 0.32,
        directionalIntensity: 0.78,
      },
      palette: {
        ground: "#2d1142",
        accent: "#ff47f0",
        prop: "#3f87ff",
      },
    },
  },
];

function clampChannel(channel) {
  return Math.max(0, Math.min(channel, ENVIRONMENT_MODES.length - 1));
}

function getChannelControls(index) {
  return CHANNEL_CONTROLS[clampChannel(index)] || CHANNEL_CONTROLS[0];
}

function getChannelAnchor(channel) {
  const controls = getChannelControls(channel);
  return channel * SCENE_CONFIG.environmentSpacing + (controls.anchorOffsetX || 0);
}

function getModeKey(sceneMode) {
  return sceneMode === 1 ? "night" : "day";
}

function getSceneTheme({ channel, sceneMode, currentMode, useEnvironmentModes }) {
  if (!useEnvironmentModes) {
    return currentMode === 1 ? UI_THEMES.dark : UI_THEMES.light;
  }

  const env = ENVIRONMENT_MODES[clampChannel(channel)];
  return env[getModeKey(sceneMode)].scene;
}

function getEnvironmentPalette(index, sceneMode, useEnvironmentModes) {
  const env = ENVIRONMENT_MODES[index];
  if (!useEnvironmentModes) return env.day.palette;
  return env[getModeKey(sceneMode)].palette;
}

function isNightSceneMode({ sceneMode, currentMode, useEnvironmentModes }) {
  if (!useEnvironmentModes) return currentMode === 1;
  return getModeKey(sceneMode) === "night";
}

function configureShadowMeshes(root) {
  if (!root) return;

  root.traverse((child) => {
    if (!child.isMesh) return;

    const materials = Array.isArray(child.material)
      ? child.material.filter(Boolean)
      : child.material
        ? [child.material]
        : [];

    const isTransparent = materials.some(
      (material) => material.transparent && (material.opacity ?? 1) < 0.95
    );
    const isUnlit = materials.length > 0 && materials.every((material) => material.isMeshBasicMaterial);

    child.castShadow = !isTransparent && !isUnlit;
    child.receiveShadow = !isTransparent && !isUnlit;
  });
}

function createSoftDotTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext("2d");

  if (ctx) {
    const gradient = ctx.createRadialGradient(32, 32, 3, 32, 32, 28);
    gradient.addColorStop(0, "rgba(255,255,255,1)");
    gradient.addColorStop(0.6, "rgba(255,255,255,0.7)");
    gradient.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 64, 64);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

function createPetalTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext("2d");

  if (ctx) {
    ctx.translate(32, 32);
    ctx.rotate(-Math.PI / 7);
    const gradient = ctx.createLinearGradient(-8, -18, 16, 18);
    gradient.addColorStop(0, "rgba(255,255,255,1)");
    gradient.addColorStop(1, "rgba(255,255,255,0.55)");
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.ellipse(0, 0, 9, 18, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

function pickLaneByWeights(weights) {
  let total = 0;
  for (let i = 0; i < weights.length; i++) total += weights[i];
  let r = Math.random() * total;
  for (let i = 0; i < weights.length; i++) {
    r -= weights[i];
    if (r <= 0) return i;
  }
  return weights.length - 1;
}

function getLaminarOffsets(x, t, phase, ampY, ampZ, speed) {
  const px = x * 0.78 - t * speed + phase;
  const dy = Math.sin(px * 1.17) * ampY + Math.sin(px * 0.4) * ampY * 0.35;
  const dz = Math.cos(px * 0.93) * ampZ + Math.sin(px * 0.51) * ampZ * 0.28;
  return { dy, dz };
}

function SceneFogEnvelope({ palette, isNight }) {
  const fogColor = useMemo(() => {
    const base = new THREE.Color(palette.ground || "#8aa0b5");
    const accent = new THREE.Color(palette.accent || "#a9c3d8");
    return base.lerp(accent, isNight ? 0.18 : 0.12).getHexString();
  }, [palette.accent, palette.ground, isNight]);

  return (
    <group>
      <mesh position={[0, 1.95, 0]}>
        <cylinderGeometry args={[8.95, 8.2, 4.4, 52, 1, true]} />
        <meshBasicMaterial
          color={`#${fogColor}`}
          transparent
          opacity={isNight ? 0.2 : 0.14}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>
      <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[7.1, 8.9, 56]} />
        <meshBasicMaterial
          color={`#${fogColor}`}
          transparent
          opacity={isNight ? 0.12 : 0.08}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

function SakuraWind({ index, palette, isActive }) {
  const pointsRef = useRef();
  const petalTexture = useMemo(() => createPetalTexture(), []);
  const count = SCENE_CONFIG.wind.sakuraCount;
  const x = getChannelAnchor(index);
  const laneY = useMemo(() => [0.9, 1.55, 2.2, 2.9, 3.5], []);
  const laneZ = useMemo(() => [-2.1, -1.05, 0, 1.05, 2.1], []);
  const laneWeights = useMemo(() => [0.8, 1.9, 2.6, 1.9, 0.8], []);
  const laneIndices = useMemo(() => new Uint8Array(count), [count]);
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const lane = pickLaneByWeights(laneWeights);
      laneIndices[i] = lane;
      arr[i * 3] = (Math.random() * 2 - 1) * 7.2;
      arr[i * 3 + 1] = laneY[lane] + (Math.random() * 2 - 1) * 0.22;
      arr[i * 3 + 2] = laneZ[lane] + (Math.random() * 2 - 1) * 0.32;
    }
    return arr;
  }, [count, laneIndices, laneWeights, laneY, laneZ]);
  const speeds = useMemo(
    () => Array.from({ length: count }, () => 0.9 + Math.random() * 0.55),
    [count]
  );
  const phases = useMemo(
    () => Array.from({ length: count }, () => Math.random() * Math.PI * 2),
    [count]
  );
  const ampY = useMemo(
    () => Array.from({ length: count }, () => 0.2 + Math.random() * 0.16),
    [count]
  );
  const ampZ = useMemo(
    () => Array.from({ length: count }, () => 0.36 + Math.random() * 0.24),
    [count]
  );

  useEffect(() => () => petalTexture.dispose(), [petalTexture]);

  useFrame((state, delta) => {
    if (!isActive || !pointsRef.current) return;
    const t = state.clock.elapsedTime;

    for (let i = 0; i < count; i++) {
      const idx = i * 3;
      const lane = laneIndices[i];
      positions[idx] += speeds[i] * delta * 1.25;
      const flow = getLaminarOffsets(
        positions[idx],
        t,
        phases[i],
        ampY[i],
        ampZ[i],
        speeds[i]
      );
      const targetY = laneY[lane] + flow.dy;
      const targetZ = laneZ[lane] + flow.dz;
      positions[idx + 1] = THREE.MathUtils.lerp(positions[idx + 1], targetY, 0.18);
      positions[idx + 2] = THREE.MathUtils.lerp(positions[idx + 2], targetZ, 0.2);

      if (positions[idx] > 7.4) {
        positions[idx] = -7.4 + Math.random() * 0.6;
        laneIndices[i] = Math.random() < 0.22 ? pickLaneByWeights(laneWeights) : lane;
        const nextLane = laneIndices[i];
        positions[idx + 1] = laneY[nextLane] + (Math.random() * 2 - 1) * 0.22;
        positions[idx + 2] = laneZ[nextLane] + (Math.random() * 2 - 1) * 0.32;
      }
    }

    pointsRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <group position={[x, 0, 0]}>
      <points ref={pointsRef} raycast={() => null}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[positions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          map={petalTexture}
          color={palette.blossom || palette.accent}
          size={0.24}
          transparent
          opacity={0.88}
          alphaTest={0.12}
          depthWrite={false}
          blending={THREE.NormalBlending}
        />
      </points>
    </group>
  );
}

function DesertWind({ index, palette, isActive }) {
  const pointsRef = useRef();
  const dotTexture = useMemo(() => createSoftDotTexture(), []);
  const count = SCENE_CONFIG.wind.desertCount;
  const x = getChannelAnchor(index);
  const laneY = useMemo(() => [0.22, 0.45, 0.75, 1.1, 1.45], []);
  const laneZ = useMemo(() => [-2.3, -1.2, 0, 1.2, 2.3], []);
  const laneWeights = useMemo(() => [0.9, 1.9, 2.8, 1.9, 0.9], []);
  const laneIndices = useMemo(() => new Uint8Array(count), [count]);
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const lane = pickLaneByWeights(laneWeights);
      laneIndices[i] = lane;
      arr[i * 3] = (Math.random() * 2 - 1) * 7.2;
      arr[i * 3 + 1] = laneY[lane] + (Math.random() * 2 - 1) * 0.11;
      arr[i * 3 + 2] = laneZ[lane] + (Math.random() * 2 - 1) * 0.28;
    }
    return arr;
  }, [count, laneIndices, laneWeights, laneY, laneZ]);
  const speeds = useMemo(
    () => Array.from({ length: count }, () => 1.55 + Math.random() * 1.05),
    [count]
  );
  const phases = useMemo(
    () => Array.from({ length: count }, () => Math.random() * Math.PI * 2),
    [count]
  );
  const ampY = useMemo(
    () => Array.from({ length: count }, () => 0.05 + Math.random() * 0.06),
    [count]
  );
  const ampZ = useMemo(
    () => Array.from({ length: count }, () => 0.18 + Math.random() * 0.16),
    [count]
  );

  useEffect(() => () => dotTexture.dispose(), [dotTexture]);

  useFrame((state, delta) => {
    if (!isActive || !pointsRef.current) return;
    const t = state.clock.elapsedTime;

    for (let i = 0; i < count; i++) {
      const idx = i * 3;
      const lane = laneIndices[i];
      positions[idx] += speeds[i] * delta * 1.7;
      const flow = getLaminarOffsets(
        positions[idx],
        t,
        phases[i],
        ampY[i],
        ampZ[i],
        speeds[i] * 1.2
      );
      const targetY = laneY[lane] + flow.dy;
      const targetZ = laneZ[lane] + flow.dz;
      positions[idx + 1] = THREE.MathUtils.lerp(positions[idx + 1], targetY, 0.2);
      positions[idx + 2] = THREE.MathUtils.lerp(positions[idx + 2], targetZ, 0.2);

      if (positions[idx] > 7.4) {
        positions[idx] = -7.4 + Math.random() * 0.4;
        laneIndices[i] = Math.random() < 0.18 ? pickLaneByWeights(laneWeights) : lane;
        const nextLane = laneIndices[i];
        positions[idx + 1] = laneY[nextLane] + (Math.random() * 2 - 1) * 0.11;
        positions[idx + 2] = laneZ[nextLane] + (Math.random() * 2 - 1) * 0.28;
      }
    }

    pointsRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <group position={[x, 0, 0]}>
      <points ref={pointsRef} raycast={() => null}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[positions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          map={dotTexture}
          color={palette.duneShadow || palette.prop}
          size={0.11}
          transparent
          opacity={0.58}
          alphaTest={0.1}
          depthWrite={false}
        />
      </points>
    </group>
  );
}

function ArcticWind({ index, palette, isActive }) {
  const meshesRef = useRef([]);
  const x = getChannelAnchor(index);
  const laneY = useMemo(() => [1.35, 2.0, 2.7, 3.45], []);
  const laneZ = useMemo(() => [-1.9, -0.8, 0.7, 1.8], []);
  const laneWeights = useMemo(() => [1.1, 2.2, 2.2, 1.1], []);
  const strips = useMemo(
    () =>
      Array.from({ length: 7 }, () => ({
        x: (Math.random() * 2 - 1) * 7,
        y: 0,
        z: 0,
        width: 0.12 + Math.random() * 0.12,
        length: 1.7 + Math.random() * 1.4,
        speed: 1 + Math.random() * 0.8,
        phase: Math.random() * Math.PI * 2,
        lane: pickLaneByWeights(laneWeights),
      })),
    [laneWeights]
  );

  useEffect(() => {
    for (let i = 0; i < strips.length; i++) {
      const lane = strips[i].lane;
      strips[i].y = laneY[lane] + (Math.random() * 2 - 1) * 0.14;
      strips[i].z = laneZ[lane] + (Math.random() * 2 - 1) * 0.2;
    }
  }, [laneY, laneZ, strips]);

  useFrame((state, delta) => {
    if (!isActive) return;
    const t = state.clock.elapsedTime;

    for (let i = 0; i < strips.length; i++) {
      const data = strips[i];
      const mesh = meshesRef.current[i];
      if (!mesh) continue;

      data.x += data.speed * delta * 1.25;
      if (data.x > 7.2) {
        data.x = -7.2;
        data.lane = Math.random() < 0.28 ? pickLaneByWeights(laneWeights) : data.lane;
        data.y = laneY[data.lane] + (Math.random() * 2 - 1) * 0.14;
        data.z = laneZ[data.lane] + (Math.random() * 2 - 1) * 0.2;
      }

      const flow = getLaminarOffsets(
        data.x,
        t,
        data.phase,
        0.18,
        0.22,
        data.speed * 0.8
      );
      mesh.position.set(
        data.x,
        data.y + flow.dy,
        data.z + flow.dz
      );
      mesh.rotation.z = Math.sin(t * 1.1 + data.phase) * 0.2;
    }
  });

  return (
    <group position={[x, 0, 0]}>
      {strips.map((data, i) => (
        <mesh
          key={`arctic-wind-${i}`}
          ref={(el) => {
            meshesRef.current[i] = el;
          }}
          raycast={() => null}
          position={[data.x, data.y, data.z]}
        >
          <planeGeometry args={[data.length, data.width]} />
          <meshBasicMaterial
            color={palette.aurora || palette.accent}
            transparent
            opacity={0.24}
            depthWrite={false}
            side={THREE.DoubleSide}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      ))}
    </group>
  );
}

function NeonWind({ index, palette, isActive }) {
  const pointsRef = useRef();
  const dotTexture = useMemo(() => createSoftDotTexture(), []);
  const count = SCENE_CONFIG.wind.neonCount;
  const x = getChannelAnchor(index);
  const laneY = useMemo(() => [0.8, 1.6, 2.4, 3.2], []);
  const laneZ = useMemo(() => [-1.4, -0.4, 0.6, 1.5], []);
  const laneWeights = useMemo(() => [0.9, 2.2, 2.1, 0.9], []);
  const laneIndices = useMemo(() => new Uint8Array(count), [count]);
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const lane = pickLaneByWeights(laneWeights);
      laneIndices[i] = lane;
      arr[i * 3] = (Math.random() * 2 - 1) * 7.2;
      arr[i * 3 + 1] = laneY[lane] + (Math.random() * 2 - 1) * 0.2;
      arr[i * 3 + 2] = laneZ[lane] + (Math.random() * 2 - 1) * 0.25;
    }
    return arr;
  }, [count, laneIndices, laneWeights, laneY, laneZ]);
  const speeds = useMemo(
    () => Array.from({ length: count }, () => 1.2 + Math.random() * 0.8),
    [count]
  );
  const phases = useMemo(
    () => Array.from({ length: count }, () => Math.random() * Math.PI * 2),
    [count]
  );
  const ampY = useMemo(
    () => Array.from({ length: count }, () => 0.12 + Math.random() * 0.14),
    [count]
  );
  const ampZ = useMemo(
    () => Array.from({ length: count }, () => 0.18 + Math.random() * 0.17),
    [count]
  );

  useEffect(() => () => dotTexture.dispose(), [dotTexture]);

  useFrame((state, delta) => {
    if (!isActive || !pointsRef.current) return;
    const t = state.clock.elapsedTime;

    for (let i = 0; i < count; i++) {
      const idx = i * 3;
      const lane = laneIndices[i];
      positions[idx] += speeds[i] * delta * 1.55;
      const flow = getLaminarOffsets(
        positions[idx],
        t,
        phases[i],
        ampY[i],
        ampZ[i],
        speeds[i]
      );
      const targetY = laneY[lane] + flow.dy;
      const targetZ = laneZ[lane] + flow.dz;
      positions[idx + 1] = THREE.MathUtils.lerp(positions[idx + 1], targetY, 0.2);
      positions[idx + 2] = THREE.MathUtils.lerp(positions[idx + 2], targetZ, 0.2);

      if (positions[idx] > 7.2) {
        positions[idx] = -7.2;
        laneIndices[i] = Math.random() < 0.2 ? pickLaneByWeights(laneWeights) : lane;
        const nextLane = laneIndices[i];
        positions[idx + 1] = laneY[nextLane] + (Math.random() * 2 - 1) * 0.2;
        positions[idx + 2] = laneZ[nextLane] + (Math.random() * 2 - 1) * 0.25;
      }
    }

    pointsRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <group position={[x, 0, 0]}>
      <points ref={pointsRef} raycast={() => null}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[positions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          map={dotTexture}
          color={palette.accent}
          size={0.12}
          transparent
          opacity={0.72}
          alphaTest={0.1}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
}

function CRTTV({
  channel,
  onScreenFocus,
}) {
  const screenRef = useRef();
  const { scene } = useGLTF(SOVIET_TV_PATH);
  const tvModel = useMemo(() => scene.clone(true), [scene]);
  const controls = getChannelControls(channel);
  const layout = controls.tvLayout;
  const tvVisuals = {
    model: {
      ...DEFAULT_TV_VISUALS.model,
      ...(controls.tvVisuals?.model || {}),
    },
    screen: {
      ...DEFAULT_TV_VISUALS.screen,
      ...(controls.tvVisuals?.screen || {}),
    },
  };

  useEffect(() => {
    tvModel.traverse((child) => {
      if (!child.isMesh) return;
      child.frustumCulled = true;
      const transparent = child.material?.transparent && (child.material?.opacity ?? 1) < 0.95;
      child.castShadow = !transparent;
      child.receiveShadow = !transparent;
      // Keep TV shell from swallowing pointer hits intended for the screen plane.
      child.raycast = () => null;
    });
  }, [tvModel]);

  function handleScreenClick(event) {
    event.stopPropagation();
    if (!screenRef.current || !onScreenFocus) return;

    const screenPosition = new THREE.Vector3();
    const screenQuaternion = new THREE.Quaternion();
    const normal = new THREE.Vector3(0, 0, 1);

    screenRef.current.getWorldPosition(screenPosition);
    screenRef.current.getWorldQuaternion(screenQuaternion);
    normal.applyQuaternion(screenQuaternion).normalize();

    const cameraPosition = screenPosition
      .clone()
      .add(normal.multiplyScalar(1.65))
      .add(new THREE.Vector3(0, 0.22, 0));

    onScreenFocus({
      key: `tv-${channel}`,
      channel,
      cameraPosition: [cameraPosition.x, cameraPosition.y, cameraPosition.z],
      lookAt: [screenPosition.x, screenPosition.y, screenPosition.z],
    });
  }

  return (
    <group position={layout.position} rotation={layout.rotation}>
      <primitive
        object={tvModel}
        position={tvVisuals.model.position}
        rotation={tvVisuals.model.rotation}
        scale={tvVisuals.model.scale}
      />

      <mesh
        ref={screenRef}
        position={tvVisuals.screen.position}
        rotation={tvVisuals.screen.rotation}
        onPointerDown={handleScreenClick}
        renderOrder={6}
      >
        <planeGeometry args={tvVisuals.screen.size} />
        <meshBasicMaterial
          transparent
          opacity={0}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}

function SakuraTreeModel({ isActive }) {
  const { scene } = useGLTF(SAKURA_MODEL_PATH);
  const modelRef = useRef();
  const model = useMemo(() => scene.clone(true), [scene]);

  useEffect(() => {
    model.traverse((child) => {
      if (child.isMesh) {
        child.frustumCulled = true;
        const transparent = child.material?.transparent && (child.material?.opacity ?? 1) < 0.95;
        child.castShadow = !transparent;
        child.receiveShadow = !transparent;
      }
    });
  }, [model]);

  useFrame((state) => {
    if (!isActive || !modelRef.current) return;
    modelRef.current.rotation.y = -Math.PI * 0.06 + Math.sin(state.clock.elapsedTime * 0.2) * 0.08;
  });

  return (
    <primitive
      ref={modelRef}
      object={model}
      position={[-1.75, -0.18, -1.25]}
      rotation={[0, -Math.PI * 0.06, 0]}
      scale={1.18}
    />
  );
}

function SakuraGrassField() {
  const { scene } = useGLTF(SAKURA_GRASS_PATH);
  const treeOrigin = useMemo(() => new THREE.Vector3(-1.75, -0.23, -1.25), []);
  const instanceRefs = useRef([]);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const sourceMeshes = useMemo(() => {
    const meshes = [];
    scene.traverse((child) => {
      if (!child.isMesh || !child.geometry || !child.material) return;
      const material = Array.isArray(child.material) ? child.material[0] : child.material;
      if (!material) return;
      meshes.push({
        geometry: child.geometry,
        material,
      });
    });
    return meshes;
  }, [scene]);

  const grassPatches = useMemo(() => {
    const patches = [];
    const targetCount = 520;
    const maxAttempts = 1400;
    let attempts = 0;

    while (patches.length < targetCount && attempts < maxAttempts) {
      attempts += 1;
      const angle = Math.random() * Math.PI * 2;
      const radius = 0.4 + Math.random() * 3.45;
      const px = treeOrigin.x + Math.cos(angle) * radius;
      const pz = treeOrigin.z + Math.sin(angle) * radius;

      // Keep the interaction lane around bench + TV cleaner.
      if (px > 0.65 && pz > 0.45) continue;

      patches.push({
        position: [px, treeOrigin.y + (Math.random() * 0.04 - 0.02), pz],
        rotationY: Math.random() * Math.PI * 2,
        scale: 0.014 + Math.random() * 0.054,
      });
    }

    return patches;
  }, [treeOrigin]);

  useEffect(() => {
    if (sourceMeshes.length === 0 || grassPatches.length === 0) return;

    for (let meshIndex = 0; meshIndex < sourceMeshes.length; meshIndex++) {
      const instanced = instanceRefs.current[meshIndex];
      if (!instanced) continue;

      for (let i = 0; i < grassPatches.length; i++) {
        const patch = grassPatches[i];
        dummy.position.set(patch.position[0], patch.position[1], patch.position[2]);
        dummy.rotation.set(0, patch.rotationY, 0);
        dummy.scale.setScalar(patch.scale);
        dummy.updateMatrix();
        instanced.setMatrixAt(i, dummy.matrix);
      }

      instanced.instanceMatrix.needsUpdate = true;
      instanced.frustumCulled = false;
      instanced.castShadow = true;
      instanced.receiveShadow = true;
    }
  }, [dummy, grassPatches, sourceMeshes]);

  return (
    <group>
      {sourceMeshes.map((sourceMesh, meshIndex) => (
        <instancedMesh
          key={`sakura-grass-inst-${meshIndex}`}
          ref={(el) => {
            instanceRefs.current[meshIndex] = el;
          }}
          args={[sourceMesh.geometry, sourceMesh.material, grassPatches.length]}
          castShadow
          receiveShadow
        />
      ))}
    </group>
  );
}

function SakuraStoneField() {
  const { scene } = useGLTF(SAKURA_STONE_PATH);
  const treeOrigin = useMemo(() => new THREE.Vector3(-1.75, -0.23, -1.25), []);
  const instanceRefs = useRef([]);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const sourceMeshes = useMemo(() => {
    const meshes = [];
    scene.traverse((child) => {
      if (!child.isMesh || !child.geometry || !child.material) return;
      const material = Array.isArray(child.material) ? child.material[0] : child.material;
      if (!material) return;
      meshes.push({
        geometry: child.geometry,
        material,
      });
    });
    return meshes;
  }, [scene]);

  const stones = useMemo(() => {
    const items = [];
    const targetCount = 56;
    const maxAttempts = 600;
    let attempts = 0;

    while (items.length < targetCount && attempts < maxAttempts) {
      attempts += 1;
      const angle = Math.random() * Math.PI * 2;
      const radius = 0.9 + Math.random() * 3.1;
      const px = treeOrigin.x + Math.cos(angle) * radius;
      const pz = treeOrigin.z + Math.sin(angle) * radius;

      // Keep lane around TV + bench clearer.
      if (px > 0.55 && pz > 0.4) continue;

      items.push({
        position: [px, treeOrigin.y - 0.02 + Math.random() * 0.02, pz],
        rotationY: Math.random() * Math.PI * 2,
        scale: 0.09 + Math.random() * 0.08,
      });
    }

    return items;
  }, [treeOrigin]);

  useEffect(() => {
    if (sourceMeshes.length === 0 || stones.length === 0) return;

    for (let meshIndex = 0; meshIndex < sourceMeshes.length; meshIndex++) {
      const instanced = instanceRefs.current[meshIndex];
      if (!instanced) continue;

      for (let i = 0; i < stones.length; i++) {
        const stone = stones[i];
        dummy.position.set(stone.position[0], stone.position[1], stone.position[2]);
        dummy.rotation.set(0, stone.rotationY, 0);
        dummy.scale.setScalar(stone.scale);
        dummy.updateMatrix();
        instanced.setMatrixAt(i, dummy.matrix);
      }

      instanced.instanceMatrix.needsUpdate = true;
      instanced.frustumCulled = false;
      instanced.castShadow = true;
      instanced.receiveShadow = true;
    }
  }, [dummy, sourceMeshes, stones]);

  return (
    <group>
      {sourceMeshes.map((sourceMesh, meshIndex) => (
        <instancedMesh
          key={`sakura-stone-inst-${meshIndex}`}
          ref={(el) => {
            instanceRefs.current[meshIndex] = el;
          }}
          args={[sourceMesh.geometry, sourceMesh.material, stones.length]}
          castShadow
          receiveShadow
        />
      ))}
    </group>
  );
}

function SakuraBridgeModel({ index, isActive }) {
  const { scene } = useGLTF(SAKURA_BRIDGE_PATH);
  const model = useMemo(() => scene.clone(true), [scene]);
  const modelRef = useRef();
  const controls = getChannelControls(index);
  const bridgeModel = controls.sakuraBridgeModel || {
    position: [0, -0.34, -0.9],
    rotation: [0, Math.PI, 0],
    scale: 2.5,
  };

  useEffect(() => {
    model.traverse((child) => {
      if (!child.isMesh) return;
      child.frustumCulled = true;
      const transparent = child.material?.transparent && (child.material?.opacity ?? 1) < 0.95;
      child.castShadow = !transparent;
      child.receiveShadow = !transparent;
    });
  }, [model]);

  useFrame((state) => {
    if (!isActive || !modelRef.current) return;
    modelRef.current.rotation.y =
      bridgeModel.rotation[1] + Math.sin(state.clock.elapsedTime * 0.08) * 0.01;
  });

  return (
    <primitive
      ref={modelRef}
      object={model}
      position={bridgeModel.position}
      rotation={bridgeModel.rotation}
      scale={bridgeModel.scale}
    />
  );
}

function SakuraEnvironment({
  index,
  palette,
  onScreenFocus,
  isTvFocused,
  isActive,
  isNight,
}) {
  const x = getChannelAnchor(index);

  return (
    <group position={[x, 0, 0]}>
      <SceneFogEnvelope palette={palette} isNight={isNight} />
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[8, 48]} />
        <meshStandardMaterial color={palette.ground} roughness={0.95} />
      </mesh>

      <mesh position={[0, -0.16, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[8.2, 9, 56]} />
        <meshBasicMaterial color={palette.accent} transparent opacity={0.25} />
      </mesh>

      <SakuraBridgeModel index={index} isActive={isActive} />

      <pointLight
        position={[0.4, 4.8, -1.2]}
        intensity={isActive ? 1.0 : 0}
        distance={12}
        color={palette.accent}
      />

      <CRTTV
        channel={index}
        onScreenFocus={onScreenFocus}
      />
    </group>
  );
}

function DesertEnvironment({
  index,
  palette,
  onScreenFocus,
  isTvFocused,
  isActive,
  isNight,
}) {
  const heatRippleRef = useRef();
  const x = getChannelAnchor(index);

  useFrame((state) => {
    if (!isActive || !heatRippleRef.current) return;
    const t = state.clock.elapsedTime;
    const s = 0.95 + (Math.sin(t * 1.8) + 1) * 0.08;
    heatRippleRef.current.scale.set(s, 1, s);
    heatRippleRef.current.material.opacity = 0.15 + (Math.sin(t * 2.1) + 1) * 0.08;
  });

  return (
    <group position={[x, 0, 0]}>
      <SceneFogEnvelope palette={palette} isNight={isNight} />
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[8, 40]} />
        <meshStandardMaterial color={palette.ground} roughness={1} />
      </mesh>

      <mesh position={[0, -0.12, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[8.1, 8.9, 48]} />
        <meshBasicMaterial color={palette.accent} transparent opacity={0.2} />
      </mesh>

      <mesh position={[-2.0, 0.78, 0.7]} scale={[1.8, 0.6, 1.2]}>
        <sphereGeometry args={[1.2, 24, 20]} />
        <meshStandardMaterial color={palette.dune} roughness={0.95} />
      </mesh>

      <mesh position={[1.4, 0.55, -0.9]} scale={[1.4, 0.5, 1.1]}>
        <sphereGeometry args={[1.2, 24, 20]} />
        <meshStandardMaterial color={palette.duneShadow} roughness={0.95} />
      </mesh>

      <group position={[-2.5, 0.9, -1.2]}>
        <mesh>
          <cylinderGeometry args={[0.18, 0.23, 1.8, 10]} />
          <meshStandardMaterial color={palette.cactus} roughness={0.9} />
        </mesh>
        <mesh position={[0.35, 0.32, 0]} rotation={[0, 0, Math.PI * 0.33]}>
          <cylinderGeometry args={[0.08, 0.11, 0.8, 8]} />
          <meshStandardMaterial color={palette.cactusDark} roughness={0.9} />
        </mesh>
        <mesh position={[-0.3, 0.2, 0]} rotation={[0, 0, -Math.PI * 0.32]}>
          <cylinderGeometry args={[0.08, 0.11, 0.7, 8]} />
          <meshStandardMaterial color={palette.cactusDark} roughness={0.9} />
        </mesh>
      </group>

      <mesh position={[2.6, 1.1, 1.2]}>
        <dodecahedronGeometry args={[0.7, 0]} />
        <meshStandardMaterial color={palette.rock} roughness={0.92} />
      </mesh>

      <mesh ref={heatRippleRef} position={[0.5, 0.02, -0.4]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.7, 1.35, 32]} />
        <meshBasicMaterial color={palette.accent} transparent opacity={0.18} />
      </mesh>

      <pointLight
        position={[0.5, 3.8, -0.2]}
        intensity={isActive ? 1.0 : 0}
        distance={11}
        color={palette.accent}
      />

      <CRTTV
        channel={index}
        onScreenFocus={onScreenFocus}
      />
    </group>
  );
}

function ArcticEnvironment({
  index,
  palette,
  onScreenFocus,
  isTvFocused,
  isActive,
  isNight,
}) {
  const { scene } = useGLTF(WINTER_SCENE_PATH);
  const model = useMemo(() => scene.clone(true), [scene]);
  const modelRef = useRef();
  const x = getChannelAnchor(index);
  const controls = getChannelControls(index);
  const modelControls = controls.winterModel || {
    position: [0, -0.2, -0.75],
    rotation: [0, 0, 0],
    scale: 2.2,
  };

  useFrame((state) => {
    if (!isActive || !modelRef.current) return;
    modelRef.current.rotation.y =
      modelControls.rotation[1] + Math.sin(state.clock.elapsedTime * 0.15) * 0.025;
  });

  useEffect(() => {
    model.traverse((child) => {
      if (!child.isMesh) return;
      child.frustumCulled = true;
      const transparent = child.material?.transparent && (child.material?.opacity ?? 1) < 0.95;
      child.castShadow = !transparent;
      child.receiveShadow = !transparent;
    });
  }, [model]);

  return (
    <group position={[x, 0, 0]}>
      <SceneFogEnvelope palette={palette} isNight={isNight} />
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[8, 48]} />
        <meshStandardMaterial color={palette.ground} roughness={0.94} />
      </mesh>

      <mesh position={[0, -0.12, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[8.15, 8.9, 48]} />
        <meshBasicMaterial color={palette.accent} transparent opacity={0.2} />
      </mesh>

      <group position={controls.sceneOffset} scale={controls.sceneScale}>
        <primitive
          ref={modelRef}
          object={model}
          position={modelControls.position}
          rotation={modelControls.rotation}
          scale={modelControls.scale}
        />
      </group>

      <pointLight
        position={[0.4, 3.9, -0.8]}
        intensity={isActive ? 0.85 : 0}
        distance={12}
        color={palette.accent}
      />

      <CRTTV
        channel={index}
        onScreenFocus={onScreenFocus}
      />
    </group>
  );
}

function PlaceholderEnvironment({
  index,
  palette,
  onScreenFocus,
  isTvFocused,
  isActive,
  isNight,
}) {
  const spinRef = useRef();
  const x = getChannelAnchor(index);

  useFrame((state) => {
    if (!isActive || !spinRef.current) return;
    spinRef.current.rotation.y = state.clock.elapsedTime * 0.4;
  });

  return (
    <group position={[x, 0, 0]}>
      <SceneFogEnvelope palette={palette} isNight={isNight} />
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[8, 32]} />
        <meshStandardMaterial color={palette.ground} roughness={0.95} />
      </mesh>

      <mesh ref={spinRef} position={[0, 1.1, 0]}>
        <torusKnotGeometry args={[0.8, 0.18, 80, 16]} />
        <meshStandardMaterial color={palette.accent} roughness={0.45} metalness={0.4} />
      </mesh>

      <pointLight
        position={[0, 3.2, 0.5]}
        intensity={isActive ? 0.9 : 0}
        distance={10}
        color={palette.accent}
      />

      <CRTTV
        channel={index}
        onScreenFocus={onScreenFocus}
      />
    </group>
  );
}

function CameraRail({ channel, onSceneReady, focusTarget }) {
  const { camera } = useThree();
  const targetPosition = useRef(new THREE.Vector3());
  const targetLookAt = useRef(new THREE.Vector3());
  const liveLookAt = useRef(new THREE.Vector3());
  const notifiedRef = useRef(false);

  useEffect(() => {
    const clamped = clampChannel(channel);

    if (focusTarget && focusTarget.channel === clamped) {
      targetPosition.current.set(...focusTarget.cameraPosition);
      targetLookAt.current.set(...focusTarget.lookAt);
    } else {
      const anchorX = getChannelAnchor(clamped);
      targetPosition.current.set(
        anchorX,
        SCENE_CONFIG.camera.height,
        SCENE_CONFIG.camera.zOffset
      );
      targetLookAt.current.set(anchorX, SCENE_CONFIG.camera.lookAtHeight, 0);
    }

    notifiedRef.current = false;
  }, [channel, focusTarget]);

  useEffect(() => {
    const initialAnchorX = getChannelAnchor(clampChannel(channel));
    camera.position.set(
      initialAnchorX,
      SCENE_CONFIG.camera.height,
      SCENE_CONFIG.camera.zOffset
    );
    liveLookAt.current.set(initialAnchorX, SCENE_CONFIG.camera.lookAtHeight, 0);
    camera.lookAt(liveLookAt.current);
  }, [camera]);

  useFrame((_, delta) => {
    const t = 1 - Math.exp(-delta * SCENE_CONFIG.camera.moveSpeed);
    camera.position.lerp(targetPosition.current, t);
    liveLookAt.current.lerp(targetLookAt.current, t);
    camera.lookAt(liveLookAt.current);

    if (!notifiedRef.current && camera.position.distanceTo(targetPosition.current) < 0.06) {
      notifiedRef.current = true;
      if (onSceneReady) onSceneReady();
    }
  });

  return null;
}

function DistanceCulling({ environmentRefs }) {
  const { camera } = useThree();
  const samplePointRef = useRef(new THREE.Vector3());

  useFrame(() => {
    for (let i = 0; i < environmentRefs.current.length; i++) {
      const env = environmentRefs.current[i];
      if (!env) continue;

      const anchorX = getChannelAnchor(i);
      samplePointRef.current.set(
        anchorX,
        SCENE_CONFIG.camera.height,
        SCENE_CONFIG.camera.zOffset
      );

      const distance = camera.position.distanceTo(samplePointRef.current);
      env.visible = distance <= SCENE_CONFIG.renderDistance;
    }
  });

  return null;
}

function RendererTuning({ isNight }) {
  const { gl } = useThree();

  useEffect(() => {
    gl.shadowMap.enabled = true;
    gl.shadowMap.type = THREE.PCFSoftShadowMap;
    gl.toneMapping = THREE.ACESFilmicToneMapping;
    gl.toneMappingExposure = isNight ? 0.84 : 1.08;
  }, [gl, isNight]);

  return null;
}

function CinematicLighting({ isNight, theme, anchorX }) {
  const targetRef = useRef();
  const keyRef = useRef();
  const fillRef = useRef();

  useEffect(() => {
    if (!targetRef.current) return;
    if (keyRef.current) {
      keyRef.current.target = targetRef.current;
      keyRef.current.target.updateMatrixWorld();
      keyRef.current.shadow.mapSize.set(1536, 1536);
      keyRef.current.shadow.camera.near = 1;
      keyRef.current.shadow.camera.far = 42;
      keyRef.current.shadow.camera.left = -12;
      keyRef.current.shadow.camera.right = 12;
      keyRef.current.shadow.camera.top = 10;
      keyRef.current.shadow.camera.bottom = -8;
      keyRef.current.shadow.bias = -0.00035;
      keyRef.current.shadow.normalBias = 0.028;
      keyRef.current.shadow.radius = 2;
    }
    if (fillRef.current) {
      fillRef.current.target = targetRef.current;
      fillRef.current.target.updateMatrixWorld();
    }
  }, []);

  useEffect(() => {
    if (!targetRef.current) return;
    targetRef.current.position.set(anchorX, 1.1, 0);
    targetRef.current.updateMatrixWorld();
    if (keyRef.current) keyRef.current.target.updateMatrixWorld();
    if (fillRef.current) fillRef.current.target.updateMatrixWorld();
  }, [anchorX]);

  return (
    <>
      <object3D ref={targetRef} position={[anchorX, 1.1, 0]} />

      <ambientLight
        intensity={isNight ? theme.ambientIntensity * 0.92 : theme.ambientIntensity * 0.72}
        color={isNight ? "#9bb2d6" : "#fff1d7"}
      />
      <hemisphereLight
        color={isNight ? "#9ab4dd" : "#ffeac2"}
        groundColor={theme.hemisphereGround}
        intensity={isNight ? 0.42 : 0.44}
      />

      <directionalLight
        ref={keyRef}
        position={[
          anchorX + (isNight ? -8.2 : 11.2),
          isNight ? 12.2 : 14.8,
          isNight ? 7.1 : 6.4,
        ]}
        intensity={isNight ? theme.directionalIntensity * 0.98 : theme.directionalIntensity * 1.12}
        color={isNight ? "#b8d2ff" : "#ffe2ad"}
        castShadow
      />
      <directionalLight
        ref={fillRef}
        position={[
          anchorX + (isNight ? 6.8 : -8.8),
          isNight ? 6.6 : 8.4,
          isNight ? -5.8 : -6.8,
        ]}
        intensity={isNight ? 0.24 : 0.22}
        color={isNight ? "#86a7ff" : "#b1ffe9"}
      />
    </>
  );
}

function CelestialBodies({ isNight }) {
  const coreColor = isNight ? "#d9e8ff" : "#ffd27e";
  const glowColor = isNight ? "#7ca4ff" : "#ffc157";
  const bodyZ = -5.8;
  const bodyY = 6.9;

  return (
    <>
      {ENVIRONMENT_MODES.map((env, index) => (
        <group key={`celestial-${env.name}`} position={[getChannelAnchor(index), 0, 0]}>
          <mesh position={[0, bodyY, bodyZ]}>
            <sphereGeometry args={[0.82, 28, 20]} />
            <meshBasicMaterial color={coreColor} toneMapped={false} />
          </mesh>
          <mesh position={[0, bodyY, bodyZ]}>
            <sphereGeometry args={[1.45, 28, 20]} />
            <meshBasicMaterial
              color={glowColor}
              transparent
              opacity={isNight ? 0.2 : 0.16}
              depthWrite={false}
              toneMapped={false}
            />
          </mesh>
        </group>
      ))}
    </>
  );
}

function MultiEnvironmentScene({
  channel,
  onSceneReady,
  theme,
  sceneMode,
  currentMode,
  useEnvironmentModes,
  focusedScreen,
  setFocusedScreen,
}) {
  const environmentRefs = useRef([]);
  const isNight = isNightSceneMode({ sceneMode, currentMode, useEnvironmentModes });
  const activeChannel = focusedScreen?.channel ?? channel;
  const activeAnchor = getChannelAnchor(activeChannel);

  const onScreenFocus = (focusData) => {
    setFocusedScreen((prev) => {
      if (prev?.key === focusData.key) return null;
      return focusData;
    });
  };

  return (
    <>
      <RendererTuning isNight={isNight} />

      <fog
        attach="fog"
        args={[theme.fogColor, SCENE_CONFIG.fog.near, SCENE_CONFIG.fog.far]}
      />

      <CinematicLighting isNight={isNight} theme={theme} anchorX={activeAnchor} />

      <CelestialBodies isNight={isNight} />

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[54, -0.4, 0]} receiveShadow>
        <planeGeometry args={[240, 64]} />
        <meshStandardMaterial color={theme.planeColor} roughness={1} />
      </mesh>

      {ENVIRONMENT_MODES.map((env, index) => {
        const isActive = activeChannel === index;
        const palette = getEnvironmentPalette(index, sceneMode, useEnvironmentModes);
        const isTvFocused = focusedScreen?.key === `tv-${index}`;

        return (
          <group
            key={env.name}
            ref={(el) => {
              environmentRefs.current[index] = el;
              if (el && !el.userData.shadowsConfigured) {
                configureShadowMeshes(el);
                el.userData.shadowsConfigured = true;
              }
            }}
          >
            {index === 0 ? (
              <SakuraEnvironment
                index={index}
                palette={palette}
                onScreenFocus={onScreenFocus}
                isTvFocused={isTvFocused}
                isActive={isActive}
                isNight={isNight}
              />
            ) : index === 1 ? (
              <DesertEnvironment
                index={index}
                palette={palette}
                onScreenFocus={onScreenFocus}
                isTvFocused={isTvFocused}
                isActive={isActive}
                isNight={isNight}
              />
            ) : index === 2 ? (
              <ArcticEnvironment
                index={index}
                palette={palette}
                onScreenFocus={onScreenFocus}
                isTvFocused={isTvFocused}
                isActive={isActive}
                isNight={isNight}
              />
            ) : (
              <PlaceholderEnvironment
                index={index}
                palette={palette}
                onScreenFocus={onScreenFocus}
                isTvFocused={isTvFocused}
                isActive={isActive}
                isNight={isNight}
              />
            )}
          </group>
        );
      })}

      <DistanceCulling environmentRefs={environmentRefs} />
      <CameraRail
        channel={channel}
        onSceneReady={onSceneReady}
        focusTarget={focusedScreen}
      />
    </>
  );
}

export function ThreeEnv({
  channel = 0,
  onSceneReady,
  onTvFocusChange,
  currentMode = 0,
  sceneMode = 0,
  useEnvironmentModes = true,
}) {
  const [focusedScreen, setFocusedScreen] = useState(null);

  useEffect(() => {
    setFocusedScreen(null);
  }, [channel]);

  useEffect(() => {
    if (!onTvFocusChange) return;
    onTvFocusChange(Boolean(focusedScreen));
  }, [focusedScreen, onTvFocusChange]);

  const theme = getSceneTheme({
    channel,
    sceneMode,
    currentMode,
    useEnvironmentModes,
  });

  return (
    <Canvas
      id="canvas-id"
      shadows
      dpr={[1, 1.25]}
      gl={{ antialias: false, powerPreference: "high-performance" }}
      onPointerMissed={() => setFocusedScreen(null)}
      camera={{
        position: [0, SCENE_CONFIG.camera.height, SCENE_CONFIG.camera.zOffset],
        fov: SCENE_CONFIG.camera.fov,
        near: SCENE_CONFIG.camera.near,
        far: SCENE_CONFIG.camera.far,
      }}
      style={{
        background: `linear-gradient(to bottom, ${theme.backgroundTop}, ${theme.backgroundBottom})`,
      }}
    >
      <MultiEnvironmentScene
        channel={clampChannel(channel)}
        onSceneReady={onSceneReady}
        theme={theme}
        sceneMode={sceneMode}
        currentMode={currentMode}
        useEnvironmentModes={useEnvironmentModes}
        focusedScreen={focusedScreen}
        setFocusedScreen={setFocusedScreen}
      />
    </Canvas>
  );
}

useGLTF.preload(SAKURA_BRIDGE_PATH);
useGLTF.preload(WINTER_SCENE_PATH);
useGLTF.preload(SOVIET_TV_PATH);
