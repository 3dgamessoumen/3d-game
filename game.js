// 1. Scene Setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
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

// 7. Inputs
const input = { up:false, down:false, left:false, right:false };
document.querySelectorAll('.btn').forEach(b => {
    b.addEventListener('touchstart', (e) => { e.stopPropagation(); e.preventDefault(); input[b.id] = true; }, {passive: false});
    b.addEventListener('touchend', (e) => { e.stopPropagation(); e.preventDefault(); input[b.id] = false; }, {passive: false});
});

// In your animate loop:
function animate() {
    requestAnimationFrame(animate);

    // 1. Move Player
    if(input.up) player.position.z -= 0.2;
    // ... (other inputs)

    // 2. Smoothly move the camera target toward the player
    controls.target.lerp(player.position, 0.1); 
    controls.update();

    renderer.render(scene, camera);
}
animate();
