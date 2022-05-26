const puppeteer = require('puppeteer');
const url = 'https://puppeteer.github.io/puppeteer/';
const selector = 'h6 a[target=_blank]';


const listPages = async (browser) => {
    const pages = await browser.pages();

    console.log(`\nTotal ${pages.length} pages`)
    let ix = 0;
    for (let x of pages) {
        const title = await x.title();
        console.log(`Page ${++ix}: ${title}`);
    }
};

(async () => {
    const browser = await puppeteer.launch({
        headless: false,
        slowMo: 500,
        devtools: true
    });
    const page = await browser.newPage();
    await page.goto(url);

    console.log('Page opened')

    await listPages(browser);

    const linkText = await page.$eval(selector, (link) => link.textContent);
    const linkUrl = await page.$eval(selector, (link) => link.getAttribute('href'));

    console.log(`Clicking a link with text = "${linkText}" and url = "${linkUrl}"`);

    await page.click(selector);

    console.log('Waiting for target with the link');

    await browser.waitForTarget(target => target.url() === linkUrl);
    await listPages(browser);

    await browser.close();
})();
