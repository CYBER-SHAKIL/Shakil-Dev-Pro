// Canonical public project catalogue. Kept server-side so the API is the single data source.
export const projects = [
  { name: 'CodeVault', description: 'Edit HTML or ZIP files with a live preview.', url: 'https://html-code-edits.netlify.app', badge: 'HOT', icon: '</>', image: 'https://files.catbox.moe/8bsw70.png', color1: '#4D6BFE', color2: '#1E3A8A' },
  { name: 'TampMail', description: 'Create a temporary inbox for verification emails.', url: 'https://shakil-tampmail.netlify.app', badge: 'HOT', icon: 'TM', color1: '#06B6D4', color2: '#075985' },
  { name: 'QR Code Generator', description: 'Make custom QR codes for links, Wi-Fi, contacts and more.', url: 'https://shakil-api-server.vercel.app', badge: 'HOT', icon: 'QR', color1: '#10A37F', color2: '#0B6E58' },
  { name: 'Password Generator', description: 'Generate strong passwords quickly and easily.', url: 'https://randomcountrys-name-generator.netlify.app', badge: 'HOT', icon: 'PG', color1: '#8B5CF6', color2: '#5B21B6' },
  { name: 'Shakil APK Store', description: 'Publish and browse Android APKs and source files.', url: 'https://shakil-apk-store.vercel.app/', badge: 'NEW', icon: 'APK', image: 'https://files.catbox.moe/fm82hc.png', color1: '#F97316', color2: '#9A3412' },
  { name: 'Hosting', description: 'Coming soon — host and deploy messenger bots.', url: '', badge: 'SOON', icon: 'HOST', image: 'https://files.catbox.moe/ipmf3l.png', color1: '#F97316', color2: '#9A3412' }
];

export function getPublicProjects() {
  return projects.map(({ name, description, url, badge, icon, image, color1, color2 }) =>
    ({ name, description, url, badge, icon, ...(image ? { image } : {}), color1, color2 }));
}
