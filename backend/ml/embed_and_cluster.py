import os
os.environ["JOBLIB_MULTIPROCESSING"] = "0"
os.environ["OMP_NUM_THREADS"] = "1"
os.environ["MKL_NUM_THREADS"] = "1"

import sys
import json
from sentence_transformers import SentenceTransformer
from sklearn.cluster import KMeans
from sklearn.preprocessing import normalize

BASE_DIR = os.path.dirname(__file__)
MODEL_PATH = os.path.join(BASE_DIR, "models", "MiniLM")

if not os.path.exists(MODEL_PATH):
    print("MODEL NOT FOUND:", MODEL_PATH, file=sys.stderr)
    sys.exit(1)

model = SentenceTransformer(MODEL_PATH)

data = json.load(sys.stdin)

if len(data) < 2:
    for item in data:
        item["cluster"] = 0
    print(json.dumps(data))
    sys.exit(0)

texts = [
    f"TYPE {item.get('type','')} SUMMARY {item.get('summary','')} SEVERITY {item.get('severity',1)}"
    for item in data
]

embeddings = model.encode(texts, show_progress_bar=False)
embeddings = normalize(embeddings)

k = min(6, max(2, len(data) // 10))

kmeans = KMeans(
    n_clusters=k,
    random_state=42,
    n_init=5
)

labels = kmeans.fit_predict(embeddings)

for i, item in enumerate(data):
    item["cluster"] = int(labels[i])

print(json.dumps(data))
sys.stdout.flush()
