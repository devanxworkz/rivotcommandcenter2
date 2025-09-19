        import React, { useEffect, useMemo, useState,useRef,inputRef } from "react";
        import { Calendar } from "lucide-react";
        import { CreditCard, User, Phone } from "lucide-react";
        import { Search } from "lucide-react"; 
          import { Zap, Power, BatteryCharging, Battery,MapPin } from "lucide-react";
          import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
          import Chart from "react-apexcharts";
          import { useNavigate } from "react-router-dom";
          import { Textfit } from "react-textfit";

          import { Home, BarChart2, Table, Menu, Bike, Car, X} from "lucide-react"; 

          import L from "leaflet";


        import {
          ResponsiveContainer,
          CartesianGrid,
          XAxis,
          YAxis,
          Tooltip,
          Legend,
          LineChart,
          Line,
          ReferenceLine,
        } from "recharts";
        // keep your existing gauges

        import SpeedGauge from "../SpeedGauge";
        import OnlyForSpeed from "../OnlyForSpeed";
        import ThreeQuarterGauge from "../ThreeQuarterGauge";
        import OnlyForsoc from '../OnlyForsoc'
        import "./index.css"
        import ThermometerCard from '../ThermometerCard'
        import CustomAlert  from "../CustomAlert";
        import Sidebar from "../Sidebar";
        import StatsRow from "../StatsRow";


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
  <div className="mb-4 flex items-center justify-between border-b border-white/10 pb-2">
    <h3 className="text-sm sm:text-base font-semibold text-White">
      {left}
    </h3>
    {right}
  </div>
);


const StatChip = ({ label, value }) => (
  <div className="rounded-lg bg-white/5 backdrop-blur-md p-3">
    <p className="text-xs text-gray-300">{label}</p>
    <p className="text-xs sm:text-base font-semibold text-white">
      {value}
    </p>
  </div>
);

const StatCard = ({ label, value, icon: Icon, valueClassName }) => {
  return (
    <div className="flex flex-col justify-between 
                    bg-neutral-950 text-white rounded-2xl p-6 
                    border border-white/10 shadow-lg 
                    hover:shadow-[0_0_20px_rgba(255,140,66,0.3)] 
                    hover:border-orange-500 transition-all duration-300 mb-4">
      
      {/* Label */}
      {label && (
        <span className="text-[12px] text-gray-400 mb-1 tracking-wider">
          {label}
        </span>
      )}
      
      {/* Value + Icon */}
      <div className="flex items-start gap-2 text-sm font-semibold">
        {Icon && (
          <Icon className="w-7 h-7 rounded-xl bg-gradient-to-br 
                           from-orange-600/30 to-orange-400/20 
                           border border-orange-500/20 
                           shadow-[0_0_15px_rgba(255,140,66,0.4)] 
                           text-orange-400 flex-shrink-0" />
        )}
        <span
          className={`block ${valueClassName || "truncate w-full"}`}
          title={typeof value === "string" ? value : undefined}
        >
          {value}
        </span>
      </div>
    </div>
  );
};








// function StatCard({ label, value, icon: Icon, trend }) {
//   return (
//     <div
//       className="p-6 rounded-2xl shadow-lg 
//                  bg-neutral-950 border border-white/10 
//                  flex items-center justify-between mb-4 
//                  transition-colors duration-300 hover:border-orange-500"
//     >
//       {/* Left Side */}
//       <div>
//         <p className="text-sm text-gray-400">{label}</p>
//         <h2 className="text-lg font-bold text-white">{value}</h2>
//         {trend && (
//           <p
//             className={`text-xs mt-1 ${
//               trend.startsWith("-") ? "text-red-400" : "text-green-400"
//             }`}
//           >
//             {trend}
//           </p>
//         )}
//       </div>
//       {/* Icon */}
//       <div className="w-12 h-12 flex items-center justify-center 
//                       rounded-xl bg-gradient-to-br from-orange-600/30 to-orange-400/20 
//                       border border-orange-500/20 shadow-[0_0_15px_rgba(255,140,66,0.4)]">
//         <Icon className="text-orange-400 w-6 h-6" />
//       </div>
//     </div>
//   );
// }


async function getReadableLocation(lat_long) {
  if (!lat_long) return "N/A";

  let lat, lng;

  // If already object
  if (typeof lat_long === "object") {
    if (Array.isArray(lat_long)) {
      [lat, lng] = lat_long;
    } else {
      lat = lat_long.lat ?? lat_long.latitude;
      lng = lat_long.lng ?? lat_long.lon ?? lat_long.longitude;
    }
  }

  // If string like "15.88, 74.66"
  if (typeof lat_long === "string" && lat_long.includes(",")) {
    [lat, lng] = lat_long.split(",").map((n) => parseFloat(n.trim()));
  }

  lat = parseFloat(lat);
  lng = parseFloat(lng);

  if (isNaN(lat) || isNaN(lng)) return "N/A";

  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
    );
    const data = await res.json();
    return data.display_name || `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
  } catch {
    return `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
  }
}


const CARD_BASE_TRANSPARENTs =
  "rounded-2xl border-2 border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.08),#0A0A23)] p-4 transition-colors duration-300 hover:border-[#3B82F6]";

const CARD_BASE_TRANSPARENT =
  "rounded-2xl border-2 border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.08),#0A0A23)] p-4 transition-colors duration-300 hover:border-[#3B82F6]";

const CARD_BASE = 
  "rounded-2xl border border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.12),#0A0A23)] p-4 transition-colors duration-300 hover:border-[#3B82F6]";

const CARD_BASE_GLOW  =
  "rounded-2xl border border-[#3B82F6]/40 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.18),#0A0A23)] p-4 shadow-[0_0_18px_rgba(59,130,246,0.35)] hover:border-[#3B82F6] hover:shadow-[0_0_28px_rgba(59,130,246,0.65)] transition-colors duration-300";

const CARD_BASE_FLAT =
  "rounded-2xl border border-white/20 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.06),#0A0A23)] p-4 transition-colors duration-300 hover:border-[#3B82F6]";

const CARD_MIN_H = "min-h-[220px]"; // same height across the grid

const CARD_CLICK_OVERLAY =
  "absolute inset-0 rounded-2xl cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#3B82F6]";

        // Wrap any content so the WHOLE card opens a modal when clicked
        function Svg({ title, children, minH = CARD_MIN_H, maxW = "max-w-5xl", glow = false }) {
          const [open, setOpen] = useState(false);
          return (
            <>
              <div
                className={`relative ${glow ? CARD_BASE_GLOW : CARD_BASE_FLAT} ${minH} 
                            transition-colors duration-300 hover:border-[#FF9913]`}
              >
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

        export default function RealTimeChart({ vin: initialVin }) {
          const [vin, setVin] = useState(initialVin || "");
          const [vinList, setVinList] = useState([]);
          const [data, setData] = useState([]);
          const [mode, setMode] = useState("realtime");
          const [details, setDetails] = useState([]);
          const [showInAHChart, setShowInAHChart] = useState(false);
          const [latestGauges, setLatestGauges] = useState(null);
          const [livedata, setLiveData] = useState([]); // ✅ start as empty array
        const [historyData, setHistoryData] = useState([]);
        const [showHistoryChart, setShowHistoryChart] = useState(false);
        const [ntcData, setNtcData] = useState(null);
          const [searchValue, setSearchValue] = useState("");
          const [suggestions, setSuggestions] = useState([]);
          const [showSuggestions, setShowSuggestions] = useState(false);
          const [highlightIndex, setHighlightIndex] = useState(-1);
          const [isSelecting, setIsSelecting] = useState(false);
          const [loading, setLoading] = useState(false);
        const [selectedVin, setSelectedVin] = useState(null);
        const [showMetrics1, setShowMetrics1] = useState(false);
        const [isSelected, setIsSelected] = useState(false); // ✅ new flag
        const [startDateTime, setStartDateTime] = useState(getCurrentDateTimeLocal(new Date(Date.now() - 24 * 60 * 60 * 1000)));
        const [endDateTime, setEndDateTime] = useState(getCurrentDateTimeLocal(new Date()));
        const [alertMessage, setAlertMessage] = useState("");
        const [userChanged, setUserChanged] = useState(false);
        const [locationName, setLocationName] = useState("Loading...");
    const [autoMode, setAutoMode] = useState(true); // ✅ controls auto-update
  const intervalRef = useRef(null);
   const [isOpen, setIsOpen] = useState(true);
  const toggleSidebar = () => setIsOpen(!isOpen);
  const [isScrolled, setIsScrolled] = useState(false);
    const inputRef = useRef(null);    
      const [locationMap, setLocationMap] = React.useState({});
  const [sidebarOpen, setSidebarOpen] = useState(false); // mobile drawer
    const [tick, setTick] = React.useState(0);
    

    
    useEffect(() => {
      const interval = setInterval(() => {
        setTick((prev) => prev + 1); // 🔄 refresh every second
      }, 1000);
      return () => clearInterval(interval);
    }, []);

const [activePage, setActivePage] = React.useState("home"); 

  const [isCollapsed, setIsCollapsed] = React.useState(false);


  // Example in your component
const mainRef = useRef(null);

useEffect(() => {
  const mainEl = mainRef.current;
  if (!mainEl) return;

  const handleScroll = () => {
    setIsScrolled(mainEl.scrollTop > 10); // ✅ now checks main scroll
  };

  mainEl.addEventListener("scroll", handleScroll);
  return () => mainEl.removeEventListener("scroll", handleScroll);
}, []);



const [apiUrl, setApiUrl] = useState("");





  // ✅ Always show raw coords first
 

  // ✅ Debounce reverse lookup (avoid spamming API)
 // 👈 wait 1.5s before calling API







useEffect(() => {
  const handleScroll = () => setIsScrolled(window.scrollY > 20);
  window.addEventListener("scroll", handleScroll);
  return () => window.removeEventListener("scroll", handleScroll);
}, []);



const [coords, setCoords] = useState({ lat: null, lng: null });

          // Extract raw lat,long      
      // Grab raw string directly from source
      const rawLatLong = latestGauges?.lat_long || details?.lat_long || "";
      
      useEffect(() => {
        if (!rawLatLong) return;
      
        const [lat, lng] = rawLatLong.split(",").map((n) => parseFloat(n.trim()));
      
        if (isNaN(lat) || isNaN(lng)) {
          console.error("Invalid lat/lng:", rawLatLong);
          setLocationName("Invalid location");
          return;
        }
      
        fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`)
          .then((res) => res.json())
          .then((data) => {
            setLocationName(data.display_name || `${lat}, ${lng}`);
          })
          .catch(() => {
            setLocationName(`${lat}, ${lng}`);
          });
      }, [rawLatLong, latestGauges?.lat_long, details?.lat_long]); // 👈 track changes
        // Graph States
        const [livedatafor, setLivedatafor] = useState([]);
        const [metricsSelected, setMetricsSelected] = useState(["currentPositive","currentNegative","speed_kmph"]);
        const [metricsSelected1, setMetricsSelected1] = useState(["currentPositive","currentNegative","speed_kmph"]);
        const [showMetrics, setShowMetrics] = useState(false); // mobile dropdown toggle

      const metricOptions = [
            { key: "currentPositive", label: "Current generation (A)", color: "#13ff23" },
            { key: "currentNegative", label: "Current consumption (A)", color: "#ff0000" },
            { key: "speed_kmph", label: "Speed (km/h)", color: "#0ea5e9" },            // Bright blue
          { key: "motortemp", label: "Motor temp (°C)", color: "#facc15" },          // Bright yellow
          { key: "controllermostemp", label: "Controller temp (°C)", color: "#fc6d07ff" },
          {key : "soc", label:"Soc (%)" , color:"#ffff"}, 
          {key : "inah", label:"Inah (Ah)" , color:"#f48cc7ff"},  
          {key : "outah", label:"Outah (Ah)" , color:"#e0f892ff"},  // Orange
          {key : "batvoltage", label:"Battery voltage (%)" , color:"#FFF293"},   // Orange
          // {key : "lat_long", label:"location" , color:"#93dad1ff"},   // Orange
          { key: "ntc1", label: "Positive terminal temp(°C)", color: "#8b5cf6" },                         // Violet
          { key: "ntc2", label: "Cell no 20 temp (°C)", color: "#bf06d4ff" },                         // Cyan
          { key: "ntc3", label: "Cell no 50 temp (°C)", color: "#120befff" },                         // Pinkish red
          { key: "ntc4", label: "Negative terminal temp(°C)", color: "#10b981" },
          
          // {key : "tripkm", label:"Tripkm (km/h)" , color:"#0000"},  
                           // Light yellow
        ];

 const metricOptions1 = [
          { key: "currentPositive", label: "Current generation (A)", color: "#13ff23" },
          { key: "currentNegative", label: "Current consumption (A)", color: "#ff0000" },
          { key: "speed_kmph", label: "Speed (km/h)", color: "#0ea5e9" },            // Bright blue
          { key: "motortemp", label: "Motor temp (°C)", color: "#facc15" },          // Bright yellow
          { key: "controllermostemp", label: "Controller temp (°C)", color: "#fc6d07ff" },
          {key : "soc", label:"Soc (%)" , color:"#ffff"},  
          {key : "inah", label:"Inah (Ah)" , color:"#f48cc7ff"},  
          {key : "outah", label:"Outah (Ah)" , color:"#e0f892ff"},  // Orange
          {key : "batvoltage", label:"Battery voltage (%)" , color:"#FFF293"},  
          // {key : "lat_long", label:"location" , color:"#93dad1ff"},   // Orange
          { key: "ntc1", label: "Positive terminal temp(°C)", color: "#8b5cf6" },                         // Violet
          { key: "ntc2", label: "Cell no 20 temp (°C)", color: "#bf06d4ff" },                         // Cyan
          { key: "ntc3", label: "Cell no 50 temp (°C)", color: "#120befff" },                         // Pinkish red
          { key: "ntc4", label: "Negative terminal temp(°C)", color: "#10b981" }, 
            // {key : "tripkm", label:"Tripkm (km/h)" , color:"#0000"},  
                          // Light yellow
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
            // console.log("API response:", json);

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
      inah: item.inah,
      outah: item.outah,
      // lat_long: item.lat_long,

      
      ntc1: item.ntc?.[0] ?? null,
      ntc2: item.ntc?.[1] ?? null,
      ntc3: item.ntc?.[2] ?? null,
      ntc4: item.ntc?.[3] ?? null,
      ntc5: item.ntc?.[4] ?? null,
      ntc6: item.ntc?.[5] ?? null,
      ntc7: item.ntc?.[6] ?? null,
      ntc8: item.ntc?.[7] ?? null,
      tripkm: item.tripkm
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
    inah: item.inah,
    outah: item.outah,
    // lat_long: item.lat_long,

    ntc1: ntc[0] ?? null,
    ntc2: ntc[1] ?? null,
    ntc3: ntc[2] ?? null,
    ntc4: ntc[3] ?? null,
    ntc5: ntc[4] ?? null,
    ntc6: ntc[5] ?? null,
    ntc7: ntc[6] ?? null,
    ntc8: ntc[7] ?? null,
    tripkm: item.tripkm
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
            if (isSelected) return; // don’t refetch once a VIN is chosen

            if (searchValue.trim().length < 2) {
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
          }, [searchValue, isSelected]);

          // ✅ Central function to finalize selection + fetch
          const handleSelect = (vinNumber) => {
            setSearchValue(vinNumber);
            setVin(vinNumber); // 🚀 actual fetch triggered
            setIsSelected(true);
            setSuggestions([]);
            setShowSuggestions(false);
            setHighlightIndex(-1);
          };



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
          const id = setInterval(() => fetchLatestByVin(vin), 1000);

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

          // // Date and time 
        function getCurrentDateTimeLocal(date) {
          const offset = date.getTimezoneOffset(); 
          const local = new Date(date.getTime() - offset * 60000);
          return local.toISOString().slice(0, 16);
        }

          // Vehicle details by VIN
        useEffect(() => {
          const trimmedVin = vin?.trim();
          if (!trimmedVin) {
            setDetails(null);
            return;
          }
        
          let intervalId;
        
          const fetchDetails = async () => {
            try {
              const res = await fetch(
                `https://ble.nerdherdlab.com/fetch_allvinmodeldtat.php?vin=${encodeURIComponent(trimmedVin)}`
              );
              if (!res.ok) throw new Error(`HTTP ${res.status}`);
              const json = await res.json();
              setDetails(json?.data || {});
            } catch (e) {
              console.error("Vehicle details error", e);
            }
          };
        
          // 🔹 fetch immediately
          fetchDetails();
        
          // 🔹 then poll every 5s (or 1s if you need super live updates)
          intervalId = setInterval(fetchDetails, 5000);
        
          // cleanup
          return () => clearInterval(intervalId);
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
           useEffect(() => {
            if (!vin) return;
            let intv;
            if (mode === "realtime") {
              fetchRealtimeData();
              intv = setInterval(fetchRealtimeData, 2000);
            }
            return () => intv && clearInterval(intv);
          }, [vin, mode]);


// ✅ Get local datetime in input-compatible format
  function getCurrentDateTimeLocal(date) {
    const offset = date.getTimezoneOffset();
    const local = new Date(date.getTime() - offset * 60000);
    return local.toISOString().slice(0, 16);
  }

// ✅ Convert to UTC string for API
  const toUTC = (date) => {
    const d = new Date(date);
    return new Date(d.getTime() - d.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 19)
      .replace("T", " ");
  };
// ✅ Handlers (manual selection disables auto mode)
 const handleStartChange = (val) => {
    setStartDateTime(val);
    setAutoMode(false); // stop auto
  };
  const handleEndChange = (val) => {
    setEndDateTime(val);
    setAutoMode(false); // stop auto
  };

  const resetToAuto = () => {
    setAutoMode(true);
    setStartDateTime(getCurrentDateTimeLocal(new Date(Date.now() - 24 * 60 * 60 * 1000)));
    setEndDateTime(getCurrentDateTimeLocal(new Date()));
  };

// ✅ Auto-refresh effect (runs only when autoMode = true)
  useEffect(() => {
    if (!autoMode) return;

    const updateRange = () => {
      setStartDateTime(getCurrentDateTimeLocal(new Date(Date.now() - 24 * 60 * 60 * 1000)));
      setEndDateTime(getCurrentDateTimeLocal(new Date()));
    };

    updateRange(); // first run
    const timer = setInterval(updateRange, 60000);

    return () => clearInterval(timer);
  }, [autoMode]);

// ✅ Fetch data
 const fetchHistoricalData = async () => {
    if (!vin || !startDateTime || !endDateTime) {
      setAlertMessage("Please select VIN Number.");
      return;
    }

    setLoading(true);
    setShowHistoryChart(false);

    try {
      const url = `https://ble.nerdherdlab.com/backtimedatfetch.php?vin=${encodeURIComponent(
        vin
      )}&start=${encodeURIComponent(toUTC(startDateTime))}&end=${encodeURIComponent(
        toUTC(endDateTime)
      )}`;

      console.log("Fetching:", url);
      const res = await fetch(url);
      const text = await res.text();
      const json = JSON.parse(text);
      const data = json.data || json;

      if (Array.isArray(data) && data.length > 0) {
        setHistoryData(data.reverse());
        setShowHistoryChart(true);
      } else {
        setHistoryData([]);
        setShowHistoryChart(false);
        setAlertMessage("No data available in this range.");
      }
    } catch (err) {
      console.error("Error loading history:", err);
      setAlertMessage("Failed to load data.");
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
      processedData.forEach((row) => {
        if (row.lat_long && !locationMap[row.lat_long]) {
          getReadableLocation(row.lat_long).then((name) => {
            setLocationMap((prev) => ({ ...prev, [row.lat_long]: name }));
          });
        }
      });
    }, [processedData]);



   const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    navigate("/");
  };


       const latest = useMemo(() => (data?.length ? data[0] : {}), [data]);


          
    return (
<div class="min-h-screen bg-black text-white">
<div>
<header
  className={`fixed top-2 z-30 p-3 ml-2 
          bg-[#0d0d0d]/60 backdrop-blur transition-all duration-500 
          ${
            isScrolled
              ? "h-20 rounded-2xl border border-white/70 shadow-[0_0_18px_rgba(255,255,255,0.7)]"
              : "h-20 border-b border-white/10 rounded-none shadow-none"
          }
          ${
            isCollapsed
              ? "left-20 w-[calc(100%-5rem-1rem)] hidden sm:block"
              : "left-56 w-[calc(100%-14rem-1rem)] hidden sm:block"
          } 
          sm:flex items-center`}
>
  <div className="flex h-full w-full items-center justify-between px-6">
    {/* 🔹 Left side with Logo + Title */}
    <div className="flex items-center gap-3">
      <img
        src="https://image2url.com/images/1755511837883-d480dc7d-7419-4341-acc6-decf0d6810b5.png"
        alt="Rivot Motors"
        className="h-10"
      />
      <h1 className="text-white font-Blank tracking-wide sm:text-xl">
        RIVOT MOTORS <span className="text-white">COMMAND CENTER</span>
      </h1>
    </div>

    {/* 🔹 Right side with Search + Buttons */}
    <div className="relative w-full max-w-sm">
      <div className="flex items-center gap-2">
        {/* Input Wrapper */}
        <div className="relative flex-1">
          {/* 🔍 Icon */}
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />

          <input
    ref={inputRef}
    type="text"
    value={searchValue}
    onChange={(e) => {
      setSearchValue(e.target.value);
      setIsSelected(false);
    }}
      onKeyDown={(e) => {
        if (!showSuggestions || suggestions.length === 0) {
          if (e.key === "Enter" && searchValue.trim() !== "") {
            e.preventDefault();
            handleSelect(searchValue);
          }
          return;
        }
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
            handleSelect(suggestions[highlightIndex].vinnumber);
          } else {
            handleSelect(searchValue);
          }
        } else if (e.key === "Escape") {
          setShowSuggestions(false);
          setHighlightIndex(-1);
        }
      }}
           placeholder="Search by VIN / Name / Phone"
      className="w-full rounded-lg border border-white/10 bg-[#0d0d0d] pl-8 pr-16 py-2.5 text-sm outline-none
        transition-colors duration-300 
        hover:border-[#FF9913] focus:border-[#FF9913]"
    />

{searchValue && (
  <button
    type="button"
    onMouseDown={(e) => e.preventDefault()} // Prevent input blur
    onClick={() => {
      setSearchValue("");
      setIsSelected(false);
      setHighlightIndex(-1);
      setShowSuggestions(false);

      // ✅ Ensure cursor stays in input reliably
      // Using requestAnimationFrame + focus
      requestAnimationFrame(() => {
        inputRef.current?.focus();
      });
    }}
    className="absolute right-10 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#FF9913] transition"
  >
    ✕
  </button>
)}
        </div>

        {/* Go Button */}
        <button
          onClick={() => {
            if (searchValue.trim() !== "") {
              handleSelect(searchValue);
            }
          }}
          className="px-4 py-2 rounded-xl 
                     bg-[#F57A0D] text-black font-medium text-sm
                     hover:bg-[#FF9913] 
                     transition-all duration-300 shadow-md"
        >
          Go
        </button>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="px-4 py-2 rounded-xl 
                     bg-[#F57A0D] text-black font-medium text-sm
                     hover:bg-[#FF9913] 
                     transition-all duration-300 shadow-md"
        >
          Logout
        </button>
      </div>

      {/* Suggestions Dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <ul className="absolute left-0 top-full mt-1 w-full rounded-lg bg-[#0d0d0d] border border-slate-600 max-h-60 overflow-y-auto shadow-lg z-20">
          {suggestions.map((s, i) => (
            <li
              key={i}
              onClick={() => handleSelect(s.vinnumber)}
              className={`px-3 py-2 cursor-pointer ${
                i === highlightIndex
                  ? "bg-[#FF9913]/50 text-white"
                  : "hover:bg-[#FF9913]/30 hover:text-white"
              }`}
            >
              <div className="font-Kanit text-white">{s.vinnumber}</div>
              <div className="text-xs text-slate-400">
                {s.ownername} • {s.phonenumber}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  </div>
</header>


{/* 📌 Phone Header */}
<header
  className={`sm:hidden  fixed top-2 left-2 right-2 z-40 flex items-center justify-between gap-3 
  bg-[#0d0d0d]/70 backdrop-blur-lg px-3 h-16
  transition-all duration-500 
  ${
    isScrolled
      ? "rounded-2xl border border-white/70 shadow-[0_0_18px_rgba(255,255,255,0.7)]"
      : "border-b border-white/10 rounded-none shadow-none"
  }
`}
>
  {/* Left: Menu */}
  <button onClick={() => setSidebarOpen(true)} className="flex-shrink-0">
    <Menu className="w-6 h-6 text-white" />
  </button>

  {/* Center: Logo */}
  <img
    src="https://image2url.com/images/1755511837883-d480dc7d-7419-4341-acc6-decf0d6810b5.png"
    alt="Rivot Motors"
    className="h-8 flex-shrink-0"
  />

  {/* Right: Search box */}
<div className="flex items-center gap-2 justify-end w-auto relative">
  {/* Search box wrapper */}
  <div className="relative w-[180px]">
    <Search className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />

  <input
    ref={inputRef}
    type="text"
    value={searchValue}
    onChange={(e) => {
      setSearchValue(e.target.value);
      setIsSelected(false);
    }}
      onKeyDown={(e) => {
        if (!showSuggestions || suggestions.length === 0) {
          if (e.key === "Enter" && searchValue.trim() !== "") {
            e.preventDefault();
            handleSelect(searchValue);
          }
          return;
        }
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
            handleSelect(suggestions[highlightIndex].vinnumber);
          } else {
            handleSelect(searchValue);
          }
        } else if (e.key === "Escape") {
          setShowSuggestions(false);
          setHighlightIndex(-1);
        }
      }}
      placeholder="Search by VIN / Name / Phone"
      className="w-full rounded-lg border border-white/10 bg-[#0d0d0d] pl-8 pr-16 py-2.5 text-xs outline-none
        transition-colors duration-300 
        hover:border-[#FF9913] focus:border-[#FF9913]"
    />

    {/* ❌ Clear */}
     {searchValue && (
      <button
        type="button"
        onClick={() => {
          setSearchValue("");
          setIsSelected(false);
          setHighlightIndex(-1);
          setShowSuggestions(false);
          if (inputRef.current) inputRef.current.focus();
        }}
        className="absolute right-10 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#FF9913] transition"
      >
        ✕
      </button>
    )}

    {/* Go Button */}
    <button
      onClick={() => {
        if (searchValue.trim() !== "") handleSelect(searchValue);
      }}
      className="absolute right-1 top-1/2 -translate-y-1/2 px-2 py-1.5 rounded-md bg-[#F57A0D] text-black text-xs font-medium hover:bg-[#FF9913] transition-all duration-300"
    >
      Go
    </button>

    {/* Suggestions dropdown */}
    {showSuggestions && suggestions.length > 0 && (
      <ul className="absolute top-full left-0 mt-1 w-full rounded-lg bg-[#0d0d0d] border border-slate-600 max-h-44 overflow-y-auto shadow-lg z-50 text-xs">
        {suggestions.map((s, i) => (
          <li
            key={i}
            onClick={() => handleSelect(s.vinnumber)}
            className={`px-2 py-1 cursor-pointer ${
              i === highlightIndex
                ? "bg-[#FF9913]/50 text-white"
                : "hover:bg-[#FF9913]/30 hover:text-white"
            }`}
          >
            <div className="font-Kanit text-white text-sm">{s.vinnumber}</div>
            <div className="text-[10px] text-slate-400">
              {s.ownername} • {s.phonenumber}
            </div>
          </li>
        ))}
      </ul>
    )}
  </div>

  {/* Exit button */}
  <button
    onClick={handleLogout}
    className="p-2 rounded-lg bg-[#F57A0D] hover:bg-[#FF9913] transition-all duration-300 shadow"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-5 h-5 text-black"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1m0-10V5m-4 1H7a2 2 0 00-2 2v10a2 2 0 002 2h2"
      />
    </svg>
  </button>
</div>

  {/* Exit button */}

</header>










<div className="min-h-screen bg-black text-white  ml-0">
  {/* Sidebar */}
     <div
        className={`${
          isCollapsed ? "w-20" : "w-56"
        } hidden sm:flex fixed top-0 left-0 h-screen
        bg-[#0d0d0d] text-white p-4 flex-col 
        transition-all duration-300 z-20`}
      >
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="mb-6 flex items-center justify-center w-full py-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition"
        >
          <Menu size={20} />
        </button>
        <ul className="space-y-3 flex-1">
          <li>
            <button
              onClick={() => setActivePage("home")}
              className={`flex items-center gap-3 w-full px-3 py-2 rounded-lg transition ${
                activePage === "home"
                  ? "bg-[#FF9913] text-black font-semibold"
                  : "hover:bg-gray-800"
              }`}
            >
              <Home size={20} /> {!isCollapsed && "Dashboard"}
            </button>
          </li>
          <li>
            <button
              onClick={() => setActivePage("graph")}
              className={`flex items-center gap-3 w-full px-3 py-2 rounded-lg transition ${
                activePage === "graph"
                  ? "bg-[#FF9913] text-black font-semibold"
                  : "hover:bg-gray-800"
              }`}
            >
              <BarChart2 size={20} /> {!isCollapsed && "Graph"}
            </button>
          </li>
          <li>
            <button
              onClick={() => setActivePage("table")}
              className={`flex items-center gap-3 w-full px-3 py-2 rounded-lg transition ${
                activePage === "table"
                  ? "bg-[#FF9913] text-black font-semibold"
                  : "hover:bg-gray-800"
              }`}
            >
              <Table size={20} /> {!isCollapsed && "Table"}
            </button>
          </li>
        </ul>
      </div>

      {/* MOBILE SIDEBAR */}
   <div>
  {/* Overlay */}
  {sidebarOpen && (
    <div
      className="fixed inset-0 bg-black/60 z-40 transition-opacity duration-300"
      onClick={() => setSidebarOpen(false)}
    />
  )}

  {/* Drawer */}
  <div
    className={`fixed top-0 left-0 w-64 h-full bg-[#0d0d0d] p-4 z-50 shadow-lg 
      transform transition-transform duration-500 ease-in-out
      ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
  >
    <button
      onClick={() => setSidebarOpen(false)}
      className="mb-6 flex items-center justify-end w-full py-2 text-gray-400 hover:text-white"
    >
      <X size={24} />
    </button>

    <ul className="space-y-3">
      <li>
        <button
          onClick={() => setActivePage("home")}
          className={`flex items-center gap-3 w-full px-3 py-2 rounded-lg transition ${
            activePage === "home"
              ? "bg-[#FF9913] text-black font-semibold"
              : "hover:bg-gray-800"
          }`}
        >
          <Home size={20} /> Dashboard
        </button>
      </li>
      <li>
        <button
          onClick={() => setActivePage("graph")}
          className={`flex items-center gap-3 w-full px-3 py-2 rounded-lg transition ${
            activePage === "graph"
              ? "bg-[#FF9913] text-black font-semibold"
              : "hover:bg-gray-800"
          }`}
        >
          <BarChart2 size={20} /> Graph
        </button>
      </li>
      <li>
        <button
          onClick={() => setActivePage("table")}
          className={`flex items-center gap-3 w-full px-3 py-2 rounded-lg transition ${
            activePage === "table"
              ? "bg-[#FF9913] text-black font-semibold"
              : "hover:bg-gray-800"
          }`}
        >
          <Table size={20} /> Table
        </button>
      </li>
    </ul>
  </div>
</div>





  {/* Main Content */}
 <main
  ref={mainRef}
  className="flex-1 p-3 bg-transparent text-white 
             transition-all duration-300 overflow-y-auto"
  style={{
    marginLeft: window.innerWidth < 640 ? "0" : isCollapsed ? "5rem" : "14rem",
    paddingTop: window.innerWidth < 640 ? "4.5rem" : "6rem", // pt-22 ~ 5.5rem, pt-24 ~ 6rem
  }}
>
    {activePage === "home" && (
      <>
<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mt-3 overflow-auto">
  {/* VIN Number */}
  <StatCard
    label="VIN-Number"
    value={details?.vinnumber || details?.vinNumber || vin || "N/A"}
    icon={CreditCard}
  />

  {/* Owner */}
  <StatCard
    label="Owner"
    value={details?.ownerName || details?.ownername || "N/A"}
    icon={User}
  />

  {/* Phone */}
  <StatCard
    label="Phone"
    value={details?.phoneNumber || details?.phonenumber || "N/A"}
    icon={Phone}
  />


  {/* 📍 Location (spans 2 columns) */}
 <div className="col-span-2">
  <StatCard
    icon={MapPin}
    valueClassName="font-medium text-blue-300 w-full block text-[clamp(10px,1vw,16px)] break-words leading-snug line-clamp-2"
    value={
      details?.lat_long
        ? (() => {
            const [lat, lng] = details.lat_long
              .split(",")
              .map((n) => parseFloat(n.trim()));
            if (!isNaN(lat) && !isNaN(lng)) {
              // Format time
              const rawTime = details?.time;
              let formattedTime = "N/A";
              if (rawTime) {
                const d = new Date(rawTime);
                if (!isNaN(d.getTime())) {
                  const day = String(d.getDate()).padStart(2, "0");
                  const month = String(d.getMonth() + 1).padStart(2, "0");
                  const year = d.getFullYear();
                  let hours = d.getHours();
                  const minutes = String(d.getMinutes()).padStart(2, "0");
                  const ampm = hours >= 12 ? "PM" : "AM";
                  hours = hours % 12 || 12;
                  formattedTime = `${day}/${month}/${year} ${hours}:${minutes} ${ampm}`;
                }
              }

              const mapsUrl = `https://www.google.com/maps?q=${lat},${lng}`;

              return (
                <div className="flex flex-col space-y-1 text-left flex-1 w-full">
                  {/* Location as link */}
                  <a
                    href={mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-300 hover:underline break-words line-clamp-2"
                  >
                    {locationName || `${lat.toFixed(5)}, ${lng.toFixed(5)}`}
                  </a>
                  <span className="text-[11px] text-orange-500 font-medium">
                    <span className="text-gray-400 mr-1">Last updated:</span>
                    {formattedTime}
                  </span>
                </div>
              );
            }
            return details.lat_long;
          })()
        : "N/A"
    }
  />
</div>

</div>

{/* 🔹 Outer container for all cards */}
<div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
  
  {/* 🔸 Component Data (slightly bigger) */}
<div
  className="relative rounded-2xl p-6 
             bg-neutral-950 border border-white/10 
             text-white shadow-lg 
             transition-colors duration-300 hover:border-orange-500
             flex flex-col h-full md:col-span-5"
>
  {/* 🔹 Component Data Chips */}
  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3  relative z-10">
    <StatChip label="Controller serial No." value={details?.controllerid || "N/A"} />
    <StatChip label="Motor serial No." value={details?.motorid || "N/A"} />
    <StatChip label="BMS serial No." value={details?.bmsid || "N/A"} />
    <StatChip label="Smartkey ID" value={details?.smartkeyid || "N/A"} />
    <StatChip label="Charger serial No." value={details?.chargerid ?? "N/A"} />
    <StatChip label="Current rider" value={details?.chargerid ?? "N/A"} />
    <StatChip label="rideosversion" value={details?.rideosversion ?? "N/A"} />
    <StatChip label="Model" value={details?.model ?? "N/A"} />
    <StatChip label="BMS life cycles" value={details?.bmslifecycles ?? "N/A"} />

    <StatChip
      label="Handle lock"
      value={
        Number(details?.handlelockstate) === 1 ? (
          <span className="text-green-400 font-semibold 
            drop-shadow-[0_0_8px_rgba(34,197,94,0.8)] ">
            Unlocked
          </span>
        ) : (
          <span className="text-red-400 font-semibold 
            drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]">
            Locked
          </span>
        )
      }
    />

    <StatChip
      label="Charging state"
      value={
        Number(details?.chargingstate) === 1 ? (
          <span className="text-green-400 font-semibold 
            drop-shadow-[0_0_10px_rgba(34,197,94,0.9)] ">
            Charging
          </span>
        ) : (
          <span className="text-gray-400 font-semibold 
            drop-shadow-[0_0_8px_rgba(156,163,175,0.8)]">
            Not charging
          </span>
        )
      }
    />

    <StatChip
      label="Scooter Lock/Unlock"
      value={
        Number(latestGauges?.ev_power_state) === 1 ? (
          <span className="text-green-400 font-semibold 
            drop-shadow-[0_0_8px_rgba(34,197,94,0.8)] animate-pulse">
            Unlocked
          </span>
        ) : (
          <span className="text-red-400 font-semibold 
            drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]">
            Locked
          </span>
        )
      }
    />
  </div>
</div>

  <CustomAlert message={alertMessage} onClose={() => setAlertMessage("")} />

  {/* 🔹 Speed */}
  <div
    className="relative rounded-2xl p-4 
               bg-neutral-950 border border-white/10 
               text-white shadow-lg 
               transition-all duration-300 hover:border-orange-500 
               flex flex-col h-full md:col-span-3 "
  >
    <SectionTitle left="Speed" />
    <div className="flex justify-between mt-4">
      <div className="flex flex-col gap-4 ml-0">
        <div className="bg-black rounded-xl p-3 flex flex-col items-center text-center w-25">
          <p className="text-sm text-gray-400">Trip km</p>
          <h2 className="text-xl font-bold">{latestGauges?.tripkm ?? "N/A"}</h2>
        </div>
        <div className="bg-black rounded-xl p-3 flex flex-col items-center text-center w-25">
          <p className="text-sm text-gray-400">Odo meter</p>
          <h2 className="text-xl font-bold">
            {details?.odo !== undefined ? Number(details.odo).toFixed(2) : "N/A"}
          </h2>
        </div>
      </div>
<div className="flex items-center justify-center flex-1 -mt-6">
  <ThreeQuarterGauge
    value={Number(latestGauges?.speed_kmph) || 0}
    max={120}
    unit="km/h"
    width={220}
  />
</div>
    </div>
  </div>

  {/* 🔹 Main SOC */}
  <div
    className="relative rounded-2xl p-6 
               bg-neutral-950 border border-white/10 
               text-white shadow-lg 
               transition-all duration-300 hover:border-orange-500 
               flex flex-col h-full md:col-span-4"
  >
    <SectionTitle left="Battery" />
    <div className="flex justify-between mt-4">
      <div className="flex flex-col gap-4">
        <div className="bg-black rounded-xl p-4 flex flex-col items-center text-center w-32">
          <p className="text-sm text-gray-400">Battery voltage</p>
          <h2 className="text-xl font-bold">{latestGauges?.batvoltage || 0} V</h2>
        </div>
        <div className="bg-black rounded-xl p-4 flex flex-col items-center text-center w-32">
          <p className="text-sm text-gray-400">APU SOC</p>
          <h2 className="text-xl font-bold">{Number(latestGauges?.apusoc) || 0} %</h2>
        </div>
      </div>
      <div className="flex items-center justify-center">
        <SpeedGauge
          value={Number(latestGauges?.soc) || 0}
          max={100}
          unit="%"
          width={220}
        />
      </div>
    </div>
  </div>
</div>

  
<div className="grid grid-cols-1 md:grid-cols-5 gap-4 mt-4 h-auto md:h-[500px]">
  {/* --- Graph (60%) --- */}
<div className="md:col-span-3 w-full h-[420px] sm:h-[480px] md:h-[500px] lg:max-h-[500px]">

  <div
    className="relative w-full h-full rounded-3xl bg-black
               border border-[#FF9913]/30 
               backdrop-blur-xl overflow-hidden
               pb-0 sm:pb-3 md:pb-0 px-2 sm:px-3 md:px-4"
  >
    {/* --- Toggle Button --- */}
    <button
      onClick={() => setShowMetrics(true)}
      className="absolute top-2 right-2 md:top-3 md:right-3 
                 z-20 px-2 py-1 text-xs md:text-sm
                 bg-[#0d0d0d] text-white border border-[#FF9913]/40 rounded-lg 
                 shadow hover:text-[#FF9913] transition"
    >
      Select parameters ▼
    </button>

    {/* --- Slide-out panel --- */}
    {showMetrics && (
      <div className="fixed top-0 right-0 h-full w-64 sm:w-72 bg-black/95 
                      border-l border-[#FF9913]/30 shadow-xl p-4 sm:p-5 
                      z-50 flex flex-col">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <h3 className="text-xs sm:text-sm font-semibold text-white">
            Select parameters
          </h3>
          <button
            onClick={() => setShowMetrics(false)}
            className="text-gray-400 hover:text-[#FF9913]"
          >
            ✕
          </button>
        </div>

        {/* ✅ Scrollable options for phone */}
        <div className="space-y-2 overflow-y-auto max-h-[70vh] pr-1 sm:pr-2">
          {metricOptions.map((opt) => (
            <label
              key={opt.key}
              className="flex items-center gap-2 text-xs sm:text-sm 
                         text-white cursor-pointer hover:text-[#FF9913]"
            >
              <input
                type="checkbox"
                checked={metricsSelected.includes(opt.key)}
                onChange={() => handleMetricChange(opt.key)}
                className="accent-[#FF9913]"
              />
              {opt.label}
            </label>
          ))}
        </div>
      </div>
    )}

    {/* --- Chart --- */}
       <div className="p-2 sm:p-3 md:p-4 relative z-10 h-full mt-3 sm:mt-4 md:mt-5">
      <ResponsiveContainer
        width="100%"
        height={window.innerWidth < 768 ? 400 : 460} // 📱 taller graph on mobile
      >

        <LineChart
          data={processedData}
          margin={{
            top: 10,
            right: 10,
            bottom: window.innerWidth < 768 ? 40 : 20, // ✅ smaller bottom margin on phones
            left: 0,
          }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#33415540"
            vertical={false}
          />
          <XAxis
            dataKey="time"
            tick={{
              fill: "#ffffff",
              fontSize: window.innerWidth < 768 ? 9 : 11,
              fontWeight: 500,
            }}
            tickLine={false}
            axisLine={{ stroke: "rgba(255, 254, 253, 1)" }}
            padding={{ left: 5, right: 5 }}
            interval="preserveStartEnd"
            tickFormatter={(value) => {
              const date = new Date(value);
              return `${date.getHours().toString().padStart(2, "0")}:${date
                .getMinutes()
                .toString()
                .padStart(2, "0")}`;
            }}
            angle={window.innerWidth < 768 ? -30 : 0}
            textAnchor={window.innerWidth < 768 ? "end" : "middle"}
            height={window.innerWidth < 768 ? 40 : 30}
          />
          <YAxis
            tick={{
              fill: "#ffffff",
              fontSize: window.innerWidth < 768 ? 9 : 11,
              fontWeight: 500,
            }}
            width={window.innerWidth < 768 ? 32 : 50}
            tickLine={false}
            axisLine={{ stroke: "#f5f2efff" }}
            domain={["auto", "auto"]}
          />
          <ReferenceLine
            y={0}
            stroke="#f7f2ebff"
            strokeDasharray="6 3"
            strokeWidth={1.2}
          />
          <Tooltip
            itemStyle={{ fontWeight: 500 }}
            contentStyle={{
              backgroundColor: "#000000",
              border: "1px solid #FF9913",
              borderRadius: "0.75rem",
              padding: "4px 8px",
              fontSize: window.innerWidth < 768 ? "10px" : "11px",
              boxShadow: "0 0 15px #FF991355",
            }}
            formatter={(value, name, props) => {
              const color = props.color || "#f1f5f9";
              return [
                <span style={{ color, fontWeight: 600 }}>{value}</span>,
                name,
              ];
            }}
            labelFormatter={(label, payload) => {
              if (payload && payload.length > 0) {
                const { tripkm } = payload[0].payload;
                const date = new Date(label);
                const formatted =
                  `${date.getFullYear()}:` +
                  `${String(date.getMonth() + 1).padStart(2, "0")}:` +
                  `${String(date.getDate()).padStart(2, "0")} ` +
                  `${String(date.getHours()).padStart(2, "0")}:` +
                  `${String(date.getMinutes()).padStart(2, "0")}:` +
                  `${String(date.getSeconds()).padStart(2, "0")}`;
                return (
                  <div>
                    <div>{formatted}</div>
                    <div style={{ color: "#FFD700", fontWeight: "bold" }}>
                      Trip (km): {tripkm ?? "N/A"}
                    </div>
                  </div>
                );
              }
              return label;
            }}
          />
          <Legend
            wrapperStyle={{
              color: "#ffffff",
              fontSize: window.innerWidth < 768 ? 9 : 12,
              fontWeight: 600,
            }}
            iconType="circle"
          />
          {metricOptions
            .filter((opt) => metricsSelected.includes(opt.key))
            .map((opt) => (
              <Line
                key={opt.key}
                type="monotone"
                dataKey={opt.key}
                name={opt.label}
                stroke={opt.color}
                strokeWidth={2}
                dot={false}
                isAnimationActive={false}
                connectNulls
              />
            ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  </div>
</div>


      {/* --- AH Values (40%) --- */}
<div className="md:col-span-2 w-full h-auto md:h-[500px]">
  {/* 🔹 Big container */}
  <div
    className="bg-gradient-to-br from-[#1e1e2f] via-[#1a1a28] to-[#0f0f17] 
               rounded-2xl shadow-lg w-full h-full flex flex-col p-4 
               border border-white/10"
  >
    {/* Header */}

    {/* 🔹 AH Values + BMS Mosfet in one container */}
    <div className="flex flex-col flex-1 gap-6">
      
      
      {/* --- AH Values Section --- */}

    <div className="flex flex-col flex-1 bg-[#111] rounded-2xl p-3 shadow-md relative">
  {/* Top-left small AH card */}
  <div className="absolute top-0 right-0 bg-black rounded-xl px-2 py-1 border border-gray-800 
                  shadow-md flex flex-col items-center justify-center">
    <p className="text-[10px] text-gray-400 tracking-wider">Remaining Capacity(Ah)</p>
    <span className="text-sm font-semibold text-orange-400">
      {latestGauges?.remainingcapacity_ah ?? "N/A"} 
    </span>
  </div>

  {/* Main AH bars */}
  <h4 className="text-white text-sm font-semibold mb-3 mt-6">AH Values</h4>
  <div className="flex justify-around items-end h-40 gap-6">
    {(() => {
      const latest = livedata?.[livedata.length - 1] || {};
      const bars = [
        { label: "In ah", value: latest.inah || 0, color: "from-green-600 to-green-400", text: "text-green-400" },
        { label: "In ah by charger", value: latest.inah_by_charger || 0, color: "from-yellow-500 to-yellow-300", text: "text-yellow-300" },
        { label: "In ah by regen", value: latest.inah_by_regen || 0, color: "from-blue-500 to-blue-400", text: "text-blue-400" },
        { label: "Out ah", value: latest.outah || 0, color: "from-red-600 to-red-500", text: "text-red-400" },
      ];

      const maxValue = 100;

      return bars.map((b, i) => (
        <div key={i} className="flex flex-col items-center justify-end h-full w-16">
          <span className={`mb-1 text-xs font-medium ${b.text}`}>
            {Number(b.value).toFixed(2)}
          </span>
          <div className="h-28 w-full bg-black rounded flex items-end overflow-hidden">
            <div
              className={`w-full bg-gradient-to-t ${b.color} transition-all duration-500`}
              style={{ height: `${Math.min((b.value / maxValue) * 100, 100)}%` }}
            />
          </div>
          <span className="mt-2 text-[14px] text-gray-400 text-center whitespace-nowrap">
            {b.label}
          </span>
        </div>
      ));
    })()}
  </div>
</div>


      {/* --- BMS Mosfet States Section --- */}
<div className="flex-1 rounded-2xl p-4 shadow-md border-white/5">
  <h4 className="text-white text-sm font-semibold mb-3">BMS Mosfet State</h4>
  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
    {(() => {
      const flags = (details?.bmsmosstates ?? "")
        .split(",")
        .map((v) => parseInt(v.trim(), 10));

      const states = [
        { label: "Main Charge Mosfet", value: flags[0], icon: BatteryCharging },
        { label: "Main Discharge Mosfet", value: flags[1], icon: Battery },
        { label: "APU Charge Mosfet", value: flags[2], icon: BatteryCharging },
        { label: "APU Discharge Mosfet", value: flags[3], icon: Battery },
      ];

      return states.map((s, i) => {
        const Icon = s.icon;
        const isOn = Boolean(s.value);

        return (
          <div
            key={i}
            className="flex flex-col items-center justify-center space-y-2 p-3 
                       rounded-xl bg-black hover:bg-[#1a1a1a] transition-all"
          >
            {/* Icon with shine (gradient overlay) */}
            <div
              className={`p-2 rounded-full relative ${
                isOn
                  ? "text-emerald-400"
                  : "text-red-400"
              }`}
            >
              <Icon size={26} />
              {/* subtle top highlight */}
              <span className="absolute inset-0 rounded-full bg-gradient-to-t from-white/20 to-transparent opacity-40 pointer-events-none"></span>
            </div>

            {/* Label */}
            <span className="text-[12px] font-medium text-white/80 text-center">
              {s.label}
            </span>

            {/* Status pill with shine */}
            <span
              className={`relative px-4 py-1 text-xs font-semibold rounded-full border overflow-hidden ${
                isOn
                  ? "bg-gradient-to-r from-emerald-600/40 via-emerald-400/20 to-emerald-600/40 text-emerald-300 border-emerald-500/40"
                  : "bg-gradient-to-r from-red-600/40 via-red-400/20 to-red-600/40 text-red-300 border-red-500/40"
              }`}
            >
              {isOn ? "ON" : "OFF"}
              {/* glossy shine overlay */}
              <span className="absolute inset-0 bg-gradient-to-t from-white/15 to-transparent opacity-60 pointer-events-none"></span>
            </span>
          </div>
        );
      });
    })()}
  </div>
</div>



    </div>
  </div>
</div>
</div>


{/* 🔹 Dashboard Grid with 3 Cards  tierpressuer, ntc_tempretuer tempretuer*/}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-stretch mt-5">
  {/* 1️⃣ Scooter Status (make wider, span 2 columns) */}
<div
  className="relative rounded-2xl p-3 
             bg-neutral-950 border border-white/10 
             text-white shadow-lg 
             transition-colors duration-300 hover:border-orange-500
              lg:col-span-2"
>
  <SectionTitle left="Tire pressure" className="mb-2" />

  {/* Scooter Image Container */}
  <div className="relative flex justify-center items-center">
    <img
      src="https://image2url.com/images/1758188694510-a05a5c3e-a114-4f47-8e03-34db1e571665.png"
      alt="Scooter"
      className="
        w-[70%] max-w-[180px] sm:max-w-[220px] md:max-w-[280px] lg:max-w-[360px] xl:max-w-[420px] 
        h-auto object-contain
      "
    />

    {/* Rear Tire Data */}
    <div className="absolute left-2 sm:left-6 bottom-[20%] flex flex-col text-center">
      <p className="text-[10px] sm:text-xs md:text-sm text-gray-300">Rear</p>
      <p className="text-green-400 font-semibold text-[10px] sm:text-xs md:text-sm">IDEAL</p>
      <div className="bg-black/60 rounded-lg px-2 sm:px-3 py-1 mt-1 text-[9px] sm:text-xs md:text-sm text-white">
        <p>{latestGauges?.rearPressure || "35.0"} psi</p>
        <p>{latestGauges?.rearTemp || "27"}°C</p>
      </div>
    </div>

    {/* Front Tire Data */}
    <div className="absolute right-2 sm:right-6 bottom-[20%] flex flex-col text-center">
      <p className="text-[10px] sm:text-xs md:text-sm text-gray-300">Front</p>
      <p className="text-yellow-400 font-semibold text-[10px] sm:text-xs md:text-sm">IDEAL</p>
      <div className="bg-black/60 rounded-lg px-2 sm:px-3 py-1 mt-1 text-[9px] sm:text-xs md:text-sm text-white">
        <p>{latestGauges?.frontPressure || "32.2"} psi</p>
        <p>{latestGauges?.frontTemp || "27"}°C</p>
      </div>
    </div>
  </div>
</div>


  {/* 2️⃣ Temperatures */}
 <div
      className="relative rounded-2xl p-4 
               bg-neutral-950 border border-white/10 
               text-white shadow-lg 
               transition-colors duration-300 hover:border-orange-500 
               flex flex-col h-full"
  >
    <SectionTitle left="Temperatures" />
   <div className="grid grid-cols-3 gap-3 mt-2 mb-0 flex">
  {[
    { label: "Ctrl MOS Temp", value: latestGauges?.controllermostemp },
    { label: "Motor Temp", value: latestGauges?.motortemp },
    { label: "BMS MOS Temp", value: latestGauges?.bmsmostemp },
  ].map((t) => (
    <div key={t.label} className="flex justify-center">
    <ThermometerCard
  label={t.label}
  value={Number(t.value) || 0}
  min={0}
  max={120}
  // height={240}
  gradient={["#32ed0d", "#e71414"]}
  className="h-[220px] sm:h-[180px]" 
/>
    </div>
  ))}
</div>
  </div>

  {/* 3️⃣ Tire Pressure */}
  {/* <div
    className="relative rounded-2xl p-6 
               bg-gradient-to-br from-[#111111] to-[#0a0a0a]
               border border-white/10 text-white shadow-lg
               transition-all duration-300 hover:border-orange-500 hover:shadow-[0_0_25px_rgba(255,138,76,0.4)]
               flex flex-col"
  >
    <SectionTitle left="Tire Pressure" />
    <div className="flex justify-center mt-4 flex-1 items-center">
      <ThreeQuarterGauge
        value={Number(latestGauges?.tirepressure) || 0}
        min={0}
        max={100}
        unit="psi"
        width={220}
      />
    </div>
  </div> */}

   <div
       className="relative rounded-2xl p-6 
               bg-neutral-950 border border-white/10 
               text-white shadow-lg 
               transition-colors duration-300 hover:border-orange-500 
               flex flex-col h-full"
  >
    <SectionTitle left="NTC Temperatures" />

    <div className="flex-1 flex flex-col ">
      {(() => {
        const raw = ntcData?.ntc ?? "";
        const arr = raw.split(",").map((v) => Number(v.trim()));

        if (arr.length < 8) {
          return (
            <p className="mt-4 text-base text-center text-white/70">N/A</p>
          );
        }

        // Split NTCs
        const main = arr.slice(0, 4);
        const apu = arr.slice(-4);
        const apuAbsent = apu.every((v) => v === -40);

        const mainLabels = [
          "Positive terminal temp",
          "Cell no 20 temp",
          "Cell no 50 temp",
          "Negative terminal temp",
        ];

        // Renderer for NTC blocks
        const renderNTCs = (list, label, customLabels = []) => (
          <div className="grid grid-cols-2 gap-2">
            {list.map((val, i) => (
              <div
                key={i}
                className="rounded-lg bg-black/40 border border-white/10 
                           p-2 flex flex-col items-center shadow"
              >
                <span className="text-[11px] text-white/60">
                  {customLabels[i] || `${label} ${i + 1}`}
                </span>
                <span className="text-sm font-Kanit text-white">
                  {val}°C
                </span>
              </div>
            ))}
          </div>
        );

        return (
          <div className="grid grid-cols-1 gap-3">
            {/* Main Battery */}
            <div className="rounded-lg bg-black/40 border border-white/10 p-2 shadow-md">
              <p className="text-xs text-cyan-400 font-Kanit mb-2 text-center">
                Main battery
              </p>
              {renderNTCs(main, "NTC", mainLabels)}
            </div>

            {/* APU */}
            <div className="rounded-lg bg-black/40 border border-white/10 p-2 shadow-md">
              <p className="text-xs uppercase text-purple-400 font-Kanit mb-2 text-center">
                APU
              </p>
              {apuAbsent ? (
                <p className="text-sm text-red-400 font-medium text-center">
                  APU not installed
                </p>
              ) : (
                renderNTCs(apu, "NTC", mainLabels)
              )}
            </div>
          </div>
        );
      })()}
    </div>

    
  </div>
  
</div>



 {/* <div
    className="relative rounded-2xl p-6 
               bg-gradient-to-br from-[#111111] to-[#0a0a0a]
               border border-white/10 text-white shadow-lg
               transition-all duration-300 hover:border-orange-500 hover:shadow-[0_0_25px_rgba(255,138,76,0.4)]
               flex flex-col"
  >
    <SectionTitle left="Scooter Status" />
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-4 flex-1">
      {[
       
        { label: "BMS Life Cycles", key: "bmslifecycles", src: "allvin" },
        { label: "Charging State", key: "chargingstate", src: "allvin" },
      ].map((t) => {
        const srcObj = t.src === "allvin" ? details : t.src === "realtime" ? latestGauges : {};
        let raw = srcObj?.[t.key];
        let val = raw ?? "N/A";
        let color = "text-white";
        let icon = "";

        if (t.key === "chargingstate") {
          if (Number(raw) === 1) { val = "Charging"; color = "text-blue-400 animate-pulse"; icon = "⚡"; }
          else if (Number(raw) === 0) { val = "Not charging"; color = "text-gray-400"; icon = "🔋"; }
        }

        if (t.key === "handlelockstate") {
          if (Number(raw) === 1) val = <span className="text-green-400 font-medium">🔒 Locked</span>;
          else if (Number(raw) === 0) val = <span className="text-red-400 font-medium">🔓 Unlocked</span>;
        }

        return (
          <div
            key={t.key}
            className="flex flex-col items-center justify-center bg-black/30
                       rounded-xl p-4 border border-white/5 shadow-md hover:border-orange-400/40 transition"
          >
            <p className="text-[12px] text-gray-400 mb-1">{t.label}</p>
            <div className="flex items-center gap-2 text-sm font-semibold">
              {icon && <span>{icon}</span>}
              <span className={color}>{val}</span>
            </div>
          </div>
        );
      })}
    </div>
  </div> */}

 <div className="mt-6 ">  
 <Svg>
  <div className="mt-3">
      <h2 className="text-base font-Kanit tracking-wider text-[#FF9913] mb-3 border-b border-[#FF9913]/30 pb-1">
        Select data and time to view data: <span className="text-white">{vin}</span>
      </h2>

      <div className="flex flex-col gap-2 md:flex-row">
        {/* Start Date */}
        <div className="relative w-full">
          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none text-white" />
          <input
            type="datetime-local"
            value={startDateTime}
            onChange={(e) => handleStartChange(e.target.value)}
            className="w-full rounded-xl border border-[#FF9913]/30 bg-black pl-10 pr-3 py-2 text-sm text-white outline-none
                      hover:border-[#FF9913]/60 focus:border-[#FF9913]/90 focus:shadow-[0_0_12px_2px_rgba(255,153,19,0.4)] transition"
          />
        </div>

        {/* End Date */}
        <div className="relative w-full">
          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none text-white" />
          <input
            type="datetime-local"
            value={endDateTime}
            onChange={(e) => handleEndChange(e.target.value)}
            className="w-full rounded-xl border border-[#FF9913]/30 bg-black pl-10 pr-3 py-2 text-sm text-white outline-none
                      hover:border-[#FF9913]/60 focus:border-[#FF9913]/90 focus:shadow-[0_0_12px_2px_rgba(255,153,19,0.4)] transition"
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="mt-4 flex gap-3">
        <button
          onClick={fetchHistoricalData}
          disabled={loading}
          className="rounded-xl border border-[#F5880D]/50 bg-[#F57A0D] px-5 py-2 text-sm text-black 
              hover:bg-[#FF7A00] hover:shadow-[0_0_15px_2px_rgba(255,153,19,0.5)] 
              transition-all duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Loading..." : "Load history"}
        </button>

        {!autoMode && (
          <button
            onClick={resetToAuto}
            className="rounded-xl border border-[#F5880D]/50 bg-[#F57A0D] px-5 py-2 text-sm text-black 
                hover:bg-[#FF7A00] hover:shadow-[0_0_15px_2px_rgba(255,153,19,0.5)] 
                transition-all duration-300 ease-in-out"
          >
            Set default time
          </button>
        )}
      </div>
    </div>
        </Svg>

</div>


  <div className="mt-3">     
        {showHistoryChart && historyData.length > 0 && (
          <div
            className="relative mt-3 h-[500px] rounded-3xl bg-black
                          border border-[#FF9913]/30 shadow-[0_0_25px_rgba(255,153,19,0.3)]
                          backdrop-blur-xl overflow-hidden"
          >
            {/* --- Glow Background --- */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,#FF991322,transparent_60%),
                                                radial-gradient(circle_at_bottom_right,#FF991322,transparent_60%)] animate-pulse"></div>
            {/* --- 📱 Mobile: Dropdown --- */}
            <div className="md:hidden p-3 relative z-20">
              <div
                onClick={() => setShowMetrics1(!showMetrics1)}
                className="w-full flex items-center justify-between px-3 py-2 
                          bg-black text-white rounded-lg shadow-md 
                          border border-[#FF9913]/30 text-sm font-medium cursor-pointer"
              >
                Select parameters to be shown on graph.
                <span>{showMetrics1 ? "▲" : "▼"}</span>
              </div>

              {showMetrics1 && (
                <div className="mt-2 bg-black border border-[#FF9913]/30 
                                rounded-xl p-3 space-y-2 shadow-lg max-h-60 overflow-y-auto">
                  {metricOptions1.map((opt) => (
                    <label
                      key={opt.key}
                      className="flex items-center gap-2 text-sm text-white cursor-pointer hover:text-[#FF9913] transition"
                    >
                      <input
                        type="checkbox"
                        checked={metricsSelected1.includes(opt.key)}
                        onChange={() => handleMetricChange1(opt.key)}
                        className="accent-[#FF9913]"
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
                <ResponsiveContainer
                  width="100%"
                  height={window.innerWidth < 768 ? 360 : 420}
                >
                  <LineChart
                    data={processedData1}
                    margin={{
                      top: 10,
                      right: 10,
                      bottom: window.innerWidth < 768 ? 50 : 20,
                      left: 0,
                    }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="#33415540"
                      vertical={false}
                    />

                    <XAxis
                      dataKey="time"
                      tick={{
                        fill: "#ffffff",
                        fontSize: window.innerWidth < 768 ? 9 : 11,
                        fontWeight: 500,
                      }}
                      tickLine={false}
                      axisLine={{ stroke: "#fffbf7ff" }}
                      padding={{ left: 5, right: 5 }}
                      interval="preserveStartEnd"
                      tickFormatter={(value) => {
                        const date = new Date(value);
                        return `${date
                          .getHours()
                          .toString()
                          .padStart(2, "0")}:${date
                          .getMinutes()
                          .toString()
                          .padStart(2, "0")}`;
                      }}
                      angle={window.innerWidth < 768 ? -30 : 0}
                      textAnchor={window.innerWidth < 768 ? "end" : "middle"}
                      height={window.innerWidth < 768 ? 45 : 30}
                    />
                    <YAxis
                      tick={{
                        fill: "#ffffff",
                        fontSize: window.innerWidth < 768 ? 9 : 11,
                        fontWeight: 500,
                      }}
                      width={window.innerWidth < 768 ? 35 : 50}
                      tickLine={false}
                      axisLine={{ stroke: "#fcfffcff" }}
                      domain={["auto", "auto"]}
                    />

                    <ReferenceLine
                      y={0}
                      stroke="#ffffffff"
                      strokeDasharray="6 3"
                      strokeWidth={1.2}
                    />

                         <Tooltip
                itemStyle={{ fontWeight: 500 }}
                contentStyle={{
                  backgroundColor: "#000000",
                  border: "1px solid #FF9913",
                  borderRadius: "0.75rem",
                  padding: "6px 10px",
                  fontSize: window.innerWidth < 768 ? "10px" : "11px",
                  boxShadow: "0 0 15px #FF991355",
                }}
                formatter={(value, name, props) => {
                  const color = props.color || "#f1f5f9";
                  return [
                    <span style={{ color, fontWeight: 600 }}>{value}</span>,
                    name,
                  ];
                }}
              labelFormatter={(label, payload) => {
                if (payload && payload.length > 0) {
                  const { tripkm } = payload[0].payload;
              
                  const date = new Date(label);
                  const formatted =
                    `${date.getFullYear()}:` +
                    `${String(date.getMonth() + 1).padStart(2, "0")}:` +
                    `${String(date.getDate()).padStart(2, "0")} ` +
                    `${String(date.getHours()).padStart(2, "0")}:` +
                    `${String(date.getMinutes()).padStart(2, "0")}:` +
                    `${String(date.getSeconds()).padStart(2, "0")}`;
              
                  return (
                    <div>
                      <div>{formatted}</div>
                      <div style={{ color: "#FFD700", fontWeight: "bold" }}>
                        Trip (km): {tripkm ?? "N/A"}
                      </div>
                     
                    </div>
                  );
                }
                return label;
              }}
              />
                    <Legend
                      wrapperStyle={{
                        color: "#ffffff",
                        fontSize: window.innerWidth < 768 ? 10 : 12,
                        fontWeight: 600,
                      }}
                      iconType="circle"
                    />

                    {/* --- Dynamic Lines --- */}
                    {metricOptions1
                      .filter((opt) => metricsSelected1.includes(opt.key))
                      .map((opt) => (
                        <Line
                          key={opt.key}
                          type="monotone"
                          dataKey={opt.key}
                          name={opt.label}
                          stroke={opt.color}
                          strokeWidth={1.8}
                          dot={false}
                          isAnimationActive={false}
                          connectNulls
                        />
                      ))}
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* --- 💻 Desktop: Sidebar --- */}
              <div className="hidden md:flex border-l border-[#FF9913]/20 bg-black backdrop-blur-md p-4 flex-col">
                <h3 className="text-sm font-Kanit text-white mb-2 border-b border-[#FF9913]/30 pb-1">
                  Select parameters to be shown on graph.
                </h3>
                <div className="flex flex-col gap-2">
                  {metricOptions1.map((opt) => (
                    <label
                      key={opt.key}
                      className="flex items-center gap-2 text-sm text-white cursor-pointer hover:text-[#FF9913] transition"
                    >
                      <input
                        type="checkbox"
                        checked={metricsSelected1.includes(opt.key)}
                        onChange={() => handleMetricChange1(opt.key)}
                        className="accent-[#FF9913]"
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
                        bg-[#F61111] hover:bg-[#FF4500] 
                        text-white text-sm font-Kanit 
                        rounded-lg shadow-md border border-[#F61111]
                        backdrop-blur-sm
                        transition-all duration-300 ease-in-out
                        hover:scale-105"
            >
              Close
            </button>
          </div>
        )}
  </div>

  </>
  )}

   {activePage === "graph" && (
    <>
<div >
     <div
       className="relative mt-3 h-[500px] rounded-3xl bg-black
                  border border-[#FF9913]/30 shadow-[0_0_25px_rgba(255,153,19,0.3)]
                  backdrop-blur-xl overflow-hidden"
     >
       {/* Glow background */}
       <div
         className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,#FF991322,transparent_60%),
                                       radial-gradient(circle_at_bottom_right,#FF991322,transparent_60%)] animate-pulse"
       ></div>
     
       {/* --- 📱 Mobile: Dropdown --- */}
       <div className="md:hidden p-3 relative z-10">
        <div
                     onClick={() => setShowMetrics1(!showMetrics1)}
                     className="w-full flex items-center justify-between px-3 py-2 
                               bg-black text-white rounded-lg shadow-md 
                               border border-[#FF9913]/30 text-sm font-medium cursor-pointer"
                   >
                     Select parameters to be shown on graph.
                     <span>{showMetrics1 ? "▲" : "▼"}</span>
                   </div>
     
                   {showMetrics1 && (
                     <div className="mt-2 bg-black border border-[#FF9913]/30 
                                     rounded-xl p-2 space-y-2 shadow-lg max-h-60 overflow-y-auto">
             {metricOptions.map((opt) => (
               <label
                 key={opt.key}
                 className="flex items-center gap-2 text-sm text-white cursor-pointer hover:text-[#FF9913] transition"
               >
                 <input
                   type="checkbox"
                   checked={metricsSelected.includes(opt.key)}
                   onChange={() => handleMetricChange(opt.key)}
                   className="accent-[#FF9913]"
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
             height={window.innerWidth < 768 ? 360 : 450}
           >
             <LineChart
               data={processedData}
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
                 tick={{
                   fill: "#ffffff",
                   fontSize: window.innerWidth < 768 ? 9 : 11,
                   fontWeight: 500,
                 }}
                 tickLine={false}
                 axisLine={{ stroke: "#FF9913" }}
                 padding={{ left: 5, right: 5 }}
                 interval="preserveStartEnd"
                 tickFormatter={(value) => {
                   const date = new Date(value);
                   return `${date.getHours().toString().padStart(2, "0")}:${date
                     .getMinutes()
                     .toString()
                     .padStart(2, "0")}`;
                 }}
                 angle={window.innerWidth < 768 ? -30 : 0}
                 textAnchor={window.innerWidth < 768 ? "end" : "middle"}
                 height={window.innerWidth < 768 ? 45 : 30}
               />
     
               <YAxis
                 tick={{
                   fill: "#ffffff",
                   fontSize: window.innerWidth < 768 ? 9 : 11,
                   fontWeight: 500,
                 }}
                 width={window.innerWidth < 768 ? 35 : 50}
                 tickLine={false}
                 axisLine={{ stroke: "#FF9913" }}
                 domain={["auto", "auto"]}
               />
               
               <ReferenceLine y={0} stroke="#FF9913" strokeDasharray="6 3" strokeWidth={1.2} />
     
              <Tooltip
       itemStyle={{ fontWeight: 500 }}
       contentStyle={{
         backgroundColor: "#000000",
         border: "1px solid #FF9913",
         borderRadius: "0.75rem",
         padding: "6px 10px",
         fontSize: window.innerWidth < 768 ? "10px" : "11px",
         boxShadow: "0 0 15px #FF991355",
       }}
       formatter={(value, name, props) => {
         const color = props.color || "#f1f5f9";
         return [
           <span style={{ color, fontWeight: 600 }}>{value}</span>,
           name,
         ];
       }}
     labelFormatter={(label, payload) => {
       if (payload && payload.length > 0) {
         const { tripkm } = payload[0].payload;
     
         const date = new Date(label);
         const formatted =
           `${date.getFullYear()}:` +
           `${String(date.getMonth() + 1).padStart(2, "0")}:` +
           `${String(date.getDate()).padStart(2, "0")} ` +
           `${String(date.getHours()).padStart(2, "0")}:` +
           `${String(date.getMinutes()).padStart(2, "0")}:` +
           `${String(date.getSeconds()).padStart(2, "0")}`;
     
         return (
           <div>
             <div>{formatted}</div>
             <div style={{ color: "#FFD700", fontWeight: "bold" }}>
               Trip (km): {tripkm ?? "N/A"}
             </div>
            
           </div>
         );
       }
       return label;
     }}
     
     /> 
               <Legend
                 wrapperStyle={{
                   color: "#ffffff",
                   fontSize: window.innerWidth < 768 ? 10 : 12,
                   fontWeight: 600,
                 }}
                 iconType="circle"
               />
     
               {metricOptions
                 .filter((opt) => metricsSelected.includes(opt.key))
                 .map((opt) => {
                   if (opt.key === "currentconsumption") {
                     return (
                       <React.Fragment key="currentconsumption">
                         <Line type="monotone" dataKey="currentPositive" name="Current + (A)"
                           stroke="#13ff23ff" strokeWidth={2} dot={false} isAnimationActive={false} connectNulls />
                         <Line type="monotone" dataKey="currentNegative" name="Current - (A)"
                           stroke="#ff0000ff" strokeWidth={2} dot={false} isAnimationActive={false} connectNulls />
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
         <div className="hidden md:flex border-l border-[#FF9913]/20 bg-black backdrop-blur-md p-4 flex-col h-[500px]">
       <h3 className="text-sm font-semibold text-white mb-4 tracking-wide border-b border-[#FF9913]/30 pb-1">
         Select parameters to be shown on graph.
       </h3>
     
         <div className="flex flex-col gap-2 overflow-y-auto pr-2">
             {metricOptions.map((opt) => (
               <label
                 key={opt.key}
                 className="flex items-center gap-2 text-sm text-white cursor-pointer hover:text-[#FF9913] transition"
               >
                 <input
                   type="checkbox"
                   checked={metricsSelected.includes(opt.key)}
                   onChange={() => handleMetricChange(opt.key)}
                   className="accent-[#FF9913]"
                 />
                 {opt.label}
               </label>
             ))}
           </div>
         </div>
       </div>
     </div>

      {/* --- AH Values (40%) --- */}

  

  <CustomAlert message={alertMessage} onClose={() => setAlertMessage("")} />
 
<div className="mt-3">

        <Svg>
  <div className="mt-3">
      <h2 className="text-base font-Kanit tracking-wider text-[#FF9913] mb-3 border-b border-[#FF9913]/30 pb-1">
        Select data and time to view data: <span className="text-white">{vin}</span>
      </h2>

      <div className="flex flex-col gap-2 md:flex-row">
        {/* Start Date */}
        <div className="relative w-full">
          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none text-white" />
          <input
            type="datetime-local"
            value={startDateTime}
            onChange={(e) => handleStartChange(e.target.value)}
            className="w-full rounded-xl border border-[#FF9913]/30 bg-black pl-10 pr-3 py-2 text-sm text-white outline-none
                      hover:border-[#FF9913]/60 focus:border-[#FF9913]/90 focus:shadow-[0_0_12px_2px_rgba(255,153,19,0.4)] transition"
          />
        </div>

        {/* End Date */}
        <div className="relative w-full">
          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none text-white" />
          <input
            type="datetime-local"
            value={endDateTime}
            onChange={(e) => handleEndChange(e.target.value)}
            className="w-full rounded-xl border border-[#FF9913]/30 bg-black pl-10 pr-3 py-2 text-sm text-white outline-none
                      hover:border-[#FF9913]/60 focus:border-[#FF9913]/90 focus:shadow-[0_0_12px_2px_rgba(255,153,19,0.4)] transition"
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="mt-4 flex gap-3">
        <button
          onClick={fetchHistoricalData}
          disabled={loading}
          className="rounded-xl border border-[#F5880D]/50 bg-[#F57A0D] px-5 py-2 text-sm text-black 
              hover:bg-[#FF7A00] hover:shadow-[0_0_15px_2px_rgba(255,153,19,0.5)] 
              transition-all duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Loading..." : "Load history"}
        </button>

        {!autoMode && (
          <button
            onClick={resetToAuto}
            className="rounded-xl border border-[#F5880D]/50 bg-[#F57A0D] px-5 py-2 text-sm text-black 
                hover:bg-[#FF7A00] hover:shadow-[0_0_15px_2px_rgba(255,153,19,0.5)] 
                transition-all duration-300 ease-in-out"
          >
            Set default time
          </button>
        )}
      </div>
    </div>
        </Svg>
          {/* Chart Section */}
        {/* Chart Section */}
        {showHistoryChart && historyData.length > 0 && (
          <div
            className="relative mt-3 h-[500px] rounded-3xl bg-black
                          border border-[#FF9913]/30 shadow-[0_0_25px_rgba(255,153,19,0.3)]
                          backdrop-blur-xl overflow-hidden"
          >
            {/* --- Glow Background --- */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,#FF991322,transparent_60%),
                                                radial-gradient(circle_at_bottom_right,#FF991322,transparent_60%)] animate-pulse"></div>
            {/* --- 📱 Mobile: Dropdown --- */}
            <div className="md:hidden p-3 relative z-20">
              <div
                onClick={() => setShowMetrics1(!showMetrics1)}
                className="w-full flex items-center justify-between px-3 py-2 
                          bg-black text-white rounded-lg shadow-md 
                          border border-[#FF9913]/30 text-sm font-medium cursor-pointer"
              >
                Select parameters to be shown on graph.
                <span>{showMetrics1 ? "▲" : "▼"}</span>
              </div>

              {showMetrics1 && (
                <div className="mt-2 bg-black border border-[#FF9913]/30 
                                rounded-xl p-3 space-y-2 shadow-lg max-h-60 overflow-y-auto">
                  {metricOptions1.map((opt) => (
                    <label
                      key={opt.key}
                      className="flex items-center gap-2 text-sm text-white cursor-pointer hover:text-[#FF9913] transition"
                    >
                      <input
                        type="checkbox"
                        checked={metricsSelected1.includes(opt.key)}
                        onChange={() => handleMetricChange1(opt.key)}
                        className="accent-[#FF9913]"
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
                <ResponsiveContainer
                  width="100%"
                  height={window.innerWidth < 768 ? 360 : 420}
                >
                  <LineChart
                    data={processedData1}
                    margin={{
                      top: 10,
                      right: 10,
                      bottom: window.innerWidth < 768 ? 50 : 20,
                      left: 0,
                    }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="#33415540"
                      vertical={false}
                    />

                    <XAxis
                      dataKey="time"
                      tick={{
                        fill: "#ffffff",
                        fontSize: window.innerWidth < 768 ? 9 : 11,
                        fontWeight: 500,
                      }}
                      tickLine={false}
                      axisLine={{ stroke: "#fffbf7ff" }}
                      padding={{ left: 5, right: 5 }}
                      interval="preserveStartEnd"
                      tickFormatter={(value) => {
                        const date = new Date(value);
                        return `${date
                          .getHours()
                          .toString()
                          .padStart(2, "0")}:${date
                          .getMinutes()
                          .toString()
                          .padStart(2, "0")}`;
                      }}
                      angle={window.innerWidth < 768 ? -30 : 0}
                      textAnchor={window.innerWidth < 768 ? "end" : "middle"}
                      height={window.innerWidth < 768 ? 45 : 30}
                    />
                    <YAxis
                      tick={{
                        fill: "#ffffff",
                        fontSize: window.innerWidth < 768 ? 9 : 11,
                        fontWeight: 500,
                      }}
                      width={window.innerWidth < 768 ? 35 : 50}
                      tickLine={false}
                      axisLine={{ stroke: "#fcfffcff" }}
                      domain={["auto", "auto"]}
                    />

                    <ReferenceLine
                      y={0}
                      stroke="#ffffffff"
                      strokeDasharray="6 3"
                      strokeWidth={1.2}
                    />

                       <Tooltip
                itemStyle={{ fontWeight: 500 }}
                contentStyle={{
                  backgroundColor: "#000000",
                  border: "1px solid #FF9913",
                  borderRadius: "0.75rem",
                  padding: "6px 10px",
                  fontSize: window.innerWidth < 768 ? "10px" : "11px",
                  boxShadow: "0 0 15px #FF991355",
                }}
                formatter={(value, name, props) => {
                  const color = props.color || "#f1f5f9";
                  return [
                    <span style={{ color, fontWeight: 600 }}>{value}</span>,
                    name,
                  ];
                }}
              labelFormatter={(label, payload) => {
                if (payload && payload.length > 0) {
                  const { tripkm } = payload[0].payload;
              
                  const date = new Date(label);
                  const formatted =
                    `${date.getFullYear()}:` +
                    `${String(date.getMonth() + 1).padStart(2, "0")}:` +
                    `${String(date.getDate()).padStart(2, "0")} ` +
                    `${String(date.getHours()).padStart(2, "0")}:` +
                    `${String(date.getMinutes()).padStart(2, "0")}:` +
                    `${String(date.getSeconds()).padStart(2, "0")}`;
              
                  return (
                    <div>
                      <div>{formatted}</div>
                      <div style={{ color: "#FFD700", fontWeight: "bold" }}>
                        Trip (km): {tripkm ?? "N/A"}
                      </div>
                     
                    </div>
                  );
                }
                return label;
              }}
              />
                    <Legend
                      wrapperStyle={{
                        color: "#ffffff",
                        fontSize: window.innerWidth < 768 ? 10 : 12,
                        fontWeight: 600,
                      }}
                      iconType="circle"
                    />
                    {/* --- Dynamic Lines --- */}
                    {metricOptions1
                      .filter((opt) => metricsSelected1.includes(opt.key))
                      .map((opt) => (
                        <Line
                          key={opt.key}
                          type="monotone"
                          dataKey={opt.key}
                          name={opt.label}
                          stroke={opt.color}
                          strokeWidth={1.8}
                          dot={false}
                          isAnimationActive={false}
                          connectNulls
                        />
                      ))}
                  </LineChart>
                </ResponsiveContainer>
              </div>
              {/* --- 💻 Desktop: Sidebar --- */}
               <div className="hidden md:flex border-l border-[#FF9913]/20 bg-black backdrop-blur-md p-4 flex-col h-[500px]">
        <h3 className="text-sm font-semibold text-white mb-4 tracking-wide border-b border-[#FF9913]/30 pb-1">
          Select parameters to be shown on graph.
        </h3>
          <div className="flex flex-col gap-2 overflow-y-auto pr-2">
                  {metricOptions1.map((opt) => (
                    <label
                      key={opt.key}
                      className="flex items-center gap-2 text-sm text-white cursor-pointer hover:text-[#FF9913] transition"
                    >
                      <input
                        type="checkbox"
                        checked={metricsSelected1.includes(opt.key)}
                        onChange={() => handleMetricChange1(opt.key)}
                        className="accent-[#FF9913]"
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
                        bg-[#F61111] hover:bg-[#FF4500] 
                        text-white text-sm font-Kanit 
                        rounded-lg shadow-md border border-[#F61111]
                        backdrop-blur-sm
                        transition-all duration-300 ease-in-out
                        hover:scale-105"
            >
              Close
            </button>
          </div>
        )}
        </div>
</div>
  </>
  )}

  <footer className="mx-auto  px-4 py-6 text-center text-xs text-white/50">
                VIN: {(latest?.vinnumber || latest?.vinNumber || vin) || "N/A"} •{" "}
                {mode === "realtime" ? "Live" : "History"}
              </footer>
              </main>
              
              </div>
              </div>
              
            </div>
            
          );
        }
        