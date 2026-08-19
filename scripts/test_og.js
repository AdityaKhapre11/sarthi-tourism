const http = require('http');

function testPage(url) {
  const options = {
    hostname: 'localhost',
    port: 3000,
    path: url,
    // Note: NO bot user-agent. Let's see if our expanded BOT_PATTERNS helps or if we need a user-agent.
    headers: {
      'User-Agent': 'axios/1.6.0'
    }
  };

  http.get(options, (res) => {
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      const ogMatches = data.match(/<meta property="og:[^"]+" content="([^"]+)"/g);
      const twitterMatches = data.match(/<meta name="twitter:[^"]+" content="([^"]+)"/g);
      console.log(`\nURL: ${url}`);
      console.log('OG Meta Tags:', ogMatches);
      console.log('Twitter Meta Tags:', twitterMatches);
    });
  }).on('error', (e) => {
    console.error(`Got error: ${e.message}`);
  });
}

testPage('/');
testPage('/packages/0701ef50-3e65-4902-ac5c-f1ff65571cdb');
