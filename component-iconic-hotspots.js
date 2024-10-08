// {
//   "name": "component-iconic-hotspots.js",
//   "author": "Arham Web Works"
//   "description": "Copying in any form is strictly prohibited. Any instance of copying will be subject to legal action and accountability under the law."
// }

(() => {
  if (customElements.get("iconic-hotspots")) {
    return;
  }

  class ShopTheLook extends HTMLElement {
    constructor() {
      super();
    }

    connectedCallback() {
      this.initShopTheLook();
    }

    initShopTheLook() {
      const triggers = this.querySelectorAll(".iconic-hotspots-popover");
      const popovers = this.querySelectorAll(".iconic-hotspots-popover-content");

      triggers.forEach((trigger, index) => {
        const popoverContent = popovers[index];
        const eventType = trigger.getAttribute("data-event");

        const togglePopover = () => {
          popovers.forEach((popover, i) => {
            if (i !== index) {
              popover.classList.remove("active-popover");
            }
          });
          popoverContent.classList.toggle("active-popover");
        };

        if (eventType === "click") {
          trigger.addEventListener("click", togglePopover);
        } else if (eventType === "hover") {
          trigger.addEventListener("mouseenter", togglePopover);
          trigger.addEventListener("mouseleave", () => {
            popoverContent.classList.remove("active-popover");
          });
        }

        document.addEventListener("click", (e) => {
          if (
            !trigger.contains(e.target) &&
            !popoverContent.contains(e.target)
          ) {
            popoverContent.classList.remove("active-popover");
          }
        });
      });
    }
  }

  customElements.define("iconic-hotspots", ShopTheLook);
})();