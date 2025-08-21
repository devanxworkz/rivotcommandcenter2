// GaugeCards.jsx
export default function TGaugeCards({ label, value, unit, color }) {
  return (
    <div style={{
      background: "rgba(15, 20, 30, 0.95)",
      border: `2px solid ${color}40`,
      borderRadius: "16px",
      padding: "20px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      boxShadow: `inset 0 0 8px ${color}30, 0 0 12px ${color}30`,
      minWidth: "200px"
    }}>
      <div style={{
        fontSize: "14px",
        letterSpacing: "2px",
        color: color,
        marginBottom: "16px"
      }}>
        {label.toUpperCase()}
      </div>
      <div style={{
        display: "flex",
        alignItems: "flex-start",
        gap: "4px",
        color: color,
        fontSize: "40px",
        fontWeight: "bold"
      }}>
        {value}
        <span style={{
          fontSize: "20px",
          opacity: 0.8
        }}>
          {unit}
        </span>
      </div>
    </div>
  );
}
