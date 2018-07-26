$(function () {
    
    let scene, controls,
        camera, fieldOfView, aspectRatio, nearPlane, farPlane,
        renderer, container;

    let HEIGHT = window.innerHeight,
        WIDTH = window.innerWidth;

    let basicColor = Math.random() * 0xffffff;


    //функция создания сцены и камеры, тут же добавляются оси и управление мышью, а потом выводится в контейнер
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

        camera.position.x = -30*10;
        camera.position.y = 40*10;
        camera.position.z = 30*10;
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

    //добавляем свет на сцену
    function createLights() {

        let spotLight, sphereLight;
        spotLight = new THREE.DirectionalLight(0xffffff, 0.75);
        spotLight.position.set( 100, 100, 100 ).normalize();
        spotLight.castShadow = true;

        spotLight.shadow.mapSize.width = 512*4;
        spotLight.shadow.mapSize.height = 512*4;
        spotLight.shadow.camera.near = 1;
        spotLight.shadow.camera.far = 1000;
        spotLight.shadow.bias = -0.01;

        scene.add(spotLight);

        sphereLight = new THREE.HemisphereLight(0xaaaaaa,0x000000,.9);
        scene.add(sphereLight);
    }

    //функция создания секции
    Section = function() {
        let geometry = new THREE.BoxBufferGeometry( 120, 100, 120 );

        //добавление простого материала рандомного цвета
        let material = new THREE.MeshLambertMaterial({ color:basicColor, overdraw:true, });
        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.receiveShadow = true;
    }

    //функция создания крыши
    Roof = function () {

        let x,y;
        x = -65;
        y = 52;

        let triangleShape = new THREE.Shape();
        triangleShape.moveTo( x, y );
        triangleShape.lineTo( x, y+65 );
        triangleShape.lineTo( x+130, y );
        triangleShape.lineTo( x, y ); // close path

        let extrudeSettings = { depth: 130, bevelEnabled: true, bevelSegments: 2, steps: 2, bevelSize: 1, bevelThickness: 1 };
        let geometry = new THREE.ExtrudeGeometry(triangleShape, extrudeSettings);

        //добавление простого материала рандомного цвета
        let material = new THREE.MeshLambertMaterial({ color:basicColor, overdraw:true, });
        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.receiveShadow = true;
        // this.mesh.rotation.x = -.5*Math.PI;
        this.mesh.position.z -= 65;
    }

    //функция вывода секции на сцену
    function createSection() {

        let section, roof;

        section = new Section();
        roof = new Roof();

        scene.add(section.mesh);
        scene.add(roof.mesh);
    }


    function addSection() {
        basicColor = Math.random() * 0xffffff;
        createSection();

        // section.mesh.position.x = Math.random() * 800 - 400;
        // section.mesh.position.y = Math.random() * 800 - 400;
        // section.mesh.position.z = Math.random() * 800 - 400;
        //
        // section.mesh.rotation.x = Math.random() * 2 * Math.PI;
        // section.mesh.rotation.y = Math.random() * 2 * Math.PI;
        // section.mesh.rotation.z = Math.random() * 2 * Math.PI;
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
        renderer.render(scene, camera);
        requestAnimationFrame(loop);
    }

    function init() {
        createScene();
        createLights();
        createSection();
        loop();
    }

    window.addEventListener('load', init, false);
    document.getElementById('addsection').addEventListener('click', addSection, false);
})