import requests
import random
import string

url = "http://localhost:5000/api/your-endpoint"

for _ in range(10):
    fuzz = ''.join(random.choices(string.ascii_letters + string.digits, k=20))
    payload = {"fuzz": fuzz}
    try:
        r = requests.post(url, json=payload)
        print(f"Sent: {payload} | Status: {r.status_code}")
    except:
        print("Error")
