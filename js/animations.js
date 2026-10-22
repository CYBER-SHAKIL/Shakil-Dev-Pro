// ------------ আগের HTML থেকে নেওয়া জাভাস্ক্রিপ্ট শুরু ------------

// থ্রি.জেএস ব্যাকগ্রাউন্ড সিস্টেম
window.threeSceneMaterial = null;

const initThreeScene = () => {
    let scene, camera, renderer, clock, instancedMesh;
    const mouse = new THREE.Vector2();
    const dummy = new THREE.Object3D();
    
    function init() {
        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.set(0, 0, 50);
        clock = new THREE.Clock();

        renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('bg-canvas'), antialias: true, alpha: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(window.devicePixelRatio);

        createGravitationalMesh();
        
        window.addEventListener('resize', onWindowResize);
        document.body.addEventListener('mousemove', onMouseMove, { passive: true });
        
        document.body.addEventListener('pointerdown', onPointerDown);

        animate();
    }

    function createGravitationalMesh() {
        const initialColor = getComputedStyle(document.body).getPropertyValue('--glow-color').trim() || '#00eaff';
        const geometry = new THREE.IcosahedronGeometry(0.1, 0);
        const material = new THREE.MeshBasicMaterial({ color: initialColor });
        window.threeSceneMaterial = material;

        const particleCount = 10000;
        instancedMesh = new THREE.InstancedMesh(geometry, material, particleCount);
        for (let i = 0; i < particleCount; i++) {
            const x = (Math.random() - 0.5) * 100;
            const y = (Math.random() - 0.5) * 100;
            const z = (Math.random() - 0.5) * 100;
            dummy.position.set(x, y, z);
            dummy.updateMatrix();
            instancedMesh.setMatrixAt(i, dummy.matrix);
        }
        scene.add(instancedMesh);
    }

    function onPointerDown(event) {
        const mouseVec = new THREE.Vector3(
            (event.clientX / window.innerWidth) * 2 - 1,
            -(event.clientY / window.innerHeight) * 2 + 1,
            0.5
        );
        mouseVec.unproject(camera);
        const numBolts = 5 + Math.floor(Math.random() * 5);
        for (let i = 0; i < numBolts; i++) {
            createLightningBolt(mouseVec);
        }
    }

    function createLightningBolt(origin) {
        const points = [];
        const segmentLength = 2;
        const totalLength = 10 + Math.random() * 10;
        let currentPoint = origin.clone();
        points.push(currentPoint.clone());

        let direction = new THREE.Vector3((Math.random() - 0.5), (Math.random() - 0.5), (Math.random() - 0.5)).normalize();

        for (let l = 0; l < totalLength; l += segmentLength) {
            let nextPoint = currentPoint.clone().add(direction.clone().multiplyScalar(segmentLength));
            nextPoint.x += (Math.random() - 0.5) * 2;
            nextPoint.y += (Math.random() - 0.5) * 2;
            nextPoint.z += (Math.random() - 0.5) * 2;
            points.push(nextPoint.clone());
            currentPoint = nextPoint;
        }

        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const material = new THREE.LineBasicMaterial({
            color: window.threeSceneMaterial.color,
            linewidth: 2,
            transparent: true,
            opacity: 0.9,
            blending: THREE.AdditiveBlending,
        });

        const line = new THREE.Line(geometry, material);
        scene.add(line);

        gsap.to(material, {
            opacity: 0, duration: 0.5 + Math.random() * 0.3, ease: "power2.out", delay: 0.1,
            onComplete: () => { scene.remove(line); geometry.dispose(); material.dispose(); }
        });
    }

    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }

    function onMouseMove(event) {
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    }

    function animate() {
        requestAnimationFrame(animate);
        const elapsedTime = clock.getElapsedTime();

        if (instancedMesh) {
            const mouse3D = new THREE.Vector3(mouse.x, mouse.y, 0.8).unproject(camera);
            const tempPosition = new THREE.Vector3();
            const directionToMouse = new THREE.Vector3();
            
            for (let i = 0; i < instancedMesh.count; i++) {
                instancedMesh.getMatrixAt(i, dummy.matrix);
                tempPosition.setFromMatrixPosition(dummy.matrix);

                // 1. Gravity Simulation
                const distance = tempPosition.distanceTo(mouse3D);
                const forceFactor = Math.max(0, 15 - distance);
                if (forceFactor > 0.1) {
                    directionToMouse.subVectors(tempPosition, mouse3D).normalize();
                    tempPosition.addScaledVector(directionToMouse, forceFactor * 0.01);
                }

                // 2. Remove audio visualizer effect completely
                // No audio effects - background remains static
                
                dummy.position.copy(tempPosition);
                dummy.updateMatrix();
                instancedMesh.setMatrixAt(i, dummy.matrix);
            }
            instancedMesh.instanceMatrix.needsUpdate = true;
            instancedMesh.rotation.y = elapsedTime * 0.05;
        }

        renderer.render(scene, camera);
    }
    init();
};

// লোডিং ফাংশন
function showLoading() {
    const loadingOverlay = document.getElementById('loading-overlay');
    loadingOverlay.style.display = 'flex';
    loadingOverlay.style.opacity = '1';
}

function hideLoading() {
    const loadingOverlay = document.getElementById('loading-overlay');
    loadingOverlay.style.opacity = '0';
    setTimeout(() => {
        loadingOverlay.style.display = 'none';
    }, 300);
}

// মেনু টগল ফাংশন
function toggleMenu() {
    const navMenu = document.getElementById('navMenu');
    const menuButton = document.getElementById('menu-toggle');
    const isOpen = navMenu.classList.toggle('active');
    menuButton?.classList.toggle('active', isOpen);
    menuButton?.setAttribute('aria-expanded', String(isOpen));
    menuButton?.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
}

function closeMenu() {
    const navMenu = document.getElementById('navMenu');
    navMenu.classList.remove('active');
    const menuButton = document.getElementById('menu-toggle');
    menuButton?.classList.remove('active');
    menuButton?.setAttribute('aria-expanded', 'false');
    menuButton?.setAttribute('aria-label', 'Open menu');
}

document.addEventListener('pointerdown', event => {
    const navMenu = document.getElementById('navMenu');
    const menuButton = document.getElementById('menu-toggle');
    if (navMenu?.classList.contains('active') && !navMenu.contains(event.target) && !menuButton?.contains(event.target)) closeMenu();
});

document.addEventListener('keydown', event => {
    if (event.key === 'Escape') closeMenu();
});

// টাচ অ্যানিমেশন সিস্টেম
const touchContainer = document.getElementById('touch-container');
let currentTouchCircle = null;

function createParticles(x, y) {
    const numParticles = 10;
    for (let i = 0; i < numParticles; i++) {
        const particle = document.createElement('div');
        particle.className = 'touch-particle';
        const size = Math.random() * 5 + 3;
        const angle = Math.random() * 2 * Math.PI;
        const distance = Math.random() * 50 + 20;
        const particleX = Math.cos(angle) * distance;
        const particleY = Math.sin(angle) * distance;

        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${x}px`;
        particle.style.top = `${y}px`;
        particle.style.animationDelay = `${Math.random() * 0.1}s`;
        particle.style.setProperty('--x', `${particleX}px`);
        particle.style.setProperty('--y', `${particleY}px`);

        touchContainer.appendChild(particle);
        particle.addEventListener('animationend', () => {
            particle.remove();
        });
    }
}

touchContainer.addEventListener('mousedown', (e) => {
    currentTouchCircle = document.createElement('div');
    currentTouchCircle.className = 'touch-circle';
    const size = 20;
    currentTouchCircle.style.width = `${size}px`;
    currentTouchCircle.style.height = `${size}px`;
    currentTouchCircle.style.left = `${e.clientX - size / 2}px`;
    currentTouchCircle.style.top = `${e.clientY - size / 2}px`;
    touchContainer.appendChild(currentTouchCircle);
});

touchContainer.addEventListener('mouseup', (e) => {
    if (currentTouchCircle) {
        createParticles(e.clientX, e.clientY);
        currentTouchCircle.remove();
        currentTouchCircle = null;
    }
});

touchContainer.addEventListener('touchstart', (e) => {
    const touch = e.touches[0];
    currentTouchCircle = document.createElement('div');
    currentTouchCircle.className = 'touch-circle';
    const size = 20;
    currentTouchCircle.style.width = `${size}px`;
    currentTouchCircle.style.height = `${size}px`;
    currentTouchCircle.style.left = `${touch.clientX - size / 2}px`;
    currentTouchCircle.style.top = `${touch.clientY - size / 2}px`;
    touchContainer.appendChild(currentTouchCircle);
    e.preventDefault();
}, { passive: false });

touchContainer.addEventListener('touchend', (e) => {
    if (currentTouchCircle) {
        const touch = e.changedTouches[0];
        createParticles(touch.clientX, touch.clientY);
        currentTouchCircle.remove();
        currentTouchCircle = null;
    }
});

// Background music: try to start on every visit; keep a manual off choice for this page only.
let musicUnlockListener = null;
let musicManuallyDisabled = false;

function saveMusicPreference(value) {
    try { localStorage.setItem('shakil-audio-preference', value); }
    catch (error) {}
}

function updateMusicToggle() {
    const music = document.getElementById('background-music');
    const button = document.getElementById('sound-toggle');
    if (!music || !button) return;
    const playing = !music.paused;
    button.textContent = playing ? '🔊 Sound On' : '🔇 Sound Off';
    button.setAttribute('aria-pressed', String(playing));
}

function toggleBackgroundMusic() {
    const music = document.getElementById('background-music');
    if (!music) return;
    if (musicUnlockListener) {
        document.removeEventListener('pointerdown', musicUnlockListener);
        musicUnlockListener = null;
    }
    if (music.paused) {
        musicManuallyDisabled = false;
        music.play().then(() => {
            saveMusicPreference('on');
            updateMusicToggle();
        }).catch(() => {
            const button = document.getElementById('sound-toggle');
            if (button) button.textContent = '🔇 Tap to retry';
        });
    } else {
        musicManuallyDisabled = true;
        music.pause();
        saveMusicPreference('off');
        updateMusicToggle();
    }
}

function startMusicByDefault() {
    const music = document.getElementById('background-music');
    if (!music) return;
    musicManuallyDisabled = false;

    // Try autoplay first. If the browser blocks sound, the first page tap/click
    // unlocks playback (except an intentional tap on the sound toggle itself).
    const removeUnlockListeners = () => {
        document.removeEventListener('pointerdown', musicUnlockListener);
        document.removeEventListener('keydown', musicUnlockListener);
        musicUnlockListener = null;
    };
    music.play().then(updateMusicToggle).catch(() => {
        musicUnlockListener = event => {
            const target = event.target;
            if (target && target.closest && target.closest('#sound-toggle')) return;
            if (musicManuallyDisabled) {
                removeUnlockListeners();
                return;
            }
            music.play().then(() => {
                removeUnlockListeners();
                updateMusicToggle();
            }).catch(updateMusicToggle);
        };
        document.addEventListener('pointerdown', musicUnlockListener);
        document.addEventListener('keydown', musicUnlockListener);
    });
}

document.getElementById('background-music')?.addEventListener('play', updateMusicToggle);
document.getElementById('background-music')?.addEventListener('pause', updateMusicToggle);

// ------------ আগের HTML থেকে নেওয়া জাভাস্ক্রিপ্ট শেষ ------------
