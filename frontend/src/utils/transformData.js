function hashToAngle(id) {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash);
  }
  return (hash % 360) * (Math.PI / 180);
}

export default function transformData(incidents) {
  return incidents.map(item => {
    const angle = hashToAngle(item.id);
    const radius = 4 + (item.cluster || 0) * 1.5;

    return {
      id: item.id,
      raw: item,
      cluster: item.cluster || 0,
      severity: item.severity || 1,
      position: [
        Math.cos(angle) * radius,
        ((item.severity || 1) - 3) * 0.8,
        Math.sin(angle) * radius
      ]
    };
  });
}
