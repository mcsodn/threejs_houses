$(function () {
    
    let scene, controls,
        camera, fieldOfView, aspectRatio, nearPlane, farPlane,
        renderer, container;

    let HEIGHT = window.innerHeight,
        WIDTH = window.innerWidth;

    function createScene() {

    //создаем сцену

        scene = new THREE.Scene();
        aspectRatio = WIDTH/HEIGHT;
        fieldOfView = 60;
        nearPlane = 1;
        farPlane = 10000;

        camera = new THREE.PerspectiveCamera(
            fieldOfView,
            aspectRatio,
            nearPlane,
            farPlane
        );

        camera.position.x = -30;
        camera.position.y = 40;
        camera.position.z = 30;
        camera.lookAt(scene.position);
        renderer = new THREE.WebGLRenderer({
            alpha: true,
            antialias: true
        });

        renderer.setSize(WIDTH,HEIGHT);
        renderer.shadowMap.enabled = true;

        //add controls
        controls = new THREE.OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.25;

        //Add axes
        let axes = new THREE.AxesHelper(20);
        scene.add(axes);

        container = document.getElementById('WebGL-output');
        container.appendChild(renderer.domElement);

        window.addEventListener('resize', handleWindowResize, false);
    }

    //функция перерисовывает сцену, если изменились размеры окна

    function handleWindowResize() {
        HEIGHT = window.innerHeight;
        WIDTH = window.innerWidth;
        renderer.setSize(HEIGHT,WIDTH);
        camera.aspect = WIDTH/HEIGHT;
        camera.updateProjectionMatrix();
    }

    //добавляем свет

    function createLights() {

        let spotLight;
        spotLight = new THREE.SpotLight(0xffffff);
        spotLight.position.set( -40, 60, -10 );
        spotLight.castShadow = true;

        spotLight.shadow.mapSize.width = 512*4;
        spotLight.shadow.mapSize.height = 512*4;
        spotLight.shadow.camera.near = 1;
        spotLight.shadow.camera.far = 1000;
        spotLight.shadow.bias = -0.01;

        scene.add(spotLight);
    }


    Planet = function (radius) {
        let geometry = new THREE.SphereGeometry(radius, 32, 32);
        // var material = new THREE.MeshLambertMaterial(
        //      {color: 0x7777ff});

        //добавление текстуры
        let texture = new THREE.TextureLoader().load('static/img/earth.jpg');
        let material = new THREE.MeshLambertMaterial({ map:texture, overdraw:true, });
        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.receiveShadow = true;
    }

    Moon = function (radius) {
        let geometry = new THREE.SphereGeometry(radius, 32, 32);

        //добавление текстуры
        let texture = new THREE.TextureLoader().load('static/img/moon.jpg');
        let material = new THREE.MeshLambertMaterial({ map:texture, overdraw:true, });
        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.receiveShadow = true;
    }

    let planet, moon;

    function createPlanet(radius) {
        planet = new Planet(radius);
        scene.add(planet.mesh);
    }

    function createMoon(radius) {
        moon = new Moon(radius);
        scene.add(moon.mesh);
        moon.mesh.position.x += 40;
    }

    //вращение вокруг глобальных осей

    let rotateAroundWorldAxis = function(object, axis, radians) {
        let rotWorldMatrix = new THREE.Matrix4();
        rotWorldMatrix.makeRotationAxis(axis.normalize(), radians);

        let currentPos = new THREE.Vector4(object.position.x, object.position.y, object.position.z, 1);
        let newPos = currentPos.applyMatrix4(rotWorldMatrix);

        rotWorldMatrix.multiply(object.matrix);
        object.matrix = rotWorldMatrix;
        object.rotation.setFromRotationMatrix(object.matrix);

        object.position.x = newPos.x;
        object.position.y = newPos.y;
        object.position.z = newPos.z;
    };

    function loop() {
        planet.mesh.rotation.y += .005;
        moon.mesh.rotation.y -= .01;
        rotateAroundWorldAxis(moon.mesh, new THREE.Vector3(0,1,0), Math.PI/360);
        // moon.mesh.position.x -= 1;
        renderer.render(scene, camera);
        requestAnimationFrame(loop);
    }

    function init() {
        createScene();
        createLights();
        createPlanet(10);
        createMoon(4);
        loop();
    }

    window.addEventListener('load', init, false);

})