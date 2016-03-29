/**
 * Copyright 2014-2016 IBM Corp. All Rights Reserved.
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

// Create the Tradeoff Analytics Client under the 'ta' node, with default options
var taClient = new TradeoffAnalytics('ta');
  
  // Start the client
taClient.start(function(){
  // Upon success, load the problem json...
  $.getJSON('data.json', function(data) {
    // ...and pass it to the client
    taClient.show(data);
  });
    
  // subscribe to events
  taClient.subscribe('onError', function (error) {
    console.log('TA Widget Sent Error: ' + error);
  });
  
  taClient.subscribe('doneClicked', function (op) {
    console.log('final decision is ' + op.name);
  });
  
  taClient.subscribe('compareClicked', function(ops) {
    console.log('comparing options:' + ops.map(function(op){return op.name;}));
  });
  
  taClient.subscribe('problemResolved', function(dillema) {
    var opOps = dillema.resolution.solutions.filter(function(s){return s.status=='FRONT';});
    console.log('Problem Resolved. '+ opOps.length + ' Top options.' );
  });
  
  var clk = taClient.subscribe('optionClicked', function(op) {
    console.log('Clicked. '+ op.name);
  });

  // To cancel subscription, use either:
  //   clk.unsubscribe();
  //   taClient.clearSubscriptions('problemResolved');
  //   taClient.clearAllSubscriptions();         

});