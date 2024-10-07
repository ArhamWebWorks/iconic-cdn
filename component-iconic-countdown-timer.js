// {
//   "name": "component-iconic-countdown-timer.js",
//   "author": "Arham Web Works"
//   "description": "Copying in any form is strictly prohibited. Any instance of copying will be subject to legal action and accountability under the law."
// }

(() => {
  if (customElements.get('iconic-countdown-timer')) {
    return;
  }
  class Countdown extends HTMLElement {
    constructor() {
      super();
      this.datetime = this.dataset.datetime;
      this.hideCounterOnComplete = this.dataset.hideCounterOnComplete;
    }

    connectedCallback() {
      this.initCountdown();
    }

    initCountdown() {
      if(this.datetime.length  > 0 ){
        var countDownDate = new Date(this.datetime).getTime();
        var daysElement = this.querySelector('.js-days');
        var hoursElement = this.querySelector('.js-hours');
        var minutesElement = this.querySelector('.js-minutes');
        var secondsElement = this.querySelector('.js-seconds');
        var countdownTime = this.querySelector('.iconic-countdown-time');
        var countdownMessage = this.querySelector(".iconic-countdown-message");
        var hideCounterOnComplete = this.hideCounterOnComplete;
        
        var x = setInterval(function() { 
          // Get todays date and time
          var now = new Date().getTime(); 
          // Find the distance between now an the count down date
          var distance = countDownDate - now; 
         
          if (distance < 0) {
            clearInterval(x);
            if(hideCounterOnComplete == "yes") {
              countdownTime.classList.add('iconic-d-none');
            }
            else {
              countdownTime.classList.add('iconic-d-none');
              countdownMessage.classList.remove('iconic-d-none');
            }
          }
          else {
            // Time calculations for days, hours, minutes and seconds
            var days = Math.floor(distance / (1000  60  60 * 24));
            if(days < 10 ) {
              days = '0' + days;
            }
            else {
              days = days;
            }

            var hours = Math.floor((distance % (1000  60  60  24)) / (1000  60 * 60));
            if(hours  < 10 ) {
              var hours = '0' + hours;
            }
            else {
              hours = hours;
            }

            var minutes = Math.floor((distance % (1000  60  60)) / (1000 * 60));
            if(minutes  < 10 ) {
              var minutes = '0' + minutes;
            }
            else {
              minutes = minutes;
            }

            var seconds = Math.floor((distance % (1000 * 60)) / 1000); 

            daysElement.innerText = days;
            hoursElement.innerText = hours;
            minutesElement.innerText = minutes;
            secondsElement.innerText = seconds;     
          }
               
        }, 1000);
      }
    }
  }

  customElements.define('iconic-countdown-timer', Countdown);
})();