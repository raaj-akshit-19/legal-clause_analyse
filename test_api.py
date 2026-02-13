import requests
import json

BASE_URL = "http://127.0.0.1:8000"

def test_analyze():
    print("Testing /analyze endpoint...")
    text = "If the tenant fails to pay rent, the landlord may terminate the agreement."
    response = requests.post(f"{BASE_URL}/analyze", data={"text": text})
    
    if response.status_code == 200:
        data = response.json()
        print("Success:", data)
        assert len(data['results']) > 0
        assert data['results'][0]['type'] == 'Condition Clause'
        print("Analyze test passed!\n")
        return data['results']
    else:
        print("Failed:", response.text)
        return []

def test_download_pdf(clauses):
    print("Testing /download endpoint (PDF)...")
    data = json.dumps(clauses)
    response = requests.post(f"{BASE_URL}/download", data={"format": "pdf", "data": data})
    
    if response.status_code == 200:
        print("Success: PDF downloaded")
        assert response.headers['content-type'] == 'application/pdf'
        print("Download PDF test passed!\n")
    else:
        print("Failed:", response.text)

def test_download_docx(clauses):
    print("Testing /download endpoint (DOCX)...")
    data = json.dumps(clauses)
    response = requests.post(f"{BASE_URL}/download", data={"format": "docx", "data": data})
    
    if response.status_code == 200:
        print("Success: DOCX downloaded")
        # content-type might vary slightly but usually contains wordprocessingml
        assert 'wordprocessingml' in response.headers['content-type']
        print("Download DOCX test passed!\n")
    else:
        print("Failed:", response.text)

if __name__ == "__main__":
    try:
        # Check if server is up
        requests.get(BASE_URL)
        
        clauses = test_analyze()
        if clauses:
            test_download_pdf(clauses)
            test_download_docx(clauses)
            
    except requests.exceptions.ConnectionError:
        print("Error: Could not connect to server. Make sure it is running.")
