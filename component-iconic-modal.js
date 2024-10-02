// {
//   "name": "iconic-modal.js",
//   "author": "Arham Web Works"
//   "description": "Copying in any form is strictly prohibited. Any instance of copying will be subject to legal action and accountability under the law."
// }

function showModal(o){o.classList.add("show-modal"),document.body.classList.add("iconic-overflow-hidden"),o.dispatchEvent(new Event("shown.custom.modal"))}function hideModal(o){o.classList.remove("show-modal"),document.body.classList.remove("iconic-overflow-hidden"),o.dispatchEvent(new Event("hidden.custom.modal"))}function closeModalOnClickOutside(o){o.addEventListener("click",(d=>{d.target===o&&hideModal(o)}))}
