const express = require("express");
const fs = require("fs");
const path = require("path");
const calcSeverity = require("../utils/calcSeverity");
const runClustering = require("../utils/runClustering");

const router = express.Router();
const DATA_PATH = path.join(__dirname, "../data/cisa_kev.json");


let cachedIncidents = null;
let isProcessing = false;

router.get("/", async (req, res) => {
  try {
    if (cachedIncidents) {
      return res.json(cachedIncidents);
    }

    if (isProcessing) {
      return res.status(202).json({ message: "Processing, try again" });
    }

    isProcessing = true;

    const raw = fs.readFileSync(DATA_PATH, "utf8");
    const data = JSON.parse(raw);
    const vulnerabilities = data.vulnerabilities || [];

    const incidents = vulnerabilities.map(item => ({
      id: item.cveID,
      type: item.vulnerabilityName || "Unknown",
      summary: item.shortDescription || "",
      date: item.dateAdded,
      severity: calcSeverity(item),
      cluster: 0
    }));

    const clustered = await runClustering(incidents);

    cachedIncidents = clustered;
    isProcessing = false;

    res.setHeader("Content-Type", "application/json; charset=utf-8");
res.json(clustered);

  } catch (err) {
    isProcessing = false;
    console.error("INCIDENT ROUTE ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;
