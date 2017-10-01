/**
 * files.js
 * @author Ad5001 <mail@ad5001.eu>
 * @license NTOSL (View LICENSE.md)
 * @copyright (C) Ad5001 2017
 * @package nbt-editor-server
 */

/**
 * Class to symbolize a file.
 * 
 * @class NBTFile
 */
class NBTFile {

    /**
     * Creates an instance of NBTFile.
     * @param {String} path 
     * @param {function()} cb 
     * @memberof NBTFile
     */
    constructor(path, cb) {
        this.path = path;
        var this2 = this;
        this.fileName = path.split("/")[path.split("/").length - 1];
        require("fs").lstat(path, (err, stats) => {
            if (err) throw err;
            this2.stats = stats;
            if (this2.stats.isFile()) {
                this2.extension = this2.fileName.split(".")[this2.fileName.split(".").length - 1];
            } else if (this2.stats.isDirectory()) {
                this2.extension = "folder";
            }
            if (cb) cb(this2);
        });
    }
}