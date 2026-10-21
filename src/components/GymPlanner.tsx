import { useMemo, useRef, useState, type CSSProperties } from 'react';

const COLUMNS = 12;
const ROWS = 8;

const EQUIPMENT = {
  rack: { label: 'Rack', mark: 'R', width: 2, height: 2, area: 4 },
  bench: { label: 'Bench', mark: 'B', width: 2, height: 1, area: 2 },
  dumbbells: { label: 'Weights', mark: 'DB', width: 1, height: 1, area: 1 },
  treadmill: { label: 'Treadmill', mark: 'T', width: 2, height: 1, area: 2 },
  bike: { label: 'Bike', mark: 'C', width: 2, height: 1, area: 2 },
  rower: { label: 'Rower', mark: 'RW', width: 3, height: 1, area: 3 },
  mat: { label: 'Mat', mark: 'M', width: 2, height: 1, area: 2 },
  storage: { label: 'Storage', mark: 'S', width: 1, height: 1, area: 1 },
} as const;

type EquipmentType = keyof typeof EQUIPMENT;
type PlacedItem = { id: number; type: EquipmentType; x: number; y: number; rotated: boolean };

function sizeOf(item: PlacedItem) {
  const config = EQUIPMENT[item.type];
  return item.rotated
    ? { width: config.height, height: config.width }
    : { width: config.width, height: config.height };
}

function initialLayout(): PlacedItem[] {
  return [
    { id: 1, type: 'rack', x: 0, y: 0, rotated: false },
    { id: 2, type: 'bench', x: 3, y: 0, rotated: false },
    { id: 3, type: 'dumbbells', x: 6, y: 0, rotated: false },
    { id: 4, type: 'bike', x: 9, y: 0, rotated: false },
  ];
}

function placementFits(candidate: PlacedItem, existing: PlacedItem[]): boolean {
  const size = sizeOf(candidate);
  if (candidate.x < 0 || candidate.y < 0 || candidate.x + size.width > COLUMNS || candidate.y + size.height > ROWS) return false;
  return existing.every((item) => {
    if (item.id === candidate.id) return true;
    const other = sizeOf(item);
    const separated = candidate.x + size.width <= item.x || item.x + other.width <= candidate.x || candidate.y + size.height <= item.y || item.y + other.height <= candidate.y;
    return separated;
  });
}

export function GymPlanner() {
  const [items, setItems] = useState<PlacedItem[]>(initialLayout);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [tool, setTool] = useState<EquipmentType>('rack');
  const [status, setStatus] = useState('Select an object or choose equipment, then tap a square to place it.');
  const nextId = useRef(5);
  const selectedItem = items.find((item) => item.id === selectedId) ?? null;
  const occupiedArea = useMemo(() => items.reduce((total, item) => total + sizeOf(item).width * sizeOf(item).height, 0), [items]);
  const cells = Array.from({ length: COLUMNS * ROWS }, (_, index) => ({ x: index % COLUMNS, y: Math.floor(index / COLUMNS), key: index }));

  function placeAt(type: EquipmentType, x: number, y: number) {
    const candidate: PlacedItem = { id: nextId.current++, type, x, y, rotated: false };
    if (!placementFits(candidate, items)) {
      setStatus('That footprint overlaps equipment or extends beyond the room. Choose an open area.');
      return;
    }
    setItems((current) => [...current, candidate]);
    setSelectedId(candidate.id);
    setStatus(EQUIPMENT[type].label + ' placed at ' + (x + 1) + ' m, ' + (y + 1) + ' m.');
  }

  function addAtNextOpenSpot(type: EquipmentType) {
    for (let y = 0; y < ROWS; y += 1) {
      for (let x = 0; x < COLUMNS; x += 1) {
        const candidate = { id: nextId.current, type, x, y, rotated: false } as PlacedItem;
        if (placementFits(candidate, items)) {
          placeAt(type, x, y);
          return;
        }
      }
    }
    setStatus('The layout is full. Remove an item or clear the plan before adding more equipment.');
  }

  function rotateSelected() {
    if (!selectedItem) {
      setStatus('Select an item first, then rotate it.');
      return;
    }
    const candidate = { ...selectedItem, rotated: !selectedItem.rotated };
    if (!placementFits(candidate, items)) {
      setStatus('This rotation will overlap a neighbour or leave the room. Move the item first.');
      return;
    }
    setItems((current) => current.map((item) => item.id === candidate.id ? candidate : item));
    setStatus(EQUIPMENT[candidate.type].label + ' rotated.');
  }

  function removeSelected() {
    if (!selectedItem) {
      setStatus('Select an item to remove.');
      return;
    }
    setItems((current) => current.filter((item) => item.id !== selectedItem.id));
    setSelectedId(null);
    setStatus(EQUIPMENT[selectedItem.type].label + ' removed from the sketch.');
  }

  function loadPreset(preset: 'starter' | 'strength' | 'conditioning') {
    const presets: Record<typeof preset, PlacedItem[]> = {
      starter: initialLayout(),
      strength: [
        { id: 1, type: 'rack', x: 0, y: 0, rotated: false },
        { id: 2, type: 'rack', x: 0, y: 3, rotated: false },
        { id: 3, type: 'bench', x: 3, y: 0, rotated: false },
        { id: 4, type: 'bench', x: 3, y: 2, rotated: false },
        { id: 5, type: 'dumbbells', x: 6, y: 0, rotated: false },
        { id: 6, type: 'storage', x: 7, y: 0, rotated: false },
        { id: 7, type: 'mat', x: 8, y: 4, rotated: false },
        { id: 8, type: 'mat', x: 8, y: 6, rotated: false },
      ],
      conditioning: [
        { id: 1, type: 'treadmill', x: 0, y: 0, rotated: false },
        { id: 2, type: 'bike', x: 3, y: 0, rotated: false },
        { id: 3, type: 'rower', x: 6, y: 0, rotated: false },
        { id: 4, type: 'mat', x: 0, y: 3, rotated: false },
        { id: 5, type: 'mat', x: 3, y: 3, rotated: false },
        { id: 6, type: 'dumbbells', x: 6, y: 3, rotated: false },
      ],
    };
    const chosen = presets[preset];
    const valid = chosen.every((item) => placementFits(item, chosen));
    if (!valid) {
      setStatus('Preset safety check failed. The existing layout was left unchanged.');
      return;
    }
    setItems(chosen);
    nextId.current = Math.max(...chosen.map((item) => item.id)) + 1;
    setSelectedId(null);
    setStatus(preset.toUpperCase() + ' concept loaded. Dragging is not required; select and rotate using the controls.');
  }

  const selectedSize = selectedItem ? sizeOf(selectedItem) : null;

  return (
    <section className="section planner-section" id="space" aria-labelledby="space-title">
      <div className="section-shell">
        <div className="section-heading-row">
          <div><p className="eyebrow"><span>03</span> SPACE / PLANNING LAB</p><h2 id="space-title">Make room<br /><em>to move.</em></h2></div>
          <p className="section-intro">Sketch a small training floor, test equipment footprints, and see the usable area update. This browser tool is a concept planner—not a construction or safety-certified layout.</p>
        </div>
        <div className="planner-layout">
          <aside className="planner-sidebar">
            <div className="planner-block"><p className="planner-label">ROOM SIZE</p><div className="room-metric"><strong>12 × 8</strong><span>METRES / 96 m²</span></div><p className="planner-note">Each square represents approximately 1 m × 1 m before equipment clearance.</p></div>
            <div className="planner-block"><p className="planner-label">START WITH A TEMPLATE</p><button type="button" className="preset-button" onClick={() => loadPreset('starter')}>01 / STARTER FLOOR <span>↗</span></button><button type="button" className="preset-button" onClick={() => loadPreset('strength')}>02 / STRENGTH ZONE <span>↗</span></button><button type="button" className="preset-button" onClick={() => loadPreset('conditioning')}>03 / CONDITIONING <span>↗</span></button></div>
            <div className="planner-block"><p className="planner-label">EQUIPMENT PALETTE</p><div className="equipment-palette">{(Object.keys(EQUIPMENT) as EquipmentType[]).map((type) => <button key={type} type="button" className={tool === type ? 'palette-tool is-active' : 'palette-tool'} aria-pressed={tool === type} onClick={() => { setTool(type); setStatus('Selected ' + EQUIPMENT[type].label + '. Tap a room square to place it.'); }}><span>{EQUIPMENT[type].mark}</span><small>{EQUIPMENT[type].label}</small></button>)}</div><button type="button" className="button button-primary full-width" onClick={() => addAtNextOpenSpot(tool)}>ADD {EQUIPMENT[tool].label.toUpperCase()} <span aria-hidden="true">＋</span></button></div>
            <div className="planner-block selected-controls"><p className="planner-label">SELECTED ITEM</p><p className="selected-title">{selectedItem ? EQUIPMENT[selectedItem.type].label : 'Nothing selected'}</p><p className="planner-note">{selectedSize ? selectedSize.width + ' m × ' + selectedSize.height + ' m footprint' : 'Tap an item in the plan to edit it.'}</p><div className="selected-actions"><button type="button" disabled={!selectedItem} onClick={rotateSelected}>ROTATE 90°</button><button type="button" disabled={!selectedItem} onClick={removeSelected}>REMOVE</button></div></div>
          </aside>
          <div className="planner-main">
            <div className="planner-toolbar"><div><span className="live-indicator" /> LIVE LAYOUT</div><div>{items.length} ITEMS / {occupiedArea} m² FOOTPRINT</div><button type="button" className="clear-layout" onClick={() => { setItems([]); setSelectedId(null); setStatus('Room cleared. Select equipment and add a new footprint.'); }}>CLEAR</button></div>
            <div className="planner-grid-scroll"><div className="planner-grid" style={{ gridTemplateColumns: 'repeat(' + COLUMNS + ', minmax(34px, 1fr))', gridTemplateRows: 'repeat(' + ROWS + ', 48px)' }}>
              {cells.map((cell) => <button key={cell.key} type="button" className="planner-slot" style={{ gridColumn: cell.x + 1, gridRow: cell.y + 1 } as CSSProperties} aria-label={'Place ' + EQUIPMENT[tool].label + ' at column ' + (cell.x + 1) + ', row ' + (cell.y + 1)} onClick={() => placeAt(tool, cell.x, cell.y)} />)}
              {items.map((item) => {
                const config = EQUIPMENT[item.type];
                const size = sizeOf(item);
                const style: CSSProperties = { gridColumn: (item.x + 1) + ' / span ' + size.width, gridRow: (item.y + 1) + ' / span ' + size.height };
                return <button key={item.id} type="button" className={'planner-item planner-item-' + item.type + (selectedId === item.id ? ' is-selected' : '') + (item.rotated ? ' is-rotated' : '')} style={style} aria-pressed={selectedId === item.id} aria-label={'Select ' + config.label + ', ' + size.width + ' by ' + size.height + ' metres'} onClick={() => { setSelectedId(item.id); setStatus(config.label + ' selected. Use rotate or remove.'); }}><span>{config.mark}</span><small>{config.label}</small></button>;
              })}
            </div></div>
            <div className="planner-footer"><div><span>USABLE FOOTPRINT ESTIMATE</span><strong>{Math.max(0, 96 - occupiedArea)} m² open</strong></div><div><span>ROOM FILL</span><strong>{Math.round(occupiedArea / 96 * 100)}%</strong></div></div>
            <p className="planner-status" role="status" aria-live="polite">{status}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
