(() => {
  const fallbackUrl = "https://files.catbox.moe/q2us0o.png";
  const fallback = img => {
    if (!(img instanceof HTMLImageElement) || img.dataset.fallbackApplied === '1') return;
    img.dataset.fallbackApplied = '1';
    img.src = fallbackUrl;
    img.alt = img.alt || 'Shakil Dev';
  };
  document.querySelectorAll('img').forEach(img => img.addEventListener('error', () => fallback(img)));
  document.addEventListener('error', event => fallback(event.target), true);
})();
