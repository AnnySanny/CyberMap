import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import CyberScene from "../components/CyberScene";
import { getIncidents } from "../api/incidents";

const LIMIT_OPTIONS = [10, 30, 50, 100, 200, 300, 500];

export default function Map() {
  const [incidents, setIncidents] = useState([]);
  const [selected, setSelected] = useState(null);
  const [activeFilter, setActiveFilter] = useState("all");
  const [limit, setLimit] = useState(50); // default

useEffect(() => {
  getIncidents(limit).then(data => setIncidents(data));
}, [limit]);


const clusterList = useMemo(() => {
  const base =
    limit === "all" ? incidents : incidents.slice(0, limit);

  return [...new Set(base.map(i => i.cluster))].sort((a, b) => a - b);
}, [incidents, limit]);


const clusterDescriptions = useMemo(() => {
  const map = {};

  incidents.forEach(i => {
    if (!map[i.cluster]) map[i.cluster] = [];
    map[i.cluster].push(i);
  });

  Object.keys(map).forEach(k => {
    const types = [...new Set(map[k].map(i => i.type))].slice(0, 3);
    map[k] = `Переважно: ${types.join(", ")}`;
  });

  return map;
}, [incidents]);

const visibleIncidents = useMemo(() => {
  const limited =
    limit === "all" ? incidents : incidents.slice(0, limit);

  if (activeFilter === "all") return limited;

  return limited.filter(i => i.cluster === activeFilter);
}, [incidents, activeFilter, limit]);

  return (
    <div style={{ width: "100%", height: "100vh", position: "relative" }}>

      {/* ===== TOP PANEL ===== */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: "95%",
          padding: "10px 20px",
          background: "rgba(10,15,25,0.55)",
          backdropFilter: "blur(6px)",
          borderBottom: "1px solid #1d2533",
          borderRadius: "0 0 10px 10px",
          color: "white",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          zIndex: 10,
          gap: "20px"
        }}
      >
        {/* TITLE */}
        <div>
          <h3 style={{ margin: 0, fontSize: "20px", fontWeight: "bold" }}>
            CyberMap – Інтерактивна 3D Мапа Кіберінцидентів
          </h3>
          <p style={{ margin: 0, opacity: 0.7, fontSize: "13px" }}>
            Сфери — інциденти · Колір — кластер · Розмір — severity
          </p>
        </div>

        {/* LEGEND */}
        <div style={{ display: "flex", gap: "16px" }}>
          {clusterList.slice(0, 4).map((c) => (
            <div key={c} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <div
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: "50%",
                  background: ["#ff4444", "#44ff44", "#4444ff", "#ffaa00"][c % 4]
                }}
              />
<span style={{ fontSize: "12px", opacity: 0.85 }}>
  Кластер {c}
</span>
<div style={{ fontSize: "11px", opacity: 0.6 }}>
  {clusterDescriptions[c]}
</div>
            </div>
          ))}
        </div>

        {/* CONTROLS */}
        <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
          
          {/* CLUSTER FILTER */}
          <div style={{ display: "flex", gap: "6px" }}>
            <button
              onClick={() => {
                setSelected(null);
                setActiveFilter("all");
              }}
              style={filterBtnStyle(activeFilter === "all")}
            >
              Усі
            </button>

            {clusterList.length <= 8 &&
              clusterList.map((c) => (
                <button
                  key={c}
                  onClick={() => {
                    setSelected(null);
                    setActiveFilter(c);
                  }}
                  style={filterBtnStyle(activeFilter === c)}
                >
                  C{c}
                </button>
              ))}
          </div>

          {/* LIMIT */}
          <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
            <span style={{ fontSize: "12px", opacity: 0.7 }}>Показати:</span>

            {LIMIT_OPTIONS.map(n => (
              <button
                key={n}
                onClick={() => {
                  setSelected(null);
                  setLimit(n);
                }}
                style={limitBtnStyle(limit === n)}
              >
                {n}
              </button>
            ))}

            <button
              onClick={() => setLimit("all")}
              style={limitBtnStyle(limit === "all", true)}
            >
              Усі
            </button>
          </div>
        </div>
      </div>

      {/* ===== 3D SCENE ===== */}
      <CyberScene
        incidents={visibleIncidents}
        onSelect={setSelected}
        selectedId={selected?.id || null}
      />

      {/* ===== SIDEBAR ===== */}
      {selected && (
        <div
          style={{
            position: "absolute",
            left: 0,
            top: "80px",
            width: "320px",
            height: "calc(100% - 80px)",
            background: "rgba(10, 15, 30, 0.92)",
            padding: "20px",
            color: "white",
            overflowY: "auto",
            borderRight: "1px solid #1d2533",
            boxShadow: "2px 0 10px rgba(0,0,0,0.4)",
            backdropFilter: "blur(4px)"
          }}
        >
         <h2 style={{ fontSize: "22px", marginBottom: "8px" }}>
  {selected.type}
</h2>

<p style={{ opacity: 0.75, fontSize: "14px", marginBottom: "16px" }}>
  {selected.summary}
</p>

<div style={{
  background: "rgba(255,255,255,0.05)",
  padding: "12px",
  borderRadius: "8px",
  marginBottom: "16px",
  fontSize: "14px"
}}>
  <p><strong>ID:</strong> {selected.id}</p>
  <p><strong>Кластер:</strong> {selected.cluster}</p>
  <p><strong>Severity:</strong> {selected.severity}</p>
</div>

<div style={{
  fontSize: "13px",
  opacity: 0.75,
  lineHeight: "1.4"
}}>
  <strong>Про кластер:</strong>
  <br />
  {clusterDescriptions[selected.cluster]}
</div>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "20px" }}>
            <button onClick={() => setSelected(null)} style={closeBtn}>
              Закрити
            </button>

            <Link to="/" style={homeBtn}>
              На головну
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

/* ===== styles ===== */

const filterBtnStyle = (active) => ({
  padding: "6px 10px",
  fontSize: "12px",
  color: "white",
  borderRadius: "6px",
  background: active ? "rgba(70,120,255,0.5)" : "rgba(255,255,255,0.1)",
  border: "1px solid rgba(255,255,255,0.2)",
  cursor: "pointer"
});

const limitBtnStyle = (active, danger = false) => ({
  padding: "6px 8px",
  fontSize: "11px",
  color: "white",
  borderRadius: "6px",
  background: active
    ? danger
      ? "rgba(255,80,80,0.6)"
      : "rgba(70,120,255,0.6)"
    : "rgba(255,255,255,0.1)",
  border: "1px solid rgba(255,255,255,0.2)",
  cursor: "pointer"
});

const closeBtn = {
  padding: "10px",
  background: "#1e2b45",
  color: "white",
  borderRadius: "6px",
  cursor: "pointer",
  border: "1px solid #2e3c57"
};

const homeBtn = {
  textAlign: "center",
  padding: "10px",
  background: "#283a5b",
  color: "white",
  textDecoration: "none",
  borderRadius: "6px",
  border: "1px solid #324a6b"
};
