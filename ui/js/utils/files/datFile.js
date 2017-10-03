/**
 * datFile.js
 * @author Ad5001 <mail@ad5001.eu>
 * @license NTOSL (View LICENSE.md)
 * @copyright (C) Ad5001 2017
 * @package nbt-editor-server
 */


class DatFile extends Renderable {

    /**
     * Creates an instance of DatFile.
     * @param {NBTFile} file 
     * @param {any} [data=null] 
     * @memberof DatFile
     */
    constructor(file, data = null) {
        super(file, data);
        var this2 = this;
        this.scheduleRender = false;
        this.scheduleRestore = false;
        /** @type {Renderable} */
        this.dat;
        require("fs").readFile(file.path, (err, data) => {
            if (err) throw err;
            require("prismarine-nbt").parse(Buffer.from(data.toString(), "base64"), (err, dataObj) => {
                if (err) throw err;
                if (!this2.dat) {
                    if (dataObj.value.Achievements) { // Player
                        this2.dat = new Player(file, dataObj);
                    } else if (dataObj.value.Data) { // Level
                        this2.dat = new Level(file, dataObj);
                    } else {
                        console.log(dataObj);
                    }
                    if (this2.scheduleRender) {
                        this2.scheduleRender = false;
                        this2.dat.render();
                    }
                    if (this2.scheduleRestore) {
                        this2.scheduleRestore = false;
                        this2.dat.restore();
                    }
                }
            });
        });
    }

    /**
     *  Returns file extension
     * 
     * @readonly
     * @memberof DatFile
     */
    get extension() { return "dat" };

    /**
     * Renders the file to the editor in HTML
     * 
     * @memberof DatFile
     */

    render() {
        document.getElementById("editor").innerHTML = "Something went wrong !";
        if (this.dat) {
            this.dat.render();
        } else {
            this.scheduleRender = true;
        }
    }

    /**
     * Saves the file
     * 
     * @memberof DatFile
     */

    save() {
        document.getElementById("editor").innerHTML = "Something went wrong !";
        if (this.dat) {
            this.dat.save();
        }
    }

    /**
     * Check if the file has been edited by checking for the data by the original one
     * 
     * @return {Boolean}
     * @memberof DatFile
     */

    isCurrentlyEdited() {
        return this.dat ? this.dat.isCurrentlyEdited() : false;
    }


    /**
     * Restores data that cannot be HTML restored
     * 
     * @memberof DatFile
     */
    restore() {
        if (this.dat) {
            this.dat.restore();
        } else {
            this.scheduleRestore = true;
        }
    }

    /**
     * Called to set the icon
     * 
     * @param {HTMLElement} elem
     * @memberof Renderable
     */
    static setIcon(elem) {
        console.log(1, elem.parentElement.getAttribute("data-path"))
        require("fs").readFile(elem.parentElement.getAttribute("data-path"), (err, data) => {
            if (err) throw err;
            console.log(2, elem.parentElement.getAttribute("data-path"));
            require("prismarine-nbt").parse(Buffer.from(data.toString(), "base64"), (err, dataObj) => {
                if (err) throw err;
                console.log(3, elem.parentElement.getAttribute("data-path"));
                if (dataObj.value.Achievements) { // Player
                    console.log(4, elem.parentElement.getAttribute("data-path"), "Player");
                    Player.setIcon(elem);
                } else if (dataObj.value.Data) { // Level
                    console.log(4, elem.parentElement.getAttribute("data-path"), "Level");
                    Level.setIcon(elem);
                } else {
                    console.log(4, elem.parentElement.getAttribute("data-path"), "Unknown", dataObj);
                    elem.classList.add("fa", "fa-info");
                }
            });
        });
    }
}