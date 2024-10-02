// {
//   "name": "component-iconic-accordion.js",
//   "author": "Arham Web Works"
//   "description": "Copying in any form is strictly prohibited. Any instance of copying will be subject to legal action and accountability under the law."
// }

(() => {
  class Accordion {
    constructor(accordionElement) {
      if (accordionElement.dataset.initialized === "true") return;

      this.accordionElement = accordionElement;
      this.accordionQuestions = this.accordionElement.querySelectorAll(
        ".iconic-accordion-content"
      );
      this.bindEvents();
      this.accordionElement.dataset.initialized = "true";
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
      const accordionContent = accordionQuestion.closest(
        ".iconic-accordion-main"
      );
      console.log(accordionContent, "accordionContent--");

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
  function initAccordions() {
    document
      .querySelectorAll("iconic-accordion")
      .forEach((accordionElement) => {
        new Accordion(accordionElement);
      });
  }

  document.addEventListener("DOMContentLoaded", initAccordions);
  document.addEventListener("shopify:section:load", initAccordions);
})();
