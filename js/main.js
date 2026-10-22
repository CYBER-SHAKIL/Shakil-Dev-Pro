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

// ---------------- COLOR CHANGE ----------------  
function changeColor(color){  
    document.documentElement.style.setProperty('--glow-color', color);  
    const hex = color.replace('#', '');
    if (/^[0-9a-f]{6}$/i.test(hex)) {
        const rgb = [0, 2, 4].map(index => parseInt(hex.slice(index, index + 2), 16)).join(', ');
        document.documentElement.style.setProperty('--glow-rgb', rgb);
    }

    // থ্রি.জেএস ব্যাকগ্রাউন্ডের রং পরিবর্তন
    if (window.threeSceneMaterial) {
        window.threeSceneMaterial.color.set(color);
    }

    document.querySelectorAll('.card').forEach(card=>{  
        card.style.boxShadow = `0 0 15px ${color}`;  
    });  

    document.querySelectorAll('.float-btns div').forEach(btn=>{  
        btn.style.boxShadow = `0 6px 14px rgba(0,0,0,0.45), 0 0 16px ${color}`;  
    });  

    document.querySelectorAll('.thumbnail-wrapper').forEach(thumb=>{  
        thumb.style.boxShadow = `0 0 5px ${color}`;  
    });  

    document.querySelectorAll('.play-icon').forEach(icon=>{  
        icon.style.color = color;  
        icon.style.boxShadow = `0 0 5px ${color}`;  
    });  

    document.querySelectorAll('.video-wrapper').forEach(wrapper=>{  
        wrapper.style.boxShadow = `0 0 10px ${color}`;  
    });  

    document.querySelectorAll('.controls button').forEach(btn=>{  
        btn.style.background = color;  
    });  

    document.querySelectorAll('.info').forEach(info=>{  
        info.style.color = color;  
    });  

    document.querySelectorAll('.back-button').forEach(btn=>{  
        btn.style.color = color;  
        btn.style.boxShadow = `0 0 5px ${color}`;  
    });  

    document.querySelectorAll('.toast').forEach(toast=>{  
        toast.style.background = color;  
    });  

    document.querySelectorAll('.info-section h2').forEach(h2=>{  
        h2.style.color = color;  
        h2.style.textShadow = `0 0 15px ${color}`;  
    });  

    document.querySelectorAll('.info-content').forEach(content=>{  
        content.style.boxShadow = `0 0 20px ${color}`;  
    });  

    document.querySelectorAll('.device-info-item').forEach(item=>{  
        item.style.boxShadow = `0 0 10px ${color}`;  
    });  

    document.querySelectorAll('.device-info-item h3').forEach(h3=>{  
        h3.style.color = color;  
    });  
}  

// ---------------- MY PROJECTS: শুধু এই তালিকায় নতুন project যোগ করুন ----------------
// নতুন project যোগ করতে: নিচের যেকোনো object কপি করে array-এর শেষে বসাও।
// শুধু name, description, url, icon, color1, color2 বদলালেই হবে।
// image:"https://..." দিলে thumbnail-এ ছবি দেখাবে; image না দিলে icon-টাই থাকবে।
// আগের শেষ object-এর পরে comma দেবে; একদম শেষ object-এর পরে comma লাগবে না।
const PROJECTS = [
  {
    name: "CodeVault",
    description: "Edit HTML or ZIP files with a live preview.",
    url: "https://html-code-edits.netlify.app",
    badge: "HOT",
    icon: "</>",
    image: "https://files.catbox.moe/8bsw70.png",
    color1: "#4D6BFE",
    color2: "#1E3A8A"
  },
  {
    name: "TampMail",
    description: "Create a temporary inbox for verification emails.",
    url: "https://shakil-tampmail.netlify.app",
    badge: "HOT",
    icon: "TM",
    color1: "#06B6D4",
    color2: "#075985"
  },
  {
    name: "QR Code Generator",
    description: "Make custom QR codes for links, Wi-Fi, contacts and more.",
    url: "https://shakil-api-server.vercel.app",
    badge: "HOT",
    icon: "QR",
    color1: "#10A37F",
    color2: "#0B6E58"
  },
  {
    name: "Password Generator",
    description: "Generate strong passwords quickly and easily.",
    url: "https://randomcountrys-name-generator.netlify.app",
    badge: "HOT",
    icon: "PG",
    color1: "#8B5CF6",
    color2: "#5B21B6"
  },
  {
    name: "Shakil APK Store",
    description: "Publish and browse Android APKs and source files.",
    url: "https://shakil-apk-store.vercel.app/",
    badge: "NEW",
    icon: "APK",
    image: "https://files.catbox.moe/fm82hc.png",
    color1: "#F97316",
    color2: "#9A3412"
  },
    {
    name: "Hosting",
    description: "coming soon / Host & Deploy Your Messenger Bots — All in One Place!.",
    url: "",
    badge: "SOON",
    icon: "HOST",
    image: "https://files.catbox.moe/ipmf3l.png",
    color1: "#F97316",
    color2: "#9A3412"
    }
];

function renderProjects() {
  const grid = document.getElementById('project-grid');
  if (!grid) return;
  grid.replaceChildren();

  if (!PROJECTS.length) {
    const empty = document.createElement('p');
    empty.className = 'project-empty';
    empty.textContent = 'প্রজেক্ট যোগ করলে এখানে দেখা যাবে';
    grid.appendChild(empty);
    return;
  }

  PROJECTS.forEach(project => {
    const card = document.createElement('a');
    card.className = 'project-card';
    card.href = project.url;
    card.target = '_blank';
    card.rel = 'noopener noreferrer';
    card.setAttribute('aria-label', `${project.name}: ${project.description}`);

    const badge = document.createElement('span');
    badge.className = 'project-badge';
    badge.textContent = project.badge || 'HOT';

    const thumb = document.createElement('div');
    thumb.className = 'project-thumb';
    const color1 = project.color1 || '#00eaff';
    const color2 = project.color2 || '#bf00ff';
    thumb.style.setProperty('--thumb-color', color1);
    thumb.style.background = `linear-gradient(155deg, ${color1}, ${color2})`;

    const thumbLabel = document.createElement('span');
    thumbLabel.className = 'project-thumb-label';
    thumbLabel.textContent = project.icon || 'WEB';
    if ((project.icon || '').length > 2) thumbLabel.style.fontSize = '13px';
    thumb.appendChild(thumbLabel);

    // Optional image URL: show it as the project icon; otherwise keep the normal text icon.
    if (project.image && project.image.trim()) {
      const image = document.createElement('img');
      image.className = 'project-thumb-image';
      image.src = project.image.trim();
      image.alt = project.name ? `${project.name} icon` : 'Project icon';
      image.loading = 'lazy';
      // Keep the normal icon underneath the image as a reliable fallback.
      thumbLabel.textContent = project.fallbackIcon || project.icon || 'WEB';
      thumbLabel.style.display = 'flex';
      image.onerror = () => {
        image.remove();
        thumbLabel.textContent = project.fallbackIcon || project.icon || 'WEB';
        thumbLabel.style.display = 'flex';
      };
      thumb.appendChild(image);
    }

    const name = document.createElement('strong');
    name.className = 'project-name';
    name.textContent = project.name || 'Project';

    const description = document.createElement('span');
    description.className = 'project-description';
    description.textContent = project.description || '';

    card.append(badge, thumb, name, description);
    grid.appendChild(card);
  });
}

// ---------------- SHAKIL DEV AI ASSISTANT (SERVER API) ----------------
const botHistory = [];

function addBotMessage(text, sender) {
  const messages = document.getElementById('bot-messages');
  if (!messages) return null;
  const emptyState = document.getElementById('bot-empty-state');
  if (emptyState) emptyState.remove();
  const bubble = document.createElement('div');
  bubble.className = `bot-message${sender === 'user' ? ' user' : ''}`;
  bubble.textContent = text;
  messages.appendChild(bubble);
  messages.scrollTop = messages.scrollHeight;
  return bubble;
}

document.getElementById('bot-form')?.addEventListener('submit', async event => {
  event.preventDefault();
  const input = document.getElementById('bot-input');
  const submit = event.currentTarget.querySelector('button[type="submit"]');
  const message = input.value.trim();
  if (!message) return;
  addBotMessage(message, 'user');
  input.value = '';
  if (submit) submit.disabled = true;
  const waiting = addBotMessage('একটু অপেক্ষা করো…', 'bot');
  try {
    const response = await fetch('/api/ai', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, history: botHistory.slice(-8) })
    });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      const error = new Error(payload.error || 'AI request failed');
      error.status = response.status;
      error.code = payload.code;
      throw error;
    }
    const answer = String(payload.reply || '').trim();
    waiting.textContent = answer || 'দুঃখিত, এই মুহূর্তে উত্তর তৈরি করা যায়নি। আবার চেষ্টা করো।';
    botHistory.push({ role: 'user', text: message }, { role: 'model', text: answer });
    if (botHistory.length > 12) botHistory.splice(0, botHistory.length - 12);
  } catch (error) {
    console.error('Shakil AI request failed:', error);
    if (error.status === 503 || error.code === 'AI_NOT_CONFIGURED') {
      waiting.textContent = 'AI সার্ভিস এখনো configure করা হয়নি। সার্ভারের environment settings-এ Gemini API key যোগ করতে হবে।';
    } else if (error.status === 429) {
      waiting.textContent = 'এই মুহূর্তে AI ব্যবহারের সীমা পূর্ণ হয়েছে। কিছুক্ষণ পরে আবার চেষ্টা করো।';
    } else {
      waiting.textContent = 'দুঃখিত, AI এখন উত্তর দিতে পারেনি। কিছুক্ষণ পর আবার চেষ্টা করো।';
    }
  } finally {
    if (submit) submit.disabled = false;
    const messages = document.getElementById('bot-messages');
    if (messages) messages.scrollTop = messages.scrollHeight;
  }
});

async function updateVisitCount() {
  const counter = document.getElementById('total-view-count');
  if (!counter) return;
  try {
    const response = await fetch('/api/visits', { method: 'GET', cache: 'no-store' });
    if (!response.ok) return;
    const data = await response.json();
    if (Number.isSafeInteger(data.totalVisits) && data.totalVisits >= 0) {
      counter.textContent = data.totalVisits.toLocaleString();
    }
  } catch (error) {
    console.warn('Visit counter unavailable:', error);
  }
}
updateVisitCount();

// ---------------- VIDEO VIEWER FUNCTIONALITY ----------------  
const videos = [  
  { title: "Developer Shakil🫡😎", thumbnail: "https://files.catbox.moe/y1nbfk.jpg", url: "এখানে আপনার ভিডিওর লিংক বসান" },
  { title: "Shakil Dev", thumbnail: "https://files.catbox.moe/q2us0o.png", url: "এখানে আপনার ভিডিওর লিংক বসান" },
];  

let isPlaying = false;  
let currentVideoIndex = null;  
let screenHistory = [];  
let currentScreen = "thumbnails";  

function generateThumbnails() {  
  const c = document.getElementById('thumbnailsContainer');  
  c.innerHTML = '';  

  videos.forEach((v, i) => {  
    const item = document.createElement('div');  
    item.className = 'video-item';  
    item.innerHTML = `  
      <h2 class="video-title${/[\u0980-\u09FF]/.test(v.title) ? ' bengali-title' : ''}">${v.title}</h2>  
      <div class="thumbnail-wrapper">  
        <img src="${v.thumbnail}" class="thumbnail">  
        <div class="play-icon">▶</div>  
      </div>`;  
    item.addEventListener('click', (e) => {
        window.open(v.url, '_blank');
    });  
    c.appendChild(item);  
  });  
}  

function showScreen(screenName) {  
  if (currentScreen !== screenName) {  
    screenHistory.push(currentScreen);  
    history.pushState({}, "");  
  }  

  document.getElementById('thumbnailsContainer').style.display =  
    (screenName === 'thumbnails') ? 'block' : 'none';  

  document.getElementById('videoPlayerWrapper').style.display =  
    (screenName === 'video') ? 'block' : 'none';  

  document.getElementById('controls').style.display =  
    (screenName === 'video') ? 'flex' : 'none';  

  document.getElementById('fileInfo').style.display =  
    (screenName === 'video') ? 'block' : 'none';  

  document.getElementById('backButton').style.display =  
    screenHistory.length > 0 ? 'block' : 'none';  

  currentScreen = screenName;  
}  

function playVideo(i) {  
  const v = videos[i];  
  currentVideoIndex = i;  
  showScreen('video');  

  const video = document.getElementById('videoPlayer');  
  video.src = v.url;  

  video.addEventListener('loadedmetadata', () => {  
    if (video.videoWidth && video.videoHeight) {  
      document.getElementById('videoPlayerWrapper').style.aspectRatio =  
        `${video.videoWidth} / ${video.videoHeight}`;  
    }  
  });  

  video.play().catch(()=>{});  
  isPlaying = true;  

  const url = new URL(v.url);  
  document.getElementById('fileInfo').textContent =  
    `ডাওলোড এ ক্লিক করলে একটু পরে একাই গ্যালারিতে ভিডিও সেভ হয়ে যাবে✅`;  
}  

function autoDownload() {  
  if (currentVideoIndex === null) return;  
  const v = videos[currentVideoIndex];  
  const a = document.createElement("a");  
  a.href = v.url;  
  a.download = v.title + ".mp4";  
  document.body.appendChild(a);  
  a.click();  
  document.body.removeChild(a);  

  const toast = document.getElementById('downloadToast');  
  toast.textContent = `ভিডিও ডাউনলোড শুরু হয়ে গেছে নোটিফিকেশন চেক দাও`;  
  toast.classList.add('show');  
  setTimeout(() => toast.classList.remove('show'), 2000);  
}  

function goBack() {  
  if (screenHistory.length === 0) {  
    history.back();   
    return;  
  }  

  const previous = screenHistory.pop();  

  if (previous === 'thumbnails') {  
    const video = document.getElementById('videoPlayer');  
    video.pause();  
    video.src = '';  
    isPlaying = false;  
    currentVideoIndex = null;  
  }  

  showScreen(previous);  
}  

document.getElementById('backButton').onclick = goBack;  

window.addEventListener("popstate", () => {  
  goBack();  
});  

// ---------------- NEW FUNCTIONS FOR PERSONAL AND DEVICE INFO ----------------  
function showPersonalInfo() {  
  closeMenu();  
  document.getElementById('device-info-section').style.display = 'none';
  document.getElementById('personal-info-section').style.display = 'block';  
  history.pushState({}, "", "#personal-info");  
}  

function showDeviceInfo() {  
  closeMenu();  
  document.getElementById('personal-info-section').style.display = 'none';
  document.getElementById('device-info-section').style.display = 'block';  
  populateDeviceInfo();  
  history.pushState({}, "", "#device-info");  
}  

function hideInfoSections() {  
  document.getElementById('personal-info-section').style.display = 'none';  
  document.getElementById('device-info-section').style.display = 'none';  
  history.back();  
}  

function populateDeviceInfo() {  
  const deviceInfoGrid = document.getElementById('device-info-grid');  
  deviceInfoGrid.innerHTML = '';  

  const deviceInfo = [  
    { title: 'Platform', value: navigator.platform },  
    { title: 'User Agent', value: navigator.userAgent },  
    { title: 'Language', value: navigator.language },  
    { title: 'Cookies Enabled', value: navigator.cookieEnabled ? 'Yes' : 'No' },  
    { title: 'Screen Resolution', value: `${screen.width} x ${screen.height}` },  
    { title: 'Color Depth', value: `${screen.colorDepth} bits` },  
    { title: 'Browser Name', value: navigator.appName },  
    { title: 'Browser Version', value: navigator.appVersion },  
    { title: 'Online Status', value: navigator.onLine ? 'Online' : 'Offline' },  
    { title: 'Java Enabled', value: navigator.javaEnabled() ? 'Yes' : 'No' },  
    { title: 'Touch Points', value: navigator.maxTouchPoints || 'Not supported' },  
    { title: 'Device Memory', value: navigator.deviceMemory ? `${navigator.deviceMemory} GB` : 'Not available' }  
  ];  

  deviceInfo.forEach(info => {  
    const item = document.createElement('div');  
    item.className = 'device-info-item';  
    item.innerHTML = `  
      <h3>${info.title}</h3>  
      <p>${info.value}</p>  
    `;  
    deviceInfoGrid.appendChild(item);  
  });  
}  

// Handle browser back button for info sections  
window.addEventListener('popstate', function(event) {  
  hideInfoSections();  
});  

// পেজ লোড হওয়ার সময় থ্রি.জেএস ইনিশিয়ালাইজ
window.onload = function() {
    // প্রথমে লোডিং দেখাবে
    showLoading();
    startMusicByDefault();
    
    // 0.5 সেকেন্ড পরে লোডিং লুকাবে
    setTimeout(() => {
        hideLoading();
        renderProjects();
        generateThumbnails();
        initThreeScene();
    }, 500);
};
