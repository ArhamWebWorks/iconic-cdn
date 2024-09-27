// {
//   "name": "iconic-modal.js",
//   "author": "Arham Web Works"
//   "description": "Copying in any form is strictly prohibited. Any instance of copying will be subject to legal action and accountability under the law."
// }

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
  modal.addEventListener("click", (event) => {
    if (event.target === modal) {
      hideModal(modal);
    }
  });
}
