// {
//   "name": "component-iconic-accordion.js",
//   "author": "Arham Web Works"
//   "description": "Copying in any form is strictly prohibited. Any instance of copying will be subject to legal action and accountability under the law."
// }

// {
//   "name": "iconic-advance-faq-second.js",
//   "author": "Arham Web Works"
//   "description": "Copying in any form is strictly prohibited. Any instance of copying will be subject to legal action and accountability under the law."
// }

(() => {
  if (customElements.get("iconic-accordion")) {
    return;
  }

  class IconicAccordion extends HTMLElement {
    constructor() {
      super();
      if (this.dataset.initialized === "true") return;
      this.accordionQuestions = this.querySelectorAll(".iconic-accordion-content");
      this.bindEvents();
      this.dataset.initialized = "true";
    }

    bindEvents() {
      this.accordionQuestions.forEach((accordionQuestion) => {
        accordionQuestion.removeEventListener(
          "click",
          this.handleAccordionClick
        );
        accordionQuestion.addEventListener(
          "click",
          this.handleAccordionClick.bind(this, accordionQuestion)
        );
      });
    }

    handleAccordionClick(accordionQuestion, event) {
      event.preventDefault();
      event.stopPropagation();
      this.toggleAccordion(accordionQuestion);
    }

    toggleAccordion(accordionQuestion) {
      const accordionContent = accordionQuestion.closest(".iconic-accordion-main");
      
      if (this.hasAttribute("data-close-other")) {
        document.querySelectorAll(".iconic-accordion-main.open").forEach((openAccordion) => {
          if (openAccordion !== accordionContent) {
            openAccordion.classList.remove("open");
          }
        });
      }
      
      const isOpen = accordionContent.classList.contains("open");
      if (!isOpen) {
        accordionContent.classList.add("open");
      } else {
        accordionContent.classList.remove("open");
      }
    }
  }

  function initAccordions() {
    document.querySelectorAll("iconic-accordion").forEach((accordionElement) => {
        if (!accordionElement.dataset.initialized) {
          new IconicAccordion(accordionElement);
        }
      });
  }

  customElements.define("iconic-accordion", IconicAccordion);
  document.addEventListener("shopify:section:load", initAccordions);
  document.addEventListener("DOMContentLoaded", initAccordions);
})();