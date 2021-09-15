import datetime
import json

from flask import Flask, request
from flask_cors import CORS, cross_origin
from model import session, Account, Asset, FXRate, engine, Base
import pandas as pd

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'


@app.route('/rest/ping', methods=['GET'])
@app.route('/rest/ping/', methods=['GET'])
@cross_origin()
def ping():
    return ""


@app.route('/', methods=['GET'])
@app.route('/rest', methods=['GET'])
@app.route('/rest/', methods=['GET'])
@cross_origin()
def index():
    df = pd.read_sql_query('''
    SELECT asset.date, account.name, amount,account.currency as account_currency,rate,fx_rate.currency as fx_currency
    FROM asset LEFT JOIN account ON asset.accountId = account.id
    LEFT JOIN fx_rate ON asset.date = fx_rate.date ORDER BY asset.date''', con=engine)
    df['rate'].fillna(method='backfill', inplace=True)
    df['fx_currency'].fillna('JPY', inplace=True)

    df['rmb'] = df['amount']
    a = df['account_currency'] == df['fx_currency']
    df.loc[a, 'rmb'] = df.loc[a, 'amount'] / df.loc[a, 'rate']

    df['jpy'] = df['amount']
    b = df['account_currency'] != df['fx_currency']
    df.loc[b, 'jpy'] = df.loc[b, 'amount'] * df.loc[b, 'rate']
    if not df.empty:
        total_df = df.groupby('date').agg(
            {'jpy': 'sum', 'rmb': 'sum', 'rate': 'mean'})
        total_df['date'] = total_df.index
        total_df['rmb'] = total_df['rmb'].round(2)
        total_df['jpy'] = total_df['jpy'].round(0)
        total_df['rate'] = total_df['rate'].round(4)
    else:
        total_df = pd.DataFrame(columns=['date', 'rmb', 'jpy', 'rate'])

    return total_df[['date', 'rmb', 'jpy', 'rate']].to_json(orient="records")


@app.route('/rest/asset', methods=['GET', 'POST'])
@app.route('/rest/asset/', methods=['GET', 'POST'])
@app.route('/rest/asset/<int:page>/', methods=['GET', 'POST'])
@cross_origin()
def edit_asset(page=1):
    print(request)
    if request.method == 'POST':
        id = int(
            request.form['id']) if request.form['id'] != '' and request.form['id'] != 'None' else -1
        if request.form['method'] == 'save':
            date = datetime.datetime.strptime(
                request.form['date'], '%Y-%m-%d').date()
            accountId = int(request.form['accountId'])
            amount = float(
                eval(request.form['amount'])) if request.form['amount'] != '' else 0
            asset = Asset()
            asset_list = session.query(Asset).filter(
                Asset.id == id).limit(1).all()
            if asset_list:
                asset = asset_list[0]
            asset.date = date
            asset.accountId = accountId
            asset.amount = amount
            session.add(asset)
            session.commit()
        elif request.form['method'] == 'delete':
            if id > -1:
                session.query(Asset).filter(Asset.id == id).delete()
                session.commit()

    accounts = []
    for a in session.query(Account).all():
        accounts.append({"id": a.id, "name": a.name.encode('utf8').decode('utf8'), "active": a.is_active})

    asset_list = []
    for a in session.query(Asset).order_by(Asset.date.desc(), Asset.id.desc()):
        asset_list.append(
            {"id": a.id, "date": a.date.strftime("%Y-%m-%d"), "accountId": a.accountId, "amount": round(a.amount, 2)})
    return json.dumps(asset_list)


def get_page(m: Base, page):
    all_count = session.query(m).count()
    total_page = int(all_count / 16) + (1 if all_count % 16 > 0 else 0)
    current_page = page
    if page < 1:
        current_page = 1
    elif page > total_page:
        current_page = total_page
    return current_page, total_page


@app.route('/edit_fxrate', methods=['GET', 'POST'])
@app.route('/edit_fxrate/', methods=['GET', 'POST'])
@app.route('/edit_fxrate/<int:page>/', methods=['GET', 'POST'])
@cross_origin()
def edit_fxrate(page=1):
    print(request.form)
    if request.method == 'POST':
        id = int(
            request.form['id']) if request.form['id'] != '' and request.form['id'] != 'None' else -1
        if request.form['method'] == 'save':
            date = datetime.datetime.strptime(
                request.form['date'], '%Y-%m-%d').date()
            rate = float(request.form['rate']
                         ) if request.form['rate'] != '' else 0
            currency = request.form['currency']
            fx = FXRate()
            fx_list = session.query(FXRate).filter(
                FXRate.id == id).limit(1).all()
            if fx_list:
                fx = fx_list[0]
            fx.date = date
            fx.rate = rate
            fx.currency = currency
            session.add(fx)
            session.commit()
        elif request.form['method'] == 'delete':
            if id > -1:
                session.query(FXRate).filter(FXRate.id == id).delete()
                session.commit()
    fxrate_list = [(fx.id, fx.date, fx.rate, fx.currency) for fx in
                   session.query(FXRate).order_by(FXRate.date.desc()).limit(16).offset((page - 1) * 16).all()]
    if not fxrate_list:
        fx = FXRate()
        fxrate_list.append((fx.id, datetime.date.today(), 1, 'RMB'))
    current_page, total_page = get_page(FXRate, page)
    return {"fxrate_list": fxrate_list,
            "current_page": current_page, "total_page": total_page}


@app.route('/rest/account', methods=['GET', 'POST'])
@app.route('/rest/account/', methods=['GET', 'POST'])
@app.route('/rest/account/<int:page>/', methods=['GET', 'POST'])
@cross_origin()
def edit_account(page=1):
    print(request.form)
    if request.method == 'POST':
        id = int(
            request.form['id']) if request.form['id'] != '' and request.form['id'] != 'None' else -1
        if request.form['method'] == 'save':
            name = request.form['name']
            is_active = 'is_active' in request.form
            currency = request.form['currency']
            account = Account()
            account_list = session.query(
                Account).filter(Account.id == id).all()
            if account_list:
                account = account_list[0]
            account.name = name
            account.is_active = is_active
            account.currency = currency
            session.add(account)
            session.commit()
        elif request.form['method'] == 'delete':
            if id > -1:
                session.query(Account).filter(Account.id == id).delete()
                session.commit()
    account_list = []
    for account in session.query(Account).order_by(Account.id.asc()):
        account_list.append(
            {"id": account.id, "name": account.name, "currency": account.currency, "active": account.is_active})

    return json.dumps(account_list)


if __name__ == "__main__":
    app.run(port=5000, host='127.0.0.1', debug=True)
