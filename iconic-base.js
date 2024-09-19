// {
//   "name": "iconic-base.js",
//   "author": "Arham Web Works"
//   "description": "Copying in any form is strictly prohibited. Any instance of copying will be subject to legal action and accountability under the law."
// }
!(function () {
  const components = [
      {
        triggerBy: "tag",
        trigger: "iconic-swiper",
        scriptUrl: "https://shop.arhamwebworks.com/cdn/shop/t/26/assets/component-iconic-swiper.js?v=119886094981147645441726479285",
        styleUrl: "https://unpkg.com/swiper@11.1.12/swiper-bundle.min.css",
      },
      {
        triggerBy: "tag",
        trigger: "iconic-rotating-bar",
        scriptUrl: "https://shop.arhamwebworks.com/cdn/shop/t/26/assets/component-iconic-rotatingbar.js?v=156775939512823132231726481902",
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
