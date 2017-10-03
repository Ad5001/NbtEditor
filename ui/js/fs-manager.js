/**
 * files.js
 * @author Ad5001 <mail@ad5001.eu>
 * @license NTOSL (View LICENSE.md)
 * @copyright (C) Ad5001 2017
 * @package nbt-editor-server
 */

window.fsManager = {

    inited: false,

    /** 
     * Currently selected files to be sure that they are remembered until no need for them anymore.
     */
    selectedFiles: [],

    removeFilesDialog: new mdc.dialog.MDCDialog(document.querySelector('#remove-files-dialog')),
    /**
     * Inits the whole front for the file manager
     */
    init: function() {
        // Delete files
        document.getElementById("removeFSBtn").addEventListener("click", window.fsManager.deleteSelected);
        this.removeFilesDialog.listen("MDCDialog:accept", (event) => {
            snackbar.show({
                message: "Removing files...",
                actionText: "Dismiss",
                timeout: 5000,
                actionHandler: function() {}
            });
            window.fsManager.selectedFiles.forEach((file) => {
                require("fs").unlink(file.path, (err) => {
                    if (err) throw err;
                    window.fsManager.refresh();
                })
            })
            window.fsManager.selectedFiles = [];
        });
        // Exit edit mode
        document.getElementById("stopEditingFiles").addEventListener("click", window.fsManager.exitEditMode);
        this.inited = true;
        this.refresh();
    },

    /**
     * Refreshes the contents of the list and add new files to file manager
     */
    refresh: function() {
        /** @type {NBTFile[]} */
        window.files.getFolderContents("/files/", (err, files) => {
            // Checks to remove files
            document.querySelectorAll("#fsList>div[data-path]").forEach((elem) => {
                require("fs").exists(elem.getAttribute("data-path"), (exists) => {
                    if (!exists) elem.remove();
                })
            })
            files.forEach((nbtfile) => {
                if (!document.querySelector('#fsList>div[data-path="' + nbtfile.path + '"]')) {
                    document.getElementById("fsList").innerHTML += `
                    <div data-path="${nbtfile.path}" class="mdc-list-item fs-file" data-type="${nbtfile.extension}" data-mdc-auto-init="MDCRipple" 
                    onclick="new NBTFile(this.getAttribute('data-path'), window.editor.openTab)">
                        <i class="mdc-list-item__start-detail" aria-hidden="true" id="${nbtfile.path}-icon">
                        </i>
                        <span class="text">${nbtfile.fileName}</span>
                    </a>`;
                    window.editor.renderableClasses[nbtfile.extension].setIcon(
                        document.getElementById("fsList").querySelector(`div.fs-file[data-path="${nbtfile.path}"] > .mdc-list-item__start-detail`)
                    ); // Set the icon by it's extension
                }
            });
            mdc.autoInit(document, () => {});
        });
    },

    /**
     * Switch to edit mode so that files could be modified (download/delete)
     */
    toEditMode: function() {
        document.querySelectorAll("#fsList>div[data-path]").forEach((elem) => {
            elem.innerHTML += `<div class="mdc-checkbox nem-checkbox-transition mdc-list-item__end-detail">
            <input type="checkbox" class="mdc-checkbox__native-control"/>
            <div class="mdc-checkbox__background">
              <svg class="mdc-checkbox__checkmark" viewBox="0 0 24 24">
                <path class="mdc-checkbox__checkmark__path"
                      fill="none"
                      stroke="white"
                      d="M1.73,12.91 8.1,19.28 22.79,4.59"/>
              </svg>
              <div class="mdc-checkbox__mixedmark"></div>
            </div>
          </div>`;
        });
        document.querySelector("#fs-tab-bar1").classList.add("hidden");
        document.querySelector("#fs-tab-bar2").classList.remove("hidden");
        mdc.autoInit(document, () => {});
    },


    /**
     * Exits edit mode
     */
    exitEditMode: function() {
        var textinputs = document.querySelectorAll('#fsList input[type=checkbox]');
        textinputs.forEach((elem) => {
            elem.parentElement.remove();
        });
        document.querySelector("#fs-tab-bar1").classList.remove("hidden");
        document.querySelector("#fs-tab-bar2").classList.add("hidden");
        this.selectedFiles = [];
    },


    /**
     * Deletes selected files
     */
    deleteSelected: function() {
        // Getting the files
        var textinputs = document.querySelectorAll('#fsList input[type=checkbox]');
        var filesToRemove = [];
        if (textinputs.length > 0) { // Checking for files to remove.
            document.querySelector("#remove-files-list").innerHTML = "";
            textinputs.forEach((elem) => {
                if (elem.checked) {
                    var NBT = new NBTFile(elem.parentElement.parentElement.getAttribute("data-path"));
                    filesToRemove.push(NBT);
                    document.querySelector("#remove-files-list").innerHTML += `<li class="mdc-list-item">${NBT.fileName}</li>`;
                }
            });
            // Showing dialog and asking user for confirmation.
            window.fsManager.removeFilesDialog.show();
            window.fsManager.selectedFiles = filesToRemove;
        } else {
            // No file was trying to be deleted.
            snackbar.show({
                message: "No files selected.",
                actionText: "Dismiss",
                timeout: 5000,
                actionHandler: function() {}
            });
        }
    },

    /**
     * Puts textfields for the file editing
     */
    renameSelected: function() {
        // Getting the files
        var textinputs = document.querySelectorAll('#fsList input[type=checkbox]');
        var filesToRename = [];
        if (textinputs.length > 0) { // Checking for files to rename.
            textinputs.forEach((elem) => {
                if (elem.checked) {
                    var text = elem.parentElement.parentElement.querySelector(".text");
                    console.log(elem.parentElement.parentElement.getAttribute("data-path"));
                    // Adding text input
                    text.innerHTML = `<div class="mdc-textfield mdc-textfield--upgraded">
                        <input type="text" 
                        id="fs-tab-rename-${elem.parentElement.parentElement.getAttribute("data-path").replace("/files/", "")}" 
                        class="mdc-textfield__input" 
                        old-value="${elem.parentElement.parentElement.getAttribute("data-path").replace("/files/", "")}" 
                        value="${elem.parentElement.parentElement.getAttribute("data-path").replace("/files/", "").replace(/\&\#47;/, "/")}" aria-controls="username-helptext">
                    </div>`;
                    mdc.textfield.MDCTextfield.attachTo(text.children[0]);
                    // Listen for 'enter' on the text input to validate filename
                    text.children[0].children[0].addEventListener("keyup", (event) => {
                        if (event.keyCode == 13) {
                            var newName = text.children[0].children[0].value.replace("/", "&#47;");
                            // Rename the file
                            require("fs").rename("/files/" + text.children[0].children[0].getAttribute("old-value"), "/files/" + newName, function(err) {
                                if (err) {
                                    snackbar.show({
                                        message: `Could not rename file: ${err.message}.`,
                                        actionText: "Dismiss",
                                        timeout: 5000,
                                        actionHandler: function() {}
                                    });
                                    throw err;
                                } else {
                                    // Display the new name
                                    text.innerHTML = newName;
                                }
                            })
                        }
                    });
                }
            });
        } else {
            // No file was trying to be deleted.
            snackbar.show({
                message: "No files selected.",
                actionText: "Dismiss",
                timeout: 5000,
                actionHandler: function() {}
            });
        }
    }
}