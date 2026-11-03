import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { YouthGroup } from '../types';
import { MapPin, Navigation, Eye, CheckCircle2, TrendingUp, ShieldCheck, Sprout, Building, Users } from 'lucide-react';

interface MunicipalityData {
  id: string;
  name: string;
  region: string;
  coordinates: { lat: number; lng: number };
  status: string;
  statusKey: 'active' | 'scaling' | 'planned' | 'horizon';
  activeGroupsCount: number;
  totalMembers: number;
  treesPlanted: number;
  bankingPartner: string;
  readinessScore: number;
  subDivisions: string[];
  notableClusters: string[];
  color: string;
}

interface InteractiveUgandaMapProps {
  groups: YouthGroup[];
  onSelectGroup?: (group: YouthGroup) => void;
}

export const InteractiveUgandaMap: React.FC<InteractiveUgandaMapProps> = ({
  groups,
  onSelectGroup,
}) => {
  const { t, language } = useLanguage();
  const mapT = t.mapSection;

  const [mapMode, setMapMode] = useState<'entebbe' | 'uganda'>('entebbe');
  const [municipalities, setMunicipalities] = useState<MunicipalityData[]>([]);
  const [selectedMunicipalityId, setSelectedMunicipalityId] = useState<string>('entebbe');
  const [selectedGroupId, setSelectedGroupId] = useState<string>(groups[0]?.id || 'ENG-ENT-001');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    async function loadMunicipalities() {
      try {
        const res = await fetch('/api/municipalities');
        if (res.ok) {
          const data = await res.json();
          setMunicipalities(data.municipalities || []);
        }
      } catch (err) {
        console.error('Failed to load municipalities:', err);
      }
    }
    loadMunicipalities();
  }, []);

  const activeMunicipality =
    municipalities.find((m) => m.id === selectedMunicipalityId) || municipalities[0];

  const selectedGroup = groups.find((g) => g.id === selectedGroupId) || groups[0];

  // Coordinates mapping for Greater Entebbe 21 groups relative to SVG canvas (viewBox 0 0 600 440)
  // Entebbe peninsula coordinates mapped into responsive SVG geometry
  const entebbePinCoords: Record<string, { x: number; y: number; parish: string }> = {
    'ENG-ENT-001': { x: 120, y: 320, parish: 'Kigungu Point' },
    'ENG-ENT-002': { x: 280, y: 190, parish: 'Kitoro Central' },
    'ENG-ENT-003': { x: 370, y: 90, parish: 'Katabi Road' },
    'ENG-ENT-004': { x: 310, y: 220, parish: 'Lugonjo Ward' },
    'ENG-ENT-005': { x: 230, y: 280, parish: 'Bugonga Parish' },
    'ENG-ENT-006': { x: 420, y: 60, parish: 'Nkumba University' },
    'ENG-ENT-007': { x: 390, y: 110, parish: 'Abayita Ababiri' },
    'ENG-ENT-008': { x: 180, y: 250, parish: 'Nakiwogo Ferry' },
    'ENG-ENT-009': { x: 460, y: 120, parish: 'Kasenyi Beach' },
    'ENG-ENT-010': { x: 260, y: 160, parish: 'Lunyo Main' },
    'ENG-ENT-011': { x: 240, y: 220, parish: 'Manyago Municipal' },
    'ENG-ENT-012': { x: 350, y: 130, parish: 'Mpala Village' },
    'ENG-ENT-013': { x: 100, y: 300, parish: 'Kigungu North' },
    'ENG-ENT-014': { x: 295, y: 180, parish: 'Kitoro Arcade' },
    'ENG-ENT-015': { x: 430, y: 80, parish: 'Nkumba Quarry' },
    'ENG-ENT-016': { x: 450, y: 40, parish: 'Bwebajja Corridor' },
    'ENG-ENT-017': { x: 320, y: 240, parish: 'Lugonjo Craft' },
    'ENG-ENT-018': { x: 250, y: 200, parish: 'Manyago Green Yard' },
    'ENG-ENT-019': { x: 310, y: 170, parish: 'Airport Road' },
    'ENG-ENT-020': { x: 330, y: 140, parish: 'Kitubulu Lakeshore' },
    'ENG-ENT-021': { x: 340, y: 110, parish: 'Expressway Interchange' },
  };

  // Uganda National SVG Node coordinates (viewBox 0 0 600 440)
  const ugandaNodes = [
    { id: 'gulu', x: 290, y: 90, label: 'Gulu (Northern)', status: 'horizon' },
    { id: 'jinja', x: 360, y: 230, label: 'Jinja (Eastern)', status: 'planned' },
    { id: 'kampala', x: 300, y: 245, label: 'Greater Kampala', status: 'scaling' },
    { id: 'entebbe', x: 295, y: 275, label: 'Greater Entebbe (Pilot)', status: 'active' },
    { id: 'mbarara', x: 180, y: 330, label: 'Mbarara (South-West)', status: 'planned' },
  ];

  const filteredUgandaNodes = statusFilter === 'all'
    ? ugandaNodes
    : ugandaNodes.filter((n) => n.status === statusFilter);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
      
      {/* Top Map Control Bar */}
      <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-50 flex flex-wrap items-center justify-between gap-4">
        
        {/* View Toggle */}
        <div className="flex items-center p-1 bg-slate-200/80 rounded-xl border border-slate-300/70">
          <button
            type="button"
            onClick={() => setMapMode('entebbe')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              mapMode === 'entebbe'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Greater Entebbe Pilot (21 Groups)
          </button>
          <button
            type="button"
            onClick={() => setMapMode('uganda')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              mapMode === 'uganda'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Uganda Nationwide Scaling (5 Hubs)
          </button>
        </div>

        {/* Municipality Quick Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-slate-500 hidden sm:inline">
            {mapT.switchMunicipality}:
          </span>
          <select
            value={selectedMunicipalityId}
            onChange={(e) => {
              setSelectedMunicipalityId(e.target.value);
              if (e.target.value === 'entebbe') {
                setMapMode('entebbe');
              } else {
                setMapMode('uganda');
              }
            }}
            className="text-xs bg-white border border-slate-200 rounded-lg px-3 py-1.5 font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-700"
          >
            {municipalities.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name} ({m.status.split(' ')[0]})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Map Body: Responsive Split Canvas + Detail Drawer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[500px]">
        
        {/* Left Side: Interactive Vector Map Canvas */}
        <div className="lg:col-span-7 bg-slate-950 p-4 sm:p-6 relative flex flex-col justify-between overflow-hidden">
          
          {/* Subtle Grid Watermark / Map Overlay */}
          <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-40 pointer-events-none" />

          {/* Mode Badge & Legend */}
          <div className="relative z-10 flex items-center justify-between gap-2 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span className="font-mono text-emerald-400 font-semibold uppercase tracking-wider text-[11px]">
                {mapMode === 'entebbe' ? 'Greater Entebbe Pilot Grid · 0.0512° N, 32.4637° E' : 'Uganda National Expansion Network'}
              </span>
            </div>

            <span className="text-[11px] bg-slate-900 border border-slate-800 px-2 py-0.5 rounded text-slate-300 font-mono">
              Low-Data SVG Vector
            </span>
          </div>

          {/* SVG Map Render */}
          <div className="relative z-10 my-4 flex-1 flex items-center justify-center">
            {mapMode === 'entebbe' ? (
              /* Entebbe Peninsula Detailed Vector Map */
              <svg
                viewBox="0 0 600 440"
                className="w-full h-auto max-h-[380px] select-none"
                aria-label="Interactive Map of Greater Entebbe pilot groups"
              >
                {/* Lake Victoria Waters Background */}
                <path
                  d="M0,0 L600,0 L600,440 L0,440 Z"
                  fill="#09182a"
                />

                {/* Lake Victoria Wave Contours */}
                <path
                  d="M 20,380 Q 150,360 300,410 T 580,390"
                  fill="none"
                  stroke="#0f2b48"
                  strokeWidth="2"
                  strokeDasharray="4 6"
                />
                <path
                  d="M 50,40 Q 200,80 400,20 T 580,60"
                  fill="none"
                  stroke="#0f2b48"
                  strokeWidth="2"
                  strokeDasharray="4 6"
                />

                {/* Entebbe Peninsula Landmass */}
                <path
                  d="M 220,10 
                     C 380,20 480,50 510,130 
                     C 530,190 480,210 430,220
                     C 380,230 360,280 300,320
                     C 250,350 180,380 90,340
                     C 40,320 60,260 120,240
                     C 170,220 180,180 200,120
                     Z"
                  fill="#13241b"
                  stroke="#1c442c"
                  strokeWidth="3"
                />

                {/* Road Corridor (Expressway to Airport) */}
                <path
                  d="M 450,30 L 350,110 L 290,180 L 190,260 L 110,310"
                  fill="none"
                  stroke="#334155"
                  strokeWidth="3"
                  strokeLinecap="round"
                />

                {/* Lake Victoria shoreline label */}
                <text x="30" y="70" fill="#38bdf8" opacity="0.6" fontSize="12" fontFamily="monospace">
                  Lake Victoria (Nalubaale)
                </text>
                <text x="440" y="320" fill="#38bdf8" opacity="0.5" fontSize="11" fontFamily="monospace">
                  Lakeshore Eco-Zone
                </text>

                {/* Airport Runway Landmark */}
                <g opacity="0.4">
                  <rect x="180" y="270" width="80" height="8" transform="rotate(-30 200 270)" fill="#475569" rx="2" />
                  <text x="140" y="295" fill="#94a3b8" fontSize="9" fontFamily="monospace">Entebbe Int'l Airport</text>
                </g>

                {/* Municipal Division Boundaries */}
                <text x="210" y="90" fill="#94a3b8" fontSize="11" fontWeight="bold">Katabi Town Council</text>
                <text x="260" y="150" fill="#cbd5e1" fontSize="11" fontWeight="bold">Division B (Kitoro / Lunyo)</text>
                <text x="140" y="225" fill="#e2e8f0" fontSize="11" fontWeight="bold">Division A (Kigungu / Bugonga)</text>

                {/* 21 Pilot Group Pins */}
                {groups.map((group) => {
                  const coords = entebbePinCoords[group.id] || { x: 280, y: 200, parish: group.location };
                  const isSelected = group.id === selectedGroupId;
                  const isBanked = group.stage === 'Formalized & Banked';

                  return (
                    <g
                      key={group.id}
                      className="cursor-pointer transition-transform duration-200"
                      onClick={() => {
                        setSelectedGroupId(group.id);
                        if (onSelectGroup) onSelectGroup(group);
                      }}
                    >
                      {/* Outer pulse circle for selected */}
                      {isSelected && (
                        <circle
                          cx={coords.x}
                          cy={coords.y}
                          r="16"
                          fill="none"
                          stroke="#34d399"
                          strokeWidth="2"
                          opacity="0.8"
                        />
                      )}

                      {/* Pin Circle */}
                      <circle
                        cx={coords.x}
                        cy={coords.y}
                        r={isSelected ? 8 : 6}
                        fill={isBanked ? '#10b981' : '#f59e0b'}
                        stroke="#0f172a"
                        strokeWidth="2"
                      />

                      {/* Pin Center Dot */}
                      <circle
                        cx={coords.x}
                        cy={coords.y}
                        r={2.5}
                        fill="#ffffff"
                      />

                      {/* Hover / Selected Label */}
                      {isSelected && (
                        <g>
                          <rect
                            x={coords.x - 65}
                            y={coords.y - 32}
                            width="130"
                            height="22"
                            rx="4"
                            fill="#0f172a"
                            stroke="#334155"
                            strokeWidth="1"
                          />
                          <text
                            x={coords.x}
                            y={coords.y - 17}
                            textAnchor="middle"
                            fill="#f8fafc"
                            fontSize="9"
                            fontWeight="bold"
                            fontFamily="sans-serif"
                          >
                            {group.name.length > 20 ? group.name.slice(0, 18) + '...' : group.name}
                          </text>
                        </g>
                      )}
                    </g>
                  );
                })}
              </svg>
            ) : (
              /* Uganda National Scale Vector Map */
              <svg
                viewBox="0 0 600 440"
                className="w-full h-auto max-h-[380px] select-none"
                aria-label="Uganda National expansion network map"
              >
                {/* Background Map Canvas */}
                <rect width="600" height="440" fill="#09182a" />

                {/* Stylized Uganda Border Geometry */}
                <path
                  d="M 170,120 
                     C 230,60 360,50 430,90 
                     C 480,120 460,200 440,240
                     C 430,280 390,320 340,350
                     C 280,390 190,410 140,370
                     C 100,340 120,290 130,240
                     C 140,190 120,160 170,120
                     Z"
                  fill="#112217"
                  stroke="#1b4d2e"
                  strokeWidth="2.5"
                />

                {/* Lake Victoria in South-East Uganda */}
                <path
                  d="M 280,300 C 330,270 420,270 450,330 C 420,400 320,410 270,360 Z"
                  fill="#0b243d"
                  stroke="#1e3a5f"
                  strokeWidth="1.5"
                />
                <text x="330" y="340" fill="#38bdf8" opacity="0.6" fontSize="11" fontFamily="monospace">
                  Lake Victoria
                </text>

                {/* National Connecting Spine Links */}
                <line x1="295" y1="275" x2="300" y2="245" stroke="#34d399" strokeWidth="2.5" strokeDasharray="3 3" />
                <line x1="300" y1="245" x2="360" y2="230" stroke="#f59e0b" strokeWidth="2" strokeDasharray="3 3" />
                <line x1="300" y1="245" x2="180" y2="330" stroke="#f59e0b" strokeWidth="2" strokeDasharray="3 3" />
                <line x1="300" y1="245" x2="290" y2="90" stroke="#94a3b8" strokeWidth="2" strokeDasharray="3 3" />

                {/* Uganda Expansion Nodes */}
                {filteredUgandaNodes.map((node) => {
                  const isSelected = selectedMunicipalityId === node.id;
                  const muni = municipalities.find((m) => m.id === node.id);

                  return (
                    <g
                      key={node.id}
                      className="cursor-pointer"
                      onClick={() => {
                        setSelectedMunicipalityId(node.id);
                        if (node.id === 'entebbe') setMapMode('entebbe');
                      }}
                    >
                      {/* Pulse Ring */}
                      {isSelected && (
                        <circle
                          cx={node.x}
                          cy={node.y}
                          r="18"
                          fill="none"
                          stroke={node.status === 'active' ? '#34d399' : '#f59e0b'}
                          strokeWidth="2"
                          opacity="0.8"
                        />
                      )}

                      <circle
                        cx={node.x}
                        cy={node.y}
                        r={isSelected ? 10 : 8}
                        fill={
                          node.status === 'active'
                            ? '#10b981'
                            : node.status === 'scaling'
                            ? '#34d399'
                            : node.status === 'planned'
                            ? '#f59e0b'
                            : '#64748b'
                        }
                        stroke="#0f172a"
                        strokeWidth="2"
                      />

                      <circle cx={node.x} cy={node.y} r={3} fill="#ffffff" />

                      {/* Node Label */}
                      <text
                        x={node.x + 14}
                        y={node.y + 4}
                        fill={isSelected ? '#34d399' : '#f8fafc'}
                        fontSize="11"
                        fontWeight="bold"
                        fontFamily="sans-serif"
                      >
                        {node.label}
                      </text>
                    </g>
                  );
                })}
              </svg>
            )}
          </div>

          {/* Map Footer Helper */}
          <div className="relative z-10 pt-3 border-t border-slate-900 flex flex-wrap items-center justify-between text-xs text-slate-400">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span>Formalized & Banked</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <span>Incubation / Skilling</span>
              </span>
            </div>

            <div className="text-[11px] text-slate-500">
              Click any node or group pin to inspect live telemetry
            </div>
          </div>
        </div>

        {/* Right Side: Detailed Municipality or Group Telemetry Dossier */}
        <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between bg-white border-t lg:border-t-0 lg:border-l border-slate-200">
          {mapMode === 'entebbe' ? (
            /* Selected Group Details */
            <div>
              <div className="flex items-center justify-between gap-2 text-xs text-slate-500 mb-2">
                <span className="font-mono font-bold text-emerald-800">{selectedGroup?.id}</span>
                <span className="font-semibold text-xs text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded">
                  {selectedGroup?.stage}
                </span>
              </div>

              <h3 className="text-xl font-bold text-slate-900 mb-1 leading-snug">
                {selectedGroup?.name}
              </h3>

              <div className="flex items-center gap-1.5 text-xs text-slate-600 mb-4">
                <MapPin className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                <span>{selectedGroup?.location}</span>
                <span aria-hidden="true">·</span>
                <span className="text-slate-400">{selectedGroup?.division}</span>
              </div>

              {/* Trade Badge */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 mb-5">
                <span className="block text-[10px] uppercase font-bold text-slate-400 mb-0.5">
                  Artisan Trade Cluster
                </span>
                <span className="text-xs font-semibold text-slate-800">
                  {selectedGroup?.trade}
                </span>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-3 gap-3 py-4 border-t border-b border-slate-100 text-center mb-5">
                <div>
                  <span className="block font-mono text-xl font-extrabold text-slate-900 tabular-nums">
                    {selectedGroup?.memberCount}
                  </span>
                  <span className="text-[10px] uppercase font-semibold text-slate-400">
                    Youth Artisans
                  </span>
                </div>
                <div>
                  <span className="block font-mono text-xl font-extrabold text-slate-900 tabular-nums">
                    {selectedGroup?.womenPercentage}%
                  </span>
                  <span className="text-[10px] uppercase font-semibold text-slate-400">
                    Women Lead
                  </span>
                </div>
                <div>
                  <span className="block font-mono text-xl font-extrabold text-emerald-700 tabular-nums">
                    {selectedGroup?.treesPlanted}
                  </span>
                  <span className="text-[10px] uppercase font-semibold text-slate-400">
                    Trees Planted
                  </span>
                </div>
              </div>

              {/* Financial Account & Leader */}
              <div className="space-y-2 text-xs text-slate-600 mb-6">
                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="text-slate-500">Commercial Bank Account:</span>
                  <span className="font-mono font-bold text-slate-800">{selectedGroup?.bankAccount}</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="text-slate-500">Group Chairperson:</span>
                  <span className="font-semibold text-slate-800">{selectedGroup?.leaderName}</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="text-slate-500">Mobile Money Hotline:</span>
                  <span className="font-mono font-semibold text-slate-800">{selectedGroup?.leaderPhone}</span>
                </div>
              </div>
            </div>
          ) : (
            /* Selected Municipality Expansion Dossier */
            <div>
              <div className="flex items-center justify-between gap-2 text-xs text-slate-500 mb-2">
                <span className="font-mono font-bold text-emerald-800 uppercase tracking-wider">
                  {activeMunicipality?.region}
                </span>
                <span
                  className={`font-semibold text-xs px-2.5 py-0.5 rounded ${
                    activeMunicipality?.statusKey === 'active'
                      ? 'bg-emerald-50 text-emerald-700'
                      : activeMunicipality?.statusKey === 'scaling'
                      ? 'bg-emerald-50 text-emerald-800'
                      : 'bg-amber-50 text-amber-800'
                  }`}
                >
                  {activeMunicipality?.status}
                </span>
              </div>

              <h3 className="text-xl font-bold text-slate-900 mb-1 leading-snug">
                {activeMunicipality?.name}
              </h3>

              <div className="flex items-center gap-2 text-xs text-slate-500 mb-5">
                <span>{mapT.bankingBadge}:</span>
                <strong className="text-slate-700">{activeMunicipality?.bankingPartner}</strong>
              </div>

              {/* Readiness Progress Bar */}
              <div className="mb-6 p-4 bg-slate-50 rounded-xl border border-slate-200/80">
                <div className="flex justify-between text-xs font-semibold mb-1.5">
                  <span className="text-slate-600">{mapT.readiness}</span>
                  <span className="font-mono text-emerald-800 font-extrabold">{activeMunicipality?.readinessScore}%</span>
                </div>
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-emerald-700 h-full rounded-full transition-all duration-500"
                    style={{ width: `${activeMunicipality?.readinessScore}%` }}
                  />
                </div>
              </div>

              {/* KPI Strip */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="block text-[10px] uppercase font-bold text-slate-400">Youth Scale</span>
                  <span className="text-lg font-extrabold text-slate-900 font-mono">
                    {activeMunicipality?.totalMembers.toLocaleString()}
                  </span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="block text-[10px] uppercase font-bold text-slate-400">Reforestation</span>
                  <span className="text-lg font-extrabold text-emerald-800 font-mono">
                    {activeMunicipality?.treesPlanted.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Sub-Divisions */}
              <div className="mb-4">
                <span className="block text-[10px] uppercase font-bold text-slate-400 mb-2">
                  {mapT.subDivisionsHeader}
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {activeMunicipality?.subDivisions.map((sub, sIdx) => (
                    <span
                      key={sIdx}
                      className="text-xs bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md font-medium"
                    >
                      {sub}
                    </span>
                  ))}
                </div>
              </div>

              {/* Notable Clusters */}
              <div className="mb-6">
                <span className="block text-[10px] uppercase font-bold text-slate-400 mb-2">
                  {mapT.clustersHeader}
                </span>
                <div className="space-y-1.5">
                  {activeMunicipality?.notableClusters.map((cl, cIdx) => (
                    <div key={cIdx} className="flex items-center gap-2 text-xs text-slate-600">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0" />
                      <span>{cl}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Bottom Action */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
            {mapMode === 'entebbe' ? (
              <button
                onClick={() => setMapMode('uganda')}
                className="text-xs font-semibold text-emerald-800 hover:text-emerald-700 flex items-center gap-1"
              >
                <span>View Uganda National Roadmap</span>
                <Navigation className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={() => {
                  setSelectedMunicipalityId('entebbe');
                  setMapMode('entebbe');
                }}
                className="text-xs font-semibold text-emerald-800 hover:text-emerald-700 flex items-center gap-1"
              >
                <span>Return to Greater Entebbe Detail</span>
                <Navigation className="w-3.5 h-3.5" />
              </button>
            )}

            <span className="text-[10px] text-slate-400 font-mono">
              Relworx Gateway Ready
            </span>
          </div>
        </div>

      </div>

    </div>
  );
};
