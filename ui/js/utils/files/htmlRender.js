/**
 * htmlRender.js
 * @author Ad5001 <mail@ad5001.eu>
 * @license NTOSL (View LICENSE.md)
 * @copyright (C) Ad5001 2017
 * @package nbt-editor-server
 */

/**
 * Class to extend when do you want to create a new file type.
 */
class HTMLRender extends Renderable {
    /**
     * Creates an instance of HTMLRender.
     * @param {NBTFile} file 
     * @param {any} [data=null] 
     * @memberof HTMLRender
     */
    constructor(file, data = null) {
        super(file, data);
    }

    /**
     *  Returns file extension
     * 
     * @readonly
     * @memberof HTMLRender
     */
    get extension() { return "html" };

    /**
     * Renders the file to the editor in HTML
     * 
     * @memberof HTMLRender
     */

    render() {
        require("fs").readFile(this.file.path, (err, data) => {
            if (err) throw err;
            document.getElementById("editor").innerHTML = data.toString();
        })
    }

    /**
     * Check if the file has been edited by checking for the data by the original one
     * 
     * @return {Boolean}
     * @memberof HTMLRender
     */
    isCurrentlyEdited() { return false; }

    /**
     * Restores data that cannot be HTML restored
     * 
     * @memberof DatFile
     */
    restore() {
        this.render(); // Remake some files.
    }

    /**
     * Called to set the icon
     * 
     * @param {HTMLElement} elem
     * @memberof Renderable
     */
    static setIcon(elem) {
        document.getElementById(elem.id).classList.add("fa", "fa-info", "fa-2x");
    }
}