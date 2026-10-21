import { useEffect, useMemo, useRef, useState, type CSSProperties, type ChangeEvent } from 'react';
import '../styles/planner.css';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

const EQUIPMENT = {
  rack: { label: 'Squat rack', mark: 'R', width: 2, depth: 2, color: '#9fce3b', category: 'Strength' },
  bench: { label: 'Adjustable bench', mark: 'B', width: 2, depth: 1, color: '#9fce3b', category: 'Strength' },
  dumbbells: { label: 'Dumbbell rack', mark: 'DB', width: 1, depth: 1, color: '#9fce3b', category: 'Strength' },
  treadmill: { label: 'Treadmill', mark: 'T', width: 2, depth: 1, color: '#8dafff', category: 'Cardio' },
  bike: { label: 'Exercise bike', mark: 'C', width: 2, depth: 1, color: '#8dafff', category: 'Cardio' },
  elliptical: { label: 'Elliptical trainer', mark: 'E', width: 2, depth: 2, color: '#8dafff', category: 'Cardio' },
  rower: { label: 'Rowing machine', mark: 'RW', width: 3, depth: 1, color: '#8dafff', category: 'Cardio' },
  mat: { label: 'Training mat', mark: 'M', width: 2, depth: 1, color: '#d3b58b', category: 'Mobility' },
  storage: { label: 'Storage shelf', mark: 'S', width: 1, depth: 1, color: '#c9cbd0', category: 'Storage' },
  barbell: { label: 'Barbell station', mark: 'BB', width: 2, depth: 1, color: '#9fce3b', category: 'Strength' },
  kettlebell: { label: 'Kettlebell', mark: 'KB', width: 1, depth: 1, color: '#9fce3b', category: 'Strength' },
  cable: { label: 'Cable machine', mark: 'CM', width: 2, depth: 2, color: '#9fce3b', category: 'Strength' },
  legpress: { label: 'Leg press', mark: 'LP', width: 2, depth: 2, color: '#9fce3b', category: 'Strength' },
  mirror: { label: 'Wall mirror', mark: 'MI', width: 2, depth: 1, color: '#a9cbd6', category: 'Room' },
  latpulldown: { label: 'Lat pulldown', mark: 'LD', width: 2, depth: 2, color: '#9fce3b', category: 'Strength' },
} as const;

type EquipmentType = keyof typeof EQUIPMENT;
type PlacedItem = { id: number; type: EquipmentType; x: number; y: number; rotated: boolean };
type LayoutSnapshot = { version: 1; roomWidth: number; roomLength: number; roomHeight: number; items: PlacedItem[] };

const TYPES = Object.keys(EQUIPMENT) as EquipmentType[];
const DEFAULT_ITEMS: PlacedItem[] = [
  { id: 1, type: 'rack', x: 0, y: 0, rotated: false },
  { id: 2, type: 'bench', x: 3, y: 0, rotated: false },
  { id: 3, type: 'dumbbells', x: 6, y: 0, rotated: false },
  { id: 4, type: 'bike', x: 9, y: 0, rotated: false },
];

function sizeOf(item: PlacedItem) {
  const config = EQUIPMENT[item.type];
  return item.rotated ? { width: config.depth, depth: config.width } : { width: config.width, depth: config.depth };
}

function isEquipmentType(value: unknown): value is EquipmentType {
  return typeof value === 'string' && TYPES.includes(value as EquipmentType);
}

function parseLayout(value: unknown): LayoutSnapshot {
  if (!value || typeof value !== 'object') throw new Error('The file does not contain a layout object.');
  const data = value as Partial<LayoutSnapshot>;
  if (data.version !== 1 || !Number.isInteger(data.roomWidth) || !Number.isInteger(data.roomLength) || !Number.isInteger(data.roomHeight)) throw new Error('Unsupported layout format or room measurements.');
  if ((data.roomWidth ?? 0) < 4 || (data.roomWidth ?? 0) > 24 || (data.roomLength ?? 0) < 4 || (data.roomLength ?? 0) > 18 || (data.roomHeight ?? 0) < 2 || (data.roomHeight ?? 0) > 8) throw new Error('Room measurements are outside the supported range.');
  if (!Array.isArray(data.items) || data.items.length > 200) throw new Error('The layout item list is invalid.');
  const ids = new Set<number>();
  const items = data.items.map((raw) => {
    if (!raw || !Number.isInteger(raw.id) || !isEquipmentType(raw.type) || !Number.isInteger(raw.x) || !Number.isInteger(raw.y) || typeof raw.rotated !== 'boolean' || raw.id <= 0 || ids.has(raw.id)) throw new Error('An equipment item contains invalid data.');
    ids.add(raw.id);
    return { id: raw.id, type: raw.type, x: raw.x, y: raw.y, rotated: raw.rotated };
  });
  const snapshot = { version: 1 as const, roomWidth: data.roomWidth!, roomLength: data.roomLength!, roomHeight: data.roomHeight!, items };
  for (const item of items) {
    if (!placementFits(item, items.filter((other) => other.id !== item.id), snapshot.roomWidth, snapshot.roomLength)) throw new Error('The layout contains equipment outside the room or overlapping another item.');
  }
  return snapshot;
}

function readSavedLayout(): LayoutSnapshot | null {
  try {
    const value = window.localStorage.getItem('kinetik-gym-plan-autosave');
    return value ? parseLayout(JSON.parse(value)) : null;
  } catch { return null; }
}

function placementFits(candidate: PlacedItem, existing: PlacedItem[], roomWidth: number, roomLength: number): boolean {
  const size = sizeOf(candidate);
  if (candidate.x < 0 || candidate.y < 0 || candidate.x + size.width > roomWidth || candidate.y + size.depth > roomLength) return false;
  return existing.every((item) => {
    if (item.id === candidate.id) return true;
    const other = sizeOf(item);
    return candidate.x + size.width <= item.x || item.x + other.width <= candidate.x || candidate.y + size.depth <= item.y || item.y + other.depth <= candidate.y;
  });
}

function downloadFile(filename: string, contents: Blob | string, mime = 'application/octet-stream') {
  const blob = contents instanceof Blob ? contents : new Blob([contents], { type: mime });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1200);
}

function EquipmentModel({ item, roomWidth, roomLength, selected, onSelect }: { item: PlacedItem; roomWidth: number; roomLength: number; selected: boolean; onSelect: (id: number) => void }) {
  const base = EQUIPMENT[item.type];
  const size = sizeOf(item);
  const position: [number, number, number] = [item.x + size.width / 2 - roomWidth / 2, 0.03, item.y + size.depth / 2 - roomLength / 2];
  const frame = '#343a36';
  const rubber = '#151917';
  const metal = '#9fa7a0';
  const pad = '#313b34';
  return (
    <group position={position} rotation={[0, item.rotated ? Math.PI / 2 : 0, 0]} onClick={(event) => { event.stopPropagation(); onSelect(item.id); }}>
      <mesh position={[0, 0.045, 0]} castShadow receiveShadow>
        <boxGeometry args={[base.width * 0.92, 0.07, base.depth * 0.9]} />
        <meshStandardMaterial color={selected ? '#d7ff58' : base.color} roughness={0.78} metalness={0.08} />
      </mesh>
      {item.type === 'rack' && <group>
        {[-0.72, 0.72].map((x) => [-0.72, 0.72].map((z) => <mesh key={String(x) + String(z)} position={[x, 1.15, z]} castShadow><boxGeometry args={[0.09, 2.25, 0.09]} /><meshStandardMaterial color={frame} metalness={0.72} roughness={0.3} /></mesh>))}
        <mesh position={[0, 2.12, -0.72]}><boxGeometry args={[1.55, 0.1, 0.1]} /><meshStandardMaterial color={metal} metalness={0.8} roughness={0.24} /></mesh>
        <mesh position={[0, 1.32, 0]}><boxGeometry args={[1.58, 0.06, 0.06]} /><meshStandardMaterial color={metal} metalness={0.8} /></mesh>
        {[-0.58, -0.3, 0.3, 0.58].map((x) => <mesh key={x} position={[x, 0.82, 0.7]} castShadow><cylinderGeometry args={[0.13, 0.13, 0.11, 20]} /><meshStandardMaterial color={rubber} roughness={0.72} /></mesh>)}
      </group>}
      {item.type === 'bench' && <group>
        <mesh position={[0, 0.55, 0]} castShadow><boxGeometry args={[1.55, 0.16, 0.52]} /><meshStandardMaterial color={pad} roughness={0.62} /></mesh>
        {[-0.55, 0.55].map((x) => <mesh key={x} position={[x, 0.28, 0]}><boxGeometry args={[0.08, 0.5, 0.45]} /><meshStandardMaterial color={frame} metalness={0.75} /></mesh>)}
      </group>}
      {item.type === 'dumbbells' && <group>{[-0.28, 0.28].map((x) => <group key={x} position={[x, 0.2, 0]}><mesh><boxGeometry args={[0.24, 0.2, 0.2]} /><meshStandardMaterial color={rubber} roughness={0.75} /></mesh><mesh position={[0, 0.16, 0]}><cylinderGeometry args={[0.055, 0.055, 0.22, 14]} /><meshStandardMaterial color={metal} metalness={0.85} /></mesh></group>)}</group>}
      {item.type === 'treadmill' && <group>
        <mesh position={[0, 0.18, 0.15]} castShadow><boxGeometry args={[0.72, 0.14, 1.35]} /><meshStandardMaterial color={rubber} roughness={0.8} /></mesh>
        {[-0.3, 0.3].map((x) => <mesh key={x} position={[x, 0.76, -0.52]} rotation={[0.14, 0, 0]}><boxGeometry args={[0.07, 1.25, 0.07]} /><meshStandardMaterial color={metal} metalness={0.76} /></mesh>)}
        <mesh position={[0, 1.25, -0.5]} rotation={[-0.3, 0, 0]}><boxGeometry args={[0.5, 0.12, 0.22]} /><meshStandardMaterial color={frame} /></mesh>
        <mesh position={[0, 0.28, 0.77]}><boxGeometry args={[0.8, 0.1, 0.12]} /><meshStandardMaterial color={metal} metalness={0.7} /></mesh>
      </group>}
      {item.type === 'bike' && <group>
        {[-0.45, 0.45].map((z) => <mesh key={z} position={[0, 0.28, z]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[0.24, 0.045, 10, 24]} /><meshStandardMaterial color={rubber} /></mesh>)}
        <mesh position={[0, 0.6, 0]} rotation={[0, 0, -0.45]}><cylinderGeometry args={[0.045, 0.045, 0.72, 12]} /><meshStandardMaterial color={metal} metalness={0.75} /></mesh>
        <mesh position={[0, 0.88, -0.24]}><boxGeometry args={[0.38, 0.08, 0.24]} /><meshStandardMaterial color={pad} /></mesh>
        <mesh position={[0, 1.14, 0.32]}><boxGeometry args={[0.3, 0.05, 0.18]} /><meshStandardMaterial color={frame} /></mesh>
        <mesh position={[0, 0.18, 0]}><boxGeometry args={[0.82, 0.08, 1.2]} /><meshStandardMaterial color={frame} /></mesh>
      </group>}
      {item.type === 'elliptical' && <group>
        <mesh position={[0, 0.24, 0]}><boxGeometry args={[0.8, 0.16, 1.25]} /><meshStandardMaterial color={frame} /></mesh>
        {[-0.27, 0.27].map((x) => <group key={x}><mesh position={[x, 0.15, 0.35]} rotation={[0, 0, -0.1]}><boxGeometry args={[0.22, 0.08, 0.62]} /><meshStandardMaterial color={pad} /></mesh><mesh position={[x, 0.92, -0.1]} rotation={[0, 0, -0.16]}><boxGeometry args={[0.06, 1.55, 0.06]} /><meshStandardMaterial color={metal} metalness={0.8} /></mesh></group>)}
      </group>}
      {item.type === 'rower' && <group>
        <mesh position={[0, 0.26, 0]}><boxGeometry args={[0.38, 0.12, 2.35]} /><meshStandardMaterial color={frame} metalness={0.45} /></mesh>
        <mesh position={[0, 0.4, -0.1]}><boxGeometry args={[0.34, 0.13, 0.34]} /><meshStandardMaterial color={pad} /></mesh>
        <mesh position={[0, 0.4, -0.93]}><cylinderGeometry args={[0.25, 0.25, 0.14, 24]} /><meshStandardMaterial color={rubber} /></mesh>
        <mesh position={[0, 0.56, -0.88]} rotation={[0, 0, 0.25]}><boxGeometry args={[0.65, 0.055, 0.055]} /><meshStandardMaterial color={metal} /></mesh>
      </group>}
      {item.type === 'mat' && <mesh position={[0, 0.12, 0]}><boxGeometry args={[base.width * 0.86, 0.12, base.depth * 0.82]} /><meshStandardMaterial color="#565e52" roughness={0.95} /></mesh>}
      {item.type === 'storage' && <group>{[0.18, 0.54, 0.9].map((y) => <mesh key={y} position={[0, y, 0]}><boxGeometry args={[0.78, 0.055, 0.78]} /><meshStandardMaterial color={metal} metalness={0.65} /></mesh>)}{[-0.28, 0.28].map((x) => <mesh key={x} position={[x, 0.55, 0]}><boxGeometry args={[0.055, 1.15, 0.72]} /><meshStandardMaterial color={frame} metalness={0.7} /></mesh>)}</group>}
      {item.type === 'barbell' && <group>
        <mesh position={[0, 0.45, 0]} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.035, 0.035, 1.65, 16]} /><meshStandardMaterial color={metal} metalness={0.9} roughness={0.2} /></mesh>
        {[-0.7, 0.7].map((x) => <group key={x} position={[x, 0.45, 0]}><mesh><cylinderGeometry args={[0.25, 0.25, 0.12, 24]} /><meshStandardMaterial color={rubber} /></mesh><mesh position={[Math.sign(x) * 0.11, 0, 0]}><cylinderGeometry args={[0.2, 0.2, 0.08, 24]} /><meshStandardMaterial color={metal} metalness={0.7} /></mesh></group>)}
      </group>}
      {item.type === 'kettlebell' && <group><mesh position={[0, 0.3, 0]}><sphereGeometry args={[0.28, 20, 16]} /><meshStandardMaterial color={rubber} roughness={0.38} metalness={0.15} /></mesh><mesh position={[0, 0.56, 0]}><torusGeometry args={[0.14, 0.045, 12, 20, Math.PI]} /><meshStandardMaterial color={metal} metalness={0.8} /></mesh></group>}
      {['cable', 'latpulldown', 'legpress'].includes(item.type) && <group>
        {[-0.63, 0.63].map((x) => <mesh key={x} position={[x, 1.03, -0.55]}><boxGeometry args={[0.1, 2, 0.1]} /><meshStandardMaterial color={frame} metalness={0.7} /></mesh>)}
        <mesh position={[0, 2.04, -0.55]}><boxGeometry args={[1.38, 0.12, 0.12]} /><meshStandardMaterial color={metal} metalness={0.8} /></mesh>
        <mesh position={[0, 0.84, -0.55]}><boxGeometry args={[0.9, 0.55, 0.34]} /><meshStandardMaterial color={pad} /></mesh>
        <mesh position={[0, 0.43, 0.25]}><boxGeometry args={[0.8, 0.12, 0.65]} /><meshStandardMaterial color={frame} /></mesh>
        <mesh position={[0, 1.45, -0.46]}><boxGeometry args={[0.5, 0.22, 0.16]} /><meshStandardMaterial color={rubber} /></mesh>
      </group>}
      {item.type === 'mirror' && <group><mesh position={[0, 1.3, -0.25]}><boxGeometry args={[base.width * 0.9, 2.35, 0.055]} /><meshStandardMaterial color="#8cb7c2" metalness={0.3} roughness={0.18} /></mesh><mesh position={[0, 1.3, -0.21]}><boxGeometry args={[base.width * 0.92, 2.39, 0.025]} /><meshStandardMaterial color={frame} metalness={0.6} /></mesh></group>}
      <mesh position={[0, 0.14, 0]}><boxGeometry args={[0.15, 0.02, 0.15]} /><meshStandardMaterial color={selected ? '#d7ff58' : '#e2e7dc'} /></mesh>
    </group>
  );
}

function PlannerScene({ items, roomWidth, roomLength, roomHeight, selectedId, onSelect }: { items: PlacedItem[]; roomWidth: number; roomLength: number; roomHeight: number; selectedId: number | null; onSelect: (id: number) => void }) {
  return (
    <>
      <ambientLight intensity={1.3} />
      <hemisphereLight args={['#f3f7ef', '#56635b', 1.25]} />
      <directionalLight position={[roomWidth * 0.5, roomHeight + 5, roomLength * 0.55]} intensity={2.2} castShadow />
      <pointLight position={[-roomWidth / 2, 4, -roomLength / 2]} intensity={0.4} color="#d7ff58" />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.08, 0]} receiveShadow>
        <planeGeometry args={[roomWidth, roomLength]} />
        <meshStandardMaterial color="#b8beb4" roughness={0.86} />
      </mesh>
      <gridHelper args={[Math.max(roomWidth, roomLength), Math.max(roomWidth, roomLength), '#626d60', '#919b8d']} position={[0, -0.045, 0]} />
      <mesh position={[0, roomHeight / 2, -roomLength / 2]} receiveShadow><boxGeometry args={[roomWidth, roomHeight, 0.12]} /><meshStandardMaterial color="#d9ddd4" transparent opacity={0.35} roughness={0.92} /></mesh>
      <mesh position={[-roomWidth / 2, roomHeight / 2, 0]} receiveShadow><boxGeometry args={[0.12, roomHeight, roomLength]} /><meshStandardMaterial color="#c5cec2" transparent opacity={0.24} roughness={0.92} /></mesh>
      {items.map((item) => <EquipmentModel key={item.id} item={item} roomWidth={roomWidth} roomLength={roomLength} selected={selectedId === item.id} onSelect={onSelect} />)}
    </>
  );
}

export function GymPlanner() {
  const stored = useMemo(() => readSavedLayout(), []);
  const [roomWidth, setRoomWidth] = useState(stored?.roomWidth ?? 12);
  const [roomLength, setRoomLength] = useState(stored?.roomLength ?? 8);
  const [roomHeight, setRoomHeight] = useState(stored?.roomHeight ?? 3);
  const [items, setItems] = useState<PlacedItem[]>(stored?.items ?? DEFAULT_ITEMS);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [tool, setTool] = useState<EquipmentType>('rack');
  const [view, setView] = useState<'plan' | '3d' | 'split'>('split');
  const [status, setStatus] = useState('Add an item, select it in either view, then use the property controls to position it precisely.');
  const [past, setPast] = useState<PlacedItem[][]>([]);
  const [future, setFuture] = useState<PlacedItem[][]>([]);
  const previewRef = useRef<HTMLDivElement>(null);
  const importRef = useRef<HTMLInputElement>(null);
  const nextId = useRef(Math.max(0, ...(stored?.items ?? DEFAULT_ITEMS).map((item) => item.id)) + 1);
  const selectedItem = items.find((item) => item.id === selectedId) ?? null;
  const selectedSize = selectedItem ? sizeOf(selectedItem) : null;
  const occupiedArea = useMemo(() => items.reduce((total, item) => total + sizeOf(item).width * sizeOf(item).depth, 0), [items]);
  const cells = Array.from({ length: roomWidth * roomLength }, (_, index) => ({ x: index % roomWidth, y: Math.floor(index / roomWidth), key: index }));
  const overlaps = items.reduce((count, item, index) => count + (items.slice(index + 1).some((other) => !placementFits(item, [other], roomWidth, roomLength)) ? 1 : 0), 0);
  const nearestDistance = selectedItem ? Math.min(Infinity, ...items.filter((item) => item.id !== selectedItem.id).map((item) => {
    const a = sizeOf(selectedItem); const b = sizeOf(item);
    const dx = Math.abs((selectedItem.x + a.width / 2) - (item.x + b.width / 2));
    const dy = Math.abs((selectedItem.y + a.depth / 2) - (item.y + b.depth / 2));
    return Math.max(0, Math.hypot(dx, dy) - Math.hypot(a.width / 2, a.depth / 2) - Math.hypot(b.width / 2, b.depth / 2));
  })) : Infinity;

  useEffect(() => {
    const snapshot: LayoutSnapshot = { version: 1, roomWidth, roomLength, roomHeight, items };
    try { window.localStorage.setItem('kinetik-gym-plan-autosave', JSON.stringify(snapshot)); }
    catch { /* Keep editing possible if storage is unavailable. */ }
  }, [roomWidth, roomLength, roomHeight, items]);

  function commitItems(next: PlacedItem[]) {
    setPast((current) => [...current, items.map((item) => ({ ...item }))].slice(-40));
    setFuture([]);
    setItems(next);
  }

  function snapshot(): LayoutSnapshot {
    return { version: 1, roomWidth, roomLength, roomHeight, items: items.map((item) => ({ ...item })) };
  }

  function placeAt(type: EquipmentType, x: number, y: number) {
    const candidate: PlacedItem = { id: nextId.current++, type, x, y, rotated: false };
    if (!placementFits(candidate, items, roomWidth, roomLength)) {
      setStatus('That footprint overlaps equipment or extends beyond the room. Choose an open grid square.');
      return;
    }
    commitItems([...items, candidate]);
    setSelectedId(candidate.id);
    setStatus(EQUIPMENT[type].label + ' placed at ' + (x + 1) + ' m, ' + (y + 1) + ' m.');
  }

  function addAtNextOpenSpot(type: EquipmentType) {
    for (let y = 0; y < roomLength; y += 1) {
      for (let x = 0; x < roomWidth; x += 1) {
        const candidate = { id: nextId.current, type, x, y, rotated: false };
        if (placementFits(candidate, items, roomWidth, roomLength)) { placeAt(type, x, y); return; }
      }
    }
    setStatus('The room is full. Remove an item or increase the room dimensions.');
  }

  function moveSelected(dx: number, dy: number) {
    if (!selectedItem) { setStatus('Select an item in either view first.'); return; }
    const candidate = { ...selectedItem, x: selectedItem.x + dx, y: selectedItem.y + dy };
    if (!placementFits(candidate, items, roomWidth, roomLength)) { setStatus('Move blocked: this position would overlap equipment or leave the room.'); return; }
    commitItems(items.map((item) => item.id === candidate.id ? candidate : item));
    setStatus(EQUIPMENT[candidate.type].label + ' moved to grid position ' + (candidate.x + 1) + ', ' + (candidate.y + 1) + '.');
  }

  function rotateSelected() {
    if (!selectedItem) { setStatus('Select an item first, then rotate it.'); return; }
    const candidate = { ...selectedItem, rotated: !selectedItem.rotated };
    if (!placementFits(candidate, items.filter((item) => item.id !== candidate.id), roomWidth, roomLength)) { setStatus('Rotation blocked: move the item into an open area first.'); return; }
    commitItems(items.map((item) => item.id === candidate.id ? candidate : item));
    setStatus(EQUIPMENT[candidate.type].label + ' rotated 90 degrees.');
  }

  function removeSelected() {
    if (!selectedItem) { setStatus('Select an item to remove.'); return; }
    commitItems(items.filter((item) => item.id !== selectedItem.id));
    setSelectedId(null);
    setStatus(EQUIPMENT[selectedItem.type].label + ' removed.');
  }

  function duplicateSelected() {
    if (!selectedItem) { setStatus('Select an item to duplicate.'); return; }
    for (let y = 0; y < roomLength; y += 1) for (let x = 0; x < roomWidth; x += 1) {
      const candidate = { ...selectedItem, id: nextId.current, x, y };
      if (placementFits(candidate, items, roomWidth, roomLength)) {
        nextId.current += 1; commitItems([...items, candidate]); setSelectedId(candidate.id); setStatus(EQUIPMENT[candidate.type].label + ' duplicated.'); return;
      }
    }
    setStatus('No free footprint is available for a duplicate.');
  }

  function setCoordinate(axis: 'x' | 'y', value: number) {
    if (!selectedItem || !Number.isFinite(value)) return;
    const candidate = { ...selectedItem, [axis]: Math.round(value) } as PlacedItem;
    if (!placementFits(candidate, items.filter((item) => item.id !== candidate.id), roomWidth, roomLength)) { setStatus('That coordinate is outside the room or overlaps another item.'); return; }
    commitItems(items.map((item) => item.id === candidate.id ? candidate : item));
    setStatus('Position updated. The 2D plan and 3D preview use the same layout state.');
  }

  function setRoomDimension(axis: 'width' | 'length' | 'height', value: number) {
    const next = Math.round(value);
    const limits = axis === 'width' ? [4, 24] : axis === 'length' ? [4, 18] : [2, 8];
    if (!Number.isFinite(next) || next < limits[0] || next > limits[1]) { setStatus('Enter a whole-number room dimension in the range shown.'); return; }
    const width = axis === 'width' ? next : roomWidth;
    const length = axis === 'length' ? next : roomLength;
    if (items.some((item) => !placementFits(item, items.filter((other) => other.id !== item.id), width, length))) { setStatus('Room change blocked: one or more items would fall outside the new boundaries. Move equipment first.'); return; }
    if (axis === 'width') setRoomWidth(next);
    if (axis === 'length') setRoomLength(next);
    if (axis === 'height') setRoomHeight(next);
    setStatus('Room dimensions updated. Values are conceptual metres, not a code-compliant drawing.');
  }

  function undo() {
    if (!past.length) { setStatus('Nothing to undo.'); return; }
    setFuture((current) => [items.map((item) => ({ ...item })), ...current].slice(0, 40));
    setItems(past[past.length - 1]);
    setPast((current) => current.slice(0, -1));
    setStatus('Last equipment change undone.');
  }

  function redo() {
    if (!future.length) { setStatus('Nothing to redo.'); return; }
    setPast((current) => [...current, items.map((item) => ({ ...item }))].slice(-40));
    setItems(future[0]);
    setFuture((current) => current.slice(1));
    setStatus('Equipment change restored.');
  }

  function saveLayout() {
    try { window.localStorage.setItem('kinetik-gym-plan-saved', JSON.stringify(snapshot())); setStatus('Layout saved in this browser. It is not synced to a server or another device.'); }
    catch { setStatus('Browser storage is unavailable. Use Export JSON to keep a copy of this layout.'); }
  }

  function loadLayout() {
    try {
      const raw = window.localStorage.getItem('kinetik-gym-plan-saved');
      if (!raw) { setStatus('No saved layout exists in this browser yet. Use SAVE LAYOUT first.'); return; }
      const data = parseLayout(JSON.parse(raw));
      setRoomWidth(data.roomWidth); setRoomLength(data.roomLength); setRoomHeight(data.roomHeight);
      setPast([]); setFuture([]); setItems(data.items); setSelectedId(null);
      nextId.current = Math.max(0, ...data.items.map((item) => item.id)) + 1;
      setStatus('Saved browser layout loaded.');
    } catch (error) { setStatus(error instanceof Error ? error.message : 'Could not load the saved layout.'); }
  }

  function resetLayout() {
    commitItems([]);
    setSelectedId(null);
    setStatus('Equipment cleared. Room dimensions are unchanged.');
  }

  function exportJson() {
    downloadFile('kinetik-gym-layout.json', JSON.stringify(snapshot(), null, 2), 'application/json');
    setStatus('JSON layout exported. You can import the file later in this browser.');
  }

  function exportPlanPng() {
    const scale = 72; const margin = 50;
    const canvas = document.createElement('canvas');
    canvas.width = roomWidth * scale + margin * 2; canvas.height = roomLength * scale + margin * 2;
    const context = canvas.getContext('2d');
    if (!context) { setStatus('PNG export is not available in this browser.'); return; }
    context.fillStyle = '#f1f2ed'; context.fillRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = '#29302a'; context.font = 'bold 20px Arial'; context.fillText('KINETIK / CONCEPT FLOOR PLAN', margin, 28);
    context.strokeStyle = '#b6beb2'; context.lineWidth = 1;
    for (let x = 0; x <= roomWidth; x += 1) { context.beginPath(); context.moveTo(margin + x * scale, margin); context.lineTo(margin + x * scale, margin + roomLength * scale); context.stroke(); }
    for (let y = 0; y <= roomLength; y += 1) { context.beginPath(); context.moveTo(margin, margin + y * scale); context.lineTo(margin + roomWidth * scale, margin + y * scale); context.stroke(); }
    context.strokeStyle = '#273126'; context.lineWidth = 3; context.strokeRect(margin, margin, roomWidth * scale, roomLength * scale);
    for (const item of items) {
      const size = sizeOf(item); const x = margin + item.x * scale; const y = margin + item.y * scale;
      context.fillStyle = EQUIPMENT[item.type].color; context.fillRect(x + 3, y + 3, size.width * scale - 6, size.depth * scale - 6);
      context.strokeStyle = item.id === selectedId ? '#263d1c' : '#687264'; context.lineWidth = item.id === selectedId ? 3 : 1; context.strokeRect(x + 3, y + 3, size.width * scale - 6, size.depth * scale - 6);
      context.fillStyle = '#20251f'; context.font = 'bold 11px Arial'; context.fillText(EQUIPMENT[item.type].label, x + 8, y + Math.min(size.depth * scale - 8, 22));
    }
    context.fillStyle = '#444d43'; context.font = '12px Arial'; context.fillText('Approximate dimensions: ' + roomWidth + ' m × ' + roomLength + ' m · Not for construction or safety approval', margin, canvas.height - 18);
    canvas.toBlob((blob) => { if (blob) downloadFile('kinetik-floor-plan.png', blob); else setStatus('Could not create a PNG from this layout.'); });
    setStatus('2D floor-plan image exported.');
  }

  function export3dPng() {
    const canvas = previewRef.current?.querySelector('canvas');
    if (!canvas) { setStatus('The 3D preview is not ready yet.'); return; }
    try { downloadFile('kinetik-gym-preview.png', canvas.toDataURL('image/png')); setStatus('3D preview image exported.'); }
    catch { setStatus('The 3D renderer blocked image export. Try again after the preview has rendered.'); }
  }

  function importLayout(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = parseLayout(JSON.parse(String(reader.result)));
        setRoomWidth(data.roomWidth); setRoomLength(data.roomLength); setRoomHeight(data.roomHeight);
        setItems(data.items); setPast([]); setFuture([]); setSelectedId(null);
        nextId.current = Math.max(0, ...data.items.map((item) => item.id)) + 1;
        setStatus('Imported a validated JSON layout. Review the room before using it.');
      } catch (error) { setStatus(error instanceof Error ? error.message : 'Could not import this layout.'); }
      if (importRef.current) importRef.current.value = '';
    };
    reader.onerror = () => setStatus('The selected file could not be read.');
    reader.readAsText(file);
  }

  const sizeSlots = roomWidth * roomLength;
  const fillPercent = Math.round(occupiedArea / Math.max(1, sizeSlots) * 100);
  const activeViewClass = (target: 'plan' | '3d') => view === 'split' || view === target ? '' : ' is-hidden';

  return (
    <section className="section planner-section" id="space" aria-labelledby="space-title">
      <div className="section-shell">
        <div className="section-heading-row">
          <div><p className="eyebrow"><span>03</span> SPACE / PLANNING LAB</p><h2 id="space-title">Make room<br /><em>to move.</em></h2></div>
          <p className="section-intro">Build a training room, place equipment, and inspect the same layout in 2D and 3D. This is a concept planner—not a CAD tool or a safety-certified fit-out.</p>
        </div>
        <div className="planner-layout">
          <aside className="planner-sidebar">
            <div className="planner-block">
              <p className="planner-label">ROOM DIMENSIONS / METRES</p>
              <div className="room-dimensions">
                <label>WIDTH<input aria-label="Room width in metres" type="number" min="4" max="24" step="1" value={roomWidth} onChange={(event) => setRoomDimension('width', Number(event.target.value))} /></label>
                <label>LENGTH<input aria-label="Room length in metres" type="number" min="4" max="18" step="1" value={roomLength} onChange={(event) => setRoomDimension('length', Number(event.target.value))} /></label>
                <label>HEIGHT<input aria-label="Room height in metres" type="number" min="2" max="8" step="1" value={roomHeight} onChange={(event) => setRoomDimension('height', Number(event.target.value))} /></label>
              </div>
              <div className="room-metric"><strong>{roomWidth} × {roomLength}</strong><span>METRES / {sizeSlots} m²</span></div>
              <p className="planner-note">Grid snap is 1 m. Room walls are a visual reference only; openings and regulatory clearances are not modeled.</p>
            </div>
            <div className="planner-block"><p className="planner-label">START FROM A TEMPLATE</p><button type="button" className="preset-button" onClick={() => { setItems(DEFAULT_ITEMS.map((item) => ({ ...item }))); setSelectedId(null); setPast([]); setFuture([]); nextId.current = 5; setStatus('Starter layout loaded.'); }}>01 / STARTER FLOOR <span>↗</span></button><button type="button" className="preset-button" onClick={() => { const preset: PlacedItem[] = [{ id: 1, type: 'rack', x: 0, y: 0, rotated: false }, { id: 2, type: 'rack', x: 0, y: 3, rotated: false }, { id: 3, type: 'bench', x: 3, y: 0, rotated: false }, { id: 4, type: 'dumbbells', x: 6, y: 0, rotated: false }, { id: 5, type: 'barbell', x: 8, y: 0, rotated: false }, { id: 6, type: 'mirror', x: 10, y: 0, rotated: false }]; if (preset.every((item) => placementFits(item, preset.filter((other) => other.id !== item.id), roomWidth, roomLength))) { commitItems(preset); setSelectedId(null); nextId.current = 7; setStatus('Strength zone loaded.'); } else setStatus('Strength preset does not fit this room size. Increase the room width or reset to starter.'); }}>02 / STRENGTH ZONE <span>↗</span></button><button type="button" className="preset-button" onClick={() => { const preset: PlacedItem[] = [{ id: 1, type: 'treadmill', x: 0, y: 0, rotated: false }, { id: 2, type: 'bike', x: 3, y: 0, rotated: false }, { id: 3, type: 'rower', x: 6, y: 0, rotated: false }, { id: 4, type: 'elliptical', x: 0, y: 3, rotated: false }, { id: 5, type: 'mat', x: 4, y: 4, rotated: false }, { id: 6, type: 'kettlebell', x: 7, y: 4, rotated: false }]; if (preset.every((item) => placementFits(item, preset.filter((other) => other.id !== item.id), roomWidth, roomLength))) { commitItems(preset); setSelectedId(null); nextId.current = 7; setStatus('Conditioning zone loaded.'); } else setStatus('Conditioning preset does not fit this room size. Increase the room dimensions or choose another preset.'); }}>03 / CONDITIONING <span>↗</span></button></div>
            <div className="planner-block"><p className="planner-label">EQUIPMENT CATALOG / {TYPES.length} ITEMS</p><div className="equipment-palette">{TYPES.map((type) => <button key={type} type="button" className={tool === type ? 'palette-tool is-active' : 'palette-tool'} aria-pressed={tool === type} onClick={() => { setTool(type); setStatus('Selected ' + EQUIPMENT[type].label + '. Add it to an open grid position.'); }}><span>{EQUIPMENT[type].mark}</span><small>{EQUIPMENT[type].label}</small></button>)}</div><button type="button" className="button button-primary full-width" onClick={() => addAtNextOpenSpot(tool)}>ADD {EQUIPMENT[tool].label.toUpperCase()} <span aria-hidden="true">＋</span></button></div>
            <div className="planner-block selected-controls">
              <p className="planner-label">SELECTED EQUIPMENT</p><p className="selected-title">{selectedItem ? EQUIPMENT[selectedItem.type].label : 'Nothing selected'}</p>
              <p className="planner-note">{selectedSize ? selectedSize.width + ' m × ' + selectedSize.depth + ' m footprint · grid (' + selectedItem!.x + ', ' + selectedItem!.y + ')' : 'Select the same item from either the 2D plan or 3D room.'}</p>
              {selectedItem && <div className="coordinate-controls"><label>X / COLUMN<input type="number" min="0" max={roomWidth - 1} step="1" value={selectedItem.x} onChange={(event) => setCoordinate('x', Number(event.target.value))} /></label><label>Y / ROW<input type="number" min="0" max={roomLength - 1} step="1" value={selectedItem.y} onChange={(event) => setCoordinate('y', Number(event.target.value))} /></label></div>}
              <div className="move-pad"><button type="button" disabled={!selectedItem} onClick={() => moveSelected(0, -1)} aria-label="Move equipment toward front">↑</button><button type="button" disabled={!selectedItem} onClick={() => moveSelected(-1, 0)} aria-label="Move equipment left">←</button><button type="button" disabled={!selectedItem} onClick={() => moveSelected(0, 1)} aria-label="Move equipment toward back">↓</button><button type="button" disabled={!selectedItem} onClick={() => moveSelected(1, 0)} aria-label="Move equipment right">→</button></div>
              <div className="selected-actions"><button type="button" disabled={!selectedItem} onClick={rotateSelected}>ROTATE 90°</button><button type="button" disabled={!selectedItem} onClick={duplicateSelected}>DUPLICATE</button><button type="button" disabled={!selectedItem} onClick={removeSelected}>REMOVE</button></div>
              <p className="planner-note">{Number.isFinite(nearestDistance) ? 'Approx. nearest clearance: ' + nearestDistance.toFixed(1) + ' m' : 'Select equipment to inspect approximate spacing.'}</p>
            </div>
          </aside>
          <div className="planner-main">
            <div className="planner-toolbar"><div><span className="live-indicator" /> LIVE LAYOUT</div><div>{items.length} ITEMS / {occupiedArea} m² FOOTPRINT / {sizeSlots - occupiedArea} m² OPEN</div><div className="planner-view-controls" role="group" aria-label="Planner view">{(['split', 'plan', '3d'] as const).map((target) => <button key={target} type="button" className={view === target ? 'is-active' : ''} aria-pressed={view === target} onClick={() => setView(target)}>{target === 'split' ? 'SPLIT' : target === 'plan' ? '2D PLAN' : '3D ROOM'}</button>)}</div></div>
            <div className={'planner-workspace' + (view === 'split' ? ' is-split' : '')}>
              <div className={'planner-view planner-plan-view' + activeViewClass('plan')}>
                <div className="planner-view-label"><span>01 / TOP VIEW</span><span>SNAP · 1 M</span></div>
                <div className="planner-grid-scroll"><div className="planner-grid" style={{ gridTemplateColumns: 'repeat(' + roomWidth + ', minmax(28px, 1fr))', gridTemplateRows: 'repeat(' + roomLength + ', 42px)' }}>
                  {cells.map((cell) => <button key={cell.key} type="button" className="planner-slot" style={{ gridColumn: cell.x + 1, gridRow: cell.y + 1 } as CSSProperties} aria-label={'Add ' + EQUIPMENT[tool].label + ' at column ' + (cell.x + 1) + ', row ' + (cell.y + 1)} onClick={() => placeAt(tool, cell.x, cell.y)} />)}
                  {items.map((item) => { const config = EQUIPMENT[item.type]; const size = sizeOf(item); const style: CSSProperties = { gridColumn: (item.x + 1) + ' / span ' + size.width, gridRow: (item.y + 1) + ' / span ' + size.depth }; return <button key={item.id} type="button" className={'planner-item planner-item-' + item.type + (selectedId === item.id ? ' is-selected' : '') + (item.rotated ? ' is-rotated' : '')} style={{ ...style, backgroundColor: config.color + '24', borderColor: config.color }} aria-pressed={selectedId === item.id} aria-label={'Select ' + config.label + ', ' + size.width + ' by ' + size.depth + ' metres'} onClick={() => { setSelectedId(item.id); setStatus(config.label + ' selected. It is also highlighted in the 3D preview.'); }}><span style={{ color: config.color }}>{config.mark}</span><small>{config.label}</small></button>; })}
                </div></div>
              </div>
              <div className={'planner-view planner-3d-view' + activeViewClass('3d')}>
                <div className="planner-view-label"><span>02 / PERSPECTIVE VIEW</span><span>DRAG TO ORBIT · SCROLL TO ZOOM</span></div>
                <div className="planner-3d-canvas" ref={previewRef}>
                  <Canvas shadows dpr={[1, 1.5]} camera={{ position: [roomWidth * 0.92, roomHeight * 1.5 + 3, roomLength * 1.05], fov: 38, near: 0.1, far: 120 }} gl={{ antialias: true, powerPreference: 'low-power', preserveDrawingBuffer: true }} fallback={<p>3D preview is not supported by this browser. Use the 2D floor plan.</p>}>
                    <PlannerScene items={items} roomWidth={roomWidth} roomLength={roomLength} roomHeight={roomHeight} selectedId={selectedId} onSelect={(id) => { setSelectedId(id); const item = items.find((entry) => entry.id === id); if (item) setStatus(EQUIPMENT[item.type].label + ' selected in 3D. Use the coordinate fields and move controls to edit it.'); }} />
                    <OrbitControls makeDefault enableDamping dampingFactor={0.12} minPolarAngle={0.12} maxPolarAngle={1.47} minDistance={Math.max(4, roomWidth * 0.35)} maxDistance={Math.max(24, roomWidth * 2.8)} />
                  </Canvas>
                </div>
              </div>
            </div>
            <div className="planner-footer"><div><span>ROOM / APPROXIMATE</span><strong>{roomWidth} × {roomLength} × {roomHeight} m</strong></div><div><span>AREA OCCUPIED</span><strong>{occupiedArea} m² / {fillPercent}%</strong></div><div><span>GEOMETRY CHECK</span><strong>{overlaps ? overlaps + ' WARNINGS' : 'NO OVERLAPS'}</strong></div></div>
            <div className="planner-actions">
              <div className="planner-history-actions"><button type="button" disabled={!past.length} onClick={undo}>↶ UNDO</button><button type="button" disabled={!future.length} onClick={redo}>↷ REDO</button><button type="button" onClick={resetLayout}>CLEAR ROOM</button></div>
              <div className="planner-export-actions"><button type="button" onClick={saveLayout}>SAVE LAYOUT</button><button type="button" onClick={loadLayout}>LOAD SAVED</button><button type="button" onClick={exportJson}>EXPORT JSON</button><button type="button" onClick={() => importRef.current?.click()}>IMPORT JSON</button><button type="button" onClick={exportPlanPng}>EXPORT 2D PNG</button><button type="button" onClick={export3dPng}>EXPORT 3D PNG</button><input ref={importRef} className="planner-file-input" type="file" accept="application/json,.json" aria-label="Import a Kinetik JSON layout" onChange={importLayout} /></div>
            </div>
            <p className="planner-status" role="status" aria-live="polite">{status}</p>
            <p className="planner-note planner-disclaimer">Changes autosave locally in this browser. Explicit save/load also stays on this device; there is no account or cloud sync. Footprints and spacing are approximate concepts, not architectural, accessibility, fire-safety, or manufacturer-clearance approval.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
