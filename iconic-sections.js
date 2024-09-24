// {
//   "name": "iconic-sections.js",
//   "author": "Arham Web Works"
//   "description": "Copying in any form is strictly prohibited. Any instance of copying will be subject to legal action and accountability under the law."
// }
!(function () {
  const components = [
      {
          triggerBy: "tag",
          trigger: "iconic-swiper",
          scriptUrl: "https://cdn.jsdelivr.net/gh/ArhamWebWorks/iconic-cdn/component-iconic-swiper.js",
          styleUrl: "https://cdn.jsdelivr.net/gh/ArhamWebWorks/iconic-cdn/component-iconic-swiper.css",
      },
      {
        triggerBy: "tag",
        trigger: "iconic-rotating-bar",
        scriptUrl: "https://cdn.jsdelivr.net/gh/ArhamWebWorks/iconic-cdn/component-iconic-rotatingbar.js",
        styleUrl: "",
      },
      {
        triggerBy: "tag",
        trigger: "branding-text",
        scriptUrl: "https://cdn.jsdelivr.net/gh/ArhamWebWorks/iconic-cdn/component-iconic-branding-text.js",
        styleUrl: "",
      },
      // Add more components here if needed
  ];

  function loadComponent(component) {
      let elements = component.triggerBy === "tag"
          ? document.querySelectorAll(component.trigger)
          : document.querySelectorAll(`[class*=${component.trigger}]`);

      elements.forEach((element, index) => {
          const uniqueId = `${component.trigger}-unique-id-${index}`;
          const scriptAlreadyLoaded = document.getElementById(`${uniqueId}-script`);
          const styleAlreadyLoaded = document.getElementById(`${uniqueId}-style`);

          if (!scriptAlreadyLoaded || !styleAlreadyLoaded) {
              const head = document.getElementsByTagName("head")[0];

              // Dynamically load the script if it hasn't been loaded
              if (!scriptAlreadyLoaded && component.scriptUrl) {
                  const script = document.createElement("script");
                  script.type = "text/javascript";
                  script.id = `${uniqueId}-script`;
                  script.defer = true;
                  script.src = component.scriptUrl;

                  head.appendChild(script);

              }

              // Dynamically load the stylesheet if provided
              if (!styleAlreadyLoaded && component.styleUrl) {
                  const link = document.createElement("link");
                  link.id = `${uniqueId}-style`;
                  link.rel = "stylesheet";
                  link.type = "text/css";
                  link.href = component.styleUrl;
                  link.media = "all";

                  head.appendChild(link);
              }
          } else {
              console.log(`Component resources already loaded for instance ${index}.`);
          }
      });
  }

  function initializeComponents() {
    components.forEach(loadComponent);
  }

  document.addEventListener("shopify:section:load", initializeComponents);

  initializeComponents();
})();

// Element animation
function initializeObserver() {
  // Check if an observer is already defined to avoid redeclaration
  if (typeof window.domObserver === 'undefined') {
    // Element animation
    function fadeInElements() {
      document.querySelectorAll('[data-fade-in]').forEach((element) => {
        if (isInViewport(element) && !element.classList.contains('fade-in')) {
          console.log('in2');
          element.classList.add('fade-in');
        }
      });
    }

    function isInViewport(element) {
      const rect = element.getBoundingClientRect();
      const windowHeight = (window.innerHeight || document.documentElement.clientHeight);
      const windowWidth = (window.innerWidth || document.documentElement.clientWidth);

      // Check if any part of the element is visible in the viewport
      const vertInView = (rect.top <= windowHeight) && ((rect.top + rect.height) >= 0);
      const horInView = (rect.left <= windowWidth) && ((rect.left + rect.width) >= 0);

      return (vertInView && horInView);
    }

    // Create the observer if it doesn't exist
    window.domObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        fadeInElements();
      });
    });

    window.domObserver.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true, // Observe attribute changes
      characterData: true // Observe changes to text content
    });

    document.addEventListener('DOMContentLoaded', () => {
      fadeInElements(); // Call on DOMContentLoaded to handle initial state
      ['load', 'scroll', 'shopify:section:load'].forEach((eventName) => {
        window.addEventListener(eventName, fadeInElements);
      });
    });
  }
}

// Initialize the observer once on script load
initializeObserver();

//# sourceMappingURL=iconic-sections.min.js.map