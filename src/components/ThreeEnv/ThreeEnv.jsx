import { Canvas } from "@react-three/fiber";
import { useGLTF, OrbitControls } from "@react-three/drei";

export function ThreeEnv() {
  const { scene } = useGLTF("/tv.glb");
  const floorDimensions = [40, 0.1, 40];
  const floorPosition = [0, -1.2, 0];
  const floorColor = "brown";
  const petalColor = "pink";

  scene.traverse((child) => {
    if (child.isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });

  return (
    <>
      <Canvas id="canvas-id" shadows camera={{ position: [5, 5, -3] }}>
        <OrbitControls />
        {scene.children.map((child, index) => (
          <mesh key={index}>
            {child.geometry && <primitive object={child} />}
            {child.material && (
              <meshStandardMaterial attach="material" {...child.material} />
            )}
          </mesh>
        ))}
        <ambientLight intensity={0.3} />
        <directionalLight
          position={[15, 5, 5]}
          color="white"
          castShadow={true}
        />
      </Canvas>
    </>
  );
}
