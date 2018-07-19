var scene, controls,
    camera, fieldOfView, aspectRatio, nearPlane, farPlane,
    renderer, container;

var HEIGHT, WIDTH;

//создаем сцену

function createScene() {
    HEIGHT = window.innerHeight;
    WIDTH = window.innerWidth;

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
    var axes = new THREE.AxesHelper(20);
    scene.add(axes);

    container = document.getElementById('WebGL-output');
    container.appendChild(renderer.domElement);

    window.addEventListener('resize', handleWindowResize,false);
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

var spotLight;

function createLights() {
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


Planet = function () {
    var geometry = new THREE.SphereGeometry(8, 20, 20);
    var material = new THREE.MeshLambertMaterial(
         {color: 0x7777ff});
    this.mesh = new THREE.Mesh(geometry, material);
    this.mesh.receiveShadow = true;
}

function createPlanet() {
    var planet = new Planet();
    scene.add(planet.mesh);
}

function loop() {
    renderer.render(scene, camera);
    requestAnimationFrame(loop);
}

function init() {
    createScene();
    createLights();
    createPlanet();
    loop();
}

window.addEventListener('load', init, false);