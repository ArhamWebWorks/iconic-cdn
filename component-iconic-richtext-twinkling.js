// {
//   "name": "component-iconic-richtext-twinkling.js",
//   "author": "Arham Web Works"
//   "description": "Copying in any form is strictly prohibited. Any instance of copying will be subject to legal action and accountability under the law."
// }

document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => initializeShootingStarsForAllSections(), 700); // Add a small delay
});

// Event listener for Shopify section load
document.addEventListener('shopify:section:load', () => {
  setTimeout(() => initializeShootingStarsForAllSections(), 600); // Re-initialize with delay
});

function initializeShootingStarsForAllSections() {
  // Select all canvas elements with the class 'starCanvas'
  const canvases = document.querySelectorAll('.starCanvas');
  canvases.forEach((canvas, index) => {
    const canvasId = `starCanvas${index}`;
    canvas.id = canvasId; // Assign each canvas a unique ID dynamically

    const starfield = new window.Starfield(canvasId); // Initialize Starfield for each canvas

    // Initialize ShootingStar for each canvas' parent container
    const parentElement = canvas.parentElement; // Get the parent container of the canvas
    const shootingStarObj = new window.ShootingStar(parentElement); // Use the parent as the target for the ShootingStar

    shootingStarObj.launch(5 + index); // Optional: adjust the timing per section
  });
}

(function() {
  class ShootingStar {
    constructor(container) {
      this.n = 0;
      this.m = 0;
      this.defaultOptions = {
        velocity: 8,
        starSize: 10,
        life: 300,
        beamSize: 400,
        dir: -1
      };
      this.options = {};
      this.capa = container || document.body; // Use the passed container or fallback to body

      // Use the container's width and height
      this.wW = this.capa.clientWidth;
      const heightAttr = this.capa.getAttribute('data-height');
      this.hW = heightAttr ? parseInt(heightAttr, 10) : this.capa.clientHeight;
    }

    addBeamPart(x, y) {
      this.n++;
      const name = this.getRandom(100, 1);
      const oldStar = document.getElementById(`star${name}`);
      if (oldStar) {
        oldStar.remove();
      }
      const starDiv = document.createElement("div");
      starDiv.id = `star${name}`;
      this.capa.appendChild(starDiv);
    
      const hazDiv = document.createElement("div");
      hazDiv.id = `haz${this.n}`;
      hazDiv.className = 'haz';
      hazDiv.style = `position:absolute; color:#FFF; width:10px; height:10px; font-weight:bold; font-size:${this.options.starSize}px`;
      hazDiv.textContent = '·';
      starDiv.appendChild(hazDiv);
    
      hazDiv.style.top = `${y + this.n}px`;
      hazDiv.style.left = `${x + (this.n * this.options.dir)}px`;
    }

    delTrozoHaz() {
      this.m++;
      const haz = document.getElementById(`haz${this.m}`);
      if (haz) {
        haz.style.opacity = '0';
      }
    }

    getRandom(max, min) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    launchStar(options) {
      if (typeof options !== "object") {
        options = {};
      }
      this.options = Object.assign({}, this.defaultOptions, options);
      this.n = 0;
      this.m = 0;
      const x = this.getRandom(this.wW - this.options.beamSize - 100, 100);
      const y = this.getRandom(this.hW - this.options.beamSize - 100, 100);

      for (let i = 0; i < this.options.beamSize; i++) {
        setTimeout(() => {
          this.addBeamPart(x, y);
        }, this.options.life + (i * this.options.velocity));
      }
      for (let i = 0; i < this.options.beamSize; i++) {
        setTimeout(() => {
          this.delTrozoHaz();
        }, this.options.beamSize + (i * this.options.velocity));
      }
    }

    launch(everyTime) {
      if (typeof everyTime !== "number") {
        everyTime = 10;
      }
      everyTime = everyTime * 1000;
      this.launchStar();
      setInterval(() => {
        const options = {
          dir: this.getRandom(1, 0) ? 1 : -1,
          life: this.getRandom(400, 100),
          beamSize: this.getRandom(700, 400),
          velocity: this.getRandom(10, 4)
        };
        this.launchStar(options);
      }, everyTime);
    }
  }

  class Starfield {
    constructor(canvasId) {
      this.canvas = document.getElementById(canvasId);
      this.ctx = this.canvas.getContext('2d');
      this.starsNum = 200; // Declare starsNum within the class
      this.resizeCanvas();
      window.addEventListener('resize', () => this.resizeCanvas());
    }

    resizeCanvas() {
      this.canvas.width = this.canvas.parentElement.clientWidth;
      this.canvas.height = this.canvas.parentElement.clientHeight;
      this.drawStars();
    }

    drawStars() {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      for (let i = 0; i < this.starsNum; i++) {
        this.drawStar(
          Math.random() * this.canvas.width,
          Math.random() * this.canvas.height,
          Math.random() * 1.5, // Star size
          'white',
          Math.random() > 0.5 // Blurred effect for some stars
        );
      }
    }

    drawStar(x, y, radius, color, isBlur) {
      this.ctx.save();
      this.ctx.beginPath();
      this.ctx.arc(x, y, radius, 0, Math.PI * 2, false);
      this.ctx.fillStyle = color;
      if (isBlur) {
        this.ctx.shadowColor = color;
        this.ctx.shadowBlur = radius * 5;
      }
      this.ctx.fill();
      this.ctx.restore();
    }
  }

  // Attach the classes to the global window object
  window.ShootingStar = ShootingStar;
  window.Starfield = Starfield;
})();
// Optionally, use a MutationObserver to detect dynamically added canvases
const observer = new MutationObserver(() => {
  initializeShootingStarsForAllSections();
});

observer.observe(document.body, { childList: true, subtree: true });