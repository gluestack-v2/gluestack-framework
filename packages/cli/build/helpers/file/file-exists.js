"use strict";
const fs = require('fs');
const fileExists = (filePath) => {
    try {
        fs.accessSync(filePath);
        return true;
    }
    catch (err) {
        return false;
    }
};
module.exports = { fileExists };
