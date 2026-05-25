import json
import smtplib
import os
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart


def handler(event: dict, context) -> dict:
    """Отправляет заявку с сайта на почту администратора"""

    if event.get('httpMethod') == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400',
            },
            'body': ''
        }

    body = json.loads(event.get('body', '{}'))
    name = body.get('name', '').strip()
    contact = body.get('contact', '').strip()
    metal = body.get('metal', '').strip()
    comment = body.get('comment', '').strip()

    if not name or not contact:
        return {
            'statusCode': 400,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Имя и контакт обязательны'})
        }

    smtp_password = os.environ['SMTP_PASSWORD']
    from_email = 'mr.zolotov.msk@yandex.ru'
    to_email = 'mr.zolotov.msk@yandex.ru'

    msg = MIMEMultipart('alternative')
    msg['Subject'] = f'Новая заявка с сайта — {name}'
    msg['From'] = from_email
    msg['To'] = to_email

    html = f"""
    <h2>Новая заявка с сайта Золотов</h2>
    <table>
      <tr><td><b>Имя:</b></td><td>{name}</td></tr>
      <tr><td><b>Контакт:</b></td><td>{contact}</td></tr>
      <tr><td><b>Металл:</b></td><td>{metal or 'не указан'}</td></tr>
      <tr><td><b>Комментарий:</b></td><td>{comment or 'нет'}</td></tr>
    </table>
    """

    msg.attach(MIMEText(html, 'html'))

    with smtplib.SMTP_SSL('smtp.yandex.ru', 465) as server:
        server.login(from_email, smtp_password)
        server.sendmail(from_email, to_email, msg.as_string())

    return {
        'statusCode': 200,
        'headers': {'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'ok': True})
    }
