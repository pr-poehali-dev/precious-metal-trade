import urllib.request
import json


def fetch_moex(symbol: str) -> dict:
    url = f'https://iss.moex.com/iss/engines/currency/markets/selt/boards/CETS/securities/{symbol}.json?iss.meta=off&iss.only=marketdata&marketdata.columns=LAST,OPEN'
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    with urllib.request.urlopen(req, timeout=10) as resp:
        data = json.loads(resp.read().decode('utf-8'))
    rows = data.get('marketdata', {}).get('data', [])
    if rows and rows[0]:
        last = rows[0][0]
        open_price = rows[0][1]
        rate = float(last) if last else float(open_price) if open_price else None
        return {'buy': rate, 'sell': rate, 'open': float(open_price) if open_price else rate}
    return {'buy': None, 'sell': None, 'open': None}


def handler(event: dict, context) -> dict:
    """Получает котировки золота, серебра и доллара с Московской биржи (MOEX)"""

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

    gold = None
    silver = None
    usd_rate = None
    usd_open = None

    try:
        g = fetch_moex('GLDRUB_TOM')
        if g['buy']:
            gold = {'buy': g['buy'], 'sell': g['sell']}
    except Exception:
        pass

    try:
        s = fetch_moex('SLVRUB_TOM')
        if s['buy']:
            silver = {'buy': s['buy'], 'sell': s['sell']}
    except Exception:
        pass

    try:
        u = fetch_moex('USD000UTSTOM')
        usd_rate = u['buy']
        usd_open = u['open']
    except Exception:
        pass

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