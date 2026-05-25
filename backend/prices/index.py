import json
import os
import psycopg2


def get_conn():
    return psycopg2.connect(os.environ['DATABASE_URL'])


def handler(event: dict, context) -> dict:
    """Чтение и сохранение ручных цен администратора"""

    if event.get('httpMethod') == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400',
            },
            'body': ''
        }

    headers = {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'}

    if event.get('httpMethod') == 'GET':
        conn = get_conn()
        cur = conn.cursor()
        cur.execute("SELECT id, price_buy, price_sell FROM manual_prices")
        rows = cur.fetchall()
        cur.close()
        conn.close()
        result = {}
        for row in rows:
            result[row[0]] = {
                'buy': float(row[1]) if row[1] is not None else None,
                'sell': float(row[2]) if row[2] is not None else None,
            }
        return {'statusCode': 200, 'headers': headers, 'body': json.dumps(result)}

    if event.get('httpMethod') == 'POST':
        body = json.loads(event.get('body', '{}'))
        metal_id = body.get('id')
        price_type = body.get('type')  # 'buy' | 'sell' | 'reset_buy' | 'reset_sell'
        price = body.get('price')

        conn = get_conn()
        cur = conn.cursor()

        if price_type == 'reset_buy':
            cur.execute("""
                INSERT INTO manual_prices (id, price_buy) VALUES (%s, NULL)
                ON CONFLICT (id) DO UPDATE SET price_buy = NULL, updated_at = NOW()
            """, (metal_id,))
        elif price_type == 'reset_sell':
            cur.execute("""
                INSERT INTO manual_prices (id, price_sell) VALUES (%s, NULL)
                ON CONFLICT (id) DO UPDATE SET price_sell = NULL, updated_at = NOW()
            """, (metal_id,))
        elif price_type == 'buy':
            cur.execute("""
                INSERT INTO manual_prices (id, price_buy) VALUES (%s, %s)
                ON CONFLICT (id) DO UPDATE SET price_buy = %s, updated_at = NOW()
            """, (metal_id, price, price))
        elif price_type == 'sell':
            cur.execute("""
                INSERT INTO manual_prices (id, price_sell) VALUES (%s, %s)
                ON CONFLICT (id) DO UPDATE SET price_sell = %s, updated_at = NOW()
            """, (metal_id, price, price))

        conn.commit()
        cur.close()
        conn.close()
        return {'statusCode': 200, 'headers': headers, 'body': json.dumps({'ok': True})}

    return {'statusCode': 405, 'headers': headers, 'body': ''}
