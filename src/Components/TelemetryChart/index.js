// import React, { useEffect, useMemo, useState } from "react";
// import {
//   ResponsiveContainer,
//   CartesianGrid,
//   XAxis,
//   YAxis,
//   Tooltip,
//   Legend,
//   LineChart,
//   Line,
//   BarChart,
//   Bar,
// } from "recharts";
// // keep your existing gauges

// import SpeedGauge from "../SpeedGauge";
// import OnlyForSpeed from "../OnlyForSpeed";
// import ThreeQuarterGauge from "../ThreeQuarterGauge";
// import OnlyForsoc from '../OnlyForsoc'

// /* =========================
//    Small utilities
// ========================= */

// const fmt = {
//   num(x, d = 2) {
//     if (x === undefined || x === null || isNaN(Number(x))) return "N/A";
//     const n = Number(x);
//     return Math.abs(n) >= 1000 ? n.toFixed(0) : n.toFixed(d);
//   },
//   parseDate(t) {
//     if (!t) return null;
//     const d = new Date(t);
//     return isNaN(d) ? null : d;
//   },
//   when(t) {
//     const d = fmt.parseDate(t);
//     return d ? `${d.toLocaleDateString()} ${d.toLocaleTimeString()}` : "";
//   },
// };
// const SectionTitle = ({ left, right }) => (
//   <div className="mb-3 flex items-center justify-between">
//     <h3 className="text-xs sm:text-sm tracking-widest uppercase text-cyan-300/80">
//       {left}
//     </h3>
//     {right}
//   </div>
// );

// const StatChip = ({ label, value }) => (
//   <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-2">
//     <p className="text-[10px] uppercase tracking-wide text-white/60">{label}</p>
//     <p className="break-all text-sm sm:text-base font-semibold text-white">
//       {value}
//     </p>
//   </div>
// );

// /* =========================
//    Modal
// ========================= */
// // function Modal({ open, onClose, children, maxW = "max-w-5xl" }) {
// //   if (!open) return null;
// //   return (
// //     <div className="fixed inset-0 z-[999]">
// //       <div
// //         className="absolute inset-0 bg-black/70 backdrop-blur-sm"
// //         onClick={onClose}
// //       />
// //       <div className="absolute inset-0 flex items-center justify-center p-4">
// //         <div
// //           className={`relative w-full ${maxW} rounded-2xl border border-cyan-500/30 bg-slate-900 p-6 shadow-2xl`}
// //           onClick={(e) => e.stopPropagation()}
// //         >
// //           <button
// //             onClick={onClose}
// //             className="absolute right-3 top-3 rounded-md border border-white/10 bg-white/5 px-2 py-1 text-xs text-white/80 hover:bg-white/10"
// //             aria-label="Close"
// //           >
// //             ✕
// //           </button>
// //           {children}
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }

// /* =========================
//    Uniform Card + Expand behavior
// ========================= */
// // one place to control card visuals & size

// const CARD_BASE_TRANSPARENT = 
//   "rounded-2xl border border-white/10 bg-transparent p-4";

// const CARD_BASE_GLOW  =
//   "rounded-2xl border border-cyan-400/30 bg-slate-900/60 p-4 shadow-[0_0_20px_rgba(34,211,238,0.4)] hover:shadow-[0_0_30px_rgba(34,211,238,0.7)] transition";


// const CARD_BASE_FLAT =
//   "rounded-2xl border border-white/10 bg-slate-900/60 p-4";

// const CARD_MIN_H = "min-h-[220px]"; // same height across the grid
// const CARD_CLICK_OVERLAY =
//   "absolute inset-0 rounded-2xl cursor-pointer focus:outline-none focus:ring-2 focus:ring-cyan-400";

// // Wrap any content so the WHOLE card opens a modal when clicked
// function Svg({ title, children, minH = CARD_MIN_H, maxW = "max-w-5xl", glow = false }) {
//   const [open, setOpen] = useState(false);
//   return (
//     <>
//       <div className={`relative ${glow ? CARD_BASE_GLOW : CARD_BASE_FLAT} ${minH}`}>
//         {/* Invisible overlay for click-to-expand */}
//         <button
//           type="button"
//           className={CARD_CLICK_OVERLAY}
//           aria-label={`Expand ${title || "card"}`}
//           onClick={() => setOpen(true)}
//         />
//         <div className="relative z-10">{children}</div>
//       </div>
//     </>
//   );
// }



// /* =========================
//    Combined Temperatures Card (Responsive)
// ========================= */
// // function TemperaturesCard({ latest }) {
// //   const items = [
// //     { label: "Controller Mosfet", value: Number(latest?.controllermostemp) || 0 },
// //     { label: "Motor", value: Number(latest?.motortemp) || 0 },
// //     { label: "BMS Mosfet", value: Number(latest?.bmsmostemp) || 0 },
// //   ];

// //   return (
// //     <div className={`relative ${CARD_BASE_GLOW } ${CARD_MIN_H}`}>
// //       <div className="mb-4">
// //         <p className="text-xs uppercase tracking-wide text-white/60">
// //           Temperatures
// //         </p>
// //       </div>

// //       {/* Responsive grid: stacked on mobile, 3 columns on desktop */}
// //       <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
// //         {items.map((t, i) => {
// //           const safeMax = 120;
// //           const min = 0;
// //           const clamped = Math.min(safeMax, Math.max(min, t.value));
// //           const percent = ((clamped - min) / (safeMax - min)) * 100;

// //           return (
// //             <div key={i} className="flex flex-col items-center">
// //               <p className="mb-2 text-sm font-medium text-white text-center">
// //                 {t.label}
// //               </p>

// //               <div className="flex items-end gap-3">
// //                 {/* Thermometer bar */}
// //                 <div
// //                   className="relative w-8 overflow-hidden rounded-full border border-cyan-500/30 bg-slate-800"
// //                   style={{ height: 160 }}
// //                 >
// //                   <div
// //                     className="absolute bottom-0 left-0 w-full transition-all duration-700"
// //                     style={{
// //                       height: `${percent}%`,
// //                       backgroundImage: `linear-gradient(to top, #92dc11ff, #e71414ff)`,
// //                       boxShadow: "0 -6px 20px rgba(56, 189, 248, 0.35) inset",
// //                     }}
// //                   />
// //                 </div>

// //                 {/* Value */}
// //                 <span className="text-lg font-semibold text-white">
// //                   {clamped}°C
// //                 </span>
// //               </div>
// //             </div>
// //           );
// //         })}
// //       </div>
// //     </div>
// //   );
// // }


// /* =========================
//    Thermometer Card (uses same visuals)
// ========================= */
// function ThermometerCard({
//   label,
//   value = 0,
//   max = 120,
//   min = 0,
//   gradient = ["#06b6d4", "#3b82f6"],
//   height = 160, // fixed height
// }) {
//   const safeMax = Math.max(min + 1, max);
//   const clamped = Math.min(safeMax, Math.max(min, Number(value) || 0));
//   const percent = ((clamped - min) / (safeMax - min)) * 100;

//   const ticks = Array.from({ length: 6 }, (_, i) => {
//     const frac = i / 5;
//     return Math.round(min + (safeMax - min) * (1 - frac));
//   });

//   return (
//     <div className="flex flex-col items-center w-[100px]"> 
//       {/* 👆 fixed width so it doesn’t resize */}

//       {/* Label + Value */}
//       <div className="mb-2 text-center">
//         <p className="text-xs uppercase tracking-wide text-white/60 truncate">
//           {label}
//         </p>
//         <p className="text-lg font-semibold text-white">
//           {clamped}°C
//         </p>
//       </div>

//       {/* Thermometer column */}
//       <div className="flex items-end gap-3">
//         <div
//           className="relative w-8 overflow-hidden rounded-full border border-cyan-500/30 bg-slate-800 flex-shrink-0"
//           style={{ height }} // fixed height
//         >
//           <div
//             className="absolute bottom-0 left-0 w-full transition-all duration-700"
//             style={{
//               height: `${percent}%`,
//               backgroundImage: `linear-gradient(to top, ${gradient[0]}, ${gradient[1]})`,
//               boxShadow: "0 -6px 20px rgba(56, 189, 248, 0.35) inset",
//             }}
//           />
//         </div>
//         {/* Ticks */}
//         <div
//           className="flex flex-col justify-between text-[10px] text-white/60"
//           style={{ height }} // keep ticks same height
//         >
//           {ticks.map((t, i) => (
//             <div key={i} className="flex items-center gap-2">
//               <div className="h-px w-3 bg-white/30" />
//               <span>{t}</span>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }
// /* =========================
//    Main
// ========================= */
// export default function RealTimeChart({ vin: initialVin }) {
//   const [vin, setVin] = useState(initialVin || "");
//   const [vinList, setVinList] = useState([]);
//   const [data, setData] = useState([]);
//   const [startDateTime, setStartDateTime] = useState("");
//   const [endDateTime, setEndDateTime] = useState("");
//   const [mode, setMode] = useState("realtime");
//   const [details, setDetails] = useState(null);
//   const [showInAHChart, setShowInAHChart] = useState(false);
//   const [latestGauges, setLatestGauges] = useState(null);
//   const [livedata, setLiveData] = useState([]); // ✅ start as empty array
//   // const [showChart, setShowChart] = useState(false);
// const [historyData, setHistoryData] = useState([]);
// const [showHistoryChart, setShowHistoryChart] = useState(false);

// const [ntcData, setNtcData] = useState(null);
//   const [searchValue, setSearchValue] = useState("");

//   const [suggestions, setSuggestions] = useState([]);
//   const [showSuggestions, setShowSuggestions] = useState(false);

// useEffect(() => {
//   if (!vin) return;
//   fetch(`http://localhost/phpback/latest_ntc.php?vin=${vin}`)
//     .then(res => res.json())
//     .then(json => setNtcData(json))
//     .catch(err => console.error("NTC fetch error:", err));
// }, [vin]);


// // Search API call
//   useEffect(() => {
//     if (searchValue.length < 2) {
//       setSuggestions([]);
//       return;
//     }

//     const controller = new AbortController();
//     const fetchData = async () => {
//       try {
//         const res = await fetch(
//           `http://localhost/phpback/search_vehicle.php?q=${encodeURIComponent(searchValue)}`,
//           { signal: controller.signal }
//         );
//         const data = await res.json();
//         setSuggestions(data);
//         setShowSuggestions(true);
//       } catch (err) {
//         if (err.name !== "AbortError") console.error(err);
//       }
//     };

//     fetchData();
//     return () => controller.abort();
//   }, [searchValue]);

//   // ✅ function to handle selecting VIN
//   const handleSelectVin = (vinnumber) => {
//     setVin(vinnumber);
//     setSearchValue(vinnumber);
//     setShowSuggestions(false);
//   };



// async function fetchLatestByVin(v) {
//   if (!v) return;
//   try {
//     const res = await fetch(`http://localhost/phpback/socapulastdata.php?vin=${encodeURIComponent(v)}`);
//     const json = await res.json();
//     if (!json || json.error) return;
//     setLatestGauges(json);
//   } catch (e) {
//     console.error("latest_by_vin error", e);
//   }
// }


// useEffect(() => {
//   if (!vin) return;

//   // initial pull
//   fetchLatestByVin(vin);

//   // live refresh (every 2–3s feels snappy; match your backend insert rate)
//   const id = setInterval(() => fetchLatestByVin(vin), 5000);

//   return () => clearInterval(id);
// }, [vin]);





//   useEffect(() => {
//     if (!vin) return;

//     const fetchLiveData = async () => {
//       try {
//         const res = await fetch(
//           `http://localhost/phpback/selcectvinlastdata.php?vin=${vin}`
//         );
//         if (!res.ok) throw new Error(`HTTP ${res.status}`);
//         const json = await res.json();
//         const arr = Array.isArray(json) ? json : json ? [json] : [];
//         setLiveData(arr.reverse()); // newest last
//       } catch (e) {
//         console.error("Live telemetry fetch error:", e);
//       }
//     };

//     fetchLiveData();
//     const intv = setInterval(fetchLiveData, 5000); // refresh every 3 sec
//     return () => clearInterval(intv);
//   }, [vin]);



  
//     // const [vin, setVin] = useState(initialVin || "");

//   // VIN list
//   useEffect(() => {
//     (async () => {
//       try {
//         const res = await fetch(`http://localhost/phpback/all_vinfetch.php`);
//         if (!res.ok) throw new Error(`HTTP ${res.status}`);
//         const json = await res.json();
//         if (Array.isArray(json) && json.length > 0) {
//           setVinList(json);
//           if (!initialVin) setVin(json[0]);
//         } else {
//           setVinList([]);
//           setVin("");
//         }
//       } catch (e) {
//         console.error("VIN list error", e);
//       }
//     })();
//   }, [initialVin]);

//   // Vehicle details by VIN
//   useEffect(() => {
//     if (!vin) {
//       setDetails(null);
//       return;
//     }
//     (async () => {
//       try {
//         setDetails(null);
//         const res = await fetch(
//           `http://localhost/phpback/fetch_allvinmodeldtat.php?vin=${encodeURIComponent(
//             vin
//           )}`
//         );
//         if (!res.ok) throw new Error(`HTTP ${res.status}`);
//         const json = await res.json();
//         setDetails(json?.error ? {} : json);
//       } catch (e) {
//         console.error("Vehicle details error", e);
//         setDetails({});
//       }
//     })();
//   }, [vin]);

//    const fetchLast200Data = async () => {
//     if (!vin) return;
//     try {
//       const res = await fetch(
//         `http://localhost/phpback/selcectvinlastdata.php?vin=${vin}`
//       );
//       if (!res.ok) throw new Error(`HTTP ${res.status}`);
//       const json = await res.json();
//       const arr = Array.isArray(json) ? json : json ? [json] : [];
//       setLiveData(arr.reverse()); // reverse so latest appears at the bottom/right
//     } catch (e) {
//       console.error("History error", e);
//     }
//   };

//   // ✅ run once when VIN changes
//   useEffect(() => {
//     if (!vin) return;
//     fetchLast200Data();
//   }, [vin]);

//   // Data fetching (realtime & historical)
//   const fetchRealtimeData = async () => {
//     if (!vin) return;
//     try {
//       const res = await fetch(`http://localhost/phpback/real_timedata1.php`);
//       if (!res.ok) throw new Error(`HTTP ${res.status}`);
//       const json = await res.json();
//       const arr = Array.isArray(json) ? json : json ? [json] : [];
//       setData(arr.reverse());
//     } catch (e) {
//       console.error("Realtime error", e);
//     }
//   };

//   const fetchHistoricalData = async () => {
//   if (!vin || !startDateTime || !endDateTime) {
//     alert("Please select VIN, start and end date.");
//     return;
//   }

//   try {
//     const res = await fetch(
//       `http://localhost/phpback/backtimedatfetch.php?vin=${vin}&start=${startDateTime}&end=${endDateTime}`
//     );
//     const json = await res.json();

//     if (json.length > 0) {
//       setHistoryData(json.reverse()); // use new state
//       setShowHistoryChart(true);
//     } else {
//       setShowHistoryChart(false);
//       alert("No data available in this range.");
//     }
//   } catch (err) {
//     console.error("Error loading history:", err);
//     alert("Failed to load data.");
//   }
// };


//   // Poll realtime every 5s
//   useEffect(() => {
//     if (!vin) return;
//     let intv;
//     if (mode === "realtime") {
//       fetchRealtimeData();
//       intv = setInterval(fetchRealtimeData, 5000);
//     }
//     return () => intv && clearInterval(intv);
//   }, [vin, mode]);

//   const latest = useMemo(() => (data?.length ? data[0] : {}), [data]);

//   // Tooltip for the main chart
//   const CustomTooltip = ({ active, payload }) => {
//     if (!(active && payload && payload.length)) return null;
//     const p = payload[0].payload || {};
//     return (
//       <div className="rounded-xl border border-cyan-400/20 bg-slate-900/90 px-3 py-2 text-xs text-white shadow-lg">
//         <div className="grid min-w-[280px] grid-cols-2 gap-x-6 gap-y-1">
//           <span className="text-white/60">Time</span>
//           <span>{p.time ? fmt.when(p.time) : "N/A"}</span>
//           <span className="text-white/60">Current (A)</span>
//           <span>{fmt.num(p.currentconsumption)}</span>
//           <span className="text-white/60">inAH</span>
//           <span>{fmt.num(p.inAH ?? p.inah)}</span>
//           <span className="text-white/60">inAH by Charger</span>
//           <span>{fmt.num(p.inAH_by_charger ?? p.inah_by_charger)}</span>
//           <span className="text-white/60">inAH by Regen</span>
//           <span>{fmt.num(p.inAH_by_regen ?? p.inah_by_regen)}</span>
//           <span className="text-white/60">outAH</span>
//           <span>{fmt.num(p.outAH ?? p.outah)}</span>
//         </div>
//       </div>
//     );
//   };

//   return (
//     <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#1B263B,_#0D1B2A_70%)] text-white">
//       {/* Header */}
//    <header className="sticky top-0 z-20 border-b border-white/10 bg-slate-900/60 backdrop-blur supports-[backdrop-filter]:bg-slate-900/40">
//   <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:py-4">
    
//     {/* 🔹 Left side with Logo + Title */}
//     <div className="flex items-center gap-3">
//       <img
//         src="https://image2url.com/images/1755511837883-d480dc7d-7419-4341-acc6-decf0d6810b5.png"   // <-- Replace with your logo URL or /public path
//         alt="Rivot Motors"
//         className="h-10"
//       />
//       <h1 className="text-white font-semibold tracking-wide sm:text-xl">
//         RIVOT MOTORS <span className="text-white">COMMAND CENTER</span>
//       </h1>
//     </div>
//   </div>
// </header>


//     <main className="mx-auto max-w-7xl px-4 py-6">
//   {/* ✅ One Big Card */}
// {/* 🔥 Big Card with Glow */}
// <div className="relative rounded-xl border border-cyan-400/30 bg-slate-900/80 p-6 
//      shadow-[0_0_25px_rgba(34,211,238,0.6)]">
//  <div className="absolute -inset-1 rounded-2xl bg-[radial-gradient(circle_at_top_left,#22d3ee55,transparent_70%),radial-gradient(circle_at_top_right,#22d3ee55,transparent_70%), radial-gradient(circle_at_bottom_left,#22d3ee55,transparent_70%), radial-gradient(circle_at_bottom_right,#22d3ee55,transparent_70%)] blur-2xl opacity-80 pointer-events-none"></div>
//   {/* Content wrapper stays above */}
//   <div className="relative z-10">
//     <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//       {/* Vehicle Card */}
// <Svg title="Vehicle" minH={200} glow={false}>
//       <SectionTitle left="Vehicle" />

//       {/* Search Box with Suggestions */}
//       <div className="relative w-full mb-3">
//         <input
//           type="text"
//           value={searchValue}
//           onChange={(e) => setSearchValue(e.target.value)}
//           placeholder="Search by VIN / Name / Phone"
//           className="w-full rounded-xl border border-white/10 bg-slate-900/60 px-3 py-2 text-sm outline-none hover:border-cyan-400/40 focus:border-cyan-400"
//         />

//         {showSuggestions && suggestions.length > 0 && (
//           <ul className="absolute z-10 mt-1 w-full rounded-lg bg-slate-800 border border-slate-600 max-h-60 overflow-y-auto shadow-lg">
//             {suggestions.map((s, i) => (
//               <li
//                 key={i}
//                 onClick={() => handleSelectVin(s.vinnumber)}
//                 className="px-3 py-2 cursor-pointer hover:bg-cyan-600 hover:text-white"
//               >
//                 <div className="font-medium">{s.vinnumber}</div>
//                 <div className="text-xs text-slate-400">
//                   {s.ownername} • {s.phonenumber}
//                 </div>
//               </li>
//             ))}
//           </ul>
//         )}
//       </div>

//       {/* VIN Dropdown (old one, optional) */}
//       <div className="mt-3 grid grid-cols-2 gap-2">
//         <StatChip
//           label="VIN"
//           value={(details?.vinnumber || details?.vinNumber || vin) || "N/A"}
//         />
//         <StatChip label="Model" value={details?.model || "N/A"} />
//         <StatChip
//           label="Owner"
//           value={details?.ownerName || details?.ownername || "N/A"}
//         />
//         <StatChip
//           label="Phone"
//           value={details?.phoneNumber || details?.phonenumber || "N/A"}
//         />
//         <StatChip
//           label="Scooter Power State"
//           value={latestGauges?.ev_power_state || "N/A"}
//         />
//         <StatChip label="Current Rider" value={latestGauges?.currentrider || "N/A"} />
//       </div>
//     </Svg>


//       {/* Component Data */}
//         <Svg title="Component Data" minH={CARD_MIN_H} glow={false}>
//         <SectionTitle left="Component Data" />
//         <div className="grid grid-cols-2 gap-3">
//           <StatChip label="Controller ID" value={details?.controlerid || "N/A"} />
//           <StatChip label="Motor ID" value={details?.motorid || "N/A"} />
//           <StatChip label="BMS ID" value={details?.bmsid || "N/A"} />
//           <StatChip label="Ride OS" value={details?.rideosversion || "N/A"} />
//           <StatChip label="Smart Key" value={details?.smartkeyid || "N/A"} />
//           <StatChip label="Charged ID" value={details?.chargingstate ?? details?.charged ?? "N/A"} />
//         </div>
//       </Svg>


//       {/* Vehicle Info (remaining data only) */}
//       <Svg title="Vehicle Info" minH="min-h-[160px]" glow={false}>
//         <SectionTitle left="Vehicle Info" />
//         <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
//           {[
//             { label: "Odo.", key: "odo", src: "allvin" },
//             { label: "Trip KM", key: "tripkm", src: "allvin" },
//             { label: "Handle Lock State", key: "handlelockstate", src: "allvin" },
//             { label: "Seat Lock State", key: "seatlockstate", src: "allvin" },
//             { label: "Charging State", key: "chargingstate", src: "allvin" },
//              { label: "Location", key: "lat_long" },
//           ].map((t) => {
//             const srcObj = t.src === "allvin" ? details : latest;
//             const raw = srcObj?.[t.key];
//             let val = raw === null || raw === undefined || raw === "" ? "N/A" : raw;
//             let color = "text-white";
//             let icon = "";

//             if (t.key === "handlelockstate") {
//               if (Number(raw) === 1) {
//                 val = "Handle Locked";
//                 color = "text-red-400";
//                 icon = "🔒";
//               } else if (Number(raw) === 0) {
//                 val = "Handle Unlocked";
//                 color = "text-green-400";
//                 icon = "🔓";
//               }
//             }

//             if (t.key === "seatlockstate") {
//               if (Number(raw) === 1) {
//                 val = "Seat Locked";
//                 color = "text-red-400";
//                 icon = "🔒";
//               } else if (Number(raw) === 0) {
//                 val = "Seat Unlocked";
//                 color = "text-green-400";
//                 icon = "✅";
//               }
//             }

//             if (t.key === "chargingstate") {
//               if (Number(raw) === 1) {
//                 val = "Charging";
//                 color = "text-blue-400 animate-pulse";
//                 icon = "⚡";
//               } else if (Number(raw) === 0) {
//                 val = "Not Charging";
//                 color = "text-gray-400";
//                 icon = "🔋";
//               }
//             }

//             return (
//               <div
//                 key={t.key}
//                 className="rounded-lg border border-white/10 bg-slate-800/70 p-3 shadow-sm flex flex-col items-center text-center"
//               >
//                 {/* Label */}
//                 <p className="text-[11px] uppercase tracking-wide text-white/60 mb-1">
//                   {t.label}
//                 </p>

//                 {/* Value + Icon */}
//                 <div className={`flex flex-col items-center text-xs font-semibold ${color}`}>
//                   {icon && <span className="text-base">{icon}</span>}
//                   <span className="truncate">{val}</span>
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       </Svg>
//     </div>
//     {/* Bottom Row inside same card */}
//     <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
//       {/* NTC Temperatures */}
//      <Svg title="NTC Temperatures" minH="min-h-[140px]">
//       <div className="p-3">
//         <p className="text-[11px] uppercase tracking-wide text-white/60">
//           NTC Temperatures
//         </p>

//         {(() => {
//           const raw = ntcData?.ntc ?? "";
//           const arr = raw.split(",").map((v) => Number(v.trim()));

//           if (arr.length < 8) {
//             return <p className="mt-2 text-base text-white">N/A</p>;
//           }

//           const main = arr.slice(0, 4);
//           const apu = arr.slice(-4);
//           const apuAbsent = apu.every((v) => v === -40);

//           return (
//             <div className="mt-2 text-base font-semibold text-white space-y-1">
//               <p>Main Battery NTCs: {main.join(", ")} °C</p>
//               {apuAbsent ? (
//                 <p className="text-red-400">APU Absent</p>
//               ) : (
//                 <p>APU NTCs: {apu.join(", ")} °C</p>
//               )}
//             </div>
//           );
//         })()}
//       </div>
//     </Svg>

//       {/* BMS MOS States */}
// <Svg title="BMS MOS States" minH="min-h-[160px]">
//   <div className="p-3 space-y-1">
//     <p className="text-[11px] uppercase tracking-wide text-white/60">
//       BMS MOS States
//     </p>

//     {(() => {
//       const flags = (details?.bmsmosstates ?? "")
//         .split(",")
//         .map((v) => parseInt(v.trim(), 10));

//       return (
//         <div className="mt-2 space-y-1 text-sm text-white">
//           <p>
//             Main Charging MOSFET:{" "}
//             <span className={flags[0] ? "text-emerald-400" : "text-red-400"}>
//               {flags[0] ? "ON" : "OFF"}
//             </span>
//           </p>
//           <p>
//             Main Discharging MOSFET:{" "}
//             <span className={flags[1] ? "text-emerald-400" : "text-red-400"}>
//               {flags[1] ? "ON" : "OFF"}
//             </span>
//           </p>
//           <p>
//             APU Charging:{" "}
//             <span className={flags[2] ? "text-emerald-400" : "text-red-400"}>
//               {flags[2] ? "ON" : "OFF"}
//             </span>
//           </p>
//           <p>
//             APU Discharging:{" "}
//             <span className={flags[3] ? "text-emerald-400" : "text-red-400"}>
//               {flags[3] ? "ON" : "OFF"}
//             </span>
//           </p>
//         </div>
//       );
//     })()}
//   </div>
// </Svg>
//     </div>
//   </div>
// </div>

// <div className="relative rounded-xl border border-cyan-400/30 bg-slate-900/80 p-6 
//      shadow-[0_0_25px_rgba(34,211,238,0.6)] mt-3">

//   {/* Glow overlay (only for the big card) */}
//  <div className="absolute -inset-1 rounded-2xl 
//                 bg-[radial-gradient(circle_at_top_left,#22d3ee55,transparent_70%), 
//                     radial-gradient(circle_at_top_right,#22d3ee55,transparent_70%), 
//                     radial-gradient(circle_at_bottom_left,#22d3ee55,transparent_70%), 
//                     radial-gradient(circle_at_bottom_right,#22d3ee55,transparent_70%)] 
//                 blur-2xl opacity-80 pointer-events-none"></div>

//   {/* Inner content (no glow on inner cards) */}
//   <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6">

//     {/* Battery Voltage */}
//     <div className={CARD_BASE_TRANSPARENT}>
//       <SectionTitle left="Battery Voltage" />
//       <div className="flex items-center justify-center">
//         <OnlyForSpeed
//           label="VOLTAGE"
//           value={latestGauges?.batvoltage || 0}
//           max={100}
//           unit="V"
//           width={240}
//         />
//       </div>
//     </div>

//     {/* APUSOC */}
//     <div className={CARD_BASE_TRANSPARENT}>
//       <SectionTitle left="APUSOC" />
//       <div className="flex items-center justify-center">
//         <OnlyForsoc
//           value={Number(latestGauges?.apusoc) || 0}
//           max={100}
//           unit="%"
//           width={240}
//         />
//       </div>
//     </div>

//     {/* SOC */}
//     <div className={CARD_BASE_TRANSPARENT}>
//       <SectionTitle left="SOC" />
//       <div className="flex items-center justify-center">
//         <SpeedGauge
//           value={Number(latestGauges?.soc) || 0}
//           max={100}
//           unit="%"
//           width={240}
//         />
//       </div>
//     </div>

//     {/* Speed */}
//     <div className={CARD_BASE_TRANSPARENT}>
//       <SectionTitle left="Speed" />
//       <div className="flex items-center justify-center">
//         <ThreeQuarterGauge
//           value={Number(latestGauges?.speed_kmph) || 0}
//           max={150}
//           unit="km/h"
//           width={240}
//         />
//       </div>
//     </div>

//     {/* Tire Pressure */}
//     <div className={CARD_BASE_FLAT}>
//       <SectionTitle left="Tire Pressure" />
//       <div className="flex items-center justify-center">
//         <ThreeQuarterGauge
//           value={Number(latestGauges?.tirepressure) || 0}
//           min={0}
//           max={100}
//           unit="psi"
//           width={220}
//         />
//       </div>
//     </div>


//       <div className="w-full flex justify-center">
//     <Svg className="w-[320px] rounded-xl p-3 shadow-lg border border-white/10">
//       <div className="mb-2 text-center">
//         <p className="text-xs uppercase tracking-wide text-white/70 font-semibold">
//           Temperatures
//         </p>
//       </div>
      
//       <div className="flex justify-between items-center gap-3 overflow-x-auto">
//         <ThermometerCard
//           label="Ctrl Mos"
//           value={Number(latestGauges?.controllermostemp) || 0}
//           min={0}
//           max={120}
//           gradient={["#32ed0dff", "#e71414ff"]}
//           height={160}   // ⬅️ smaller thermometer
//         />
//         <ThermometerCard
//           label="Motor"
//           value={Number(latestGauges?.motortemp) || 0}
//           min={0}
//           max={120}
//           gradient={["#32ed0dff", "#e71414ff"]}
//           height={160}
//         />
//         <ThermometerCard
//           label="BMS Mos"
//           value={Number(latestGauges?.bmsmostemp) || 0}
//           min={0}
//           max={120}
//           gradient={["#32ed0dff", "#e71414ff"]}
//           height={160}
//         />
//       </div>
      
//     </Svg>
//   </div>

//   </div>
// </div>

// {/* vehical live chart  */}

// <div className="col-span-1 relative">
//   {/* 🔥 Glow Layer */}
//   <div className="absolute -inset-1 rounded-2xl 
//                   bg-[radial-gradient(circle_at_center,#22d3ee55,transparent_70%)] 
//                   blur-2xl opacity-70 pointer-events-none"></div>
//       <Svg title="AH Live Telemetry" minH="min-h-[200px]" maxW="max-w-md" className='mb-3'>
//         <div className="h-[300px]">
//           <ResponsiveContainer width="100%" height="100%">
//             <LineChart data={livedata}>
//               {/* Grafana-like clean grid */}
//               <CartesianGrid
//                 strokeDasharray="2 4"
//                 stroke="#33415580"
//                 vertical={false}
//               />

//               {/* X Axis (time only HH:mm:ss) */}
//               <XAxis
//                 dataKey="time"
//                 tick={{ fill: "#9ca3af", fontSize: 10 }}
//                 tickFormatter={(t) => {
//                   const d = fmt.parseDate(t);
//                   return d
//                     ? d.toLocaleTimeString([], {
//                         hour: "2-digit",
//                         minute: "2-digit",
//                         second: "2-digit",
//                       })
//                     : "";
//                 }}
//               />

//               <YAxis tick={{ fill: "#9ca3af", fontSize: 10 }} width={40} />

//               {/* Tooltip */}
//               <Tooltip
//                 formatter={(val, name) => [`${Number(val).toFixed(2)}`, name]}
//                 contentStyle={{
//                   backgroundColor: "#0f172a",
//                   borderColor: "#1e293b",
//                   borderRadius: "0.5rem",
//                   color: "#fff",
//                   fontSize: "11px",
//                 }}
//               />

//               <Legend wrapperStyle={{ color: "#d1d5db", fontSize: 11 }} />

//               {/* Lines */}
//               <Line
//                 type="monotone"
//                 dataKey="inah"
//                 name="inAH"
//                 stroke="#22d3ee"
//                 strokeWidth={2}
//                 dot={false}
//               />
//               <Line
//                 type="monotone"
//                 dataKey="inah_by_charger"
//                 name="inAH by Charger"
//                 stroke="#22c55e"
//                 strokeWidth={1.8}
//                 strokeDasharray="5 3"
//                 dot={false}
//               />
//               <Line
//                 type="monotone"
//                 dataKey="inah_by_regen"
//                 name="inAH by Regen"
//                 stroke="#f97316"
//                 strokeWidth={1.8}
//                 strokeDasharray="4 2"
//                 dot={false}
//               />
//               <Line
//                 type="monotone"
//                 dataKey="outah"
//                 name="outAH"
//                 stroke="#ef4444"
//                 strokeWidth={2}
//                 dot={false}
//               />
//             </LineChart>
//           </ResponsiveContainer>
//         </div>
//       </Svg>
//     </div>

// <div>  
// <Svg title="Want to see History?">
//   <h2 className="text-base font-semibold tracking-wide text-white mb-2">
//     Enter Date & Time Range for VIN: <span className="text-cyan-300">{vin}</span>
//   </h2>

//   {/* Inputs */}
//   <div className="flex flex-col gap-2 md:flex-row">
//     <input
//       type="datetime-local"
//       value={startDateTime}
//       onChange={(e) => setStartDateTime(e.target.value)}
//       className="w-full rounded-xl border border-white/10 bg-slate-900/60 px-3 py-2 text-sm outline-none hover:border-cyan-400/40 focus:border-cyan-400"
//     />
//     <input
//       type="datetime-local"
//       value={endDateTime}
//       onChange={(e) => setEndDateTime(e.target.value)}
//       className="w-full rounded-xl border border-white/10 bg-slate-900/60 px-3 py-2 text-sm outline-none hover:border-cyan-400/40 focus:border-cyan-400"
//     />
//   </div>

//   <div className="mt-3 flex gap-2">
//     <button
//       onClick={fetchHistoricalData}
//       className="rounded-xl border border-cyan-400/30 bg-cyan-500/10 px-4 py-2 text-sm text-cyan-300 hover:bg-cyan-500/20"
//     >
//       Load History
//     </button>
//   </div>
// </Svg>

// {/* 🟢 Chart appears only if data is present */}
// {showHistoryChart && (
//   <Svg
//     title={`Historical Telemetry (${new Date(startDateTime).toLocaleString()} → ${new Date(endDateTime).toLocaleString()})`}
//     minH="min-h-[420px]"
//     maxW="max-w-6xl"
//   >
//     <ResponsiveContainer width="100%" height={360}>
//       <LineChart data={historyData}>
//         <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
//         <XAxis
//           dataKey="time"
//           tick={{ fill: "#d1d5db", fontSize: 12 }}
//           tickFormatter={(t) => {
//             const d = fmt.parseDate(t);
//             return d ? d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }) : "";
//           }}
//         />
//         <YAxis tick={{ fill: "#d1d5db" }} />
//         <Tooltip
//           formatter={(val) => Number(val).toFixed(3)}
//           contentStyle={{
//             backgroundColor: "#1e293b",
//             borderColor: "#334155",
//             color: "#fff",
//             borderRadius: "0.5rem",
//             fontSize: "12px",
//           }}
//         />
//         <Legend wrapperStyle={{ color: "#e5e7eb", fontSize: 12 }} />

//         {/* ✅ Smooth stylish lines */}
//         <Line type="monotone" dataKey="currentconsumption" name="Current (A)" stroke="#f59e0b" strokeWidth={2} dot />
//         <Line type="monotone" dataKey="inah" name="inAH" stroke="#e612b4" strokeWidth={2} dot={false} />
//         <Line type="monotone" dataKey="inah_by_charger" name="inAH by Charger" stroke="#22c55e" strokeWidth={2} dot={false} />
//         <Line type="monotone" dataKey="inah_by_regen" name="inAH by Regen" stroke="#f12613" strokeWidth={2} dot={false} />
//         <Line type="monotone" dataKey="outah" name="outAH" stroke="#0927d2" strokeWidth={2} dot={false} />
//       </LineChart>
//     </ResponsiveContainer>
//   </Svg>
// )}
// </div>     
//       </main>
//       <footer className="mx-auto max-w-7xl px-4 py-6 text-center text-xs text-white/50">
//         VIN: {(latest?.vinnumber || latest?.vinNumber || vin) || "N/A"} •{" "}
//         {mode === "realtime" ? "Live" : "History"}
//       </footer>
//     </div>
//   );
// }