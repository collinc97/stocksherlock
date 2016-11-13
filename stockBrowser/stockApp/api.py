import requests
from flask import render_template, request, url_for
from stockApp import app
from getStockData import queryStock
from xmlConvert import xml2csv

tickerLst = ['MSFT', 'NDAQ', 'IBM', 'BLK', 'KLAC', 'ORCL', 'FEYE', 'COF', 'SAP', 'SQ', 'FB', 'GDDY', 'SYNA', 'TWLO', 'TWO'];

@app.route('/')
def index():
    return "hi collin"

@app.route('/home')
def home():
    return render_template("index.html")

@app.route('/home', methods=['POST'])
def form():
    #ticker = request.form['tickerArr']
    startDate = request.form['startDate']
    endDate = request.form['endDate']
    #'GOOG, APPL' => ['GOOG', 'APPL']
    lst = []
    for ticker in tickerLst:
        if request.form.get(ticker):
            lst.append(ticker)
    queryStock(lst, startDate, endDate)
    xml2csv()
    return render_template("index.html")
