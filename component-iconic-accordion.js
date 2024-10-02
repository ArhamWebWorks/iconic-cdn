// {
//   "name": "component-iconic-accordion.js",
//   "author": "Arham Web Works"
//   "description": "Copying in any form is strictly prohibited. Any instance of copying will be subject to legal action and accountability under the law."
// }

(()=>{class o{constructor(o){"true"!==o.dataset.initialized&&(this.accordionElement=o,this.accordionQuestions=this.accordionElement.querySelectorAll(".iconic-accordion-content"),this.bindEvents(),this.accordionElement.dataset.initialized="true")}bindEvents(){this.accordionQuestions.forEach((o=>{o.removeEventListener("click",this.handleAccordionClick),o.addEventListener("click",this.handleAccordionClick.bind(this,o))}))}handleAccordionClick(o,n){n.preventDefault(),n.stopPropagation(),this.toggleAccordion(o)}toggleAccordion(o){const n=o.closest(".iconic-accordion-main");console.log(n,"accordionContent--");n.classList.contains("open")?(n.classList.remove("open"),console.log("Closing accordion")):(n.classList.add("open"),console.log("Opening accordion"))}}function n(){document.querySelectorAll("iconic-accordion").forEach((n=>{new o(n)}))}document.addEventListener("DOMContentLoaded",n),document.addEventListener("shopify:section:load",n)})();
