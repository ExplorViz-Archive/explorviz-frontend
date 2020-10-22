'use strict';
const assert = require('assert');
const fs = require('fs');
const PNG = require('pngjs').PNG;
const pixelmatch = require('pixelmatch');
var _path = require('path');
const {
    openBrowser, closeBrowser, goto, $, button, text, click, write, screenshot, into, 
    textBox, waitFor, evaluate,
} = require('taiko');

beforeScenario(async() => await openBrowser({
    // headless: false, 
    args: [ 
        '--disable-gpu',
        '--disable-dev-shm-usage',
        '--disable-setuid-sandbox',
        '--no-first-run',
        '--no-sandbox',
        '--no-zygote',
        '--window-size=1440,900']}
));

gauge.customScreenshotWriter = async function () {
    const path = _path.join(process.env['gauge_screenshots_dir'], `screenshot-${process.hrtime.bigint()}.png`);
    await screenshot({path});
    return path;
};


afterScenario(async() => await closeBrowser());

step('Navigate to <url>', async url => 
{
    await goto(url)
});

step('Navigate to <url> with timeout <timeout> ms', async (url,timeout) => await goto(url,{timeout:timeout}));

step("Check <heading> exists", async (heading) => assert.ok(await text(heading).exists()));

step("Navigate to ExplorViz", async () => {
const response = await navigateToExplorViz();

assert.strictEqual('OK', response);
});

step("Login", async () => {
    await login();
});

step("Wait for landscape", async () => {
    await waitFor(async () => (await $('button[title="Hide Timeline"]').exists()));
    await click(button({title:"Hide Timeline"}));
    await waitFor(12000);
    await gauge.screenshot();
})

step("Open Application", async () => {
    await evaluate($('canvas'), canvas => {
        function doubleClickApplication(){
            const canvasBCR = canvas.getBoundingClientRect();
            const hammer = canvas.hammer;
        
            hammer.emit('doubletap', {srcEvent: {clientX: canvasBCR.left + 587, clientY: canvasBCR.top + 322, target: canvas}, button: 1});
        }

        doubleClickApplication();
    });
    

    await waitFor(2000);

    await gauge.screenshot();
})

step("Compare screenshots", async () => {
    createDirectory('screenshots/actual');
    createDirectory('screenshots/diff');

    await screenshot($('canvas'), {path: 'screenshots/actual/landscape.png'});

    const img1 = PNG.sync.read(fs.readFileSync('screenshots/expected/landscape.png'));
    const img2 = PNG.sync.read(fs.readFileSync('screenshots/actual/landscape.png'));

    const {width, height} = img1;
    const diff = new PNG({width, height});

    const pixelDiff = pixelmatch(img1.data, img2.data, diff.data, width, height, {threshold: 0.2});

    fs.writeFileSync('screenshots/diff/landscape.png', PNG.sync.write(diff));
    fs.writeFileSync('reports/html-report/images/landscape.png', PNG.sync.write(diff));

    gauge.message("Screen diff:");
    gauge.message('<img src="../images/landscape.png" alt="Report logo">');
    // Force test to fail for testing purpose
    assert(false);
})

function createDirectory(path){
    try {
        fs.mkdirSync(path);
    } catch (e) {
        if (e.code != 'EEXIST') throw e;
    }
}

async function navigateToExplorViz(){
    const response = await goto("localhost:4200");

    return response.status.text;
}

async function login(){
    navigateToExplorViz();

    await write("admin", into(textBox({placeholder: "admin"})));
    await write("password", into(textBox({placeholder: "password"})));
    await click(button("Sign In"));
}