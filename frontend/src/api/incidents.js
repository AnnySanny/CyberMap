export async function getIncidents(limit = 50) {

  try {
    const localRes = await fetch("/data/incidents_clustered.json", {
      cache: "no-store",
    });

    if (localRes.ok) {
      const data = await localRes.json();

      if (limit === "all") return data;

      const nodes = data.nodes.slice(0, limit);
      const ids = new Set(nodes.map((n) => n.id));

      return {
        nodes,
        edges: data.edges.filter(
          (e) => ids.has(e.source) && ids.has(e.target)
        ),
      };
    }
  } catch (e) {
    
  }


  const res = await fetch(
    `http://localhost:5000/api/incidents?limit=${limit}`
  );

  return await res.json();
}
