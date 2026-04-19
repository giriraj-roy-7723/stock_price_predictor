import yfinance as yf

msft = yf.Ticker("MSFT")

news = msft.news

for i, n in enumerate(news):
    # print(i,n)
    print(i+1)
    print("Title:", n["content"]["title"])
    print("summary:", n["content"]["summary"])
    print("date:", n["content"]["pubDate"].split("T")[0])
    print()