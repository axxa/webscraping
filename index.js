const puppeteer = require('puppeteer');

const parameters = {
    url: 'https://amazon.com',
    searchfor: 'frutas'
};

(async ()=>{
    const browser = await puppeteer.launch({ headless: false});
    const page = await browser.newPage();
    await page.goto(parameters.url);
    await page.waitForSelector('#nav-search'); //box cointaining search box and search button
    
    await page.type('#twotabsearchtextbox', 'frutas'); // selector id containing search box
    await page.click('#nav-search-submit-text .nav-input'); //click on search button

    await page.waitForSelector(".s-result-list");

    // In amazon there are two search responses:
    // full list: a-size-medium a-color-base a-text-normal
    // grid (matrix): a-size-base-plus a-color-base a-text-normal
    // TODO grab all products listed in all grids
    const products = await page.evaluate(() => {
        const links = Array.from(document.querySelectorAll('.s-result-item'));
        return links.map(link => {
            if (link.querySelector(".a-price-whole")) {
                return {
                    name: link.querySelector(".a-size-base-plus.a-color-base.a-text-normal").textContent,
                    price: parseFloat(link.querySelector(".a-price-whole").textContent),
                    pricefraction: parseFloat(link.querySelector(".a-price-fraction").textContent) * 0.01,
                };
            }
        }).slice(0, 5);
    });
    
    await console.log(products);

    //await browser.close();
})();