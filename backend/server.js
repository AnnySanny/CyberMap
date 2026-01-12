const express = require("express");
const cors = require("cors");


const incidentsRoute = require("./routes/incidents.js");

const app = express();
app.use(cors());
app.use(express.json());


app.use("/api/incidents", incidentsRoute);

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Запущено: http://localhost:${PORT}`);
});
