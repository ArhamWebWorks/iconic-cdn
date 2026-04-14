// {
//   "name": "product-comparison.js",
//   "author": "Arham Web Works."
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

function ipcTooltipIconSvgHtml(rawKind) {
  var k = String(rawKind || "question-circle").toLowerCase();
  if (k === "info-circle") k = "info";
  if (k !== "question-circle-filled" && k !== "info") k = "question-circle";
  var ff = "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif";
  if (k === "question-circle-filled") {
    return (
      '<svg class="iconic-tooltip-icon-svg iconic-tooltip-icon-svg--question-circle-filled" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="15" height="15" aria-hidden="true" focusable="false">' +
      '<circle cx="12" cy="12" r="10" fill="var(--ips-tooltip-icon-bg, #555555)"/>' +
      '<text x="12" y="16.75" text-anchor="middle" fill="#ffffff" font-size="13" font-weight="700" font-family="' +
      ff +
      '">?</text></svg>'
    );
  }
  if (k === "info") {
    return (
      '<svg class="iconic-tooltip-icon-svg iconic-tooltip-icon-svg--info" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="15" height="15" aria-hidden="true" focusable="false">' +
      '<circle cx="12" cy="12" r="9.25" fill="none" stroke="var(--ips-tooltip-icon-bg, #555555)" stroke-width="1.65"/>' +
      '<text x="12" y="16.25" text-anchor="middle" fill="var(--ips-tooltip-icon-bg, #555555)" font-size="12" font-weight="700" font-family="' +
      ff +
      '">i</text></svg>'
    );
  }
  return (
    '<svg class="iconic-tooltip-icon-svg iconic-tooltip-icon-svg--question-circle" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="15" height="15" aria-hidden="true" focusable="false">' +
    '<circle cx="12" cy="12" r="9.25" fill="none" stroke="var(--ips-tooltip-icon-bg, #555555)" stroke-width="1.65"/>' +
    '<text x="12" y="16.75" text-anchor="middle" fill="var(--ips-tooltip-icon-bg, #555555)" font-size="12" font-weight="700" font-family="' +
    ff +
    '">?</text></svg>'
  );
}

function ipcBooleanIconSvgHtml(truthy, circle) {
  var pos = truthy === true || truthy === "true";
  var circ = circle === true || circle === "true";
  var wrap =
    '<span class="iconic-ipc-bool-svg-wrap ' +
    (pos ? "iconic-ipc-bool-svg-wrap--true" : "iconic-ipc-bool-svg-wrap--false") +
    (circ ? " iconic-ipc-bool-svg-wrap--circle" : "") +
    '" aria-hidden="true">';
  var svgOpen =
    '<svg class="iconic-ipc-bool-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" focusable="false">';
  if (pos) {
    if (circ) {
      return (
        wrap +
        svgOpen +
        '<circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="2"/>' +
        '<path d="M8 12l2.5 2.5L16 9" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>' +
        "</svg></span>"
      );
    }
    return (
      wrap +
      svgOpen +
      '<path d="M5 13l4 4L19 7" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>' +
      "</svg></span>"
    );
  }
  if (circ) {
    return (
      wrap +
      svgOpen +
      '<circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="2"/>' +
      '<path d="M9 9l6 6M15 9l-6 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>' +
      "</svg></span>"
    );
  }
  return (
    wrap +
    svgOpen +
    '<path d="M8 8l8 8M16 8l-8 8" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>' +
    "</svg></span>"
  );
}

function ipcParseScaleMaxForBar(raw) {
  var n = Number(raw);
  if (!Number.isFinite(n)) n = 5;
  n = Math.floor(n);
  if (n < 1) n = 5;
  if (n > 100) n = 100;
  return n;
}

function ipcBuildScaleBarRow(value, maxValue, showValue) {
  var v = Number(value);
  if (!Number.isFinite(v)) v = 0;
  var vmax = ipcParseScaleMaxForBar(maxValue);
  var fillPct =
    vmax > 0
      ? Math.round(Math.min(100, Math.max(0, (v * 100) / vmax)))
      : 0;
  var vLabel = Math.round(v * 10) / 10;

  var row = document.createElement("div");
  row.className = "iconic-scale-bar-row";
  if (!showValue) {
    row.className += " iconic-scale-bar-row--value-hidden";
  }

  var wrap = document.createElement("div");
  wrap.className = "iconic-scale-bar-wrap";
  if (!showValue) {
    wrap.setAttribute("role", "img");
    wrap.setAttribute("aria-label", vLabel + " of " + vmax);
  }

  var track = document.createElement("div");
  track.className = "iconic-scale-bar-track";
  var fill = document.createElement("div");
  fill.className = "iconic-scale-bar-fill";
  fill.style.width = fillPct + "%";
  track.appendChild(fill);
  wrap.appendChild(track);
  row.appendChild(wrap);

  var valText = document.createElement("span");
  valText.className = "iconic-scale-bar-value-text";
  valText.textContent = vLabel + " / " + vmax;
  row.appendChild(valText);

  return row;
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

(function () {
  'use strict';

  var ipcFixedTooltipOpen = null;

  var IPC_TOOLTIP_CUSTOM_PROPS = [
    "--ips-tooltip-font-size",
    "--ips-tooltip-icon-bg",
    "--ips-tooltip-content-bg",
    "--ips-tooltip-content-color",
    "--ips-tooltip-border",
  ];

  function ipcTooltipVarHostFromWrapper(wrapper) {
    if (!wrapper || typeof wrapper.closest !== "function") return null;
    return (
      wrapper.closest("iconic-product-comparison-first") ||
      wrapper.closest('[id^="iconic-product-specification-"]')
    );
  }

  function ipcApplyTooltipVarsFromHost(content, host) {
    if (!content || !host) return;
    try {
      var cs = window.getComputedStyle(host);
      for (var i = 0; i < IPC_TOOLTIP_CUSTOM_PROPS.length; i++) {
        var name = IPC_TOOLTIP_CUSTOM_PROPS[i];
        var val = cs.getPropertyValue(name);
        if (val && String(val).trim()) {
          content.style.setProperty(name, val.trim());
        }
      }
    } catch (e) { }
  }

  function ipcClearTooltipCustomProps(content) {
    if (!content || !content.style) return;
    for (var i = 0; i < IPC_TOOLTIP_CUSTOM_PROPS.length; i++) {
      content.style.removeProperty(IPC_TOOLTIP_CUSTOM_PROPS[i]);
    }
  }

  function ipcHideFixedTooltip(content) {
    if (!content) return;
    ipcClearTooltipCustomProps(content);
    if (ipcFixedTooltipOpen === content) ipcFixedTooltipOpen = null;

    if (content._ipcOriginalParent) {
      try {
        content._ipcOriginalParent.insertBefore(
          content,
          content._ipcOriginalNextSibling || null
        );
      } catch (e) { }
      content._ipcOriginalParent = null;
      content._ipcOriginalNextSibling = null;
    }

    content.style.removeProperty("display");
    content.style.position = "";
    content.style.left = "";
    content.style.top = "";
    content.style.right = "";
    content.style.bottom = "";
    content.style.transform = "";
    content.style.marginLeft = "";
    content.style.marginTop = "";
    content.style.visibility = "";
    content.style.zIndex = "";
    content.style.maxHeight = "";
    content.style.overflowY = "";
    content.style.pointerEvents = "";
    content.classList.remove("iconic-tooltip-content--ipc-fixed");
  }

  function ipcShowFixedTooltip(wrapper) {
    var content = wrapper.querySelector(".iconic-tooltip-content");
    if (!content) return;

    if (ipcFixedTooltipOpen && ipcFixedTooltipOpen !== content) {
      ipcHideFixedTooltip(ipcFixedTooltipOpen);
    }

    var anchor = wrapper.querySelector(".iconic-tooltip-icon") || wrapper;
    var r = anchor.getBoundingClientRect();
    if (r.width < 1 && r.height < 1) r = wrapper.getBoundingClientRect();
    if (r.width < 1 && r.height < 1) return;

    if (!content._ipcOriginalParent) {
      content._ipcOriginalParent = content.parentNode;
      content._ipcOriginalNextSibling = content.nextSibling;
      document.body.appendChild(content);
    }

    ipcApplyTooltipVarsFromHost(content, ipcTooltipVarHostFromWrapper(wrapper));

    content.style.setProperty("display", "block", "important");
    content.style.position = "fixed";
    content.style.visibility = "hidden";
    content.style.left = "-9999px";
    content.style.top = "-9999px";
    content.style.transform = "none";
    content.style.marginLeft = "0";
    content.style.marginTop = "0";
    content.style.maxHeight = "";
    content.style.overflowY = "";
    content.style.pointerEvents = "auto";

    var cw = content.offsetWidth;
    var ch = content.offsetHeight;
    var margin = 10;
    var gap = 10;
    var ww = window.innerWidth;
    var wh = window.innerHeight;

    var left = r.right + gap;
    if (left + cw > ww - margin) {
      left = r.left - gap - cw;
    }
    if (left < margin) left = margin;
    if (left + cw > ww - margin) {
      left = Math.max(margin, ww - margin - cw);
    }

    var maxH = Math.max(120, Math.floor(wh * 0.65) - margin * 2);
    if (ch > maxH) {
      content.style.maxHeight = maxH + "px";
      content.style.overflowY = "auto";
      ch = content.offsetHeight;
    }

    var top = r.top + r.height / 2 - ch / 2;
    if (top < margin) top = margin;
    if (top + ch > wh - margin) top = Math.max(margin, wh - margin - ch);

    content.style.left = Math.round(left) + "px";
    content.style.top = Math.round(top) + "px";
    content.style.visibility = "visible";
    content.style.zIndex = "2147483646";
    content.classList.add("iconic-tooltip-content--ipc-fixed");
    ipcFixedTooltipOpen = content;
  }

  function ipcOnScrollOrResizeCloseTooltip() {
    if (ipcFixedTooltipOpen) ipcHideFixedTooltip(ipcFixedTooltipOpen);
  }

  if (!window.__ipcFixedTooltipGlobalListeners) {
    window.__ipcFixedTooltipGlobalListeners = true;
    window.addEventListener("scroll", ipcOnScrollOrResizeCloseTooltip, { passive: true });
    window.addEventListener("resize", ipcOnScrollOrResizeCloseTooltip);
  }

  function ipcBindFixedTooltips(root) {
    var scope = root && root.nodeType === 1 ? root : document;
    var list = scope.querySelectorAll(
      "[data-iconic-product-comparison] .iconic-tooltip-wrapper, [id^='iconic-product-specification-'] .iconic-tooltip-wrapper",
    );
    for (let i = 0; i < list.length; i++) {
      const wrapper = list[i];
      if (wrapper.dataset.ipcFixedTooltipBound === "1") continue;
      wrapper.dataset.ipcFixedTooltipBound = "1";
      const content = wrapper.querySelector(".iconic-tooltip-content");
      if (!content) continue;

      function showTip() {
        ipcShowFixedTooltip(wrapper);
      }
      function hideTip() {
        ipcHideFixedTooltip(content);
      }
      wrapper.addEventListener("mouseenter", showTip);
      wrapper.addEventListener("mouseleave", hideTip);
      const tipIcon = wrapper.querySelector(".iconic-tooltip-icon");
      if (tipIcon) {
        tipIcon.addEventListener("mouseenter", showTip);
      }
    }
  }

  function initAllSections() {
    const sections = document.querySelectorAll('[data-iconic-product-comparison]');
    sections.forEach(function (sectionElement) {
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

  // ── PATCHED: reads data-ipc-hide-empty-rows and passes it down ──────────────
  function initProductComparison(sectionId, sectionElement) {
    const sectionSelector = '#iconic-product-comparison-first-' + sectionId;

    const highlightDifferencesDefault = sectionElement.getAttribute('data-highlight-differences') === 'true';
    // NEW: read the hide-empty-rows flag set by Liquid
    const hideEmptyRows = sectionElement.getAttribute('data-ipc-hide-empty-rows') === 'true';

    initScrollShadows(sectionSelector);
    initComparisonFeatures(sectionSelector, highlightDifferencesDefault, hideEmptyRows);
    initAppSpecifications(sectionSelector);
  }

  function initScrollShadows(sectionSelector) {
    const supportsScrollTimeline = CSS.supports('animation-timeline', 'scroll()');

    if (supportsScrollTimeline) return;

    function setupScrollShadows() {
      const section = document.querySelector(sectionSelector);
      if (!section) return;

      const tableWrappers = section.querySelectorAll('.iconic-compare-products-table-wrapper');

      tableWrappers.forEach(function (wrapper) {
        if (wrapper.hasAttribute('data-scroll-shadow-initialized')) return;
        wrapper.setAttribute('data-scroll-shadow-initialized', 'true');

        const table = wrapper.querySelector('.iconic-compare-products-table');
        if (!table) return;

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

          if (maxScroll <= 0) {
            rightShadow.style.opacity = '0';
            leftShadow.style.opacity = '0';
            return;
          }

          if (scrollLeft > 0.5) {
            rightShadow.style.opacity = '1';
          } else {
            rightShadow.style.opacity = '0';
          }

          if (scrollLeft < maxScroll - 0.5) {
            leftShadow.style.opacity = '1';
          } else {
            leftShadow.style.opacity = '0';
          }
        }

        wrapper.addEventListener('scroll', updateShadows, { passive: true });

        const resizeObserver = new ResizeObserver(updateShadows);
        resizeObserver.observe(wrapper);
        resizeObserver.observe(table);

        updateShadows();
      });
    }

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', function () {
        setTimeout(setupScrollShadows, 100);
        setTimeout(setupScrollShadows, 500);
        setTimeout(setupScrollShadows, 1500);
      });
    } else {
      setTimeout(setupScrollShadows, 100);
      setTimeout(setupScrollShadows, 500);
      setTimeout(setupScrollShadows, 1500);
    }

    const section = document.querySelector(sectionSelector);
    if (section) {
      const observer = new MutationObserver(function () {
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

  // ── PATCHED: accepts hideEmptyRows as third argument ────────────────────────
  function initComparisonFeatures(sectionSelector, highlightDifferencesDefault, hideEmptyRows) {
    let highlightDifferences = highlightDifferencesDefault;

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

    function isComparisonValueCellVisuallyEmpty(cell) {
      if (!cell) return true;
      const clone = cell.cloneNode(true);
      clone.querySelectorAll('.iconic-tooltip-wrapper, .iconic-table-title-mobile').forEach(function (n) {
        n.remove();
      });
      clone.querySelectorAll('button, .iconic-btn').forEach(function (n) {
        n.remove();
      });
      if (clone.querySelector('a.iconic-spec-link[href]:not([href=""])')) return false;
      if (clone.querySelector('.iconic-ipc-bool-svg-wrap')) return false;
      if (clone.querySelector('.bi-check, .bi-x, [class*="bi-check"], [class*="bi-x"]')) return false;
      if (clone.querySelector('.iconic-scale-bar-row')) return false;
      if (clone.querySelector('.iconic-color-swatch')) return false;
      if (clone.querySelector('.iconic-rating-star-wrapper, .iconic-pc-stars')) return false;
      if (clone.querySelector('.iconic-save-price, .iconic-price-sale, .iconic-price-compare')) return false;
      if (clone.querySelector('.iconic-attr-description')) return false;
      const text = (clone.textContent || '').replace(/\s+/g, '').trim();
      return text === '' || text === '\u2014' || text === '\u2013' || text === '-';
    }

    function getCellValue(cell) {
      const clone = cell.cloneNode(true);
      const tooltipWrappers = clone.querySelectorAll('.iconic-tooltip-wrapper');
      tooltipWrappers.forEach(function (w) { w.remove(); });
      const mobileTitles = clone.querySelectorAll('.iconic-table-title-mobile');
      mobileTitles.forEach(function (title) {
        title.remove();
      });

      const buttons = clone.querySelectorAll('button, .iconic-btn');
      buttons.forEach(function (btn) {
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
        row.classList.remove('iconic-row-all-empty');
        return;
      }

      if (row.classList.contains('iconic-group-header-row')) {
        row.classList.remove('iconic-row-different');
        row.classList.remove('iconic-row-same');
        row.classList.remove('iconic-row-all-empty');
        return;
      }

      const cells = row.querySelectorAll('td:not(:first-child)');
      if (cells.length < 2) {
        row.classList.remove('iconic-row-different');
        row.classList.remove('iconic-row-same');
        row.classList.remove('iconic-row-all-empty');
        return;
      }

      const allVisuallyEmpty = Array.from(cells).every(isComparisonValueCellVisuallyEmpty);
      if (allVisuallyEmpty) {
        row.classList.add('iconic-row-all-empty');
        row.classList.remove('iconic-row-different');
        row.classList.remove('iconic-row-same');
        return;
      }

      row.classList.remove('iconic-row-all-empty');

      const values = Array.from(cells).map(getCellValue);
      const firstValue = values[0];
      const allSame = values.every(function (val) {
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

      buttons.forEach(function (button) {
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
          allRows.forEach(function (row) {
            const isHidden = row.classList.contains('iconic-row-hidden');
            const isSame =
              row.classList.contains('iconic-row-same') ||
              row.classList.contains('iconic-row-all-empty');
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
      tables.forEach(function (table) {
        const rows = table.querySelectorAll('tbody tr');
        rows.forEach(function (row) {
          if (shouldHighlight) {
            checkRowDifferences(row);
          } else {
            row.classList.remove('iconic-row-different');
            row.classList.remove('iconic-row-same');
            row.classList.remove('iconic-row-all-empty');
          }
        });
      });

      updateShowAllButtonVisibility();

      const wrappers = section.querySelectorAll('.iconic-compare-products-table-wrapper.has-show-all-btn');
      wrappers.forEach(function (wrapper) {
        markLastVisibleRow(wrapper);
      });
    }

    function initHighlightCheckbox() {
      const section = document.querySelector(sectionSelector);
      if (!section) return;

      const checkboxes = section.querySelectorAll('.iconic-highlight-differences-checkbox');
      checkboxes.forEach(function (checkbox) {
        if (checkbox.hasAttribute('data-checkbox-initialized')) return;
        checkbox.setAttribute('data-checkbox-initialized', 'true');

        checkbox.addEventListener('change', function () {
          const isChecked = this.checked;
          highlightDifferences = isChecked;

          checkboxes.forEach(function (cb) {
            cb.checked = isChecked;
          });

          highlightAllDifferences();
          // Re-apply hide-empty-rows after highlight changes
          applyHideEmptyRows();
          setTimeout(updateShowAllButtonVisibility, 100);
        });
      });
    }

    function updateWrapperClasses() {
      const section = document.querySelector(sectionSelector);
      if (!section) return;

      const buttons = section.querySelectorAll('.iconic-show-all-rows-btn');
      buttons.forEach(function (button) {
        const wrapper = button.previousElementSibling;
        if (wrapper && wrapper.classList.contains('iconic-compare-products-table-wrapper')) {
          if (button.classList.contains('hidden')) {
            wrapper.classList.remove('has-show-all-btn');
            const table = wrapper.querySelector('.iconic-compare-products-table');
            if (table) {
              const rows = table.querySelectorAll('tbody tr');
              rows.forEach(function (row) {
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

      rows.forEach(function (row) {
        if (row.classList.contains('iconic-last-visible-row')) {
          currentLastRow = row;
        }
      });

      for (let i = rows.length - 1; i >= 0; i--) {
        const row = rows[i];
        const isHidden = row.classList.contains('iconic-row-hidden');
        const isSame =
          shouldHighlight &&
          (row.classList.contains('iconic-row-same') ||
            row.classList.contains('iconic-row-all-empty'));

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

      buttons.forEach(function (button) {
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

        button.addEventListener('click', function (e) {
          e.preventDefault();
          e.stopPropagation();

          const isShowingAll = this.getAttribute('data-show-all') === 'true';
          const rows = Array.from(allRows);

          const buttonWrapper = button.previousElementSibling;
          const isWrapper = buttonWrapper && buttonWrapper.classList.contains('iconic-compare-products-table-wrapper');

          if (isShowingAll) {
            rows.forEach(function (row) {
              row.classList.remove('iconic-row-hidden');
            });
            this.textContent = 'Show Less';
            this.setAttribute('data-show-all', 'false');
          } else {
            rows.forEach(function (row, index) {
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

          setTimeout(function () {
            highlightAllDifferences();
            applyHideEmptyRows();
            updateShowAllButtonVisibility();
            updateWrapperClasses();
            if (isWrapper) {
              markLastVisibleRow(buttonWrapper);
            }
          }, 100);
        });
      });
    }

    // ── NEW: applyHideEmptyRows ───────────────────────────────────────────────
    // When data-ipc-hide-empty-rows="true", hide every tbody row whose
    // value cells all show "—" (dash / blank). Uses the existing
    // iconic-row-all-empty CSS class which is already display:none.
    function applyHideEmptyRows() {
      var section = document.querySelector(sectionSelector);
      if (!section) return;

      var tables = section.querySelectorAll('.iconic-compare-products-table');
      tables.forEach(function (table) {
        var rows = table.querySelectorAll('tbody tr');
        rows.forEach(function (row) {
          // Never touch group-header rows
          if (row.classList.contains('iconic-group-header-row')) return;

          // Value cells only (skip the sticky label column)
          var cells = Array.from(row.querySelectorAll('td:not(.iconic-label-col)'));
          if (cells.length === 0) return;

          var allEmpty = cells.every(isComparisonValueCellVisuallyEmpty);

          if (hideEmptyRows && allEmpty) {
            row.classList.add('iconic-row-all-empty');
          } else if (!hideEmptyRows && allEmpty) {
            // Only clear the flag if the highlight checkbox didn't also set it
            if (!row.classList.contains('iconic-row-same')) {
              row.classList.remove('iconic-row-all-empty');
            }
          }
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
      applyHideEmptyRows();   // ← NEW: hide all-dash rows on load

      setTimeout(function () {
        updateShowAllButtonVisibility();
        updateWrapperClasses();
        const wrappers = section.querySelectorAll('.iconic-compare-products-table-wrapper.has-show-all-btn');
        wrappers.forEach(function (wrapper) {
          markLastVisibleRow(wrapper);
        });
      }, 100);
    }

    function watchSectionVisibility() {
      const section = document.querySelector(sectionSelector);
      if (!section) return;

      const observer = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
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

    function runInit() {
      watchSectionVisibility();
      init();

      const delays = [500, 1500, 3000];
      delays.forEach(function (delay) {
        setTimeout(function () {
          init();
          applyHideEmptyRows();   // ← NEW: re-apply on each retry
          updateWrapperClasses();
          const section = document.querySelector(sectionSelector);
          if (section) {
            const wrappers = section.querySelectorAll('.iconic-compare-products-table-wrapper.has-show-all-btn');
            wrappers.forEach(function (wrapper) {
              markLastVisibleRow(wrapper);
            });
          }
        }, delay);
      });
    }

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', runInit);
    } else {
      runInit();
    }

    const recommendationsElement = document.querySelector(sectionSelector + ' product-recommendations');
    if (recommendationsElement) {
      const observer = new MutationObserver(function (mutations) {
        let shouldCheck = false;
        mutations.forEach(function (mutation) {
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

    const tooltipIconKind = table.getAttribute("data-ipc-tooltip-icon") || "question-circle";
    const ipcBoolTrueCircle = table.getAttribute("data-ipc-bool-true-circle") === "true";
    const ipcBoolFalseCircle = table.getAttribute("data-ipc-bool-false-circle") === "true";
    const ipcScaleShowValue =
      table.getAttribute("data-ipc-scale-show-value") === "true";

    const headerRow = table.querySelector('thead tr.iconic-compare-product-header');
    if (!headerRow) return;

    const productThs = Array.from(headerRow.querySelectorAll('th[data-ipc-spec-values-json]'));
    if (productThs.length === 0) return;

    const products = productThs.map(function (th) {
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

    const zebraStripe = section.getAttribute('data-ipc-zebra-stripe') === 'true';
    let zebraAttrIndex = 0;

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

    function renderValueNode(product, attr) {
      const attrId = attr && attr.id != null ? attr.id : null;
      const attrType = attr && attr.type != null ? attr.type : '';
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

      const typeLc = String(attrType || '').toLowerCase();
      if (typeLc === 'scale') {
        const td = document.createElement('td');
        const mv =
          attr && attr.max_value != null && attr.max_value !== ''
            ? attr.max_value
            : 5;
        td.appendChild(ipcBuildScaleBarRow(value, mv, ipcScaleShowValue));
        return td;
      }
      if (typeLc === 'boolean') {
        const td = document.createElement('td');
        if (value === true || value === 'true') {
          td.innerHTML = ipcBooleanIconSvgHtml(true, ipcBoolTrueCircle);
          return td;
        }
        if (value === false || value === 'false') {
          td.innerHTML = ipcBooleanIconSvgHtml(false, ipcBoolFalseCircle);
          return td;
        }
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
      if (zebraStripe) {
        zebraAttrIndex += 1;
        tr.className =
          zebraAttrIndex % 2 === 1
            ? 'iconic-pc-attr-row--odd'
            : 'iconic-pc-attr-row--even';
      }

      const tdLabel = document.createElement('td');
      tdLabel.className = 'iconic-label-col';
      tdLabel.textContent = attr.name || '';

      const tooltipText = attr.tooltip || TOOLTIP_BY_TYPE[attr.type] || '';
      if (tooltipText) {
        const tooltipWrapper = document.createElement('span');
        tooltipWrapper.className = 'iconic-tooltip-wrapper';

        const tooltipIcon = document.createElement('span');
        tooltipIcon.className = 'iconic-tooltip-icon iconic-tooltip-icon--svg';
        tooltipIcon.setAttribute('aria-hidden', 'true');
        tooltipIcon.innerHTML = ipcTooltipIconSvgHtml(tooltipIconKind);

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

      const mainValueTd = renderValueNode(products[0], attr);
      if (mainValueTd.firstChild) {
        tdMain.appendChild(mainValueTd.firstChild);
      } else {
        tdMain.appendChild(document.createTextNode(mainValueTd.textContent || '—'));
      }

      tr.appendChild(tdLabel);
      tr.appendChild(tdMain);

      for (let i = 1; i < products.length; i += 1) {
        const valTd = renderValueNode(products[i], attr);
        tr.appendChild(valTd);
      }

      tbody.appendChild(tr);
    }

    appendGroupRow('Specifications');

    groups.forEach(function (group) {
      if (!group || !Array.isArray(group.attributes)) return;
      appendGroupRow(group.name || '');
      group.attributes.forEach(function (attr) {
        if (!attr || attr.id === undefined || attr.id === null) return;
        appendAttributeRow(attr);
      });
    });

    table.dataset.ipcSpecsRendered = 'true';
  }

  function initProductSpecification(section) {
    if (!section || section.dataset.specInitialized === "true") return;
    section.dataset.specInitialized = "true";

    var allRows = Array.prototype.slice.call(section.querySelectorAll("[data-row-kind]"));
    var showMoreBtn = section.querySelector("[data-show-all-btn]");
    var initialRows = parseInt(section.dataset.initialRows || "10", 10);
    var hideEmpty = section.dataset.hideEmptyRows === "true";
    var expanded = false;

    function isValueElEmpty(valueEl) {
      if (!valueEl) return true;
      var clone = valueEl.cloneNode(true);
      clone.querySelectorAll(
        ".iconic-tooltip-wrapper, .iconic-table-title-mobile"
      ).forEach(function (n) { n.remove(); });
      if (clone.firstElementChild) return false;
      var text = clone.textContent.replace(/\s+/g, "").trim();
      return text === "" || text === "\u2014" || text === "\u2013" || text === "-";
    }

    function isItemEmpty(item) {
      return isValueElEmpty(item.querySelector(".iconic-product-specification__value"));
    }

    function isRowFullyEmpty(row) {
      var items = row.querySelectorAll(".iconic-product-specification__item");
      if (!items.length) {
        return isValueElEmpty(row.querySelector(".iconic-product-specification__value"));
      }
      return Array.from(items).every(isItemEmpty);
    }

    function updateRows() {
      var specRows = allRows.filter(function (row) {
        return row.getAttribute("data-row-kind") === "spec";
      });
      var headingRows = allRows.filter(function (row) {
        return row.getAttribute("data-row-kind") === "heading";
      });

      specRows.forEach(function (row) {
        row.querySelectorAll(".iconic-product-specification__item").forEach(function (item) {
          if (hideEmpty && isItemEmpty(item)) {
            item.classList.add("iconic-d-none");
          } else {
            item.classList.remove("iconic-d-none");
          }
        });
      });

      var visibleCount = 0;
      specRows.forEach(function (row) {
        if (hideEmpty && isRowFullyEmpty(row)) {
          row.classList.add("iconic-d-none");
          return;
        }
        if (!expanded && visibleCount >= initialRows) {
          row.classList.add("iconic-d-none");
        } else {
          row.classList.remove("iconic-d-none");
          visibleCount++;
        }
      });

      headingRows.forEach(function (heading) {
        var hasVisible = false;
        var cursor = heading.nextElementSibling;
        while (cursor) {
          var kind = cursor.getAttribute("data-row-kind");
          if (kind === "heading") break;
          if (kind === "spec" && !cursor.classList.contains("iconic-d-none")) {
            hasVisible = true;
            break;
          }
          cursor = cursor.nextElementSibling;
        }
        heading.classList.toggle("iconic-d-none", !hasVisible);
      });

      if (!showMoreBtn) return;
      var nonEmptyRowCount = specRows.filter(function (row) {
        return !(hideEmpty && isRowFullyEmpty(row));
      }).length;

      if (nonEmptyRowCount <= initialRows) {
        showMoreBtn.classList.add("iconic-d-none");
      } else {
        showMoreBtn.classList.remove("iconic-d-none");
        showMoreBtn.textContent = expanded ? "Show Less" : "Show All";
      }
    }

    if (showMoreBtn) {
      showMoreBtn.addEventListener("click", function (event) {
        event.preventDefault();
        expanded = !expanded;
        if (expanded) {
          section.querySelectorAll(".iconic-spec-narrow-hide").forEach(function (el) {
            el.classList.remove("iconic-spec-narrow-hide");
          });
        }
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

  function initIconicStorefrontBlocks() {
    initAllSections();
    initAllProductSpecificationSections();
    ipcBindFixedTooltips(document);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initIconicStorefrontBlocks);
  } else {
    initIconicStorefrontBlocks();
  }

  document.addEventListener("shopify:section:load", initIconicStorefrontBlocks);
  document.addEventListener("shopify:section:select", initIconicStorefrontBlocks);

  const bodyObserver = new MutationObserver(function (mutations) {
    let shouldCheck = false;
    mutations.forEach(function (mutation) {
      if (mutation.addedNodes.length > 0) {
        mutation.addedNodes.forEach(function (node) {
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
