import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Html, useGLTF } from "@react-three/drei";
import { memo, useEffect, useMemo, useRef, useState, useCallback } from "react";
import PropTypes from "prop-types";
import * as THREE from "three";
import { TV_SCREEN_HTML_HEIGHT, TV_SCREEN_HTML_WIDTH, TVScreenPage } from "./TVScreenPage";
import "./ThreeEnv.css";

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
    near: 6.8,
    far: 20.5,
  },
  wind: {
    sakuraCount: 72,
    desertCount: 180,
    spaceCount: 120,
  },
};

const SAKURA_MODEL_PATH = "/free_low_poly_sakura_tree.glb";
const SAKURA_GRASS_PATH = "/low_poly_grass_pack.glb";
const SAKURA_STONE_PATH = "/stylized_low-poly_stone.glb";
const SAKURA_BRIDGE_PATH = "/japanese_bridge_garden.glb";
const WINTER_SCENE_PATH = "/low_poly_winter_scene.glb";
const DESERT_ROAD_PATH = "/desert_road.glb";
const SPACE_PLANET_PATH = "/space_exploration_wlp_series_8.glb";
const SOVIET_TV_PATH = "/soviet_retro_tv.glb";

const CHANNEL_MODEL_PATHS = {
  0: [SAKURA_BRIDGE_PATH],
  1: [DESERT_ROAD_PATH],
  2: [WINTER_SCENE_PATH],
  3: [SPACE_PLANET_PATH],
};

const DEFAULT_TV_VISUALS = {
  model: {
    position: [0, -0.44, -0.08],
    rotation: [0, Math.PI, 0],
    scale: 0.46,
  },
};

const DEFAULT_TV_SCREEN_CONFIG = {
  position: [0, 0.03, -0.24],
  rotation: [0, Math.PI, 0],
  scale: 1,
  height: 0.44,
  aspectRatio: 0.62 / 0.44,
  curvature: 0.085,
  surfaceOffset: 0.03,
  glassOffset: 0.004,
  segments: [48, 36],
};

const SAKURA_BRIDGE_MATERIAL_OVERRIDES = {
  day: {
    "Material.003": "#ff6f69",
    "Material.008": "#eadfa9",
    "Material.009": "#f3e8bb",
    "Material.016": "#8b5e3a",
    "Material.005": "#8fdff3",
  },
  night: {
    "Material.003": "#e67f79",
    "Material.008": "#7a6f53",
    "Material.009": "#8f8363",
    "Material.016": "#5d3f2d",
    "Material.005": "#4f8496",
  },
};
const ENVIRONMENT_TIME_KEY = "night";

const CHANNEL_CONTROLS = [
  {
    anchorOffsetZ: 0,
    sceneOffset: [0, 0, 0],
    sceneScale: 1,
    lookAtHeight: 1.1,
    sakuraBridgeModel: {
      position: [-0.05, -1.08, 1],
      rotation: [0, Math.PI * 0.5, 0],
      scale: 1,
    },
    tvLayout: {
      position: [0.12, 1.22, 0.2],
      rotation: [0, Math.PI * 0.95, 0],
    },
    tvVisuals: {
      model: { scale: 1.1 },
    },
    screen: {
      scale: 0.56,
      aspectRatio: 0.55 / 0.44,
      curvature: 0.035,
      position: [0, 0.24, 0.19],
      rotation: [Math.PI * -0.01, Math.PI * 2, 0],
      surfaceOffset: 0.03,
      glassOffset: 0.004,
    },
  },
  {
    anchorOffsetZ: 0,
    sceneOffset: [0, 0, 0],
    sceneScale: 1,
    tvLayout: {
      position: [0.75, 1.13, 2.35],
      rotation: [0, Math.PI * 0.95, 0],
    },
    tvVisuals: {
      model: { scale: 1.65 },
    },
    screen: {
      scale: 0.56,
      aspectRatio: 0.55 / 0.44,
      curvature: 0.035,
      position: [0, 0.24, 0.19],
      rotation: [Math.PI * -0.01, Math.PI * 2, 0],
      surfaceOffset: 0.03,
      glassOffset: 0.004,
    },
  },
  {
    anchorOffsetZ: 0,
    sceneOffset: [0, 0, 0],
    sceneScale: 1,
    winterModel: {
      position: [0.15, -0.25, -0.75],
      rotation: [0, Math.PI * 0.08, 0],
      scale: 2.3,
    },
    tvLayout: {
      position: [0.75, 0.42, 2.35],
      rotation: [0, Math.PI * 0.95, 0],
    },
    tvVisuals: {
      model: { scale: 1.65 },
    },
    screen: {
      scale: 0.56,
      aspectRatio: 0.55 / 0.44,
      curvature: 0.035,
      position: [0, 0.24, 0.19],
      rotation: [Math.PI * -0.01, Math.PI * 2, 0],
      surfaceOffset: 0.03,
      glassOffset: 0.004,
    },
  },
  {
    anchorOffsetZ: 0,
    sceneOffset: [0, 0, 0],
    sceneScale: 1,
    lookAtHeight: 1.4,
    spacePlanetModel: {
      position: [2, 3, -14],
      rotation: [0.15, 0.4, -0.1],
      scale: 0.5,
    },
    tvLayout: {
      position: [0.9, 1.5, 1.2],
      rotation: [0, Math.PI * 0.95, 0],
    },
    tvVisuals: {
      model: { scale: 1.4 },
    },
    screen: {
      scale: 0.56,
      aspectRatio: 0.55 / 0.44,
      curvature: 0.035,
      position: [0, 0.24, 0.19],
      rotation: [Math.PI * -0.01, Math.PI * 2, 0],
      surfaceOffset: 0.03,
      glassOffset: 0.004,
    },
  },
];

function createCurvedScreenGeometry(width, height, curvature = 0.085, segmentsX = 48, segmentsY = 36) {
  const geometry = new THREE.PlaneGeometry(width, height, segmentsX, segmentsY);
  const position = geometry.attributes.position;
  const bulgeDepth = Math.min(width, height) * curvature;

  for (let index = 0; index < position.count; index += 1) {
    const x = position.getX(index);
    const y = position.getY(index);
    const nx = x / (width * 0.5);
    const ny = y / (height * 0.5);
    const influence = Math.max(0, 1 - nx * nx) * Math.max(0, 1 - ny * ny);

    position.setZ(index, influence * bulgeDepth);
  }

  position.needsUpdate = true;
  geometry.computeVertexNormals();

  return geometry;
}

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
        backgroundTop: "#b7ecef",
        backgroundBottom: "#c9f4f2",
        fogColor: "#bce7e5",
        planeColor: "#ecdca7",
        hemisphereGround: "#c79b6b",
        ambientIntensity: 0.5,
        directionalIntensity: 0.98,
      },
      palette: {
        ground: "#eadca5",
        accent: "#ff6f69",
        prop: "#f3d47a",
        trunk: "#8a6847",
        blossom: "#ff766f",
        blossomInner: "#ffd2bf",
        benchWood: "#bf6d57",
        benchMetal: "#5a5552",
        water: "#8fdff3",
        waterGlow: "#c7f7ff",
        stone: "#ead8b5",
        fogTint: "#bce7e5",
      },
    },
    night: {
      scene: {
        backgroundTop: "#1d2b36",
        backgroundBottom: "#16222c",
        fogColor: "#22313d",
        planeColor: "#3b3a35",
        hemisphereGround: "#2c2420",
        ambientIntensity: 0.34,
        directionalIntensity: 0.78,
      },
      palette: {
        ground: "#4d473f",
        accent: "#f08b7f",
        prop: "#e2cb8a",
        trunk: "#5f4734",
        blossom: "#e87474",
        blossomInner: "#f8c4bf",
        benchWood: "#7c5846",
        benchMetal: "#9f9890",
        water: "#4d8ea5",
        waterGlow: "#8fc8d6",
        stone: "#7a6f61",
        fogTint: "#253745",
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
    name: "SPACE",
    day: {
      scene: {
        backgroundTop: "#050510",
        backgroundBottom: "#020208",
        fogColor: "#08081a",
        planeColor: "#060612",
        hemisphereGround: "#0a0a1e",
        ambientIntensity: 0.22,
        directionalIntensity: 0.55,
      },
      palette: {
        ground: "#050510",
        accent: "#6eb4ff",
        prop: "#b48eff",
        starField: "#ffffff",
        nebula: "#2a1a4e",
        fogTint: "#08081a",
      },
    },
    night: {
      scene: {
        backgroundTop: "#030308",
        backgroundBottom: "#010104",
        fogColor: "#060612",
        planeColor: "#040410",
        hemisphereGround: "#080818",
        ambientIntensity: 0.18,
        directionalIntensity: 0.45,
      },
      palette: {
        ground: "#030308",
        accent: "#8ecaff",
        prop: "#c4a0ff",
        starField: "#e8e8ff",
        nebula: "#1e1040",
        fogTint: "#060612",
      },
    },
  },
];

const AMBIENT_AUDIO_PROFILES = [
  {
    day: {
      primaryType: "triangle",
      secondaryType: "sine",
      subType: "sine",
      baseHz: 220,
      harmonyRatio: 1.4983,
      subRatio: 0.5,
      primaryGain: 0.13,
      secondaryGain: 0.09,
      subGain: 0.06,
      noiseGain: 0.009,
      filterHz: 1550,
      filterQ: 1.05,
      lfoRate: 0.12,
      lfoDepth: 260,
      vibratoRate: 5.2,
      vibratoDepth: 8,
      panRate: 0.05,
      panDepth: 0.22,
      delayTime: 0.22,
      feedbackGain: 0.31,
      wetGain: 0.2,
      masterGain: 0.024,
      stepMs: 420,
      arpRatios: [1, 1.12246, 1.25992, 1.4983, 1.33484, 1.25992],
    },
    night: {
      primaryType: "triangle",
      secondaryType: "sine",
      subType: "sine",
      baseHz: 196,
      harmonyRatio: 1.4983,
      subRatio: 0.5,
      primaryGain: 0.14,
      secondaryGain: 0.1,
      subGain: 0.065,
      noiseGain: 0.012,
      filterHz: 1320,
      filterQ: 1.2,
      lfoRate: 0.11,
      lfoDepth: 220,
      vibratoRate: 4.9,
      vibratoDepth: 8.6,
      panRate: 0.045,
      panDepth: 0.24,
      delayTime: 0.24,
      feedbackGain: 0.34,
      wetGain: 0.24,
      masterGain: 0.026,
      stepMs: 430,
      arpRatios: [1, 1.12246, 1.25992, 1.4983, 1.33484, 1.25992],
    },
  },
  {
    day: {
      primaryType: "sawtooth",
      secondaryType: "sawtooth",
      subType: "sine",
      baseHz: 130.81,
      harmonyRatio: 1.33484,
      subRatio: 0.5,
      primaryGain: 0.11,
      secondaryGain: 0.09,
      subGain: 0.055,
      noiseGain: 0.024,
      filterHz: 1180,
      filterQ: 0.82,
      lfoRate: 0.08,
      lfoDepth: 170,
      vibratoRate: 3.9,
      vibratoDepth: 6.5,
      panRate: 0.03,
      panDepth: 0.18,
      delayTime: 0.17,
      feedbackGain: 0.22,
      wetGain: 0.14,
      masterGain: 0.022,
      stepMs: 350,
      arpRatios: [1, 1.12246, 1.33484, 1.5874, 1.33484, 1.1892],
    },
    night: {
      primaryType: "sawtooth",
      secondaryType: "sine",
      subType: "sine",
      baseHz: 110,
      harmonyRatio: 1.33484,
      subRatio: 0.5,
      primaryGain: 0.12,
      secondaryGain: 0.09,
      subGain: 0.06,
      noiseGain: 0.03,
      filterHz: 920,
      filterQ: 0.95,
      lfoRate: 0.074,
      lfoDepth: 145,
      vibratoRate: 3.5,
      vibratoDepth: 5.8,
      panRate: 0.026,
      panDepth: 0.16,
      delayTime: 0.19,
      feedbackGain: 0.24,
      wetGain: 0.17,
      masterGain: 0.024,
      stepMs: 360,
      arpRatios: [1, 1.12246, 1.33484, 1.5874, 1.33484, 1.1892],
    },
  },
  {
    day: {
      primaryType: "sine",
      secondaryType: "triangle",
      subType: "sine",
      baseHz: 174.61,
      harmonyRatio: 1.4983,
      subRatio: 0.5,
      primaryGain: 0.1,
      secondaryGain: 0.08,
      subGain: 0.05,
      noiseGain: 0.008,
      filterHz: 1800,
      filterQ: 0.62,
      lfoRate: 0.065,
      lfoDepth: 300,
      vibratoRate: 5.8,
      vibratoDepth: 7,
      panRate: 0.03,
      panDepth: 0.12,
      delayTime: 0.26,
      feedbackGain: 0.33,
      wetGain: 0.19,
      masterGain: 0.021,
      stepMs: 500,
      arpRatios: [1, 1.25992, 1.4983, 2, 1.4983, 1.25992],
    },
    night: {
      primaryType: "sine",
      secondaryType: "triangle",
      subType: "sine",
      baseHz: 146.83,
      harmonyRatio: 1.4983,
      subRatio: 0.5,
      primaryGain: 0.11,
      secondaryGain: 0.085,
      subGain: 0.055,
      noiseGain: 0.01,
      filterHz: 1420,
      filterQ: 0.74,
      lfoRate: 0.055,
      lfoDepth: 250,
      vibratoRate: 5.4,
      vibratoDepth: 7.8,
      panRate: 0.028,
      panDepth: 0.14,
      delayTime: 0.28,
      feedbackGain: 0.36,
      wetGain: 0.21,
      masterGain: 0.022,
      stepMs: 520,
      arpRatios: [1, 1.25992, 1.4983, 2, 1.4983, 1.25992],
    },
  },
  {
    day: {
      primaryType: "sine",
      secondaryType: "sine",
      subType: "sine",
      baseHz: 82.41,
      harmonyRatio: 1.5,
      subRatio: 0.5,
      primaryGain: 0.08,
      secondaryGain: 0.06,
      subGain: 0.07,
      noiseGain: 0.006,
      filterHz: 900,
      filterQ: 0.45,
      lfoRate: 0.03,
      lfoDepth: 120,
      vibratoRate: 2.2,
      vibratoDepth: 4,
      panRate: 0.018,
      panDepth: 0.35,
      delayTime: 0.42,
      feedbackGain: 0.48,
      wetGain: 0.32,
      masterGain: 0.02,
      stepMs: 800,
      arpRatios: [1, 1.4983, 2, 2.9966, 2, 1.4983],
    },
    night: {
      primaryType: "sine",
      secondaryType: "sine",
      subType: "sine",
      baseHz: 65.41,
      harmonyRatio: 1.5,
      subRatio: 0.5,
      primaryGain: 0.09,
      secondaryGain: 0.065,
      subGain: 0.075,
      noiseGain: 0.007,
      filterHz: 750,
      filterQ: 0.5,
      lfoRate: 0.025,
      lfoDepth: 100,
      vibratoRate: 1.8,
      vibratoDepth: 3.5,
      panRate: 0.015,
      panDepth: 0.4,
      delayTime: 0.48,
      feedbackGain: 0.52,
      wetGain: 0.36,
      masterGain: 0.022,
      stepMs: 900,
      arpRatios: [1, 1.4983, 2, 2.9966, 2, 1.4983],
    },
  },
];

const WIND_OVERLAY_PROFILES = [
  {
    id: "sakura",
    count: 28,
    duration: [11.2, 19.8],
    size: [6, 15],
    driftY: [-35, 45],
    speedVariation: 0.35,
    oscillationAmount: 0.78,
    oscillationFreq: 0.42,
    glowIntensity: 0.72,
    day: {
      base: "rgba(255, 132, 171, 0.88)",
      accent: "rgba(255, 214, 231, 0.92)",
      edge: "rgba(255, 166, 198, 0.14)",
    },
    night: {
      base: "rgba(241, 155, 182, 0.85)",
      accent: "rgba(255, 214, 235, 0.88)",
      edge: "rgba(185, 128, 166, 0.18)",
    },
  },
  {
    id: "desert",
    count: 32,
    duration: [7.8, 14.2],
    size: [8, 18],
    driftY: [-15, 28],
    speedVariation: 0.52,
    oscillationAmount: 0.45,
    oscillationFreq: 0.68,
    glowIntensity: 0.38,
    day: {
      base: "rgba(229, 187, 124, 0.8)",
      accent: "rgba(255, 228, 184, 0.72)",
      edge: "rgba(245, 201, 150, 0.12)",
    },
    night: {
      base: "rgba(197, 150, 100, 0.78)",
      accent: "rgba(228, 193, 149, 0.68)",
      edge: "rgba(129, 91, 64, 0.2)",
    },
  },
  {
    id: "arctic",
    count: 35,
    duration: [12.5, 20.8],
    size: [3, 8],
    driftY: [-68, 68],
    speedVariation: 0.28,
    oscillationAmount: 1.05,
    oscillationFreq: 0.35,
    glowIntensity: 0.62,
    day: {
      base: "rgba(230, 245, 255, 0.84)",
      accent: "rgba(182, 225, 245, 0.76)",
      edge: "rgba(192, 229, 247, 0.16)",
    },
    night: {
      base: "rgba(205, 230, 245, 0.8)",
      accent: "rgba(138, 188, 222, 0.74)",
      edge: "rgba(94, 134, 164, 0.2)",
    },
  },
  {
    id: "space",
    count: 22,
    duration: [14, 26],
    size: [2, 6],
    driftY: [-18, 18],
    speedVariation: 0.2,
    oscillationAmount: 0.35,
    oscillationFreq: 0.18,
    glowIntensity: 0.95,
    day: {
      base: "rgba(180, 210, 255, 0.7)",
      accent: "rgba(140, 180, 255, 0.65)",
      edge: "rgba(60, 80, 140, 0.08)",
    },
    night: {
      base: "rgba(200, 220, 255, 0.75)",
      accent: "rgba(160, 190, 255, 0.7)",
      edge: "rgba(50, 60, 120, 0.1)",
    },
  },
];

function seededRandom(seed) {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

function getWindParticleSize(profileId, baseSize) {
  // Sakura: Soft, organic petal shapes
  if (profileId === "sakura") return { width: baseSize * 0.85, height: baseSize * 0.72, blur: 2.2 };
  // Desert: Stretched sand/dust particles with slight blur
  if (profileId === "desert") return { width: baseSize * 1.9, height: baseSize * 0.28, blur: 3.8 };
  // Arctic: Small crystalline snowflakes, almost square
  if (profileId === "arctic") return { width: baseSize * 0.68, height: baseSize * 0.64, blur: 1.5 };
  // Space: Small round star-dust particles with soft glow
  return { width: baseSize * 0.7, height: baseSize * 0.65, blur: 1.8 };
}

function WindOverlay({ channel, isNight, enabled }) {
  if (!enabled) return null;

  const profile =
    WIND_OVERLAY_PROFILES[clampChannel(channel)] || WIND_OVERLAY_PROFILES[0];
  const tone = isNight ? profile.night : profile.day;
  const seedOffset = isNight ? 1000 : 100;

  const particles = useMemo(
    () =>
      Array.from({ length: profile.count }, (_, index) => {
        const seed = seedOffset + channel * 97 + index * 53;
        const top = seededRandom(seed + 1) * 100;
        const baseDuration =
          profile.duration[0] +
          seededRandom(seed + 2) * (profile.duration[1] - profile.duration[0]);
        // Speed variation creates realistic wind gusts
        const speedMult = 1 - profile.speedVariation * (seededRandom(seed + 20) - 0.5) * 2;
        const duration = baseDuration / speedMult;
        const delay = -seededRandom(seed + 3) * duration;
        const driftRange = profile.driftY[1] - profile.driftY[0];
        const driftY = profile.driftY[0] + seededRandom(seed + 4) * driftRange;
        const baseSize =
          profile.size[0] +
          seededRandom(seed + 5) * (profile.size[1] - profile.size[0]);
        const { width, height, blur } = getWindParticleSize(profile.id, baseSize);
        const reverse = seededRandom(seed + 6) > 0.62;
        const opacity = 0.32 + seededRandom(seed + 7) * 0.56;
        const rotate = (seededRandom(seed + 8) - 0.5) * 280;
        
        // Oscillation creates wave-like motion
        const oscillationAmount = profile.oscillationAmount * baseSize;
        const oscillationPhase = seededRandom(seed + 21) * Math.PI * 2;
        
        // Glow effect adds artistic depth
        const glowAmount = profile.glowIntensity * (0.4 + seededRandom(seed + 22) * 0.6);

        return {
          key: `wind-${profile.id}-${index}`,
          top,
          duration,
          delay,
          driftY,
          width,
          height,
          blur,
          reverse,
          opacity,
          rotate,
          oscillationAmount,
          oscillationPhase,
          oscillationFreq: profile.oscillationFreq,
          glowAmount,
        };
      }),
    [channel, profile, seedOffset]
  );

  return (
    <div
      className={`wind-overlay wind-overlay-${profile.id} ${
        isNight ? "wind-overlay-night" : "wind-overlay-day"
      }`}
      style={{
        "--wind-base": tone.base,
        "--wind-accent": tone.accent,
        "--wind-edge": tone.edge,
      }}
      aria-hidden="true"
    >
      <div className="wind-overlay-vignette" />
      {particles.map((particle) => (
        <span
          key={particle.key}
          className={`wind-overlay-particle ${
            particle.reverse ? "wind-overlay-reverse" : "wind-overlay-forward"
          }`}
          style={{
            top: `${particle.top}%`,
            left: particle.reverse ? "118vw" : "-22vw",
            width: `${particle.width}px`,
            height: `${particle.height}px`,
            "--wind-duration": `${particle.duration}s`,
            "--wind-delay": `${particle.delay}s`,
            "--wind-drift-y": `${particle.driftY}px`,
            "--wind-opacity": particle.opacity,
            "--wind-rotate": `${particle.rotate}deg`,
            "--wind-blur": `${particle.blur}px`,
            "--wind-glow": particle.glowAmount,
            "--wind-oscillation": `${particle.oscillationAmount}px`,
            "--wind-oscillation-freq": particle.oscillationFreq,
            "--wind-oscillation-phase": `${particle.oscillationPhase}rad`,
          }}
        />
      ))}
    </div>
  );
}

function createNoiseBuffer(context) {
  const length = context.sampleRate * 2;
  const buffer = context.createBuffer(1, length, context.sampleRate);
  const data = buffer.getChannelData(0);
  let previous = 0;

  for (let i = 0; i < length; i++) {
    const white = Math.random() * 2 - 1;
    previous = previous * 0.96 + white * 0.04;
    data[i] = previous;
  }

  return buffer;
}

function useSceneAmbientAudio({ channel, isNight, muted }) {
  const rigRef = useRef(null);
  const sequencerRef = useRef(null);
  const stepRef = useRef(0);

  useEffect(() => {
    return () => {
      if (sequencerRef.current) {
        window.clearInterval(sequencerRef.current);
        sequencerRef.current = null;
      }

      const rig = rigRef.current;
      if (!rig) return;

      const now = rig.context.currentTime;
      rig.masterGain.gain.cancelScheduledValues(now);
      rig.masterGain.gain.linearRampToValueAtTime(0, now + 0.15);

      window.setTimeout(() => {
        try {
          rig.primary.stop();
          rig.secondary.stop();
          rig.sub.stop();
          rig.noiseSource.stop();
          rig.filterLfo.stop();
          rig.vibratoLfo.stop();
          rig.panLfo.stop();
        } catch {
          // Audio nodes can only be stopped once.
        }
        rig.context.close().catch(() => {});
      }, 220);

      rigRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return undefined;

    const AudioContextCtor = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextCtor) return undefined;

    if (!rigRef.current) {
      const context = new AudioContextCtor();
      const masterGain = context.createGain();
      const mixGain = context.createGain();
      const filter = context.createBiquadFilter();
      const compressor = context.createDynamicsCompressor();
      const delay = context.createDelay(1.5);
      const feedbackGain = context.createGain();
      const dryGain = context.createGain();
      const wetGain = context.createGain();
      const panner = context.createStereoPanner();

      const primary = context.createOscillator();
      const secondary = context.createOscillator();
      const sub = context.createOscillator();
      const primaryGain = context.createGain();
      const secondaryGain = context.createGain();
      const subGain = context.createGain();

      const noiseSource = context.createBufferSource();
      const noiseFilter = context.createBiquadFilter();
      const noiseGain = context.createGain();

      const filterLfo = context.createOscillator();
      const filterLfoGain = context.createGain();
      const vibratoLfo = context.createOscillator();
      const vibratoGain = context.createGain();
      const panLfo = context.createOscillator();
      const panGain = context.createGain();

      masterGain.gain.value = 0;
      mixGain.gain.value = 1;
      filter.type = "lowpass";
      filter.frequency.value = 1200;
      filter.Q.value = 0.9;

      compressor.threshold.value = -22;
      compressor.knee.value = 24;
      compressor.ratio.value = 3.4;
      compressor.attack.value = 0.01;
      compressor.release.value = 0.22;

      delay.delayTime.value = 0.2;
      feedbackGain.gain.value = 0.28;
      dryGain.gain.value = 0.79;
      wetGain.gain.value = 0.2;

      primaryGain.gain.value = 0.1;
      secondaryGain.gain.value = 0.08;
      subGain.gain.value = 0.06;

      noiseSource.buffer = createNoiseBuffer(context);
      noiseSource.loop = true;
      noiseFilter.type = "highpass";
      noiseFilter.frequency.value = 1200;
      noiseFilter.Q.value = 0.6;
      noiseGain.gain.value = 0.01;

      filterLfo.type = "sine";
      filterLfo.frequency.value = 0.1;
      filterLfoGain.gain.value = 180;

      vibratoLfo.type = "sine";
      vibratoLfo.frequency.value = 5;
      vibratoGain.gain.value = 6;

      panLfo.type = "triangle";
      panLfo.frequency.value = 0.04;
      panGain.gain.value = 0.2;

      primary.connect(primaryGain);
      secondary.connect(secondaryGain);
      sub.connect(subGain);
      primaryGain.connect(mixGain);
      secondaryGain.connect(mixGain);
      subGain.connect(mixGain);

      noiseSource.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(mixGain);

      mixGain.connect(filter);
      filter.connect(compressor);

      compressor.connect(dryGain);
      dryGain.connect(panner);

      compressor.connect(delay);
      delay.connect(feedbackGain);
      feedbackGain.connect(delay);
      delay.connect(wetGain);
      wetGain.connect(panner);

      panner.connect(masterGain);
      masterGain.connect(context.destination);

      filterLfo.connect(filterLfoGain);
      filterLfoGain.connect(filter.frequency);

      vibratoLfo.connect(vibratoGain);
      vibratoGain.connect(primary.detune);
      vibratoGain.connect(secondary.detune);

      panLfo.connect(panGain);
      panGain.connect(panner.pan);

      primary.start();
      secondary.start();
      sub.start();
      noiseSource.start();
      filterLfo.start();
      vibratoLfo.start();
      panLfo.start();

      rigRef.current = {
        context,
        masterGain,
        filter,
        delay,
        feedbackGain,
        wetGain,
        dryGain,
        panner,
        primary,
        secondary,
        sub,
        noiseSource,
        noiseFilter,
        primaryGain,
        secondaryGain,
        subGain,
        noiseGain,
        filterLfo,
        filterLfoGain,
        vibratoLfo,
        vibratoGain,
        panLfo,
        panGain,
      };
    }

    const rig = rigRef.current;
    if (!rig) return undefined;

    const modeKey = isNight ? "night" : "day";
    const profileByChannel =
      AMBIENT_AUDIO_PROFILES[clampChannel(channel)] || AMBIENT_AUDIO_PROFILES[0];
    const profile = profileByChannel[modeKey] || profileByChannel.day;
    const now = rig.context.currentTime;

    const setParam = (audioParam, value, ramp = 0.3) => {
      audioParam.cancelScheduledValues(now);
      audioParam.linearRampToValueAtTime(value, now + ramp);
    };

    rig.primary.type = profile.primaryType;
    rig.secondary.type = profile.secondaryType;
    rig.sub.type = profile.subType;

    setParam(rig.filter.frequency, profile.filterHz, 0.4);
    setParam(rig.filter.Q, profile.filterQ, 0.4);
    setParam(rig.delay.delayTime, profile.delayTime, 0.35);
    setParam(rig.feedbackGain.gain, profile.feedbackGain, 0.35);
    setParam(rig.wetGain.gain, profile.wetGain, 0.35);
    setParam(rig.dryGain.gain, 1 - profile.wetGain * 0.55, 0.35);

    setParam(rig.filterLfo.frequency, profile.lfoRate, 0.35);
    setParam(rig.filterLfoGain.gain, profile.lfoDepth, 0.35);
    setParam(rig.vibratoLfo.frequency, profile.vibratoRate, 0.35);
    setParam(rig.vibratoGain.gain, profile.vibratoDepth, 0.35);
    setParam(rig.panLfo.frequency, profile.panRate, 0.35);
    setParam(rig.panGain.gain, profile.panDepth, 0.35);
    setParam(rig.noiseGain.gain, profile.noiseGain, 0.25);
    setParam(rig.masterGain.gain, muted ? 0 : profile.masterGain, 0.35);

    if (sequencerRef.current) {
      window.clearInterval(sequencerRef.current);
      sequencerRef.current = null;
    }

    const ratios = profile.arpRatios && profile.arpRatios.length > 0
      ? profile.arpRatios
      : [1];
    stepRef.current = clampChannel(channel) % ratios.length;

    const playStep = () => {
      const step = stepRef.current++;
      const ratio = ratios[step % ratios.length];
      const base = profile.baseHz * ratio;
      const t = rig.context.currentTime;
      const accent = step % 4 === 0 ? 1.16 : step % 2 === 0 ? 1.04 : 0.96;

      rig.primary.frequency.cancelScheduledValues(t);
      rig.primary.frequency.linearRampToValueAtTime(base, t + 0.08);

      rig.secondary.frequency.cancelScheduledValues(t);
      rig.secondary.frequency.linearRampToValueAtTime(
        base * profile.harmonyRatio,
        t + 0.09
      );

      rig.sub.frequency.cancelScheduledValues(t);
      rig.sub.frequency.linearRampToValueAtTime(
        Math.max(40, base * profile.subRatio),
        t + 0.1
      );

      rig.primaryGain.gain.cancelScheduledValues(t);
      rig.primaryGain.gain.linearRampToValueAtTime(
        profile.primaryGain * accent,
        t + 0.06
      );

      rig.secondaryGain.gain.cancelScheduledValues(t);
      rig.secondaryGain.gain.linearRampToValueAtTime(
        profile.secondaryGain * (step % 3 === 0 ? 1.07 : 0.95),
        t + 0.06
      );

      rig.subGain.gain.cancelScheduledValues(t);
      rig.subGain.gain.linearRampToValueAtTime(
        profile.subGain * (step % 2 === 0 ? 1.02 : 0.92),
        t + 0.07
      );

      rig.noiseGain.gain.cancelScheduledValues(t);
      rig.noiseGain.gain.linearRampToValueAtTime(
        profile.noiseGain * (step % 2 === 0 ? 1.2 : 0.82),
        t + 0.06
      );
    };

    playStep();
    sequencerRef.current = window.setInterval(
      playStep,
      Math.max(120, profile.stepMs || 420)
    );

    if (muted) {
      if (rig.context.state === "running") {
        rig.context.suspend().catch(() => {});
      }
    } else if (rig.context.state !== "running") {
      rig.context.resume().catch(() => {});
    }

    return () => {
      if (sequencerRef.current) {
        window.clearInterval(sequencerRef.current);
        sequencerRef.current = null;
      }
    };
  }, [channel, isNight, muted]);
}

function clampChannel(channel) {
  return Math.max(0, Math.min(channel, ENVIRONMENT_MODES.length - 1));
}

function getChannelControls(index) {
  return CHANNEL_CONTROLS[clampChannel(index)] || CHANNEL_CONTROLS[0];
}

function getChannelTVConfig(index) {
  const controls = getChannelControls(index);
  const screenOverrides = controls.screen || {};
  const scale = Number.isFinite(screenOverrides.scale)
    ? screenOverrides.scale
    : DEFAULT_TV_SCREEN_CONFIG.scale;
  const height = Number.isFinite(screenOverrides.height)
    ? screenOverrides.height
    : DEFAULT_TV_SCREEN_CONFIG.height;
  const aspectRatio = Number.isFinite(screenOverrides.aspectRatio)
    ? screenOverrides.aspectRatio
    : DEFAULT_TV_SCREEN_CONFIG.aspectRatio;

  return {
    layout: controls.tvLayout,
    model: {
      ...DEFAULT_TV_VISUALS.model,
      ...(controls.tvVisuals?.model || {}),
    },
    screen: {
      ...DEFAULT_TV_SCREEN_CONFIG,
      ...screenOverrides,
      position: screenOverrides.position || DEFAULT_TV_SCREEN_CONFIG.position,
      rotation: screenOverrides.rotation || DEFAULT_TV_SCREEN_CONFIG.rotation,
      segments: screenOverrides.segments || DEFAULT_TV_SCREEN_CONFIG.segments,
      size: [height * aspectRatio * scale, height * scale],
    },
  };
}

function getChannelAnchor(channel) {
  const controls = getChannelControls(channel);
  return -channel * SCENE_CONFIG.environmentSpacing + (controls.anchorOffsetZ || 0);
}

function getChannelLookAtHeight(channel) {
  const controls = getChannelControls(channel);
  return controls.lookAtHeight !== undefined ? controls.lookAtHeight : SCENE_CONFIG.camera.lookAtHeight;
}

function getSceneTheme({ channel, currentMode, useEnvironmentModes }) {
  if (!useEnvironmentModes) {
    return currentMode === 1 ? UI_THEMES.dark : UI_THEMES.light;
  }

  const env = ENVIRONMENT_MODES[clampChannel(channel)];
  return env[ENVIRONMENT_TIME_KEY].scene;
}

function getEnvironmentPalette(index, useEnvironmentModes) {
  const env = ENVIRONMENT_MODES[index];
  if (!useEnvironmentModes) return env.day.palette;
  return env[ENVIRONMENT_TIME_KEY].palette;
}

function isNightSceneMode({ currentMode, useEnvironmentModes }) {
  if (!useEnvironmentModes) return currentMode === 1;
  return true;
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

function SceneFogEnvelope({ palette, isNight, isFocused, channel }) {
  const shellRef = useRef();
  const ringRef = useRef();
  const fogColor = useMemo(() => {
    const base = new THREE.Color(palette.fogTint || palette.ground || "#8aa0b5");
    const accent = new THREE.Color(palette.accent || "#a9c3d8");
    return base.lerp(accent, isNight ? 0.18 : 0.12).getHexString();
  }, [palette.accent, palette.fogTint, palette.ground, isNight]);

  useFrame((_, delta) => {
    const t = 1 - Math.exp(-delta * 4.2);
    const focusBoost = (channel === 0 || channel === 1) ? 2.05 : 1.4;
    const shellBase = isNight ? 0.16 : 0.11;
    const ringBase = isNight ? 0.09 : 0.06;

    const shellTarget = shellBase * (isFocused ? focusBoost : 1);
    const ringTarget = ringBase * (isFocused ? focusBoost : 1);

    if (shellRef.current) {
      shellRef.current.opacity += (shellTarget - shellRef.current.opacity) * t;
    }
    if (ringRef.current) {
      ringRef.current.opacity += (ringTarget - ringRef.current.opacity) * t;
    }
  });

  return (
    <group>
      <mesh position={[0, 2.05, -1.15]}>
        <cylinderGeometry args={[10.6, 9.8, 5.2, 56, 1, true]} />
        <meshBasicMaterial
          ref={shellRef}
          color={`#${fogColor}`}
          transparent
          opacity={isNight ? 0.16 : 0.11}
          side={THREE.BackSide}
          depthWrite={false}
        />
      </mesh>
      <mesh position={[0, 0.06, -0.95]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[8.8, 10.5, 56]} />
        <meshBasicMaterial
          ref={ringRef}
          color={`#${fogColor}`}
          transparent
          opacity={isNight ? 0.09 : 0.06}
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
  const z = getChannelAnchor(index);
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
      const px = positions[idx] * 0.78 - t * speeds[i] + phases[i];
      const dy = Math.sin(px * 1.17) * ampY[i] + Math.sin(px * 0.4) * ampY[i] * 0.35;
      const dz = Math.cos(px * 0.93) * ampZ[i] + Math.sin(px * 0.51) * ampZ[i] * 0.28;
      const targetY = laneY[lane] + dy;
      const targetZ = laneZ[lane] + dz;
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
    <group position={[0, 0, z]}>
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
  const z = getChannelAnchor(index);
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
      const flowSpeed = speeds[i] * 1.2;
      const px = positions[idx] * 0.78 - t * flowSpeed + phases[i];
      const dy = Math.sin(px * 1.17) * ampY[i] + Math.sin(px * 0.4) * ampY[i] * 0.35;
      const dz = Math.cos(px * 0.93) * ampZ[i] + Math.sin(px * 0.51) * ampZ[i] * 0.28;
      const targetY = laneY[lane] + dy;
      const targetZ = laneZ[lane] + dz;
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
    <group position={[0, 0, z]}>
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
  const z = getChannelAnchor(index);
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

      const flowSpeed = data.speed * 0.8;
      const px = data.x * 0.78 - t * flowSpeed + data.phase;
      const dy = Math.sin(px * 1.17) * 0.18 + Math.sin(px * 0.4) * 0.18 * 0.35;
      const dz = Math.cos(px * 0.93) * 0.22 + Math.sin(px * 0.51) * 0.22 * 0.28;
      mesh.position.set(
        data.x,
        data.y + dy,
        data.z + dz
      );
      mesh.rotation.z = Math.sin(t * 1.1 + data.phase) * 0.2;
    }
  });

  return (
    <group position={[0, 0, z]}>
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

function CRTTV({
  channel,
  onScreenFocus,
  tvConfig,
  focused = false,
}) {
  const screenRef = useRef();
  const { scene } = useGLTF(SOVIET_TV_PATH);
  const tvModel = useMemo(() => scene.clone(true), [scene]);
  const layout = tvConfig.layout;
  const modelConfig = tvConfig.model;
  const screenConfig = tvConfig.screen;
  const screenGeometry = useMemo(
    () =>
      createCurvedScreenGeometry(
        screenConfig.size[0],
        screenConfig.size[1],
        screenConfig.curvature,
        screenConfig.segments[0],
        screenConfig.segments[1]
      ),
    [
      screenConfig.size[0],
      screenConfig.size[1],
      screenConfig.curvature,
      screenConfig.segments[0],
      screenConfig.segments[1],
    ]
  );
  const htmlScale = useMemo(
    () =>
      Math.min(
        screenConfig.size[0] / TV_SCREEN_HTML_WIDTH,
        screenConfig.size[1] / TV_SCREEN_HTML_HEIGHT
      ),
    [screenConfig.size[0], screenConfig.size[1]]
  );

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

  useEffect(() => {
    return () => {
      screenGeometry.dispose();
    };
  }, [screenGeometry]);

  function handleScreenClick(event) {
    event.stopPropagation();
    if (!screenRef.current || !onScreenFocus) return;

    const screenPosition = new THREE.Vector3();
    const screenQuaternion = new THREE.Quaternion();
    const normal = new THREE.Vector3(0, 0, 1);

    screenRef.current.getWorldPosition(screenPosition);
    screenRef.current.getWorldQuaternion(screenQuaternion);
    normal.applyQuaternion(screenQuaternion).normalize();

    const isPhoneViewport = window.matchMedia("(max-width: 700px)").matches;
    const baseFocusDistance = channel === 0 ? 0.72 : 0.92;
    const mobileFocusDistances = [0.98, 1.30, 1.30, 1.18];
    const focusDistance = isPhoneViewport
      ? mobileFocusDistances[channel] ?? baseFocusDistance + 0.26
      : baseFocusDistance;
    const yOffset = channel === 0 ? -0.04 : 0.05;
    const lookAtOffset = channel === 0 ? -0.03 : 0;
    const cameraPosition = screenPosition
      .clone()
      .add(normal.multiplyScalar(focusDistance))
      .add(new THREE.Vector3(0, yOffset, 0));

    const lookAtPoint = [
      screenPosition.x,
      screenPosition.y + lookAtOffset,
      screenPosition.z,
    ];

    onScreenFocus({
      key: `tv-${channel}`,
      channel,
      cameraPosition: [cameraPosition.x, cameraPosition.y, cameraPosition.z],
      lookAt: lookAtPoint,
    });
  }

  const handlePointerOver = useCallback(() => {
    document.body.style.cursor = "pointer";
  }, []);

  const handlePointerOut = useCallback(() => {
    document.body.style.cursor = "default";
  }, []);

  useEffect(() => {
    return () => { document.body.style.cursor = "default"; };
  }, []);

  const spotTargetRef = useRef();
  const spotRef = useRef();

  useEffect(() => {
    if (spotRef.current && spotTargetRef.current) {
      spotRef.current.target = spotTargetRef.current;
    }
  }, []);

  return (
    <group position={layout.position} rotation={layout.rotation}>
      <object3D ref={spotTargetRef} position={[0, 0, -0.1]} />
      <spotLight
        ref={spotRef}
        position={[0, 2.4, 0]}
        angle={0.55}
        penumbra={0.7}
        intensity={4.5}
        distance={6}
        color="#fff6e6"
        castShadow={false}
      />

      <group
        position={modelConfig.position}
        rotation={modelConfig.rotation}
        scale={modelConfig.scale}
      >
        <primitive object={tvModel} />
        <group
          position={screenConfig.position}
          rotation={screenConfig.rotation}
        >
          <mesh
            ref={screenRef}
            geometry={screenGeometry}
            position={[0, 0, screenConfig.surfaceOffset]}
            onPointerDown={handleScreenClick}
            onPointerOver={handlePointerOver}
            onPointerOut={handlePointerOut}
            renderOrder={6}
          >
            <meshBasicMaterial
              transparent
              opacity={0}
              depthWrite={false}
              side={THREE.DoubleSide}
            />
          </mesh>
          <Html
            transform
            center
            scale={htmlScale}
            distanceFactor={400}
            pointerEvents={focused ? "auto" : "none"}
            position={[0, 0, screenConfig.surfaceOffset + screenConfig.glassOffset + 0.003]}
            className={`tv-screen-html ${focused ? "tv-screen-html-active" : ""}`}
            occlude={false}
          >
            <TVScreenPage channel={channel} interactive={focused} />
          </Html>
        </group>
      </group>
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

function SakuraBridgeModel({ index, isActive, isNight }) {
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
    const colorOverrides = isNight
      ? SAKURA_BRIDGE_MATERIAL_OVERRIDES.night
      : SAKURA_BRIDGE_MATERIAL_OVERRIDES.day;

    model.traverse((child) => {
      if (!child.isMesh) return;

      const applyMaterialOverrides = (sourceMaterial) => {
        if (!sourceMaterial) return sourceMaterial;
        const material = sourceMaterial.clone();
        const targetColor = colorOverrides[material.name];
        if (targetColor && material.color) {
          material.color.set(targetColor);
          material.vertexColors = false;
        }
        material.needsUpdate = true;
        return material;
      };

      child.material = Array.isArray(child.material)
        ? child.material.map(applyMaterialOverrides)
        : applyMaterialOverrides(child.material);

      child.frustumCulled = true;
      const mats = Array.isArray(child.material) ? child.material : [child.material];
      const transparent = mats.some(
        (material) => material?.transparent && (material?.opacity ?? 1) < 0.95
      );
      child.castShadow = !transparent;
      child.receiveShadow = !transparent;
    });
  }, [isNight, model]);

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
  tvConfig,
}) {
  const z = getChannelAnchor(index);
  const localLightRef = useRef();

  useFrame((_, delta) => {
    if (!localLightRef.current) return;
    const t = 1 - Math.exp(-delta * 4.4);
    const targetIntensity = isActive ? (isTvFocused ? 0.18 : 1.0) : 0;
    localLightRef.current.intensity += (targetIntensity - localLightRef.current.intensity) * t;
  });

  return (
    <group position={[0, 0, z]}>
      <SceneFogEnvelope
        palette={palette}
        isNight={isNight}
        isFocused={isTvFocused}
        channel={index}
      />
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[8, 48]} />
        <meshStandardMaterial color={palette.ground} roughness={0.95} />
      </mesh>

      <mesh position={[0, -0.16, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[8.2, 9, 56]} />
        <meshBasicMaterial color={palette.accent} transparent opacity={0.25} />
      </mesh>

      <SakuraBridgeModel
        index={index}
        isActive={isActive}
        isNight={isNight}
      />

      <pointLight
        ref={localLightRef}
        position={[0.4, 4.8, -1.2]}
        intensity={isActive ? 1.0 : 0}
        distance={12}
        color={isNight ? "#ffd9a6" : "#fff3c2"}
      />

      <CRTTV
        channel={index}
        onScreenFocus={onScreenFocus}
        tvConfig={tvConfig}
        focused={isTvFocused}
      />
    </group>
  );
}

function DesertRoadModel({ index, isActive, isNight }) {
  const { scene } = useGLTF(DESERT_ROAD_PATH);
  const model = useMemo(() => scene.clone(true), [scene]);
  const modelRef = useRef();
  const controls = getChannelControls(index);
  const modelControls = controls.desertRoadModel || {
    position: [0, -0.5, 0],
    rotation: [0, 0, 0],
    scale: 1,
  };

  useFrame((state) => {
    if (!isActive || !modelRef.current) return;
    modelRef.current.rotation.y =
      modelControls.rotation[1] + Math.sin(state.clock.elapsedTime * 0.1) * 0.01;
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
    <group position={controls.sceneOffset} scale={controls.sceneScale}>
      <primitive
        ref={modelRef}
        object={model}
        position={modelControls.position}
        rotation={modelControls.rotation}
        scale={modelControls.scale}
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
  tvConfig,
}) {
  const controls = getChannelControls(index);
  const heatRippleRef = useRef();
  const localLightRef = useRef();
  const z = getChannelAnchor(index);

  useFrame((state, delta) => {
    const tSmooth = 1 - Math.exp(-delta * 4.4);

    if (localLightRef.current) {
      const targetIntensity = isActive ? (isTvFocused ? 0.2 : 1.0) : 0;
      localLightRef.current.intensity += (targetIntensity - localLightRef.current.intensity) * tSmooth;
    }

    if (!isActive || !heatRippleRef.current) return;
    const t = state.clock.elapsedTime;
    const s = 0.95 + (Math.sin(t * 1.8) + 1) * 0.08;
    const baseOpacity = 0.15 + (Math.sin(t * 2.1) + 1) * 0.08;
    const targetOpacity = baseOpacity * (isTvFocused ? 1.9 : 1);
    heatRippleRef.current.scale.set(s, 1, s);
    heatRippleRef.current.material.opacity +=
      (targetOpacity - heatRippleRef.current.material.opacity) * tSmooth;
  });

  return (
    <group position={[0, 0, z]}>
      <SceneFogEnvelope
        palette={palette}
        isNight={isNight}
        isFocused={isTvFocused}
        channel={index}
      />
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[8, 40]} />
        <meshStandardMaterial color={palette.ground} roughness={1} />
      </mesh>

      <mesh position={[0, -0.12, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[8.1, 8.9, 48]} />
        <meshBasicMaterial color={palette.accent} transparent opacity={0.2} />
      </mesh>

      <DesertRoadModel
        index={index}
        isActive={isActive}
        isNight={isNight}
      />

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
        ref={localLightRef}
        position={[0.5, 3.8, -0.2]}
        intensity={isActive ? 1.0 : 0}
        distance={11}
        color={palette.accent}
      />

      <CRTTV
        channel={index}
        onScreenFocus={onScreenFocus}
        tvConfig={tvConfig}
        focused={isTvFocused}
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
  tvConfig,
}) {
  const controls = getChannelControls(index);
  const { scene } = useGLTF(WINTER_SCENE_PATH);
  const model = useMemo(() => scene.clone(true), [scene]);
  const modelRef = useRef();
  const z = getChannelAnchor(index);
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
    <group position={[0, 0, z]}>
      <SceneFogEnvelope
        palette={palette}
        isNight={isNight}
        isFocused={isTvFocused}
        channel={index}
      />
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
        tvConfig={tvConfig}
        focused={isTvFocused}
      />
    </group>
  );
}

function SpacePlanetModel({ index, isActive }) {
  const { scene } = useGLTF(SPACE_PLANET_PATH);
  const model = useMemo(() => scene.clone(true), [scene]);
  const modelRef = useRef();
  const controls = getChannelControls(index);
  const modelControls = controls.spacePlanetModel || {
    position: [2.8, -0.6, -3.5],
    rotation: [0.15, 0.4, -0.1],
    scale: 1.8,
  };

  useFrame((state) => {
    if (!isActive || !modelRef.current) return;
    modelRef.current.rotation.y =
      modelControls.rotation[1] + state.clock.elapsedTime * 0.02;
  });

  useEffect(() => {
    model.traverse((child) => {
      if (!child.isMesh) return;
      child.frustumCulled = true;
      child.castShadow = false;
      child.receiveShadow = false;
    });
  }, [model]);

  return (
    <group position={controls.sceneOffset} scale={controls.sceneScale}>
      <primitive
        ref={modelRef}
        object={model}
        position={modelControls.position}
        rotation={modelControls.rotation}
        scale={modelControls.scale}
      />
    </group>
  );
}

function SpaceStarField({ isActive }) {
  const pointsRef = useRef();
  const starCount = 320;

  const { positions, sizes, twinklePhases } = useMemo(() => {
    const positions = new Float32Array(starCount * 3);
    const sizes = new Float32Array(starCount);
    const twinklePhases = new Float32Array(starCount);
    for (let i = 0; i < starCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 8 + Math.random() * 4;
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = Math.abs(r * Math.cos(phi)) * 0.7 + 0.3;
      positions[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
      sizes[i] = 0.02 + Math.random() * 0.06;
      twinklePhases[i] = Math.random() * Math.PI * 2;
    }
    return { positions, sizes, twinklePhases };
  }, []);

  const dotTexture = useMemo(() => createSoftDotTexture(), []);

  useEffect(() => () => dotTexture.dispose(), [dotTexture]);

  useFrame((state) => {
    if (!isActive || !pointsRef.current) return;
    const t = state.clock.elapsedTime;
    const sizeAttr = pointsRef.current.geometry.attributes.size;
    for (let i = 0; i < starCount; i++) {
      const twinkle = 0.5 + 0.5 * Math.sin(t * (0.8 + twinklePhases[i] * 0.5) + twinklePhases[i]);
      sizeAttr.array[i] = sizes[i] * (0.4 + twinkle * 0.6);
    }
    sizeAttr.needsUpdate = true;
  });

  return (
    <points ref={pointsRef} raycast={() => null} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-size" args={[sizes.slice(), 1]} />
      </bufferGeometry>
      <pointsMaterial
        map={dotTexture}
        color="#e8e8ff"
        size={0.12}
        sizeAttenuation
        transparent
        opacity={0.95}
        alphaTest={0.05}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function SpaceEnvironment({
  index,
  palette,
  onScreenFocus,
  isTvFocused,
  isActive,
  isNight,
  tvConfig,
}) {
  const tvFloatRef = useRef();
  const z = getChannelAnchor(index);

  useFrame((state) => {
    if (!isActive || !tvFloatRef.current) return;
    const t = state.clock.elapsedTime;
    tvFloatRef.current.position.y = Math.sin(t * 0.6) * 0.08;
    tvFloatRef.current.rotation.z = Math.sin(t * 0.35) * 0.015;
  });

  return (
    <group position={[0, 0, z]}>
      <SpaceStarField isActive={isActive} />

      <SpacePlanetModel
        index={index}
        isActive={isActive}
      />

      <directionalLight
        position={[-8, 12, 6]}
        intensity={isActive ? 1.8 : 0}
        color="#fff4e0"
      />

      <pointLight
        position={[-1.5, 3.5, -2]}
        intensity={isActive ? 0.6 : 0}
        distance={14}
        color="#8ecaff"
      />
      <pointLight
        position={[2, 1, 1]}
        intensity={isActive ? 0.35 : 0}
        distance={10}
        color="#c4a0ff"
      />

      <group ref={tvFloatRef}>
        <CRTTV
          channel={index}
          onScreenFocus={onScreenFocus}
          tvConfig={tvConfig}
          focused={isTvFocused}
        />
      </group>
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
      const anchorZ = getChannelAnchor(clamped);
      targetPosition.current.set(
        0,
        SCENE_CONFIG.camera.height,
        anchorZ + SCENE_CONFIG.camera.zOffset
      );
      const lookAtHeight = getChannelLookAtHeight(clamped);
      targetLookAt.current.set(0, lookAtHeight, anchorZ);
    }

    notifiedRef.current = false;
  }, [channel, focusTarget]);

  useEffect(() => {
    const initialAnchorZ = getChannelAnchor(clampChannel(channel));
    camera.position.set(
      0,
      SCENE_CONFIG.camera.height,
      initialAnchorZ + SCENE_CONFIG.camera.zOffset
    );
    const initialLookAtHeight = getChannelLookAtHeight(clampChannel(channel));
    liveLookAt.current.set(0, initialLookAtHeight, initialAnchorZ);
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
  const maxDistanceSq = SCENE_CONFIG.renderDistance * SCENE_CONFIG.renderDistance;

  useFrame(() => {
    for (let i = 0; i < environmentRefs.current.length; i++) {
      const env = environmentRefs.current[i];
      if (!env) continue;

      const anchorZ = getChannelAnchor(i);
      samplePointRef.current.set(
        0,
        SCENE_CONFIG.camera.height,
        anchorZ + SCENE_CONFIG.camera.zOffset
      );

      const distanceSq = camera.position.distanceToSquared(samplePointRef.current);
      env.visible = distanceSq <= maxDistanceSq;
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

function FogDarkening({ isFocused, activeChannel, theme }) {
  const { scene } = useThree();

  useEffect(() => {
    if (!scene.fog) {
      const isSpace = activeChannel === 3;
      scene.fog = new THREE.Fog(
        theme.fogColor,
        isSpace ? 80 : SCENE_CONFIG.fog.near,
        isSpace ? 120 : SCENE_CONFIG.fog.far
      );
    }
  }, [scene, theme.fogColor, activeChannel]);

  useFrame((_, delta) => {
    if (!scene.fog) return;
    const t = 1 - Math.exp(-delta * 2.8);
    const isSpace = activeChannel === 3;

    const targetNear = isFocused ? 0.8 : (isSpace ? 80 : SCENE_CONFIG.fog.near);
    const targetFar = isFocused ? 5.5 : (isSpace ? 120 : SCENE_CONFIG.fog.far);

    scene.fog.near += (targetNear - scene.fog.near) * t;
    scene.fog.far += (targetFar - scene.fog.far) * t;
    scene.fog.color.set(isFocused ? "#050508" : theme.fogColor);
  });

  return null;
}

function CinematicLighting({ isNight, theme, anchorZ, isFocused }) {
  const targetRef = useRef();
  const keyRef = useRef();
  const fillRef = useRef();
  const ambientRef = useRef();
  const hemiRef = useRef();

  const baseAmbient = isNight ? theme.ambientIntensity * 0.92 : theme.ambientIntensity * 0.72;
  const baseHemi = isNight ? 0.42 : 0.44;
  const baseKey = isNight ? theme.directionalIntensity * 0.98 : theme.directionalIntensity * 1.12;
  const baseFill = isNight ? 0.24 : 0.22;

  useFrame((_, delta) => {
    const t = 1 - Math.exp(-delta * 3.2);
    const focusMul = isFocused ? 0.06 : 1;
    if (ambientRef.current) {
      ambientRef.current.intensity += (baseAmbient * focusMul - ambientRef.current.intensity) * t;
    }
    if (hemiRef.current) {
      hemiRef.current.intensity += (baseHemi * focusMul - hemiRef.current.intensity) * t;
    }
    if (keyRef.current) {
      keyRef.current.intensity += (baseKey * focusMul - keyRef.current.intensity) * t;
    }
    if (fillRef.current) {
      fillRef.current.intensity += (baseFill * focusMul - fillRef.current.intensity) * t;
    }
  });

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
    targetRef.current.position.set(0, 1.1, anchorZ);
    targetRef.current.updateMatrixWorld();
    if (keyRef.current) keyRef.current.target.updateMatrixWorld();
    if (fillRef.current) fillRef.current.target.updateMatrixWorld();
  }, [anchorZ]);

  return (
    <>
      <object3D ref={targetRef} position={[0, 1.1, anchorZ]} />

      <ambientLight
        ref={ambientRef}
        intensity={baseAmbient}
        color={isNight ? "#9bb2d6" : "#fff1d7"}
      />
      <hemisphereLight
        ref={hemiRef}
        color={isNight ? "#9ab4dd" : "#ffeac2"}
        groundColor={theme.hemisphereGround}
        intensity={baseHemi}
      />

      <directionalLight
        ref={keyRef}
        position={[
          isNight ? -8.2 : 11.2,
          isNight ? 12.2 : 14.8,
          anchorZ + (isNight ? 7.1 : 6.4),
        ]}
        intensity={baseKey}
        color={isNight ? "#b8d2ff" : "#ffe2ad"}
        castShadow
      />
      <directionalLight
        ref={fillRef}
        position={[
          isNight ? 6.8 : -8.8,
          isNight ? 6.6 : 8.4,
          anchorZ + (isNight ? -5.8 : -6.8),
        ]}
        intensity={baseFill}
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
        <group key={`celestial-${env.name}`} position={[0, 0, getChannelAnchor(index)]}>
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
  currentMode,
  useEnvironmentModes,
  focusedScreen,
  setFocusedScreen,
}) {
  const environmentRefs = useRef([]);
  const [hydratedChannels, setHydratedChannels] = useState(() => new Set([channel]));
  const isNight = isNightSceneMode({ currentMode, useEnvironmentModes });
  const activeChannel = focusedScreen?.channel ?? channel;
  const activeAnchorZ = getChannelAnchor(activeChannel);
  const tvConfigs = useMemo(
    () => ENVIRONMENT_MODES.map((_, index) => getChannelTVConfig(index)),
    []
  );
  const palettes = useMemo(
    () => ENVIRONMENT_MODES.map((_, index) => getEnvironmentPalette(index, useEnvironmentModes)),
    [useEnvironmentModes]
  );

  const onScreenFocus = useCallback((focusData) => {
    setFocusedScreen(focusData);
  }, [setFocusedScreen]);

  useEffect(() => {
    setHydratedChannels((prev) => {
      if (prev.has(channel)) return prev;
      const next = new Set(prev);
      next.add(channel);
      return next;
    });
  }, [channel]);

  return (
    <>
      <RendererTuning isNight={isNight} />

      <FogDarkening isFocused={!!focusedScreen} activeChannel={activeChannel} theme={theme} />

      <CinematicLighting isNight={isNight} theme={theme} anchorZ={activeAnchorZ} isFocused={!!focusedScreen} />

      <CelestialBodies isNight={isNight} />

      {activeChannel !== 3 && (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.4, -54]} receiveShadow>
          <planeGeometry args={[64, 240]} />
          <meshStandardMaterial color={theme.planeColor} roughness={1} />
        </mesh>
      )}

      {ENVIRONMENT_MODES.map((env, index) => {
        const isActive = activeChannel === index;
        const shouldRenderEnvironment = isActive || hydratedChannels.has(index);
        const palette = palettes[index];
        const isTvFocused = focusedScreen?.key === `tv-${index}`;
        const tvConfig = tvConfigs[index];

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
            {shouldRenderEnvironment ? (
              index === 0 ? (
                <SakuraEnvironment
                  index={index}
                  palette={palette}
                  onScreenFocus={onScreenFocus}
                  isTvFocused={isTvFocused}
                  isActive={isActive}
                  isNight={isNight}
                  tvConfig={tvConfig}
                />
              ) : index === 1 ? (
                <DesertEnvironment
                  index={index}
                  palette={palette}
                  onScreenFocus={onScreenFocus}
                  isTvFocused={isTvFocused}
                  isActive={isActive}
                  isNight={isNight}
                  tvConfig={tvConfig}
                />
              ) : index === 2 ? (
                <ArcticEnvironment
                  index={index}
                  palette={palette}
                  onScreenFocus={onScreenFocus}
                  isTvFocused={isTvFocused}
                  isActive={isActive}
                  isNight={isNight}
                  tvConfig={tvConfig}
                />
              ) : (
                <SpaceEnvironment
                  index={index}
                  palette={palette}
                  onScreenFocus={onScreenFocus}
                  isTvFocused={isTvFocused}
                  isActive={isActive}
                  isNight={isNight}
                  tvConfig={tvConfig}
                />
              )
            ) : null}
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

export const ThreeEnv = memo(function ThreeEnv({
  channel = 0,
  onSceneReady,
  onTvFocusChange,
  currentMode = 0,
  useEnvironmentModes = true,
  windEnabled = true,
  ambientMuted = false,
  resetFocusSignal = 0,
}) {
  const stageRef = useRef(null);
  const preloadedAssetsRef = useRef(new Set());
  const touchStateRef = useRef({
    startX: 0,
    startY: 0,
    startScrollTop: 0,
    startedAt: 0,
    pageEl: null,
  });
  const [focusedScreen, setFocusedScreen] = useState(null);
  const clampedChannel = clampChannel(channel);

  const closeFocusedScreen = useCallback(() => {
    setFocusedScreen(null);
  }, []);

  const preloadModel = useCallback((path) => {
    if (!path || preloadedAssetsRef.current.has(path)) return;
    preloadedAssetsRef.current.add(path);
    useGLTF.preload(path);
  }, []);

  useEffect(() => {
    setFocusedScreen(null);
  }, [channel]);

  useEffect(() => {
    setFocusedScreen(null);
  }, [resetFocusSignal]);

  useEffect(() => {
    const timers = [];

    // Ensure the active channel and TV shell are ready first.
    preloadModel(SOVIET_TV_PATH);
    (CHANNEL_MODEL_PATHS[clampedChannel] || []).forEach((path) => preloadModel(path));

    // Stagger background preloads for the remaining channels.
    const otherChannels = Object.keys(CHANNEL_MODEL_PATHS)
      .map(Number)
      .filter((idx) => idx !== clampedChannel);

    let slot = 0;
    for (let i = 0; i < otherChannels.length; i++) {
      const channelIndex = otherChannels[i];
      const paths = CHANNEL_MODEL_PATHS[channelIndex] || [];
      for (let j = 0; j < paths.length; j++) {
        const path = paths[j];
        const delay = 600 + slot * 500;
        timers.push(window.setTimeout(() => preloadModel(path), delay));
        slot += 1;
      }
    }

    return () => {
      for (let i = 0; i < timers.length; i++) {
        window.clearTimeout(timers[i]);
      }
    };
  }, [clampedChannel, preloadModel]);

  useEffect(() => {
    if (!onTvFocusChange) return;
    onTvFocusChange(Boolean(focusedScreen));
  }, [focusedScreen, onTvFocusChange]);

  const theme = getSceneTheme({
    channel: clampedChannel,
    currentMode,
    useEnvironmentModes,
  });
  const isNight = isNightSceneMode({ currentMode, useEnvironmentModes });

  useSceneAmbientAudio({
    channel: clampedChannel,
    isNight,
    muted: ambientMuted,
  });

  useEffect(() => {
    if (!focusedScreen) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeFocusedScreen();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [focusedScreen, closeFocusedScreen]);

  useEffect(() => {
    if (!focusedScreen || !stageRef.current) return undefined;

    const stageElement = stageRef.current;

    const handleTouchStart = (event) => {
      if (!event.touches || event.touches.length !== 1) return;

      const touch = event.touches[0];
      const pageEl = event.target?.closest?.(".tv-page") || null;

      touchStateRef.current = {
        startX: touch.clientX,
        startY: touch.clientY,
        startScrollTop: pageEl ? pageEl.scrollTop : 0,
        startedAt: Date.now(),
        pageEl,
      };
    };

    const handleTouchEnd = (event) => {
      if (!event.changedTouches || event.changedTouches.length !== 1) return;

      const touch = event.changedTouches[0];
      const state = touchStateRef.current;
      if (!state.startedAt) return;

      const dx = touch.clientX - state.startX;
      const dy = touch.clientY - state.startY;
      const absX = Math.abs(dx);
      const absY = Math.abs(dy);
      const elapsed = Date.now() - state.startedAt;
      const currentScrollTop = state.pageEl ? state.pageEl.scrollTop : 0;

      const startedNearLeft = state.startX <= 36;
      const swipeRightBack = startedNearLeft && dx > 88 && absY < 70;
      const swipeDownBack =
        state.startScrollTop <= 2 &&
        currentScrollTop <= 2 &&
        dy > 96 &&
        absX < 90;

      if (elapsed < 700 && (swipeRightBack || swipeDownBack)) {
        closeFocusedScreen();
      }
    };

    stageElement.addEventListener("touchstart", handleTouchStart, { passive: true });
    stageElement.addEventListener("touchend", handleTouchEnd, { passive: true });

    return () => {
      stageElement.removeEventListener("touchstart", handleTouchStart);
      stageElement.removeEventListener("touchend", handleTouchEnd);
    };
  }, [focusedScreen, closeFocusedScreen]);

  const handlePointerMissed = useCallback((event) => {
    const target = event?.target || event?.nativeEvent?.target;

    if (target?.closest?.(".tv-screen-html, [data-tv-control='true']")) {
      return;
    }

    closeFocusedScreen();
  }, [closeFocusedScreen]);

  return (
    <div ref={stageRef} className="three-env-stage">
      <Canvas
        id="canvas-id"
        className="three-env-canvas"
        shadows
        dpr={[1, 1.25]}
        gl={{ antialias: true, powerPreference: "high-performance" }}
        onPointerMissed={handlePointerMissed}
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
          channel={clampedChannel}
        onSceneReady={onSceneReady}
        theme={theme}
        currentMode={currentMode}
        useEnvironmentModes={useEnvironmentModes}
        focusedScreen={focusedScreen}
          setFocusedScreen={setFocusedScreen}
        />
      </Canvas>

      <WindOverlay
        channel={clampedChannel}
        isNight={isNight}
        enabled={windEnabled}
      />

      {focusedScreen ? (
        <div className="three-env-focus-hint" aria-live="polite">
          Tap or click outside the TV screen to zoom out or go back
        </div>
      ) : null}

      <div className="three-env-postfx-layer" aria-hidden="true">
        <span className="three-env-postfx-glow" />
        <span className="three-env-postfx-scan" />
        <span className="three-env-postfx-vignette" />
      </div>
    </div>
  );
});

WindOverlay.propTypes = {
  channel: PropTypes.number.isRequired,
  isNight: PropTypes.bool.isRequired,
  enabled: PropTypes.bool.isRequired,
};

SceneFogEnvelope.propTypes = {
  palette: PropTypes.object.isRequired,
  isNight: PropTypes.bool.isRequired,
  isFocused: PropTypes.bool,
  channel: PropTypes.number,
};

SceneFogEnvelope.defaultProps = {
  isFocused: false,
  channel: 0,
};

SakuraWind.propTypes = {
  index: PropTypes.number.isRequired,
  palette: PropTypes.object.isRequired,
  isActive: PropTypes.bool.isRequired,
};

DesertWind.propTypes = {
  index: PropTypes.number.isRequired,
  palette: PropTypes.object.isRequired,
  isActive: PropTypes.bool.isRequired,
};

ArcticWind.propTypes = {
  index: PropTypes.number.isRequired,
  palette: PropTypes.object.isRequired,
  isActive: PropTypes.bool.isRequired,
};

CRTTV.propTypes = {
  channel: PropTypes.number.isRequired,
  onScreenFocus: PropTypes.func,
  tvConfig: PropTypes.object.isRequired,
  focused: PropTypes.bool,
};

CRTTV.defaultProps = {
  onScreenFocus: null,
  focused: false,
};

SakuraTreeModel.propTypes = {
  isActive: PropTypes.bool.isRequired,
};

SakuraBridgeModel.propTypes = {
  index: PropTypes.number.isRequired,
  isActive: PropTypes.bool.isRequired,
  isNight: PropTypes.bool.isRequired,
};

SakuraEnvironment.propTypes = {
  index: PropTypes.number.isRequired,
  palette: PropTypes.object.isRequired,
  onScreenFocus: PropTypes.func,
  isTvFocused: PropTypes.bool.isRequired,
  isActive: PropTypes.bool.isRequired,
  isNight: PropTypes.bool.isRequired,
  tvConfig: PropTypes.object.isRequired,
};

SakuraEnvironment.defaultProps = {
  onScreenFocus: null,
};

DesertRoadModel.propTypes = {
  index: PropTypes.number.isRequired,
  isActive: PropTypes.bool.isRequired,
  isNight: PropTypes.bool.isRequired,
};

DesertEnvironment.propTypes = {
  index: PropTypes.number.isRequired,
  palette: PropTypes.object.isRequired,
  onScreenFocus: PropTypes.func,
  isTvFocused: PropTypes.bool.isRequired,
  isActive: PropTypes.bool.isRequired,
  isNight: PropTypes.bool.isRequired,
  tvConfig: PropTypes.object.isRequired,
};

DesertEnvironment.defaultProps = {
  onScreenFocus: null,
};

ArcticEnvironment.propTypes = {
  index: PropTypes.number.isRequired,
  palette: PropTypes.object.isRequired,
  onScreenFocus: PropTypes.func,
  isTvFocused: PropTypes.bool.isRequired,
  isActive: PropTypes.bool.isRequired,
  isNight: PropTypes.bool.isRequired,
  tvConfig: PropTypes.object.isRequired,
};

ArcticEnvironment.defaultProps = {
  onScreenFocus: null,
};

SpacePlanetModel.propTypes = {
  index: PropTypes.number.isRequired,
  isActive: PropTypes.bool.isRequired,
};

SpaceStarField.propTypes = {
  isActive: PropTypes.bool.isRequired,
};

SpaceEnvironment.propTypes = {
  index: PropTypes.number.isRequired,
  palette: PropTypes.object.isRequired,
  onScreenFocus: PropTypes.func,
  isTvFocused: PropTypes.bool.isRequired,
  isActive: PropTypes.bool.isRequired,
  isNight: PropTypes.bool.isRequired,
  tvConfig: PropTypes.object.isRequired,
};

SpaceEnvironment.defaultProps = {
  onScreenFocus: null,
};

CameraRail.propTypes = {
  channel: PropTypes.number.isRequired,
  onSceneReady: PropTypes.func,
  focusTarget: PropTypes.object,
};

CameraRail.defaultProps = {
  onSceneReady: null,
  focusTarget: null,
};

DistanceCulling.propTypes = {
  environmentRefs: PropTypes.shape({
    current: PropTypes.array,
  }).isRequired,
};

RendererTuning.propTypes = {
  isNight: PropTypes.bool.isRequired,
};

FogDarkening.propTypes = {
  isFocused: PropTypes.bool.isRequired,
  activeChannel: PropTypes.number.isRequired,
  theme: PropTypes.object.isRequired,
};

CinematicLighting.propTypes = {
  isNight: PropTypes.bool.isRequired,
  theme: PropTypes.object.isRequired,
  anchorZ: PropTypes.number.isRequired,
  isFocused: PropTypes.bool.isRequired,
};

CelestialBodies.propTypes = {
  isNight: PropTypes.bool.isRequired,
};

MultiEnvironmentScene.propTypes = {
  channel: PropTypes.number.isRequired,
  onSceneReady: PropTypes.func,
  theme: PropTypes.object.isRequired,
  currentMode: PropTypes.number.isRequired,
  useEnvironmentModes: PropTypes.bool.isRequired,
  focusedScreen: PropTypes.object,
  setFocusedScreen: PropTypes.func.isRequired,
};

MultiEnvironmentScene.defaultProps = {
  onSceneReady: null,
  focusedScreen: null,
};

ThreeEnv.propTypes = {
  channel: PropTypes.number,
  onSceneReady: PropTypes.func,
  onTvFocusChange: PropTypes.func,
  currentMode: PropTypes.number,
  useEnvironmentModes: PropTypes.bool,
  windEnabled: PropTypes.bool,
  ambientMuted: PropTypes.bool,
  resetFocusSignal: PropTypes.number,
};

ThreeEnv.defaultProps = {
  channel: 0,
  onSceneReady: null,
  onTvFocusChange: null,
  currentMode: 0,
  useEnvironmentModes: true,
  windEnabled: true,
  ambientMuted: false,
  resetFocusSignal: 0,
};

