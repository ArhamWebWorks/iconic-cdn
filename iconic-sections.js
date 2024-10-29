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
      styleUrl: "https://cdn.jsdelivr.net/gh/ArhamWebWorks/iconic-cdn/component-iconic-rotatingbar.css",
    },
    {
      triggerBy: "tag",
      trigger: "iconic-accordion",
      scriptUrl: "https://cdn.jsdelivr.net/gh/ArhamWebWorks/iconic-cdn/component-iconic-accordion.js",
      styleUrl: "https://cdn.jsdelivr.net/gh/ArhamWebWorks/iconic-cdn/component-iconic-accordion.css",
    },
    {
      triggerBy: "tag",
      trigger: "iconic-modal",
      scriptUrl: "https://cdn.jsdelivr.net/gh/ArhamWebWorks/iconic-cdn/component-iconic-modal.js",
      styleUrl: "https://cdn.jsdelivr.net/gh/ArhamWebWorks/iconic-cdn/component-iconic-modal.css",
    },
    {
      triggerBy: "tag",
      trigger: "iconic-countdown-timer",
      scriptUrl: "https://cdn.jsdelivr.net/gh/ArhamWebWorks/iconic-cdn/component-iconic-countdown-timer.js",
      styleUrl: "https://cdn.jsdelivr.net/gh/ArhamWebWorks/iconic-cdn/component-countdown-timer.css",
    },
    {
      triggerBy: "tag",
      trigger: "iconic-hotspots",
      scriptUrl: "https://cdn.jsdelivr.net/gh/ArhamWebWorks/iconic-cdn/component-iconic-hotspots.js",
      styleUrl: "https://cdn.jsdelivr.net/gh/ArhamWebWorks/iconic-cdn/component-iconic-hotspots.css",
    },
    // Add more components here if needed
  ];

  function isFileAlreadyLoaded(fileUrl) {
    const existingScripts = document.querySelectorAll("script[src]");
    const existingStyles = document.querySelectorAll("link[href]");

    // Check if the script is already added
    for (const script of existingScripts) {
      if (script.src === fileUrl) {
        return true;
      }
    }

    // Check if the style is already added
    for (const style of existingStyles) {
      if (style.href === fileUrl) {
        return true;
      }
    }

    return false;
  }

  function loadComponent(component) {
    // Find all instances of the element based on the trigger type (tag or class)
    const elements = component.triggerBy === "tag"
      ? document.querySelectorAll(component.trigger)
      : document.querySelectorAll(`[class*=${component.trigger}]`);

    // Loop through each instance of the element
    elements.forEach((element, index) => {
      const uniqueId = `${component.trigger}-unique-id-${index}`;

      // Only add the script if it's not already loaded
      if (component.scriptUrl && !isFileAlreadyLoaded(component.scriptUrl)) {
        const script = document.createElement("script");
        script.type = "text/javascript";
        script.defer = true;
        script.src = component.scriptUrl;

        document.head.appendChild(script);
      } else {
        // console.log(`Component js resources already loaded for instance ${index}.`);
      }

      // Only add the style if it's not already loaded
      if (component.styleUrl && !isFileAlreadyLoaded(component.styleUrl)) {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.type = "text/css";
        link.href = component.styleUrl;
        link.media = "all";

        document.head.appendChild(link);
      } else {
        // console.log(`Component csss resources already loaded for instance ${index}.`);
      }
    });
  }

  function initializeComponents() {
    components.forEach(loadComponent);
  }

  // Shopify section and block events for dynamic reload
  document.addEventListener("shopify:section:load", initializeComponents);

  // Initialize on page load
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
          // console.log('in2');
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

// Initialize the animate zoom in
var zoomInClass = 'animate--zoom-in';

function initializeScrollZoomAnimationTrigger() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var animationTriggerElements = Array.from(document.getElementsByClassName(zoomInClass));

  if (animationTriggerElements.length === 0) return;

  var scaleAmount = 0.2 / 100;

  animationTriggerElements.forEach((element) => {
    let elementIsVisible = false;
    var observer = new IntersectionObserver((elements) => {
      elements.forEach((entry) => {
        elementIsVisible = entry.isIntersecting;
      });
    });

    observer.observe(element);

    element.style.setProperty('--zoom-in-ratio', 1 + scaleAmount * percentageSeen(element));

    window.addEventListener('scroll', function () {
      if (!elementIsVisible) return;

      element.style.setProperty('--zoom-in-ratio', 1 + scaleAmount * percentageSeen(element));
    }),
      { passive: true }
  });
}

function percentageSeen(element) {
  var viewportHeight = window.innerHeight;
  var scrollY = window.scrollY;
  var elementPositionY = element.getBoundingClientRect().top + scrollY;
  var elementHeight = element.offsetHeight;

  if (elementPositionY > scrollY + viewportHeight) {
    // If we haven't reached the image yet
    return 0;
  } else if (elementPositionY + elementHeight < scrollY) {
    // If we've completely scrolled past the image
    return 100;
  }

  // When the image is in the viewport
  var distance = scrollY + viewportHeight - elementPositionY;
  let percentage = distance / ((viewportHeight + elementHeight) / 100);
  return Math.round(percentage);
}

window.addEventListener('DOMContentLoaded', () => {
  initializeScrollZoomAnimationTrigger();
});

if (Shopify.designMode) {
  document.addEventListener('shopify:section:reorder', () => initializeScrollAnimationTrigger(document, true));
}

// cookie functions
function setCookie(cname, cvalue, exdays) {
  const d = new Date();
  d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
  let expires = "expires=" + d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

// cookie functions
function getCookie(cname) {
  let name = cname + "=";
  let ca = document.cookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

var showSection = document.querySelectorAll('iconic-show-section');
showSection.forEach(function(menu) {
	menu.style.display = 'block';
});