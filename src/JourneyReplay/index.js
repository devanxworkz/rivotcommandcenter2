// import React, { useEffect, useRef, useState } from "react";
// import { MapContainer, TileLayer, Polyline, Marker, Popup } from "react-leaflet";
// import L from "leaflet";

// // 🚗 Custom icon
// const carIcon = new L.Icon({
//   iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
//   iconSize: [30, 30],
// });

// export default function JourneyReplay() {
//   const route = [
//     [12.9716, 77.5946],
//     [12.9750, 77.6000],
//     [12.9780, 77.6050],
//     [12.9820, 77.6100],
//   ];

//   const [position, setPosition] = useState(route[0]);
//   const indexRef = useRef(0);

//   useEffect(() => {
//     let animation;
//     function animate() {
//       if (indexRef.current < route.length) {
//         setPosition(route[indexRef.current]);
//         indexRef.current++;
//         animation = setTimeout(animate, 1000);
//       }
//     }
//     animate();
//     return () => clearTimeout(animation);
//   }, [route]);

//   return (
//     <MapContainer
//       center={route[0]}
//       zoom={14}
//       style={{ height: "100vh", width: "100%" }}
//       scrollWheelZoom={false}
//     >
//       <TileLayer
//         url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//         attribution="&copy; OpenStreetMap contributors"
//       />

//       {/* Route line */}
//       <Polyline positions={route} color="blue" />

//       {/* Moving marker */}
//       <Marker position={position} icon={carIcon}>
//         <Popup>Journey Replay 🚗</Popup>
//       </Marker>
//     </MapContainer>
//   );
// }









import React, { useEffect, useState } from 'react';

// -----------------------------
// Single-file example: RealtimeChart with Sidebar
// Replace placeholders with your actual chart/gauge/table components
// -----------------------------

const Sidebar = ({ currentView, onSelect }) => {
  const items = [
    { id: 'home', label: 'Home' },
    { id: 'graphs', label: 'Graphs' },
    { id: 'gauges', label: 'Gauges' },
    { id: 'table', label: 'Table' },
  ];

  return (
    <aside className="w-64 min-w-[220px] bg-neutral-950 text-white p-4">
      <h2 className="text-lg font-semibold mb-4">Dashboard</h2>
      <nav>
        <ul className="space-y-2">
          {items.map((it) => (
            <li key={it.id}>
              <button
                type="button"
                onClick={() => onSelect(it.id)}
                className={`w-full text-left px-3 py-2 rounded-md transition-colors duration-150 focus:outline-none ${
                  currentView === it.id ? 'bg-orange-500 text-white' : 'hover:bg-white/5'
                }`}
                aria-current={currentView === it.id}
              >
                {it.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

// Placeholder large graph — replace with your chart (e.g. <LineChart data={...} />)
const LargeGraph = ({ title = 'Graph placeholder' }) => (
  <div className="w-full h-[420px] rounded-xl bg-black border border-white/10 flex items-center justify-center">
    <span className="text-white/50">{title} — replace this with your chart component</span>
  </div>
);

// Placeholder gauges grid
const Gauges = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
    {[1, 2, 3].map((i) => (
      <div key={i} className="p-4 rounded-xl bg-neutral-900 border border-white/10">
        <div className="text-sm text-white/60">Gauge {i}</div>
        <div className="mt-4 h-28 flex items-center justify-center">Gauge placeholder</div>
      </div>
    ))}
  </div>
);

// Placeholder static table — replace with your actual table component
const StaticTable = () => (
  <div className="overflow-auto rounded-xl border border-white/10 bg-neutral-900 p-4">
    <table className="w-full text-sm text-left">
      <thead>
        <tr>
          <th className="py-2">Time</th>
          <th className="py-2">Speed</th>
          <th className="py-2">SOC</th>
        </tr>
      </thead>
      <tbody>
        {[1, 2, 3].map((i) => (
          <tr key={i} className="odd:bg-white/2">
            <td className="py-2">2025-09-09 12:3{i}:00</td>
            <td className="py-2">{10 * i}</td>
            <td className="py-2">{80 - i}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

// -----------------------------
// Parent page/component
// -----------------------------
export default function RealtimeChartWithSidebar() {
  // Persist last-view in localStorage so the user returns to the same tab
  const [view, setView] = useState(() => localStorage.getItem('dashboardView') || 'home');

  useEffect(() => {
    localStorage.setItem('dashboardView', view);
  }, [view]);

  return (
    <div className="flex h-screen bg-neutral-800 text-white">
      <Sidebar currentView={view} onSelect={setView} />

      <main className="flex-1 p-6 overflow-auto">
        {/* HOME: show everything (graphs + gauges + static data) */}
        {view === 'home' && (
          <div className="space-y-6">
            <LargeGraph title="Main graph (home view)" />
            <Gauges />
            <StaticTable />
          </div>
        )}

        {/* GRAPHS: show only the large graph (full width) */}
        {view === 'graphs' && (
          <div>
            <LargeGraph title="Graphs only (full width)" />
          </div>
        )}

        {/* GAUGES: show only the gauges */}
        {view === 'gauges' && (
          <div>
            <Gauges />
          </div>
        )}

        {/* TABLE: show only the static table */}
        {view === 'table' && (
          <div>
            <StaticTable />
          </div>
        )}
      </main>
    </div>
  );
}

/*
  Integration notes:
  - If your Sidebar is already in its own file, modify it to accept `currentView` and `onSelect` (or `onChange`) props.
  - Replace LargeGraph/Gauges/StaticTable placeholders with your real components (keep the conditional rendering logic).
  - If you prefer route-based navigation, set view from the URL (React Router) instead of local state.
  - For heavy charts, consider React.lazy + Suspense to improve initial load.
*/




{/* <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mt-3 overflow-auto">
  
  <StatCard
    label="VIN-Number"
    value={details?.vinnumber || details?.vinNumber || vin || "N/A"}
    icon={CreditCard}
  />

  <StatCard
    label="Owner"
    value={details?.ownerName || details?.ownername || "N/A"}
    icon={User}
  />
  <StatCard
    label="Phone"
    value={details?.phoneNumber || details?.phonenumber || "N/A"}
    icon={Phone}
  />
  <StatCard
    label="Model"
    value={details?.model || "N/A"}
    icon={Car}
  /> */}
  {/* <StatCard
  label="Location"
  value={
    details?.lat_long
      ? (() => {
          const [lat, lng] = details.lat_long
            .split(",")
            .map((n) => parseFloat(n.trim()));
          if (!isNaN(lat) && !isNaN(lng)) {
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

            return (
              <div className="flex flex-col items-center space-y-1">
                <span className="text-xs md:text-sm text-blue-300">
                  {locationName || `${lat.toFixed(5)}, ${lng.toFixed(5)}`}
                </span>

                <a
                  href={`https://www.google.com/maps?q=${lat},${lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[10px] text-blue-500 underline hover:text-blue-400"
                >
                  View on map
                </a>

                <span className="text-[11px] text-white/70">
                  {lat.toFixed(6)}, {lng.toFixed(6)}
                </span>

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
  icon={MapPin}
/> */}


        {/* <StatCard
    label="rideOS version"
    value={details?.rideosversion || "N/A"} 
    icon={User}
  /> */}
{/* </div> */}