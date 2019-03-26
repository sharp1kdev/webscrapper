const puppeteer = require('puppeteer');
const { URL } = require('url');
const fs = require('fs-extra');
const path = require('path');


async function fetch(fetchUrl) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
	
    page.on('response', async (response) => {
      const url = new URL(response.url());
      let dirName = fetchUrl.replace(/https:\/\//, '')
      let filePath = path.resolve(`./${dirName}${url.pathname}`);
      if (path.extname(url.pathname).trim() === '') {
        filePath = `${filePath}/index.html`;
      }
      await fs.outputFile(filePath, await response.buffer());
    });

    await page.goto(fetchUrl, {
      waitUntil: 'networkidle2'
    });
  
    setTimeout(async () => {
      await browser.close();
    }, 60000 * 4);
}

fetch('https://l2oops.com')
 
