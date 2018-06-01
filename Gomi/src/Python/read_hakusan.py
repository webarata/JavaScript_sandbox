import requests, bs4, html5lib

# res = requests.get('http://www.city.hakusan.ishikawa.jp/shiminseikatsubu/kankyo/4r/gomi_nittei.html')
# res.raise_for_status()
# soup = bs4.BeautifulSoup(res.content, 'html5lib')
html = ''
with open('gomi.html', encoding='utf-8') as fin:
    html = fin.read()
soup = bs4.BeautifulSoup(html, 'html5lib')
k = 0
for a in soup.select('a[name]'):
    for region in a.parent('span'):
        # 地区
        print('>>> ' + region.text)
        base = region.parent.parent.parent.parent
        table1 = base.next_sibling.next_sibling.select('table')
        # print(table1)
        for i, tr in enumerate(table1[0].select('tr')):
            for j, td in enumerate(tr.select('td')):
                if i == 0 and j == 1:
                    print(td.text.replace('月', '')
                elif i != 0 and j == 0:
                    t = str(td.contents) \
                            .replace('<br/>', '\n') \
                            .replace('[', '') \
                            .replace(']', '')
                    temp = bs4.BeautifulSoup(t, 'html5lib')
                    print(temp.text)
                else:
                    print(td.text)
    k += 1
    if k == 2: break

