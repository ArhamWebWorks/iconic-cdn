// {
//   "name": "component-iconic-accordion.js",
//   "author": "Arham Web Works"
//   "description": "Copying in any form is strictly prohibited. Any instance of copying will be subject to legal action and accountability under the law."
// }

(() => {
  if (customElements.get('iconic-accordion')) {
    return;
  }
  
  class IconicAccordion extends HTMLElement {
    constructor() {
      super();
      // Ensure the accordion hasn't already been initialized
      if (this.dataset.initialized === "true") return;

      this.accordionQuestions = this.querySelectorAll(".iconic-accordion-content");
      this.bindEvents();
      this.dataset.initialized = "true";
    }

    bindEvents() {
      this.accordionQuestions.forEach((accordionQuestion) => {
        // Remove any existing event listeners to prevent duplicates
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

      const isOpen = accordionContent.classList.contains("open");

      if (!isOpen) {
        accordionContent.classList.add("open");
        console.log("Opening accordion");
      } else {
        accordionContent.classList.remove("open");
        console.log("Closing accordion");
      }
    }
  }

  // Initialize accordions
  function initAccordions() {
    document.querySelectorAll("iconic-accordion").forEach((accordionElement) => {
      if (!accordionElement.dataset.initialized) {
        new IconicAccordion(accordionElement);
      }
    });
  }

  // Register the custom element
  customElements.define('iconic-accordion', IconicAccordion);

  // Listen to section load events (for Shopify)
  document.addEventListener("shopify:section:load", initAccordions);

  // Initialize accordions on page load
  document.addEventListener("DOMContentLoaded", initAccordions);
})();