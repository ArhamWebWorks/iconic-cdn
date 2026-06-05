// {
//   "name": "iconic-volume-pricing-second.js",
//   "author": "Arham Web Works."
//   "description": "Copying in any form is strictly prohibited. Any instance of copying will be subject to legal action and accountability under the law."
// }
class VolumePricingSecond extends HTMLElement {
  connectedCallback() {
    try {
      const rawSettings = this.getAttribute('data-settings') || '{}';
      const rawUnitPrice = this.getAttribute('data-up') || '0';
      const variantId = this.getAttribute('data-vid') || '';
      const sectionId = this.getAttribute('data-sid') || '';
      const productTitle = this.getAttribute('data-pt') || '';

      const fixUrl = url => {
        if (!url || !url.trim()) return '';
        url = url.trim();
        if (url.startsWith('//')) return 'https:' + url;
        return url;
      };

      const s = JSON.parse(rawSettings);

      const imgs = [
        fixUrl(this.getAttribute('data-img-1')),
        fixUrl(this.getAttribute('data-img-2')),
        fixUrl(this.getAttribute('data-img-3'))
      ];

      const unitPrice = parseInt(rawUnitPrice, 10) || 0;
      const defaultTier = parseInt(s.dt || '1', 10);

      const bool = v => v !== false && v !== 'false';

      const tiers = [
        {
          n: 1,
          show: bool(s.s1),
          qty: parseInt(s.q1, 10) || 1,
          discount: parseInt(s.d1, 10) || 0,
          title: s.l1 || '',
          badge: s.b1 || ''
        },
        {
          n: 2,
          show: bool(s.s2),
          qty: parseInt(s.q2, 10) || 6,
          discount: parseInt(s.d2, 10) || 0,
          title: s.l2 || '',
          badge: s.b2 || ''
        },
        {
          n: 3,
          show: bool(s.s3),
          qty: parseInt(s.q3, 10) || 12,
          discount: parseInt(s.d3, 10) || 0,
          title: s.l3 || '',
          badge: s.b3 || ''
        }
      ].filter(t => t.show);

      this.innerHTML = this._render(
        s,
        tiers,
        unitPrice,
        imgs,
        defaultTier,
        sectionId,
        productTitle
      );

      this._bind(tiers, defaultTier, variantId);

    } catch (e) {
      console.error('[VPS] init error:', e);
    }
  }

  _money(cents) {
    return '$' + (cents / 100).toFixed(2);
  }

  _calcFinal(unitPrice, qty, discount) {
    const full = unitPrice * qty;

    if (!discount || discount <= 0) {
      return full;
    }

    return Math.round(full - (full * discount / 100));
  }

  _autoTitle(t, productTitle) {
    const raw = String(t.title || '')
      .replace(/<[^>]+>/g, '')
      .trim();

    if (raw) {
      if (t.qty === 1) return raw;
      return `${t.qty} x ${raw}`;
    }

    if (productTitle) {
      if (t.qty === 1) return productTitle;
      return `${t.qty} x ${productTitle}`;
    }

    if (t.qty === 1) return 'Single';

    return `${t.qty} Cans`;
  }

  _autoBadge(t) {
    if (!t.discount || t.discount <= 0) {
      return '';
    }

    const raw = String(t.badge || '')
      .replace(/<[^>]+>/g, '')
      .trim();

    return raw ? raw : `Save ${t.discount}%`;
  }

  _render(s, tiers, unitPrice, imgs, defaultTier, sectionId, productTitle) {

    const heading = String(s.hd || 'Choose Your Quantity')
      .replace(/<[^>]+>/g, '');

    const cards = tiers.map(t => {

      const imgSrc = imgs[t.n - 1] || '';

      const full = unitPrice * t.qty;

      const final = this._calcFinal(
        unitPrice,
        t.qty,
        t.discount
      );

      const badge = this._autoBadge(t);

      const active = t.n === defaultTier
        ? ' is-active'
        : '';

      const title = this._autoTitle(t, productTitle);

      const badgeHTML = badge
        ? `<span class="qs-badge">${badge}</span>`
        : '';

      const mediaHTML = imgSrc
        ? `
          <div class="qs-card-media">
            <img
              class="qs-card-img"
              src="${imgSrc}"
              alt="${title}"
              loading="lazy"
            >
          </div>
        `
        : '';

      const compareHTML = t.discount > 0
        ? `<p class="qs-card-compare">${this._money(full)}</p>`
        : '';

      const saveBadgeHTML = t.discount > 0
        ? `<div class="qs-save-badge">SAVE ${t.discount}%</div>`
        : '';

      return `
        <div
          class="qs-card${active}"
          data-tier="${t.n}"
          data-qty="${t.qty}"
          data-price="${final}"
          data-compare="${full}"
          data-discount="${t.discount}"
        >

          ${badgeHTML}

          ${mediaHTML}

          <p class="qs-card-title">
            ${title}
          </p>

          <p class="qs-card-price">
            ${this._money(final)}
          </p>

          ${compareHTML}
          ${saveBadgeHTML}
          
          <div class="qs-card-radio">
            <span class="qs-radio"></span>
          </div>

        </div>
      `;
    }).join('');

    return `
      <p class="qs-heading">
        ${heading}
      </p>

      <div class="qs-grid" id="qs-grid-${sectionId}">
        ${cards}
      </div>
    `;
  }

  _setThemeQty(qty) {
    // 1. Update all quantity inputs globally and ensure they are enabled
    const qtyInputs = document.querySelectorAll('input[name="quantity"], .quantity__input, [data-quantity-input]');
    qtyInputs.forEach(input => {
      if (input.tagName === 'INPUT') {
        input.value = qty;
        input.removeAttribute('disabled');
        input.removeAttribute('readonly');
        input.dispatchEvent(new Event('change', { bubbles: true }));
        input.dispatchEvent(new Event('input', { bubbles: true }));
      }
    });

    // 2. Ensure every Add to Cart form has the quantity value ready for submission
    const productForms = document.querySelectorAll('form[action*="/cart/add"], form[data-type="add-to-cart-form"]');
    productForms.forEach(form => {
      const existingInput = form.querySelector('input[name="quantity"]');
      if (!existingInput) {
        let hiddenInput = document.createElement('input');
        hiddenInput.type = 'hidden';
        hiddenInput.name = 'quantity';
        hiddenInput.classList.add('vps__hidden-qty');
        hiddenInput.value = qty;
        form.appendChild(hiddenInput);
      } else if (existingInput.classList.contains('vps__hidden-qty') || existingInput.type === 'hidden') {
        existingInput.value = qty;
      }
    });
  }

  _bind(tiers, defaultTier, variantId) {

    const cards = this.querySelectorAll('.qs-card');

    const activate = card => {

      cards.forEach(c => {
        c.classList.remove('is-active');
      });

      card.classList.add('is-active');

      this._setThemeQty(
        parseInt(card.dataset.qty, 10)
      );
    };

    cards.forEach(card => {

      card.addEventListener('click', () => {
        activate(card);
      });

    });

    setTimeout(() => {

      const initCard =
        this.querySelector(
          `.qs-card[data-tier="${defaultTier}"]`
        ) || cards[0];

      if (initCard) {

        this._setThemeQty(
          parseInt(initCard.dataset.qty, 10)
        );

      }

    }, 300);
  }
}

customElements.define(
  'volume-pricing-second',
  VolumePricingSecond
);