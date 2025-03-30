const { execSync } = require('child_process');

// Install Chrome when deploying to Vercel
if (process.env.VERCEL === '1') {
  console.log('Installing Chrome on Vercel...');
  execSync('apt-get update && apt-get install -y chromium-browser');
  process.env.PUPPETEER_EXECUTABLE_PATH = '/usr/bin/chromium-browser';
}
