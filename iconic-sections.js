// {
//   "name": "iconic-sections.js",
//   "author": "Arham Web Works"
//   "description": "Copying in any form is strictly prohibited. Any instance of copying will be subject to legal action and accountability under the law."
// }
function fadeInElements(){document.querySelectorAll("[data-fade-in]").forEach(e=>{isInViewport(e)&&!e.classList.contains("fade-in")&&(console.log("in2"),e.classList.add("fade-in"))})}function isInViewport(e){let t=e.getBoundingClientRect(),n=window.innerHeight||document.documentElement.clientHeight,i=window.innerWidth||document.documentElement.clientWidth,o=t.top<=n&&t.top+t.height>=0,a=t.left<=i&&t.left+t.width>=0;return o&&a}const observer=new MutationObserver(e=>{e.forEach(e=>{fadeInElements()})});observer.observe(document.body,{childList:!0,subtree:!0,attributes:!0,characterData:!0}),document.addEventListener("DOMContentLoaded",()=>{fadeInElements(),["load","scroll","shopify:section:load"].forEach(e=>{window.addEventListener(e,fadeInElements)})});