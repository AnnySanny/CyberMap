const { spawn } = require("child_process");
const path = require("path");

function runClustering(incidents) {
  return new Promise((resolve, reject) => {
    const py = spawn(
      "python",
      ["-u", path.join(__dirname, "../ml/embed_and_cluster.py")],
      { stdio: ["pipe", "pipe", "pipe"] }
    );

    let output = "";
    let stderr = "";

    py.stdout.on("data", data => {
      output += data.toString();
    });

    py.stderr.on("data", data => {
     
      stderr += data.toString();
    });

    py.on("close", (code) => {
      if (code !== 0) {
        console.error("PYTHON STDERR:", stderr);
        reject("Python process failed");
        return;
      }

      try {
        const parsed = JSON.parse(output);
        resolve(parsed);
      } catch (e) {
        console.error("INVALID JSON:", output);
        reject("Invalid JSON from Python");
      }
    });

    py.stdin.write(JSON.stringify(incidents));
    py.stdin.end();
  });
}

module.exports = runClustering;
