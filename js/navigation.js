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
