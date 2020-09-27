const {
    write,focus, textBox, into,
} = require('taiko');
var _selectors = require('./selectors')

step("Write <text>", async function(text) {
	return write(text)
});

step("Focus <table>", async function(table) {
	return await focus(_selectors.getElement(table))
});

step("Write <inputText> into textbox with placeholder <placeholderText>", async function(inputText, placeholderText) {
	await write(inputText, into(textBox({placeholder: placeholderText})));
});