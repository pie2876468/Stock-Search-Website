const express = require('express')
const app = express()
var request = require('request')
const https = require('https');
const https2 = require('https');
const http = require('http');
var parseString = require('xml2js').parseString;

app.get('/', function(req, res2) {
  var tmp = req.query.idx;
  res2.header('Access-Control-Allow-Origin', '*');
  if(req.query.idx=='autocompleteInfo') {
    var url = 'http://dev.markitondemand.com/MODApis/Api/v2/Lookup/json?input='+req.query.inSymbol;
    http.get(url, (res) => {
      const { statusCode } = res;
      let error;
      if (statusCode !== 200) {
        error = new Error('Request Failed.\n' +
                          `Status Code: ${statusCode}`);
      }
      if (error) {
        console.error(error.message);
        // consume response data to free up memory
        res.resume();
        return;
      }

      res.setEncoding('utf8');
      let rawData = '';
      res.on('data', (chunk) => { rawData += chunk; });
      res.on('end', () => {
        try {
          res2.send(rawData);
        } catch (e) {
        }
      });
    }).on('error', (e) => {
    });
  }
  else if (req.query.idx=='quickSearch') {
    var url = 'https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol='+req.query.inSymbol+'&apikey=6VW1FDDAWV38YQ8A';
    var result = new Object();
    var cnt =0;
    https.get(url, (res) => {
      const { statusCode } = res;
      let error;
      if (statusCode !== 200) {
        error = new Error('Request Failed.\n' +
                          `Status Code: ${statusCode}`);
      }
      if (error) {
        console.error(error.message);
        // consume response data to free up memory
        res.resume();
        return;
      }

      res.setEncoding('utf8');
      let rawData = '';
      res.on('data', (chunk) => { rawData += chunk; });
      res.on('end', () => {
        try {
          //result['InfoTable'] = JSON.parse(rawData);
          result.InfoTable = JSON.parse(rawData);
          cnt++;
          if(cnt==2) res2.send(result);
        } catch (e) {
        }
      });
    }).on('error', (e) => {
    });
    url2 = 'https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&interval=1min&symbol='+req.query.inSymbol+'&apikey=6VW1FDDAWV38YQ8A';
    https2.get(url2, (res) => {
      const { statusCode } = res;
      let error;
      if (statusCode !== 200) {
        error = new Error('Request Failed.\n' +
                          `Status Code: ${statusCode}`);
      }
      if (error) {
        console.error(error.message);
        // consume response data to free up memory
        res.resume();
        return;
      }

      res.setEncoding('utf8');
      let rawData2 = '';
      res.on('data', (chunk) => { rawData2 += chunk; });
      res.on('end', () => {
        try {
          result.InfoTableIntraday = JSON.parse(rawData2);
          cnt++;
          if(cnt==2) res2.send(result);
        } catch (e) {
        }
      });
    }).on('error', (e) => {
    });
  }
  else if (req.query.idx=='stocktInfo0') {
    var url = 'https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol='+req.query.inSymbol+'&apikey=6VW1FDDAWV38YQ8A';
    var result = new Object();
    var cnt =0;
    https.get(url, (res) => {
      const { statusCode } = res;
      let error;
      if (statusCode !== 200) {
        error = new Error('Request Failed.\n' +
                          `Status Code: ${statusCode}`);
      }
      if (error) {
        console.error(error.message);
        // consume response data to free up memory
        res.resume();
        return;
      }

      res.setEncoding('utf8');
      let rawData = '';
      res.on('data', (chunk) => { rawData += chunk; });
      res.on('end', () => {
        try {
          //result['InfoTable'] = JSON.parse(rawData);
          result.InfoTable = JSON.parse(rawData);
          res2.send(result);
        } catch (e) {
        }
      });
    }).on('error', (e) => {
    });
  }
  else if (req.query.idx=='stocktInfo1') {
    var url = 'https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&interval=1min&symbol='+req.query.inSymbol+'&apikey=6VW1FDDAWV38YQ8A';
    var result = new Object();
    var cnt =0;
    https.get(url, (res) => {
      const { statusCode } = res;
      let error;
      if (statusCode !== 200) {
        error = new Error('Request Failed.\n' +
                          `Status Code: ${statusCode}`);
      }
      if (error) {
        console.error(error.message);
        // consume response data to free up memory
        res.resume();
        return;
      }

      res.setEncoding('utf8');
      let rawData = '';
      res.on('data', (chunk) => { rawData += chunk; });
      res.on('end', () => {
        try {
          //result['InfoTable'] = JSON.parse(rawData);
          result.InfoTableIntraday = JSON.parse(rawData);
          res2.send(result);
        } catch (e) {
        }
      });
    }).on('error', (e) => {
    });
  }
  else if (req.query.idx=='stocktInfo2') {
    var url = 'https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol='+req.query.inSymbol+'&outputsize=full&apikey=6VW1FDDAWV38YQ8A';
    var result = new Object();
    var cnt =0;
    https.get(url, (res) => {
      const { statusCode } = res;
      let error;
      if (statusCode !== 200) {
        error = new Error('Request Failed.\n' +
                          `Status Code: ${statusCode}`);
      }
      if (error) {
        console.error(error.message);
        // consume response data to free up memory
        res.resume();
        return;
      }

      res.setEncoding('utf8');
      let rawData = '';
      res.on('data', (chunk) => { rawData += chunk; });
      res.on('end', () => {
        try {
          //result['InfoTable'] = JSON.parse(rawData);
          result.InfoTableHistorical = JSON.parse(rawData);
          res2.send(result);
        } catch (e) {
        }
      });
    }).on('error', (e) => {
    });
  }
  else if (tmp=="SMA") {
    var url = 'https://www.alphavantage.co/query?function='+tmp+'&symbol='+req.query.inSymbol+'&interval=daily&time_period=10&series_type=open&apikey=Z7S2MC67HC8S44AS';
    var result = new Object();
    var cnt =0;
    https.get(url, (res) => {
      const { statusCode } = res;
      let error;
      if (statusCode !== 200) {
        error = new Error('Request Failed.\n' +
                          `Status Code: ${statusCode}`);
      }
      if (error) {
        console.error(error.message);
        // consume response data to free up memory
        res.resume();
        return;
      }

      res.setEncoding('utf8');
      let rawData = '';
      res.on('data', (chunk) => { rawData += chunk; });
      res.on('end', () => {
        try {
          //result['InfoTable'] = JSON.parse(rawData);
          result.SMA = JSON.parse(rawData);
          res2.send(result);
        } catch (e) {
        }
      });
    }).on('error', (e) => {
    });
  }
  else if (tmp=="EMA") {
    var url = 'https://www.alphavantage.co/query?function='+tmp+'&symbol='+req.query.inSymbol+'&interval=daily&time_period=10&series_type=open&apikey=Z7S2MC67HC8S44AS';
    var result = new Object();
    var cnt =0;
    https.get(url, (res) => {
      const { statusCode } = res;
      let error;
      if (statusCode !== 200) {
        error = new Error('Request Failed.\n' +
                          `Status Code: ${statusCode}`);
      }
      if (error) {
        console.error(error.message);
        // consume response data to free up memory
        res.resume();
        return;
      }

      res.setEncoding('utf8');
      let rawData = '';
      res.on('data', (chunk) => { rawData += chunk; });
      res.on('end', () => {
        try {
          //result['InfoTable'] = JSON.parse(rawData);
          result.EMA = JSON.parse(rawData);
          res2.send(result);
        } catch (e) {
        }
      });
    }).on('error', (e) => {
    });
  }
  else if (tmp=="STOCH") {
    var url = 'https://www.alphavantage.co/query?function='+tmp+'&symbol='+req.query.inSymbol+'&interval=daily&time_period=10&series_type=open&apikey=Z7S2MC67HC8S44AS';
    var result = new Object();
    var cnt =0;
    https.get(url, (res) => {
      const { statusCode } = res;
      let error;
      if (statusCode !== 200) {
        error = new Error('Request Failed.\n' +
                          `Status Code: ${statusCode}`);
      }
      if (error) {
        console.error(error.message);
        // consume response data to free up memory
        res.resume();
        return;
      }

      res.setEncoding('utf8');
      let rawData = '';
      res.on('data', (chunk) => { rawData += chunk; });
      res.on('end', () => {
        try {
          //result['InfoTable'] = JSON.parse(rawData);
          result.STOCH = JSON.parse(rawData);
          res2.send(result);
        } catch (e) {
        }
      });
    }).on('error', (e) => {
    });
  }
  else if (tmp=="RSI") {
    var url = 'https://www.alphavantage.co/query?function='+tmp+'&symbol='+req.query.inSymbol+'&interval=daily&time_period=10&series_type=open&apikey=Z7S2MC67HC8S44AS';
    var result = new Object();
    var cnt =0;
    https.get(url, (res) => {
      const { statusCode } = res;
      let error;
      if (statusCode !== 200) {
        error = new Error('Request Failed.\n' +
                          `Status Code: ${statusCode}`);
      }
      if (error) {
        console.error(error.message);
        // consume response data to free up memory
        res.resume();
        return;
      }

      res.setEncoding('utf8');
      let rawData = '';
      res.on('data', (chunk) => { rawData += chunk; });
      res.on('end', () => {
        try {
          //result['InfoTable'] = JSON.parse(rawData);
          result.RSI = JSON.parse(rawData);
          res2.send(result);
        } catch (e) {
        }
      });
    }).on('error', (e) => {
    });
  }
  else if (tmp=="ADX") {
    var url = 'https://www.alphavantage.co/query?function='+tmp+'&symbol='+req.query.inSymbol+'&interval=daily&time_period=10&series_type=open&apikey=SO4BW560CSMQV20V';
    var result = new Object();
    var cnt =0;
    https.get(url, (res) => {
      const { statusCode } = res;
      let error;
      if (statusCode !== 200) {
        error = new Error('Request Failed.\n' +
                          `Status Code: ${statusCode}`);
      }
      if (error) {
        console.error(error.message);
        // consume response data to free up memory
        res.resume();
        return;
      }

      res.setEncoding('utf8');
      let rawData = '';
      res.on('data', (chunk) => { rawData += chunk; });
      res.on('end', () => {
        try {
          //result['InfoTable'] = JSON.parse(rawData);
          result.ADX = JSON.parse(rawData);
          res2.send(result);
        } catch (e) {
        }
      });
    }).on('error', (e) => {
    });
  }
  else if (tmp=="CCI") {
    var url = 'https://www.alphavantage.co/query?function='+tmp+'&symbol='+req.query.inSymbol+'&interval=daily&time_period=10&series_type=open&apikey=SO4BW560CSMQV20V';
    var result = new Object();
    var cnt =0;
    https.get(url, (res) => {
      const { statusCode } = res;
      let error;
      if (statusCode !== 200) {
        error = new Error('Request Failed.\n' +
                          `Status Code: ${statusCode}`);
      }
      if (error) {
        console.error(error.message);
        // consume response data to free up memory
        res.resume();
        return;
      }

      res.setEncoding('utf8');
      let rawData = '';
      res.on('data', (chunk) => { rawData += chunk; });
      res.on('end', () => {
        try {
          //result['InfoTable'] = JSON.parse(rawData);
          result.CCI = JSON.parse(rawData);
          res2.send(result);
        } catch (e) {
        }
      });
    }).on('error', (e) => {
    });
  }
  else if (tmp=="BBANDS") {
    var url = 'https://www.alphavantage.co/query?function='+tmp+'&symbol='+req.query.inSymbol+'&interval=daily&time_period=10&series_type=open&apikey=SO4BW560CSMQV20V';
    var result = new Object();
    var cnt =0;
    https.get(url, (res) => {
      const { statusCode } = res;
      let error;
      if (statusCode !== 200) {
        error = new Error('Request Failed.\n' +
                          `Status Code: ${statusCode}`);
      }
      if (error) {
        console.error(error.message);
        // consume response data to free up memory
        res.resume();
        return;
      }

      res.setEncoding('utf8');
      let rawData = '';
      res.on('data', (chunk) => { rawData += chunk; });
      res.on('end', () => {
        try {
          //result['InfoTable'] = JSON.parse(rawData);
          result.BBANDS = JSON.parse(rawData);
          res2.send(result);
        } catch (e) {
        }
      });
    }).on('error', (e) => {
    });
  }
  else if (tmp=="MACD") {
    var url = 'https://www.alphavantage.co/query?function='+tmp+'&symbol='+req.query.inSymbol+'&interval=daily&time_period=10&series_type=open&apikey=SO4BW560CSMQV20V';
    var result = new Object();
    var cnt =0;
    https.get(url, (res) => {
      const { statusCode } = res;
      let error;
      if (statusCode !== 200) {
        error = new Error('Request Failed.\n' +
                          `Status Code: ${statusCode}`);
      }
      if (error) {
        console.error(error.message);
        // consume response data to free up memory
        res.resume();
        return;
      }

      res.setEncoding('utf8');
      let rawData = '';
      res.on('data', (chunk) => { rawData += chunk; });
      res.on('end', () => {
        try {
          //result['InfoTable'] = JSON.parse(rawData);
          result.MACD = JSON.parse(rawData);
          res2.send(result);
        } catch (e) {
        }
      });
    }).on('error', (e) => {
    });
  }
  else if (tmp=="News") {
    var url = 'https://seekingalpha.com/api/sa/combined/'+req.query.inSymbol+'.xml';
    var result = new Object();
    var cnt =0;
    https.get(url, (res) => {
      const { statusCode } = res;
      let error;
      if (statusCode !== 200) {
        error = new Error('Request Failed.\n' +
                          `Status Code: ${statusCode}`);
      }
      if (error) {
        console.error(error.message);
        // consume response data to free up memory
        res.resume();
        return;
      }

      res.setEncoding('utf8');
      let rawData = '';
      res.on('data', (chunk) => { rawData += chunk; });
      res.on('end', () => {
        try {
          //result['InfoTable'] = JSON.parse(rawData);
          var tmpResult
          var tmpdate
          tmpArray = []
          var cnt = 0;
          parseString(rawData, function (err, tmpResult) {
             for (var ii = 0; ii <= 10; ii++) {
               var tmpStr = tmpResult['rss']['channel'][0]['item'][ii]['link']
               tmpStr = tmpStr.toString().substr(0, 33)
               if(tmpStr=='https://seekingalpha.com/article/') {
                 tmpdate = tmpResult['rss']['channel'][0]['item'][ii]['pubDate']
                 tmpdate = tmpdate.toString()
                 tmpdate = tmpdate.substr(0,tmpdate.length-5);
                 var tmpElmt = {'Title':tmpResult['rss']['channel'][0]['item'][ii]['title'],
                 'Link':tmpResult['rss']['channel'][0]['item'][ii]['link'],
                 'Author':tmpResult['rss']['channel'][0]['item'][ii]['sa:author_name'],
                 'Date': tmpdate}
                 tmpArray.push(tmpElmt)
                 cnt++
               }
               if(cnt==5) break
             }
          });
          result.News = tmpArray
          res2.send(result)
        } catch (e) {
        }
      });
    }).on('error', (e) => {
    });
  }
  else {
    res2.send("Wrong Input");
  }
});

app.listen(3000, () => console.log('Server running on port 3000'))
