function vendorCategory(vendor = "") {
  const v = vendor.toLowerCase();

  if (v.includes("microsoft") || v.includes("apple")) return 1;
  if (v.includes("apache") || v.includes("nginx")) return 2;
  if (v.includes("cisco") || v.includes("fortinet")) return 3;

  return 4;
}

function calcRecency(dateStr) {
  if (!dateStr) return 0;

  const days =
    (Date.now() - new Date(dateStr).getTime()) / (1000 * 60 * 60 * 24);

  return 1 / (1 + Math.max(days, 0));
}

function extractFeatures(item) {
  const text = item.shortDescription || "";

  return [
    item.severity || 1,
    calcRecency(item.dateAdded),
    vendorCategory(item.vendorProject),
    text.split(" ").length
  ];
}

module.exports = extractFeatures;
