// {
//   "name": "iconic-volume-pricing-first.js",
//   "author": "Arham Web Works."
//   "description": "Copying in any form is strictly prohibited. Any instance of copying will be subject to legal action and accountability under the law."
// }

class VolumePricingBlock extends HTMLElement {
  connectedCallback() {
    this.settings = JSON.parse(this.dataset.settings || '{}');
    this.unitPrice = parseInt(this.dataset.unitPrice || '0', 10);
    this.blockId = this.dataset.blockId;
    this.images = {
      1: (this.getAttribute('data-img-1') || '').trim(),
      2: (this.getAttribute('data-img-2') || '').trim(),
      3: (this.getAttribute('data-img-3') || '').trim()
    };
    this.render();
    this.bindEvents();
  }

  formatMoney(cents) {
    return (cents / 100).toLocaleString('en-US', { style: 'currency', currency: 'USD' });
  }

  determineDefaultTier() {
    let def = this.settings.dt || '1';
    const t1 = this.settings.s1 && (this.settings.q1 > 0);
    const t2 = this.settings.s2 && (this.settings.q2 > 0);
    const t3 = this.settings.s3 && (this.settings.q3 > 0);
    if (def === '1' && !t1) def = t2 ? '2' : (t3 ? '3' : '1');
    else if (def === '2' && !t2) def = t1 ? '1' : (t3 ? '3' : '2');
    else if (def === '3' && !t3) def = t1 ? '1' : (t2 ? '2' : '3');
    return def;
  }

  generateTierHTML(tierNum, defaultTier) {
    const show = this.settings[`s${tierNum}`];
    const minQty = parseInt(this.settings[`q${tierNum}`] || '0', 10);
    if (!show || minQty <= 0) return '';
    let maxQty = parseInt(this.settings[`m${tierNum}`] || '0', 10);
    const isOpen = maxQty === 0;
    if (!isOpen && maxQty < minQty) maxQty = minQty;
    let disc = parseInt(this.settings[`d${tierNum}`], 10);
    if (isNaN(disc)) {
      disc = tierNum === 1 ? 10 : (tierNum === 2 ? 15 : 20);
    }
    const discAmt = Math.floor((this.unitPrice * disc) / 100);
    const finalPrice = this.unitPrice - discAmt;
    let title = this.settings[`l${tierNum}`];
    if (!title) {
      title = 'Buy ';
      if (isOpen) title += `${minQty}+`;
      else if (minQty === maxQty) title += `${minQty}`;
      else title += `${minQty} - ${maxQty}`;
      if (disc > 0) title += ` save ${disc}% off`;
    }
    const badge = this.settings[`b${tierNum}`];
    const imgUrl = this.images[tierNum];
    const isActive = defaultTier === String(tierNum);
    return `
      <label class="volume-pricing__tier ${isActive ? 'is-active' : ''}" data-tier="${tierNum}">
        ${badge ? `<div class="volume-pricing__floating-badge">${badge}</div>` : ''}
        <input type="radio" name="volume-pricing-tier-${this.blockId}" class="volume-pricing__radio-input" value="${minQty}" ${isActive ? 'checked' : ''}>
        <div class="volume-pricing__tier-content">
          <div class="volume-pricing__tier-main">
            ${imgUrl ? `
              <div class="volume-pricing__tier-image">
                <img src="${imgUrl}" loading="lazy" class="iconic-top-img iconic-d-block iconic-w-100 iconic-h-100 iconic-mw-100" />
              </div>
            ` : ''}
            <div class="volume-pricing__tier-info-column">
              <div class="volume-pricing__title-row">
                <div class="volume-pricing__tier-title">${title}</div>
              </div>

            </div>
          </div>
          <div class="volume-pricing__tier-pricing-column">
            <div class="volume-pricing__discounted-price">${this.formatMoney(finalPrice)}<span class="volume-pricing__price-suffix">/Item</span></div>
            <div class="volume-pricing__original-price">${this.formatMoney(this.unitPrice)}</div>
            ${disc > 0 ? `<div class="volume-pricing__save-badge">SAVE ${disc}%</div>` : ''}
          </div>
        </div>
      </label>
    `;
  }
  render() {
    const heading = this.settings.hd || '<p>Buy more, save more</p>';
    const defaultTier = this.determineDefaultTier();
    let html = '';
    if (heading) {
      html += `<div class="volume-pricing__heading">${heading}</div>`;
    }
    html += `<div class="volume-pricing__tiers-container">`;
    for (let i = 1; i <= 3; i++) {
      html += this.generateTierHTML(i, defaultTier);
    }
    html += `</div>`;
    this.innerHTML = html;
  }
  syncQuantity(qty) {
    const qtyInputs = document.querySelectorAll('input[name="quantity"]');
    qtyInputs.forEach(input => {
      input.value = qty;
      input.removeAttribute('disabled');
      input.dispatchEvent(new Event('change', { bubbles: true }));
    });   
    const productForms = document.querySelectorAll('form[action*="/cart/add"]');
    productForms.forEach(form => {
      const existingInput = form.querySelector('input[name="quantity"]');
      if (!existingInput) {
        let hiddenInput = document.createElement('input');
        hiddenInput.type = 'hidden';
        hiddenInput.name = 'quantity';
        hiddenInput.classList.add('volume-pricing__hidden-quantity-input');
        hiddenInput.value = qty;
        form.appendChild(hiddenInput);
      } else if (existingInput.classList.contains('volume-pricing__hidden-quantity-input')) {
        existingInput.value = qty;
      }
    });
  }
  bindEvents() {
    const radios = this.querySelectorAll('.volume-pricing__radio-input');
    radios.forEach(radio => {
      radio.addEventListener('change', (e) => {
        this.querySelectorAll('.volume-pricing__tier').forEach(t => t.classList.remove('is-active'));
        e.target.closest('.volume-pricing__tier').classList.add('is-active');
        this.syncQuantity(e.target.value);
      });
    });

    const checkedRadio = this.querySelector('.volume-pricing__radio-input:checked');
    if (checkedRadio) {
      setTimeout(() => { 
        this.syncQuantity(checkedRadio.value);
      }, 100);
    }
  }
}
if (!customElements.get('volume-pricing-block')) {
  customElements.define('volume-pricing-block', VolumePricingBlock);
}