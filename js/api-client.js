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
