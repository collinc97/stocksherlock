import io
import requests

save_dir = "./stockApp/static/xml/"
token = '25D26255F6924F31BD86503A4253BEA0'

def queryStock(stockArray, startDate, endDate):
    for stock in stockArray:
        url='http://ws.nasdaqdod.com/v1/NASDAQAnalytics.asmx/GetEndOfDayData'
        data = {'_Token' : '%s' % token,
        'Symbols' : '%s' % stock,
        'StartDate' : '%s' % startDate,
        'EndDate' : '%s' % endDate,
        'MarketCenters' : '' }
        r = requests.get(url, params = data)
        fileName = stock + '_' + startDate.replace('/', '.')[:-5] + '_' + endDate.replace('/', '.')[:-5] + ".xml"
        with io.FileIO(save_dir + fileName, 'w') as f:
            f.write(r.text)
