/**
 * player.js
 * @author Ad5001 <mail@ad5001.eu>
 * @license NTOSL (View LICENSE.md)
 * @copyright (C) Ad5001 2017
 * @package nbt-editor-server
 */

/**
 * @typedef {Object} BodyPart
 * @property {HTMLCanvasElement} front
 * @property {HTMLCanvasElement} back
 * @property {HTMLCanvasElement} top
 * @property {HTMLCanvasElement} bottom
 * @property {HTMLCanvasElement} left
 * @property {HTMLCanvasElement} right
 */

var this2;
class Player extends DatFile {

    /**
     * Parses a string from i's binary mcpe form to a fully usable PNG image.
     * Skins are 256 colors based.
     * 
     * @param {String} skinData
     * @return {{head:BodyPart,body:BodyPart,leftArm:BodyPart,rightArm:BodyPart,leftLeg:BodyPart,rightLeg:BodyPart}}
     * 
     * @static
     * @memberof Player
     */
    static parseSkin(skinData) {
        var canvas = document.createElement('canvas');
        canvas.width = 64;
        canvas.height = 64;
        var ctx = canvas.getContext("2d");
        var imgData = ctx.createImageData(64, 64);
        for (var i = 0; i < skinData.length; i += 3) {
            var pxColorDat = skinData.substring(i, i + 3);
            imgData.data[i + 0] = pxColorDat.charCodeAt(0);
            imgData.data[i + 1] = pxColorDat.charCodeAt(1);
            imgData.data[i + 2] = pxColorDat.charCodeAt(2);
            imgData.data[i + 3] = 255;
        }
        ctx.putImageData(imgData, 0, 0);
        // Using MSV to render skin.
        var skinViewer = new MSV(canvas.toDataURL());
        skinViewer.setContainer(document.getElementById("player-skin"));
        skinViewer.setSkinName("");
        skinViewer.init();
        // Adding link to download skin
        document.getElementById("downloadSkinLink").setAttribute("href", canvas.toDataURL());
    }

    /**
     * Renders the file to the editor in HTML
     * 
     * @memberof Player
     */
    render() {
        document.getElementById("editor").innerHTML = `<center><div class="mdc-card mdc-card__horizontal-block" style="width: 75%;">
            <div>
                <div class="mdc-card__media-item mdc-card__media-item--1x" id='player-skin'></div>
                <a href="" id="downloadSkinLink" download="${this.data.value.NameTag.value}-skin.png"><button class="fa fa-external-link mdc-button">Download</button></a>
            </div>
            <section class="mdc-card__primary">
                <h1 class="mdc-card__title mdc-card__title--large" id="playerCardTitle"><span id="playerUsername">${this.data.value.NameTag.value}</span></h1>
                <h2 class="mdc-card__subtitle">Subtitle here</h2>
            </section>
        </div></center>`;
        document.querySelector('#playerUsername').addEventListener("click", this.usernameToEditMode, true);
        // Skin
        Player.parseSkin(this.data.value.Skin.value.Data.value);
        // document.querySelector("canvas").style.width = "200px";
        // document.querySelector("canvas").style.height = "290px";
        // Username edition
        this2 = this; // TWS
    }

    /**
     * Restores skin and everything that needs to be restored from there.
     * 
     * @memberof Player
     */
    restore() {
        if (!document.getElementById("player-skin")) {
            this.render();
        } else {
            document.getElementById("player-skin").querySelectorAll("canvas").forEach((elem) => {
                elem.remove();
            })
            Player.parseSkin(this.data.value.Skin.value.Data.value);
            document.querySelector("canvas").style.width = "200px";
            document.querySelector("canvas").style.height = "290px";
            this2 = this; // TWS
            document.querySelector('#playerUsername').addEventListener("click", this.usernameToEditMode, true);
            if (document.querySelector("#playerUsernameTF")) {
                document.querySelector('#playerUsernameTF').addEventListener("keyup", (event) => {
                    if (event.keyCode == 13) {
                        this2.usernameToStaticMode();
                    }
                });
                // document.querySelector('#playerUsernameContainer').addEventListener("blur", this2.usernameToStaticMode, true);
            }
        }
    }


    /**
     * When a username is clicked, just, set it as editablein a textfield.
     * 
     * @memberof Player
     */
    usernameToEditMode() {
        document.querySelector("#playerUsername").classList.add("hidden");
        // Adding element
        var div = document.createElement("div");
        div.classList.add("mdc-textfield", "mdc-textfield--upgraded");
        div.id = "playerUsernameContainer";
        div.innerHTML = `
                <input type="text" id="playerUsernameTF" class="mdc-textfield__input" value="${this2.data.value.NameTag.value}" aria-controls="username-helptext">
                <label class="mdc-textfield__label mdc-textfield__label--float-above" for="playerUsernameTF" pattern="^[\w_.]+$">
                    Player username
                </label>`;
        var p = document.createElement("p");
        p.classList.add("mdc-textfield-helptext");
        p.id = "username-helptext";
        p.innerHTML = "A valid username is a subset of alphanumeric (and the following : _.) characters";
        document.querySelector("#playerCardTitle").appendChild(div);
        document.querySelector("#playerCardTitle").appendChild(p);
        // Adding listeners
        mdc.textfield.MDCTextfield.attachTo(document.querySelector('#playerUsernameContainer'));
        document.querySelector('#playerUsernameTF').addEventListener("keyup", (event) => {
            if (event.keyCode == 13) {
                this2.usernameToStaticMode(event);
            }
        });
        // document.querySelector('#playerUsernameContainer').addEventListener("blur", this2.usernameToStaticMode, true);
        // Focus
        document.querySelector('#playerUsernameTF').focus();
    }

    /**
     * When a new username is clicked, just save it.
     * 
     * @memberof Player
     */
    usernameToStaticMode(event) {
        if (!document.querySelector("#playerUsernameTF").value.match(/^[\w_.]+$/)) {
            snackbar.show({
                message: `'${document.querySelector("#playerUsernameTF").value}' is not a valid username.\nMake sure that this username is a subset of alphanumeric (and the following characters: _.) caracters `,
                actionText: "Dismiss",
                multiline: true,
                timeout: 5000,
                actionHandler: function() {}
            });
            event.preventDefault();
        } else {
            this2.data.value.NameTag.value = document.querySelector("#playerUsernameTF").value;
            document.querySelector("#playerUsernameContainer").remove();
            document.querySelector("#username-helptext").remove();
            document.querySelector("#playerUsername").innerHTML = this2.data.value.NameTag.value;
            document.querySelector("#playerUsername").classList.remove("hidden");
        }
    }

    /**
     * Called to set the icon
     * 
     * @param {HTMLElement} elem
     * @memberof Renderable
     */
    static setIcon(elem) {
        document.getElementById(elem.id).classList.add("fa", "fa-vcard-o", "fa-2x");
    }
}