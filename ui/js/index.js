/**
 * index.js
 * @author Ad5001 <mail@ad5001.eu>
 * @license NTOSL (View LICENSE.md)
 * @copyright (C) Ad5001 2017
 * @package nbt-editor-server
 */

window.mdc.autoInit();
var toolbar = mdc.toolbar.MDCToolbar.attachTo(document.querySelector('.mdc-toolbar'));
var addFsMenu = new mdc.menu.MDCSimpleMenu(document.querySelector('#addFsMenu'));
toolbar.fixedAdjustElement = document.querySelector('.mdc-toolbar-fixed-adjust');

document.getElementById("inputfile").addEventListener("change", (e) => {
    document.getElementById("loading-bd").style.opacity = ".3";
    setTimeout(function() {
        window.files.saveUploadedFiles(document.getElementById("inputfile").files);
    }, 100);
});

// Drag & drop menu
var filedrag = document.getElementById("dragdrop-bd");

filedrag.addEventListener("dragover", function() { this.style.opacity = 0.3; }, false);
filedrag.addEventListener("dragleave", function() { this.style.opacity = 0; }, false);
filedrag.addEventListener("drop", function() {
    this.style.opacity = 0;
    var files = event.target.files || event.dataTransfer.files;
    window.files.saveUploadedFiles(files);
    event.preventDefault();
    event.stopPropagation();
}, false);

document.getElementById("edit-file-tab-bar-list").addEventListener("click", (event) => {
    if (event.target.classList.contains("close-file")) window.editor.closeTab(event.target.parentElement.getAttribute("data-open-file"));
})

/**
 * File manager menu
 */
// Toggle file manager
document.getElementById("showFileManager").addEventListener("click", function() {
    document.getElementById("file-manager").classList.toggle("hidden");
});
// Toggle Import/add menu
document.getElementById("addFsBtn").addEventListener("click", function() {
    addFsMenu.open = true;
});
// Open file
document.getElementById("fsList").addEventListener("click", (event) => {
    if (event.target.classList.contains("fs-file")) var openFile = new NBTFile(event.target.getAttribute("data-path"), function() {
        window.editor.openTab(openFile);
    });
});



// Caching everything
if ('serviceWorker' in navigator) {
    // Register a service worker hosted at the root of the
    // site using the default scope.
    navigator.serviceWorker.register('../sw.js', { scope: '/' }).then((registration) => {
        snackbar.show({
            message: "Downloading application for offline usage...",
            actionText: "Dismiss",
            timeout: 5000,
            actionHandler: function() {}
        });
        console.log('Service worker registration succeeded:', registration);
    }).catch((error) => {
        console.log('Service worker registration failed:', error);
    });
} else {
    console.log('Service workers are not supported.');
}