# match_users.py (Python matching script)
import sys
import json
import re
import spacy
import wordninja

# Load spaCy model (medium or large for vectors)
nlp = spacy.load("en_core_web_md")

# Similarity thresholds
ITEM_SIMILARITY_THRESHOLD = 0.75
OVERALL_SCORE_THRESHOLD = 0.4

# Read and parse JSON input
def load_input():
    try:
        return json.loads(sys.stdin.read())
    except json.JSONDecodeError as e:
        sys.exit(json.dumps({"error": f"Invalid JSON input: {e}"}))

# Normalize string: split with wordninja, lowercase, lemmatize, remove stop/punct
def normalize(text: str) -> str:
    if not text or not text.strip():
        return ""
    split_text = " ".join(wordninja.split(text))
    doc = nlp(split_text.lower())
    tokens = [token.lemma_ for token in doc if token.is_alpha and not token.is_stop]
    return " ".join(tokens)

# Generate acronym from text, e.g., "Data Structures & Algorithms" -> "DSA"
def acronym(text: str) -> str:
    words = re.findall(r"[A-Za-z']+", text)
    return ''.join([w[0] for w in words]).upper() if words else ''

# Decide if two terms are semantically or acronym-similar
def is_match(a: str, b: str, threshold: float = ITEM_SIMILARITY_THRESHOLD) -> bool:
    # Acronym match
    if a.strip().upper() == acronym(b) or b.strip().upper() == acronym(a):
        return True
    # Semantic match
    na, nb = normalize(a), normalize(b)
    if not na or not nb:
        return False
    return nlp(na).similarity(nlp(nb)) >= threshold

# Compute shared items between two lists based on matching
def shared_items(list_a: list, list_b: list) -> list:
    shared = []
    for a in list_a:
        for b in list_b:
            if b not in shared and is_match(a, b):
                shared.append(b)
    return shared

# Compute semantic similarity of two string fields
def semantic_score(a: str, b: str) -> float:
    na, nb = normalize(a), normalize(b)
    if not na or not nb:
        return 0.0
    return nlp(na).similarity(nlp(nb))

# Main matching logic
def match_users(data: dict) -> list:
    current = data.get('current_user', {})
    others = data.get('all_users', [])

    cur_courses = current.get('courses', [])
    cur_interests = current.get('interests', [])

    # Build combined spaCy doc for overall profile
    def build_profile_doc(user):
        parts = []
        for field in ('degree', 'university'):
            if user.get(field):
                parts.append(normalize(user[field]))
        for lst in ('courses', 'interests'):
            for item in user.get(lst, []):
                if isinstance(item, str):
                    parts.append(normalize(item))
        return nlp(" ".join(parts))

    cur_doc = build_profile_doc(current)
    results = []

    for user in others:
        if user.get('id') == current.get('id'):
            continue

        other_doc = build_profile_doc(user)
        overall_sim = cur_doc.similarity(other_doc)
        sc = shared_items(cur_courses, user.get('courses', []))
        si = shared_items(cur_interests, user.get('interests', []))
        uni_sim = semantic_score(current.get('university', ''), user.get('university', ''))
        deg_sim = semantic_score(current.get('degree', ''), user.get('degree', ''))

        weighted = (
            overall_sim * 0.4 +
            (len(sc) / len(cur_courses) if cur_courses else 0) * 0.2 +
            (len(si) / len(cur_interests) if cur_interests else 0) * 0.2 +
            uni_sim * 0.1 +
            deg_sim * 0.1
        )

        if weighted >= OVERALL_SCORE_THRESHOLD and (sc or si):
            results.append({
                'id': user.get('id'),
                'username': user.get('username'),
                'email': user.get('email'),
                'university': user.get('university', ''),
                'degree': user.get('degree', ''),
                'similarity': round(overall_sim, 2),
                'universitySimilarity': round(uni_sim, 2),
                'degreeSimilarity': round(deg_sim, 2),
                'sharedCourses': sc,
                'sharedInterests': si,
                'weightedScore': round(weighted, 2)
            })
    return sorted(results, key=lambda x: x['weightedScore'], reverse=True)

if __name__ == '__main__':
    data = load_input()
    matches = match_users(data)
    print(json.dumps(matches))
