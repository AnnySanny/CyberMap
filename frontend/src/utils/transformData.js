export default function transformData(incidents) {
  return incidents.map((item, index) => {
    const angle = index * 0.6;
    const radius = 4 + (item.cluster || 0) * 1.5;

    return {
      id: item.id,
      raw: item,
      cluster: item.cluster || 0,
      severity: item.severity || 1,
      position: [
        Math.cos(angle) * radius,
        (Math.random() - 0.5) * 3,
        Math.sin(angle) * radius
      ]
    };
  });
}
