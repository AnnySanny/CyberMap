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

    py.stdout.setEncoding("utf8");
    py.stderr.setEncoding("utf8");

    py.on("error", err => {
      console.error("PYTHON PROCESS ERROR:", err);
      reject(err);
    });
    py.stdin.on("error", err => {
      if (err.code !== "EOF") {
        console.error("PYTHON STDIN ERROR:", err);
      }
    });

    py.stdout.on("data", data => {
      output += data;
    });

    py.stderr.on("data", data => {
      stderr += data;
    });

    py.on("close", code => {
      if (code !== 0) {
        console.error("PYTHON STDERR:\n", stderr);
        reject(new Error("Python exited with code " + code));
        return;
      }

      try {
        resolve(JSON.parse(output));
      } catch (e) {
        console.error("INVALID JSON FROM PYTHON:\n", output);
        reject(e);
      }
    });

  
    py.stdin.write(JSON.stringify(incidents));
    py.stdin.end();
  });
}

module.exports = runClustering;
