!(function () {
  const components = [
      {
          triggerBy: "tag",
          trigger: "iconic-swiper",
          scriptUrl: "https://unpkg.com/swiper@11.1.12/swiper-bundle.min.js",
          styleUrl: "https://unpkg.com/swiper@11.1.12/swiper-bundle.min.css",
      },
      // Add more components here if needed
  ];

  function loadComponent(component) {
      // Find all instances of the element based on the trigger type (tag or class)
      let elements = component.triggerBy === "tag"
          ? document.querySelectorAll(component.trigger)
          : document.querySelectorAll(`[class*=${component.trigger}]`);

      // Loop through each instance of the element
      elements.forEach((element, index) => {
          // Create a unique ID for each instance of the script and style
          const uniqueId = `${component.trigger}-unique-id-${index}`;
          const scriptAlreadyLoaded = document.getElementById(`${uniqueId}-script`);
          const styleAlreadyLoaded = document.getElementById(`${uniqueId}-style`);

          // If the element exists and the script or style hasn't been loaded yet
          if (!scriptAlreadyLoaded || !styleAlreadyLoaded) {
              const head = document.getElementsByTagName("head")[0];

              // Dynamically load the script if it hasn't been loaded
              if (!scriptAlreadyLoaded && component.scriptUrl) {
                  const script = document.createElement("script");
                  script.type = "text/javascript";
                  script.id = `${uniqueId}-script`; // Unique script ID for each instance
                  script.defer = true;
                  script.src = component.scriptUrl;

                  head.appendChild(script);

                  // When the script loads, initialize Swiper if available
                  script.onload = function () {
                      if (window.Swiper) {
                          initializeSwipers(); // Call your Swiper initialization function
                      }
                  };

                  script.onerror = function () {
                      console.error(`Failed to load script: ${component.scriptUrl}`);
                  };
              }

              // Dynamically load the stylesheet if provided
              if (!styleAlreadyLoaded && component.styleUrl) {
                  const link = document.createElement("link");
                  link.id = `${uniqueId}-style`; // Unique style ID for each instance
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

  function initializeSwipers() {
      const swiperContainers = document.querySelectorAll(".swiper-container");
      swiperContainers.forEach(container => {
          const config = JSON.parse(container.closest('iconic-swiper').getAttribute("data-config"));
          new Swiper(container, config);
      });
  }

  function initializeComponents() {
    components.forEach(loadComponent);
  }

  // Shopify section and block events for dynamic reload
  document.addEventListener("shopify:section:load", initializeComponents);
  // document.addEventListener("shopify:section:select", initializeComponents);
  // document.addEventListener("shopify:section:deselect", initializeComponents);
  // document.addEventListener("shopify:block:select", initializeComponents);
  // document.addEventListener("shopify:block:deselect", initializeComponents);

  initializeComponents();  // Initialize on page load
})();
