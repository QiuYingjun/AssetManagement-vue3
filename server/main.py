import datetime
import json

from flask import Flask, request
from flask_cors import CORS, cross_origin
from model import session, Account, Asset, FXRate, engine, Base
import pandas as pd

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})
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
def edit_asset():
    if request.method == 'POST':
        id = int(
            request.json['id']) if request.json['id'] != '' and request.json['id'] != 'None' else -1
        if request.json['method'] == 'save':
            date = datetime.datetime.strptime(
                request.json['date'], '%Y-%m-%d').date()
            accountId = int(request.json['accountId'])
            amount = float(
                eval(request.json['amount'])) if request.json['amount'] != '' else 0
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
        elif request.json['method'] == 'delete':
            if id > -1:
                session.query(Asset).filter(Asset.id == id).delete()
                session.commit()

    asset_list = []
    for a in session.query(Asset).order_by(Asset.date.desc(), Asset.id.desc()):
        asset_list.append(
            {"id": a.id, "date": a.date.strftime("%Y-%m-%d"), "accountId": a.accountId, "amount": round(a.amount, 2)})
    return json.dumps(asset_list)


@app.route('/rest/fxrate', methods=['GET', 'POST'])
@app.route('/rest/fxrate/', methods=['GET', 'POST'])
@app.route('/rest/fxrate/<int:page>/', methods=['GET', 'POST'])
@cross_origin()
def edit_fxrate():
    if request.method == 'POST':
        id = int(
            request.json['id']) if request.json['id'] != '' and request.json['id'] != 'None' else -1
        if request.json['method'] == 'save':
            date = datetime.datetime.strptime(
                request.json['date'], '%Y-%m-%d').date()
            rate = float(request.json['rate']
                         ) if request.json['rate'] != '' else 0
            currency = request.json['currency']
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
        elif request.json['method'] == 'delete':
            if id > -1:
                session.query(FXRate).filter(FXRate.id == id).delete()
                session.commit()
    fxrate_list = [{"id": fx.id, "date": fx.date.strftime("%Y-%m-%d"), "rate": fx.rate, "currency": fx.currency} for fx
                   in session.query(FXRate).order_by(FXRate.date.desc()).all()]
    return json.dumps(fxrate_list)


@app.route('/rest/account', methods=['GET', 'POST'])
@app.route('/rest/account/', methods=['GET', 'POST'])
@app.route('/rest/account/<int:page>/', methods=['GET', 'POST'])
@cross_origin()
def edit_account():
    if request.method == 'POST':
        id = int(
            request.json['id']) if request.json['id'] != '' and request.json['id'] != 'None' else -1
        if request.json['method'] == 'save':
            name = request.json['name']
            is_active = request.json["is_active"] if "is_active" in request.json else False
            currency = request.json['currency']
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
        elif request.json['method'] == 'delete':
            if id > -1:
                session.query(Account).filter(Account.id == id).delete()
                session.commit()
    account_list = []
    for account in session.query(Account).order_by(Account.id.desc()).all():
        account_list.append(
            {"id": account.id, "name": account.name, "currency": account.currency, "is_active": account.is_active})
    return json.dumps(account_list)


if __name__ == "__main__":
    app.run(port=5000, host='0.0.0.0', debug=False)
