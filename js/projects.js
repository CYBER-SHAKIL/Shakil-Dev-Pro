// ---------------- MY PROJECTS: শুধু এই তালিকায় নতুন project যোগ করুন ----------------
// নতুন project যোগ করতে: নিচের যেকোনো object কপি করে array-এর শেষে বসাও।
// শুধু name, description, url, icon, color1, color2 বদলালেই হবে।
// image:"https://..." দিলে thumbnail-এ ছবি দেখাবে; image না দিলে icon-টাই থাকবে।
// আগের শেষ object-এর পরে comma দেবে; একদম শেষ object-এর পরে comma লাগবে না।
let PROJECTS = [
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
