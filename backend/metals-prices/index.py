import urllib.request
import json
import os
import psycopg2


def get_conn():
    return psycopg2.connect(os.environ['DATABASE_URL'])


def fetch_moex(symbol: str) -> dict:
    url = f'https://iss.moex.com/iss/engines/currency/markets/selt/boards/CETS/securities/{symbol}.json?iss.meta=off&iss.only=marketdata&marketdata.columns=LAST,OPEN'
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    with urllib.request.urlopen(req, timeout=10) as resp:
        data = json.loads(resp.read().decode('utf-8'))
    rows = data.get('marketdata', {}).get('data', [])
    if rows and rows[0]:
        last = rows[0][0]
        open_price = rows[0][1]
        rate = float(last) if last else None
        open_val = float(open_price) if open_price else None
        return {'price': rate, 'open': open_val}
    return {'price': None, 'open': None}


def get_cached(cur, symbol: str):
    cur.execute("SELECT price, open_price FROM metals_prices_cache WHERE symbol = %s", (symbol,))
    row = cur.fetchone()
    if row:
        return {'price': float(row[0]) if row[0] else None, 'open': float(row[1]) if row[1] else None}
    return {'price': None, 'open': None}


def save_cache(cur, symbol: str, price, open_price):
    cur.execute("""
        INSERT INTO metals_prices_cache (symbol, price, open_price, updated_at)
        VALUES (%s, %s, %s, NOW())
        ON CONFLICT (symbol) DO UPDATE SET price = %s, open_price = %s, updated_at = NOW()
    """, (symbol, price, open_price, price, open_price))


def resolve(symbol: str, cur) -> dict:
    try:
        live = fetch_moex(symbol)
    except Exception:
        live = {'price': None, 'open': None}

    if live['price'] is not None:
        save_cache(cur, symbol, live['price'], live['open'])
        return live
    else:
        cached = get_cached(cur, symbol)
        cached['from_cache'] = True
        return cached


def handler(event: dict, context) -> dict:
    """Получает котировки золота, серебра и доллара с MOEX. При закрытой бирже возвращает последние сохранённые значения."""

    if event.get('httpMethod') == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400',
            },
            'body': ''
        }

    conn = get_conn()
    cur = conn.cursor()

    g = resolve('GLDRUB_TOM', cur)
    s = resolve('SLVRUB_TOM', cur)
    u = resolve('USD000UTSTOM', cur)

    if u['price'] is not None and not u.get('from_cache'):
        cur.execute("INSERT INTO usd_price_history (price, recorded_at) VALUES (%s, NOW())", (u['price'],))

    cur.execute("SELECT price FROM usd_price_history ORDER BY recorded_at DESC LIMIT 20")
    usd_history = [float(r[0]) for r in reversed(cur.fetchall())]

    conn.commit()
    cur.close()
    conn.close()

    gold = {'buy': g['price'], 'sell': g['price']} if g['price'] else None
    silver = {'buy': s['price'], 'sell': s['price']} if s['price'] else None
    usd_rate = u['price']
    usd_open = u['open']

    usdt_rate = None
    try:
        cg_url = 'https://api.coingecko.com/api/v3/simple/price?ids=tether&vs_currencies=rub'
        cg_req = urllib.request.Request(cg_url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(cg_req, timeout=10) as resp:
            cg_data = json.loads(resp.read().decode('utf-8'))
        usdt_rate = float(cg_data['tether']['rub'])
    except Exception:
        pass

    result = {
        'gold': gold,
        'silver': silver,
        'usd': usd_rate,
        'usd_open': usd_open,
        'usd_history': usd_history,
        'usdt': usdt_rate,
        'source': 'MOEX + Binance',
    }

    return {
        'statusCode': 200,
        'headers': {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
        },
        'body': json.dumps(result, ensure_ascii=False)
    }