// {
//   "name": "component-iconic-branding-text.js",
//   "author": "Arham Web Works"
//   "description": "Copying in any form is strictly prohibited. Any instance of copying will be subject to legal action and accountability under the law."
// }

function adjustFontSizeToFill(containerId, textId) {
  const container = document.getElementById(containerId);
  const text = document.getElementById(textId);
  if (!text) return;

  const targetPercentage = parseFloat(text.getAttribute('data-font-size')) || 100;

  function adjustFontSize() {
    let fontSize = 10;
    let increment = 1;
    let maxWidth = container.offsetWidth * (targetPercentage / 100);
    text.style.fontSize = `${fontSize}px`;

    while (text.offsetWidth < maxWidth && fontSize < 300) {
      fontSize += increment;
      text.style.fontSize = `${fontSize}px`;
    }

    // Roll back by 1 increment if exceeded
    if (text.offsetWidth > maxWidth) {
      fontSize -= increment;
      text.style.fontSize = `${fontSize}px`;
    }
  }

  // Ensure we handle layout shifts after save/load
  setTimeout(() => {
    adjustFontSize();
  }, 100); // Small delay ensures layout is stable

  // Attach resize listener
  window.addEventListener('resize', adjustFontSize);
}

function applyFontAdjustments() {
  const brandingSections = document.querySelectorAll('.iconic-branding-text-section');
  
  brandingSections.forEach((section) => {
    const sectionId = section.getAttribute('data-section-id');
    const containerId = `brandingWrapper-${sectionId}`;
    const textId = `brandingText-${sectionId}`;
    console.log('test area',sectionId,containerId,textId);
    adjustFontSizeToFill(containerId, textId);
  });
}

// Initial load and on section reload (Shopify specific)
document.addEventListener('DOMContentLoaded', applyFontAdjustments);

document.addEventListener('shopify:section:load', function () {
  applyFontAdjustments();
});
