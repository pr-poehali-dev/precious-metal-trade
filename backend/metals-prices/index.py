import urllib.request
import xml.etree.ElementTree as ET
import json
from datetime import datetime, timedelta


def handler(event: dict, context) -> dict:
    """Получает котировки золота и серебра с сайта ЦБ РФ в рублях за грамм"""

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

    today = datetime.now()
    # ЦБ не публикует данные в выходные — берём диапазон последних 7 дней
    date_from = (today - timedelta(days=7)).strftime('%d/%m/%Y')
    date_to = today.strftime('%d/%m/%Y')

    url = f'https://www.cbr.ru/scripts/xml_metall.asp?date_req1={date_from}&date_req2={date_to}'

    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    with urllib.request.urlopen(req, timeout=10) as response:
        raw = response.read().decode('windows-1251')

    root = ET.fromstring(raw)

    # Берём последние записи по каждому металлу
    metals = {}
    for record in root.findall('Record'):
        code = record.get('Code')
        date = record.get('Date')
        buy = record.find('Buy').text.replace(',', '.')
        sell = record.find('Sell').text.replace(',', '.')
        metals[code] = {
            'date': date,
            'buy': float(buy),
            'sell': float(sell),
        }

    # Курс доллара с Московской биржи (MOEX) — реальное время
    usd_rate = None
    try:
        moex_url = 'https://iss.moex.com/iss/engines/currency/markets/selt/boards/CETS/securities/USD000UTSTOM.json?iss.meta=off&iss.only=marketdata&marketdata.columns=LAST,OPEN'
        moex_req = urllib.request.Request(moex_url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(moex_req, timeout=10) as moex_resp:
            moex_data = json.loads(moex_resp.read().decode('utf-8'))
        data_rows = moex_data.get('marketdata', {}).get('data', [])
        if data_rows and data_rows[0][0]:
            usd_rate = float(data_rows[0][0])
        elif data_rows and data_rows[0][1]:
            usd_rate = float(data_rows[0][1])
    except Exception:
        pass

    result = {
        'gold': metals.get('1'),    # Золото, руб/грамм
        'silver': metals.get('2'),  # Серебро, руб/грамм
        'usd': usd_rate,            # Курс доллара, руб
        'source': 'ЦБ РФ',
    }

    return {
        'statusCode': 200,
        'headers': {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
        },
        'body': json.dumps(result, ensure_ascii=False)
    }