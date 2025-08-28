import React, { useEffect, useMemo, useState } from "react";
import { Calendar } from "lucide-react";

import {
  ResponsiveContainer,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  LineChart,
  Line,
  BarChart,
  Bar,
  ReferenceLine
} from "recharts";
// keep your existing gauges

import SpeedGauge from "../SpeedGauge";
import OnlyForSpeed from "../OnlyForSpeed";
import ThreeQuarterGauge from "../ThreeQuarterGauge";
import OnlyForsoc from '../OnlyForsoc'
import "./index.css"
import { col, label } from "framer-motion/client";
import { color } from "framer-motion";



const fmt = {
  num(x, d = 2) {
    if (x === undefined || x === null || isNaN(Number(x))) return "N/A";
    const n = Number(x);
    return Math.abs(n) >= 1000 ? n.toFixed(0) : n.toFixed(d);
  },
  parseDate(t) {
    if (!t) return null;
    const d = new Date(t);
    return isNaN(d) ? null : d;
  },
  when(t) {
    const d = fmt.parseDate(t);
    return d ? `${d.toLocaleDateString()} ${d.toLocaleTimeString()}` : "";
  },
};
const SectionTitle = ({ left, right }) => (
  <div className="mb-3 flex items-center justify-between">
    <h3 className="text-xs sm:text-sm tracking-widest text-cyan-300/80">
      {left}
    </h3>
    {right}
  </div>
);

const StatChip = ({ label, value }) => (
  <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-2">
    <p className="text-[10px] tracking-wide text-white/60">{label}</p>
    <p className="break-all text-sm sm:text-base font-semibold text-white">
      {value}
    </p>
  </div>
);


const CARD_BASE_TRANSPARENT =
  "rounded-2xl border-2 border-white/20 bg-transparent p-4";
  const CARD_BASE = 
  "rounded-2xl border border-white/10 bg-slate-800/70 p-4";


const CARD_BASE_GLOW  =
  "rounded-2xl border border-cyan-400/30 bg-slate-900/60 p-4 shadow-[0_0_20px_rgba(34,211,238,0.4)] hover:shadow-[0_0_30px_rgba(34,211,238,0.7)] transition";


const CARD_BASE_FLAT =
  "rounded-2xl border border-white/30 bg-slate-900/60 p-4";

const CARD_MIN_H = "min-h-[220px]"; // same height across the grid
const CARD_CLICK_OVERLAY =
  "absolute inset-0 rounded-2xl cursor-pointer focus:outline-none focus:ring-2 focus:ring-cyan-400";

// Wrap any content so the WHOLE card opens a modal when clicked
function Svg({ title, children, minH = CARD_MIN_H, maxW = "max-w-5xl", glow = false }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <div className={`relative ${glow ? CARD_BASE_GLOW : CARD_BASE_FLAT} ${minH}`}>
        {/* Invisible overlay for click-to-expand */}
        <button
          type="button"
          className={CARD_CLICK_OVERLAY}
          aria-label={`Expand ${title || "card"}`}
          onClick={() => setOpen(true)}
        />
        <div className="relative z-10">{children}</div>
      </div>
    </>
  );
}


function ThermometerCard({
  label,
  value = 0,
  max = 120,
  min = 0,
  gradient = ["#06b6d4", "#3b82f6"],
  height = 160, // fixed height
}) {
  const safeMax = Math.max(min + 1, max);
  const clamped = Math.min(safeMax, Math.max(min, Number(value) || 0));
  const percent = ((clamped - min) / (safeMax - min)) * 100;

  const ticks = Array.from({ length: 6 }, (_, i) => {
    const frac = i / 5;
    return Math.round(min + (safeMax - min) * (1 - frac));
  });

  return (
    <div className="flex flex-col items-center w-[100px]"> 
      {/* 👆 fixed width so it doesn’t resize */}

      {/* Label + Value */}
      <div className="mb-2 text-center">
        <p className="text-xs uppercase tracking-wide text-white/60 truncate">
          {label}
        </p>
        <p className="text-lg font-semibold text-white">
          {clamped}°C
        </p>
      </div>

      {/* Thermometer column */}
      <div className="flex items-end gap-3">
        <div
          className="relative w-8 overflow-hidden rounded-full border border-cyan-500/30 bg-slate-800 flex-shrink-0"
          style={{ height }} // fixed height
        >
          <div
            className="absolute bottom-0 left-0 w-full transition-all duration-700"
            style={{
              height: `${percent}%`,
              backgroundImage: `linear-gradient(to top, ${gradient[0]}, ${gradient[1]})`,
              boxShadow: "0 -6px 20px rgba(56, 189, 248, 0.35) inset",
            }}
          />
        </div>
        {/* Ticks */}
        <div
          className="flex flex-col justify-between text-[10px] text-white/60"
          style={{ height }} // keep ticks same height
        >
          {ticks.map((t, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="h-px w-3 bg-white/30" />
              <span>{t}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}






/* =========================
   Main
========================= */
export default function RealTimeChart({ vin: initialVin }) {
  const [vin, setVin] = useState(initialVin || "");
  const [vinList, setVinList] = useState([]);
  const [data, setData] = useState([]);
  const [startDateTime, setStartDateTime] = useState("");
  // const [endDateTime, setEndDateTime] = useState("");
  const [mode, setMode] = useState("realtime");
  const [details, setDetails] = useState([]);
  const [showInAHChart, setShowInAHChart] = useState(false);
  const [latestGauges, setLatestGauges] = useState(null);
  const [livedata, setLiveData] = useState([]); // ✅ start as empty array
  // const [showChart, setShowChart] = useState(false);
const [historyData, setHistoryData] = useState([]);
const [showHistoryChart, setShowHistoryChart] = useState(false);

const [ntcData, setNtcData] = useState(null);
  const [searchValue, setSearchValue] = useState("");

  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const [isSelecting, setIsSelecting] = useState(false);
  const [loading, setLoading] = useState(false);
  // const [showHistoryChart, setShowHistoryChart] = useState(false);
const [selectedVin, setSelectedVin] = useState(null);
const [showMetrics1, setShowMetrics1] = useState(false);



  const [endDateTime, setEndDateTime] = React.useState(() => {
    return localStorage.getItem("endDateTime") || "";
  });

const [apiUrl, setApiUrl] = useState("");

 const [locationName, setLocationName] = useState("Loading...");

  // Extract raw lat,long
  const rawLatLong = details?.lat_long;

  useEffect(() => {
    if (!rawLatLong) return;

    const [lat, lng] = rawLatLong.split(",").map((n) => parseFloat(n));

    fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`)
      .then((res) => res.json())
      .then((data) => {
        setLocationName(data.display_name || `${lat}, ${lng}`);
      })
      .catch(() => {
        setLocationName(`${lat}, ${lng}`);
      });
  }, [rawLatLong]); 


// ✅ Options for checkbox
// Graph States
const [livedatafor, setLivedatafor] = useState([]);
const [metricsSelected, setMetricsSelected] = useState(["currentconsumption"]);

const [metricsSelected1, setMetricsSelected1] = useState(["currentconsumption"]);


// const [metricsSelected, setMetricsSelected] = useState(["currentconsumption"]);
const [showMetrics, setShowMetrics] = useState(false); // mobile dropdown toggle


const metricOptions = [
  { key: "currentconsumption", label: "Current (A)", color: "#22c55e" },   // Positive → green
  { key: "speed_kmph", label: "Speed (km/h)", color: "#0ea5e9" },            // Bright blue
  { key: "motortemp", label: "Motor Temp (°C)", color: "#facc15" },          // Bright yellow
  { key: "controllermostemp", label: "Controller Temp (°C)", color: "#fc6d07ff" },
  {key : "soc", label:"Soc (%)" , color:"#ffff"},   // Orange
    {key : "batvoltage", label:"Batvoltage (%)" , color:"#FFF293"},   // Orange
  { key: "ntc1", label: "NTC 1", color: "#8b5cf6" },                         // Violet
  { key: "ntc2", label: "NTC 2", color: "#bf06d4ff" },                         // Cyan
  { key: "ntc3", label: "NTC 3", color: "#120befff" },                         // Pinkish red
  { key: "ntc4", label: "NTC 4", color: "#10b981" },  
                         // Teal
  // { key: "ntc5", label: "NTC 5", color: "#f43f5e" },                         // Bright pink
  // { key: "ntc6", label: "NTC 6", color: "#c084fc" },                         // Light purple
  // { key: "ntc7", label: "NTC 7", color: "#22d3ee" },                         // Light cyan
  // { key: "ntc8", label: "NTC 8", color: "#fcd34d" },                         // Light yellow
];




const metricOptions1 = [
  { key: "currentconsumption", label: "Current (A)", color: "#22c55e" },   // Positive → green
  { key: "speed_kmph", label: "Speed (km/h)", color: "#0ea5e9" },            // Bright blue
  { key: "motortemp", label: "Motor Temp (°C)", color: "#facc15" },          // Bright yellow
  { key: "controllermostemp", label: "Controller Temp (°C)", color: "#fc6d07ff" },
    {key : "batvoltage", label:"Batvoltage (%)" , color:"#FFF293"},   // Orange
  {key : "soc", label:"Soc (%)" , color:"rgba(251, 236, 252, 1)"},   // Orange
  { key: "ntc1", label: "NTC 1", color: "#8b5cf6" },                         // Violet
  { key: "ntc2", label: "NTC 2", color: "#760582ff" },                         // Cyan
  { key: "ntc3", label: "NTC 3", color: "#120befff" },                         // Pinkish red
  { key: "ntc4", label: "NTC 4", color: "#10b981" },                         // Teal
  // { key: "ntc5", label: "NTC 5", color: "#f43f5e" },                         // Bright pink
  // { key: "ntc6", label: "NTC 6", color: "#c084fc" },                         // Light purple
  // { key: "ntc7", label: "NTC 7", color: "#22d3ee" },                         // Light cyan
  // { key: "ntc8", label: "NTC 8", color: "#fcd34d" },                         // Light yellow
];



   const handleMetricChange = (key) => {
    if (metricsSelected.includes(key)) {
      setMetricsSelected(metricsSelected.filter((m) => m !== key));
    } else {
      setMetricsSelected([...metricsSelected, key]);
    }
  };

  const handleMetricChange1 = (key) => {
    setMetricsSelected1((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  // Fetch live telemetry
  useEffect(() => {
    if (!vin) return;

    const apiUrl = `https://ble.nerdherdlab.com/telemery.php?vin=${vin}`;
    const fetchData = async () => {
  try {
    const res = await fetch(apiUrl);
    const json = await res.json();
    console.log("API response:", json);

    if (Array.isArray(json)) {
      setLivedatafor(json);
    } else {
      setLivedatafor([]); // fallback if error object
    }
  } catch (err) {
    console.error("Fetch error:", err);
    setLivedatafor([]);
  }
};


    fetchData();
    const interval = setInterval(fetchData, 5000); // refresh every 2 sec
    return () => clearInterval(interval);
  }, [vin]);

  // Preprocess data for chart
 const processedData = Array.isArray(livedatafor)
  ? livedatafor.map((item) => ({
      time: item.time,
      currentPositive: item.currentconsumption > 0 ? item.currentconsumption : 0,
      currentNegative: item.currentconsumption < 0 ? Math.abs(item.currentconsumption) : 0,
      speed_kmph: item.speed_kmph,
      motortemp: item.motortemp,
      controllermostemp: item.controllermostemp,
      batvoltage: item.batvoltage,
      soc: item.soc,
      ntc1: item.ntc?.[0] ?? null,
      ntc2: item.ntc?.[1] ?? null,
      ntc3: item.ntc?.[2] ?? null,
      ntc4: item.ntc?.[3] ?? null,
      ntc5: item.ntc?.[4] ?? null,
      ntc6: item.ntc?.[5] ?? null,
      ntc7: item.ntc?.[6] ?? null,
      ntc8: item.ntc?.[7] ?? null,
    }))
  : [];


const processedData1 = historyData.map((item) => {
  const ntc = Array.isArray(item.ntc) ? item.ntc : []; // safe fallback to empty array
  return {
    time: item.time,
    currentPositive: item.currentconsumption > 0 ? item.currentconsumption : 0,
    currentNegative: item.currentconsumption < 0 ? Math.abs(item.currentconsumption) : 0,
    speed_kmph: item.speed_kmph,
    motortemp: item.motortemp,
    controllermostemp: item.controllermostemp,
    batvoltage:item.batvoltage,
    soc:item.soc,
    ntc1: ntc[0] ?? null,
    ntc2: ntc[1] ?? null,
    ntc3: ntc[2] ?? null,
    ntc4: ntc[3] ?? null,
    ntc5: ntc[4] ?? null,
    ntc6: ntc[5] ?? null,
    ntc7: ntc[6] ?? null,
    ntc8: ntc[7] ?? null,
  };
});


  


useEffect(() => {
  if (!vin) return;
  fetch(`https://ble.nerdherdlab.com/latest_ntc.php?vin=${vin}`)
    .then(res => res.json())
    .then(json => setNtcData(json))
    .catch(err => console.error("NTC fetch error:", err));
}, [vin]);


// Search API call
useEffect(() => {
  if (searchValue.trim().length < 2) {
    // ✅ Clear suggestions and hide dropdown
    setSuggestions([]);
    setShowSuggestions(false);
    return;
  }

  const fetchSuggestions = async () => {
    try {
      const res = await fetch(
        `https://ble.nerdherdlab.com/search_vehicle.php?q=${searchValue}`
      );
      const data = await res.json();

      // ✅ Only show dropdown if results are there
      if (Array.isArray(data) && data.length > 0) {
        setSuggestions(data);
        setShowSuggestions(true);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }

      setHighlightIndex(-1);
    } catch (err) {
      console.error("Error fetching suggestions", err);
      setShowSuggestions(false);
    }
  };

  fetchSuggestions();
}, [searchValue]);



async function fetchLatestByVin(v) {
  if (!v) return;
  try {
    const res = await fetch(`https://ble.nerdherdlab.com/socapulastdata.php?vin=${encodeURIComponent(v)}`);
    const json = await res.json();
    if (!json || json.error) return;
    setLatestGauges(json);
  } catch (e) {
    console.error("latest_by_vin error", e);
  }
}

useEffect(() => {


  const trimmedVin = vin?.trim();
  if (!trimmedVin) {
    setDetails(null);
    return;
  }
  if (!vin) return;

  // initial pull
  fetchLatestByVin(vin);

  // live refresh (every 2–3s feels snappy; match your backend insert rate)
  const id = setInterval(() => fetchLatestByVin(vin), 5000);

  return () => clearInterval(id);
}, [vin]);


  useEffect(() => {
  const trimmedVin = vin?.trim();

  // if no VIN → clear state and stop fetching
  if (!trimmedVin) {
    setDetails(null);
    setLiveData([]); // clear old data too
    return;
  }

  const fetchLiveData = async () => {
    try {
      const res = await fetch(
        `https://ble.nerdherdlab.com/selcectvinlastdata.php?vin=${trimmedVin}`
      );

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const json = await res.json();

      // normalize → always an array
      const arr = Array.isArray(json) ? json : json ? [json] : [];

      // reverse so newest is last
      setLiveData(arr.reverse());
    } catch (err) {
      console.error("Live telemetry fetch error:", err);
    }
  };

  // initial fetch
  fetchLiveData();

  // repeat fetch every 5s
  const interval = setInterval(fetchLiveData, 5000);

  // cleanup on unmount or vin change
  return () => clearInterval(interval);
}, [vin]);


    // const [vin, setVin] = useState(initialVin || "");
  // VIN list

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`https://ble.nerdherdlab.com/all_vinfetch.php`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        if (Array.isArray(json) && json.length > 0) {
          setVinList(json);
          if (!initialVin) setVin(json[0]);
        } else {
          setVinList([]);
          setVin("");
        }
      } catch (e) {
        console.error("VIN list error", e);
      }
    })();
  }, [initialVin]);



  // Vehicle details by VIN
useEffect(() => {
  const trimmedVin = vin?.trim();
  if (!trimmedVin) {
    setDetails(null);
    return;
  }

  const fetchDetails = async () => {
    try {
      setDetails(null);
      const res = await fetch(`https://ble.nerdherdlab.com/fetch_allvinmodeldtat.php?vin=${encodeURIComponent(vin)}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      console.log("Fetched JSON:", json);
      setDetails(json?.data || {}); // <-- pick the data object
    } catch (e) {
      console.error("Vehicle details error", e);
      setDetails({});
    }
  };

  fetchDetails();
}, [vin]);



   const fetchLast200Data = async () => {
    if (!vin) return;
    try {
      const res = await fetch(
        `https://ble.nerdherdlab.com/selcectvinlastdata.php?vin=${vin}`
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      const arr = Array.isArray(json) ? json : json ? [json] : [];
      setLiveData(arr.reverse()); // reverse so latest appears at the bottom/right
    } catch (e) {
      console.error("History error", e);
    }
  };

  // ✅ run once when VIN changes
  useEffect(() => {
    if (!vin) return;
    fetchLast200Data();
  }, [vin]);

  // Data fetching (realtime & historical)
  const fetchRealtimeData = async () => {
    if (!vin) return;
    try {
      const res = await fetch(`https://ble.nerdherdlab.com/real_timedata1.php`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      const arr = Array.isArray(json) ? json : json ? [json] : [];
      setData(arr.reverse());
    } catch (e) {
      console.error("Realtime error", e);
    }
  };

 const fetchHistoricalData = async () => {
    if (!vin || !startDateTime || !endDateTime) {
      alert("Please select VIN, start and end date.");
      return;
    }

    setLoading(true);
    setShowHistoryChart(false);

    try {
      const res = await fetch(
        `https://ble.nerdherdlab.com/backtimedatfetch.php?vin=${encodeURIComponent(
          vin
        )}&start=${encodeURIComponent(startDateTime)}&end=${encodeURIComponent(endDateTime)}`
      );

      const json = await res.json();
      const data = json.data || json; // handle API returning {data:[]} or just array

      if (Array.isArray(data) && data.length > 0) {
        setHistoryData(data.reverse());
        setShowHistoryChart(true);
      } else {
        setHistoryData([]);
        setShowHistoryChart(false);
        alert("No data available in this range.");
      }
    } catch (err) {
      console.error("Error loading history:", err);
      alert("Failed to load data.");
    } finally {
      setLoading(false);
    }
  };



  // Poll realtime every 5s
  useEffect(() => {
    if (!vin) return;
    let intv;
    if (mode === "realtime") {
      fetchRealtimeData();
      intv = setInterval(fetchRealtimeData, 2000);
    }
    return () => intv && clearInterval(intv);
  }, [vin, mode]);

  const latest = useMemo(() => (data?.length ? data[0] : {}), [data]);

  // Tooltip for the main chart
  const CustomTooltip = ({ active, payload }) => {
    if (!(active && payload && payload.length)) return null;
    const p = payload[0].payload || {};
    return (
      <div className="rounded-xl border border-cyan-400/20 bg-slate-900/90 px-3 py-2 text-xs text-white shadow-lg">
        <div className="grid min-w-[280px] grid-cols-2 gap-x-6 gap-y-1">
          <span className="text-white/60">Time</span>
          <span>{p.time ? fmt.when(p.time) : "N/A"}</span>
          <span className="text-white/60">Current (A)</span>
          <span>{fmt.num(p.currentconsumption)}</span>
          <span className="text-white/60">inAH</span>
          <span>{fmt.num(p.inAH ?? p.inah)}</span>
          <span className="text-white/60">inAH by Charger</span>
          <span>{fmt.num(p.inAH_by_charger ?? p.inah_by_charger)}</span>
          <span className="text-white/60">inAH by Regen</span>
          <span>{fmt.num(p.inAH_by_regen ?? p.inah_by_regen)}</span>
          <span className="text-white/60">outAH</span>
          <span>{fmt.num(p.outAH ?? p.outah)}</span>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#1B263B,_#0D1B2A_70%)] text-white">
      {/* Header */}
   <header className="sticky top-0 z-20 border-b border-white/10 bg-slate-900/60 backdrop-blur supports-[backdrop-filter]:bg-slate-900/40">
  <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:py-4">
    
    {/* 🔹 Left side with Logo + Title */}
    <div className="flex items-center gap-3">
      <img
        src="https://image2url.com/images/1755511837883-d480dc7d-7419-4341-acc6-decf0d6810b5.png"   // <-- Replace with your logo URL or /public path
        alt="Rivot Motors"
        className="h-10"
      />
      <h1 className="text-white font-semibold tracking-wide sm:text-xl">
        RIVOT MOTORS <span className="text-white">COMMAND CENTER</span>
      </h1>
    </div>
  </div>
</header>


    <main className="mx-auto max-w-7xl px-4 py-6">
  {/* ✅ One Big Card */}
{/* 🔥 Big Card with Glow */}
<div className="relative rounded-xl border border-cyan-400/30 bg-slate-900/80 p-6 
     shadow-[0_0_25px_rgba(34,211,238,0.6)]">
 <div className="absolute -inset-1 rounded-2xl bg-[radial-gradient(circle_at_top_left,#22d3ee55,transparent_70%),radial-gradient(circle_at_top_right,#22d3ee55,transparent_70%), radial-gradient(circle_at_bottom_left,#22d3ee55,transparent_70%), radial-gradient(circle_at_bottom_right,#22d3ee55,transparent_70%)] blur-2xl opacity-80 pointer-events-none"></div>
  {/* Content wrapper stays above */}
  <div className="relative z-10">
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Vehicle Card */}
<Svg title="Vehicle" minH={200} glow={false}>
      <SectionTitle left="Scooter Details" />
<div className="relative w-full max-w-md">
  <div className="flex items-center gap-2">
 <input
  type="text"
  value={searchValue}
  onChange={(e) => {
    const val = e.target.value;
    setSearchValue(val);

    if (val.trim() === "") {
      setSuggestions([]);
      setShowSuggestions(false);
      setHighlightIndex(-1);
    } else {
      const filtered = vinList.filter(
        (item) =>
          item.vinnumber.toLowerCase().includes(val.toLowerCase()) ||
          item.ownername.toLowerCase().includes(val.toLowerCase()) ||
          item.phonenumber.includes(val)
      );
      setSuggestions(filtered);
      setShowSuggestions(true);
    }
  }}
  onKeyDown={(e) => {
    if (!showSuggestions || suggestions.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightIndex((prev) =>
        prev < suggestions.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightIndex((prev) =>
        prev > 0 ? prev - 1 : suggestions.length - 1
      );
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (highlightIndex >= 0 && suggestions[highlightIndex]) {
        const selected = suggestions[highlightIndex];
        setSearchValue(selected.vinnumber);
        setVin(selected.vinnumber);
      }
      setSuggestions([]);
      setShowSuggestions(false);
      setHighlightIndex(-1);
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
      setHighlightIndex(-1);
    }
  }}
  placeholder="Search by VIN / Name / Phone"
  className="flex-1 rounded-xl border border-white/10 bg-slate-900/60 px-3 py-2 text-sm outline-none hover:border-cyan-400/40 focus:border-cyan-400"
/>
   <button
  onClick={() => {
    if (searchValue.trim() !== "") {
      setVin(searchValue); // ✅ trigger fetch only here
    }
  }}
  className="px-3 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white text-sm"
>
  Go
</button>
  </div>

  {/* Suggestions Dropdown */}
{showSuggestions && suggestions.length > 0 && (
  <ul className="absolute left-0 top-full mt-1 w-full rounded-lg bg-slate-800 border border-slate-600 max-h-60 overflow-y-auto shadow-lg z-20">
    {suggestions.map((s, i) => (
<li
  key={i}
  onClick={() => {
    // ✅ only fill the input
    setSearchValue(s.vinnumber);
    setSelectedVin(s.vinnumber);

    setSuggestions([]);
    setShowSuggestions(false);
    setHighlightIndex(-1);
  }}
  className={`px-3 py-2 cursor-pointer ${
    i === highlightIndex
      ? "bg-cyan-600 text-white"
      : "hover:bg-cyan-600 hover:text-white"
  }`}
>
  <div className="font-medium">{s.vinnumber}</div>
  <div className="text-xs text-slate-400">
    {s.ownername} • {s.phonenumber}
  </div>
</li>
    ))}
  </ul>
)}
</div>
      {/* VIN Dropdown (old one, optional) */}
      <div className="mt-3 grid grid-cols-2 gap-2">
        <StatChip
          label="VIN-Number"
          value={(details?.vinnumber || details?.vinNumber || vin) || "N/A"}
        />
        <StatChip label="Model" value={details?.model || "N/A"} />
        <StatChip
          label="Owner"
          value={details?.ownerName || details?.ownername || "N/A"}
        />
        <StatChip
          label="Phone"
          value={details?.phoneNumber || details?.phonenumber || "N/A"}
        />
 <StatChip
 label="Scooter Lock/Unlock State"
value={
  <div className="flex justify-center mt-1">
    <div
      className={`text-xs font-semibold px-4 py-1 rounded-full border transition-all ${
        latestGauges?.ev_power_state === "ON"
          ? "bg-emerald-900/40 text-emerald-400 border-emerald-500/40"
          : "bg-red-900/40 text-red-400 border-red-500/40"
      }`}
    >
      {latestGauges?.ev_power_state === "ON" ? "UNLOCK" : "LOCK"}
    </div>
  </div>
}
/>
      <StatChip label="Current Rider" value={latestGauges?.currentrider || "N/A"} />
      </div>
    </Svg>
      {/* Component Data */}
        <Svg title="Component Data" minH={CARD_MIN_H} glow={false}>
        <SectionTitle left="Component Data" />
        <div className="grid grid-cols-2 gap-3">
          <StatChip label="Controller Serial No." value={details?.controllerid  || "N/A"} />
          <StatChip label="Motor Serial No." value={details?.motorid || "N/A"} />
          <StatChip label="BMS Serial No." value={details?.bmsid || "N/A"} />
          <StatChip label="RideOS Version" value={details?.rideosversion || "N/A"} />
          <StatChip label="SmartKey ID" value={details?.smartkeyid || "N/A"} />
          <StatChip label="Charger Serial No." value={ details?.chargerid ?? "N/A"} />
        </div>
      </Svg>

      {/* Vehicle Info (remaining data only) */}
      <Svg title="Vehicle Info" minH="min-h-[160px]" glow={false}>
      <SectionTitle left="Scooter Status" />
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {[
        { label: "ODO Meter", key: "odo", src: "allvin" },
        { label: "Bms Life Cycles", key: "bmslifecycles", src: "allvin" },
        { label: "Trip KM", key: "tripkm", src: "realtime" },
        { label: "Charging State", key: "chargingstate", src: "allvin" },
        { label: "Handle Lock State", key: "handlelockstate", src: "allvin" },
        { label: "Remaining Capacity Ah ", key: "remainingcapacity_ah", src: "realtime" },
        { label: "Location", key: "lat_long", src: "allvin" },
      ].map((t) => {
        const srcObj = t.src === "allvin" ? details : t.src === "realtime" ? latestGauges : {};
        const raw = srcObj?.[t.key];

        let val = raw === null || raw === undefined || raw === "" ? "N/A" : raw;
        let color = "text-white";
        let icon = "";

        // 👉 Replace only Location with human-readable value
        // if (t.key === "lat_long") {
        //   val = locationName;
        // }

        if (t.key === "chargingstate") {
          if (Number(raw) === 1) {
            val = "Charging";
            color = "text-blue-400 animate-pulse";
            icon = "⚡";
          } else if (Number(raw) === 0) {
            val = "Not Charging";
            color = "text-gray-400";
            icon = "🔋";
          }
        }

        if (t.key === "handlelockstate") {
          if (Number(raw) === 1) {
            val = "Handle Locked";
            color = "text-red-400";
            icon = "🔒";
          } else if (Number(raw) === 0) {
            val = "Handle Unlocked";
            color = "text-green-500";
            icon = "🔓";
          }
        }

        return (
          <div
            key={t.key}
            className={`rounded-lg border border-white/10 bg-slate-800/70 p-3 shadow-sm flex flex-col items-center text-center
              ${t.key === "lat_long" ? "sm:col-span-2 md:col-span-3" : ""}`}
          >
            <p className="text-[11px] tracking-wide text-white/60 mb-1">{t.label}</p>
            <div className="flex flex-col items-center text-xs font-semibold">
              {icon && <span className="text-base">{icon}</span>}
              <span
                className={`text-xs md:text-sm break-words whitespace-normal text-center max-w-[220px] ${color}`}
              >
                {val}
              </span>
            </div>
          </div>
        );
      })}
    </div>
</Svg>
    </div>

    {/* Bottom Row inside same card */}
   {/* 🔹 Dashboard Section for NTC, MOS, and AH */}
<div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">

{/* 🔹 AH Values */}
<Svg title="AH Values" minH="min-h-[220px]" className="h-full">
  <div className="p-4 flex flex-col h-full">
    <SectionTitle left="Ah Values" />

    <div className="flex-1 grid grid-cols-1 gap-1 text-sm text-gray-200">
      {(() => {
        if (!livedata || livedata.length === 0) {
          return (
            <div className="text-gray-400 text-sm p-3 text-center">
              No data available
            </div>
          );
        }
        const latest = livedata[livedata.length - 1];

        // Max values (adjust to actual capacity)
        const maxTotal = 100;
        const maxCharger = 100;
        const maxRegen = 100;
        const maxDischarge = 100;

        const bars = [
          {
            label: "In Ah",
            value: latest.inah,
            max: maxTotal,
            barColor: "from-green-600 to-green-400",
            glow: "shadow-[0_0_10px_oklab(82.013% -0.19207 0.16626 / 0.92)",
            textColor: "text-green-400",
          },
          {
            label: "In Ah By Charger",
            value: latest.inah_by_charger,
            max: maxCharger,
            barColor: "from-yellow-500 to-yellow-300",
            glow: "shadow-[0_0_10px_rgba(234,179,8,0.7)]",
            textColor: "text-yellow-300",
          },
          {
            label: "In Ah By Regen",
            value: latest.inah_by_regen,
            max: maxRegen,
            barColor: "from-blue-500 to-blue-400",
            glow: "shadow-[0_0_10px_rgba(17, 95, 240, 0.7)]",
            textColor: "text-blue-400",
          },
         {
        label: "Out Ah",
        value: latest.outah,
        max: maxDischarge,
        barColor: "from-red-600 to-red-500", // 🔵 gradient
        glow: "shadow-[0_0_10px_rgba(239,68,68,0.7)]", // blue glow
        textColor: "text-red-500", // text also blue
      },

        ];

        return bars.map((item, idx) => (
          <div key={idx} className="group transition-all duration-300">
            {/* Label */}
            <div className="text-[11px] text-gray-400 mb-0">{item.label}</div>

            {/* Bar + Value */}
            <div className="flex items-center">
              <div className="flex-1 h-4 bg-slate-800 overflow-hidden relative">
                <div
                  className={`h-4 bg-gradient-to-r ${item.barColor} ${item.glow} transition-all duration-500`}
                  style={{ width: `${Math.min((item.value / item.max) * 100, 100)}%` }}
                ></div>
              </div>
              <span
                className={`ml-3 text-sm font-semibold ${item.textColor} group-hover:scale-110 transition-transform`}
              >
                {Number(item.value).toFixed(2)}
              </span>
            </div>
          </div>
        ));
      })()}
    </div>
  </div>
</Svg>




  {/* 🔹 NTC Temperatures */}
  <Svg title="NTC Temperatures" minH="min-h-[220px]" className="h-full">
    <div className="p-3 flex flex-col h-full">
      <SectionTitle left="NTC Temperatures" />
      <div className="flex-1 flex flex-col justify-center">
        {(() => {
          const raw = ntcData?.ntc ?? "";
          const arr = raw.split(",").map((v) => Number(v.trim()));

          if (arr.length < 8) {
            return (
              <p className="mt-4 text-base text-center text-white/70">N/A</p>
            );
          }

          const main = arr.slice(0, 4);
          const apu = arr.slice(-4);
          const apuAbsent = apu.every((v) => v === -40);

          const renderNTCs = (list, label) => (
            <div className="grid grid-cols-2 gap-2">
              {list.map((val, i) => (
                <div
                  key={i}
                  className="rounded-lg bg-slate-900/70 border border-white/10 p-2 flex flex-col items-center shadow"
                >
                  <span className="text-[11px] text-white/60">{label} {i + 1}</span>
                  <span className="text-sm font-semibold text-white">
                    {val}°C
                  </span>
                </div>
              ))}
            </div>
          );

          return (
            <div className="grid grid-cols-2 gap-3">
              {/* Main Battery */}
              <div className="rounded-lg bg-slate-800/60 border border-white/10 p-2 shadow-md">
                <p className="text-xs text-cyan-400 font-semibold mb-2 text-center">
                  Main Battery
                </p>
                {renderNTCs(main, "NTC")}
              </div>

              {/* APU */}
              <div className="rounded-lg bg-slate-800/60 border border-white/10 p-2 shadow-md">
                <p className="text-xs uppercase text-purple-400 font-semibold mb-2 text-center">
                  APU
                </p>
                {apuAbsent ? (
                  <p className="text-sm text-red-400 font-medium text-center">
                    APU Absent
                  </p>
                ) : (
                  renderNTCs(apu, "NTC")
                )}
              </div>
            </div>
          );
        })()}
      </div>
    </div>
  </Svg>

  {/* 🔹 BMS MOSFET States */}
  <Svg title="BMS MOS States" minH="min-h-[220px]" className="h-full">
    <div className="p-3 flex flex-col h-full">
      <SectionTitle left="Bms Mosfet State" />
      <div className="flex-1 grid grid-cols-2 gap-2 place-items-center">
        {(() => {
          const flags = (details?.bmsmosstates ?? "")
            .split(",")
            .map((v) => parseInt(v.trim(), 10));

          const states = [
            { label: "Main Charging MOS", value: flags[0] },
            { label: "Main Discharging MOS", value: flags[1] },
            { label: "APU Charging MOS", value: flags[2] },
            { label: "APU Discharging MOS", value: flags[3] },
          ];

          return states.map((s, i) => (
            <div
              key={i}
              className="rounded-md bg-slate-900/70 border border-white/10 p-2 flex flex-col items-center shadow w-full"
            >
              <span className="text-[10px] text-white/60 text-center leading-tight mt-2">
                {s.label}
              </span>
              <span
                className={`mt-2 text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                  s.value
                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                    : "bg-red-500/20 text-red-400 border border-red-500/40"
                }`}
              >
                {s.value ? "ON" : "OFF"}
              </span>
            </div>
          ));
        })()}
      </div>
    </div>
  </Svg>

  
</div>
  </div>
</div>

     {/* 📊 Totals Summary (Calculated) */}
   

<div className="relative rounded-xl border border-cyan-400/30 bg-slate-900/80 p-6 
     shadow-[0_0_25px_rgba(34,211,238,0.6)] mt-3">
  {/* Glow overlay (only for the big card) */}
 <div className="absolute -inset-1 rounded-2xl 
                bg-[radial-gradient(circle_at_top_left,#22d3ee55,transparent_70%), 
                    radial-gradient(circle_at_top_right,#22d3ee55,transparent_70%), 
                    radial-gradient(circle_at_bottom_left,#22d3ee55,transparent_70%), 
                    radial-gradient(circle_at_bottom_right,#22d3ee55,transparent_70%)] 
                blur-2xl opacity-80 pointer-events-none"></div>

  {/* Inner content (no glow on inner cards) */}
  <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6">

    {/* Battery Voltage */}
    <div className={CARD_BASE_TRANSPARENT}>
      <SectionTitle left="Battery Voltage" />
      <div className="flex items-center justify-center">
        <OnlyForSpeed
          label="VOLTAGE"
          value={latestGauges?.batvoltage || 0}
          max={100}
          unit="V"
          width={240}
        />
      </div>
    </div>


     {/* SOC */}
    <div className={CARD_BASE_TRANSPARENT}>
      <SectionTitle left="Main SOC" />
      <div className="flex items-center justify-center">
        <SpeedGauge
          value={Number(latestGauges?.soc) || 0}
          max={100}
          unit="%"
          width={240}
        />
      </div>
    </div>

    {/* APUSOC */}
    <div className={CARD_BASE_TRANSPARENT}>
      <SectionTitle left="ApuSOC" />
      <div className="flex items-center justify-center">
        <OnlyForsoc
          value={Number(latestGauges?.apusoc) || 0}
          max={100}
          unit="%"
          width={240}
        />
      </div>
    </div>

    {/* Speed */}
    <div className={CARD_BASE_TRANSPARENT}>
      <SectionTitle left="Speed" />
      <div className="flex items-center justify-center">
        <ThreeQuarterGauge
          value={Number(latestGauges?.speed_kmph) || 0}
          max={150}
          unit="km/h"
          width={240}
        />
      </div>
    </div>

    {/* Tire Pressure */}
    <div className={CARD_BASE_FLAT}>
      <SectionTitle left="Tire Pressure" />
      <div className="flex items-center justify-center">
        <ThreeQuarterGauge
          value={Number(latestGauges?.tirepressure) || 0}
          min={0}
          max={100}
          unit="psi"
          width={220}
        />
      </div>
    </div>


    <div  className={CARD_BASE_TRANSPARENT}>
      <div className="mb-2 text-center">
       <SectionTitle left="Temperatures" />
      </div>
      <div className="flex justify-between items-center gap-3 overflow-x-auto">
        <ThermometerCard
          label="Ctrl Mos Temp"
          value={Number(latestGauges?.controllermostemp) || 0}
          min={0}
          max={120}
          gradient={["#32ed0dff", "#e71414ff"]}
          height={160}   // ⬅️ smaller thermometer
        />
        <ThermometerCard
          label="Motor Temp"
          value={Number(latestGauges?.motortemp) || 0}
          min={0}
          max={120}
          gradient={["#32ed0dff", "#e71414ff"]}
          height={160}
        />
        <ThermometerCard
          label="BMS Mos Temp"
          value={Number(latestGauges?.bmsmostemp) || 0}
          min={0}
          max={120}
          gradient={["#32ed0dff", "#e71414ff"]}
          height={160}
        />
      </div>
      
  </div>

  </div>
</div>



{/* vehical live chart  */}

  <div
      className="relative mt-3 h-[500px] rounded-3xl bg-gradient-to-br from-slate-900/80 to-slate-800/90
                border border-cyan-400/20 shadow-[0_0_25px_rgba(34,211,238,0.3)] backdrop-blur-xl overflow-hidden"
    >
      {/* Glow background */}
      <div
        className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,#22d3ee22,transparent_60%),
                                      radial-gradient(circle_at_bottom_right,#22d3ee22,transparent_60%)] animate-pulse"
      ></div>

      {/* --- 📱 Mobile: Dropdown --- */}
      <div className="md:hidden p-3 relative z-10">
        <div
          onClick={() => setShowMetrics(!showMetrics)}
          className="w-full flex items-center justify-between px-3 py-2 
                        bg-slate-800/80 text-cyan-300 rounded-lg shadow-md 
                        border border-cyan-400/30 text-sm font-medium cursor-pointer"
        >
       Select Parameters To Be Shown On Graph.
          <span>{showMetrics ? "▲" : "▼"}</span>
        </div>

        {showMetrics && (
          <div
            className="mt-2 bg-slate-900/90 border border-cyan-400/20 
                          rounded-xl p-3 space-y-2 shadow-lg"
          >
            {metricOptions.map((opt) => (
              <label
                key={opt.key}
                className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer hover:text-cyan-300 transition"
              >
                <input
                  type="checkbox"
                  checked={metricsSelected.includes(opt.key)}
                  onChange={() => handleMetricChange(opt.key)}
                  className="accent-cyan-500"
                />
                {opt.label}
              </label>
            ))}
          </div>
        )}
      </div>

      <div className="grid md:grid-cols-[1fr_220px] h-full relative z-10">
        {/* --- Chart --- */}
                <div className="p-4">
        <ResponsiveContainer
          width="100%"
          height={window.innerWidth < 768 ? 360 : 450} // 📱 mobile taller
        >
          <LineChart
            data={processedData}
            margin={{
              top: 10,
              right: 10,
              bottom: window.innerWidth < 768 ? 50 : 20, // 📱 give more space for ticks
              left: 0,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#33415540" vertical={false} />
            {/* X Axis */}
            <XAxis
              dataKey="time"
              tick={{
                fill: "#94a3b8",
                fontSize: window.innerWidth < 768 ? 9 : 11, // 📱 smaller text
                fontWeight: 500,
              }}
              tickLine={false}
              axisLine={{ stroke: "#334155" }}
              padding={{ left: 5, right: 5 }}
              interval="preserveStartEnd"
              tickFormatter={(value) => {
                const date = new Date(value);
                return `${date.getHours().toString().padStart(2, "0")}:${date
                  .getMinutes()
                  .toString()
                  .padStart(2, "0")}`;
              }}
              angle={window.innerWidth < 768 ? -30 : 0} // 📱 slight tilt
              textAnchor={window.innerWidth < 768 ? "end" : "middle"}
              height={window.innerWidth < 768 ? 45 : 30}
            />

            {/* Y Axis */}
            <YAxis
              tick={{
                fill: "#94a3b8",
                fontSize: window.innerWidth < 768 ? 9 : 11,
                fontWeight: 500,
              }}
              width={window.innerWidth < 768 ? 35 : 50} // 📱 compact width
              tickLine={false}
              axisLine={{ stroke: "#334155" }}
              domain={["auto", "auto"]}
            />


          <ReferenceLine y={0} stroke="#64748b" strokeDasharray="6 3" strokeWidth={1.2} />

          {/* Tooltip */}
          <Tooltip
            itemStyle={{ fontWeight: 500 }}
            contentStyle={{
              backgroundColor: "#0f172a",
              border: "1px solid #334155",
              borderRadius: "0.75rem",
              padding: "6px 10px",
              fontSize: window.innerWidth < 768 ? "10px" : "11px",
              boxShadow: "0 0 15px #22d3ee55",
            }}
            formatter={(value, name, props) => {
              const color = props.color || "#f1f5f9";
              return [<span style={{ color, fontWeight: 600 }}>{value}</span>, name];
            }}
          />

          {/* Legend */}
          <Legend
            wrapperStyle={{
              color: "#d1d5db",
              fontSize: window.innerWidth < 768 ? 10 : 12,
              fontWeight: 600,
            }}
            iconType="circle"
          />

          {/* Lines */}
          {metricOptions
            .filter((opt) => metricsSelected.includes(opt.key))
            .map((opt) => {
              if (opt.key === "currentconsumption") {
                return (
                  <React.Fragment key="currentconsumption">
                    <Line type="monotone" dataKey="currentPositive" name="Current + (A)"
                      stroke="#22c55e" strokeWidth={2} dot={false} isAnimationActive={false} connectNulls />
                    <Line type="monotone" dataKey="currentNegative" name="Current - (A)"
                      stroke="#ef4444" strokeWidth={2} dot={false} isAnimationActive={false} connectNulls />
                  </React.Fragment>
                );
              }
              return (
                <Line key={opt.key} type="monotone" dataKey={opt.key} name={opt.label}
                  stroke={opt.color} strokeWidth={1.8} dot={false} isAnimationActive={false} />
              );
            })}
        </LineChart>
      </ResponsiveContainer>

              </div>

        {/* --- 💻 Desktop: Side Metrics Card --- */}
        <div className="hidden md:flex border-l border-cyan-400/20 bg-slate-900/60 backdrop-blur-md p-4 flex-col">
          <h3 className="text-sm font-semibold text-cyan-300 mb-4 tracking-wide border-b border-cyan-500/30 pb-1">
           Select Parameters To Be Shown On Graph.         
            </h3>

          <div className="flex flex-col gap-3">
            {metricOptions.map((opt) => (
              <label
                key={opt.key}
                className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer hover:text-cyan-300 transition"
              >
                <input
                  type="checkbox"
                  checked={metricsSelected.includes(opt.key)}
                  onChange={() => handleMetricChange(opt.key)}
                  className="accent-cyan-500"
                />
                {opt.label}
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>










<div className="mt-3">
  {/* Input Section */}
  <Svg title="Want to see History?">
    <h2 className="text-base font-semibold tracking-wider text-cyan-300 mb-3 border-b border-cyan-500/30 pb-1">
      Select Date and Time To View Data:{" "}
      <span className="text-white">{vin}</span>
    </h2>

    {/* Date Pickers */}
    
    <div className="flex flex-col gap-3 md:flex-row">
      {/* Start Date */}
      <div className="relative w-full">
        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-cyan-400 w-4 h-4 pointer-events-none" />
        <input
          type="datetime-local"
          value={startDateTime}
          onChange={(e) => setStartDateTime(e.target.value)}
          className="w-full rounded-xl border border-cyan-400/30 bg-slate-900/70 pl-10 pr-3 py-2 text-sm text-cyan-200 outline-none
                     hover:border-cyan-400/60 focus:border-cyan-400/90 focus:shadow-[0_0_12px_2px_rgba(34,211,238,0.4)] transition"
        />
      </div>
      {/* End Date */}
      <div className="relative w-full">
        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-cyan-400 w-4 h-4 pointer-events-none" />
      <input
          type="datetime-local"
          value={endDateTime}
          onChange={(e) => setEndDateTime(e.target.value)}
          className="w-full rounded-xl border border-cyan-400/30 bg-slate-900/70 pl-10 pr-3 py-2 text-sm text-cyan-200 outline-none
                     hover:border-cyan-400/60 focus:border-cyan-400/90 focus:shadow-[0_0_12px_2px_rgba(34,211,238,0.4)] transition"
        />
      </div>
    </div>
    {/* Action Button */}
    <div className="mt-4 flex gap-3">
      <button
        onClick={fetchHistoricalData}
        disabled={loading}
        className="rounded-xl border border-cyan-500/50 bg-cyan-600/10 px-5 py-2 text-sm text-cyan-300 
                   hover:bg-cyan-600/20 hover:shadow-[0_0_15px_2px_rgba(34,211,238,0.5)] 
                   transition duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Loading..." : "Load History"}
      </button>
    </div>
  </Svg>

  {/* Chart Section */}
{/* Chart Section */}
{showHistoryChart && historyData.length > 0 && (
  <div className="relative mt-3 h-[500px] rounded-3xl bg-gradient-to-br from-slate-900/80 to-slate-800/90 
                  border border-cyan-400/20 shadow-[0_0_25px_rgba(34,211,238,0.3)] backdrop-blur-xl overflow-hidden">
    
    {/* --- Glow Background --- */}
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,#22d3ee22,transparent_60%),
                                        radial-gradient(circle_at_bottom_right,#22d3ee22,transparent_60%)] animate-pulse"></div>

    {/* --- 📱 Mobile: Dropdown --- */}
    <div className="md:hidden p-3 relative z-20">
      <div
        onClick={() => setShowMetrics1(!showMetrics1)}
        className="w-full flex items-center justify-between px-3 py-2 
                   bg-slate-800/80 text-cyan-300 rounded-lg shadow-md 
                   border border-cyan-400/30 text-sm font-medium cursor-pointer"
      >
        Select Parameters To Be Shown On Graph.
        <span>{showMetrics1 ? "▲" : "▼"}</span>
      </div>

      {showMetrics1 && (
        <div className="mt-2 bg-slate-900/95 border border-cyan-400/30 
                        rounded-xl p-3 space-y-2 shadow-lg max-h-60 overflow-y-auto">
          {metricOptions1.map((opt) => (
            <label
              key={opt.key}
              className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer hover:text-cyan-300 transition"
            >
              <input
                type="checkbox"
                checked={metricsSelected1.includes(opt.key)}
                onChange={() => handleMetricChange1(opt.key)}
                className="accent-cyan-500"
              />
              {opt.label}
            </label>
          ))}
        </div>
      )}
    </div>

    {/* --- Main Layout --- */}
    <div className="grid md:grid-cols-[1fr_220px] h-full relative z-10">
      
      {/* --- Chart --- */}
      <div className="p-4 mt-6 md:mt-0">
        <ResponsiveContainer width="100%" height={window.innerWidth < 768 ? 360 : 420}>
          <LineChart
            data={processedData1}
            margin={{
              top: 10,
              right: 10,
              bottom: window.innerWidth < 768 ? 50 : 20,
              left: 0,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#33415540" vertical={false} />
            
            <XAxis
              dataKey="time"
              tick={{ fill: "#94a3b8", fontSize: window.innerWidth < 768 ? 9 : 11, fontWeight: 500 }}
              tickLine={false}
              axisLine={{ stroke: "#334155" }}
              padding={{ left: 5, right: 5 }}
              interval="preserveStartEnd"
              tickFormatter={(value) => {
                const date = new Date(value);
                return `${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`;
              }}
              angle={window.innerWidth < 768 ? -30 : 0}
              textAnchor={window.innerWidth < 768 ? "end" : "middle"}
              height={window.innerWidth < 768 ? 45 : 30}
            />

            <YAxis
              tick={{ fill: "#94a3b8", fontSize: window.innerWidth < 768 ? 9 : 11, fontWeight: 500 }}
              width={window.innerWidth < 768 ? 35 : 50}
              tickLine={false}
              axisLine={{ stroke: "#334155" }}
              domain={["auto", "auto"]}
            />

            <ReferenceLine y={0} stroke="#64748b" strokeDasharray="6 3" strokeWidth={1.2} />

            <Tooltip
              itemStyle={{ fontWeight: 500 }}
              contentStyle={{
                backgroundColor: "#0f172a",
                border: "1px solid #334155",
                borderRadius: "0.75rem",
                padding: "6px 10px",
                fontSize: window.innerWidth < 768 ? "10px" : "11px",
                boxShadow: "0 0 15px #22d3ee55",
              }}
              formatter={(value, name, props) => {
                const color = props.color || "#f1f5f9";
                return [<span style={{ color, fontWeight: 600 }}>{value}</span>, name];
              }}
            />

            <Legend
              wrapperStyle={{
                color: "#d1d5db",
                fontSize: window.innerWidth < 768 ? 10 : 12,
                fontWeight: 600,
              }}
              iconType="circle"
            />

            {metricOptions1
              .filter((opt) => metricsSelected1.includes(opt.key))
              .map((opt) => {
                if (opt.key === "currentconsumption") {
                  return (
                    <React.Fragment key="currentconsumption">
                      <Line type="monotone" dataKey="currentPositive" name="Current + (A)"
                        stroke="#22c55e" strokeWidth={2} dot={false} isAnimationActive={false} connectNulls />
                      <Line type="monotone" dataKey="currentNegative" name="Current - (A)"
                        stroke="#ef4444" strokeWidth={2} dot={false} isAnimationActive={false} connectNulls />
                    </React.Fragment>
                  );
                }
                return (
                  <Line key={opt.key} type="monotone" dataKey={opt.key} name={opt.label}
                    stroke={opt.color} strokeWidth={1.8} dot={false} isAnimationActive={false} />
                );
              })}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* --- 💻 Desktop: Sidebar --- */}
      <div className="hidden md:flex border-l border-cyan-400/20 bg-slate-900/60 backdrop-blur-md p-4 flex-col">
        <h3 className="text-sm font-semibold text-cyan-300 mb-2 border-b border-cyan-500/30 pb-1">
          Select Parameters To Be Shown On Graph.
        </h3>
        <div className="flex flex-col gap-2">
          {metricOptions1.map((opt) => (
            <label
              key={opt.key}
              className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer hover:text-cyan-300 transition"
            >
              <input
                type="checkbox"
                checked={metricsSelected1.includes(opt.key)}
                onChange={() => handleMetricChange1(opt.key)}
                className="accent-cyan-500"
              />
              {opt.label}
            </label>
          ))}
        </div>
      </div>
    </div>

    {/* --- Close Button --- */}
    <button
      onClick={() => setShowHistoryChart(false)}
      className="absolute bottom-6 right-8 z-20 px-5 py-2
                 bg-red-600/40 hover:bg-red-700/90 
                 text-white text-sm font-semibold 
                 rounded-lg shadow-md border border-red-400/70
                 backdrop-blur-sm
                 transition-all duration-300 ease-in-out
                 hover:scale-105"
    >
      Close
    </button>
  </div>
)}





</div>


      </main>
      <footer className="mx-auto max-w-7xl px-4 py-6 text-center text-xs text-white/50">
        VIN: {(latest?.vinnumber || latest?.vinNumber || vin) || "N/A"} •{" "}
        {mode === "realtime" ? "Live" : "History"}
      </footer>
    </div>
  );


}