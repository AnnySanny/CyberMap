import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import CyberScene from "../components/CyberScene";
import { getIncidents } from "../api/incidents";

const LIMIT_OPTIONS = [10, 30, 50, 100, 200, 300, 500];
const CLUSTER_COLORS = [
  "#ff4444",
  "#44ff44",
  "#4444ff",
  "#ffaa00",
  "#9b5cff",
  "#00ffd5",
  "#ff6ec7",
  "#00c2ff",
  "#ffd700",
  "#7cff00",
];
export default function Map() {
  const [incidents, setIncidents] = useState([]);
  const [selected, setSelected] = useState(null);
  const [activeFilter, setActiveFilter] = useState("all");
  const [limit, setLimit] = useState(10);
  const [edges, setEdges] = useState([]);
  const [showEdges, setShowEdges] = useState(true);
  const [showLabels, setShowLabels] = useState(true);
  const [showOnlyLinked, setShowOnlyLinked] = useState(false);
  useEffect(() => {
    getIncidents(limit).then((data) => {
      setIncidents(data.nodes || []);
      setEdges(data.edges || []);
    });
  }, [limit]);

  const clusterList = useMemo(() => {
    const base = limit === "all" ? incidents : incidents.slice(0, limit);

    return [...new Set(base.map((i) => i.cluster))].sort((a, b) => a - b);
  }, [incidents, limit]);

  const clusterDescriptions = useMemo(() => {
    const map = {};
    incidents.forEach((i) => {
      if (!map[i.cluster]) map[i.cluster] = [];
      map[i.cluster].push(i);
    });
    Object.keys(map).forEach((k) => {
      const types = [...new Set(map[k].map((i) => i.type))].slice(0, 3);
      map[k] = `Переважно: ${types.join(", ")}`;
    });
    return map;
  }, [incidents]);

  function collectConnected(startId, edges) {
    const visited = new Set();
    const queue = [startId];

    while (queue.length) {
      const current = queue.shift();
      if (visited.has(current)) continue;

      visited.add(current);

      edges.forEach((e) => {
        if (e.source === current && !visited.has(e.target)) {
          queue.push(e.target);
        }
        if (e.target === current && !visited.has(e.source)) {
          queue.push(e.source);
        }
      });
    }

    return visited;
  }

  const visibleIncidentIds = useMemo(() => {
    let base = limit === "all" ? incidents : incidents.slice(0, limit);

    if (activeFilter !== "all") {
      base = base.filter((i) => i.cluster === activeFilter);
    }

    return new Set(base.map((i) => i.id));
  }, [incidents, limit, activeFilter]);

  const visibleEdges = useMemo(() => {
    return edges.filter(
      (e) =>
        visibleIncidentIds.has(e.source) && visibleIncidentIds.has(e.target),
    );
  }, [edges, visibleIncidentIds]);

  const visibleIncidents = useMemo(() => {
    let base = limit === "all" ? incidents : incidents.slice(0, limit);

    if (activeFilter !== "all") {
      base = base.filter((i) => i.cluster === activeFilter);
    }

    if (showOnlyLinked && selected) {
      const connectedIds = collectConnected(selected.id, visibleEdges);

      base = base.filter((i) => connectedIds.has(i.id));
    }

    return base;
  }, [incidents, limit, activeFilter, showOnlyLinked, selected, visibleEdges]);

  

  return (
    <div style={{ width: "100%", height: "100vh", position: "relative" }}>
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
          gap: "20px",
        }}
      >
        
        <div>
          <h3 style={{ margin: 0, fontSize: "20px", fontWeight: "bold" }}>
            CyberMap – Інтерактивна 3D Мапа Кіберінцидентів
          </h3>
          <p style={{ margin: 0, opacity: 0.7, fontSize: "13px" }}>
            Сфери — інциденти · Колір — кластер · Розмір — оцінка
          </p>
        </div>
        <div
          style={{
            display: "flex",
            gap: "14px",
            flexWrap: "wrap",
            maxWidth: "520px",
          }}
        >
          {clusterList.map((c) => (
            <div
              key={c}
              title={clusterDescriptions[c]}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                padding: "4px 8px",
                borderRadius: "8px",
                background: "rgba(255,255,255,0.05)",
                cursor: "help",
              }}
            >
              <div
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  background: CLUSTER_COLORS[c % CLUSTER_COLORS.length],
                }}
              />

              <span style={{ fontSize: "11px", opacity: 0.85 }}>C{c}</span>

              <span
                style={{
                  fontSize: "11px",
                  opacity: 0.6,
                  maxWidth: "160px",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {
                  clusterDescriptions[c]
                    ?.replace("Переважно:", "")
                    ?.split(",")[0]
                }
                {" …"}
              </span>
            </div>
          ))}
        </div>

      
        <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
          <div style={{ display: "flex", gap: "10px" }}>
            <button
              onClick={() => setShowEdges((v) => !v)}
              style={filterBtnStyle(showEdges)}
            >
              {showEdges ? "Звʼязки ✓" : "Звʼязки ✕"}
            </button>

            <button
              onClick={() => setShowLabels((v) => !v)}
              style={filterBtnStyle(showLabels)}
            >
              {showLabels ? "Підписи ✓" : "Підписи ✕"}
            </button>
          </div>
          <button
            onClick={() => setShowOnlyLinked((v) => !v)}
            style={filterBtnStyle(showOnlyLinked)}
          >
            {showOnlyLinked ? "Повʼязані ✓" : "Повʼязані ✕"}
          </button>
        
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

       
          <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
            <span style={{ fontSize: "12px", opacity: 0.7 }}>Показати:</span>

            {LIMIT_OPTIONS.map((n) => (
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

   
      <CyberScene
        incidents={visibleIncidents}
        edges={visibleEdges}
        showEdges={showEdges}
        showLabels={showLabels}
        onSelect={setSelected}
      />


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
            zIndex: 20,
            color: "white",
            overflowY: "auto",
            borderRight: "1px solid #1d2533",
            boxShadow: "2px 0 10px rgba(0,0,0,0.4)",
            backdropFilter: "blur(4px)",
          }}
        >
          <h2 style={{ fontSize: "22px", marginBottom: "8px" }}>
            {selected.type}
          </h2>

          <p style={{ opacity: 0.75, fontSize: "14px", marginBottom: "16px" }}>
            {selected.summary}
          </p>

          <div
            style={{
              background: "rgba(255,255,255,0.05)",
              padding: "12px",
              borderRadius: "8px",
              marginBottom: "16px",
              fontSize: "14px",
              lineHeight: "1.5",
            }}
          >
            <p>
              <strong>ID:</strong> {selected.id}
            </p>
            <p>
              <strong>Дата:</strong> {selected.date || "—"}
            </p>
            <p>
              <strong>Кластер:</strong> C{selected.cluster}
            </p>
            <p>
              <strong>Оцінка:</strong> {selected.severity}
            </p>
          </div>
     <div
  style={{
    background: "rgba(255,255,255,0.04)",
    padding: "12px",
    borderRadius: "10px",
    fontSize: "13px",
    lineHeight: "1.5",
    border: "1px solid rgba(255,255,255,0.08)"
  }}
>
  <div style={{ marginBottom: "6px", opacity: 0.9 }}>
    <strong>Пояснення кластеризації</strong>
  </div>

  <div style={{ opacity: 0.8, marginBottom: "10px" }}>
    {selected.cluster_explanation_ua}
  </div>

  <div style={{ fontSize: "12px", opacity: 0.65 }}>
    <div>
      <strong>Кластер:</strong> C{selected.cluster} ·{" "}
      <strong>Атак у кластері:</strong> {selected.cluster_size}
    </div>

    <div>
      <strong>Схожість до центру:</strong>{" "}
      {(selected.cluster_similarity * 100).toFixed(1)}%
    </div>

    {selected.cluster_keywords?.length > 0 && (
      <div>
        <strong>Ключові ознаки:</strong>{" "}
        {selected.cluster_keywords.join(", ")}
      </div>
    )}
  </div>
</div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              marginTop: "20px",
            }}
          >
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
const filterBtnStyle = (active) => ({
  padding: "6px 10px",
  fontSize: "12px",
  color: "white",
  borderRadius: "6px",
  background: active ? "rgba(70,120,255,0.5)" : "rgba(255,255,255,0.1)",
  border: "1px solid rgba(255,255,255,0.2)",
  cursor: "pointer",
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
  cursor: "pointer",
});

const closeBtn = {
  padding: "10px",
  background: "#1e2b45",
  color: "white",
  borderRadius: "6px",
  cursor: "pointer",
  border: "1px solid #2e3c57",
};

const homeBtn = {
  textAlign: "center",
  padding: "10px",
  background: "#283a5b",
  color: "white",
  textDecoration: "none",
  borderRadius: "6px",
  border: "1px solid #324a6b",
};
