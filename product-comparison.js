// {
//   "name": "product-comparison.js",
//   "author": "Arham Web Works"
//   "description": "Copying in any form is strictly prohibited. Any instance of copying will be subject to legal action and accountability under the law."
// }

function iconicDescriptionImageUrl(img) {
  return (
    img.currentSrc ||
    img.getAttribute("src") ||
    img.getAttribute("data-src") ||
    ""
  ).trim();
}

function iconicIsHttpUrl(url) {
  try {
    var u = new URL(url, window.location.href);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch (e) {
    return false;
  }
}

function iconicReplaceDescriptionImages(root) {
  var scope = root || document;
  scope.querySelectorAll(".iconic-attr-description").forEach(function (container) {
    Array.from(container.querySelectorAll("img")).forEach(function (img, index) {
      if (img.closest("a")) return;
      var url = iconicDescriptionImageUrl(img);
      if (!url || !iconicIsHttpUrl(url)) {
        img.remove();
        return;
      }
      var a = document.createElement("a");
      a.href = url;
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      a.className = "iconic-attr-description__image-link";
      a.textContent = "Image " + (index + 1);
      a.title = url;
      img.replaceWith(a);
    });
  });
}

function iconicInitDescriptionImageLinks() {
  iconicReplaceDescriptionImages();
}

function scrollToAddToCart() {
  const addToCartForm = document.querySelector('form[action="/cart/add"]');
  
  if (addToCartForm) {
    addToCartForm.scrollIntoView({ 
      behavior: 'smooth', 
      block: 'center' 
    });
  }
}

// Initialize all product comparison sections on the page
(function() {
  'use strict';

  // Find all product comparison sections
  function initAllSections() {
    const sections = document.querySelectorAll('[data-iconic-product-comparison]');
    sections.forEach(function(sectionElement) {
      const sectionId = sectionElement.getAttribute('data-section-id');
      if (sectionId && !sectionElement.hasAttribute('data-comparison-initialized')) {
        sectionElement.setAttribute('data-comparison-initialized', 'true');
        initProductComparison(sectionId, sectionElement);
      }
    });
    if (typeof iconicInitDescriptionImageLinks === 'function') {
      iconicInitDescriptionImageLinks();
    }
  }

  // Initialize a single product comparison section
  function initProductComparison(sectionId, sectionElement) {
    const sectionSelector = '#iconic-product-comparison-first-' + sectionId;
    
    const highlightDifferencesDefault = sectionElement.getAttribute('data-highlight-differences') === 'true';
    
    initScrollShadows(sectionSelector);
    initComparisonFeatures(sectionSelector, highlightDifferencesDefault);
    initAppSpecifications(sectionSelector);
  }

  // ============================================================================
  // SCROLL SHADOWS
  // Fallback for browsers without scroll-driven animations
  // ============================================================================
  function initScrollShadows(sectionSelector) {
    const supportsScrollTimeline = CSS.supports('animation-timeline', 'scroll()');
    
    if (supportsScrollTimeline) return;
    
    function setupScrollShadows() {
      const section = document.querySelector(sectionSelector);
      if (!section) return;
      
      const tableWrappers = section.querySelectorAll('.iconic-compare-products-table-wrapper');
      
      tableWrappers.forEach(function(wrapper) {
        // Skip if already initialized
        if (wrapper.hasAttribute('data-scroll-shadow-initialized')) return;
        wrapper.setAttribute('data-scroll-shadow-initialized', 'true');
        
        const table = wrapper.querySelector('.iconic-compare-products-table');
        if (!table) return;
        
        // Create shadow elements if they don't exist
        let rightShadow = wrapper.querySelector('.iconic-scroll-shadow-right');
        let leftShadow = wrapper.querySelector('.iconic-scroll-shadow-left');
        
        if (!rightShadow) {
          rightShadow = document.createElement('div');
          rightShadow.className = 'iconic-scroll-shadow-right';
          rightShadow.style.cssText = 'position: absolute; top: 0; right: 0; width: 15px; height: 100%; pointer-events: none; background: linear-gradient(90deg, rgba(0, 0, 0, 0.08), rgba(0, 0, 0, 0.05) 30%, transparent); opacity: 0; transition: opacity 0.3s ease; z-index: 10;';
          wrapper.style.position = 'relative';
          wrapper.appendChild(rightShadow);
        }
        
        if (!leftShadow) {
          leftShadow = document.createElement('div');
          leftShadow.className = 'iconic-scroll-shadow-left';
          leftShadow.style.cssText = 'position: absolute; top: 0; left: 0; width: 15px; height: 100%; pointer-events: none; background: linear-gradient(270deg, rgba(0, 0, 0, 0.08), rgba(0, 0, 0, 0.05) 30%, transparent); opacity: 0; transition: opacity 0.3s ease; z-index: 10;';
          wrapper.appendChild(leftShadow);
        }
        
        function updateShadows() {
          const scrollLeft = wrapper.scrollLeft;
          const scrollWidth = wrapper.scrollWidth;
          const clientWidth = wrapper.clientWidth;
          const maxScroll = scrollWidth - clientWidth;
          
          // Only show shadows if scrolling is possible
          if (maxScroll <= 0) {
            rightShadow.style.opacity = '0';
            leftShadow.style.opacity = '0';
            return;
          }
          
          // Show right shadow when scrolled from the start
          if (scrollLeft > 0.5) {
            rightShadow.style.opacity = '1';
          } else {
            rightShadow.style.opacity = '0';
          }
          
          // Show left shadow when not scrolled to the end
          if (scrollLeft < maxScroll - 0.5) {
            leftShadow.style.opacity = '1';
          } else {
            leftShadow.style.opacity = '0';
          }
        }
        
        // Update on scroll
        wrapper.addEventListener('scroll', updateShadows, { passive: true });
        
        // Update on resize
        const resizeObserver = new ResizeObserver(updateShadows);
        resizeObserver.observe(wrapper);
        resizeObserver.observe(table);
        
        // Initial update
        updateShadows();
      });
    }
    
    // Initialize on load
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', function() {
        setTimeout(setupScrollShadows, 100);
        setTimeout(setupScrollShadows, 500);
        setTimeout(setupScrollShadows, 1500);
      });
    } else {
      setTimeout(setupScrollShadows, 100);
      setTimeout(setupScrollShadows, 500);
      setTimeout(setupScrollShadows, 1500);
    }
    
    // Watch for section visibility
    const section = document.querySelector(sectionSelector);
    if (section) {
      const observer = new MutationObserver(function() {
        setTimeout(setupScrollShadows, 100);
      });
      observer.observe(section, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['style', 'class']
      });
    }
  }

  // ============================================================================
  // COMPARISON FEATURES
  // Highlight differences, show all rows functionality
  // ============================================================================
  function initComparisonFeatures(sectionSelector, highlightDifferencesDefault) {
    let highlightDifferences = highlightDifferencesDefault;
    
    // Function to get current highlight state from checkbox
    function getHighlightState() {
      const section = document.querySelector(sectionSelector);
      if (!section) return highlightDifferences;
      
      const checkbox = section.querySelector('.iconic-highlight-differences-checkbox');
      if (checkbox) {
        return checkbox.checked;
      }
      return highlightDifferences;
    }
    
    function normalizeText(text) {
      if (!text) return '';
      return text.toString().trim().toLowerCase().replace(/\s+/g, ' ').replace(/[^\w\s]/g, '');
    }
    
    function extractPrice(text) {
      if (!text) return '';
      const match = text.toString().match(/[\d,]+\.?\d*/);
      return match ? match[0].replace(/,/g, '') : '';
    }
    
    function getCellValue(cell) {
      const clone = cell.cloneNode(true);
      // Ignore tooltip UI when computing differences
      const tooltipWrappers = clone.querySelectorAll('.iconic-tooltip-wrapper');
      tooltipWrappers.forEach(function(w) { w.remove(); });
      const mobileTitles = clone.querySelectorAll('.iconic-table-title-mobile');
      mobileTitles.forEach(function(title) {
        title.remove();
      });
      
      const buttons = clone.querySelectorAll('button, .iconic-btn');
      buttons.forEach(function(btn) {
        btn.remove();
      });
      
      let text = clone.textContent || clone.innerText || '';
      text = text.trim();
      
      const priceData = cell.getAttribute('data-price');
      if (priceData) {
        const priceValue = extractPrice(text);
        return priceValue || normalizeText(text);
      }
      
      const checkIcon = cell.querySelector('.bi-check, [class*="bi-check"]');
      const xIcon = cell.querySelector('.bi-x, [class*="bi-x"]');
      if (checkIcon) return 'check';
      if (xIcon) return 'uncheck';
      
      if (cell.querySelector('.iconic-stock-in')) return 'stock-in';
      if (cell.querySelector('.iconic-stock-out')) return 'stock-out';
      if (cell.querySelector('.iconic-stock-low')) return 'stock-low';
      
      return normalizeText(text);
    }
    
    function checkRowDifferences(row) {
      const shouldHighlight = getHighlightState();
      if (!shouldHighlight) {
        row.classList.remove('iconic-row-different');
        row.classList.remove('iconic-row-same');
        return;
      }

      if (row.classList.contains('iconic-group-header-row')) {
        row.classList.remove('iconic-row-different');
        row.classList.remove('iconic-row-same');
        return;
      }
      
      const cells = row.querySelectorAll('td:not(:first-child)');
      if (cells.length < 2) {
        row.classList.remove('iconic-row-different');
        row.classList.remove('iconic-row-same');
        return;
      }
      
      const values = Array.from(cells).map(getCellValue);
      const firstValue = values[0];
      const allSame = values.every(function(val) {
        return val === firstValue;
      });
      
      if (!allSame) {
        row.classList.add('iconic-row-different');
        row.classList.remove('iconic-row-same');
      } else {
        row.classList.add('iconic-row-same');
        row.classList.remove('iconic-row-different');
      }
    }
    
    function updateShowAllButtonVisibility() {
      const section = document.querySelector(sectionSelector);
      if (!section) return;
      
      const shouldHighlight = getHighlightState();
      const buttons = section.querySelectorAll('.iconic-show-all-rows-btn');
      
      buttons.forEach(function(button) {
        let table = null;
        const wrapper = button.previousElementSibling;
        
        if (wrapper && wrapper.classList.contains('iconic-compare-products-table-wrapper')) {
          table = wrapper.querySelector('.iconic-compare-products-table');
        }
        
        if (!table) {
          let sibling = button.previousElementSibling;
          while (sibling && !table) {
            table = sibling.querySelector('.iconic-compare-products-table');
            if (!table) {
              sibling = sibling.previousElementSibling;
            }
          }
        }
        
        if (!table) {
          const tables = section.querySelectorAll('.iconic-compare-products-table');
          table = tables[tables.length - 1];
        }
        
        if (!table) return;
        
        const allRows = table.querySelectorAll('tbody tr');
        const totalRows = allRows.length;
        
        if (shouldHighlight) {
          let visibleRowCount = 0;
          allRows.forEach(function(row) {
            const isHidden = row.classList.contains('iconic-row-hidden');
            const isSame = row.classList.contains('iconic-row-same');
            if (!isHidden && !isSame) {
              visibleRowCount++;
            }
          });
          
          if (visibleRowCount <= 10) {
            button.classList.add('hidden');
            if (wrapper && wrapper.classList.contains('iconic-compare-products-table-wrapper')) {
              wrapper.classList.remove('has-show-all-btn');
            }
          } else {
            button.classList.remove('hidden');
            if (wrapper && wrapper.classList.contains('iconic-compare-products-table-wrapper')) {
              wrapper.classList.add('has-show-all-btn');
            }
            const isShowingAll = button.getAttribute('data-show-all') === 'false';
            if (!isShowingAll) {
              button.textContent = 'Show All (' + visibleRowCount + ' rows)';
            }
          }
        } else {
          if (totalRows > 10) {
            button.classList.remove('hidden');
            if (wrapper && wrapper.classList.contains('iconic-compare-products-table-wrapper')) {
              wrapper.classList.add('has-show-all-btn');
            }
            const isShowingAll = button.getAttribute('data-show-all') === 'false';
            if (!isShowingAll) {
              button.textContent = 'Show All (' + totalRows + ' rows)';
            }
          } else {
            button.classList.add('hidden');
            if (wrapper && wrapper.classList.contains('iconic-compare-products-table-wrapper')) {
              wrapper.classList.remove('has-show-all-btn');
            }
          }
        }
        
        updateWrapperClasses();
      });
    }
    
    function highlightAllDifferences() {
      const section = document.querySelector(sectionSelector);
      if (!section) return;
      
      const shouldHighlight = getHighlightState();
      
      const tables = section.querySelectorAll('.iconic-compare-products-table');
      tables.forEach(function(table) {
        const rows = table.querySelectorAll('tbody tr');
        rows.forEach(function(row) {
          if (shouldHighlight) {
            checkRowDifferences(row);
          } else {
            row.classList.remove('iconic-row-different');
            row.classList.remove('iconic-row-same');
          }
        });
      });
      
      updateShowAllButtonVisibility();
      
      const wrappers = section.querySelectorAll('.iconic-compare-products-table-wrapper.has-show-all-btn');
      wrappers.forEach(function(wrapper) {
        markLastVisibleRow(wrapper);
      });
    }
    
    function initHighlightCheckbox() {
      const section = document.querySelector(sectionSelector);
      if (!section) return;
      
      const checkboxes = section.querySelectorAll('.iconic-highlight-differences-checkbox');
      checkboxes.forEach(function(checkbox) {
        // Skip if already initialized
        if (checkbox.hasAttribute('data-checkbox-initialized')) return;
        checkbox.setAttribute('data-checkbox-initialized', 'true');
        
        checkbox.addEventListener('change', function() {
          const isChecked = this.checked;
          highlightDifferences = isChecked;
          
          checkboxes.forEach(function(cb) {
            cb.checked = isChecked;
          });
          
          highlightAllDifferences();
          setTimeout(updateShowAllButtonVisibility, 100);
        });
      });
    }
    
    // Function to update wrapper classes based on button visibility
    function updateWrapperClasses() {
      const section = document.querySelector(sectionSelector);
      if (!section) return;
      
      const buttons = section.querySelectorAll('.iconic-show-all-rows-btn');
      buttons.forEach(function(button) {
        const wrapper = button.previousElementSibling;
        if (wrapper && wrapper.classList.contains('iconic-compare-products-table-wrapper')) {
          if (button.classList.contains('hidden')) {
            wrapper.classList.remove('has-show-all-btn');
            // Remove last visible row class when button is hidden
            const table = wrapper.querySelector('.iconic-compare-products-table');
            if (table) {
              const rows = table.querySelectorAll('tbody tr');
              rows.forEach(function(row) {
                row.classList.remove('iconic-last-visible-row');
              });
            }
          } else {
            wrapper.classList.add('has-show-all-btn');
            markLastVisibleRow(wrapper);
          }
        }
      });
    }
    
    function markLastVisibleRow(wrapper) {
      if (!wrapper) return;
      
      const table = wrapper.querySelector('.iconic-compare-products-table');
      if (!table) return;
      
      const rows = Array.from(table.querySelectorAll('tbody tr'));
      
      const shouldHighlight = getHighlightState();
      let lastVisibleRow = null;
      let currentLastRow = null;
      
      rows.forEach(function(row) {
        if (row.classList.contains('iconic-last-visible-row')) {
          currentLastRow = row;
        }
      });
      
      for (let i = rows.length - 1; i >= 0; i--) {
        const row = rows[i];
        const isHidden = row.classList.contains('iconic-row-hidden');
        const isSame = shouldHighlight && row.classList.contains('iconic-row-same');
        
        if (!isHidden && !isSame) {
          lastVisibleRow = row;
          break;
        }
      }
      
      if (lastVisibleRow !== currentLastRow) {
        if (currentLastRow) {
          currentLastRow.classList.remove('iconic-last-visible-row');
        }
        
        if (lastVisibleRow) {
          lastVisibleRow.classList.add('iconic-last-visible-row');
        }
      }
    }
    
    function initShowAllRows() {
      const section = document.querySelector(sectionSelector);
      if (!section) return;
      
      const buttons = section.querySelectorAll('.iconic-show-all-rows-btn');
      
      buttons.forEach(function(button) {
        if (button.hasAttribute('data-initialized')) return;
        button.setAttribute('data-initialized', 'true');
        
        let table = null;
        const wrapper = button.previousElementSibling;
        
        if (wrapper && wrapper.classList.contains('iconic-compare-products-table-wrapper')) {
          table = wrapper.querySelector('.iconic-compare-products-table');
        }
        
        if (!table) {
          let sibling = button.previousElementSibling;
          while (sibling && !table) {
            table = sibling.querySelector('.iconic-compare-products-table');
            if (!table) {
              sibling = sibling.previousElementSibling;
            }
          }
        }
        
        if (!table) {
          const tables = section.querySelectorAll('.iconic-compare-products-table');
          table = tables[tables.length - 1];
        }
        
        if (!table) {
          console.warn('Could not find table for show all rows button');
          return;
        }
        
        const allRows = table.querySelectorAll('tbody tr');
        const totalRows = allRows.length;
        
        button.addEventListener('click', function(e) {
          e.preventDefault();
          e.stopPropagation();
          
          const isShowingAll = this.getAttribute('data-show-all') === 'true';
          const rows = Array.from(allRows);
          
          const buttonWrapper = button.previousElementSibling;
          const isWrapper = buttonWrapper && buttonWrapper.classList.contains('iconic-compare-products-table-wrapper');
          
          if (isShowingAll) {
            rows.forEach(function(row) {
              row.classList.remove('iconic-row-hidden');
            });
            this.textContent = 'Show Less';
            this.setAttribute('data-show-all', 'false');
          } else {
            rows.forEach(function(row, index) {
              if (index >= 10) {
                row.classList.add('iconic-row-hidden');
              }
            });
            this.textContent = 'Show All (' + totalRows + ' rows)';
            this.setAttribute('data-show-all', 'true');
          }
          
          if (isWrapper) {
            markLastVisibleRow(buttonWrapper);
          }
          
          setTimeout(function() {
            highlightAllDifferences();
            updateShowAllButtonVisibility();
            updateWrapperClasses();
            if (isWrapper) {
              markLastVisibleRow(buttonWrapper);
            }
          }, 100);
        });
      });
    }
    
    function init() {
      const section = document.querySelector(sectionSelector);
      if (!section) return;
      
      const isVisible = section.offsetParent !== null || 
                        window.getComputedStyle(section).display !== 'none';
      if (!isVisible) {
        setTimeout(init, 300);
        return;
      }
      
      initHighlightCheckbox();
      initShowAllRows();
      highlightAllDifferences();
      setTimeout(function() {
        updateShowAllButtonVisibility();
        updateWrapperClasses();
        const wrappers = section.querySelectorAll('.iconic-compare-products-table-wrapper.has-show-all-btn');
        wrappers.forEach(function(wrapper) {
          markLastVisibleRow(wrapper);
        });
      }, 100);
    }
    
    // Watch for section visibility changes
    function watchSectionVisibility() {
      const section = document.querySelector(sectionSelector);
      if (!section) return;
      
      const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
          if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
            const isVisible = section.offsetParent !== null || 
                              window.getComputedStyle(section).display !== 'none';
            if (isVisible) {
              setTimeout(init, 100);
            }
          }
        });
      });
      
      observer.observe(section, {
        attributes: true,
        attributeFilter: ['style', 'class']
      });
    }
    
    // Run initialization
    function runInit() {
      watchSectionVisibility();
      init();
      
      const delays = [500, 1500, 3000];
      delays.forEach(function(delay) {
        setTimeout(function() {
          init();
          updateWrapperClasses();
          const section = document.querySelector(sectionSelector);
          if (section) {
            const wrappers = section.querySelectorAll('.iconic-compare-products-table-wrapper.has-show-all-btn');
            wrappers.forEach(function(wrapper) {
              markLastVisibleRow(wrapper);
            });
          }
        }, delay);
      });
    }
    
    // Run on page load
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', runInit);
    } else {
      runInit();
    }
    
    // Watch for changes in the recommendations section
    const recommendationsElement = document.querySelector(sectionSelector + ' product-recommendations');
    if (recommendationsElement) {
      const observer = new MutationObserver(function(mutations) {
        let shouldCheck = false;
        mutations.forEach(function(mutation) {
          if (mutation.addedNodes.length > 0) {
            shouldCheck = true;
          }
        });
        if (shouldCheck) {
          setTimeout(init, 200);
        }
      });
      
      observer.observe(recommendationsElement, {
        childList: true,
        subtree: true
      });
    }
  }

  // ============================================================================
  // APP SPEC TABLE RENDERING (uses browser JSON.parse)
  // ============================================================================
  function initAppSpecifications(sectionSelector) {
    const section = document.querySelector(sectionSelector);
    if (!section) return;

    const table = section.querySelector('table.iconic-compare-products-table[data-ipc-groups-json]');
    if (!table) return;

    if (table.dataset.ipcSpecsRendered === 'true') return;

    const groupsJson = table.getAttribute('data-ipc-groups-json');
    if (!groupsJson) return;

    function parseMaybeDoubleJson(input) {
      if (!input) return null;
      try {
        const once = JSON.parse(input);
        if (typeof once === 'string' && (once.trim().startsWith('[') || once.trim().startsWith('{'))) {
          return JSON.parse(once);
        }
        return once;
      } catch (e) {
        return null;
      }
    }

    const groups = parseMaybeDoubleJson(groupsJson);
    if (!Array.isArray(groups) || groups.length === 0) return;

    const headerRow = table.querySelector('thead tr.iconic-compare-product-header');
    if (!headerRow) return;

    const productThs = Array.from(headerRow.querySelectorAll('th[data-ipc-spec-values-json]'));
    if (productThs.length === 0) return;

    const products = productThs.map(function(th) {
      const variantId = th.dataset.ipcVariantId || '';
      const specValuesJson = th.dataset.ipcSpecValuesJson || '{}';
      let specValues = {};
      try {
        const parsed = parseMaybeDoubleJson(specValuesJson || '{}');
        specValues = parsed && typeof parsed === 'object' ? parsed : {};
      } catch (e) {
        specValues = {};
      }
      return { variantId, specValues };
    });

    const compareCount = products.length - 1;
    const tbody = table.querySelector('tbody');
    if (!tbody) return;

    const TOOLTIP_BY_TYPE = {
      sku: 'Stock Keeping Unit - A unique identifier for each product.',
      product_description: 'Product description.',
      product_price: 'Product price.',
      product_type: 'Product type.',
      product_vendor: 'Product vendor.',
      barcode: 'Barcode for the product.',
      tags: 'Product tags.',
      product_rating: 'Product rating from your reviews app.',
      dimension: 'Product dimension.',
      date: 'Date value.',
      money: 'Money value.',
      scale: 'Scale value.',
      link: 'Link value.',
      file: 'File value (PDF, specification sheet, etc.).',
      boolean: 'True or false value.',
      color: 'Color value.',
      decimal: 'Decimal value.',
      integer: 'Integer value.',
      measurement_weight: 'Weight (measurement).',
      volume: 'Volume value.',
      multi_line_text_field: 'Multi-line text value.',
      single_line_text_field: 'Single-line text value.',
      metaobject: 'Metaobject value.',
      metafield_reference: 'Metafield reference value.',
    };

    function createTextCell(cell) {
      cell.textContent = '—';
      return cell;
    }

    function renderValueNode(product, attrId) {
      const raw = product.specValues ? product.specValues[String(attrId)] : null;

      let value = raw;
      if (
        value &&
        typeof value === 'object' &&
        (value.perVariant === true || value.perVariant === 'true') &&
        value.byVariant &&
        typeof value.byVariant === 'object'
      ) {
        value = value.byVariant[product.variantId] || '';
      }

      if (value === null || value === undefined || value === '') {
        const td = document.createElement('td');
        createTextCell(td);
        return td;
      }

      if (value === true || value === 'true') {
        const td = document.createElement('td');
        td.textContent = 'True';
        return td;
      }
      if (value === false || value === 'false') {
        const td = document.createElement('td');
        td.textContent = 'False';
        return td;
      }

      // Link / file object shape: { url, text } or { url, name }
      if (value && typeof value === 'object' && value.url) {
        const td = document.createElement('td');
        const a = document.createElement('a');
        a.href = value.url;
        a.className = 'iconic-spec-link';
        a.target = '_blank';
        a.rel = 'noopener';
        a.textContent = value.text || value.name || 'Open file';
        td.appendChild(a);
        return td;
      }

      const td = document.createElement('td');
      td.textContent = String(value);
      return td;
    }

    function appendGroupRow(label) {
      const tr = document.createElement('tr');
      tr.className = 'iconic-group-header-row';

      const tdLabel = document.createElement('td');
      tdLabel.className = 'iconic-label-col';
      const desktopSpan = document.createElement('span');
      desktopSpan.className = 'iconic-group-text-desktop';
      desktopSpan.textContent = label;
      tdLabel.appendChild(desktopSpan);

      const tdMain = document.createElement('td');
      const mobileSpan = document.createElement('span');
      mobileSpan.className = 'iconic-group-text-mobile';
      mobileSpan.textContent = label;
      tdMain.appendChild(mobileSpan);

      tr.appendChild(tdLabel);
      tr.appendChild(tdMain);

      for (let i = 0; i < compareCount; i += 1) {
        const td = document.createElement('td');
        td.textContent = '';
        tr.appendChild(td);
      }

      tbody.appendChild(tr);
    }

    function appendAttributeRow(attr) {
      const tr = document.createElement('tr');

      const tdLabel = document.createElement('td');
      tdLabel.className = 'iconic-label-col';
      tdLabel.textContent = attr.name || '';

      const tooltipText = attr.tooltip || TOOLTIP_BY_TYPE[attr.type] || '';
      if (tooltipText) {
        const tooltipWrapper = document.createElement('span');
        tooltipWrapper.className = 'iconic-tooltip-wrapper';

        const tooltipIcon = document.createElement('span');
        tooltipIcon.className = 'iconic-tooltip-icon';
        tooltipIcon.textContent = '?';

        const tooltipContent = document.createElement('span');
        tooltipContent.className = 'iconic-tooltip-content';
        tooltipContent.textContent = tooltipText;

        tooltipWrapper.appendChild(tooltipIcon);
        tooltipWrapper.appendChild(tooltipContent);
        tdLabel.appendChild(tooltipWrapper);
      }

      const tdMain = document.createElement('td');
      const mobileTitle = document.createElement('span');
      mobileTitle.className = 'iconic-table-title-mobile';
      mobileTitle.textContent = attr.name || '';
      tdMain.appendChild(mobileTitle);

      const mainValueTd = renderValueNode(products[0], attr.id);
      // renderValueNode returns a full td; move its value into tdMain
      if (mainValueTd.firstChild) {
        tdMain.appendChild(mainValueTd.firstChild);
      } else {
        tdMain.appendChild(document.createTextNode(mainValueTd.textContent || '—'));
      }

      tr.appendChild(tdLabel);
      tr.appendChild(tdMain);

      for (let i = 1; i < products.length; i += 1) {
        const valTd = renderValueNode(products[i], attr.id);
        // valTd already is a td, so insert its contents
        tr.appendChild(valTd);
      }

      tbody.appendChild(tr);
    }

    appendGroupRow('Specifications');

    groups.forEach(function(group) {
      if (!group || !Array.isArray(group.attributes)) return;
      appendGroupRow(group.name || '');
      group.attributes.forEach(function(attr) {
        if (!attr || attr.id === undefined || attr.id === null) return;
        appendAttributeRow(attr);
      });
    });

    table.dataset.ipcSpecsRendered = 'true';
  }

  // ============================================================================
  // PRODUCT SPECIFICATION TABLE (same asset as comparison)
  // ============================================================================

  function initProductSpecification(section) {
    if (!section || section.dataset.specInitialized === "true") return;
    section.dataset.specInitialized = "true";

    var allRows = Array.prototype.slice.call(section.querySelectorAll("[data-row-kind]"));
    var showMoreBtn = section.querySelector("[data-show-all-btn]");
    var initialRows = parseInt(section.dataset.initialRows || "10", 10);
    var expanded = false;

    function updateRows() {
      var specRows = allRows.filter(function (row) {
        return row.getAttribute("data-row-kind") === "spec";
      });
      var headingRows = allRows.filter(function (row) {
        return row.getAttribute("data-row-kind") === "heading";
      });

      specRows.forEach(function (row, index) {
        if (!expanded && index >= initialRows) {
          row.classList.add("iconic-d-none");
        } else {
          row.classList.remove("iconic-d-none");
        }
      });

      headingRows.forEach(function (heading) {
        var hasVisibleSpecUnderHeading = false;
        var cursor = heading.nextElementSibling;

        while (cursor) {
          var kind = cursor.getAttribute("data-row-kind");
          if (kind === "heading") break;
          if (kind === "spec" && cursor.classList.contains("iconic-d-none") === false) {
            hasVisibleSpecUnderHeading = true;
            break;
          }
          cursor = cursor.nextElementSibling;
        }

        heading.classList.toggle("iconic-d-none", !hasVisibleSpecUnderHeading);
      });

      if (!showMoreBtn) return;

      if (specRows.length <= initialRows) {
        showMoreBtn.classList.add("iconic-d-none");
        return;
      }

      showMoreBtn.classList.remove("iconic-d-none");
      if (expanded) {
        showMoreBtn.textContent = "Show Less";
      } else {
        showMoreBtn.textContent = "Show All";
      }
    }

    if (showMoreBtn) {
      showMoreBtn.addEventListener("click", function (event) {
        event.preventDefault();
        expanded = !expanded;
        updateRows();
      });
    }

    updateRows();
    if (typeof iconicReplaceDescriptionImages === "function") {
      iconicReplaceDescriptionImages(section);
    }
  }

  function initAllProductSpecificationSections() {
    document.querySelectorAll("[data-iconic-product-specification]").forEach(function (section) {
      initProductSpecification(section);
    });
  }

  // ============================================================================
  // INITIALIZATION
  // ============================================================================

  function initIconicStorefrontBlocks() {
    initAllSections();
    initAllProductSpecificationSections();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initIconicStorefrontBlocks);
  } else {
    initIconicStorefrontBlocks();
  }

  document.addEventListener("shopify:section:load", initIconicStorefrontBlocks);
  document.addEventListener("shopify:section:select", initIconicStorefrontBlocks);

  const bodyObserver = new MutationObserver(function(mutations) {
    let shouldCheck = false;
    mutations.forEach(function(mutation) {
      if (mutation.addedNodes.length > 0) {
        mutation.addedNodes.forEach(function(node) {
          if (node.nodeType === 1 && (
            node.hasAttribute && node.hasAttribute('data-iconic-product-comparison') ||
            node.querySelector && node.querySelector('[data-iconic-product-comparison]') ||
            node.hasAttribute && node.hasAttribute('data-iconic-product-specification') ||
            node.querySelector && node.querySelector('[data-iconic-product-specification]')
          )) {
            shouldCheck = true;
          }
        });
      }
    });
    if (shouldCheck) {
      setTimeout(initIconicStorefrontBlocks, 100);
    }
  });
  
  bodyObserver.observe(document.body, {
    childList: true,
    subtree: true
  });
})();