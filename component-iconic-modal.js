// {
//   "name": "iconic-modal.js",
//   "author": "Arham Web Works"
//   "description": "Copying in any form is strictly prohibited. Any instance of copying will be subject to legal action and accountability under the law."
// }

(() => {
  if (customElements.get('iconic-modal')) return;

  class IconicModal extends HTMLElement {
    constructor() {
      super();
      this.modal = this;
    }

    show() {
      this.modal.classList.add("show-modal");
      document.body.classList.add("iconic-overflow-hidden");
      this.dispatchEvent(new Event("shown.custom.modal"));
    }

    hide() {
      this.modal.classList.remove("show-modal");
      document.body.classList.remove("iconic-overflow-hidden");
      this.dispatchEvent(new Event("hidden.custom.modal"));
    }

    closeOnOutsideClick() {
      this.addEventListener("click", (e) => {
        if (e.target === this.modal) this.hide();
      });
    }
  }

  customElements.define('iconic-modal', IconicModal);

  // Simplified global functions
  const addClass = (modal, cls) => modal.classList.add(cls);
  const removeClass = (modal, cls) => modal.classList.remove(cls);

  window.showModal = (modal) => modal instanceof IconicModal ? modal.show() : addClass(modal, "show-modal");
  window.hideModal = (modal) => modal instanceof IconicModal ? modal.hide() : removeClass(modal, "show-modal");
  window.closeModalOnClickOutside = (modal) => modal instanceof IconicModal ? modal.closeOnOutsideClick() : modal.addEventListener("click", (e) => { if (e.target === modal) window.hideModal(modal); });
})();
