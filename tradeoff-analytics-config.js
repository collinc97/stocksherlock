/**
 * Copyright 2014 IBM Corp. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

var watson = require('watson-developer-cloud'),
    extend = require('util')._extend;

var defaultConnectionDetails = {
    url: 'https://gateway.watsonplatform.net/tradeoff-analytics/api/v1',
    version: 'v1'
};

module.exports = {
  setupToken: function(app,credentials) {
    // override defaults
    credentials = extend(defaultConnectionDetails, credentials);  
    //obtain credentials from bluemix environment variable VCAP_SERVICES
    credentials = extend(credentials, getServiceCreds('tradeoff_analytics')); 
    var params = {
      url: credentials.url
    };
  
    var authorization = watson.authorization(credentials);

    app.post('/tradeoff-analytics-token', function(req, res) {
      authorization.getToken(params, function (err, token) {
        if (!token) {
          console.log('error:', err);
          res.status(err.code).send(err.error);
        } else {
          res.send(token);
        }
      });
    });
  },
  
  setupProxy: function(app,credentials) {
    // override defaults
    credentials = extend(defaultConnectionDetails, credentials);  
    //obtain credentials from bluemix environment variable VCAP_SERVICES
    credentials = extend(credentials, getServiceCreds('tradeoff_analytics')); 
    
    // Create the service wrapper
    var tradeoffAnalytics = watson.tradeoff_analytics(credentials);
    
    // Configure Express for json messages
    var bodyParser = require('body-parser');
    app.use(bodyParser.json({limit: '50mb'}));
    app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
    
    // set up proxy for dilemmas service
    app.post('/tradeoff-analytics-proxy/dilemmas/', function(req, res) {
      var params = extend(req.body);
      params.metadata_header = getMetadata(req);
      
      tradeoffAnalytics.dilemmas(params, function(err, dilemma) {
        if (err) 
          return res.status(Number(err.code) || 502).send(err.error || err.message || 'Error processing the request');
        else
          return res.json(dilemma);
      });
    });

    // set up proxy for events service
    app.post('/tradeoff-analytics-proxy/events/', function(req, res) {
      var params = extend(req.body);
      params.metadata_header = getMetadata(req);
      
      tradeoffAnalytics.events(params, function(err) {
        if (err)
          return res.status(Number(err.code) || 502).send(err.error || err.message || 'Error forwarding events');
        else
          return res.send();
      });
    });

    function getMetadata(req) {
      var metadata = req.header('x-watson-metadata');
      if (metadata) {
        metadata += "client-ip:" + req.ip;
      }
      return metadata;
    }
  }
}

/**
 * if VCAP_SERVICES exists then it returns username, password and url
 * for the first service that stars with 'name' or {} otherwise
 * @param  String name, service name
 * @return {Object} the service credentials or {} if
 * name is not found in VCAP_SERVICES
 */
function getServiceCreds(name) {
    if (process.env.VCAP_SERVICES) {
      var services = JSON.parse(process.env.VCAP_SERVICES);
      for (var service_name in services) {
          if (service_name.indexOf(name) === 0) {
              var service = services[service_name][0];
              return {
                  url: service.credentials.url,
                  username: service.credentials.username,
                  password: service.credentials.password
              };
          }
      }
    }
    return {};
};
