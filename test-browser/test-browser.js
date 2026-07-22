const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  page.on('pageerror', error => {
    console.log('[PAGE ERROR]', error.message);
  });

  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log('[CONSOLE ERROR]', msg.text());
    } else {
      // console.log('[CONSOLE]', msg.text());
    }
  });

  page.on('requestfailed', request => {
    console.log('[REQUEST FAILED]', request.url(), request.failure().errorText);
  });

  try {
    console.log('Navigating to https://akasgatha.vercel.app ...');
    await page.goto('https://akasgatha.vercel.app', { waitUntil: 'networkidle0' });
    console.log('Navigation complete. Waiting 3 seconds for models to render...');
    await new Promise(r => setTimeout(r, 3000));
  } catch (err) {
    console.log('[NAVIGATION ERROR]', err);
  }

  await browser.close();
})();
