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

    //добавляем свет

    function createLights() {

        let spotLight;
        spotLight = new THREE.DirectionalLight(0xffffff, 0.75);
        spotLight.position.set( 100, 100, 100 ).normalize();
        spotLight.castShadow = true;

        spotLight.shadow.mapSize.width = 512*4;
        spotLight.shadow.mapSize.height = 512*4;
        spotLight.shadow.camera.near = 1;
        spotLight.shadow.camera.far = 1000;
        spotLight.shadow.bias = -0.01;

        scene.add(spotLight);
    }

    Section = function() {
        let geometry = new THREE.BoxBufferGeometry( 20, 20, 20 );

        //добавление текстуры
        let material = new THREE.MeshLambertMaterial({ color: Math.random() * 0xffffff, overdraw:true, });
        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.receiveShadow = true;
    }

    let section;

    function createSection() {

        for (let i = 0; i < 500; i++) {

            section = new Section();

            section.mesh.position.x = Math.random() * 800 - 400;
            section.mesh.position.y = Math.random() * 800 - 400;
            section.mesh.position.z = Math.random() * 800 - 400;

            section.mesh.rotation.x = Math.random() * 2 * Math.PI;
            section.mesh.rotation.y = Math.random() * 2 * Math.PI;
            section.mesh.rotation.z = Math.random() * 2 * Math.PI;

            // section.mesh.scale.x = Math.random() + 0.5;
            // section.mesh.scale.y = Math.random() + 0.5;
            // section.mesh.scale.z = Math.random() + 0.5;

            scene.add(section.mesh);

        }
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

})