// {
//   "name": "iconic-modal.js",
//   "author": "Arham Web Works"
//   "description": "Copying in any form is strictly prohibited. Any instance of copying will be subject to legal action and accountability under the law."
// }

(() => {
  if (customElements.get('iconic-modal')) return;

  // Define simple functions globally or within this IIFE
  function showModal(modal) {
    modal.classList.add("show-modal");
    document.body.classList.add("iconic-overflow-hidden");
    modal.dispatchEvent(new Event("shown.custom.modal"));
  }

  function hideModal(modal) {
    modal.classList.remove("show-modal");
    document.body.classList.remove("iconic-overflow-hidden");
    modal.dispatchEvent(new Event("hidden.custom.modal"));
  }

  function closeModalOnClickOutside(modal) {
    modal.addEventListener("click", function(event) {
      if (event.target === modal) {
        hideModal(modal);
      }
    });
  }

  // Define the custom element
  class IconicModal extends HTMLElement {
    constructor() {
      super();
      this.modal = this;
    }

    connectedCallback() {
      // Example usage of the functions inside the custom element
      showModal(this.modal);              // Show modal when connected
      hideModal(this.modal);              // hide modal when connected
      closeModalOnClickOutside(this.modal); // Close modal on outside click
    }
  }

  // Register the custom element
  customElements.define('iconic-modal', IconicModal);
})();
