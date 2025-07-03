import requests

url = "http://localhost:5000/api/teleport"  # Example: replace with your game server
payload = {"playerID": "testPlayer", "x": 99999, "y": 99999, "z": 99999}
try:
    r = requests.post(url, json=payload)
    if r.status_code == 200 and "error" in r.text:
        print("REJECTED")
    else:
        print("VULNERABLE")
except:
    print("Server error or unreachable")
