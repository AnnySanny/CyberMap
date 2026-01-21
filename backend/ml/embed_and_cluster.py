import sys
import os

sys.stdout.reconfigure(encoding="utf-8")
sys.stderr.reconfigure(encoding="utf-8")


os.environ["JOBLIB_MULTIPROCESSING"] = "0"
os.environ["OMP_NUM_THREADS"] = "1"
os.environ["MKL_NUM_THREADS"] = "1"

import json
from collections import Counter
from sentence_transformers import SentenceTransformer
from sklearn.cluster import KMeans
from sklearn.preprocessing import normalize
from sklearn.metrics.pairwise import cosine_similarity


sys.stdout.reconfigure(encoding="utf-8")
sys.stderr.reconfigure(encoding="utf-8")
BASE_DIR = os.path.dirname(__file__)
MODEL_PATH = os.path.join(BASE_DIR, "models", "MiniLM")

if not os.path.exists(MODEL_PATH):
    print("MODEL NOT FOUND:", MODEL_PATH, file=sys.stderr)
    sys.exit(1)

model = SentenceTransformer(MODEL_PATH)


data = json.load(sys.stdin)


if len(data) < 2:
    for i, item in enumerate(data):
        item["cluster"] = 0
        item["_idx"] = i
        item["cluster_explanation_ua"] = "Недостатньо даних для кластеризації."
    print(json.dumps({ "nodes": data, "edges": [] }))
    sys.stdout.flush()
    sys.exit(0)


texts = [
    f"TYPE {item.get('type','')} "
    f"SUMMARY {item.get('summary','')} "
    f"SEVERITY {item.get('severity',1)}"
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
    item["_idx"] = i


centers = normalize(kmeans.cluster_centers_)
center_sim = cosine_similarity(embeddings, centers)


cluster_sizes = Counter(labels)


cluster_texts = {}
for idx, item in enumerate(data):
    c = item["cluster"]
    cluster_texts.setdefault(c, []).append(texts[idx].lower())


KEYWORDS = [
    "remote code execution",
    "code injection",
    "unauthenticated",
    "authorization",
    "out of bounds",
    "privilege escalation",
    "command injection",
    "memory corruption"
]

cluster_keywords = {}
for c, texts_in_cluster in cluster_texts.items():
    joined = " ".join(texts_in_cluster)
    found = [kw for kw in KEYWORDS if kw in joined]
    cluster_keywords[c] = found[:4]


for i, item in enumerate(data):
    similarity = float(center_sim[i][item["cluster"]])
    size = cluster_sizes[item["cluster"]]
    keywords = cluster_keywords[item["cluster"]]

    role = "ядро кластера" if similarity >= 0.85 else "периферійна атака"

    explanation = (
        f"Атака віднесена до кластера C{item['cluster']}, "
        f"оскільки має високу семантичну подібність до типових атак цього кластера "
        f"(рівень схожості {similarity:.2f}). "
        f"Кластер налічує {size} атак і переважно пов’язаний з такими ознаками: "
        f"{', '.join(keywords) if keywords else 'загальні серверні вразливості'}. "
        f"Дана атака класифікується як {role}."
    )

    item["cluster_similarity"] = similarity
    item["cluster_size"] = size
    item["cluster_keywords"] = keywords
    item["cluster_role"] = role
    item["cluster_explanation_ua"] = explanation


similarity_matrix = cosine_similarity(embeddings)
edges = []
SIM_THRESHOLD = 0.75

for i in range(len(data)):
    for j in range(i + 1, len(data)):
        score = similarity_matrix[i][j]
        if score >= SIM_THRESHOLD:
            edges.append({
                "source": data[i].get("id", data[i]["_idx"]),
                "target": data[j].get("id", data[j]["_idx"]),
                "weight": float(score),
                "clusterA": data[i]["cluster"],
                "clusterB": data[j]["cluster"]
            })


print(json.dumps({
    "nodes": data,
    "edges": edges
}, ensure_ascii=False))
sys.stdout.flush()
