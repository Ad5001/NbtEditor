/**
 * renderable.js
 * @author Ad5001 <mail@ad5001.eu>
 * @license NTOSL (View LICENSE.md)
 * @copyright (C) Ad5001 2017
 * @package nbt-editor-server
 */

/**
 * Class to extend when do you want to create a new file type.
 */
class Renderable {
    /**
     * Creates an instance of Renderable.
     * @param {NBTFile} file 
     * @param {any} [data=null] 
     * @memberof Renderable
     */
    constructor(file, data = null) {
        this.file = file;
        this.data = data;
    }

    /**
     *  Returns file extension
     * 
     * @readonly
     * @memberof Renderable
     */
    get extension() { return "" };

    /**
     * Renders the file to the editor in HTML
     * 
     * @memberof Renderable
     */

    render() {
        snackbar.show({
            message: "'" + this.extension + "' has no rendering feature.",
            actionText: "Dismiss",
            timeout: 5000,
            actionHandler: function() {}
        });
    }

    /**
     * Saves the file
     * 
     * @memberof Renderable
     */
    save() {
        snackbar.show({
            message: "'" + this.extension + "' has no saving feature.",
            actionText: "Dismiss",
            timeout: 5000,
            actionHandler: function() {}
        });
    }

    /**
     * Check if the file has been edited by checking for the data by the original one
     * 
     * @return {Boolean}
     * @memberof Renderable
     */

    isCurrentlyEdited() { return false; }

    /**
     * Restores additionals with files for restoring tabs.
     * 
     * @memberof Renderable
     */
    restore() {}

    /**
     * Called to set the icon
     * 
     * @param {HTMLElement} elem
     * @memberof Renderable
     */
    static setIcon(elem) {
        elem.classList.add("fa", "fa-question");
    }
}