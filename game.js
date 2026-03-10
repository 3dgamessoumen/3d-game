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
camera.position.set(0, 10, 15);
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableZoom = false;

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

/// ... [previous setup code above] ...

// 8. Animation Loop
function animate() {
    requestAnimationFrame(animate);

    // --- STEP 1: MOVEMENT ---
    if (input.up) player.position.z -= 0.2;
    if (input.down) player.position.z += 0.2;
    if (input.left) player.position.x -= 0.2;
    if (input.right) player.position.x += 0.2;

    // --- STEP 2: BOUNDARIES ---
    player.position.x = Math.max(-50, Math.min(50, player.position.x));
    player.position.z = Math.max(-50, Math.min(50, player.position.z));

    // --- STEP 3: THE FIX (CAMERA FOLLOW) ---
    // This makes the OrbitControls focus point follow the player
    controls.target.copy(player.position);
    
    // This moves the camera itself so it stays 15 units behind and 10 units up
    camera.position.set(
        player.position.x, 
        player.position.y + 10, 
        player.position.z + 15
    );
    // Essential: Update controls to apply the changes
    controls.update();

    // --- STEP 4: RENDER ---
    renderer.render(scene, camera);
}
animate();

    // Smooth Camera Follow
    controls.target.lerp(player.position, 0.1);
    controls.update();

    renderer.render(scene, camera);
}
animate();
