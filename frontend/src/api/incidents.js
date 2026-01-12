export async function getIncidents(limit = 50) {
  const res = await fetch(
    `http://localhost:5000/api/incidents?limit=${limit}`
  );
  return await res.json();
}
