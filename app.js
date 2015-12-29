/**
 * Copyright 2014-2015 IBM Corp. All Rights Reserved.
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

var express = require('express'),
    proxyMiddleware = require('http-proxy-middleware'),
    bluemix = require('./config/bluemix'),
    extend = require('util')._extend;

// Bootstrap application settings
var app = express();
app.use('/',express.static(__dirname + '/public'));

var defaultCredentials = {
    version: 'v1',
    username: '<username>',
    password: '<password>',
    url:"http://localhost:8180/tradeoff-analytics/api"
};
// if bluemix credentials exists, then override local
var credentials = extend(defaultCredentials, bluemix.getServiceCreds('tradeoff_analytics')); 

//Create the service wrapper
var taProxy = proxyMiddleware('/tradeoff-analytics-proxy', {
  target: credentials.url +'/' + credentials.version,
  auth: credentials.username+':'+credentials.password,
  pathRewrite: {
    '^/tradeoff-analytics-proxy/dilemmas' : '/dilemmas',
    '^/tradeoff-analytics-proxy/events' : '/events'
  },
  onProxyReq: function(proxyReq, req, res) {
    // add ip address if client sent metadata
    var metadata = req.header('x-watson-metadata');
    if (metadata) {
      metadata += "client-ip:" + req.ip;
      proxyReq.setHeader('x-watson-metadata', metadata);
    }
  },
  onError: function (err, req, res) {
    res.writeHead(502, {
      'Content-Type': 'text/plain'
    });
    res.end('Error connecting to Watson Tradeoff Analytics');
  }
});

app.use(taProxy);

var port = process.env.VCAP_APP_PORT || 2000;
app.listen(port);
console.log('listening at:', port);
