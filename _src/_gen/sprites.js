const puppeteer = require('puppeteer');
const fs = require('fs').promises;
const path = require('path');

(async() => {
    // Launch a new headless browser instance
    const browser = await puppeteer.launch({
        headless: true,
        devtools: true,
        args: [
            '--disable-web-security',
            '--disable-features=IsolateOrigins',
            '--disable-site-isolation-trials'
        ]
    });

    // Open a new page and navigate to the sample HTML file
    const page = await browser.newPage();
    page
        .on('console', message =>
            console.log(`${message.type().substr(0, 3).toUpperCase()} ${message.text()}`))
        .on('pageerror', ({ message }) => console.log(message))
        .on('response', response =>
            console.log(`${response.status()} ${response.url()}`))
        .on('requestfailed', request =>
            console.log(`${request.failure().errorText} ${request.url()}`))
    await page.setViewport({ width: 1024, height: 1024 });
    await page.goto('file://' + __dirname + '/sprites.html');

    const contentDir = path.join(__dirname, '../_data/');
    const imgDir = path.join(__dirname, '../images/figures');
    await fs.rm(imgDir, { recursive: true, force: true });
    const files = await fs.readdir(contentDir);
    for (const file of files) {
        if (path.extname(file).toLowerCase() !== '.json') {
            continue;
        }
        if (file.includes('navigation')) {
            continue;
        }
        const json = JSON.parse(await fs.readFile(path.join(contentDir, file)));

        for (let i = 0; i < json.length; i++) {
            const section = json[i];
            const outputDir = path.join(imgDir, section['img_root']);
            await fs.mkdir(outputDir, { recursive: true });
            for (let j = 0; j < section['figures'].length; j++) {
                const figure = section['figures'][j];
                const outputFile = path.join(outputDir, figure['filename']);

                await page.evaluate(`
                    window.snakeUpdate('${figure['data']}', ${figure['rotation']});
                `);

                await page.screenshot({
                    path: outputFile,
                    omitBackground: true
                });
            }
        }
    }

    // Close the browser instance
    await browser.close();
})();