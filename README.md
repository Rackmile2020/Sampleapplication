
import * as bootstrap from 'bootstrap';

(function patchBootstrapModal() {
  const originalHide = bootstrap.Modal.prototype.hide;
  bootstrap.Modal.prototype.hide = function (...args: any[]) {
    try {
      return originalHide.apply(this, args);
    } catch (e) {
      console.warn('Safe modal close fallback', e);
      document.body.classList.remove('modal-open');
      document.querySelectorAll('.modal-backdrop').forEach(el => el.remove());
    }
  };
})();
