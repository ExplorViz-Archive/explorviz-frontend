'use strict';
const assert = require('assert');
var _path = require('path');
const {
    openBrowser, closeBrowser, goto, $, button, text, click, write, screenshot, into, 
    textBox, waitFor,
} = require('taiko');

beforeScenario(async() => await openBrowser({headless: false, args: [ 
        '--disable-gpu',
        '--disable-dev-shm-usage',
        '--disable-setuid-sandbox',
        '--no-first-run',
        '--no-sandbox',
        '--no-zygote',
        '--window-size=1440,900']}
));

gauge.screenshotFn = async function () {
    return await screenshot({encoding: "base64"});
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
gauge.screenshot();
})

step("Open Application", async () => {
await click($('canvas'));

// TODO: Implement double click to open application

await waitFor(2000);
gauge.screenshot();
})

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