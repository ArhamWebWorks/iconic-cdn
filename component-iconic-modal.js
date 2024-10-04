// {
//   "name": "iconic-modal.js",
//   "author": "Arham Web Works"
//   "description": "Copying in any form is strictly prohibited. Any instance of copying will be subject to legal action and accountability under the law."
// }

(() => {
  if (customElements.get("iconic-modal")) return;

  class IconicModal extends HTMLElement {
    constructor() {
      super();

      this.modal = document.querySelector("iconic-modal");
      this.addEventListener("click", (event) => {
        if (event.target === this.modal) {
          this.hide();
        }
      });
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
  }

  customElements.define("iconic-modal", IconicModal);
})();
