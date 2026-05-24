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

    # Курс доллара ЦБ РФ
    usd_rate = None
    try:
        usd_url = 'https://www.cbr.ru/scripts/XML_daily.asp'
        usd_req = urllib.request.Request(usd_url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(usd_req, timeout=10) as usd_resp:
            usd_raw = usd_resp.read().decode('windows-1251')
        usd_root = ET.fromstring(usd_raw)
        for valute in usd_root.findall('Valute'):
            if valute.find('CharCode').text == 'USD':
                usd_rate = float(valute.find('Value').text.replace(',', '.'))
                break
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