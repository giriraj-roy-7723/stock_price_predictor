import requests

url = "https://newsapi.org/v2/everything"

params = {
    "q": "Microsoft OR MSFT ",
    "from": "2026-03-19",
    "to": "2026-03-19",
    "language": "en",
    "apiKey": "83015759763b491b9bba73e3aa69ae32"
}

r = requests.get(url, params=params)
data = r.json()

for article in data["articles"][:5]:
    print("Title: ",article["title"])
    print("Description: ",article["description"])
    print("Date: ",article["publishedAt"].split("T")[0])
    print()