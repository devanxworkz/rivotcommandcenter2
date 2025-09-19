import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

const [details, setDetails] = useState([]);
 const [vin, setVin] = useState(initialVin || "");
          const [vinList, setVinList] = useState([]);
          const [data, setData] = useState([]);
          const [mode, setMode] = useState("realtime");
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

// ✅ Marker Icon
const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

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
                        // console.log("Fetched JSON:", json);
                        setDetails(json?.data || {}); // <-- pick the data object
                      } catch (e) {
                        console.error("Vehicle details error", e);
                        setDetails({});
                      }
                    };
          
                    fetchDetails();
                  }, [vin]);

export default function LocationCard({ details }) {
  // ✅ Extract lat/lng from DB string "12.9716,77.5946"
  const rawLocation = details?.lat_long || "";
  let lat = null,
    lng = null;

  if (rawLocation && rawLocation.includes(",")) {
    const [latStr, lngStr] = rawLocation.split(",");
    lat = parseFloat(latStr);
    lng = parseFloat(lngStr);
  }

  return (
    <div className="rounded-lg border border-white/10 bg-slate-800/70 p-3 shadow-sm flex flex-col items-center text-center sm:col-span-2 md:col-span-3">
      <p className="text-[11px] tracking-wide text-white/60 mb-2">Location</p>

      {lat && lng ? (
        <div className="w-full h-[200px] rounded-xl overflow-hidden">
          {/* ✅ Adding key forces React to re-mount instead of reusing */}
          <MapContainer
            key={`${lat}-${lng}`}
            center={[lat, lng]}
            zoom={15}
            scrollWheelZoom={false}
            className="w-full h-full"
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="&copy; OpenStreetMap contributors"
            />
            <Marker position={[lat, lng]} icon={markerIcon}>
              <Popup>
                Vehicle Location <br /> {lat.toFixed(5)}, {lng.toFixed(5)}
              </Popup>
            </Marker>
          </MapContainer>
        </div>
      ) : (
        <p className="text-gray-400 text-xs">Location not available</p>
      )}
    </div>
  );
}
