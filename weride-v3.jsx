import { useState, useEffect, useCallback, Fragment } from "react";

/* ═══════════════════════════════════════════════════════
   WERIDE — FULLY INTERACTIVE PROTOTYPE v3.1
   Dual Theme: Day Mode (Outdoor) + Night Mode (Low Light)

   Side-by-side comparison · Shared navigation state
   ═══════════════════════════════════════════════════════ */

// ── Light Theme — "Day Ride" ─────────────────────
// Warm earth tones: leather, cream, copper instrument bezels
// Optimized for: direct sunlight, outdoor stops, glare resistance
const LIGHT = {
  bg: "#FAF7F2", surface: "#fff", elevated: "#F5F0E6", border: "#F0EBE0",
  borderDark: "#E8E2D8", sand: "#DDD6CC", accent: "#C4841D", accentDeep: "#A66B15",
  text: "#1A1612", textSec: "#6B5E50", textMuted: "#9B8E7E",
  green: "#2D8A56", blue: "#4A89F3", red: "#EF4444", amber: "#FBBF24",
  mapLand: "#F2EDE4", mapRoad: "#DDD6CC", mapRoadStroke: "#C8BFB2",
  mapWater: "#BDD4E8", mapPark: "#D4E4CB", mapBldg: "#E8E2D8",
  font: "'Outfit',sans-serif", serif: "'DM Serif Display',Georgia,serif",
  // Theme-specific overrides
  hudBg: "rgba(250,247,242,0.88)", hudBgSolid: "rgba(250,247,242,0.94)",
  mapDim: "rgba(250,247,242,0.55)", sheetShadow: "0 -4px 30px rgba(26,22,18,0.08)",
  cardShadow: "0 2px 12px rgba(26,22,18,0.1)", fabShadow: "0 6px 24px rgba(196,132,29,0.35)",
  greenTint: "rgba(45,138,86,0.1)", accentTint: "rgba(196,132,29,0.08)",
  isDark: false,
};

// ── Dark Theme — "Night Ride" ────────────────────
// Warm charcoal + copper glow: instrument cluster at night
// Optimized for: dusk/night rides, OLED battery life, reduced eye strain
const DARK = {
  bg: "#141110", surface: "#1E1B17", elevated: "#282420", border: "#332E28",
  borderDark: "#2A2622", sand: "#3E3830", accent: "#D99A30", accentDeep: "#C4841D",
  text: "#F2EDE4", textSec: "#B0A594", textMuted: "#7A6E5E",
  green: "#3DA566", blue: "#6AA3FF", red: "#FF6B6B", amber: "#FFD54F",
  mapLand: "#181512", mapRoad: "#302A22", mapRoadStroke: "#252018",
  mapWater: "#162840", mapPark: "#182818", mapBldg: "#221E18",
  font: "'Outfit',sans-serif", serif: "'DM Serif Display',Georgia,serif",
  // Theme-specific overrides
  hudBg: "rgba(20,17,16,0.90)", hudBgSolid: "rgba(20,17,16,0.94)",
  mapDim: "rgba(20,17,16,0.60)", sheetShadow: "0 -4px 30px rgba(0,0,0,0.30)",
  cardShadow: "0 2px 12px rgba(0,0,0,0.25)", fabShadow: "0 6px 24px rgba(217,154,48,0.30)",
  greenTint: "rgba(61,165,102,0.15)", accentTint: "rgba(217,154,48,0.12)",
  isDark: true,
};

// ── Hex-only tokens (editable via color picker) ──
const LIGHT_HEX = {
  bg: "#FAF7F2", surface: "#ffffff", elevated: "#F5F0E6", border: "#F0EBE0",
  borderDark: "#E8E2D8", sand: "#DDD6CC", accent: "#C4841D", accentDeep: "#A66B15",
  text: "#1A1612", textSec: "#6B5E50", textMuted: "#9B8E7E",
  green: "#2D8A56", blue: "#4A89F3", red: "#EF4444", amber: "#FBBF24",
  mapLand: "#F2EDE4", mapRoad: "#DDD6CC", mapRoadStroke: "#C8BFB2",
  mapWater: "#BDD4E8", mapPark: "#D4E4CB", mapBldg: "#E8E2D8",
};
const DARK_HEX = {
  bg: "#141110", surface: "#1E1B17", elevated: "#282420", border: "#332E28",
  borderDark: "#2A2622", sand: "#3E3830", accent: "#D99A30", accentDeep: "#C4841D",
  text: "#F2EDE4", textSec: "#B0A594", textMuted: "#7A6E5E",
  green: "#3DA566", blue: "#6AA3FF", red: "#FF6B6B", amber: "#FFD54F",
  mapLand: "#181512", mapRoad: "#302A22", mapRoadStroke: "#252018",
  mapWater: "#162840", mapPark: "#182818", mapBldg: "#221E18",
};

// Groups for the color picker UI
const TOKEN_GROUPS = [
  { name: "Surfaces", keys: ["bg", "surface", "elevated", "border", "borderDark", "sand"] },
  { name: "Accents", keys: ["accent", "accentDeep"] },
  { name: "Text", keys: ["text", "textSec", "textMuted"] },
  { name: "Semantic", keys: ["green", "blue", "red", "amber"] },
  { name: "Map", keys: ["mapLand", "mapRoad", "mapRoadStroke", "mapWater", "mapPark", "mapBldg"] },
];

// Derive full theme object from hex tokens
const hexToRgb = (hex) => {
  const h = hex.replace("#", "");
  return [parseInt(h.slice(0,2),16), parseInt(h.slice(2,4),16), parseInt(h.slice(4,6),16)];
};
const buildTheme = (hex, isDark) => {
  const [bgR,bgG,bgB] = hexToRgb(hex.bg);
  const [acR,acG,acB] = hexToRgb(hex.accent);
  const [grR,grG,grB] = hexToRgb(hex.green);
  return {
    ...hex,
    font: "'Outfit',sans-serif", serif: "'DM Serif Display',Georgia,serif",
    hudBg: `rgba(${bgR},${bgG},${bgB},${isDark ? 0.90 : 0.88})`,
    hudBgSolid: `rgba(${bgR},${bgG},${bgB},0.94)`,
    mapDim: `rgba(${bgR},${bgG},${bgB},${isDark ? 0.60 : 0.55})`,
    sheetShadow: isDark ? "0 -4px 30px rgba(0,0,0,0.30)" : "0 -4px 30px rgba(26,22,18,0.08)",
    cardShadow: isDark ? "0 2px 12px rgba(0,0,0,0.25)" : "0 2px 12px rgba(26,22,18,0.1)",
    fabShadow: `0 6px 24px rgba(${acR},${acG},${acB},${isDark ? 0.30 : 0.35})`,
    greenTint: `rgba(${grR},${grG},${grB},${isDark ? 0.15 : 0.1})`,
    accentTint: `rgba(${acR},${acG},${acB},${isDark ? 0.12 : 0.08})`,
    isDark,
  };
};

// backward compat for any stray references
const T = LIGHT;

// ── Reusable Components (theme-aware) ────────────
const BPIGauge = ({ score = 82, size = 140, t = LIGHT }) => {
  const [a, setA] = useState(0);
  useEffect(() => { const tm = setTimeout(() => setA(score), 400); return () => clearTimeout(tm); }, [score]);
  const r = size * 0.38, cx = size / 2, cy = size * 0.52, sa = -210, ea = 30, range = ea - sa;
  const sA = sa + (range * a) / 100;
  const pt = (ang, rad) => ({ x: cx + rad * Math.cos((ang * Math.PI) / 180), y: cy + rad * Math.sin((ang * Math.PI) / 180) });
  const arc = (f, to, rad) => { const s = pt(f, rad), e = pt(to, rad); return `M ${s.x} ${s.y} A ${rad} ${rad} 0 ${to - f > 180 ? 1 : 0} 1 ${e.x} ${e.y}`; };
  const col = a >= 75 ? t.green : a >= 50 ? t.accent : t.red;
  const lab = a >= 85 ? "Excellent" : a >= 70 ? "Good" : a >= 50 ? "Fair" : "Service Due";
  return (
    <svg width={size} height={size * 0.65} viewBox={`0 0 ${size} ${size * 0.65}`}>
      <path d={arc(sa, ea, r)} fill="none" stroke={t.borderDark} strokeWidth={size * 0.055} strokeLinecap="round" />
      <path d={arc(sa, sA, r)} fill="none" stroke={col} strokeWidth={size * 0.055} strokeLinecap="round" style={{ transition: "all 1.2s cubic-bezier(0.34,1.56,0.64,1)" }} />
      <text x={cx} y={cy - 2} textAnchor="middle" style={{ fontSize: size * 0.21, fontFamily: t.serif, fill: t.text }}>{a}</text>
      <text x={cx} y={cy + size * 0.1} textAnchor="middle" style={{ fontSize: size * 0.07, fontFamily: t.font, fill: col, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" }}>{lab}</text>
    </svg>
  );
};

const XPRing = ({ level = 12, xp = 7400, next = 10000, size = 100, t = LIGHT }) => {
  const [a, setA] = useState(0);
  useEffect(() => { const tm = setTimeout(() => setA(xp / next), 400); return () => clearTimeout(tm); }, [xp, next]);
  const r = size * 0.4, cx = size / 2, cy = size / 2, circ = 2 * Math.PI * r;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={t.border} strokeWidth={size * 0.06} />
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={t.accent} strokeWidth={size * 0.06} strokeLinecap="round" strokeDasharray={`${circ * a} ${circ * (1 - a)}`} transform={`rotate(-90 ${cx} ${cy})`} style={{ transition: "stroke-dasharray 1.4s cubic-bezier(0.34,1.56,0.64,1)" }} />
      <text x={cx} y={cy + 1} textAnchor="middle" dominantBaseline="central" style={{ fontSize: size * 0.28, fontFamily: t.serif, fill: t.text }}>{level}</text>
    </svg>
  );
};

const Avatars = ({ riders, size = 32, t = LIGHT }) => (
  <div style={{ display: "flex", alignItems: "center" }}>
    {riders.slice(0, 4).map((r, i) => (
      <div key={i} style={{ width: size, height: size, borderRadius: "50%", background: r.c, border: `2px solid ${t.bg}`, marginLeft: i ? -8 : 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: size * 0.36, color: "#fff", fontWeight: 600, fontFamily: t.font, position: "relative", zIndex: 5 - i }}>{r.n}</div>
    ))}
    {riders.length > 4 && <div style={{ width: size, height: size, borderRadius: "50%", background: t.borderDark, border: `2px solid ${t.bg}`, marginLeft: -8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: size * 0.32, color: t.textSec, fontWeight: 600, fontFamily: t.font }}>+{riders.length - 4}</div>}
  </div>
);

const R = [
  { n: "AK", c: "#C4841D" }, { n: "RJ", c: "#2D8A56" }, { n: "PM", c: "#8B5E3C" },
  { n: "VT", c: "#6B5E50" }, { n: "NS", c: "#C44B2D" }, { n: "DK", c: "#1A1612" }, { n: "SM", c: "#9B7B5E" },
];

// ── Status Bar ─────────────────────────────────
const SBar = ({ dark, t = LIGHT }) => {
  const col = dark ? t.bg : t.text;
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 24px 0", color: col, fontFamily: t.font, fontSize: 12, fontWeight: 600, flexShrink: 0 }}>
      <span>9:41</span>
      <div style={{ display: "flex", gap: 5 }}>
        <svg width="15" height="10" viewBox="0 0 15 10" fill="none"><rect x="0" y="5" width="3" height="5" rx=".5" fill={col}/><rect x="4" y="3" width="3" height="7" rx=".5" fill={col}/><rect x="8" y="1" width="3" height="9" rx=".5" fill={col}/><rect x="12" y="0" width="3" height="10" rx=".5" fill={col} opacity=".3"/></svg>
        <svg width="16" height="10" viewBox="0 0 16 10" fill={col}><rect x="0" y="0" width="14" height="10" rx="2" fill="none" stroke={col} strokeWidth="1"/><rect x="1.5" y="1.5" width="9" height="7" rx="1"/><rect x="14.5" y="3" width="1.5" height="4" rx=".5"/></svg>
      </div>
    </div>
  );
};

// ── Back Button ────────────────────────────────
const Back = ({ onPress, label = "Back", t = LIGHT }) => (
  <button onClick={onPress} style={{ display: "flex", alignItems: "center", gap: 4, background: "none", border: "none", padding: "8px 0", cursor: "pointer" }}>
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={t.text} strokeWidth="2" strokeLinecap="round"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
    <span style={{ fontFamily: t.font, fontSize: 13, color: t.text, fontWeight: 500 }}>{label}</span>
  </button>
);

// ── Tab Bar ────────────────────────────────────
const TabBar = ({ active, onTab, t = LIGHT }) => {
  const tabs = [
    { id: "home", label: "Rides", d: "M3 12h3l3-9 4 18 3-9h5" },
    { id: "garage", label: "Garage", d: "M7 17a3 3 0 110-6 3 3 0 010 6zm10 0a3 3 0 110-6 3 3 0 010 6zM10 17h4M5 14l2-5h6l3 5" },
    { id: "xp", label: "XP", d: "M12 2l3 7h7l-5.5 4.5L18 21l-6-4.5L6 21l1.5-7.5L2 9h7z" },
    { id: "profile", label: "Profile", d: "M12 8a4 4 0 100-8 4 4 0 000 8zM4 20c0-4 3.5-7 8-7s8 3 8 7" },
  ];
  return (
    <div style={{ display: "flex", justifyContent: "space-around", alignItems: "center", padding: "8px 0 22px", background: t.bg, borderTop: `1px solid ${t.borderDark}`, flexShrink: 0 }}>
      {tabs.map(tb => (
        <button key={tb.id} onClick={() => onTab(tb.id)} style={{ background: "none", border: "none", display: "flex", flexDirection: "column", alignItems: "center", gap: 3, cursor: "pointer", padding: "4px 12px" }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={active === tb.id ? t.accent : t.textMuted} strokeWidth={active === tb.id ? 2.2 : 1.6} strokeLinecap="round" strokeLinejoin="round"><path d={tb.d} /></svg>
          <span style={{ fontFamily: t.font, fontSize: 9, fontWeight: active === tb.id ? 700 : 500, color: active === tb.id ? t.accent : t.textMuted }}>{tb.label}</span>
        </button>
      ))}
    </div>
  );
};

// ── Cloud Styled Map ───────────────────────────
const MapBG = ({ children, dim = false, t = LIGHT }) => (
  <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
    <div style={{ position: "absolute", inset: 0, background: t.mapLand }} />
    <svg width="100%" height="100%" viewBox="0 0 290 628" style={{ position: "absolute" }}>
      <rect x="20" y="80" width="30" height="22" rx="2" fill={t.mapBldg} opacity=".4" />
      <rect x="60" y="90" width="18" height="28" rx="2" fill={t.mapBldg} opacity=".4" />
      <rect x="200" y="120" width="40" height="20" rx="2" fill={t.mapBldg} opacity=".4" />
      <rect x="220" y="340" width="35" height="25" rx="2" fill={t.mapBldg} opacity=".4" />
      <rect x="30" y="380" width="25" height="35" rx="2" fill={t.mapBldg} opacity=".4" />
      <rect x="180" y="450" width="28" height="18" rx="2" fill={t.mapBldg} opacity=".4" />
      <ellipse cx="55" cy="160" rx="35" ry="25" fill={t.mapPark} opacity=".5" />
      <ellipse cx="240" cy="420" rx="40" ry="30" fill={t.mapPark} opacity=".4" />
      <ellipse cx="230" cy="190" rx="38" ry="18" fill={t.mapWater} opacity=".4" />
      <path d="M-20 220 Q80 200 145 265 Q210 330 310 300" fill="none" stroke={t.mapRoadStroke} strokeWidth="16" strokeLinecap="round" />
      <path d="M-20 220 Q80 200 145 265 Q210 330 310 300" fill="none" stroke={t.mapRoad} strokeWidth="13" strokeLinecap="round" />
      <path d="M70 0 Q80 120 130 220 Q170 300 150 420 Q130 520 160 628" fill="none" stroke={t.mapRoadStroke} strokeWidth="10" strokeLinecap="round" />
      <path d="M70 0 Q80 120 130 220 Q170 300 150 420 Q130 520 160 628" fill="none" stroke={t.mapRoad} strokeWidth="7" strokeLinecap="round" />
      <path d="M0 350 Q60 340 120 360 Q180 380 240 360 Q270 350 290 355" fill="none" stroke={t.mapRoad} strokeWidth="5" strokeLinecap="round" />
      <text x="180" y="215" style={{ fontSize: 7, fontFamily: "Roboto,Arial,sans-serif", fill: t.textMuted }}>{t.isDark ? "" : "NH 66"}</text>
      <text x="6" y="620" style={{ fontSize: 6, fontFamily: "Roboto,Arial,sans-serif", fill: t.textMuted, opacity: 0.7 }}>Google</text>
      {children}
    </svg>
    {dim && <div style={{ position: "absolute", inset: 0, background: t.mapDim }} />}
  </div>
);

const MapMarker = ({ x, y, initials, color, big, status, t = LIGHT }) => (
  <g transform={`translate(${x},${y})`}>
    {big && <circle r="14" fill={color} opacity=".1"><animate attributeName="r" values="14;20;14" dur="2s" repeatCount="indefinite" /></circle>}
    <circle r={big ? 10 : 7} fill={color} /><circle r={big ? 10 : 7} fill="none" stroke={t.bg} strokeWidth="2" />
    <text textAnchor="middle" dy="3" style={{ fontSize: big ? 7 : 5.5, fill: t.bg, fontWeight: 700, fontFamily: t.font }}>{initials}</text>
    {status && <circle cx={big ? 8 : 6} cy={big ? -6 : -4} r="3" fill={status} stroke={t.bg} strokeWidth="1.5" />}
  </g>
);

// ── Style Helpers (theme-aware) ────────────────
const btnP = (t) => ({ width: "100%", padding: "15px 0", borderRadius: 14, border: "none", background: `linear-gradient(135deg, ${t.accent} 0%, ${t.accentDeep} 100%)`, color: t.isDark ? "#fff" : t.bg, fontFamily: t.font, fontSize: 15, fontWeight: 600, cursor: "pointer", letterSpacing: "0.01em" });
const btnS = (t) => ({ ...btnP(t), background: "none", border: `1.5px solid ${t.accent}`, color: t.accent });
const lbl = (t) => ({ fontFamily: t.font, fontSize: 10, color: t.textMuted, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", display: "block", marginBottom: 8 });
const sHandle = (t) => <div style={{ width: 36, height: 4, borderRadius: 2, background: t.borderDark, margin: "0 auto 16px" }} />;

// ── Ride Data ──────────────────────────────────
const RIDES = [
  { id: 1, title: "Coastal Highway Run", from: "Pune", to: "Goa", date: "Mar 25", time: "6:00 AM", dist: "248 km", dur: "~4.5h", riders: R.slice(0, 7), xp: 120, creator: "Arjun K.", open: true, yours: true },
  { id: 2, title: "Western Ghats Loop", from: "Mumbai", to: "Lonavala", date: "Mar 28", time: "5:30 AM", dist: "165 km", dur: "~3h", riders: R.slice(2, 6), xp: 85, creator: "Priya M.", open: true, yours: false },
  { id: 3, title: "Temple Circuit", from: "Bangalore", to: "Hampi", date: "Apr 2", time: "4:00 AM", dist: "340 km", dur: "~6h", riders: R.slice(0, 3), xp: 180, creator: "Raj J.", open: true, yours: false },
  { id: 4, title: "Nilgiri Twisties", from: "Coimbatore", to: "Ooty", date: "Apr 5", time: "6:30 AM", dist: "90 km", dur: "~2.5h", riders: R.slice(1, 5), xp: 65, creator: "Vikram T.", open: true, yours: false },
];

const STOPS = [
  { name: "Pune, Swargate", type: "start", time: "6:00 AM" },
  { name: "Tamhini Ghat", type: "scenic", time: "7:15 AM" },
  { name: "Mahabaleshwar", type: "regroup", time: "8:30 AM" },
  { name: "Amboli Falls", type: "scenic", time: "10:45 AM" },
  { name: "Goa, Panaji", type: "end", time: "11:30 AM" },
];

const SCENIC = [
  { name: "Tamhini Ghat", dist: "12km", sel: true, color: "#8B9E7A" },
  { name: "Varandha Ghat", dist: "48km", sel: true, color: "#A08B6E" },
  { name: "Koyna Dam View", dist: "82km", sel: false, color: "#7A8E9E" },
  { name: "Amboli Falls", dist: "156km", sel: true, color: "#6B9E7A" },
];

const BIKES = [
  { name: "Royal Enfield", model: "Interceptor 650 · 2024", bpi: 82, dist: "12,480 km", rides: "34", service: "12 Mar", primary: true, grad: `linear-gradient(135deg, #E8E2D8, #D8CFC0)`, gradDark: `linear-gradient(135deg, #2A2620, #1E1B17)` },
  { name: "KTM", model: "Duke 390 · 2023", bpi: 61, dist: "8,720 km", rides: "21", service: "Overdue", primary: false, grad: `linear-gradient(135deg, #D8E0E8, #C8D0D8)`, gradDark: `linear-gradient(135deg, #1E2228, #181C20)` },
];

const ACHIEVEMENTS = [
  { icon: "🏔️", name: "Mountain Goat", desc: "Complete 5 mountain rides", p: 4, t: 5, xp: 200, done: false },
  { icon: "🌊", name: "Coastal Cruiser", desc: "Ride 500km along coastline", p: 500, t: 500, xp: 300, done: true },
  { icon: "🏁", name: "Pack Leader", desc: "Create & lead 10 group rides", p: 7, t: 10, xp: 250, done: false },
  { icon: "🔧", name: "Grease Monkey", desc: "Log 20 service records", p: 20, t: 20, xp: 150, done: true },
  { icon: "🌅", name: "Scenic Hunter", desc: "Visit 25 scenic spots", p: 18, t: 25, xp: 200, done: false },
  { icon: "⚡", name: "Century Rider", desc: "Complete a 100km+ ride", p: 1, t: 1, xp: 100, done: true },
];

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   MAIN APP — Dual-Theme Side-by-Side Comparison
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
export default function App() {
  const [flow, setFlow] = useState("splash");
  const [obStep, setObStep] = useState(1);
  const [tab, setTab] = useState("home");
  const [stack, setStack] = useState([]);
  const [selectedRide, setSelectedRide] = useState(null);
  const [selectedBike, setSelectedBike] = useState(null);
  const [homeSheet, setHomeSheet] = useState("peek");
  const [rideTab, setRideTab] = useState("upcoming");
  const [joinedRides, setJoinedRides] = useState([1]);
  const [scenicToggles, setScenicToggles] = useState([true, true, false, true]);
  const [liveStarted, setLiveStarted] = useState(false);

  // ── Color token state (editable via picker) ──
  const [lightHex, setLightHex] = useState(LIGHT_HEX);
  const [darkHex, setDarkHex] = useState(DARK_HEX);
  const [pickerOpen, setPickerOpen] = useState(false);
  const lightTheme = buildTheme(lightHex, false);
  const darkTheme = buildTheme(darkHex, true);

  const updateLight = useCallback((key, val) => setLightHex(h => ({ ...h, [key]: val })), []);
  const updateDark = useCallback((key, val) => setDarkHex(h => ({ ...h, [key]: val })), []);
  const resetTokens = useCallback(() => { setLightHex(LIGHT_HEX); setDarkHex(DARK_HEX); }, []);

  // Navigation helpers
  const push = (screen, data) => setStack(s => [...s, { screen, data }]);
  const pop = () => setStack(s => s.slice(0, -1));
  const currentSub = stack.length > 0 ? stack[stack.length - 1] : null;
  const switchTab = (t) => { setTab(t); setStack([]); setHomeSheet("peek"); };

  // Auto-advance splash
  useEffect(() => {
    if (flow === "splash") {
      const tm = setTimeout(() => setFlow("onboard"), 1800);
      return () => clearTimeout(tm);
    }
  }, [flow]);

  // ── Ride Card Component ────────────────────
  const RideCard = ({ ride, compact = false, t }) => {
    const joined = joinedRides.includes(ride.id);
    return (
      <button onClick={() => { setSelectedRide(ride); push("rideDetail"); }} style={{ width: "100%", background: t.surface, borderRadius: 16, border: `1px solid ${t.border}`, padding: compact ? "12px 14px" : "14px 16px", textAlign: "left", cursor: "pointer", marginBottom: 10, display: "block" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
          <div style={{ flex: 1 }}>
            <p style={{ fontFamily: t.serif, fontSize: compact ? 15 : 16, color: t.text, margin: 0 }}>{ride.title}</p>
            <p style={{ fontFamily: t.font, fontSize: 11, color: t.textMuted, margin: "3px 0 0" }}>{ride.from} → {ride.to}</p>
          </div>
          {joined && <div style={{ background: t.greenTint, padding: "3px 8px", borderRadius: 6, fontFamily: t.font, fontSize: 9, color: t.green, fontWeight: 700, letterSpacing: "0.04em" }}>JOINED</div>}
          {!joined && ride.open && <div style={{ background: t.accentTint, padding: "3px 8px", borderRadius: 6, fontFamily: t.font, fontSize: 9, color: t.accent, fontWeight: 700, letterSpacing: "0.04em" }}>OPEN</div>}
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <span style={{ fontFamily: t.font, fontSize: 11, color: t.textSec }}>{ride.date} · {ride.time}</span>
            <span style={{ fontFamily: t.font, fontSize: 11, color: t.accent, fontWeight: 600 }}>+{ride.xp} XP</span>
          </div>
          <Avatars riders={ride.riders} size={24} t={t} />
        </div>
      </button>
    );
  };

  // ══════════════════════════════════════════════
  //  SCREEN RENDERERS (all receive theme `t`)
  // ══════════════════════════════════════════════

  // ── Splash ─────────────────────────────────
  const renderSplash = (t) => (
    <div style={{ width: "100%", height: "100%", background: t.isDark ? `linear-gradient(165deg, ${t.bg} 0%, #1E1A14 100%)` : `linear-gradient(165deg, ${t.bg} 0%, #F0E8DA 100%)`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
      <div style={{ position: "absolute", inset: 0, opacity: 0.025, backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none'%3E%3Cg fill='%23${t.isDark ? "fff" : "000"}'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }} />
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none"><path d="M8 36C8 36 12 16 24 16C36 16 40 36 40 36" stroke={t.accent} strokeWidth="3" strokeLinecap="round"/><circle cx="12" cy="36" r="6" stroke={t.text} strokeWidth="2.5" fill="none"/><circle cx="36" cy="36" r="6" stroke={t.text} strokeWidth="2.5" fill="none"/><path d="M20 20L24 12L28 20" stroke={t.accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
      <span style={{ fontFamily: t.serif, fontSize: 28, color: t.text, letterSpacing: "-0.02em", marginTop: 6 }}>WeRide</span>
      <span style={{ fontFamily: t.font, fontSize: 10, color: t.textMuted, letterSpacing: "0.2em", textTransform: "uppercase", fontWeight: 500, marginTop: 4 }}>Ride Together</span>
    </div>
  );

  // ── Onboarding ─────────────────────────────
  const renderOnboard = (t) => {
    const data = {
      1: { title: "Ride Together,\nNever Apart", desc: "Plan group rides, set regrouping points, and keep your pack together.", grad: t.isDark ? `linear-gradient(180deg, #1E1A14 0%, ${t.bg} 100%)` : "linear-gradient(180deg, #F5EDE0 0%, #FAF7F2 100%)",
        vis: <svg width="200" height="160" viewBox="0 0 220 180"><path d="M30 160 Q60 100 110 80 Q160 60 190 10" fill="none" stroke={t.borderDark} strokeWidth="24" strokeLinecap="round"/><path d="M30 160 Q60 100 110 80 Q160 60 190 10" fill="none" stroke={t.border} strokeWidth="20" strokeLinecap="round"/><path d="M30 160 Q60 100 110 80 Q160 60 190 10" fill="none" stroke={t.accent} strokeWidth="1.5" strokeDasharray="8 12"/>{[[75,128,t.accent],[100,95,t.green],[140,68,"#8B5E3C"]].map(([cx,cy,c],i)=><g key={i}><circle cx={cx} cy={cy} r="10" fill={c} opacity=".9"/><circle cx={cx} cy={cy} r="5.5" fill={t.bg}/></g>)}<rect x="168" y="16" width="2" height="20" fill={t.text} rx="1"/><path d="M170 16L184 22L170 28Z" fill={t.accent}/></svg> },
      2: { title: "Discover the\nScenic Way", desc: "Our scenic engine finds breathtaking stops along your route. You choose.", grad: t.isDark ? `linear-gradient(180deg, #141E14 0%, ${t.bg} 100%)` : "linear-gradient(180deg, #E8F0E4 0%, #FAF7F2 100%)",
        vis: <svg width="200" height="160" viewBox="0 0 220 180"><path d="M0 160 L50 50 L90 110 L130 30 L180 90 L220 55 L220 180 L0 180Z" fill={t.borderDark} opacity=".4"/><path d="M30 150 Q80 110 110 100 Q150 88 190 60" fill="none" stroke={t.isDark ? "#4A8A40" : "#6B9B5E"} strokeWidth="3" strokeLinecap="round"/>{[[72,114],[118,94],[162,70]].map(([x,y],i)=><g key={i} transform={`translate(${x},${y}) rotate(45)`}><rect width="12" height="12" fill={t.accent} rx="2"/></g>)}</svg> },
      3: { title: "Earn XP,\nUnlock Rewards", desc: "Every kilometer counts. Level up, unlock seasons, and earn partner rewards.", grad: t.isDark ? `linear-gradient(180deg, #1E1814 0%, ${t.bg} 100%)` : "linear-gradient(180deg, #F0E8DA 0%, #FAF7F2 100%)",
        vis: <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}><XPRing level={12} xp={7400} next={10000} size={110} t={t} /><div style={{ display: "flex", gap: 8 }}>{["🏔️","🌊","🏁"].map((e,i)=><div key={i} style={{ width: 34, height: 34, borderRadius: 10, background: t.border, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, border: i===0?`1.5px solid ${t.accent}`:`1.5px solid ${t.borderDark}` }}>{e}</div>)}</div></div> },
    };
    const c = data[obStep];
    return (
      <div style={{ width: "100%", height: "100%", background: t.bg, display: "flex", flexDirection: "column" }}>
        <SBar t={t} />
        <button onClick={() => setFlow("auth")} style={{ position: "absolute", top: 44, right: 24, zIndex: 10, background: "none", border: "none", cursor: "pointer" }}><span style={{ fontFamily: t.font, fontSize: 13, color: t.textMuted, fontWeight: 500 }}>Skip</span></button>
        <div style={{ width: "100%", height: 240, display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
          <div style={{ position: "absolute", inset: 0, background: c.grad }} />
          <div style={{ position: "relative", zIndex: 1 }}>{c.vis}</div>
        </div>
        <div style={{ flex: 1, padding: "24px 28px 0" }}>
          <h1 style={{ fontFamily: t.serif, fontSize: 28, color: t.text, lineHeight: 1.15, margin: 0, whiteSpace: "pre-line", letterSpacing: "-0.02em" }}>{c.title}</h1>
          <p style={{ fontFamily: t.font, fontSize: 14, color: t.textSec, lineHeight: 1.6, margin: "12px 0 0" }}>{c.desc}</p>
        </div>
        <div style={{ padding: "0 28px 20px", display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ display: "flex", gap: 6, justifyContent: "center" }}>
            {[1,2,3].map(d => <div key={d} style={{ width: d===obStep?20:6, height: 6, borderRadius: 3, background: d===obStep?t.accent:t.borderDark, transition: "all .3s" }} />)}
          </div>
          {obStep < 3 ? (
            <button onClick={() => setObStep(s => s + 1)} style={btnP(t)}>Next</button>
          ) : (
            <button onClick={() => setFlow("auth")} style={btnP(t)}>Get Started</button>
          )}
        </div>
      </div>
    );
  };

  // ── Auth ───────────────────────────────────
  const renderAuth = (t) => (
    <div style={{ width: "100%", height: "100%", background: t.bg, display: "flex", flexDirection: "column" }}>
      <SBar t={t} />
      <div style={{ flex: 1, padding: "36px 28px 0" }}>
        <svg width="32" height="32" viewBox="0 0 48 48" fill="none"><path d="M8 36C8 36 12 16 24 16C36 16 40 36 40 36" stroke={t.accent} strokeWidth="3" strokeLinecap="round"/><circle cx="12" cy="36" r="5" stroke={t.text} strokeWidth="2" fill="none"/><circle cx="36" cy="36" r="5" stroke={t.text} strokeWidth="2" fill="none"/></svg>
        <h1 style={{ fontFamily: t.serif, fontSize: 28, color: t.text, margin: "16px 0 6px" }}>Welcome to<br/>the pack.</h1>
        <p style={{ fontFamily: t.font, fontSize: 14, color: t.textMuted, margin: "0 0 32px" }}>Sign in or create your account</p>
        <div style={{ marginBottom: 24 }}>
          <label style={lbl(t)}>Phone or Email</label>
          <div style={{ borderBottom: `2px solid ${t.accent}`, paddingBottom: 10 }}><span style={{ fontFamily: t.font, fontSize: 16, color: t.text }}>+91 98765 43210</span></div>
        </div>
        <button onClick={() => setFlow("otp")} style={{ ...btnP(t), marginBottom: 24 }}>Continue</button>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}><div style={{ flex: 1, height: 1, background: t.borderDark }}/><span style={{ fontFamily: t.font, fontSize: 12, color: t.textMuted }}>or</span><div style={{ flex: 1, height: 1, background: t.borderDark }}/></div>
        {["Continue with Google","Continue with Apple"].map((l,i) => <button key={i} onClick={() => setFlow("main")} style={{ width: "100%", padding: "14px 0", borderRadius: 14, border: `1.5px solid ${t.borderDark}`, background: t.surface, fontFamily: t.font, fontSize: 14, fontWeight: 500, color: t.text, cursor: "pointer", marginBottom: 10, display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>{l}</button>)}
      </div>
    </div>
  );

  // ── OTP ────────────────────────────────────
  const renderOTP = (t) => (
    <div style={{ width: "100%", height: "100%", background: t.bg, display: "flex", flexDirection: "column" }}>
      <SBar t={t} />
      <div style={{ padding: "20px 28px 0" }}><Back onPress={() => setFlow("auth")} t={t} /></div>
      <div style={{ flex: 1, padding: "20px 28px 0" }}>
        <h1 style={{ fontFamily: t.serif, fontSize: 26, color: t.text, margin: "0 0 6px" }}>Verify your number</h1>
        <p style={{ fontFamily: t.font, fontSize: 13, color: t.textMuted, margin: "0 0 36px" }}>We sent a code to +91 98765 43210</p>
        <div style={{ display: "flex", gap: 10, marginBottom: 32, justifyContent: "center" }}>
          {["4","8","2","9","",""].map((d,i) => <div key={i} style={{ width: 42, height: 52, borderRadius: 12, background: d ? t.accentTint : t.elevated, border: d ? `1.5px solid ${t.accent}` : `1.5px solid ${t.borderDark}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: t.serif, fontSize: 22, color: t.text }}>{d}</div>)}
        </div>
        <p style={{ fontFamily: t.font, fontSize: 13, color: t.textMuted, textAlign: "center" }}>Didn't receive it? <span style={{ color: t.accent, fontWeight: 600 }}>Resend in 28s</span></p>
        <div style={{ marginTop: 32 }}><button onClick={() => setFlow("main")} style={btnP(t)}>Verify</button></div>
      </div>
    </div>
  );

  // ══════════════════════════════════════════════
  //  MAIN APP SCREENS
  // ══════════════════════════════════════════════

  // ── HOME (Rides tab) ───────────────────────
  const renderHome = (t) => {
    const sheetH = homeSheet === "rides" ? 310 : (joinedRides.length > 0 ? 102 : 72);
    return (
    <div style={{ width: "100%", height: "100%", position: "relative", overflow: "hidden" }}>
      {/* Full-screen map */}
      <MapBG t={t}><MapMarker x={145} y={265} initials="AK" color={t.accent} big t={t} /></MapBG>
      <SBar t={t} />

      {/* ── Floating top: Profile + Search bar + Bell ── */}
      <div style={{ padding: "6px 16px", position: "relative", zIndex: 10 }}>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <button onClick={() => switchTab("profile")} style={{ width: 40, height: 40, borderRadius: "50%", background: t.surface, boxShadow: t.cardShadow, border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <XPRing level={12} xp={7400} next={10000} size={34} t={t} />
          </button>
          {/* Google Maps-style search bar */}
          <div style={{ flex: 1, height: 40, background: t.surface, borderRadius: 12, boxShadow: t.cardShadow, display: "flex", alignItems: "center", padding: "0 14px", gap: 8, cursor: "pointer" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={t.textMuted} strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            <span style={{ fontFamily: t.font, fontSize: 13, color: t.textMuted, fontWeight: 400 }}>Where are you riding?</span>
          </div>
          <button onClick={() => push("notifications")} style={{ width: 40, height: 40, borderRadius: "50%", background: t.surface, boxShadow: t.cardShadow, border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", flexShrink: 0 }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={t.text} strokeWidth="1.8"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0"/></svg>
            <div style={{ position: "absolute", top: 8, right: 10, width: 7, height: 7, borderRadius: "50%", background: t.accent, border: `2px solid ${t.surface}` }} />
          </button>
        </div>
      </div>

      {/* ── Map quick-action chips ── */}
      <div style={{ display: "flex", gap: 6, padding: "6px 16px", position: "relative", zIndex: 10 }}>
        {[
          { icon: <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={t.accent} strokeWidth="2.5"><polygon points="3,11 22,2 13,21 11,13"/></svg>, label: "Navigate", accent: true },
          { icon: <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={t.textSec} strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="5" r="3"/><path d="M12 22v-8m-4 0h8"/></svg>, label: "Fuel" },
          { icon: <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={t.textSec} strokeWidth="2" strokeLinecap="round"><path d="M12 2l3 7h7l-5.5 4.5L18 21l-6-4.5L6 21l1.5-7.5L2 9h7z"/></svg>, label: "Scenic" },
        ].map((chip, i) => (
          <button key={i} style={{ height: 30, borderRadius: 15, background: t.surface, boxShadow: t.cardShadow, border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 5, padding: "0 12px" }}>
            {chip.icon}
            <span style={{ fontFamily: t.font, fontSize: 10, fontWeight: 600, color: chip.accent ? t.accent : t.textSec }}>{chip.label}</span>
          </button>
        ))}
      </div>

      {/* ── Recenter ── */}
      <div style={{ position: "absolute", right: 16, bottom: sheetH + 52 + 16, zIndex: 10, transition: "bottom .3s ease" }}>
        <div style={{ width: 40, height: 40, borderRadius: 10, background: t.surface, boxShadow: t.cardShadow, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={t.textSec} strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M12 2v4m0 12v4M2 12h4m12 0h4"/></svg>
        </div>
      </div>

      {/* ── FAB ── */}
      <div style={{ position: "absolute", right: 16, bottom: sheetH + 52 + 66, zIndex: 20, transition: "bottom .3s ease" }}>
        <button onClick={() => push("createRide")} style={{ width: 52, height: 52, borderRadius: 16, background: `linear-gradient(135deg, ${t.accent} 0%, ${t.accentDeep} 100%)`, boxShadow: t.fabShadow, border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={t.isDark ? "#fff" : t.bg} strokeWidth="2.5" strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>
        </button>
      </div>

      {/* ═══ Bottom area: Sheet + Tab Bar (anchored) ═══ */}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, zIndex: 10 }}>
        {/* Bottom Sheet */}
        <div style={{ background: t.bg, borderRadius: "24px 24px 0 0", boxShadow: t.sheetShadow, maxHeight: homeSheet === "rides" ? 310 : "auto", display: "flex", flexDirection: "column" }}>
          <button onClick={() => setHomeSheet(h => h === "peek" ? "rides" : "peek")} style={{ width: "100%", background: "none", border: "none", cursor: "pointer", padding: "10px 24px 0" }}>
            {sHandle(t)}
          </button>

          {/* Peek state */}
          {homeSheet === "peek" && (
            <div style={{ padding: "0 24px 8px" }}>
              {joinedRides.length > 0 ? (
                <>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                    <div>
                      <p style={{ fontFamily: t.font, fontSize: 10, color: t.textMuted, margin: 0, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase" }}>Next Ride</p>
                      <p style={{ fontFamily: t.serif, fontSize: 16, color: t.text, margin: "3px 0 0" }}>{RIDES[0].title}</p>
                    </div>
                    <div style={{ background: t.greenTint, padding: "3px 8px", borderRadius: 8, fontFamily: t.font, fontSize: 10, color: t.green, fontWeight: 600 }}>Tomorrow</div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <Avatars riders={RIDES[0].riders} size={22} t={t} />
                    <button onClick={() => setHomeSheet("rides")} style={{ fontFamily: t.font, fontSize: 11, color: t.accent, fontWeight: 600, background: "none", border: "none", cursor: "pointer" }}>See all rides ↓</button>
                  </div>
                </>
              ) : (
                <div style={{ textAlign: "center", padding: "4px 0" }}>
                  <p style={{ fontFamily: t.font, fontSize: 13, color: t.textMuted, margin: 0 }}>No upcoming rides</p>
                  <button onClick={() => push("createRide")} style={{ fontFamily: t.font, fontSize: 12, color: t.accent, fontWeight: 600, background: "none", border: "none", cursor: "pointer", marginTop: 3 }}>Plan your first ride →</button>
                </div>
              )}
            </div>
          )}

          {/* Expanded rides list */}
          {homeSheet === "rides" && (
            <div style={{ flex: 1, overflow: "auto", padding: "0 24px 6px" }}>
              <div style={{ display: "flex", background: t.elevated, borderRadius: 10, padding: 3, marginBottom: 10 }}>
                {[["upcoming","Upcoming"],["my","My Rides"],["past","Past"]].map(([id,l]) => (
                  <button key={id} onClick={() => setRideTab(id)} style={{ flex: 1, padding: "7px 0", borderRadius: 8, border: "none", background: rideTab === id ? t.surface : "transparent", fontFamily: t.font, fontSize: 11, fontWeight: rideTab === id ? 600 : 500, color: rideTab === id ? t.text : t.textMuted, cursor: "pointer", boxShadow: rideTab === id ? "0 1px 4px rgba(0,0,0,0.06)" : "none" }}>{l}</button>
                ))}
              </div>
              {rideTab === "upcoming" && RIDES.map(r => <RideCard key={r.id} ride={r} compact t={t} />)}
              {rideTab === "my" && RIDES.filter(r => r.yours).map(r => <RideCard key={r.id} ride={r} compact t={t} />)}
              {rideTab === "past" && <div style={{ textAlign: "center", padding: "16px 0" }}><p style={{ fontFamily: t.font, fontSize: 12, color: t.textMuted }}>No past rides yet</p></div>}
            </div>
          )}
        </div>

        {/* Tab bar — always visible */}
        <TabBar active="home" onTab={switchTab} t={t} />
      </div>
    </div>
    );
  };

  // ── CREATE RIDE ────────────────────────────
  const renderCreateRide = (t) => (
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", position: "relative" }}>
      <MapBG dim t={t} />
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, top: 60, background: t.bg, borderRadius: "24px 24px 0 0", boxShadow: t.sheetShadow, zIndex: 10, display: "flex", flexDirection: "column", overflow: "auto" }}>
        <div style={{ padding: "10px 24px 24px" }}>
          {sHandle(t)}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <h2 style={{ fontFamily: t.serif, fontSize: 22, color: t.text, margin: 0 }}>Create Ride</h2>
            <button onClick={pop} style={{ fontFamily: t.font, fontSize: 13, color: t.textMuted, background: "none", border: "none", cursor: "pointer" }}>Cancel</button>
          </div>
          <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 8 }}>
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: t.accent }} />
              <div style={{ width: 1.5, height: 32, background: t.borderDark }} />
              <div style={{ width: 10, height: 10, borderRadius: "50%", border: `2px solid ${t.accent}` }} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ marginBottom: 12 }}>
                <label style={lbl(t)}>From</label>
                <div style={{ borderBottom: `1.5px solid ${t.borderDark}`, padding: "8px 0 6px" }}><span style={{ fontFamily: t.font, fontSize: 14, color: t.accent, fontWeight: 500 }}>📍 Current Location</span></div>
              </div>
              <div>
                <label style={lbl(t)}>To</label>
                <div style={{ borderBottom: `1.5px solid ${t.accent}`, padding: "8px 0 6px" }}><span style={{ fontFamily: t.font, fontSize: 14, color: t.text }}>Goa, Panaji</span></div>
              </div>
            </div>
          </div>
          <button style={{ display: "flex", alignItems: "center", gap: 8, background: "none", border: "none", padding: "0 0 18px", fontFamily: t.font, fontSize: 13, color: t.accent, fontWeight: 600, cursor: "pointer" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={t.accent} strokeWidth="2" strokeLinecap="round"><path d="M12 5v14M5 12h14"/></svg>Add Regrouping Point
          </button>
          <button onClick={() => push("scenic")} style={{ width: "100%", background: t.elevated, borderRadius: 14, padding: "14px 16px", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18, border: "none", cursor: "pointer", textAlign: "left" }}>
            <div>
              <p style={{ fontFamily: t.font, fontSize: 14, fontWeight: 600, color: t.text, margin: 0 }}>Find Scenic Stops</p>
              <p style={{ fontFamily: t.font, fontSize: 11, color: t.textMuted, margin: "2px 0 0" }}>Discover viewpoints along your route</p>
            </div>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={t.accent} strokeWidth="2" strokeLinecap="round"><path d="M9 18l6-6-6-6"/></svg>
          </button>
          <div style={{ display: "flex", gap: 12, marginBottom: 24 }}>
            {[["Date","Mar 25, 2026"],["Time","6:00 AM"]].map(([l,v],i)=>(
              <div key={i} style={{ flex: 1 }}><label style={lbl(t)}>{l}</label><div style={{ borderBottom: `1.5px solid ${t.borderDark}`, padding: "8px 0 6px" }}><span style={{ fontFamily: t.font, fontSize: 13, color: t.text }}>{v}</span></div></div>
            ))}
          </div>
          <button onClick={() => { pop(); setJoinedRides(j => [...new Set([...j, 1])]); }} style={btnP(t)}>Create Ride</button>
        </div>
      </div>
      <SBar t={t} />
    </div>
  );

  // ── SCENIC SELECTION ───────────────────────
  const renderScenic = (t) => (
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", position: "relative" }}>
      <MapBG dim t={t} />
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, top: 50, background: t.bg, borderRadius: "24px 24px 0 0", boxShadow: t.sheetShadow, zIndex: 10, display: "flex", flexDirection: "column" }}>
        <div style={{ padding: "10px 24px 0" }}>
          {sHandle(t)}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
            <h2 style={{ fontFamily: t.serif, fontSize: 20, color: t.text, margin: 0 }}>Scenic Stops</h2>
            <span style={{ fontFamily: t.font, fontSize: 12, color: t.accent, fontWeight: 600 }}>{scenicToggles.filter(Boolean).length} of {SCENIC.length} selected</span>
          </div>
          <p style={{ fontFamily: t.font, fontSize: 12, color: t.textMuted, margin: "0 0 14px" }}>Viewpoints along your route</p>
        </div>
        <div style={{ flex: 1, overflow: "auto", padding: "0 24px" }}>
          {SCENIC.map((s, i) => (
            <button key={i} onClick={() => setScenicToggles(tg => { const n = [...tg]; n[i] = !n[i]; return n; })} style={{ width: "100%", display: "flex", alignItems: "center", gap: 14, padding: "14px 0", background: "none", border: "none", borderBottom: i < SCENIC.length - 1 ? `1px solid ${t.border}` : "none", cursor: "pointer", textAlign: "left" }}>
              <div style={{ width: 52, height: 52, borderRadius: 12, background: `linear-gradient(135deg, ${s.color}40, ${s.color}20)`, border: scenicToggles[i] ? `2px solid ${t.accent}` : "2px solid transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={scenicToggles[i] ? t.accent : t.textMuted} strokeWidth="1.8"><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/><circle cx="12" cy="13" r="4"/></svg>
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontFamily: t.font, fontSize: 14, fontWeight: 600, color: t.text, margin: 0 }}>{s.name}</p>
                <p style={{ fontFamily: t.font, fontSize: 11, color: t.textMuted, margin: "2px 0 0" }}>{s.dist} from start · +15 XP</p>
              </div>
              <div style={{ width: 24, height: 24, borderRadius: "50%", background: scenicToggles[i] ? t.accent : "transparent", border: scenicToggles[i] ? "none" : `1.5px solid ${t.sand}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                {scenicToggles[i] && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round"><path d="M20 6L9 17l-5-5"/></svg>}
              </div>
            </button>
          ))}
        </div>
        <div style={{ padding: "14px 24px 26px", flexShrink: 0 }}>
          <button onClick={pop} style={btnP(t)}>Add {scenicToggles.filter(Boolean).length} Scenic Stops</button>
        </div>
      </div>
      <SBar t={t} />
    </div>
  );

  // ── RIDE DETAIL ────────────────────────────
  const renderRideDetail = (t) => {
    const ride = selectedRide || RIDES[0];
    const joined = joinedRides.includes(ride.id);
    return (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", position: "relative" }}>
        <MapBG dim t={t}>
          <path d="M20 200 Q80 160 145 180 Q220 200 270 150" fill="none" stroke={t.blue} strokeWidth="3.5" strokeLinecap="round" />
        </MapBG>
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, top: 70, background: t.bg, borderRadius: "24px 24px 0 0", boxShadow: t.sheetShadow, zIndex: 10, display: "flex", flexDirection: "column", overflow: "auto" }}>
          <div style={{ padding: "10px 24px 24px" }}>
            {sHandle(t)}
            <Back onPress={pop} t={t} />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginTop: 8, marginBottom: 6 }}>
              <div>
                <h2 style={{ fontFamily: t.serif, fontSize: 21, color: t.text, margin: 0 }}>{ride.title}</h2>
                <p style={{ fontFamily: t.font, fontSize: 12, color: t.textMuted, margin: "4px 0 0" }}>{ride.date} · {ride.time} · by {ride.creator}</p>
              </div>
              {joined && <div style={{ background: t.greenTint, padding: "4px 10px", borderRadius: 8, fontFamily: t.font, fontSize: 10, color: t.green, fontWeight: 700 }}>JOINED</div>}
            </div>
            <div style={{ display: "flex", gap: 18, margin: "14px 0 18px" }}>
              {[["Distance",ride.dist],["Duration",ride.dur],["XP",`+${ride.xp}`]].map(([l,v],i)=>(
                <div key={i}>
                  <p style={{ fontFamily: t.font, fontSize: 10, color: t.textMuted, margin: 0, textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 500 }}>{l}</p>
                  <p style={{ fontFamily: t.serif, fontSize: 19, color: i===2?t.accent:t.text, margin: "2px 0 0" }}>{v}</p>
                </div>
              ))}
            </div>
            <div style={{ marginBottom: 16 }}>
              {STOPS.map((s, i) => (
                <div key={i} style={{ display: "flex", gap: 12, minHeight: 42 }}>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 16 }}>
                    <div style={{ width: s.type==="start"||s.type==="end"?12:10, height: s.type==="start"||s.type==="end"?12:10, borderRadius: s.type==="scenic"?2:"50%", transform: s.type==="scenic"?"rotate(45deg)":"none", background: s.type==="start"?t.accent:s.type==="end"?t.text:s.type==="regroup"?t.green:t.blue, marginTop: 4, flexShrink: 0 }} />
                    {i < STOPS.length - 1 && <div style={{ width: 1.5, flex: 1, background: t.borderDark, minHeight: 18 }} />}
                  </div>
                  <div style={{ paddingBottom: 10 }}>
                    <p style={{ fontFamily: t.font, fontSize: 13, fontWeight: 600, color: t.text, margin: 0 }}>{s.name}</p>
                    <p style={{ fontFamily: t.font, fontSize: 11, color: t.textMuted, margin: "1px 0 0" }}>{s.time}</p>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
              <Avatars riders={ride.riders} size={28} t={t} />
              <span style={{ fontFamily: t.font, fontSize: 12, color: t.textMuted }}>{ride.riders.length} riders</span>
            </div>
            {joined ? (
              <div style={{ display: "flex", gap: 10 }}>
                <button onClick={() => { setLiveStarted(true); pop(); push("liveRide"); }} style={{ ...btnP(t), flex: 2 }}>{ride.yours ? "Start Ride" : "Navigate"}</button>
                <button onClick={() => { setJoinedRides(j => j.filter(id => id !== ride.id)); pop(); }} style={{ ...btnS(t), flex: 1, fontSize: 13 }}>Leave</button>
              </div>
            ) : (
              <button onClick={() => { setJoinedRides(j => [...j, ride.id]); }} style={btnP(t)}>Join Ride</button>
            )}
          </div>
        </div>
        <SBar t={t} />
      </div>
    );
  };

  // ── LIVE GROUP RIDE MAP ─────────────────────
  const renderLiveRide = (t) => {
    const riders = [
      { nm: "Arjun K.", ini: "AK", dc: t.accent, x: 130, y: 260, st: "Leading", cl: t.green },
      { nm: "Raj J.", ini: "RJ", dc: t.green, x: 115, y: 245, st: "On Route", cl: t.green },
      { nm: "Priya M.", ini: "PM", dc: "#8B5E3C", x: 100, y: 228, st: "On Route", cl: t.green },
      { nm: "Vikram T.", ini: "VT", dc: t.textSec, x: 82, y: 215, st: "2.4 km behind", cl: t.amber },
      { nm: "Nikhil S.", ini: "NS", dc: "#C44B2D", x: 65, y: 205, st: "Stopped", cl: t.red },
      { nm: "Deepak K.", ini: "DK", dc: "#1A1612", x: 50, y: 200, st: "At regroup", cl: t.blue },
      { nm: "Suraj M.", ini: "SM", dc: "#9B7B5E", x: 42, y: 196, st: "At regroup", cl: t.blue },
    ];
    return (
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", position: "relative", overflow: "hidden" }}>
      {/* ── Rich group ride map ── */}
      <MapBG t={t}>
        {/* Full route: completed (green) + remaining (blue dashed) */}
        <path d="M20 500 Q50 440 65 380 Q82 320 100 280 Q115 250 130 260" fill="none" stroke={t.green} strokeWidth="4.5" strokeLinecap="round" />
        <path d="M130 260 Q150 270 175 260 Q210 240 240 200 Q260 170 270 120" fill="none" stroke={t.blue} strokeWidth="3.5" strokeLinecap="round" strokeDasharray="8 6" />

        {/* ── Regrouping point 1 (Mahabaleshwar) — next stop ── */}
        <circle cx="175" cy="260" r="18" fill={t.accent} opacity=".08"><animate attributeName="r" values="18;24;18" dur="2.5s" repeatCount="indefinite" /></circle>
        <circle cx="175" cy="260" r="12" fill={t.bg} stroke={t.accent} strokeWidth="2" />
        <text x="175" y="264" textAnchor="middle" style={{ fontSize: 10, fill: t.accent, fontWeight: 700, fontFamily: t.font }}>⚑</text>
        <text x="175" y="280" textAnchor="middle" style={{ fontSize: 6.5, fontFamily: t.font, fill: t.textSec, fontWeight: 600 }}>REGROUP</text>
        <rect x="157" y="283" width="36" height="13" rx="3" fill={t.accent} />
        <text x="175" y="292" textAnchor="middle" style={{ fontSize: 7, fill: "#fff", fontWeight: 700, fontFamily: t.font }}>2/7</text>

        {/* ── Scenic diamond markers on route ── */}
        {[[55, 400, "Tamhini", true], [245, 180, "Amboli", false]].map(([sx, sy, name, visited], i) => (
          <g key={i} transform={`translate(${sx},${sy})`}>
            <g transform="rotate(45)"><rect x="-5" y="-5" width="10" height="10" rx="1.5" fill={visited ? t.green : t.blue} /></g>
            <text y={14} textAnchor="middle" style={{ fontSize: 5.5, fontFamily: t.font, fill: t.textSec, fontWeight: 500 }}>{name}</text>
            {visited && <text y={-10} textAnchor="middle" style={{ fontSize: 7, fill: t.green }}>✓</text>}
          </g>
        ))}

        {/* ── Destination flag ── */}
        <g transform="translate(270,120)">
          <rect x="-1" y="-16" width="2" height="22" rx="1" fill={t.text} />
          <path d="M1,-16 L15,-10 L1,-4Z" fill={t.accent} />
          <text y="12" textAnchor="middle" style={{ fontSize: 5.5, fontFamily: t.font, fill: t.textSec, fontWeight: 600 }}>GOA</text>
        </g>

        {/* ── Start marker ── */}
        <g transform="translate(20,500)">
          <circle r="5" fill={t.text} /><circle r="5" fill="none" stroke={t.bg} strokeWidth="1.5" />
          <text y="14" textAnchor="middle" style={{ fontSize: 5.5, fontFamily: t.font, fill: t.textSec, fontWeight: 600 }}>PUNE</text>
        </g>

        {/* ── All rider markers ── */}
        {riders.map((r, i) => (
          <MapMarker key={i} x={r.x} y={r.y} initials={r.ini} color={r.dc} big={i === 0} status={r.cl} t={t} />
        ))}
      </MapBG>

      <div style={{ zIndex: 10 }}><SBar t={t} /></div>

      {/* ── HUD — Speed · Distance · Next Stop · ETA ── */}
      <div style={{ margin: "6px 14px 0", background: t.hudBg, backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)", borderRadius: 16, padding: "10px 14px", display: "flex", justifyContent: "space-between", alignItems: "center", zIndex: 10, position: "relative" }}>
        {[["72","km/h",false],["62","km done",false],["Regroup","in 8 km",true],["2:14","ETA",false]].map(([v,l,ac],i)=>(
          <Fragment key={i}>
            {i>0 && <div style={{ width: 1, height: 24, background: t.borderDark }}/>}
            <div style={{ textAlign: "center", flex: 1 }}>
              <p style={{ fontFamily: t.serif, fontSize: ac ? 13 : 17, color: ac?t.accent:t.text, margin: 0, fontWeight: ac ? 600 : 400 }}>{v}</p>
              <p style={{ fontFamily: t.font, fontSize: 8, color: t.textMuted, margin: 0, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.04em" }}>{l}</p>
            </div>
          </Fragment>
        ))}
      </div>

      {/* ── Floating buttons row ── */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 14px 0", zIndex: 20, position: "relative" }}>
        <button onClick={() => push("navigation")} style={{ height: 36, borderRadius: 12, background: t.hudBg, backdropFilter: "blur(12px)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, padding: "0 12px" }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill={t.blue} stroke="none"><polygon points="3,11 22,2 13,21 11,13"/></svg>
          <span style={{ fontFamily: t.font, fontSize: 11, fontWeight: 600, color: t.blue }}>Navigate</span>
        </button>
        <div style={{ width: 36, height: 36, borderRadius: 10, background: t.hudBg, backdropFilter: "blur(12px)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={t.textSec} strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M12 2v4m0 12v4M2 12h4m12 0h4"/></svg>
        </div>
        <div style={{ flex: 1 }} />
        <div style={{ width: 38, height: 38, borderRadius: "50%", border: `2px solid ${t.red}`, background: t.hudBg, backdropFilter: "blur(12px)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 800, color: t.red, fontFamily: t.font }}>SOS</div>
      </div>

      <div style={{ flex: 1 }} />

      {/* ── XP toast ── */}
      <div style={{ margin: "0 14px 8px", zIndex: 15, position: "relative" }}>
        <div style={{ background: t.accentTint, borderRadius: 10, padding: "7px 12px", display: "flex", alignItems: "center", gap: 8, backdropFilter: "blur(8px)" }}>
          <span style={{ fontSize: 13 }}>⭐</span>
          <span style={{ fontFamily: t.font, fontSize: 11, color: t.accent, fontWeight: 600 }}>+15 XP</span>
          <span style={{ fontFamily: t.font, fontSize: 10, color: t.textMuted }}>Tamhini Ghat visited!</span>
        </div>
      </div>

      {/* ═══ Bottom: Rider panel ═══ */}
      <div style={{ zIndex: 10, flexShrink: 0 }}>
        <div style={{ background: t.bg, borderRadius: "24px 24px 0 0", padding: "10px 20px 24px", boxShadow: t.sheetShadow }}>
          {sHandle(t)}
          {/* Ride name + live badge + progress */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
            <p style={{ fontFamily: t.serif, fontSize: 15, color: t.text, margin: 0 }}>Coastal Highway Run</p>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: t.green }}><div style={{ width: 6, height: 6, borderRadius: "50%", background: t.green, animation: "none" }} /></div>
              <span style={{ fontFamily: t.font, fontSize: 9, color: t.green, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.04em" }}>Live</span>
            </div>
          </div>
          {/* Route progress bar */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
            <div style={{ flex: 1, height: 4, borderRadius: 2, background: t.border, overflow: "hidden" }}>
              <div style={{ width: "25%", height: "100%", background: `linear-gradient(90deg, ${t.green}, ${t.accent})`, borderRadius: 2 }} />
            </div>
            <span style={{ fontFamily: t.font, fontSize: 9, color: t.textMuted, fontWeight: 500 }}>62/248 km</span>
          </div>
          {/* Riders list */}
          <div style={{ maxHeight: 140, overflow: "auto" }}>
            {riders.map((r, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "5px 0" }}>
                <div style={{ width: 24, height: 24, borderRadius: "50%", background: r.dc, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 8, color: "#FAF7F2", fontWeight: 700, fontFamily: t.font }}>{r.ini}</div>
                <span style={{ flex: 1, fontFamily: t.font, fontSize: 12, color: t.text, fontWeight: 500 }}>{r.nm}{i === 0 ? " (You)" : ""}</span>
                <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <div style={{ width: 5, height: 5, borderRadius: "50%", background: r.cl }} />
                  <span style={{ fontFamily: t.font, fontSize: 10, color: r.cl, fontWeight: 500 }}>{r.st}</span>
                </div>
              </div>
            ))}
          </div>
          {/* Action buttons */}
          <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
            <button onClick={() => push("navigation")} style={{ ...btnP(t), flex: 2, padding: "12px 0", fontSize: 13, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={t.isDark ? "#fff" : t.bg} strokeWidth="2.5"><polygon points="3,11 22,2 13,21 11,13"/></svg>
              Navigate
            </button>
            <button onClick={() => { setLiveStarted(false); pop(); }} style={{ ...btnS(t), flex: 1, padding: "12px 0", fontSize: 12, borderColor: t.red, color: t.red }}>End Ride</button>
          </div>
        </div>
      </div>
    </div>
    );
  };

  // ── NAVIGATION ─────────────────────────────
  const renderNavigation = (t) => (
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", position: "relative" }}>
      <MapBG t={t}>
        <path d="M145 600 L130 400 L115 280 Q110 240 130 200 Q150 160 140 100" fill="none" stroke={t.blue} strokeWidth="6" strokeLinecap="round" />
        {[480,380,300,220,150].map((y,i) => <polygon key={i} points={`${133-i*1.2},${y+6} ${137-i*1.5},${y-2} ${141-i*1.2},${y+6}`} fill={t.isDark ? "#ddd" : "#fff"} opacity=".6" />)}
        <g transform="translate(138,440)"><circle r="16" fill={t.blue} opacity=".15"/><circle r="10" fill={t.blue}/><circle r="10" fill="none" stroke="#fff" strokeWidth="2.5"/><polygon points="0,-5 3,3 -3,3" fill="#fff"/></g>
      </MapBG>
      <SBar t={t} />
      <div style={{ margin: "8px 16px 0", background: t.hudBgSolid, backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)", borderRadius: 16, padding: "14px 14px", display: "flex", alignItems: "center", gap: 12, zIndex: 10 }}>
        <div style={{ width: 40, height: 40, borderRadius: 12, background: t.green, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
        </div>
        <div>
          <p style={{ fontFamily: t.font, fontSize: 11, color: t.green, margin: 0, fontWeight: 600 }}>In 800m</p>
          <p style={{ fontFamily: t.serif, fontSize: 16, color: t.text, margin: "2px 0 0" }}>Turn right · NH66</p>
        </div>
      </div>
      <div style={{ position: "absolute", top: 108, left: 16, zIndex: 10 }}>
        <div style={{ width: 32, height: 32, borderRadius: "50%", background: t.surface, border: `2.5px solid ${t.red}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ fontFamily: t.font, fontSize: 11, fontWeight: 800, color: t.text }}>60</span>
        </div>
      </div>
      <div style={{ flex: 1 }} />
      <div style={{ margin: "0 16px 10px", background: t.hudBgSolid, backdropFilter: "blur(12px)", borderRadius: 12, padding: "10px 14px", display: "flex", alignItems: "center", gap: 10, zIndex: 10, border: `1px solid ${t.accentTint}` }}>
        <div style={{ width: 8, height: 8, borderRadius: 2, transform: "rotate(45deg)", background: t.accent }} />
        <div style={{ flex: 1 }}>
          <p style={{ fontFamily: t.font, fontSize: 12, fontWeight: 600, color: t.text, margin: 0 }}>Scenic viewpoint ahead</p>
          <p style={{ fontFamily: t.font, fontSize: 10, color: t.textMuted, margin: "1px 0 0" }}>Tamhini Ghat · 2.4 km · +15 XP</p>
        </div>
      </div>
      <div style={{ background: t.bg, borderRadius: "20px 20px 0 0", padding: "14px 20px 26px", boxShadow: t.sheetShadow, display: "flex", justifyContent: "space-between", alignItems: "center", zIndex: 10 }}>
        {[["72","km/h"],["186","km left"],["2:14","ETA"]].map(([v,l],i) => (
          <div key={i} style={{ textAlign: "center" }}>
            <p style={{ fontFamily: t.serif, fontSize: 22, color: i===2?t.accent:t.text, margin: 0 }}>{v}</p>
            <p style={{ fontFamily: t.font, fontSize: 9, color: t.textMuted, margin: 0, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.06em" }}>{l}</p>
          </div>
        ))}
        <button onClick={pop} style={{ width: 42, height: 42, borderRadius: 12, background: t.red, border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
        </button>
      </div>
      <div style={{ position: "absolute", bottom: 90, left: 16, zIndex: 5 }}>
        <span style={{ fontFamily: "Roboto,Arial,sans-serif", fontSize: 8, color: t.textMuted, opacity: 0.7 }}>Google</span>
      </div>
    </div>
  );

  // ── GARAGE ─────────────────────────────────
  const renderGarage = (t) => (
    <div style={{ width: "100%", height: "100%", background: t.bg, display: "flex", flexDirection: "column", position: "relative" }}>
      <SBar t={t} />
      <div style={{ padding: "16px 24px 0", flexShrink: 0 }}>
        <h1 style={{ fontFamily: t.serif, fontSize: 26, color: t.text, margin: "0 0 16px" }}>Your Garage</h1>
      </div>
      <div style={{ flex: 1, overflow: "auto", padding: "0 24px" }}>
        {BIKES.map((b, i) => (
          <button key={i} onClick={() => { setSelectedBike(b); push("bikeDetail"); }} style={{ width: "100%", background: t.surface, borderRadius: 18, overflow: "hidden", marginBottom: 14, border: `1px solid ${t.border}`, cursor: "pointer", textAlign: "left", display: "block", padding: 0 }}>
            <div style={{ height: 85, background: t.isDark ? b.gradDark : b.grad, display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
              <svg width="100" height="50" viewBox="0 0 120 60" fill="none" opacity={t.isDark ? ".35" : ".55"}><circle cx="20" cy="45" r="12" stroke={t.textSec} strokeWidth="2" fill="none"/><circle cx="100" cy="45" r="12" stroke={t.textSec} strokeWidth="2" fill="none"/><path d="M20 45 L40 20 L80 15 L100 45" stroke={t.textSec} strokeWidth="2" fill="none" strokeLinejoin="round"/><path d="M50 20 L55 8 L65 8 L60 18" stroke={t.textSec} strokeWidth="1.5" fill="none"/></svg>
              {b.primary && <div style={{ position: "absolute", top: 8, right: 8, background: t.hudBg, backdropFilter: "blur(8px)", borderRadius: 8, padding: "3px 8px", fontFamily: t.font, fontSize: 9, fontWeight: 600, color: t.accent }}>PRIMARY</div>}
            </div>
            <div style={{ padding: "12px 14px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div><p style={{ fontFamily: t.serif, fontSize: 16, color: t.text, margin: 0 }}>{b.name}</p><p style={{ fontFamily: t.font, fontSize: 11, color: t.textMuted, margin: "2px 0 0" }}>{b.model}</p></div>
                <BPIGauge score={b.bpi} size={75} t={t} />
              </div>
              <div style={{ display: "flex", gap: 14, marginTop: 4 }}>
                {[["Dist",b.dist],["Rides",b.rides],["Service",b.service]].map(([l,v],j)=>(
                  <div key={j}><p style={{ fontFamily: t.font, fontSize: 9, color: t.textMuted, margin: 0, textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 500 }}>{l}</p><p style={{ fontFamily: t.font, fontSize: 12, color: v==="Overdue"?t.red:t.text, margin: "2px 0 0", fontWeight: 600 }}>{v}</p></div>
                ))}
              </div>
            </div>
          </button>
        ))}
        <button onClick={() => push("addBike")} style={{ width: "100%", padding: "20px 0", borderRadius: 16, border: `2px dashed ${t.borderDark}`, background: "none", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={t.textMuted} strokeWidth="1.8" strokeLinecap="round"><path d="M12 5v14M5 12h14"/></svg>
          <span style={{ fontFamily: t.font, fontSize: 13, color: t.textMuted, fontWeight: 500 }}>Add a bike</span>
        </button>
        <div style={{ height: 16 }} />
      </div>
      <TabBar active="garage" onTab={switchTab} t={t} />
    </div>
  );

  // ── BIKE DETAIL ────────────────────────────
  const renderBikeDetail = (t) => {
    const b = selectedBike || BIKES[0];
    return (
      <div style={{ width: "100%", height: "100%", background: t.bg, display: "flex", flexDirection: "column" }}>
        <SBar t={t} />
        <div style={{ padding: "16px 24px 0", flexShrink: 0 }}><Back onPress={pop} t={t} /></div>
        <div style={{ flex: 1, overflow: "auto", padding: "0 24px" }}>
          <div style={{ textAlign: "center", marginBottom: 16 }}>
            <BPIGauge score={b.bpi} size={160} t={t} />
            <h2 style={{ fontFamily: t.serif, fontSize: 22, color: t.text, margin: "8px 0 2px" }}>{b.name}</h2>
            <p style={{ fontFamily: t.font, fontSize: 13, color: t.textMuted }}>{b.model}</p>
          </div>
          <div style={{ display: "flex", gap: 0, background: t.surface, borderRadius: 14, border: `1px solid ${t.border}`, overflow: "hidden", marginBottom: 20 }}>
            {[["Distance",b.dist],["Rides",b.rides],["Last Service",b.service]].map(([l,v],i) => (
              <div key={i} style={{ flex: 1, textAlign: "center", padding: "12px 4px", borderRight: i<2?`1px solid ${t.border}`:"none" }}>
                <p style={{ fontFamily: t.serif, fontSize: 16, color: v==="Overdue"?t.red:t.text, margin: 0 }}>{v}</p>
                <p style={{ fontFamily: t.font, fontSize: 9, color: t.textMuted, margin: "2px 0 0", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 500 }}>{l}</p>
              </div>
            ))}
          </div>
          <p style={{ ...lbl(t), marginBottom: 12 }}>Service History</p>
          {[
            { type: "Oil Change", date: "Mar 12", odo: "12,480 km" },
            { type: "Chain & Sprocket", date: "Jan 20", odo: "10,200 km" },
            { type: "Full Service", date: "Nov 5", odo: "8,000 km" },
          ].map((s, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 0", borderBottom: `1px solid ${t.border}` }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: t.elevated, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={t.textSec} strokeWidth="1.8"><path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontFamily: t.font, fontSize: 13, fontWeight: 600, color: t.text, margin: 0 }}>{s.type}</p>
                <p style={{ fontFamily: t.font, fontSize: 11, color: t.textMuted, margin: "1px 0 0" }}>{s.date} · {s.odo}</p>
              </div>
            </div>
          ))}
          <button style={{ width: "100%", marginTop: 16, ...btnS(t), fontSize: 13 }}>+ Add Service Record</button>
          <div style={{ height: 24 }} />
        </div>
      </div>
    );
  };

  // ── ADD BIKE ───────────────────────────────
  const renderAddBike = (t) => (
    <div style={{ width: "100%", height: "100%", background: t.bg, display: "flex", flexDirection: "column" }}>
      <SBar t={t} />
      <div style={{ padding: "16px 24px 0", flexShrink: 0 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Back onPress={pop} t={t} />
          <button onClick={pop} style={{ fontFamily: t.font, fontSize: 13, color: t.textMuted, background: "none", border: "none", cursor: "pointer" }}>Cancel</button>
        </div>
      </div>
      <div style={{ flex: 1, padding: "16px 24px 0" }}>
        <h2 style={{ fontFamily: t.serif, fontSize: 22, color: t.text, margin: "0 0 20px" }}>Add Bike</h2>
        <div style={{ width: "100%", height: 120, borderRadius: 16, border: `2px dashed ${t.borderDark}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6, marginBottom: 24 }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={t.textMuted} strokeWidth="1.5"><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/><circle cx="12" cy="13" r="4"/></svg>
          <span style={{ fontFamily: t.font, fontSize: 12, color: t.textMuted }}>Tap to add photo</span>
        </div>
        {[["Make","Royal Enfield"],["Model","Interceptor 650"],["Year","2024"],["Odometer","12,480 km"]].map(([l,v],i)=>(
          <div key={i} style={{ marginBottom: 18 }}><label style={lbl(t)}>{l}</label><div style={{ borderBottom: `1.5px solid ${i===0?t.accent:t.borderDark}`, padding: "8px 0 6px" }}><span style={{ fontFamily: t.font, fontSize: 14, color: t.text }}>{v}</span></div></div>
        ))}
        <button onClick={pop} style={btnP(t)}>Add to Garage</button>
      </div>
    </div>
  );

  // ── ACHIEVEMENTS / XP ──────────────────────
  const renderXP = (t) => (
    <div style={{ width: "100%", height: "100%", background: t.bg, display: "flex", flexDirection: "column" }}>
      <SBar t={t} />
      <div style={{ flex: 1, overflow: "auto" }}>
        <div style={{ padding: "16px 24px 0" }}>
          <h1 style={{ fontFamily: t.serif, fontSize: 26, color: t.text, margin: "0 0 18px" }}>Progress</h1>
        </div>
        {/* XP Card — always dark for visual pop in both themes */}
        <div style={{ margin: "0 24px 20px", background: t.isDark ? `linear-gradient(135deg, #282420 0%, #1E1B17 100%)` : `linear-gradient(135deg, ${LIGHT.text} 0%, #2A2420 100%)`, borderRadius: 20, padding: "18px 20px", display: "flex", alignItems: "center", gap: 16, position: "relative", overflow: "hidden", border: t.isDark ? `1px solid ${t.border}` : "none" }}>
          <div style={{ position: "absolute", right: -20, top: -20, width: 100, height: 100, borderRadius: "50%", background: `${t.accent}10` }} />
          <XPRing level={12} xp={7400} next={10000} size={68} t={{ ...t, border: t.isDark ? t.border : "rgba(250,247,242,0.1)", text: LIGHT.bg }} />
          <div>
            <p style={{ fontFamily: t.serif, fontSize: 19, color: LIGHT.bg, margin: 0 }}>Level 12</p>
            <p style={{ fontFamily: t.font, fontSize: 12, color: t.textMuted, margin: "4px 0 0" }}>7,400 / 10,000 XP</p>
            <div style={{ marginTop: 8, background: "rgba(250,247,242,0.1)", borderRadius: 6, height: 6, width: 130, overflow: "hidden" }}>
              <div style={{ width: "74%", height: "100%", background: `linear-gradient(90deg, ${t.accent}, #E8A838)`, borderRadius: 6, transition: "width 1s" }} />
            </div>
            <p style={{ fontFamily: t.font, fontSize: 10, color: t.accent, margin: "6px 0 0", fontWeight: 600 }}>2,600 XP to Level 13</p>
          </div>
        </div>
        {/* How XP works */}
        <div style={{ margin: "0 24px 18px", display: "flex", gap: 8 }}>
          {[["1 km","= 1 XP","🛣️"],["Scenic","= 15 XP","📸"],["Lead","= 25 XP","👑"]].map(([tx,b,ic],i)=>(
            <div key={i} style={{ flex: 1, background: t.elevated, borderRadius: 12, padding: "10px 8px", textAlign: "center" }}>
              <span style={{ fontSize: 15 }}>{ic}</span>
              <p style={{ fontFamily: t.font, fontSize: 11, fontWeight: 700, color: t.text, margin: "4px 0 0" }}>{tx}</p>
              <p style={{ fontFamily: t.font, fontSize: 10, color: t.textMuted, margin: 0 }}>{b}</p>
            </div>
          ))}
        </div>
        {/* Season */}
        <div style={{ padding: "0 24px" }}>
          <p style={lbl(t)}>Current Season</p>
          <div style={{ background: t.surface, borderRadius: 14, padding: "12px 14px", border: `1px solid ${t.border}`, display: "flex", alignItems: "center", gap: 12, marginBottom: 18 }}>
            <div style={{ width: 38, height: 38, borderRadius: 10, background: t.accentTint, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17 }}>☀️</div>
            <div style={{ flex: 1 }}>
              <p style={{ fontFamily: t.font, fontSize: 14, fontWeight: 600, color: t.text, margin: 0 }}>Summer Heat</p>
              <p style={{ fontFamily: t.font, fontSize: 11, color: t.textMuted, margin: "2px 0 0" }}>Apr – Jun 2026 · 2x XP weekends</p>
            </div>
            <div style={{ background: t.greenTint, padding: "3px 8px", borderRadius: 6, fontFamily: t.font, fontSize: 9, color: t.green, fontWeight: 700 }}>ACTIVE</div>
          </div>
        </div>
        {/* Achievements */}
        <div style={{ padding: "0 24px" }}>
          <p style={lbl(t)}>Achievements</p>
          {ACHIEVEMENTS.map((a, i) => {
            const pct = Math.min(100, (a.p / a.t) * 100);
            return (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "11px 0", borderBottom: i < ACHIEVEMENTS.length - 1 ? `1px solid ${t.border}` : "none" }}>
                <div style={{ width: 40, height: 40, borderRadius: 12, background: a.done ? t.accentTint : t.elevated, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17, flexShrink: 0, border: a.done ? `1.5px solid ${t.accent}` : `1.5px solid ${t.borderDark}` }}>{a.icon}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <p style={{ fontFamily: t.font, fontSize: 13, fontWeight: 600, color: t.text, margin: 0 }}>{a.name}</p>
                    <span style={{ fontFamily: t.font, fontSize: 10, color: t.accent, fontWeight: 700 }}>+{a.xp} XP</span>
                  </div>
                  <p style={{ fontFamily: t.font, fontSize: 11, color: t.textMuted, margin: "2px 0 5px" }}>{a.desc}</p>
                  <div style={{ background: t.border, borderRadius: 4, height: 4, overflow: "hidden" }}>
                    <div style={{ width: `${pct}%`, height: "100%", background: a.done ? t.green : `linear-gradient(90deg, ${t.accent}, #E8A838)`, borderRadius: 4 }} />
                  </div>
                  <p style={{ fontFamily: t.font, fontSize: 9, color: t.textMuted, margin: "3px 0 0" }}>{a.p}/{a.t}{a.done ? " · Completed ✓" : ""}</p>
                </div>
              </div>
            );
          })}
        </div>
        <div style={{ height: 16 }} />
      </div>
      <TabBar active="xp" onTab={switchTab} t={t} />
    </div>
  );

  // ── PROFILE ────────────────────────────────
  const renderProfile = (t) => (
    <div style={{ width: "100%", height: "100%", background: t.bg, display: "flex", flexDirection: "column" }}>
      <SBar t={t} />
      <div style={{ flex: 1, padding: "16px 24px 0", overflow: "auto" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
          <div style={{ position: "relative" }}>
            <div style={{ width: 56, height: 56, borderRadius: "50%", background: `linear-gradient(135deg, ${t.accent}, ${t.accentDeep})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 19, color: "#fff", fontWeight: 700, fontFamily: t.font }}>AK</div>
            <div style={{ position: "absolute", bottom: -2, right: -2, width: 20, height: 20, borderRadius: "50%", background: t.bg, display: "flex", alignItems: "center", justifyContent: "center", border: `1.5px solid ${t.borderDark}` }}>
              <span style={{ fontFamily: t.font, fontSize: 8, fontWeight: 800, color: t.accent }}>12</span>
            </div>
          </div>
          <div>
            <p style={{ fontFamily: t.serif, fontSize: 21, color: t.text, margin: 0 }}>Arjun Kumar</p>
            <p style={{ fontFamily: t.font, fontSize: 12, color: t.textMuted, margin: "2px 0 0" }}>Pune · Level 12 · 7,400 XP</p>
          </div>
        </div>
        <div style={{ display: "flex", gap: 0, background: t.surface, borderRadius: 14, border: `1px solid ${t.border}`, marginBottom: 22, overflow: "hidden" }}>
          {[["Rides","34"],["Distance","4.2k km"],["Bikes","2"],["Badges","4"]].map(([l,v],i) => (
            <div key={i} style={{ flex: 1, textAlign: "center", padding: "11px 0", borderRight: i < 3 ? `1px solid ${t.border}` : "none" }}>
              <p style={{ fontFamily: t.serif, fontSize: 15, color: t.text, margin: 0 }}>{v}</p>
              <p style={{ fontFamily: t.font, fontSize: 9, color: t.textMuted, margin: "2px 0 0", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 500 }}>{l}</p>
            </div>
          ))}
        </div>
        {[
          { icon: "✏️", label: "Edit Profile" },
          { icon: "🕐", label: "Ride History" },
          { icon: "🔔", label: "Notifications" },
          { icon: "📏", label: "Units & Preferences" },
          { icon: "🗺", label: "Map Style" },
          { icon: "🔒", label: "Privacy" },
          { icon: "ℹ️", label: "About WeRide" },
        ].map((item, i) => (
          <button key={i} onClick={() => push("settingDetail")} style={{ width: "100%", display: "flex", alignItems: "center", gap: 14, padding: "13px 0", background: "none", border: "none", borderBottom: `1px solid ${t.border}`, cursor: "pointer", textAlign: "left" }}>
            <span style={{ fontSize: 16, width: 24, textAlign: "center" }}>{item.icon}</span>
            <span style={{ fontFamily: t.font, fontSize: 14, color: t.text, fontWeight: 500, flex: 1 }}>{item.label}</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={t.sand} strokeWidth="2" strokeLinecap="round"><path d="M9 18l6-6-6-6" /></svg>
          </button>
        ))}
        <div style={{ marginTop: 20 }}>
          <button onClick={() => setFlow("auth")} style={{ display: "block", fontFamily: t.font, fontSize: 14, color: t.textMuted, fontWeight: 500, padding: "10px 0", background: "none", border: "none", cursor: "pointer" }}>Sign Out</button>
          <button onClick={() => push("deleteAccount")} style={{ display: "block", fontFamily: t.font, fontSize: 14, color: t.red, fontWeight: 500, padding: "10px 0 20px", background: "none", border: "none", cursor: "pointer" }}>Delete Account</button>
        </div>
      </div>
      <TabBar active="profile" onTab={switchTab} t={t} />
    </div>
  );

  // ── DELETE ACCOUNT MODAL ───────────────────
  const renderDeleteAccount = (t) => (
    <div style={{ width: "100%", height: "100%", background: "rgba(26,22,18,0.5)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ background: t.bg, borderRadius: 24, padding: "28px 24px", width: "100%", textAlign: "center" }}>
        <div style={{ width: 48, height: 48, borderRadius: "50%", background: `${t.red}15`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={t.red} strokeWidth="2" strokeLinecap="round"><path d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/></svg>
        </div>
        <h3 style={{ fontFamily: t.serif, fontSize: 20, color: t.text, margin: "0 0 8px" }}>Delete your account?</h3>
        <p style={{ fontFamily: t.font, fontSize: 13, color: t.textSec, margin: "0 0 24px", lineHeight: 1.5 }}>All rides, garage data, XP progress, and profile will be permanently removed.</p>
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={pop} style={{ ...btnS(t), flex: 1, fontSize: 14, borderColor: t.borderDark, color: t.textSec }}>Cancel</button>
          <button onClick={() => { setFlow("auth"); setStack([]); }} style={{ ...btnP(t), flex: 1, fontSize: 14, background: t.red }}>Delete</button>
        </div>
      </div>
    </div>
  );

  // ── NOTIFICATIONS ──────────────────────────
  const renderNotifications = (t) => (
    <div style={{ width: "100%", height: "100%", background: t.bg, display: "flex", flexDirection: "column" }}>
      <SBar t={t} />
      <div style={{ padding: "16px 24px 0", flexShrink: 0 }}><Back onPress={pop} label="Home" t={t} /></div>
      <div style={{ flex: 1, overflow: "auto", padding: "8px 24px" }}>
        <h2 style={{ fontFamily: t.serif, fontSize: 22, color: t.text, margin: "0 0 16px" }}>Notifications</h2>
        {[
          { title: "Priya invited you", desc: "Western Ghats Loop · Mar 28", time: "2h ago", action: true },
          { title: "Ride starting soon", desc: "Coastal Highway Run · Tomorrow 6 AM", time: "5h ago", action: false },
          { title: "BPI Alert", desc: "KTM Duke 390 service is overdue", time: "1d ago", action: false },
          { title: "New achievement!", desc: "You unlocked Coastal Cruiser 🌊", time: "3d ago", action: false },
        ].map((n, i) => (
          <div key={i} style={{ display: "flex", gap: 12, padding: "14px 0", borderBottom: `1px solid ${t.border}` }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: i < 2 ? t.accent : t.borderDark, marginTop: 6, flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <p style={{ fontFamily: t.font, fontSize: 13, fontWeight: 600, color: t.text, margin: 0 }}>{n.title}</p>
              <p style={{ fontFamily: t.font, fontSize: 12, color: t.textMuted, margin: "2px 0 0" }}>{n.desc}</p>
              {n.action && <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                <button onClick={() => { setJoinedRides(j => [...new Set([...j, 2])]); }} style={{ padding: "6px 16px", borderRadius: 8, border: "none", background: t.accent, color: "#fff", fontFamily: t.font, fontSize: 11, fontWeight: 600, cursor: "pointer" }}>Join</button>
                <button style={{ padding: "6px 16px", borderRadius: 8, border: `1px solid ${t.borderDark}`, background: "none", color: t.textSec, fontFamily: t.font, fontSize: 11, fontWeight: 600, cursor: "pointer" }}>Decline</button>
              </div>}
            </div>
            <span style={{ fontFamily: t.font, fontSize: 10, color: t.textMuted, flexShrink: 0 }}>{n.time}</span>
          </div>
        ))}
      </div>
    </div>
  );

  // ── Setting Detail (placeholder) ───────────
  const renderSettingDetail = (t) => (
    <div style={{ width: "100%", height: "100%", background: t.bg, display: "flex", flexDirection: "column" }}>
      <SBar t={t} />
      <div style={{ padding: "16px 24px 0" }}><Back onPress={pop} label="Profile" t={t} /></div>
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
        <p style={{ fontFamily: t.font, fontSize: 14, color: t.textMuted, textAlign: "center" }}>Setting detail screen — tap back to return to Profile</p>
      </div>
    </div>
  );

  // ══════════════════════════════════════════════
  //  ROUTING (theme-parameterized)
  // ══════════════════════════════════════════════
  const renderScreen = (t) => {
    try {
      if (flow === "splash") return renderSplash(t);
      if (flow === "onboard") return renderOnboard(t);
      if (flow === "auth") return renderAuth(t);
      if (flow === "otp") return renderOTP(t);

      if (currentSub) {
        const s = currentSub.screen;
        console.log("[WeRide] rendering sub-screen:", s);
        if (s === "createRide") return renderCreateRide(t);
        if (s === "scenic") return renderScenic(t);
        if (s === "rideDetail") return renderRideDetail(t);
        if (s === "liveRide") return renderLiveRide(t);
        if (s === "navigation") return renderNavigation(t);
        if (s === "bikeDetail") return renderBikeDetail(t);
        if (s === "addBike") return renderAddBike(t);
        if (s === "deleteAccount") return renderDeleteAccount(t);
        if (s === "notifications") return renderNotifications(t);
        if (s === "settingDetail") return renderSettingDetail(t);
        console.error("[WeRide] unknown sub-screen:", s);
      }

      if (tab === "home") return renderHome(t);
      if (tab === "garage") return renderGarage(t);
      if (tab === "xp") return renderXP(t);
      if (tab === "profile") return renderProfile(t);
      return renderHome(t);
    } catch (err) {
      console.error("[WeRide] RENDER CRASH:", err);
      return <div style={{ padding: 24, color: "red", fontFamily: t.font, fontSize: 12 }}><b>Render error:</b><pre style={{ whiteSpace: "pre-wrap", marginTop: 8 }}>{err.message}{"\n"}{err.stack}</pre></div>;
    }
  };

  // ══════════════════════════════════════════════
  //  DUAL PHONE FRAME LAYOUT
  // ══════════════════════════════════════════════
  const screenLabel = flow !== "main" ? flow : currentSub ? currentSub.screen : tab;

  const PhoneFrame = ({ theme, label, sublabel }) => (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
      {/* Label */}
      <div style={{ textAlign: "center" }}>
        <p style={{ fontFamily: LIGHT.serif, fontSize: 16, color: LIGHT.text, margin: 0, letterSpacing: "-0.01em" }}>{label}</p>
        <p style={{ fontFamily: LIGHT.font, fontSize: 10, color: LIGHT.textMuted, margin: "2px 0 0", letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 500 }}>{sublabel}</p>
      </div>
      {/* Phone shell */}
      <div style={{ width: 290, height: 628, borderRadius: 40, background: "#111", padding: 6, boxShadow: theme.isDark
        ? "0 25px 60px rgba(0,0,0,0.5), 0 8px 20px rgba(0,0,0,0.3), 0 0 0 1px rgba(217,154,48,0.08)"
        : "0 25px 60px rgba(26,22,18,0.35), 0 8px 20px rgba(26,22,18,0.2)", position: "relative" }}>
        {/* Notch */}
        <div style={{ position: "absolute", top: 10, left: "50%", transform: "translateX(-50%)", width: 90, height: 24, borderRadius: 12, background: "#111", zIndex: 100 }} />
        {/* Screen */}
        <div style={{ width: "100%", height: "100%", borderRadius: 34, overflow: "hidden", background: theme.bg, position: "relative" }}>
          {renderScreen(theme)}
        </div>
      </div>
      {/* Screen name */}
      <span style={{ fontFamily: LIGHT.font, fontSize: 11, color: LIGHT.textMuted, fontWeight: 500, letterSpacing: "0.06em", textTransform: "uppercase" }}>
        {screenLabel}
      </span>
    </div>
  );

  // ── Color Swatch + Picker ──
  const Swatch = ({ tokenKey, value, onChange }) => (
    <label style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer", padding: "3px 0" }}>
      <div style={{ position: "relative", width: 20, height: 20, borderRadius: 5, background: value, border: "1px solid rgba(0,0,0,0.1)", flexShrink: 0 }}>
        <input type="color" value={value} onChange={e => onChange(tokenKey, e.target.value)} style={{ position: "absolute", inset: 0, opacity: 0, cursor: "pointer", width: "100%", height: "100%" }} />
      </div>
      <span style={{ fontFamily: LIGHT.font, fontSize: 9, color: "#6B5E50", fontWeight: 500, width: 62, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{tokenKey}</span>
      <input
        type="text"
        value={value}
        onChange={e => { const v = e.target.value; if (/^#[0-9a-fA-F]{0,6}$/.test(v)) onChange(tokenKey, v); }}
        onBlur={e => { const v = e.target.value; if (!/^#[0-9a-fA-F]{6}$/.test(v)) onChange(tokenKey, value); }}
        style={{ fontFamily: "'Outfit',monospace", fontSize: 9, color: "#1A1612", background: "#F5F0E6", border: "1px solid #E8E2D8", borderRadius: 4, padding: "2px 4px", width: 62, outline: "none" }}
      />
    </label>
  );

  return (
    <div style={{ minHeight: "100vh", background: "#F5F0E8", fontFamily: LIGHT.font }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=Outfit:wght@300;400;500;600;700;800&display=swap');*{box-sizing:border-box;margin:0;padding:0}::-webkit-scrollbar{display:none}body{background:#F5F0E8!important}`}</style>

      {/* Header */}
      <div style={{ textAlign: "center", padding: "44px 24px 6px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 6 }}>
          <svg width="24" height="24" viewBox="0 0 48 48" fill="none"><path d="M8 36C8 36 12 16 24 16C36 16 40 36 40 36" stroke={lightTheme.accent} strokeWidth="3" strokeLinecap="round"/><circle cx="12" cy="36" r="5" stroke={lightTheme.text} strokeWidth="2" fill="none"/><circle cx="36" cy="36" r="5" stroke={lightTheme.text} strokeWidth="2" fill="none"/></svg>
          <span style={{ fontFamily: LIGHT.serif, fontSize: 22, color: LIGHT.text, letterSpacing: "-0.02em" }}>WeRide</span>
        </div>
        <p style={{ fontFamily: LIGHT.font, fontSize: 11, color: LIGHT.textMuted, letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 500 }}>Interactive Prototype · Day & Night Mode Comparison</p>
      </div>

      {/* ═══ COLOR TOKEN PICKER PANEL ═══ */}
      <div style={{ maxWidth: 700, margin: "0 auto", padding: "12px 24px 0" }}>
        <button onClick={() => setPickerOpen(o => !o)} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", background: "#fff", border: `1px solid ${LIGHT.border}`, borderRadius: pickerOpen ? "14px 14px 0 0" : 14, padding: "12px 18px", cursor: "pointer" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={LIGHT.accent} strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/><path d="M12 2v4m0 12v4M2 12h4m12 0h4"/></svg>
            <span style={{ fontFamily: LIGHT.serif, fontSize: 14, color: LIGHT.text }}>Design Tokens</span>
            <span style={{ fontFamily: LIGHT.font, fontSize: 10, color: LIGHT.textMuted, fontWeight: 500 }}>({Object.keys(LIGHT_HEX).length} colors per theme)</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {!pickerOpen && <div style={{ display: "flex", gap: 2 }}>{["accent","green","blue","red","text"].map(k => <div key={k} style={{ width: 12, height: 12, borderRadius: 3, background: lightHex[k], border: "1px solid rgba(0,0,0,0.08)" }} />)}</div>}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={LIGHT.textMuted} strokeWidth="2" strokeLinecap="round" style={{ transform: pickerOpen ? "rotate(180deg)" : "none", transition: "transform .2s" }}><path d="M6 9l6 6 6-6"/></svg>
          </div>
        </button>

        {pickerOpen && (
          <div style={{ background: "#fff", border: `1px solid ${LIGHT.border}`, borderTop: "none", borderRadius: "0 0 14px 14px", padding: "16px 18px 18px" }}>
            {/* Column headers */}
            <div style={{ display: "flex", gap: 20, marginBottom: 12 }}>
              <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: lightHex.accent }} />
                <span style={{ fontFamily: LIGHT.font, fontSize: 11, fontWeight: 700, color: LIGHT.text, textTransform: "uppercase", letterSpacing: "0.06em" }}>Day Mode</span>
              </div>
              <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: darkHex.accent }} />
                <span style={{ fontFamily: LIGHT.font, fontSize: 11, fontWeight: 700, color: LIGHT.text, textTransform: "uppercase", letterSpacing: "0.06em" }}>Night Mode</span>
              </div>
            </div>

            {/* Token groups */}
            {TOKEN_GROUPS.map(group => (
              <div key={group.name} style={{ marginBottom: 10 }}>
                <p style={{ fontFamily: LIGHT.font, fontSize: 9, color: LIGHT.textMuted, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", margin: "0 0 4px", paddingTop: 6, borderTop: `1px solid ${LIGHT.border}` }}>{group.name}</p>
                <div style={{ display: "flex", gap: 20 }}>
                  {/* Light column */}
                  <div style={{ flex: 1 }}>
                    {group.keys.map(k => <Swatch key={k} tokenKey={k} value={lightHex[k]} onChange={updateLight} />)}
                  </div>
                  {/* Dark column */}
                  <div style={{ flex: 1 }}>
                    {group.keys.map(k => <Swatch key={k} tokenKey={k} value={darkHex[k]} onChange={updateDark} />)}
                  </div>
                </div>
              </div>
            ))}

            {/* Reset button */}
            <div style={{ display: "flex", justifyContent: "flex-end", paddingTop: 8, borderTop: `1px solid ${LIGHT.border}` }}>
              <button onClick={resetTokens} style={{ fontFamily: LIGHT.font, fontSize: 10, color: LIGHT.red, fontWeight: 600, background: "none", border: `1px solid ${LIGHT.red}30`, borderRadius: 6, padding: "5px 14px", cursor: "pointer" }}>Reset to Defaults</button>
            </div>
          </div>
        )}
      </div>

      {/* Dual Phone Layout */}
      <div style={{ display: "flex", justifyContent: "center", gap: 48, padding: "24px 24px 48px", flexWrap: "wrap" }}>
        <PhoneFrame
          theme={lightTheme}
          label="Day Ride"
          sublabel="Outdoor · Sunlight · Stops"
        />
        <PhoneFrame
          theme={darkTheme}
          label="Night Ride"
          sublabel="Dusk · Tunnels · Low Light"
        />
      </div>
    </div>
  );
}
