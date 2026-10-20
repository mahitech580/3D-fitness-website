import { type RefObject, useLayoutEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

type Vec3 = [number, number, number];
type BodyData = { curve: THREE.CatmullRomCurve3; frames: THREE.FrenetFrames; geometry: THREE.BufferGeometry };
type InstanceSet = { white: THREE.Matrix4[]; cobalt: THREE.Matrix4[]; spines: THREE.Matrix4[] };

const ceramicColor = '#f2f0e9';
const cobaltColor = '#315ca9';

function bodyRadius(t: number) {
  const swell = Math.pow(Math.max(0, Math.sin(Math.PI * t)), 0.47);
  return 0.022 + 0.255 * swell * (0.9 + 0.1 * Math.sin(t * Math.PI * 4));
}

function createTube(curve: THREE.CatmullRomCurve3, segments: number, radialSegments: number, radiusAt: (t: number) => number) {
  const frames = curve.computeFrenetFrames(segments, false);
  const positions: number[] = [];
  const uvs: number[] = [];
  const indices: number[] = [];
  for (let i = 0; i <= segments; i += 1) {
    const t = i / segments;
    const center = curve.getPointAt(t);
    const radius = radiusAt(t);
    for (let j = 0; j <= radialSegments; j += 1) {
      const v = j / radialSegments;
      const angle = v * Math.PI * 2;
      const radial = frames.normals[i].clone().multiplyScalar(Math.cos(angle)).addScaledVector(frames.binormals[i], Math.sin(angle));
      const vertex = center.clone().addScaledVector(radial, radius);
      positions.push(vertex.x, vertex.y, vertex.z);
      uvs.push(t, v);
      if (i < segments && j < radialSegments) {
        const a = i * (radialSegments + 1) + j;
        const b = a + radialSegments + 1;
        indices.push(a, b, a + 1, b, b + 1, a + 1);
      }
    }
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}

function createBodyData(): BodyData {
  const points: Vec3[] = [
    [0.3, -2.75, 0.0],
    [-0.62, -2.24, 0.12],
    [-0.98, -1.62, 0.15],
    [-0.55, -1.12, 0.04],
    [0.35, -0.85, -0.1],
    [0.87, -0.35, -0.12],
    [0.72, 0.23, -0.04],
    [0.08, 0.51, 0.12],
    [-0.68, 0.68, 0.13],
    [-0.93, 1.18, 0.03],
    [-0.58, 1.65, -0.08],
    [-0.02, 1.96, -0.04],
    [0.22, 2.16, 0.0],
  ];
  const curve = new THREE.CatmullRomCurve3(points.map((point) => new THREE.Vector3(...point)), false, 'catmullrom', 0.48);
  const segments = 240;
  const frames = curve.computeFrenetFrames(segments, false);
  const geometry = createTube(curve, 340, 28, bodyRadius);
  return { curve, frames, geometry };
}

function createInstances(curve: THREE.CatmullRomCurve3, frames: THREE.FrenetFrames): InstanceSet {
  const white: THREE.Matrix4[] = [];
  const cobalt: THREE.Matrix4[] = [];
  const spines: THREE.Matrix4[] = [];
  const tangent = new THREE.Vector3();
  const radial = new THREE.Vector3();
  const side = new THREE.Vector3();
  const position = new THREE.Vector3();
  const scale = new THREE.Vector3();
  const quaternion = new THREE.Quaternion();
  const basis = new THREE.Matrix4();
  const matrix = new THREE.Matrix4();
  const rows = 66;
  const around = 20;

  for (let row = 0; row < rows; row += 1) {
    const t = (row + 0.55) / rows;
    const frameIndex = Math.max(0, Math.min(frames.tangents.length - 1, Math.round(t * (frames.tangents.length - 1))));
    const point = curve.getPointAt(t);
    tangent.copy(frames.tangents[frameIndex]).normalize();
    for (let column = 0; column < around; column += 1) {
      const angle = ((column + (row % 2) * 0.5) / around) * Math.PI * 2;
      radial.copy(frames.normals[frameIndex]).multiplyScalar(Math.cos(angle)).addScaledVector(frames.binormals[frameIndex], Math.sin(angle)).normalize();
      side.copy(tangent).cross(radial).normalize();
      position.copy(point).addScaledVector(radial, bodyRadius(t) * 0.89);
      basis.makeBasis(tangent, radial, side);
      quaternion.setFromRotationMatrix(basis);
      scale.set(0.102, 0.042, 0.079);
      matrix.compose(position, quaternion, scale);
      const isCobalt = (t > 0.32 && t < 0.43 && column >= 1 && column <= 7) || (t > 0.67 && t < 0.735 && column >= 11 && column <= 16);
      (isCobalt ? cobalt : white).push(matrix.clone());
    }
  }

  for (let i = 0; i < 27; i += 1) {
    const t = 0.11 + (i / 28) * 0.81;
    const frameIndex = Math.round(t * (frames.tangents.length - 1));
    radial.copy(frames.normals[frameIndex]).multiplyScalar(0.8).addScaledVector(frames.binormals[frameIndex], 0.45).normalize();
    position.copy(curve.getPointAt(t)).addScaledVector(radial, bodyRadius(t) * 0.64);
    quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), radial);
    scale.set(0.72 + 0.28 * Math.sin(i * 0.6), 0.82 + 0.32 * Math.sin(i * 0.6), 0.72 + 0.28 * Math.sin(i * 0.6));
    matrix.compose(position, quaternion, scale);
    spines.push(matrix.clone());
  }
  return { white, cobalt, spines };
}

function CurveStroke({ points, radius, color }: { points: Vec3[]; radius: number; color: string }) {
  const curve = useMemo(() => new THREE.CatmullRomCurve3(points.map((point) => new THREE.Vector3(...point))), [points]);
  const geometry = useMemo(() => new THREE.TubeGeometry(curve, 28, radius, 7, false), [curve, radius]);
  return <mesh geometry={geometry}><meshStandardMaterial color={color} roughness={0.32} /></mesh>;
}

function Mane({ groupRef }: { groupRef: RefObject<THREE.Group> }) {
  const strands = useMemo(() => Array.from({ length: 13 }, (_, index) => {
    const offset = index / 12;
    return [
      [-0.06 - offset * 0.18, 2.29 - offset * 0.04, (offset - 0.5) * 0.31] as Vec3,
      [-0.26 - offset * 0.23, 2.48 - offset * 0.04, (offset - 0.5) * 0.35] as Vec3,
      [-0.49 - offset * 0.22, 2.42 - offset * 0.16, (offset - 0.5) * 0.39] as Vec3,
      [-0.74 - offset * 0.12, 2.21 - offset * 0.23, (offset - 0.5) * 0.42] as Vec3,
    ];
  }), []);
  return (
    <group ref={groupRef}>
      {strands.map((points, index) => <CurveStroke key={index} points={points} radius={index % 3 === 0 ? 0.023 : 0.015} color={index % 4 === 0 ? '#e1e7ee' : ceramicColor} />)}
    </group>
  );
}

function Paw({ position, rotation = 0 }: { position: Vec3; rotation?: number }) {
  return (
    <group position={position} rotation={[0, 0, rotation]}>
      <mesh scale={[0.12, 0.07, 0.09]}><sphereGeometry args={[1, 16, 12]} /><meshPhysicalMaterial color={ceramicColor} roughness={0.27} clearcoat={0.55} /></mesh>
      {[-0.052, 0, 0.052].map((offset) => (
        <mesh key={offset} position={[0.09, -0.01, offset]} rotation={[0, 0, -0.2]}>
          <coneGeometry args={[0.022, 0.09, 7]} /><meshPhysicalMaterial color="#f7f5ef" roughness={0.25} clearcoat={0.45} />
        </mesh>
      ))}
    </group>
  );
}

function DragonHead({ headRef, whiskerRef }: { headRef: RefObject<THREE.Group>; whiskerRef: RefObject<THREE.Group> }) {
  return (
    <group ref={headRef} position={[0.22, 2.18, 0]}>
      <mesh position={[-0.025, 0.015, 0]} scale={[0.3, 0.225, 0.225]}><sphereGeometry args={[1, 28, 20]} /><meshPhysicalMaterial color="#f4f2eb" roughness={0.26} clearcoat={0.8} /></mesh>
      <mesh position={[0.205, -0.062, 0]} scale={[0.29, 0.115, 0.165]}><sphereGeometry args={[1, 24, 16]} /><meshPhysicalMaterial color="#f6f4ed" roughness={0.28} clearcoat={0.72} /></mesh>
      <mesh position={[0.155, -0.155, 0]} scale={[0.215, 0.064, 0.14]}><sphereGeometry args={[1, 20, 14]} /><meshPhysicalMaterial color="#e7e7e0" roughness={0.34} clearcoat={0.48} /></mesh>
      <mesh position={[0.37, -0.035, 0.095]} scale={[0.035, 0.02, 0.014]}><sphereGeometry args={[1, 12, 8]} /><meshStandardMaterial color={cobaltColor} roughness={0.48} /></mesh>
      <mesh position={[0.37, -0.035, -0.095]} scale={[0.035, 0.02, 0.014]}><sphereGeometry args={[1, 12, 8]} /><meshStandardMaterial color={cobaltColor} roughness={0.48} /></mesh>
      <mesh position={[0.025, 0.087, 0.205]} scale={[0.083, 0.069, 0.035]}><sphereGeometry args={[1, 18, 12]} /><meshPhysicalMaterial color="#d9e0e6" roughness={0.24} clearcoat={0.8} /></mesh>
      <mesh position={[0.046, 0.085, 0.235]} scale={[0.049, 0.046, 0.025]}><sphereGeometry args={[1, 18, 12]} /><meshStandardMaterial color={cobaltColor} roughness={0.22} /></mesh>
      <mesh position={[0.057, 0.085, 0.254]} scale={[0.022, 0.03, 0.012]}><sphereGeometry args={[1, 12, 10]} /><meshStandardMaterial color="#101c2c" roughness={0.18} /></mesh>
      <mesh position={[0.066, 0.105, 0.266]} scale={[0.01, 0.01, 0.006]}><sphereGeometry args={[1, 8, 6]} /><meshBasicMaterial color="#ffffff" /></mesh>
      <mesh position={[-0.13, 0.14, 0.11]} rotation={[0.2, 0, -0.28]}><coneGeometry args={[0.075, 0.33, 10]} /><meshPhysicalMaterial color="#eeeae2" roughness={0.28} clearcoat={0.6} /></mesh>
      <mesh position={[-0.14, 0.13, -0.11]} rotation={[-0.2, 0, -0.25]}><coneGeometry args={[0.072, 0.3, 10]} /><meshPhysicalMaterial color="#eeeae2" roughness={0.28} clearcoat={0.6} /></mesh>
      <group ref={whiskerRef}>
        <CurveStroke points={[[0.27, 0.015, 0.12], [0.48, 0.13, 0.18], [0.64, 0.25, 0.16], [0.82, 0.19, 0.13]]} radius={0.009} color="#d7dfe7" />
        <CurveStroke points={[[0.29, -0.08, 0.12], [0.52, -0.2, 0.2], [0.72, -0.17, 0.2], [0.86, -0.29, 0.14]]} radius={0.01} color="#d7dfe7" />
        <CurveStroke points={[[0.28, 0.0, -0.12], [0.48, 0.1, -0.2], [0.65, 0.08, -0.21]]} radius={0.008} color="#d7dfe7" />
      </group>
      <CurveStroke points={[[-0.13, 0.15, 0.16], [-0.33, 0.35, 0.19], [-0.54, 0.31, 0.2], [-0.72, 0.42, 0.16]]} radius={0.027} color="#f6f4ee" />
      <CurveStroke points={[[-0.1, 0.18, -0.16], [-0.28, 0.33, -0.18], [-0.48, 0.3, -0.2], [-0.67, 0.4, -0.16]]} radius={0.023} color="#f0eee7" />
      <mesh position={[-0.19, 0.09, 0.19]} rotation={[0.2, 0, -0.45]} scale={[0.055, 0.075, 0.02]}><sphereGeometry args={[1, 12, 10]} /><meshStandardMaterial color={cobaltColor} roughness={0.36} /></mesh>
      <mesh position={[-0.19, 0.09, 0.215]} rotation={[0.2, 0, 0.45]} scale={[0.035, 0.07, 0.018]}><sphereGeometry args={[1, 12, 10]} /><meshStandardMaterial color="#7e9dca" roughness={0.36} /></mesh>
    </group>
  );
}

export function PorcelainDragon() {
  const rootRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Group>(null);
  const whiskerRef = useRef<THREE.Group>(null);
  const maneRef = useRef<THREE.Group>(null);
  const data = useMemo(createBodyData, []);
  const instances = useMemo(() => createInstances(data.curve, data.frames), [data]);
  const scaleGeometry = useMemo(() => new THREE.SphereGeometry(1, 10, 8), []);
  const spineGeometry = useMemo(() => new THREE.ConeGeometry(0.065, 0.22, 7), []);
  const whiteMaterial = useMemo(() => new THREE.MeshPhysicalMaterial({ color: '#f1f0eb', roughness: 0.29, metalness: 0, clearcoat: 0.7, clearcoatRoughness: 0.25 }), []);
  const blueMaterial = useMemo(() => new THREE.MeshPhysicalMaterial({ color: cobaltColor, roughness: 0.31, metalness: 0, clearcoat: 0.55, clearcoatRoughness: 0.28 }), []);
  const spineMaterial = useMemo(() => new THREE.MeshPhysicalMaterial({ color: '#e9e7df', roughness: 0.31, clearcoat: 0.55 }), []);
  const whiteScalesRef = useRef<THREE.InstancedMesh>(null);
  const blueScalesRef = useRef<THREE.InstancedMesh>(null);
  const spinesRef = useRef<THREE.InstancedMesh>(null);

  useLayoutEffect(() => {
    const whiteMesh = whiteScalesRef.current;
    const blueMesh = blueScalesRef.current;
    const spineMesh = spinesRef.current;
    instances.white.forEach((matrix, index) => whiteMesh?.setMatrixAt(index, matrix));
    instances.cobalt.forEach((matrix, index) => blueMesh?.setMatrixAt(index, matrix));
    instances.spines.forEach((matrix, index) => spineMesh?.setMatrixAt(index, matrix));
    if (whiteMesh) whiteMesh.instanceMatrix.needsUpdate = true;
    if (blueMesh) blueMesh.instanceMatrix.needsUpdate = true;
    if (spineMesh) spineMesh.instanceMatrix.needsUpdate = true;
  }, [instances]);

  useFrame((state, delta) => {
    if (rootRef.current) {
      rootRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.52) * 0.035;
      rootRef.current.rotation.z = THREE.MathUtils.damp(rootRef.current.rotation.z, state.pointer.x * 0.018, 2.4, delta);
      rootRef.current.rotation.x = THREE.MathUtils.damp(rootRef.current.rotation.x, -state.pointer.y * 0.02, 2.1, delta);
    }
    if (headRef.current) {
      headRef.current.rotation.y = THREE.MathUtils.damp(headRef.current.rotation.y, state.pointer.x * 0.085, 2.8, delta);
      headRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.6) * 0.009;
    }
    if (whiskerRef.current) whiskerRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 1.1) * 0.018;
    if (maneRef.current) maneRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.7) * 0.008;
  });

  return (
    <group ref={rootRef}>
      <mesh geometry={data.geometry}>
        <meshPhysicalMaterial color="#f2f0e9" roughness={0.27} metalness={0} clearcoat={0.72} clearcoatRoughness={0.22} sheen={0.18} sheenColor="#dce7f4" />
      </mesh>
      <instancedMesh ref={whiteScalesRef} args={[scaleGeometry, whiteMaterial, instances.white.length]} frustumCulled={false} />
      <instancedMesh ref={blueScalesRef} args={[scaleGeometry, blueMaterial, instances.cobalt.length]} frustumCulled={false} />
      <instancedMesh ref={spinesRef} args={[spineGeometry, spineMaterial, instances.spines.length]} frustumCulled={false} />
      <Mane groupRef={maneRef} />
      <DragonHead headRef={headRef} whiskerRef={whiskerRef} />
      <group>
        <CurveStroke points={[[0.5, -0.39, 0.03], [0.72, -0.56, 0.14], [0.86, -0.77, 0.17]]} radius={0.053} color={ceramicColor} />
        <Paw position={[0.88, -0.78, 0.18]} rotation={-0.15} />
        <CurveStroke points={[[-0.73, 1.04, 0.05], [-0.98, 0.9, 0.15], [-0.83, 0.76, 0.18]]} radius={0.047} color={ceramicColor} />
        <Paw position={[-0.8, 0.74, 0.18]} rotation={0.25} />
        <CurveStroke points={[[0.58, 0.0, -0.12], [0.92, -0.12, -0.18], [1.02, -0.3, -0.2]]} radius={0.045} color="#e8e7e0" />
        <Paw position={[1.04, -0.33, -0.2]} rotation={-0.55} />
        <CurveStroke points={[[-0.82, 1.22, -0.02], [-1.02, 1.32, -0.18], [-0.94, 1.15, -0.2]]} radius={0.04} color="#e8e7e0" />
        <Paw position={[-0.94, 1.12, -0.2]} rotation={0.4} />
      </group>
      <group>
        {Array.from({ length: 8 }, (_, index) => {
          const offset = index / 7;
          return <CurveStroke key={index} points={[[0.25 - offset * 0.1, -2.61 - offset * 0.03, 0], [0.02 - offset * 0.13, -2.79 - offset * 0.06, (offset - 0.5) * 0.16], [-0.22 - offset * 0.12, -2.88 - offset * 0.08, (offset - 0.5) * 0.18]]} radius={0.013 + (index % 3) * 0.004} color={index % 3 === 0 ? '#d7e2ee' : '#f4f1eb'} />;
        })}
      </group>
    </group>
  );
}
