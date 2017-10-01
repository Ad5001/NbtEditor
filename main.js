/**
 * main.js
 * @author Ad5001 <mail@ad5001.eu>
 * @license NTOSL (View LICENSE.md)
 * @copyright (C) Ad5001 2017
 * @package nbt-editor-server
 */
var express = require('express');
var fs = require('fs');
var os = require("os");
var path = require("path");
var __homedir = os.homedir();
var app = express();

function launchApp() {
    // Includes files
    app.use('/', express.static(path.join(__dirname, "ui")));

    var serv = app.listen(6478);
}

launchApp();