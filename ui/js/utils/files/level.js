/**
 * level.js
 * @author Ad5001 <mail@ad5001.eu>
 * @license NTOSL (View LICENSE.md)
 * @copyright (C) Ad5001 2017
 * @package nbt-editor-server
 */
var this2;
class Level extends DatFile {

    /**
     * Renders the file to the editor in HTML
     * 
     * @memberof Level
     */
    render() { console.log(this.data) }

    /**
     * Restores skin and everything that needs to be restored from there.
     * 
     * @memberof Level
     */
    restore() {}

    /**
     * Called to set the icon
     * 
     * @param {HTMLElement} elem
     * @memberof Renderable
     */
    static setIcon(elem) {
        document.getElementById(elem.id).classList.add("fa", "fa-map-o", "fa-2x");
    }
}