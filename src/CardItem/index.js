import { useEffect, useState } from "react";

// Hook: convert lat,long → human-readable address
function useAddress(latLong) {
  const [address, setAddress] = useState("Fetching...");

  useEffect(() => {
    if (!latLong) return;
    const [lat, lon] = latLong.split(",");

    fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`)
      .then((res) => res.json())
      .then((data) => {
        setAddress(
          data?.address?.city ||
            data?.address?.town ||
            data?.address?.village ||
            data?.address?.state ||
            data?.display_name ||
            "Unknown"
        );
      })
      .catch(() => setAddress("Unknown"));
  }, [latLong]);

  return address;
}

export default function CardItem({ t, srcObj }) {
  const raw = srcObj?.[t.key];
  let val = raw === null || raw === undefined || raw === "" ? "N/A" : raw;
  let color = "text-white";
  let icon = "";

  // Charging state
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

  // Handle lock state
  if (t.key === "handlelockstate") {
    if (Number(raw) === 1) {
      val = "Handle Locked";
      color = "text-red-400";
      icon = "🔒";
    } else if (Number(raw) === 0) {
      val = "Handle Unlocked";
      color = "text-green-400";
      icon = "🔓";
    }
  }

  // Seat lock state
  if (t.key === "seatlockstate") {
    if (Number(raw) === 1) {
      val = "Seat Locked";
      color = "text-red-400";
      icon = "🔒";
    } else if (Number(raw) === 0) {
      val = "Seat Unlocked";
      color = "text-green-400";
      icon = "✅";
    }
  }

  // ✅ Location → human-readable
  if (t.key === "lat_long" && raw) {
    val = useAddress(raw);
  }

  return (
    <div
      key={t.key}
      className={`rounded-lg border border-white/10 bg-slate-800/70 p-3 shadow-sm flex flex-col items-center text-center
        ${t.key === "lat_long" ? "sm:col-span-2 md:col-span-3" : ""}`}
    >
      {/* Label */}
      <p className="text-[11px] tracking-wide text-white/60 mb-1">{t.label}</p>
      {/* Value + Icon */}
      <div className={`flex flex-col items-center text-xs font-semibold ${color}`}>
        {icon && <span className="text-base">{icon}</span>}
        <span className="text-xm md:text-xm truncate">{val}</span>
      </div>
    </div>
  );
}
