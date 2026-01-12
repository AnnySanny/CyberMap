const express = require("express");
const fs = require("fs");
const path = require("path");
const calcSeverity = require("../utils/calcSeverity");
const runClustering = require("../utils/runClustering");

const router = express.Router();

const DATA_PATH = path.join(__dirname, "../data/cisa_kev.json");

router.get("/", async (req, res) => {
  try {
    const limit = Number(req.query.limit || 50);

    const raw = fs.readFileSync(DATA_PATH, "utf8");
    const data = JSON.parse(raw);

    const vulnerabilities = data.vulnerabilities || [];

    const incidents = vulnerabilities
      .slice(0, limit)
      .map(item => ({
        id: item.cveID,
        type: item.vulnerabilityName || "Unknown",
        summary: item.shortDescription || "",
        date: item.dateAdded,
        severity: calcSeverity(item),
        cluster: 0
      }));

    const clustered = await runClustering(incidents);

    res.json(clustered);
  } catch (err) {
    console.error("INCIDENT ROUTE ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
