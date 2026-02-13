import re

def analyze_clauses(text):
    clauses = []

    # Condition Clause
    # Looks for patterns like "if ... then ..." or "in case ... ,"
    for match in re.finditer(r'\b(?:if|in case)\b (.*?)(?:,| then | may | shall | will )(.*?)(?:\\.|;|$)',
                             text, re.IGNORECASE):
        condition, consequence = match.groups()
        clauses.append({
            "type": "Condition Clause",
            "condition": condition.strip(),
            "consequence": consequence.strip()
        })

    # Exception Clause
    # Looks for "unless ... ,"
    for match in re.finditer(r'\bunless\b (.*?)(?:,| may | shall | will )(.*?)(?:\\.|;|$)',
                             text, re.IGNORECASE):
        condition, consequence = match.groups()
        clauses.append({
            "type": "Exception Clause",
            "condition": condition.strip(),
            "consequence": consequence.strip()
        })

    # Conditional Clause
    # Looks for "provided that ... ,"
    for match in re.finditer(r'\bprovided that\b (.*?)(?:,| may | shall | will )(.*?)(?:\\.|;|$)',
                             text, re.IGNORECASE):
        condition, consequence = match.groups()
        clauses.append({
            "type": "Conditional Clause",
            "condition": condition.strip(),
            "consequence": consequence.strip()
        })

    return clauses
