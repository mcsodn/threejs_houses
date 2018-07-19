$(function () {
    let scene = new THREE.Scene();
    let camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    let renderer = new THREE.WebGLRenderer({ alpha: true });
    let controls = new THREE.OrbitControls(camera, renderer.domElement);

    //renderer params
    //renderer.setClearColor(new THREE.Color("rgb(153, 153, 255)"), 0.5);
    renderer.setSize(window.innerWidth-40, window.innerHeight-20);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // Trackball controller
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;


    //Lighting
    let spotLight = new THREE.SpotLight(0xffffff);
    spotLight.position.set( -40, 60, -10 );
    spotLight.castShadow = true;

    spotLight.shadow.mapSize.width = 512*4;
    spotLight.shadow.mapSize.height = 512*4;
    spotLight.shadow.camera.near = 0.5;
    spotLight.shadow.camera.far = 500;
    spotLight.shadow.bias = -0.01;

    scene.add(spotLight);

    //Add axes
    let axes = new THREE.AxesHelper(20);
    scene.add(axes);

    //add ball
    function loadCollada (collada) {
        let ball = collada.scene;

        //add ball's shadow
        //не побеждена проблема тени самой на себя
        // ball.traverse(function(child) {
        //     child.castShadow = true;
        //     child.receiveShadow = true;
        // });

        scene.add(ball);
    }

    let loaderColladaBall = new THREE.ColladaLoader();
    loaderColladaBall.load('static/models/ballmodel.dae',loadCollada);


    //add ground
    let planeGeometry = new THREE.PlaneGeometry(20, 20, 1, 1);
    let planeMaterial = new THREE.MeshLambertMaterial(
        {color: 0xffffff});
    let plane = new THREE.Mesh(planeGeometry, planeMaterial);

    plane.rotation.x = -0.5 * Math.PI;
    // plane.position.x = 15;
    plane.position.x = 0;
    plane.position.y = 0;
    plane.position.z = 0;
    plane.receiveShadow = true;
    scene.add(plane);

    //add cube
    // let cubeGeometry = new THREE.CubeGeometry(4, 4, 4);
    // let cubeMaterial = new THREE.MeshLambertMaterial(
    //     {color: 0xff0000});
    // let cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    // cube.position.x = -4;
    // cube.position.y = 3;
    // cube.position.z = 0;
    // cube.castShadow = true;
    // cube.receiveShadow = false;
    // scene.add(cube);
    //
    // //add sphere
    // let sphereGeometry = new THREE.SphereGeometry(4, 20, 20);
    // let sphereMaterial = new THREE.MeshLambertMaterial(
    //     {color: 0x7777ff});
    // let sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    // sphere.position.x = 20;
    // sphere.position.y = 4;
    // sphere.position.z = 2;
    // sphere.castShadow = true;
    // sphere.receiveShadow = false;
    // scene.add(sphere);

    //add camera
    camera.position.x = -30;
    camera.position.y = 40;
    camera.position.z = 30;
    camera.lookAt(scene.position);

    //output to DOM
    $("#WebGL-output").append(renderer.domElement);
    renderScene();


    function renderScene() {
        requestAnimationFrame(renderScene);
        renderer.render(scene, camera);
        controls.update();
    }

    window.addEventListener( 'resize', onWindowResize, false );

    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize( window.innerWidth, window.innerHeight );
        renderScene();
    }
});