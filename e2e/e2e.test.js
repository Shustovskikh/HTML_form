import puppeteer from 'puppeteer';
import { fork } from 'child_process';

jest.setTimeout(30000); // default puppeteer timeout

describe('Popover functionality', () => {
  let browser = null;
  let page = null;
  let server = null;
  const baseUrl = 'http://localhost:9000';

  beforeAll(async () => {
    server = fork(`${__dirname}/e2e.server.js`);
    await new Promise((resolve, reject) => {
      server.on('error', reject);
      server.on('message', (message) => {
        if (message === 'ok') {
          resolve();
        }
      });
    });

    browser = await puppeteer.launch({
      // headless: false, // show gui
      // slowMo: 250,
      // devtools: true, // show devTools
    });
    page = await browser.newPage();
  });

  afterAll(async () => {
    await browser.close();
    server.kill();
  });

  test('should display and hide popover on button click', async () => {
    await page.goto(baseUrl);

    const button = await page.$('#popoverButton');
    const popover = await page.$('#popover');

    let isVisible = await popover.evaluate((el) => window.getComputedStyle(el).display !== 'none');
    expect(isVisible).toBe(false);

    await button.click();
    isVisible = await popover.evaluate((el) => window.getComputedStyle(el).display !== 'none');
    expect(isVisible).toBe(true);

    await button.click();
    isVisible = await popover.evaluate((el) => window.getComputedStyle(el).display !== 'none');
    expect(isVisible).toBe(false);
  });

  test('should position the popover correctly', async () => {
    await page.goto(baseUrl);

    const button = await page.$('#popoverButton');
    const popover = await page.$('#popover');

    await button.click();

    const buttonBox = await button.boundingBox();
    const popoverBox = await popover.boundingBox();

    expect(popoverBox.y + popoverBox.height).toBeLessThan(buttonBox.y);
  });

  test('should hide popover when clicking outside', async () => {
    await page.goto(baseUrl);

    const button = await page.$('#popoverButton');
    const popover = await page.$('#popover');

    await button.click();

    await page.mouse.click(0, 0);

    const isVisible = await popover.evaluate((el) => window.getComputedStyle(el).display !== 'none');
    expect(isVisible).toBe(false);
  });
});
