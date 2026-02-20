import math

MAX_DOCS = 5
DIM = 3

def dot_product(a, b):
    return sum(a[i] * b[i] for i in range(len(a)))

def magnitude(a):
    return math.sqrt(sum(x * x for x in a))

def cosine_similarity(a, b):
    mag_a = magnitude(a)
    mag_b = magnitude(b)
    if mag_a == 0 or mag_b == 0:
        return 0.0
    return dot_product(a, b) / (mag_a * mag_b)

documents = [
    [1, 2, 3],
    [2, 3, 4],
    [5, 5, 5],
    [1, 0, 1],
    [3, 3, 3]
]

query = list(map(float, input(f"Enter {DIM} values: ").split()))

max_sim = -1
best_match = -1

for i in range(MAX_DOCS):
    sim = cosine_similarity(query, documents[i])
    print(f"Similarity with document {i+1} = {sim:.4f}")
    if sim > max_sim:
        max_sim = sim
        best_match = i

print("\nBest matching document:", best_match + 1)
print("Maximum Cosine Similarity:", round(max_sim, 4))