import xml.etree.ElementTree as ET
import csv
import pandas as pd
import numpy as np
import os

def xml2csv():
    finalArray = np.array(['Symbol', 'Variability Mean', 'Growth Rate', 'Volume Mean', 'Volume Spread'])


    for filename in os.listdir('/Users/collinchin/nasdaqQuery/StockBrowser/stockApp/static/xml'):
        if filename.endswith(".xml"):
            split = filename.split('_')
            tree = ET.parse('/Users/collinchin/nasdaqQuery/StockBrowser/stockApp/static/xml/'+ filename)
            root = tree.getroot()

            # open a file for writing

            Resident_data = open('output.csv', 'w')

            # create the csv writer object

            front = '{http://ws.nasdaqdod.com/services/v1/}'
            csvwriter = csv.writer(Resident_data)
            resident_head = []
            # header = ('Outcome', 'Date', 'Open', 'High', 'Low', 'Close', 'LastSale', 'Volume')
            count = 0
            path = root.find(front + 'EndOfDayPriceCollection')

            for member in path.iter(front + 'EndOfDayPrice'):
                resident = []
                address_list = []
                if count == 0:
                    outcome = member.find(front + 'Outcome').tag
                    resident_head.append(outcome[len(front):])

                    date = member.find(front + 'Date').tag
                    resident_head.append(date[len(front):])

                    open1 = member.find(front + 'Open').tag
                    resident_head.append(open1[len(front):])

                    high = member.find(front + 'High').tag
                    resident_head.append(high[len(front):])

                    low = member.find(front + 'Low').tag
                    resident_head.append(low[len(front):])

                    close = member.find(front + 'Close').tag
                    resident_head.append(close[len(front):])

                    lastsale = member.find(front + 'LastSale').tag
                    resident_head.append(lastsale[len(front):])

                    volume = member.find(front + 'Volume').tag
                    resident_head.append(volume[len(front):])

                    csvwriter.writerow(resident_head)
                    count = count + 1

                outcome = member.find(front + 'Outcome').text
                if (outcome == 'Success'):
                    resident.append(outcome)

                    if (member.find(front + 'Date') != None):
                        date = member.find(front + 'Date').text
                        resident.append(date)

                    open1 = member.find(front + 'Open').text
                    resident.append(float(open1))

                    high = member.find(front + 'High').text
                    resident.append(float(high))

                    low = member.find(front + 'Low').text
                    resident.append(float(low))

                    close = member.find(front + 'Close').text
                    resident.append(float(close))

                    lastsale = member.find(front + 'LastSale').text
                    resident.append(float(lastsale))

                    volume = member.find(front + 'Volume').text
                    resident.append(float(volume))

                    csvwriter.writerow(resident)

            Resident_data.close()

            df = pd.read_csv('output.csv', sep=',', header=None)


            array = np.array(df[1:])

            highLow = np.subtract(array[:,[3]].astype(float), array[:,[4]].astype(float))


            dailyVar = np.divide(highLow, array[:,[2]].astype(float)) * 100
            meanVar = np.average(dailyVar)

            growthRate = (float(array[len(array)-1][5]) - float(array[0][2]))/ float(array[0][2])


            meanVol = np.average(array[:,[7]].astype(float))

            spreadVol = np.std(array[:,[7]].astype(float))

            finalArray = np.vstack((finalArray, np.array([split[0], meanVar, growthRate, meanVol, spreadVol])))

    np.savetxt('finaloutput.csv', finalArray, fmt = "%s", delimiter=',')