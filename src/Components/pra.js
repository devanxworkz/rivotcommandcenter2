// // // export default function VehicleInfoCard({ details }) {
// // //   return (
// // //     <div
// // //       style={{
// // //         background: "rgba(17, 25, 40, 0.85)",
// // //         border: "1px solid rgba(255, 255, 255, 0.15)",
// // //         borderRadius: "12px",
// // //         padding: "16px",
// // //         color: "#fff",
// // //         fontFamily: "'Segoe UI', sans-serif",
// // //         backdropFilter: "blur(8px)",
// // //         display: "flex",
// // //         flexDirection: "column",
// // //         gap: "12px",
// // //       }}
// // //     >
// // //       {/* Header */}
// // //       <h3
// // //         style={{
// // //           fontSize: "14px",
// // //           fontWeight: 700,
// // //           opacity: 0.8,
// // //           margin: "0 0 8px",
// // //           letterSpacing: "0.5px",
// // //         }}
// // //       >
// // //         VEHICLE INFO
// // //       </h3>

// // //       {/* Info Grid */}
// // //       <div
// // //         style={{
// // //           display: "grid",
// // //           gridTemplateColumns: "repeat(2, 1fr)",
// // //           gap: "12px",
// // //         }}
// // //       >
// // //         {/* VIN Number */}
// // //         <div
// // //           style={{
// // //             border: "1px solid rgba(255, 255, 255, 0.15)",
// // //             borderRadius: "8px",
// // //             padding: "10px",
// // //             background: "rgba(255,255,255,0.02)",
// // //           }}
// // //         >
// // //           <p style={{ fontSize: "12px", opacity: 0.7, margin: 0 }}>VIN NUMBER</p>
// // //           <p style={{ fontWeight: "bold", fontSize: "15px", margin: "4px 0 0" }}>
// // //             {details?.vinnumber || "N/A"}
// // //           </p>
// // //         </div>

// // //         {/* Model */}
// // //         <div
// // //           style={{
// // //             border: "1px solid rgba(255, 255, 255, 0.15)",
// // //             borderRadius: "8px",
// // //             padding: "10px",
// // //             background: "rgba(255,255,255,0.02)",
// // //           }}
// // //         >
// // //           <p style={{ fontSize: "12px", opacity: 0.7, margin: 0 }}>MODEL</p>
// // //           <p style={{ fontWeight: "bold", fontSize: "15px", margin: "4px 0 0" }}>
// // //             {details?.model || "N/A"}
// // //           </p>
// // //         </div>

// // //         {/* Owner Name */}
// // //         <div
// // //           style={{
// // //             border: "1px solid rgba(255, 255, 255, 0.15)",
// // //             borderRadius: "8px",
// // //             padding: "10px",
// // //             background: "rgba(255,255,255,0.02)",
// // //           }}
// // //         >
// // //           <p style={{ fontSize: "12px", opacity: 0.7, margin: 0 }}>OWNER NAME</p>
// // //           <p style={{ fontWeight: "bold", fontSize: "15px", margin: "4px 0 0" }}>
// // //             {details?.ownerName || details?.ownername || "N/A"}
// // //           </p>
// // //         </div>

// // //         {/* Phone Number */}
// // //         <div
// // //           style={{
// // //             border: "1px solid rgba(255, 255, 255, 0.15)",
// // //             borderRadius: "8px",
// // //             padding: "10px",
// // //             background: "rgba(255,255,255,0.02)",
// // //           }}
// // //         >
// // //           <p style={{ fontSize: "12px", opacity: 0.7, margin: 0 }}>PHONE NUMBER</p>
// // //           <p style={{ fontWeight: "bold", fontSize: "15px", margin: "4px 0 0" }}>
// // //             {details?.phoneNumber || details?.phonenumber || "N/A"}
// // //           </p>
// // //         </div>
// // //       </div>
// // //     </div>
// // //   );
// // // }

















// // // export default function VehicleInfoPanel({ details }) {
// // //   return (
// // //     <div
// // //       style={{
// // //         display: "flex",
// // //         gap: "16px",
// // //         flexWrap: "wrap", // makes it stack on small screens
// // //         fontFamily: "'Segoe UI', sans-serif",
// // //       }}
// // //     >
// // //       {/* Left Card - Basic Info */}
// // //       <div
// // //         style={{
// // //           flex: "1",
// // //           minWidth: "300px",
// // //           background: "rgba(17, 25, 40, 0.85)",
// // //           border: "2px solid rgba(0, 224, 255, 0.6)",
// // //           borderRadius: "12px",
// // //           padding: "16px",
// // //           color: "#fff",
// // //           boxShadow: "0 0 12px rgba(0,224,255,0.3)",
// // //           backdropFilter: "blur(8px)",
// // //         }}
// // //       >
// // //         <h3
// // //           style={{
// // //             fontSize: "14px",
// // //             fontWeight: 700,
// // //             color: "#00E0FF",
// // //             margin: "0 0 12px",
// // //             letterSpacing: "0.5px",
// // //           }}
// // //         >
// // //           VEHICLE INFO
// // //         </h3>

// // //         <div
// // //           style={{
// // //             display: "grid",
// // //             gridTemplateColumns: "repeat(2, 1fr)",
// // //             gap: "12px",
// // //           }}
// // //         >
// // //           {[
// // //             { label: "VIN NUMBER", value: details?.vinnumber },
// // //             { label: "MODEL", value: details?.model },
// // //             { label: "OWNER NAME", value: details?.ownerName || details?.ownername },
// // //             { label: "PHONE NUMBER", value: details?.phoneNumber || details?.phonenumber },
// // //           ].map((item, i) => (
// // //             <div
// // //               key={i}
// // //               style={{
// // //                 border: "2px solid rgba(0, 224, 255, 0.6)",
// // //                 borderRadius: "8px",
// // //                 padding: "10px",
// // //                 background: "rgba(255,255,255,0.03)",
// // //                 boxShadow: "0 0 6px rgba(0,224,255,0.2)",
// // //               }}
// // //             >
// // //               <p style={{ fontSize: "12px", opacity: 0.7, margin: 0 }}>{item.label}</p>
// // //               <p style={{ fontWeight: "bold", fontSize: "15px", margin: "4px 0 0" }}>
// // //                 {item.value || "N/A"}
// // //               </p>
// // //             </div>
// // //           ))}
// // //         </div>
// // //       </div>

// // //       {/* Right Card - More Details */}
// // //       <div
// // //         style={{
// // //           flex: "1",
// // //           minWidth: "300px",
// // //           background: "rgba(17, 25, 40, 0.85)",
// // //           border: "2px solid rgba(0, 224, 255, 0.6)",
// // //           borderRadius: "12px",
// // //           padding: "16px",
// // //           color: "#fff",
// // //           boxShadow: "0 0 12px rgba(0,224,255,0.3)",
// // //           backdropFilter: "blur(8px)",
// // //         }}
// // //       >
// // //         <h3
// // //           style={{
// // //             fontSize: "14px",
// // //             fontWeight: 700,
// // //             color: "#00E0FF",
// // //             margin: "0 0 12px",
// // //             letterSpacing: "0.5px",
// // //           }}
// // //         >
// // //           MORE DETAILS
// // //         </h3>

// // //         <div
// // //           style={{
// // //             display: "grid",
// // //             gridTemplateColumns: "repeat(2, 1fr)",
// // //             gap: "12px",
// // //           }}
// // //         >
// // //           {[
// // //             { label: "CONTROLLER ID", value: details?.controlerid },
// // //             { label: "MOTOR ID", value: details?.motorid },
// // //             { label: "BMS ID", value: details?.bmsid },
// // //             { label: "CHARGED", value: details?.charged },
// // //             { label: "RIDE OS VERSION", value: details?.rideosversion },
// // //             { label: "SMART KEY ID", value: details?.smartkeyid },
// // //           ].map((item, i) => (
// // //             <div
// // //               key={i}
// // //               style={{
// // //                 border: "2px solid rgba(0, 224, 255, 0.6)",
// // //                 borderRadius: "8px",
// // //                 padding: "10px",
// // //                 background: "rgba(255,255,255,0.03)",
// // //                 boxShadow: "0 0 6px rgba(0,224,255,0.2)",
// // //               }}
// // //             >
// // //               <p style={{ fontSize: "12px", opacity: 0.7, margin: 0 }}>{item.label}</p>
// // //               <p style={{ fontWeight: "bold", fontSize: "15px", margin: "4px 0 0" }}>
// // //                 {item.value || "N/A"}
// // //               </p>
// // //             </div>
// // //           ))}
// // //         </div>
// // //       </div>
// // //     </div>
// // //   );
// // // }













// // // <div
// // //   style={{
// // //     flex: "1",
// // //     minWidth: "300px",
// // //     background: "linear-gradient(145deg, rgba(20, 28, 45, 0.95), rgba(10, 15, 25, 0.95))",
// // //     borderRadius: "14px",
// // //     padding: "20px",
// // //     color: "#EAFBFF",
// // //     boxShadow: "inset 0 1px 0 rgba(255,255,255,0.05), 0 4px 20px rgba(0, 224, 255, 0.05)",
// // //     border: "1px solid rgba(255,255,255,0.08)",
// // //     backdropFilter: "blur(8px)",
// // //   }}
// // // >
// // //   <div style={{ marginBottom: "14px" }}>
// // //     <p style={{
// // //       fontSize: "12px",
// // //       textTransform: "uppercase",
// // //       opacity: 0.8,
// // //       margin: 0,
// // //       letterSpacing: "1px",
// // //     }}>VIN NUMBER</p>
// // //     <p style={{
// // //       fontSize: "20px",
// // //       fontWeight: 600,
// // //       margin: "2px 0 0",
// // //       letterSpacing: "1px",
// // //       color: "#fff"
// // //     }}>LN2V4J3K5678</p>
// // //   </div>

// // //   <div style={{
// // //     display: "grid",
// // //     gridTemplateColumns: "1fr 1fr",
// // //     gap: "10px"
// // //   }}>
// // //     <div>
// // //       <p style={{
// // //         fontSize: "12px",
// // //         textTransform: "uppercase",
// // //         opacity: 0.8,
// // //         margin: 0,
// // //         letterSpacing: "1px",
// // //       }}>MODEL</p>
// // //       <p style={{
// // //         fontSize: "16px",
// // //         fontWeight: 500,
// // //         margin: "2px 0 0",
// // //         color: "#fff"
// // //       }}>E-Scooter X</p>
// // //     </div>
// // //     <div>
// // //       <p style={{
// // //         fontSize: "12px",
// // //         textTransform: "uppercase",
// // //         opacity: 0.8,
// // //         margin: 0,
// // //         letterSpacing: "1px",
// // //       }}>OWNER NAME</p>
// // //       <p style={{
// // //         fontSize: "16px",
// // //         fontWeight: 500,
// // //         margin: "2px 0 0",
// // //         color: "#fff"
// // //       }}>John Doe</p>
// // //     </div>
// // //   </div>
// // // </div>












// // <div
// //   style={{
// //     display: "flex",
// //     gap: "20px",
// //     flexWrap: "wrap",
// //     fontFamily: "'Segoe UI', sans-serif",
// //   }}
// // >
// //   {/* Card Wrapper */}
// //   {[
// //     {
// //       title: "VEHICLE INFO",
// //       items: [
// //         { label: "VIN NUMBER", value: details?.vinnumber || "N/A" },
// //         { label: "MODEL", value: details?.model || "N/A" },
// //         { label: "OWNER NAME", value: details?.ownerName || details?.ownername || "N/A" },
// //         { label: "PHONE NUMBER", value: details?.phoneNumber || details?.phonenumber || "N/A" },
// //       ],
// //     },
// //     {
// //       title: "MORE DETAILS",
// //       items: [
// //         { label: "CONTROLLER ID", value: details?.controlerid || "N/A" },
// //         { label: "MOTOR ID", value: details?.motorid || "N/A" },
// //         { label: "BMS ID", value: details?.bmsid || "N/A" },
// //         { label: "CHARGED", value: details?.charged || "N/A" },
// //         { label: "RIDE OS VERSION", value: details?.rideosversion || "N/A" },
// //         { label: "SMART KEY ID", value: details?.smartkeyid || "N/A" },
// //       ],
// //     },
// //   ].map((card, idx) => (
// //     <div
// //       key={idx}
// //       style={{
// //         flex: "1",
// //         minWidth: "300px",
// //         background: "rgba(15, 20, 30, 0.85)",
// //         borderRadius: "14px",
// //         padding: "20px",
// //         color: "#E6F7FF",
// //         boxShadow: "inset 0 1px 2px rgba(255,255,255,0.05), 0 4px 12px rgba(0, 224, 255, 0.15)",
// //         backdropFilter: "blur(10px)",
// //       }}
// //     >
// //       <h3
// //         style={{
// //           fontSize: "14px",
// //           fontWeight: 700,
// //           color: "#8EEBFF",
// //           margin: "0 0 14px",
// //           letterSpacing: "0.5px",
// //         }}
// //       >
// //         {card.title}
// //       </h3>

// //       <div
// //         style={{
// //           display: "grid",
// //           gridTemplateColumns: "repeat(2, 1fr)",
// //           gap: "14px",
// //         }}
// //       >
// //         {card.items.map((item, i) => (
// //           <div
// //             key={i}
// //             style={{
// //               background: "rgba(255,255,255,0.02)",
// //               borderRadius: "10px",
// //               padding: "12px",
// //               boxShadow:
// //                 "inset 0 1px 2px rgba(255,255,255,0.05), inset 0 -1px 3px rgba(0,0,0,0.6), 0 0 8px rgba(0,224,255,0.12)",
// //               border: "1px solid rgba(255,255,255,0.06)",
// //             }}
// //           >
// //             <p
// //               style={{
// //                 fontSize: "11px",
// //                 textTransform: "uppercase",
// //                 letterSpacing: "0.5px",
// //                 opacity: 0.7,
// //                 margin: 0,
// //               }}
// //             >
// //               {item.label}
// //             </p>
// //             <p
// //               style={{
// //                 fontSize: "15px",
// //                 fontWeight: 600,
// //                 margin: "4px 0 0",
// //               }}
// //             >
// //               {item.value}
// //             </p>
// //           </div>
// //         ))}
// //       </div>
// //     </div>
// //   ))}
// // </div>


// const

// <div class="temp-card">
//   <div class="temp-header">TEMPERATURE</div>
//   <div class="temp-content">
//     <div class="temp-icon">
//       <!-- Thermometer SVG -->
//       <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="none" stroke="#00e0ff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
//         <path d="M14 14a4 4 0 0 1 8 0v9.29a7 7 0 1 1-8 0z"/>
//       </svg>
//     </div>
//     <div class="temp-value">
//       22<span class="temp-unit">°C</span>
//     </div>
//   </div>
// </div>








const MiniTempChart = ({ data, dataKey, label, color }) => {
  const latestValue = data?.length ? data[data.length - 1][dataKey] : null;

  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-3">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold text-white/80">{label}</span>
        <span className="text-sm font-bold text-cyan-300">
          {latestValue !== null && latestValue !== undefined
            ? Number(latestValue).toFixed(1)
            : "N/A"}
        </span>
      </div>
      <ResponsiveContainer width="100%" height={100}>
        <LineChart data={data}>
          <XAxis dataKey="time" hide />
          <YAxis hide domain={["auto", "auto"]} />
          <Tooltip
            labelFormatter={(time) => new Date(time).toLocaleTimeString()}
          />
          <Line
            type="monotone"
            dataKey={dataKey}
            stroke={color}
            dot={false}
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
