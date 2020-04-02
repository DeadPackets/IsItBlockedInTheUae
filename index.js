/* eslint-disable no-console */
const superagent = require('superagent');
const cheerio = require('cheerio');
const express = require('express');
const bodyParser = require('body-parser');

// Initialize express
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));

// Initialize handlebars
const handlebars = require('express-handlebars');


/*
 The magical function that does all the work
 There are two approaches to this problem: Fuzzy hash matching (better) or HTML querying
 For now, I will implement HTML querying
*/
function isBlockedCheck(domain, cb) {
  superagent
    .get('http://proxy.etisalat.ae')
    .set('Host', domain)
    .end((err, res) => {
      if (err && (res.status !== 503 && res.status !== 403)) {
        if (res.status === 400) {
          // Website is not blocked
          cb(true, false);
        } else {
          cb(false, false, false, false, err);
        }
      } else {
        // Check if the specific tag is there
        const $ = cheerio.load(res.text);
        if ($('div.banner-text h3.english-on').text() === 'This website is not accessible in the UAE.') {
          cb(true, true, res.text.match(/This website was categorized as(?<ignore>.*?): (?<category>.*)/).groups.category);
        } else if ($('iframe[src="http://proxy.etisalat.ae/"]').length > 0) {
          cb(true, true, 'null');
        } else {
          cb(true, false);
        }
      }
    });
}

app.set('view engine', 'handlebars');
app.engine('handlebars', handlebars());

app.get('/', (_req, res) => {
  res.render('index');
});

app.post('/', (req, res) => {
  // TODO: Check if the parameter is a valid domain and reject it if it's incorrect
  console.log(req.body);
  if (req.body.domain) {
    if (/^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$/.test(req.body.domain)) {
      isBlockedCheck(req.body.domain, (didWork, isBlocked, category, err) => {
        res.render('index', {
          didWork, isBlocked, category, domain: req.body.domain, err,
        });
      });
    } else {
      res.render('index', {
        err: 'Invalid domain!',
      });
    }
  } else {
    res.render('index', {
      err: 'Missing domain!',
    });
  }
});

app.listen('80');
