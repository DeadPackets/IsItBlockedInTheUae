// TODO: Work on this
/* eslint-disable no-console */
const superagent = require('superagent');
const cheerio = require('cheerio');
const fs = require('fs');

function isBlockedCheck(domain) {
  return new Promise((resolve, reject) => {
    // console.log(`Checking domain ${domain}`);
    superagent
      .get('http://proxy.etisalat.ae')
      .set('Host', domain.trim())
      .end((err, res) => {
        if (err && !res) {
          reject(err);
        } else if (res.status !== 503 && res.status !== 403) {
          if (res.status === 400) {
            // Website is not blocked
            resolve({ didWork: true, isBlocked: false });
          } else {
            reject(err);
          }
        } else {
          // Check if the specific tag is there
          const $ = cheerio.load(res.text);
          if (
            $('div.banner-text h3.english-on').text()
            === 'This website is not accessible in the UAE.'
          ) {
            resolve({
              didWork: true,
              isBlocked: true,
              category: res.text.match(
                /This website was categorized as(?<ignore>.*?): (?<category>.*)/,
              ).groups.category,
            });
          } else if ($('iframe[src="http://proxy.etisalat.ae/"]').length > 0) {
            resolve({
              didWork: true,
              isBlocked: true,
              category: 'null',
              domain,
            });
          } else {
            resolve({ didWork: true, isBlocked: false });
          }
        }
      });
  });
}

fs.readFile(process.argv[2], 'utf8', async (err, content) => {
  if (err) {
    throw err;
  } else {
    const domains = content.split('\n');
    let count = 0;
    console.log(`${domains.length} loaded.`);
    for (let i = 0; i < domains.length; i++) {
      try {
        const result = await isBlockedCheck(domains[i]);
        if (result.isBlocked) {
          fs.appendFileSync('./results.txt', `${result.domain.trim()}\n`, 'utf8');
          console.log(
            `${result.domain.trim()} is blocked (${i})[${++count}/${
              domains.length
            }]!`,
          );
        }
      } catch (e) {
        // do nothing
        // console.log(e);
      }
    }
  }
});
