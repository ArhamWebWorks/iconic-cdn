// {
//   "name": "iconic-rotating-bar.js",
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
      this.lastScrollPosition = window.scrollY;
      this.currentScrollPosition = window.scrollY;
  
      window.addEventListener('scroll', this.handleScroll.bind(this));
      window.addEventListener('resize', this.verticalRotatingBar.bind(this));
    }
      
    connectedCallback() {
      this.content = document.getElementById('marqueeContent');
      if (this.content) {
        this.handleScroll();
      }

      if (document.querySelector('.rotating-bar-vertical')) {
        this.verticalRotatingBar();
      }
    }
  
    handleScroll() {
      if (!this.content) {
        return;
      }

      var currentScrollPosition = window.scrollY;
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
      var leftVerticalBar = document.querySelector('.rotating-bar-vertical.rotatebar-side-left');
      if (leftVerticalBar) {
        var rotatebarHight = window.getComputedStyle(leftVerticalBar);
        document.body.style.paddingLeft = parseFloat(rotatebarHight.width) + 'px';
      }
      
      var rightVerticalBar = document.querySelector('.rotating-bar-vertical.rotatebar-side-right');
      if (rightVerticalBar) {
        var rotatebarHight = window.getComputedStyle(rightVerticalBar);
        document.body.style.paddingRight = parseFloat(rotatebarHight.width) + 'px';
      }
    }
  }
  
  customElements.define('iconic-rotating-bar', IconicRotatingBar);
})();