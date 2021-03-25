let container, scene, camera, renderer, sphere, floor;

const LEFT = 37,
  RIGHT = 39,
  UP = 38,
  DOWN = 40;
let ADD = 0;
let rotate = 0;
let sphereMovePositionX = 0;
let sphereMovePositionZ = 0;
let sphereRotationZ = 0;
let sphereRotationX = 0;

function init() {
  container = document.querySelector("#scene-container");

  scene = new THREE.Scene();

  createCamera();
  createLights();
  createMesh();
  createRenderer();

  renderer.setAnimationLoop(() => {
    update();
    render();
  });
}

function createCamera() {
  const fov = 35;
  const aspect = container.clientWidth / container.clientHeight;
  const near = 1;
  const far = 1000;

  camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.set(0, 10, 200);
}

function createLights() {
  const ambientLight = new THREE.HemisphereLight(0xddeeff, 0x202020, 3);

  const mainLight = new THREE.DirectionalLight(0xffffff, 5.0);
  mainLight.position.set(0, 0, 10);

  scene.add(ambientLight, mainLight);
}

function createMesh() {
  const textureLoader = new THREE.TextureLoader();
  const floorMap = textureLoader.load("./hardwood2_diffuse.jpg");
  const sphereMap = textureLoader.load("./sprite.png");

  const floorGeometry = new THREE.BoxBufferGeometry(1000, 1, 1000);
  const floorMaterial = new THREE.MeshBasicMaterial({ map: floorMap });
  floor = new THREE.Mesh(floorGeometry, floorMaterial);
  scene.add(floor);

  const sphereGeometry = new THREE.SphereGeometry(1.5, 32, 32);
  const sphereMaterial = new THREE.MeshLambertMaterial({
    color: 0x0000ff,
    map: sphereMap,
  });
  sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
  sphere.position.y = 2;
  scene.add(sphere);

  const torusGeometry = new THREE.TorusBufferGeometry(10, 1, 10, 100);
  const torusMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });
  torus = new THREE.Mesh(torusGeometry, torusMaterial);
  torus.position.z = -100;
  scene.add(torus);
}

function createRenderer() {
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(window.devicePixelRatio);

  renderer.gammaFactor = 2.2;
  renderer.gammaOutput = true;

  renderer.physicallyCorrectLights = true;

  container.appendChild(renderer.domElement);
  document.addEventListener("keydown", onKeyDown, false);
}

function onKeyDown(e) {
  if (e.keyCode == LEFT) {
    ADD = -0.3;
    rotate = 0.2;
    sphereMovePositionX += ADD;
    sphereRotationZ += rotate;
  } else if (e.keyCode == RIGHT) {
    ADD = 0.3;
    rotate = -0.2;
    sphereMovePositionX += ADD;
    sphereRotationZ += rotate;
  } else if (e.keyCode == UP) {
    ADD = -0.3;
    rotate = -0.2;
    sphereMovePositionZ += ADD;
    sphereRotationX += rotate;
  } else if (e.keyCode == DOWN) {
    ADD = 0.3;
    rotate = 0.2;
    sphereMovePositionZ += ADD;
    sphereRotationX += rotate;
  } else return;
}

function update() {
  sphere.position.x = sphereMovePositionX;
  sphere.position.z = sphereMovePositionZ;
  sphere.rotation.z = sphereRotationZ;
  sphere.rotation.x = sphereRotationX;

  camera.position.x = sphere.position.x;
  camera.position.z = sphere.position.z + 50;
}

function render() {
  renderer.render(scene, camera);
}

function onWindowResize() {
  camera.aspect = container.clientWidth / container.clientHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(container.clientWidth, container.clientHeight);
}

window.addEventListener("resize", onWindowResize);

init();
