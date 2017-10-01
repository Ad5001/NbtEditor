/**
 * 	 _Minecraft_Skin_Viewer_v. 1.0.0 ___  
 *	|"  \   /"  |/"       )"  \ . . /" :)  License: MIT
 *	|:  .\ /.   (:  .\___/ \   \ ../   /    Author: http://nicc0.pl
 *	|     V.    |\___    \ .\.  \ /   /.   Website: http://nicc0.github.io
 *	|: \ .   /  |.___)   .|: \   V.  /:       Docs: http://nicc0.github.io/msv
 *	|.  \   /:  |/"  \   :| . \    ./         Repo: http://github.com/nicc0/msv
 *	|___|\_/|___(________/ .  .\___/.JS     Issues: http://github.com/nicc0/msv/issues
 *				by Daniel "Nicc0" Tecza
 *
 *	MIT License
 *
 *	Copyright Minecraft Skin Viewer (c) 2017 Daniel "Nicc0" Tecza
 *
 *	Permission is hereby granted, free of charge, to any person obtaining a copy
 *	of this software and associated documentation files (the "Software"), to deal
 *	in the Software without restriction, including without limitation the rights
 *	to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *	copies of the Software, and to permit persons to whom the Software is
 *	furnished to do so, subject to the following conditions:
 *
 *	The above copyright notice and this permission notice shall be included in all
 *	copies or substantial portions of the Software.
 *
 *	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *	IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *	FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *	AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *	LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *	OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 *	SOFTWARE.
 **/
var MSV = MSV || function(url) {
    'use strict';

    var instance = this,
        container, interval, projector, loader,
        linesMaterial, isMouseDown = false,
        onMouseDownPosition, skins,
        camera, scene, renderer, ray, mouse3D, skinTexture, radious = 100,
        theta = 45,
        onMouseDownTheta = 45,
        phi = 60,
        onMouseDownPhi = 60,
        material_1, material_2, loaded = false,
        bg_color;

    this.skinName = null;
    this.skinURL = url;
    this.width;
    this.height;

    this.setContainer = function(c) {
        if (container) {
            console.log("Container is defined! Ignored.");
            return;
        }
        container = c;
    }

    this.setSkinURL = function(url) {
        this.skinURL = url;
        if (loaded)
            changeSkin(url, this.skinName);
    }

    this.setSkinName = function(name) {
        this.skinName = name;
        if (loaded)
            changeSkin(this.skinURL, name);
    }

    this.setSize = function(w, h) {
        this.width = w;
        this.height = h;
    }

    this.init = function() {
        if (check(this.skinURL))
            return;

        // Get default container
        if (!container) container = document.getElementById("editor");

        if (!container || container == null) {
            console.error("DOM Container for MSV is not defined!")
            return;
        }

        if (!this.width || !this.height) {
            this.width = container.offsetWidth;
            this.height = container.offsetHeight;
        }

        scene = new THREE.Scene();
        ray = new THREE.Raycaster();
        onMouseDownPosition = new THREE.Vector2();
        loader = new THREE.TextureLoader();
        loader.crossOrigin = '';

        // Camera
        camera = new THREE.PerspectiveCamera(40, window.offsetWidth / window.offsetHeight, 1, 10000);
        camera.position.x = radious * Math.sin(theta * Math.PI / 360) * Math.cos(phi * Math.PI / 360);
        camera.position.y = radious * Math.sin(phi * Math.PI / 360);
        camera.position.z = radious * Math.cos(theta * Math.PI / 360) * Math.cos(phi * Math.PI / 360);
        camera.lookAt(new THREE.Vector3(0, 18, 0));

        // Grids
        var geometry = new THREE.Geometry();
        geometry.vertices.push(new THREE.Vector3(-50, 0, 0));
        geometry.vertices.push(new THREE.Vector3(50, 0, 0));

        // linesMaterial = new THREE.LineBasicMaterial({ color: 0x000000, opacity: 0.2 });

        // for (var i = 0; i <= 20; i++) {
        //     var line = new THREE.Line(geometry, linesMaterial);
        //     line.position.z = (i * 5) - 50;
        //     scene.add(line);

        //     var line = new THREE.Line(geometry, linesMaterial);
        //     line.position.x = (i * 5) - 50;
        //     line.rotation.y = 90 * Math.PI / 180;
        //     scene.add(line);
        // }

        // Listeners
        container.addEventListener('mousemove', onDocumentMouseMove, false);
        container.addEventListener('mousedown', onDocumentMouseDown, false);
        container.addEventListener('mouseup', onDocumentMouseUp, false);
        container.addEventListener('mousewheel', onDocumentMouseWheel, false);

        window.addEventListener('resize', onWindowResize, false);

        skins = document.querySelectorAll('[data-msv-skin]');
        for (var i = 0; i < skins.length; i++) {
            // Set first skin name
            if (i === 0)
                this.skinName = skins[i].getAttribute('data-msv-skin');

            // Add Listener to button with MSV skin data
            skins[i].addEventListener('click', function() {
                var name = this.getAttribute('data-msv-skin');

                if (name.indexOf(".png") !== -1) {
                    instance.skinURL = name;
                } else {
                    instance.skinName = name;
                }

                changeSkin(instance.skinURL, instance.skinName);
            }, false);
        }

        // Check if skin is set
        if (this.skinURL.indexOf(".png") === -1 && this.skinName == null) {
            console.error("Can't find any skin data!");
            return;
        }

        // Chenge Skin Texture
        changeSkin(this.skinURL, this.skinName);

        // Create WebGLRenderer
        renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true }); // {alpha: true, antialias: true}
        renderer.setPixelRatio(2);
        renderer.shadowMap.type = THREE.BasicShadowMap;
        renderer.setSize(this.width, this.height);
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        container.appendChild(renderer.domElement);
    }

    function changeSkin(url, name) {
        //var image = new Image();
        //	image.src = url.indexOf(".png") !== -1 ? url : url + name + ".png";
        //	image.
        // Load image by Three.JS Loader
        loader.load(url, loadTexture);
    }

    function resizeImage(img) {
        var canvas = document.createElement('canvas');
        canvas.width = 64;
        canvas.height = 64;
        var context = canvas.getContext("2d");
        context.drawImage(img, 0, 0);
        repair(context);
        transparent(context);
        //container.insertBefore(canvas, container.firstChild);  
        return canvas.toDataURL();
    }

    function transparent(ctx) {
        var bg = ctx.getImageData(0, 0, 1, 1).data[0],
            a = [56, 48, 32, 48, 40, 40],
            i = a.length,
            id;
        while (i--) {
            var b = i == 4 || i == 3 ? 0 : 8,
                y = a[i],
                x = b,
                data = ctx.getImageData(x, y, 8, 8).data;
            for (y = 0; y < 8; y++) {
                for (x = 0; x < 8; x++) {
                    if (id = (x + y * 8) * 4, data[id] == bg && data[id + 1] == bg && data[id + 2] == bg || data[id + 3] != 0) {
                        ctx.clearRect(a[i], b, 8, 8);
                    }
                }
            }
        }
    }

    function repair(ctx) {
        for (var p = [4, 20, 8, 24, 0, 24, 4, 20, 8, 16, 12, 28, 44, 36, 48, 40, 40, 40, 44, 36, 48, 32, 52, 44], i = 0; i < p.length;) {
            var a = [0, 2, 12, 14].indexOf(i) != -1,
                w = 4,
                h = a ? 4 : 12;
            var img = ctx.getImageData(p[i++], a ? 16 : 20, w, h);
            for (var x = 0; x < 2; x++) {
                for (var y = 0; y < h; y++) {
                    for (var j = 0, id1 = (x + y * w) * 4, id2 = ((w - x - 1) + y * w) * 4; j < 4; j++) {
                        var f = img.data[id1 + j];
                        var g = img.data[id2 + j];
                        img.data[id1 + j] = g;
                        img.data[id2 + j] = f;
                    }
                }
            }
            ctx.putImageData(img, p[i++], a ? 48 : 52);
        }
    }

    function loadTexture(texture) {
        // Change image size to 64x64 when it have 64x32
        if (texture.image.height == 32) {
            texture.image.height = 64;
            texture.image.src = resizeImage(texture.image);
        }

        // Get the texture from loaded image
        skinTexture = texture;
        skinTexture.magFilter = THREE.NearestFilter;
        skinTexture.minFilter = THREE.NearestMipMapNearestFilter;

        if (!loaded) {
            // Set materials from texture
            material_1 = new THREE.MeshBasicMaterial({ map: skinTexture, side: THREE.FrontSide });
            material_2 = new THREE.MeshBasicMaterial({ map: skinTexture, transparent: true, opacity: 1, alphaTest: 0.5, side: THREE.DoubleSide });

            // Add all elements to scane
            addSkyBox();
            addModel();

            // Set viewer to loaded state
            loaded = true;
        } else {
            // Change texture for materials
            material_1.map = skinTexture;
            material_2.map = skinTexture;

            // Notice Three.JS that the material needs update
            material_1.needsUpdate = true;
            material_2.needsUpdate = true;
        }

        // Render
        render();
    }

    function check(url) {
        if (loaded) {
            console.error('Minecraft Skin Viewer is initialized!');
            return true;
        }

        if (typeof THREE === 'undefined') {
            console.error('Three.js is required to run Minecraft Skin Viewer!');
            return true;
        }

        if (!url) {
            console.error('URL in constructor is required!');
            return true;
        }

        // if (url.indexOf(".png") === -1 && url.slice(-1) != '/') {
        //     console.error('URL is incorrect!');
        //     return true;
        // }

        return false;
    }

    function generateMesh(name, array, w, h, d, mat, x, y) {
        var v = [];

        for (var i = 0; i < array.length; i++) {
            v[i] = [];
            for (var j = 0; j < 4; j++) {
                v[i][j] = new THREE.Vector2(array[i][j * 2], array[i][j * 2 + 1]);
            }
        }

        var box = new THREE.BoxGeometry(w, h, d, 0, 0, 0);
        box.faceVertexUvs[0] = [];

        for (var i = 0, s = (i * 2 != 6); i < array.length; i++) {
            box.faceVertexUvs[0][i * 2] = [v[i][s ? 3 : 0], v[i][s ? 0 : 3], v[i][s ? 2 : 1]];
            box.faceVertexUvs[0][i * 2 + 1] = [v[i][s ? 0 : 3], v[i][s ? 1 : 2], v[i][s ? 2 : 1]];
        }

        var mesh = new THREE.Mesh(box, mat);
        mesh.name = name;
        mesh.position.y = x;
        mesh.position.x = y;

        scene.add(mesh);
    }

    function addSkyBox() {

    }

    function addModel() {
        generateMesh("head", [
            [0.25, 0.75, 0.375, 0.75, 0.375, 0.875, 0.25, 0.875],
            [0, 0.75, 0.125, 0.75, 0.125, 0.875, 0, 0.875],
            [0.125, 0.875, 0.25, 0.875, 0.25, 1, 0.125, 1],
            [0.25, 0.875, 0.375, 0.875, 0.375, 1, 0.25, 1],
            [0.125, 0.75, 0.25, 0.75, 0.25, 0.875, 0.125, 0.875],
            [0.375, 0.75, 0.5, 0.75, 0.5, 0.875, 0.375, 0.875]
        ], 8, 8, 8, material_1, 28, 0);

        generateMesh("body", [
            [0.4375, 0.5, 0.5, 0.5, 0.5, 0.6875, 0.4375, 0.6875],
            [0.25, 0.5, 0.3125, 0.5, 0.3125, 0.6875, 0.25, 0.6875],
            [0.3125, 0.6875, 0.4375, 0.6875, 0.4375, 0.75, 0.3125, 0.75],
            [0.4375, 0.6875, 0.5625, 0.6875, 0.5625, 0.75, 0.4375, 0.75],
            [0.3125, 0.5, 0.4375, 0.5, 0.4375, 0.6875, 0.3125, 0.6875],
            [0.5, 0.5, 0.625, 0.5, 0.625, 0.6875, 0.5, 0.6875]
        ], 8, 12, 4, material_1, 18, 0);

        generateMesh("leftArm", [
            [0.75, 0.5, 0.8125, 0.5, 0.8125, 0.6875, 0.75, 0.6875],
            [0.625, 0.5, 0.6875, 0.5, 0.6875, 0.6875, 0.625, 0.6875],
            [0.6875, 0.6875, 0.75, 0.6875, 0.75, 0.75, 0.6875, 0.75],
            [0.75, 0.6875, 0.8125, 0.6875, 0.8125, 0.75, 0.75, 0.75],
            [0.6875, 0.5, 0.75, 0.5, 0.75, 0.6875, 0.6875, 0.6875],
            [0.8125, 0.5, 0.875, 0.5, 0.875, 0.6875, 0.8125, 0.6875]
        ], 4, 12, 4, material_1, 18, -6);

        generateMesh("rightArm", [
            [0.625, 0, 0.6875, 0, 0.6875, 0.1875, 0.625, 0.1875],
            [0.5, 0, 0.5625, 0, 0.5625, 0.1875, 0.5, 0.1875],
            [0.5625, 0.1875, 0.625, 0.1875, 0.625, 0.25, 0.5625, 0.25],
            [0.625, 0.1875, 0.6875, 0.1875, 0.6875, 0.25, 0.625, 0.25],
            [0.5625, 0, 0.625, 0, 0.625, 0.1875, 0.5625, 0.1875],
            [0.6875, 0, 0.75, 0, 0.75, 0.1875, 0.6875, 0.1875]
        ], 4, 12, 4, material_1, 18, 6);

        generateMesh("leftLeg", [
            [0.125, 0.5, 0.1875, 0.5, 0.1875, 0.6875, 0.125, 0.6875],
            [0, 0.5, 0.0625, 0.5, 0.0625, 0.6875, 0, 0.6875],
            [0.0625, 0.6875, 0.125, 0.6875, 0.125, 0.75, 0.0625, 0.75],
            [0.125, 0.6875, 0.1875, 0.6875, 0.1875, 0.75, 0.125, 0.75],
            [0.0625, 0.5, 0.125, 0.5, 0.125, 0.6875, 0.0625, 0.6875],
            [0.1875, 0.5, 0.25, 0.5, 0.25, 0.6875, 0.1875, 0.6875]
        ], 4, 12, 4, material_1, 6, -2);

        generateMesh("rightLeg", [
            [0.375, 0, 0.4375, 0, 0.4375, 0.1875, 0.375, 0.1875],
            [0.25, 0, 0.3125, 0, 0.3125, 0.1875, 0.25, 0.1875],
            [0.3125, 0.1875, 0.375, 0.1875, 0.375, 0.25, 0.3125, 0.25],
            [0.375, 0.1875, 0.4375, 0.1875, 0.4375, 0.25, 0.375, 0.25],
            [0.3125, 0, 0.375, 0, 0.375, 0.1875, 0.3125, 0.1875],
            [0.4375, 0, 0.5, 0, 0.5, 0.1875, 0.4375, 0.1875]
        ], 4, 12, 4, material_1, 6, 2);

        generateMesh("headOverlay", [
            [0.75, 0.75, 0.875, 0.75, 0.875, 0.875, 0.75, 0.875],
            [0.5, 0.75, 0.625, 0.75, 0.625, 0.875, 0.5, 0.875],
            [0.625, 0.875, 0.75, 0.875, 0.75, 1, 0.625, 1],
            [0.75, 0.875, 0.875, 0.875, 0.875, 1, 0.75, 1],
            [0.625, 0.75, 0.75, 0.75, 0.75, 0.875, 0.625, 0.875],
            [0.875, 0.75, 1, 0.75, 1, 0.875, 0.875, 0.875]
        ], 9, 9, 9, material_2, 28, 0);

        generateMesh("bodyOverlay", [
            [0.4375, 0.25, 0.5, 0.25, 0.5, 0.4375, 0.4375, 0.4375],
            [0.25, 0.25, 0.3125, 0.25, 0.3125, 0.4375, 0.25, 0.4375],
            [0.3125, 0.4375, 0.4375, 0.4375, 0.4375, 0.5, 0.3125, 0.5],
            [0.4375, 0.4375, 0.5625, 0.4375, 0.5625, 0.5, 0.4375, 0.5],
            [0.3125, 0.25, 0.4375, 0.25, 0.4375, 0.4375, 0.3125, 0.4375],
            [0.5, 0.25, 0.625, 0.25, 0.625, 0.4375, 0.5, 0.4375]
        ], 9, 13.5, 4.5, material_2, 18, 0);

        generateMesh("leftArmOverlay", [
            [0.75, 0.25, 0.8125, 0.25, 0.8125, 0.4375, 0.75, 0.4375],
            [0.625, 0.25, 0.6875, 0.25, 0.6875, 0.4375, 0.625, 0.4375],
            [0.6875, 0.4375, 0.75, 0.4375, 0.75, 0.5, 0.6875, 0.5],
            [0.75, 0.4375, 0.8125, 0.4375, 0.8125, 0.5, 0.75, 0.5],
            [0.6875, 0.25, 0.75, 0.25, 0.75, 0.4375, 0.6875, 0.4375],
            [0.8125, 0.25, 0.875, 0.25, 0.875, 0.4375, 0.8125, 0.4375],
        ], 4.5, 13.5, 4.5, material_2, 18, -6);

        generateMesh("rightArmOverlay", [
            [0.875, 0, 0.9375, 0, 0.9375, 0.1875, 0.875, 0.1875],
            [0.75, 0, 0.8125, 0, 0.8125, 0.1875, 0.75, 0.1875],
            [0.8125, 0.1875, 0.875, 0.1875, 0.875, 0.25, 0.8125, 0.25],
            [0.875, 0.1875, 0.9375, 0.1875, 0.9375, 0.25, 0.875, 0.25],
            [0.8125, 0, 0.875, 0, 0.875, 0.1875, 0.8125, 0.1875],
            [0.9375, 0, 1, 0, 1, 0.1875, 0.9375, 0.1875],
        ], 4.5, 13.5, 4.5, material_2, 18, 6);

        generateMesh("leftLegOverlay", [
            [0.125, 0.25, 0.1875, 0.25, 0.1875, 0.4375, 0.125, 0.4375],
            [0, 0.25, 0.0625, 0.25, 0.0625, 0.4375, 0, 0.4375],
            [0.0625, 0.4375, 0.125, 0.4375, 0.125, 0.5, 0.0625, 0.5],
            [0.125, 0.4375, 0.1875, 0.4375, 0.1875, 0.5, 0.125, 0.5],
            [0.0625, 0.25, 0.125, 0.25, 0.125, 0.4375, 0.0625, 0.4375],
            [0.1875, 0.25, 0.25, 0.25, 0.25, 0.4375, 0.1875, 0.4375],
        ], 4.5, 13.5, 4.5, material_2, 6, -2);

        generateMesh("rightLegOverlay", [
            [0.125, 0, 0.1875, 0, 0.1875, 0.1875, 0.125, 0.1875],
            [0, 0, 0.0625, 0, 0.0625, 0.1875, 0, 0.1875],
            [0.0625, 0.1875, 0.125, 0.1875, 0.125, 0.25, 0.0625, 0.25],
            [0.125, 0.1875, 0.1875, 0.1875, 0.1875, 0.25, 0.125, 0.25],
            [0.0625, 0, 0.125, 0, 0.125, 0.1875, 0.0625, 0.1875],
            [0.1875, 0, 0.25, 0, 0.25, 0.1875, 0.1875, 0.1875],
        ], 4.5, 13.5, 4.5, material_2, 6, 2);
    }

    function onWindowResize() {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
        render();
    }

    function onDocumentMouseDown(event) {
        event.preventDefault();

        isMouseDown = true;

        onMouseDownTheta = theta;
        onMouseDownPhi = phi;
        onMouseDownPosition.x = event.clientX;
        onMouseDownPosition.y = event.clientY;
    }

    function onDocumentMouseMove(event) {
        event.preventDefault();

        if (isMouseDown) {
            theta = -((event.clientX - onMouseDownPosition.x) * 0.5) + onMouseDownTheta;
            phi = ((event.clientY - onMouseDownPosition.y) * 0.5) + onMouseDownPhi;

            phi = Math.min(180, Math.max(0, phi));

            camera.position.x = radious * Math.sin(theta * Math.PI / 360) * Math.cos(phi * Math.PI / 360);
            camera.position.y = radious * Math.sin(phi * Math.PI / 360);
            camera.position.z = radious * Math.cos(theta * Math.PI / 360) * Math.cos(phi * Math.PI / 360);
            camera.lookAt(new THREE.Vector3((event.clientX / renderer.domElement.width) * 2 - 1, -(event.clientY / renderer.domElement.height) * 2 + 18, 0.5));

            render();
        }
    }

    function onDocumentMouseUp(event) {
        event.preventDefault();

        isMouseDown = false;

        onMouseDownPosition.x = event.clientX - onMouseDownPosition.x;
        onMouseDownPosition.y = event.clientY - onMouseDownPosition.y;

        if (onMouseDownPosition.length() > 5) {
            return;
        }

        render();
    }

    function onDocumentMouseWheel(event) {
        event.preventDefault();

        var r = radious;
        radious -= event.wheelDeltaY / 20;

        if (radious < 40) {
            radious = r;
            return;
        }

        camera.position.x = radious * Math.sin(theta * Math.PI / 360) * Math.cos(phi * Math.PI / 360);
        camera.position.y = radious * Math.sin(phi * Math.PI / 360);
        camera.position.z = radious * Math.cos(theta * Math.PI / 360) * Math.cos(phi * Math.PI / 360);
        camera.lookAt(new THREE.Vector3((event.clientX / renderer.domElement.width) * 2 - 1, -(event.clientY / renderer.domElement.height) * 2 + 18, 0.5));

        render();
    }

    function render() {
        renderer.render(scene, camera);
    }
}