// {
//   "name": "iconic-volume-pricing-third.js",
//   "author": "Arham Web Works."
//   "description": "Copying in any form is strictly prohibited. Any instance of copying will be subject to legal action and accountability under the law."
// }

class VolumePricingThirdBlock extends HTMLElement {
  connectedCallback() {
    this.settings = JSON.parse(this.dataset.settings || '{}');
    this.unitPrice = parseInt(this.dataset.up || '2499', 10);
    this.blockId = this.dataset.bid || Math.random().toString(36).slice(2);
    this.tierImages = {
      1: (this.getAttribute('data-i1') || '').trim(),
      2: (this.getAttribute('data-i2') || '').trim(),
      3: (this.getAttribute('data-i3') || '').trim()
    };
    this.choiceProducts = this.parseChoiceProducts();
    this.render();
    this.bindEvents();
    this.bindCartFormEvents();
  }

  disconnectedCallback() {
    if (this.handleDocumentSubmit) {
      document.removeEventListener('submit', this.handleDocumentSubmit, true);
    }

    if (this.handleDocumentClick) {
      document.removeEventListener('click', this.handleDocumentClick, true);
    }
  }

  parseChoiceProducts() {
    try {
      const products = JSON.parse(this.dataset.cp || '[]');
      return Array.isArray(products) ? products.slice(0, 4) : [];
    } catch (error) {
      return [];
    }
  }

  formatMoney(cents) {
    return (cents / 100).toLocaleString('en-US', {
      style: 'currency',
      currency: this.settings.currency || 'USD'
    });
  }

  escapeHtml(value) {
    return String(value || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  getEnabledChoices() {
    const fallback = [
      { l: 'Mood', p: this.unitPrice, v: '' },
      { l: 'Boost', p: this.unitPrice, v: '' },
      { l: 'Sleep', p: this.unitPrice, v: '' },
      { l: 'Recover', p: this.unitPrice, v: '' }
    ];

    const choices = this.choiceProducts.map((product, index) => {
      const fallbackChoice = fallback[index];
      return {
        label: product.l || (fallbackChoice && fallbackChoice.l) || `Choice ${index + 1}`,
        image: product.i || '',
        price: parseInt(product.p || this.unitPrice, 10),
        variantId: product.v || ''
      };
    }).filter(choice => choice.label);

    if (choices.length) return choices.slice(0, 4);

    return fallback.map(f => ({ label: f.l, image: '', price: f.p, variantId: f.v }));
  }

  getTier(tierNum) {
    // Read dynamic quantities from settings (configurable per tier in the schema)
    const paidQty = Math.max(1, parseInt(this.settings[`p${tierNum}`] || tierNum, 10));
    const freeQty = Math.max(0, parseInt(this.settings[`f${tierNum}`] || tierNum, 10));
    const totalQty = Math.min(paidQty + freeQty, 10); // cap at 10 dropdown choices

    if (!paidQty) return null;

    return {
      tierNum,
      totalQty,
      paidQty,
      freeQty,
      title: this.settings[`l${tierNum}`] || `Buy ${paidQty} Get ${freeQty} FREE`,
      subtitle: this.settings[`u${tierNum}`] || `${totalQty} pack`,
      badge: this.settings[`b${tierNum}`] || '',
      image: this.tierImages[tierNum],
      salePrice: this.unitPrice * paidQty,
      originalPrice: this.unitPrice * totalQty
    };
  }

  determineDefaultTier() {
    let requested = parseInt(this.settings.dt || '3', 10);
    if (this.getTier(requested)) return requested;

    for (let i = 1; i <= 3; i++) {
      if (this.getTier(i)) return i;
    }

    return 1;
  }

  generateSelectRows(tier) {
    const choices = this.getEnabledChoices();
    let rows = '';

    for (let i = 1; i <= tier.totalQty; i++) {
      const selectedChoice = choices[(i - 1) % choices.length];
      const selectedLabel = selectedChoice.label;
      const options = choices.map(choice => `
        <button type="button" class="volume-pricing-third__choice-option" role="option" data-choice="${this.escapeHtml(choice.label)}" data-variant-id="${this.escapeHtml(choice.variantId)}">
          ${choice.image ? `<img src="${choice.image}" alt="" loading="lazy">` : '<span class="volume-pricing-third__choice-swatch"></span>'}
          <span>
            <span class="volume-pricing-third__choice-name">${this.escapeHtml(choice.label)}</span>
            <span class="volume-pricing-third__choice-price">${this.formatMoney(choice.price)}</span>
          </span>
        </button>
      `).join('');

      rows += `
        <div class="volume-pricing-third__bundle-row">
          <span class="volume-pricing-third__bundle-index">#${i}</span>
          <div class="volume-pricing-third__select" data-select>
            <button type="button" class="volume-pricing-third__select-button" aria-expanded="false">
              <span data-selected-label>${this.escapeHtml(selectedLabel)}</span>
              <span class="volume-pricing-third__select-caret" aria-hidden="true"></span>
            </button>
            <div class="volume-pricing-third__choice-menu" role="listbox">
              ${options}
            </div>
            <input type="hidden" data-bundle-property name="properties[Bundle item ${i}]" value="${this.escapeHtml(selectedLabel)}" data-variant-id="${this.escapeHtml(selectedChoice.variantId)}">
          </div>
        </div>
      `;
    }

    return `<div class="volume-pricing-third__bundle-selectors">${rows}</div>`;
  }

  generateTierHTML(tier, defaultTier) {
    const isActive = tier.tierNum === defaultTier;
    const hasSelectors = tier.totalQty > 0;

    let discountHtml = '';
    if (tier.originalPrice > tier.salePrice) {
      const disc = Math.round((tier.originalPrice - tier.salePrice) / tier.originalPrice * 100);
      if (disc > 0) {
        discountHtml = `<div class="volume-pricing-third__save-badge">SAVE ${disc}%</div>`;
      }
    }

    return `
      <div class="volume-pricing-third__tier ${isActive ? 'is-active' : ''}" data-tier="${tier.tierNum}" data-quantity="${tier.totalQty}">
        ${tier.badge ? `<div class="volume-pricing-third__badge">${this.escapeHtml(tier.badge)}</div>` : ''}
        <button type="button" class="volume-pricing-third__tier-trigger" aria-pressed="${isActive}">
          <span class="volume-pricing-third__radio" aria-hidden="true"></span>
          <span class="volume-pricing-third__tier-media">
            ${tier.image ? `<img src="${tier.image}" alt="" loading="lazy">` : ''}
          </span>
          <span class="volume-pricing-third__tier-copy">
            <span class="volume-pricing-third__tier-title">${this.escapeHtml(tier.title)}</span>
            <span class="volume-pricing-third__tier-subtitle">${this.escapeHtml(tier.subtitle)}</span>
          </span>
          <span class="volume-pricing-third__tier-prices">
            <span class="volume-pricing-third__sale-price">${this.formatMoney(tier.salePrice)}</span>
            <span class="volume-pricing-third__original-price">${this.formatMoney(tier.originalPrice)}</span>
            ${discountHtml}
          </span>
        </button>
        ${hasSelectors ? this.generateSelectRows(tier) : ''}
      </div>
    `;
  }

  render() {
    const defaultTier = this.determineDefaultTier();
    const heading = this.settings.heading || '';
    let html = heading ? `<div class="volume-pricing-third__heading">${heading}</div>` : '';

    html += '<div class="volume-pricing-third__tiers">';
    for (let i = 1; i <= 3; i++) {
      const tier = this.getTier(i);
      if (tier) html += this.generateTierHTML(tier, defaultTier);
    }
    html += '</div>';

    this.innerHTML = html;
    this.syncActiveTier();
  }

  getActiveTier() {
    return this.querySelector('.volume-pricing-third__tier.is-active');
  }

  getSelectedItems() {
    const activeTier = this.getActiveTier();
    if (!activeTier) return [];

    const groupedItems = new Map();

    activeTier.querySelectorAll('[data-bundle-property]').forEach(input => {
      const variantId = parseInt(input.dataset.variantId || '0', 10);
      if (!variantId) return;

      const existing = groupedItems.get(variantId) || {
        id: variantId,
        quantity: 0
      };
      existing.quantity += 1;
      groupedItems.set(variantId, existing);
    });

    return Array.from(groupedItems.values());
  }

  syncActiveTier() {
    const activeTier = this.getActiveTier();
    if (!activeTier) return;
  }

  setActiveTier(tier) {
    this.querySelectorAll('.volume-pricing-third__tier').forEach(item => {
      const isActive = item === tier;
      item.classList.toggle('is-active', isActive);
      const trigger = item.querySelector('.volume-pricing-third__tier-trigger');
      if (trigger) trigger.setAttribute('aria-pressed', String(isActive));
    });

    this.syncActiveTier();
  }

  closeMenus(exceptMenu = null) {
    this.querySelectorAll('[data-select]').forEach(select => {
      if (select === exceptMenu) return;
      select.classList.remove('is-open');
      const button = select.querySelector('.volume-pricing-third__select-button');
      if (button) button.setAttribute('aria-expanded', 'false');
    });
  }

  getCartUrl(path) {
    const root = (window.Shopify && window.Shopify.routes && window.Shopify.routes.root) || '/';
    return `${root.replace(/\/?$/, '/')}${path}`;
  }

  addSelectedItemsToCart(button) {
    // 1. Grab the selected bundle items
    const selectedItems = this.getSelectedItems();
    if (!selectedItems.length) {
      alert('Please select available products before adding to cart.');
      return;
    }

    if (this.isAddingToCart) return;
    this.isAddingToCart = true;

    const buttonText = button ? button.textContent : '';
    if (button) {
      button.setAttribute('aria-busy', 'true');
      button.disabled = true;
      button.textContent = this.settings.adding_text || 'Adding...';
    }

    // 2. Resolve the cart-drawer element and its section ID
    const cartDrawer = this.findCartDrawer();
    const sectionId = this.discoverSectionId(cartDrawer);
    const sectionNames = sectionId ? [sectionId] : ['cart-drawer', 'cart-icon-bubble'];

    const formData = {
      items: selectedItems,
      sections: sectionNames,
      sections_url: window.location.pathname
    };

    // 3. Execute the Vanilla AJAX POST request
    fetch(this.getCartUrl('cart/add.js'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(formData)
    })
    .then(response => {
      if (!response.ok) {
        return response.json().then(json => { 
          throw new Error(json.description || json.message || 'Error adding to cart'); 
        });
      }
      return response.json();
    })
    .then(cart => {
      // If Shopify returned no sections HTML, fetch manually via Sections Rendering API
      if (!cart.sections || Object.keys(cart.sections).length === 0) {
        console.warn('Sections missing from add.js response — fetching manually...');
        return fetch(`${window.location.pathname}?sections=${sectionNames.join(',')}`)
          .then(res => res.json())
          .then(sectionsData => {
            cart.sections = sectionsData;
            return cart;
          });
      }
      return cart;
    })
    .then(cart => {
      // Update the cart drawer UI
      this.refreshCartDrawer(cart, cartDrawer);

      // Fire standard Shopify 2.0 theme events
      document.dispatchEvent(new CustomEvent('cart:refresh', { bubbles: true, detail: { source: 'volume-pricing-third', items: selectedItems, cart } }));
      document.dispatchEvent(new CustomEvent('cart:updated', { bubbles: true, detail: { source: 'volume-pricing-third', items: selectedItems, cart } }));
      document.dispatchEvent(new CustomEvent('ajaxProduct:added', { bubbles: true, detail: { product: cart, cart } }));
      window.dispatchEvent(new CustomEvent('volume-pricing-third:added', { detail: { items: selectedItems, cart } }));
    })
    .catch(error => {
      console.error('Volume Pricing – Cart Error:', error);
      alert(error.message || 'Could not add selected products to cart.');
    })
    .finally(() => {
      this.isAddingToCart = false;
      if (button) {
        button.removeAttribute('aria-busy');
        button.disabled = false;
        button.textContent = buttonText || this.settings.add_button_text || 'Add to cart';
      }
    });
  }

  /**
   * Finds the cart drawer element — broad selector coverage for all major themes.
   * Covers: Dawn (<cart-drawer>), After Dark (<cart-drawer-component>),
   * Prestige/Impulse (#CartDrawer), and generic data-attribute patterns.
   */
  findCartDrawer() {
    return document.querySelector('cart-drawer')
      || document.querySelector('cart-drawer-component')
      || document.querySelector('#CartDrawer')
      || document.querySelector('[data-cart-drawer]')
      || document.querySelector('.cart-drawer')
      || document.querySelector('#cart-drawer')
      || document.querySelector('#mini-cart')
      || document.querySelector('.mini-cart')
      || document.querySelector('.side-cart');
  }

  /**
   * Discovers the Shopify section ID that renders the cart drawer.
   * Works for any theme by reading data-section-id or .shopify-section wrapper.
   */
  discoverSectionId(cartDrawer) {
    if (!cartDrawer) return '';

    // 1. Check data-section-id on inner components (e.g., <cart-items-component data-section-id="...">)
    const sectionIdEl = cartDrawer.querySelector('[data-section-id]');
    if (sectionIdEl && sectionIdEl.dataset.sectionId) return sectionIdEl.dataset.sectionId;

    // 2. Check the element's own data-section-id
    if (cartDrawer.dataset && cartDrawer.dataset.sectionId) return cartDrawer.dataset.sectionId;

    // 3. Check the .shopify-section wrapper (standard Shopify convention)
    const wrapper = cartDrawer.closest('.shopify-section')
      || cartDrawer.closest('[id^="shopify-section-"]');
    if (wrapper && wrapper.id) return wrapper.id.replace('shopify-section-', '');

    return '';
  }

  /**
   * Refreshes the cart drawer UI after a successful add-to-cart.
   *
   * Strategy chain (tries each in order, falls through on failure):
   * 1. Theme-native renderContents() — works for Dawn and Dawn-based themes
   * 2. Nuclear: fetch fresh section HTML from server + surgical DOM replacement
   * 3. Cart-notification popup fallback
   * 4. Redirect to /cart page (absolute last resort)
   */
  refreshCartDrawer(state, cartDrawer) {
    cartDrawer = cartDrawer || this.findCartDrawer();

    // ── No cart drawer found at all ──
    if (!cartDrawer) {
      // Try cart-notification (Dawn's popup mode)
      const notification = document.querySelector('cart-notification');
      if (notification) {
        if (typeof notification.renderContents === 'function' && state && state.sections) {
          try { notification.renderContents(state); return; } catch (e) { /* fall through */ }
        }
        if (typeof notification.open === 'function') { notification.open(); return; }
      }
      // Absolute last resort: redirect to cart page
      window.location.href = this.getCartUrl('cart');
      return;
    }

    // ── Strategy 1: Theme-native renderContents ──
    const hasSections = state && state.sections && Object.keys(state.sections).length > 0;
    if (hasSections && typeof cartDrawer.renderContents === 'function') {
      // Snapshot the DOM to verify renderContents actually changed something
      const snapshot = cartDrawer.innerHTML;
      try {
        cartDrawer.renderContents(state);
        // Give renderContents a tick to finish (Dawn uses setTimeout internally)
        setTimeout(() => {
          if (cartDrawer.innerHTML !== snapshot) {
            console.log('[Volume Pricing] renderContents succeeded');
            // Ensure drawer is open (some themes open it inside renderContents, some don't)
            this.openCartDrawer(cartDrawer);
          } else {
            console.log('[Volume Pricing] renderContents ran but DOM unchanged — falling back to nuclear');
            this.nuclearCartRefresh(cartDrawer);
          }
        }, 200);
        return;
      } catch (e) {
        console.warn('[Volume Pricing] renderContents threw:', e);
        // Fall through to nuclear
      }
    }

    // ── Strategy 2: Nuclear — fetch fresh section HTML from server ──
    this.nuclearCartRefresh(cartDrawer);
  }

  /**
   * Fetches fresh section HTML from the Shopify Section Rendering API
   * and surgically replaces the cart drawer content in the DOM.
   */
  nuclearCartRefresh(cartDrawer) {
    const sectionId = this.discoverSectionId(cartDrawer) || 'cart-drawer';
    console.log('[Volume Pricing] Nuclear refresh — section ID:', sectionId);

    const url = `${window.location.pathname}?sections=${sectionId}`;

    fetch(url)
      .then(res => res.json())
      .then(sections => {
        const html = sections[sectionId];
        if (!html) {
          console.warn('[Volume Pricing] No HTML returned for section:', sectionId);
          this.openCartDrawer(cartDrawer);
          return;
        }

        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');

        // Surgical DOM replacement — try progressively broader selectors
        const replaceTargets = [
          // Specific inner containers (keeps drawer chrome/buttons intact)
          '.cart-drawer__inner',
          'cart-items-component',
          '.cart-drawer__content',
          '.drawer__inner',
          '.cart-drawer__body',
          '#CartDrawer-Inner',
          '#CartDrawer',
          '.mini-cart__content',
          '.side-cart__content',
          '.cart-drawer-items'
        ];

        let replaced = false;
        for (const selector of replaceTargets) {
          const newEl = doc.querySelector(selector);
          const curEl = cartDrawer.querySelector(selector);
          if (newEl && curEl) {
            curEl.innerHTML = newEl.innerHTML;
            console.log('[Volume Pricing] Replaced content via:', selector);
            replaced = true;
            break;
          }
        }

        // Fallback: replace entire drawer innerHTML using the same tag name
        if (!replaced) {
          const tag = cartDrawer.tagName.toLowerCase();
          const newDrawer = doc.querySelector(tag);
          if (newDrawer) {
            cartDrawer.innerHTML = newDrawer.innerHTML;
            console.log('[Volume Pricing] Replaced entire', tag, 'innerHTML');
            replaced = true;
          }
        }

        if (!replaced) {
          console.warn('[Volume Pricing] Could not match drawer in response HTML');
        }

        // Remove empty-cart CSS states (varies by theme)
        const emptyClasses = ['cart-drawer--empty', 'is-empty', 'drawer--empty', 'cart--empty'];
        emptyClasses.forEach(cls => {
          cartDrawer.classList.remove(cls);
          cartDrawer.querySelectorAll('.' + cls).forEach(el => el.classList.remove(cls));
        });
        const dialog = cartDrawer.querySelector('dialog');
        if (dialog) {
          emptyClasses.forEach(cls => dialog.classList.remove(cls));
        }

        // Open the drawer
        this.openCartDrawer(cartDrawer);

        // Update cart icon bubble count
        this.refreshCartBubble(doc);
      })
      .catch(err => {
        console.error('[Volume Pricing] Nuclear refresh failed:', err);
        this.openCartDrawer(cartDrawer);
      });
  }

  /**
   * Updates the cart icon count bubble if present in the fetched HTML.
   */
  refreshCartBubble(freshDoc) {
    const bubbleSelectors = [
      '#cart-icon-bubble',
      '.cart-count-bubble',
      '.cart-count',
      '[data-cart-count]',
      '.header__cart-count'
    ];

    for (const sel of bubbleSelectors) {
      const newBubble = freshDoc.querySelector(sel);
      const curBubble = document.querySelector(sel);
      if (newBubble && curBubble) {
        curBubble.innerHTML = newBubble.innerHTML;
        break;
      }
    }
  }

  /**
   * Opens the cart drawer — handles all major theme patterns.
   */
  openCartDrawer(cartDrawer) {
    if (!cartDrawer) {
      const n = document.querySelector('cart-notification');
      if (n && typeof n.open === 'function') n.open();
      return;
    }

    // 1. Theme component's own open() method (Dawn, After Dark, etc.)
    if (typeof cartDrawer.open === 'function') {
      try { cartDrawer.open(); return; } catch (e) { /* fall through */ }
    }

    // 2. HTML <dialog> element inside the drawer
    const dialog = cartDrawer.querySelector('dialog');
    if (dialog && !dialog.open) {
      try {
        dialog.showModal();
      } catch (e) {
        try { dialog.show(); } catch (e2) { dialog.setAttribute('open', ''); }
      }
      return;
    }

    // 3. Generic class-based toggle (Prestige, Impulse, Turbo, etc.)
    const toggleClasses = ['active', 'is-active', 'is-open', 'drawer--active', 'cart-drawer--open'];
    toggleClasses.forEach(cls => cartDrawer.classList.add(cls));
    document.body.classList.add('overflow-hidden');
    document.documentElement.classList.add('overflow-hidden');
  }

  isCartAddForm(form) {
    if (!form || !form.getAttribute) return false;
    const action = form.getAttribute('action') || '';
    return action.includes('/cart/add');
  }

  getSubmitterForm(submitter) {
    if (!submitter) return null;
    return submitter.form || submitter.closest('form');
  }

  interceptNativeAdd(event, submitter) {
    const form = this.getSubmitterForm(submitter);
    if (!this.isCartAddForm(form)) return;

    const selectedItems = this.getSelectedItems();
    if (!selectedItems.length) return;

    event.preventDefault();
    event.stopImmediatePropagation();
    this.addSelectedItemsToCart(submitter);
  }

  bindCartFormEvents() {
    this.handleDocumentSubmit = event => {
      this.interceptNativeAdd(event, event.submitter || event.target.querySelector('[type="submit"], [name="add"]'));
    };

    this.handleDocumentClick = event => {
      if (this.contains(event.target)) return;

      const submitter = event.target.closest('[type="submit"], [name="add"], [data-add-to-cart], .product-form__submit');
      if (!submitter) return;

      this.interceptNativeAdd(event, submitter);
    };

    document.addEventListener('submit', this.handleDocumentSubmit, true);
    document.addEventListener('click', this.handleDocumentClick, true);
  }

  bindEvents() {
    this.addEventListener('click', event => {
      const tierTrigger = event.target.closest('.volume-pricing-third__tier-trigger');
      if (tierTrigger) {
        this.setActiveTier(tierTrigger.closest('.volume-pricing-third__tier'));
        this.closeMenus();
        return;
      }

      const selectButton = event.target.closest('.volume-pricing-third__select-button');
      if (selectButton) {
        const tier = selectButton.closest('.volume-pricing-third__tier');
        this.setActiveTier(tier);
        const select = selectButton.closest('[data-select]');
        const isOpen = select.classList.contains('is-open');
        this.closeMenus(select);
        select.classList.toggle('is-open', !isOpen);
        selectButton.setAttribute('aria-expanded', String(!isOpen));
        return;
      }

      const option = event.target.closest('.volume-pricing-third__choice-option');
      if (option) {
        const select = option.closest('[data-select]');
        const label = option.dataset.choice || '';
        const input = select.querySelector('[data-bundle-property]');
        select.querySelector('[data-selected-label]').textContent = label;
        input.value = label;
        input.dataset.variantId = option.dataset.variantId || '';
        select.classList.remove('is-open');
        select.querySelector('.volume-pricing-third__select-button').setAttribute('aria-expanded', 'false');
        this.setActiveTier(option.closest('.volume-pricing-third__tier'));
        return;
      }

      if (!event.target.closest('[data-select]')) this.closeMenus();
    });

    document.addEventListener('click', event => {
      if (!this.contains(event.target)) this.closeMenus();
    });
    setTimeout(() => this.syncActiveTier(), 100);
  }
}

if (!customElements.get('volume-pricing-third-block')) {
  customElements.define('volume-pricing-third-block', VolumePricingThirdBlock);
}