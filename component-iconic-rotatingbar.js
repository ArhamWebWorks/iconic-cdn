// {
//   "name": "component-iconic-rotating-bar.js",
//   "author": "Arham Web Works"
//   "description": "Copying in any form is strictly prohibited. Any instance of copying will be subject to legal action and accountability under the law."
// }
(() => {
  if (customElements.get('iconic-rotating-bar')) {
    return;
  }

  class IconicRotatingBar extends HTMLElement {
    constructor() {
      super();
      this.scrollTopClass = 'scroll-top';
      this.scrollDownClass = 'scroll-down';
      this.lastScrollPosition = 0;
      this.content = null;
    }
      
    connectedCallback() {
      this.content = this.querySelector('#marqueeContent'); // Adjust to select the content correctly
      this.lastScrollPosition = window.scrollY;

      if (this.content) {
        this.handleScroll(); 
        window.addEventListener('scroll', this.handleScroll.bind(this));
      }

      window.addEventListener('resize', this.verticalRotatingBar.bind(this));
      this.verticalRotatingBar();
    }

    disconnectedCallback() {
      window.removeEventListener('scroll', this.handleScroll.bind(this));
      window.removeEventListener('resize', this.verticalRotatingBar.bind(this));
    }
  
    handleScroll() {
      if (!this.content) {
        return;
      }

      const currentScrollPosition = window.scrollY;
      if (currentScrollPosition > this.lastScrollPosition) {
        this.content.classList.remove(this.scrollTopClass);
        this.content.classList.add(this.scrollDownClass);
      } else {
        this.content.classList.add(this.scrollTopClass);
        this.content.classList.remove(this.scrollDownClass);
      }
      this.lastScrollPosition = currentScrollPosition;
    }

    verticalRotatingBar() {
      const leftVerticalBar = this.querySelector('.rotating-bar-vertical.rotatebar-side-left');
      if (leftVerticalBar) {
        const rotatebarHeight = window.getComputedStyle(leftVerticalBar);
        document.body.style.paddingLeft = parseFloat(rotatebarHeight.width) + 'px';
      }
      
      const rightVerticalBar = this.querySelector('.rotating-bar-vertical.rotatebar-side-right');
      if (rightVerticalBar) {
        const rotatebarHeight = window.getComputedStyle(rightVerticalBar);
        document.body.style.paddingRight = parseFloat(rotatebarHeight.width) + 'px';
      }
    }
  }
  
  customElements.define('iconic-rotating-bar', IconicRotatingBar);
})();