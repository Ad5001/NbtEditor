/**
 * files.js
 * @author Ad5001 <mail@ad5001.eu>
 * @license NTOSL (View LICENSE.md)
 * @copyright (C) Ad5001 2017
 * @package nbt-editor-server
 */
var fs;
window.editor = {

    /**
     * Renderable classes list by extension
     * 
     * @type {{*:Renderable}}
     */
    renderableClasses: {
        "dat": DatFile,
        "html": HTMLRender,
    },

    inited: false,

    /**
     * Tab bar MDC Element
     */
    editorTabBar: new mdc.tabs.MDCTabBar(document.querySelector('#edit-file-tab-bar-list')),

    /**
     * HTML of tab contents for no rerendering
     */
    tabsContents: {},

    /**
     * Renderable classes list
     */
    tabsClasses: {},

    /** Buffer for file writing to be sure that the page isn't closed while saving */
    writing: 0,

    /**
     * Inits the editor
     */
    init: () => {
        Buffer = require("buffer").Buffer;
        fs = require("fs");
        fs.exists("/tabs", (exists) => {
            if (!exists) {
                fs.mkdir("/tabs/", (err) => {});
            } else {
                window.editor.restoreTabs();
            }
            window.editor.redefineTabs();
            setInterval(function() {
                if (window.editor.editorTabBar.activeTab) {
                    var openedFilePath = window.editor.editorTabBar.activeTab.root_.getAttribute("data-open-file");
                    window.editor.saveTabContents(openedFilePath, document.getElementById("editor").innerHTML);
                    window.editor.tabsClasses[openedFilePath].isCurrentlyEdited(); // TODO: Mark file as edited (dot?)
                }
            }, 3000);
        });
    },

    /**
     * Open file ${tabFilePath}.
     * Adds a tab then associate it's rendering instance.
     * 
     * @param {NBTFile} tabFilePath
     */
    openTab: (tabFilePath) => {
        window.editor.addTabToList(tabFilePath);
        // Check if tab is cached. If so, then try restoring tabs.
        if (window.editor.renderableClasses[tabFilePath.extension] && !window.editor.tabsClasses[tabFilePath.path]) window.editor.tabsClasses[tabFilePath.path] = new window.editor.renderableClasses[tabFilePath.extension](tabFilePath, {});
        if (!window.editor.tabsContents[tabFilePath.path]) {
            window.editor.tabsClasses[tabFilePath.path].render();
        } else {
            document.getElementById("editor").innerHTML = window.editor.tabsContents[tabFilePath.path].toString();
            window.editor.tabsClasses[tabFilePath.path].restore();
        }
        // Saving opened tab
        localStorage.setItem("selectedTab", tabFilePath.path);
    },

    /**
     * Adds tab for ${tabFilePath}
     * If file is already opened and not focused, focuses it.
     * If file is open and focus, refreshes it.
     * 
     * @param {NBTFile} tabFilePath
     */
    addTabToList: (tabFilePath) => {
        var tabFile = document.querySelector('#edit-file-tab-bar-list>.mdc-tab[data-open-file="' + tabFilePath.path + '"]');
        if (document.querySelector("#edit-file-tab-bar-list>.mdc-tab.mdc-tab--active")) document.querySelector("#edit-file-tab-bar-list>.mdc-tab.mdc-tab--active").classList.remove("mdc-tab--active");
        if (!tabFile) {
            document.getElementById("edit-file-tab-bar-list").innerHTML += `<div class="mdc-tab mdc-tab--active" data-open-file="${tabFilePath.path}" data-type="${tabFilePath.extension}">${tabFilePath.fileName}<i class="fa fa-times close-file"></i></div>`;
            window.editor.redefineTabs();
            tabFile = document.querySelector('#edit-file-tab-bar-list>.mdc-tab[data-open-file="' + tabFilePath.path + '"]');
        }
        tabFile.classList.add("mdc-tab--active");
    },

    /**
     * Redefine tabs
     */
    redefineTabs: function() {
        var transform = document.getElementById("edit-file-tab-bar-list").style.transform;
        window.editor.editorTabBar = new mdc.tabs.MDCTabBar(document.querySelector('#edit-file-tab-bar-list'));
        window.editor.editorTabBar.scroller = new mdc.tabs.MDCTabBarScroller(document.querySelector('#edit-file-tab-bar-scroller'));
        window.editor.editorTabBar.listen("MDCTabBar:change", (event) => {
            var tabs = window.editor.editorTabBar;
            // Check if tab is cached. If so, then try restoring tabs.
            if (!window.editor.tabsContents[tabs.activeTab.root_.getAttribute("data-open-file")]) {
                var NBT = new NBTFile(tabs.activeTab.root_.getAttribute("data-open-file"), window.editor.openTab);
            } else {
                document.getElementById("editor").innerHTML = window.editor.tabsContents[tabs.activeTab.root_.getAttribute("data-open-file")].toString();
                window.editor.tabsClasses[tabs.activeTab.root_.getAttribute("data-open-file")].restore();
            }
        });
        document.getElementById("edit-file-tab-bar-list").style.transform = transform;
    },

    /**
     * Closes a tab by it's file
     * 
     * @param {String} filePath
     */
    closeTab: (filePath) => {
        var tab = document.querySelector('#edit-file-tab-bar-list>.mdc-tab[data-open-file="' + filePath + '"]');
        if (tab) {
            // Remove tab caching
            filePath = filePath.replace(/\$/g, "$1").replace(/\//g, "$2");
            delete window.editor.tabsContents[filePath];
            delete window.editor.tabsClasses[filePath];
            window.editor.writing++;
            fs.unlink("/tabs/" + filePath, (err) => {
                if (err) throw err;
                window.editor.writing--;
            });
            // If tab is selected, switch to previous tab. If no previous tab, switch to the next one. If no tab after, that means no tabs are opened.
            try {
                if (window.editor.editorTabBar.activeTab.root_.getAttribute("data-open-file") == filePath) {
                    if (window.editor.editorTabBar.activeTabIndex !== 0) {
                        window.editor.openTab(new NBTFile(window.editor.editorTabBar.tabs[window.editor.editorTabBar.activeTabIndex - 1].root_.getAttribute("data-open-file")));
                        window.editor.editorTabBar.tabs[window.editor.editorTabBar.activeTabIndex - 1].root_.classList.add("mdc-tab--active");
                        localStorage.setItem("selectedTab", window.editor.editorTabBar.tabs[window.editor.editorTabBar.activeTabIndex - 1].root_.getAttribute("data-open-file"));
                    } else if (window.editor.editorTabBar.tabs[window.editor.editorTabBar.activeTabIndex + 1]) {
                        window.editor.openTab(new NBTFile(window.editor.editorTabBar.tabs[window.editor.editorTabBar.activeTabIndex + 1].root_.getAttribute("data-open-file")));
                        window.editor.editorTabBar.tabs[window.editor.editorTabBar.activeTabIndex + 1].root_.classList.add("mdc-tab--active");
                        localStorage.setItem("selectedTab", window.editor.editorTabBar.tabs[window.editor.editorTabBar.activeTabIndex + 1].root_.getAttribute("data-open-file"));
                    } else {
                        document.getElementById("editor").innerHTML = "<p style='color: var(--mdc-theme-text-disabled-on-primary, #757575);'>No opened files</p>"
                        localStorage.setItem("selectedTab", 0);
                    }
                }
                tab.remove();
                window.editor.redefineTabs();
            } catch (e) {
                console.log(e);
            }
        }
    },



    /**
     * Saves tabs contents
     * 
     * @param {String} filePath
     * @param {*} contents
     */
    saveTabContents: (filePath, contents) => {
        window.editor.tabsContents[filePath] = contents;
        filePath = "/tabs/" + filePath.replace(/\$/g, "$1").replace(/\//g, "$2");
        window.editor.writing++;
        fs.writeFile(filePath, contents, (err) => {
            if (err) throw err;
            window.editor.writing--;
        })
    },



    /**
     * Fetches tabs contents & adds it to the tabs cache and list
     * 
     * @param {String} filePath
     */
    restoreTabContents: (filePath) => {
        var oldSelected = localStorage.getItem("selectedTab");
        if (oldSelected) require("fs").readFile(filePath, (err, data) => {
            if (err) throw err;
            filePath = filePath.split("/").slice(-1).pop().replace(/\$1/g, "$").replace(/\$2/g, "/");
            window.editor.tabsContents[filePath] = data;
            var nbt = new NBTFile(filePath, function() {
                window.editor.addTabToList(nbt);
                window.editor.tabsClasses[nbt.path] = new window.editor.renderableClasses[nbt.extension](nbt, {});
                if (filePath == oldSelected) {
                    document.getElementById("editor").innerHTML = data;
                    window.editor.tabsClasses[nbt.path].restore();
                }
            });
        })
    },

    /**
     * Fetches all cached tabs and restores them.
     */
    restoreTabs: function() {
        fs.readdir("/tabs/", (err, files) => {
            if (err) throw err;
            files.forEach((elem) => {
                window.editor.restoreTabContents("/tabs/" + elem);
            })
        })
    }

}