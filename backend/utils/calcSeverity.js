function calcSeverity(item) {
  let score = 1;

  const text = (
    (item.vulnerabilityName || "") +
    " " +
    (item.shortDescription || "")
  ).toLowerCase();

  // критичні слова
  if (
    text.includes("remote code execution") ||
    text.includes("rce") ||
    text.includes("unauthenticated")
  ) score += 2;

  if (
    text.includes("privilege escalation") ||
    text.includes("kernel") ||
    text.includes("admin")
  ) score += 1;

  // популярні критичні продукти
  const criticalVendors = [
    "microsoft",
    "google",
    "apple",
    "apache",
    "cisco"
  ];

  if (
    criticalVendors.some(v =>
      (item.vendorProject || "").toLowerCase().includes(v)
    )
  ) score += 1;

  // новизна (2024–2025)
  if (item.dateAdded) {
    const year = new Date(item.dateAdded).getFullYear();
    if (year >= 2024) score += 1;
  }

  return Math.min(score, 5);
}

module.exports = calcSeverity;
