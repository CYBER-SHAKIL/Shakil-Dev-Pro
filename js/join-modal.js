(() => {
  const backdrop = document.getElementById('join-modal-backdrop');
  const closeButton = document.getElementById('join-modal-close');
  const laterButton = document.getElementById('join-modal-later');
  if (!backdrop) return;
  const closePopup = () => {
    backdrop.classList.remove('is-visible');
    document.body.style.overflow = '';
    try { sessionStorage.setItem('shakilJoinPopupDismissed', '1'); } catch (_) {}
  };
  let dismissed = false;
  try { dismissed = sessionStorage.getItem('shakilJoinPopupDismissed') === '1'; } catch (_) {}
  if (!dismissed) {
    window.setTimeout(() => {
      backdrop.classList.add('is-visible');
      document.body.style.overflow = 'hidden';
      closeButton.focus({ preventScroll: true });
    }, 650);
  }
  closeButton.addEventListener('click', closePopup);
  laterButton.addEventListener('click', closePopup);
  backdrop.addEventListener('click', event => { if (event.target === backdrop) closePopup(); });
  document.addEventListener('keydown', event => { if (event.key === 'Escape' && backdrop.classList.contains('is-visible')) closePopup(); });
})();
