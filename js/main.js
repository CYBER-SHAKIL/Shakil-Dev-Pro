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
        fetch('/api/projects', { cache: 'no-store' })
            .then(response => response.ok ? response.json() : Promise.reject(new Error('Projects API unavailable')))
            .then(data => {
                if (Array.isArray(data.projects)) {
                    PROJECTS = data.projects;
                    renderProjects();
                }
            })
            .catch(error => console.warn('Using local project catalogue:', error));
        generateThumbnails();
        initThreeScene();
    }, 500);
};
