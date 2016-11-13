# StockSherlock
  
  A wise man once said: "It's elementary my dear Watson!" The same thing can be said about stock trade and comparison.
  Stock Sherlock uses the NASDAQ Data On Demand API to process EndOfDayData.xml files and convert them into monthly data snapshots in the
  form of numpy arrays that are modeled under our metrics: Variability Mean, Growth Rate, Volume Mean, Volume Spread, and Risk. This data
  is condensed and converted into a .csv file that IBM Watson's Tradeoff Analytics API displays in a stock comparison visualization tool.
  
## Stock Comparison Quickstart
  Instant Demo Here: [http://stocksherlock.mybluemix.net/](http://stocksherlock.mybluemix.net/) (Don't worry there's a built in optional tutorial:)
  
  Basic Overview:
  1. Select up to 5 metrics and customize based on maximum or minimum.
  2. Click `HELP ME DECIDE` in the lower right corner.
  3. Narrow your stock options by adjusting the sliders on the left to refine your preferred metric results.
  4. Add your top candidates on the right hand column to the final comparison.
  5. Click `COMPARE` in the lower right corner.
  6. Compare your final candidates by adding them to the final comparison on the right.
  7. Make an informed financial decision based off NASDAQ Data On Demand and IBM Watson Tradeoff Analytics!
  
## How to retrieve a .csv data file for a preferred month
  1. Run `runserver.py` in `/stocksherlock/stockBrowser/runserver.py`
  2. Select stocks to be filtered by NASDAQ API.
  3. Give IBM Watson your `finaloutput.csv` file produced by stockBrowser
  4. Run the StockSherlock comparison tool!
  
  
  
