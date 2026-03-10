// 1. Scene Setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.domElement.style.position = "absolute";
renderer.domElement.style.top = "0";
renderer.domElement.style.zIndex = "1";
document.body.appendChild(renderer.domElement);

// 2. Lighting
scene.add(new THREE.DirectionalLight(0xffffff, 1));
scene.add(new THREE.AmbientLight(0x404040));

// 3. Ground
const plane = new THREE.Mesh(new THREE.PlaneGeometry(100, 100), new THREE.MeshStandardMaterial({color: 0x2e7d32}));
plane.rotation.x = -Math.PI / 2;
scene.add(plane);

// 4. Character
const player = new THREE.Group();
const body = new THREE.Mesh(new THREE.BoxGeometry(1, 1.5, 0.5), new THREE.MeshStandardMaterial({color: 0x0000ff}));
body.position.y = 1;
player.add(body);
scene.add(player);

// 5. Obstacle (Tree)
const tree = new THREE.Group();
tree.add(new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 1), new THREE.MeshStandardMaterial({color: 0x5D4037})));
const leaves = new THREE.Mesh(new THREE.ConeGeometry(1, 2, 8), new THREE.MeshStandardMaterial({color: 0x2E7D32}));
leaves.position.y = 1.5;
tree.add(leaves);
tree.position.set(10, 0.5, 10);
scene.add(tree);
// 6. Camera Controls
const touchZone = document.getElementById('touch-area');

// Change this line! We pass touchZone instead of renderer.domElement
const controls = new THREE.OrbitControls(camera, touchZone); 

controls.enableZoom = false;
controls.enablePan = false;
controls.enableDamping = true; // Makes rotation feel smooth
controls.rotateSpeed = 0.8;

// 7. Input Logic
const input = { up: false, down: false, left: false, right: false };
const buttons = document.querySelectorAll('.btn');

buttons.forEach(btn => {
    btn.addEventListener('pointerdown', (e) => {
        e.preventDefault();
        input[btn.id] = true;
    });
    btn.addEventListener('pointerup', (e) => {
        e.preventDefault();
        input[btn.id] = false;
    });
    btn.addEventListener('pointerleave', (e) => {
        input[btn.id] = false;
    });
});

// 8. Animation Loop
function animate() {
    requestAnimationFrame(animate);

    // Get the current camera rotation
    const angle = controls.getAzimuthalAngle();

    // Move relative to where the camera is looking
    if (input.up) {
        player.position.x -= Math.sin(angle) * 0.2;
        player.position.z -= Math.cos(angle) * 0.2;
    }
    if (input.down) {
        player.position.x += Math.sin(angle) * 0.2;
        player.position.z += Math.cos(angle) * 0.2;
    }
    // ... repeat logic for left/right ...

    // Camera stays locked on the player
    controls.target.copy(player.position);
    controls.update();

    renderer.render(scene, camera);
}
animate();

// 9. Resize Logic (Bonus: keeps game looking right when you rotate phone)
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
