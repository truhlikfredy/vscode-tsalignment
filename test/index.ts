import testIstanbulRunner = require("./istanbultestrunner");

// https://github.com/mochajs/mocha/wiki/Using-mocha-programmatically#set-options
// https://github.com/Microsoft/vscode-mssql
// https://github.com/kenhowardpdx/vscode-gist/pull/10

testIstanbulRunner.configure({
    // reporter: "list",
    ui: "tdd",
    useColors: true,
}, {
    coverConfig: "../coverconfig.json",
});


module.exports = testIstanbulRunner;
