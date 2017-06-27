import testMochaRunner = require("vscode/lib/testrunner");

// https://github.com/mochajs/mocha/wiki/Using-mocha-programmatically#set-options

testMochaRunner.configure({
    ui: "tdd",
    useColors: true,
});

module.exports = testMochaRunner;
