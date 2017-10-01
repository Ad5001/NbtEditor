/**
 * files.js
 * @author Ad5001 <mail@ad5001.eu>
 * @license NTOSL (View LICENSE.md)
 * @copyright (C) Ad5001 2017
 * @package nbt-editor-server
 */
BrowserFS = require("browserfs");
const snackbar = new mdc.snackbar.MDCSnackbar(document.querySelector('.mdc-snackbar'));
/**
 * File system related class.
 */
window.files = {
    /** @type {String[]} */
    extensions: [
        "dat",
        "mca"
    ],
    /** @type {Boolean} */
    filesInitialized: false,


    /**
     * Inits the file system and eveything
     */
    init: function() {

        BrowserFS.install(window);
        BrowserFS.configure({
            fs: "IndexedDB",
            options: {
                storeName: "files"
            }
        }, (e) => {
            if (e) {
                // An error occurred.
                throw e;
            }
            var fs = require('fs');
            Buffer = require('buffer').Buffer;
            // Otherwise, BrowserFS is ready to use!
            require("fs").exists("/files/", (exist) => {
                if (!exist) {
                    require("fs").mkdir("/files/", window.files.addWelcomeFile);
                } else {
                    if (window.fsManager) window.fsManager.init();
                    if (window.editor) window.editor.init();

                }
            });
            // if (window.editor) window.editor.init();
        })
    },

    /**
     * Calls when browserfs is inited and fs is setted up
     */
    addWelcomeFile: (err) => {
        // Telling the rest of the webapp that files were initialized
        window.filesInitialized = true;
        // Adding welcome file
        var xhr = new XMLHttpRequest();
        xhr.addEventListener("readystatechange", (ev) => {
            if (xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {
                // Write the file to the disk for offline usage.
                require("fs").writeFile("/files/Welcome1.0.html", xhr.responseText, (err) => {
                    if (window.editor) {
                        // refreshing the tab with the newest welcome file.
                        window.editor.init();
                        window.fsManager.init();
                        var openFile = new NBTFile(folderPath + fileName, function() {
                            window.editor.openTab(openFile);
                        })
                    }
                });
            }
        });
        xhr.open("GET", "https://nbteditor.mcpe.fun/files/Welcome1.0.php");
        xhr.send();
    },

    /**
     * Saves a file that has just been uploaded
     * 
     * @param {FileList} files
     * @param {function(Error|undefined):void} cb
     */
    saveUploadedFiles: (files, cb) => {
        var invalidFiles = [];
        // Checkiçng for multiple files
        for (var i = 0; i < files.length; i++) {
            var file = files[i];
            var extension = file.name.split(".")[file.name.split(".").length - 1];
            if (window.files.extensions.indexOf(extension) !== -1) {
                /** @type {String} */
                var name = window.files.checkReplacement(file.name, (name) => {
                    var fileReader = new FileReader();

                    // Reading the file
                    fileReader.addEventListener("loadend", (event) => {
                        /** @type {String} base64 data url string */
                        var data = event.target.result;
                        var dataBase64 = data.split("base64");
                        dataBase64.shift();
                        var dataBase64Str = dataBase64.join("base64"); // How many chances are that base64 could be found in a base64 string?
                        // Writing the file into the folder
                        require('fs').writeFile("/files/" + name, dataBase64Str, (err) => {
                            if (err) {
                                cb(err);
                                return;
                            }
                            window.fsManager.refresh();
                            document.getElementById("loading-bd").style.opacity = "0";
                        });
                    });
                    fileReader.readAsDataURL(file);
                });
            } else {
                // Error for invalid file
                snackbar.show({
                    message: "'" + extension + "' is not supported by NbtEditorMobile.",
                    actionText: "Dismiss",
                    timeout: 5000,
                    actionHandler: function() {}
                });
                document.getElementById("loading-bd").style.opacity = "0";
            }
        };
    },


    /**
     * Gets the content from a folder
     * 
     * @param {String} folderPath
     * @param {function(Error, NBTFile[]):void} cb
     */
    getFolderContents: (folderPath, cb) => {
        var filesReturned = [];
        require('fs').readdir(folderPath, (err, files) => {
            if (err) {
                console.log("err: ", err);
            } else {
                var filesCompleted = 0;
                files.forEach((fileName) => {
                    // filesReturned = new NBTFile(folderPath + fileName);
                    filesReturned.push(new NBTFile(folderPath + fileName, function() {
                        filesCompleted++;
                        if (filesReturned.length == filesCompleted) {
                            cb(undefined, filesReturned);
                        }
                    }));
                })
            }
        });
    },


    /**
     * Checks if a file exists, and returns a replacement name or the original one
     * 
     * @param {String} name
     * @param {function(String):void} cb
     */
    checkReplacement: (name, cb) => {
        require('fs').exists("/files/" + name, (exists) => {
            if (exists) {
                var match = name.match(/\((\d+)\)\.(\w+)$/);
                if (match !== null) {
                    /** @type {Number} */
                    var num = parseInt(match[1]);
                    num++;
                    name = name.replace(new RegExp("\\(" + match[1] + "\\)\." + match[2] + "$"), "(" + num + ")." + match[2]);
                } else {
                    name = name.replace(/\.(\w+)$/, " (1).$1");
                }
                window.files.checkReplacement(name, cb);
            } else {
                cb(name);
            }
        });
    }
}
window.files.init();