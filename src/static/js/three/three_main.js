$(function () {
    
    let scene, controls,
        camera, fieldOfView, aspectRatio, nearPlane, farPlane,
        renderer, container;

    let HEIGHT = window.innerHeight,
        WIDTH = window.innerWidth;

    let basicColor = Math.random() * 0xffffff; // рандомный цвет

    let SECTION_HEIGHT = 100,
        SECTION_LENGTH = 200,
        SECTION_WIDTH = 120;


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

    //функция создания стен
    Walls = function() {
        let geometry = new THREE.BoxBufferGeometry( SECTION_LENGTH, SECTION_HEIGHT, SECTION_WIDTH ); // простой куб SECTION_LENGTH на SECTION_HEIGHT высотой SECTION_HEIGHT

        //добавление простого материала рандомного цвета
        let material = new THREE.MeshLambertMaterial({ color:basicColor, overdraw:true, });
        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.receiveShadow = true;

        this.mesh.position.x += SECTION_LENGTH/2;
        this.mesh.position.y += SECTION_HEIGHT/2;
        this.mesh.position.z += SECTION_WIDTH/2;
    }

    //функция создания крыши
    Roof = function () {

        let x,y,ROOF_HEIGHT; //стартовые координаты крыши и шаг
        ROOF_HEIGHT = 55;
        x = 0;
        y = SECTION_HEIGHT-1;

        //создаем плоский шейп-треугольник
        let triangleShape = new THREE.Shape();
        triangleShape.moveTo( x, y );
        triangleShape.lineTo( x, y+ROOF_HEIGHT ); // вверх
        triangleShape.lineTo( x+SECTION_LENGTH+5, y ); //вниз и в сторону
        triangleShape.lineTo( x, y ); // close path

        // задаем ему объем по оси Z
        let extrudeSettings = {
            depth: SECTION_WIDTH,
            bevelEnabled: false,
            bevelSegments: 2,
            steps: 2,
            bevelSize: 1,
            bevelThickness: 1 };

        let geometry = new THREE.ExtrudeGeometry(triangleShape, extrudeSettings);

        //добавление простого материала рандомного цвета
        let material = new THREE.MeshLambertMaterial({ color:basicColor, overdraw:true, });
        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.receiveShadow = true;
        // this.mesh.position.z -= roofStep/2;
    }

    //функция вывода секции на сцену
    function createSection() {

        let walls, roof, plane;

        walls = new Walls();
        roof = new Roof();

        scene.add(walls.mesh);
        scene.add(roof.mesh);

        let planeGeometry = new THREE.PlaneGeometry(SECTION_LENGTH*3,SECTION_WIDTH*3);
        let planeMaterial = new THREE.MeshBasicMaterial(
            {color: 0xcccccc});
        plane = new THREE.Mesh(planeGeometry,planeMaterial);
        plane.rotation.x = -0.5*Math.PI;

        scene.add(plane);
    }


    function addSection() {
        basicColor = Math.random() * 0xffffff; //обновляем цвет
        createSection();
    }

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

    window.addEventListener('load', init, false); // init при загрузке
    document.getElementById('addsection').addEventListener('click', addSection, false); // добавляем секцию при клике
})