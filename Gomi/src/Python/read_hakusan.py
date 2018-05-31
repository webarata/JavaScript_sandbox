import requests, bs4, html5lib

res = requests.get('http://www.city.hakusan.ishikawa.jp/shiminseikatsubu/kankyo/4r/gomi_nittei.html')
res.raise_for_status()
soup = bs4.BeautifulSoup(res.content, 'html5lib')
elems = soup.select('a[name]')
for a in elems:
    region = a.find_parent('span').find('span')
    print(region)

