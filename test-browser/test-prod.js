const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

(async () => {
  const cachePath = path.join(process.env.USERPROFILE, '.cache', 'puppeteer', 'chrome');
  let execPath = '';
  if (fs.existsSync(cachePath)) {
      const dirs = fs.readdirSync(cachePath);
      for (const d of dirs) {
          const p = path.join(cachePath, d, 'chrome-win64', 'chrome.exe');
          if (fs.existsSync(p)) { execPath = p; break; }
      }
  }

  if (!execPath) {
      console.log("Chrome not found. Please install.");
      return;
  }

  const browser = await puppeteer.launch({ executablePath: execPath, headless: 'new' });
  const page = await browser.newPage();

  const errors = [];
  page.on('pageerror', e => errors.push('[PAGE ERROR] ' + e.message));
  page.on('console', msg => {
    if (msg.type() === 'error') errors.push('[CONSOLE ERROR] ' + msg.text());
  });

  try {
    await page.goto('https://akasgatha.vercel.app', { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 2000));
  } catch(e) {}

  console.log("--- BROWSER ERRORS ---");
  errors.forEach(e => console.log(e));
  
  await browser.close();
})();
