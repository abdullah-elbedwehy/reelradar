function handle_errors_tiktok(e, t) {
  if (document.getElementById("banner_most_viewed_reels") !== null)
    return (
      chrome.runtime.sendMessage({
        sort_feed_error: !0,
        error_type: "back_to_back_sorting",
      }),
      !1
    );
  {
    let n = document.querySelector('[data-e2e="videos-tab"]');
    if (n !== null)
      if (n.getAttribute("aria-selected") === "true") {
        let r = document.querySelector('div[data-compact="true"]');
        return r === null ||
          Array.from(r.querySelectorAll("button")).findIndex(
            (c) => c.getAttribute("data-active") === "true",
          ) === 0
          ? !0
          : (chrome.runtime.sendMessage({
              sort_feed_error: !0,
              error_type: "latest_tab_tiktok",
            }),
            !1);
      } else
        return (
          chrome.runtime.sendMessage({
            sort_feed_error: !0,
            error_type: "video_tab_tiktok",
          }),
          !1
        );
    else
      return (
        chrome.runtime.sendMessage({
          sort_feed_error: !0,
          error_type: "profile_page_tiktok",
        }),
        !1
      );
  }
}
const __sfInitT0 = performance.now(),
  __sfInitTs = () => (performance.now() - __sfInitT0).toFixed(1) + "ms";
const RR_FEED_ICON_PATH_TK = "Icons/128-ReelRadar.png",
  RR_FEED_ICON_FALLBACK_PATH_TK = "Icons/reelradar-logo.svg";
function mimicTikTokVisit() {
  const e = location.href;
  (history.pushState({}, "", "/"),
    window.dispatchEvent(new PopStateEvent("popstate")),
    setTimeout(() => {
      (history.pushState({}, "", e),
        window.dispatchEvent(new PopStateEvent("popstate")));
    }, 50));
}
function setFeedBadgeIconTikTok(e) {
  const t = chrome.runtime.getURL(RR_FEED_ICON_FALLBACK_PATH_TK);
  ((e.src = chrome.runtime.getURL(RR_FEED_ICON_PATH_TK)),
    (e.onerror = () => {
      (console.warn(
        "[ReelRadar] TikTok feed icon failed to load, falling back to SVG.",
      ),
        (e.onerror = null),
        (e.src = t));
    }));
}
function setTikTokActionData(
  e,
  { videoId: t = "", profileName: n = "", photoFlag: o = !1 },
) {
  ((e.dataset.rrAction = "true"),
    (e.dataset.sfAction = "true"),
    (e.dataset.rrTiktokAction = "download"),
    (e.dataset.rrVideoId = t ? String(t) : ""),
    (e.dataset.rrProfileName = n),
    (e.dataset.rrPhotoFlag = o ? "1" : "0"));
}
function handleTikTokActionClick(e) {
  const t = e.target.closest("[data-rr-tiktok-action='download']");
  if (!t) return;
  (e.stopPropagation(),
    e.preventDefault(),
    window.postMessage(
      {
        download: !0,
        download_item: "tiktok",
        download_video_id: t.dataset.rrVideoId || "",
        download_profile_name: t.dataset.rrProfileName || "",
        photoFlag: t.dataset.rrPhotoFlag === "1",
        iconUrl: chrome.runtime.getURL("Icons/reelradar-logo.svg"),
      },
      "*",
    ));
}
window._rrTkActionClickBound ||
  ((window._rrTkActionClickBound = !0),
  document.addEventListener("click", handleTikTokActionClick, !0));
(chrome.runtime.onMessage.addListener((e, t, n) => {
  (e.action === "refreshPageTikTok" &&
    handle_errors_tiktok(e.sort_by, e.dates_items) &&
    (sessionStorage.removeItem("sortFeedSortBy"),
    sessionStorage.removeItem("sortFeedNoItems"),
    sessionStorage.removeItem("sortFeedStatus"),
    sessionStorage.removeItem("sortItemsVsDates"),
    sessionStorage.removeItem("sortFeedStatusTikTok"),
    sessionStorage.removeItem("sortFeedData"),
    sessionStorage.removeItem("sortFeedStopSorting"),
    sessionStorage.setItem("sortFeedSortBy", e.sort_by),
    sessionStorage.setItem("sortFeedNoItems", e.no_items),
    sessionStorage.setItem("sortFeedStatusTikTok", !0),
    sessionStorage.setItem("sortItemsVsDates", e.dates_items),
    window.postMessage(
      { source: "sortfeed", type: "reset_tiktok_session" },
      "*",
    ),
    mimicTikTokVisit()),
    e.action);
}),
  (() => {
    if (
      location.hostname !== "www.tiktok.com" &&
      location.hostname !== "tiktok.com"
    )
      return;
    const e = (n) => {
      const o = document.createElement("script");
      ((o.src = chrome.runtime.getURL(n)),
        (o.onload = () => o.remove()),
        (document.documentElement || document.head).appendChild(o));
    };
    // Inject the page-world fetch hook used by the TikTok sorter.
    e("Tiktok/script_tiktok.js");
  })(),
  (function () {
    if (window !== window.top) return;
    const e = "data-rr-tk-hover",
      t = "rr-tk-hover-btns-wrapper",
      n = "rr-tk-hover-overlay";
    let o = !0;
    (chrome.storage.local.get(["sortfeed_tiktok_download_enabled"], (l) => {
      l.sortfeed_tiktok_download_enabled === !1 && (o = !1);
    }),
      chrome.storage.onChanged.addListener((l) => {
        "sortfeed_tiktok_download_enabled" in l &&
          ((o = l.sortfeed_tiktok_download_enabled.newValue !== !1), a());
      }));
    function a() {
      (document.querySelectorAll(`[${e}]`).forEach((l) => {
        (l.removeAttribute(e),
          l.querySelector(`.${t}`)?.remove(),
          l.querySelector(`.${n}`)?.remove(),
          (l.style.position = ""));
      }),
        d());
    }
    function i() {
      const l = window.location.pathname;
      if (
        /^\/explore\/?$/.test(l) ||
        /^\/search\/?$/.test(l) ||
        /^\/search\/video\/?$/.test(l)
      )
        return !0;
      if (/^\/search\//.test(l)) return !1;
      const y = l.replace(/^\/|\/$/g, "").split("/");
      return !!(
        (y.length === 1 && y[0].startsWith("@")) ||
        (y.length >= 2 &&
          y[0].startsWith("@") &&
          ["liked", "collection"].includes(y[1]))
      );
    }
    function c(l) {
      const y = (l || "").match(/\/@([^\/]+)\/(video|photo)\/(\d+)/);
      return y
        ? { profileName: y[1], isPhoto: y[2] === "photo", videoId: y[3] }
        : null;
    }
    function s() {
      if (document.getElementById("rr-tk-hover-style")) return;
      const l = document.createElement("style");
      ((l.id = "rr-tk-hover-style"),
        (l.textContent = `
      /* Dark overlay \u2014 shown on anchor hover */
      .${n} {
        position: absolute;
        inset: 0;
        background: rgba(0, 0, 0, 0.80);
        opacity: 0;
        pointer-events: none;
        transition: opacity 120ms ease-out;
        z-index: 8;
        border-radius: inherit;
      }

      a[${e}]:hover .${n} {
        opacity: 1;
      }

      /* Buttons wrapper */
      .${t} {
        position: absolute;
        bottom: 12px; right: 12px;
        display: flex; flex-direction: column; gap: 8px;
        align-items: flex-end;
        opacity: 0;
        pointer-events: none;
        transition: opacity 120ms ease-out;
        z-index: 10;
      }

      a[${e}]:hover .${t} {
        opacity: 1;
        pointer-events: auto;
      }

      .rr-tk-hover-btn {
        background: rgba(0, 0, 0, 0.82);
        border: 1px solid rgba(34, 211, 238, 0.25);
        border-radius: 8px;
        backdrop-filter: blur(8px);
        -webkit-backdrop-filter: blur(8px);
        padding: 6px 10px;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 6px;
        cursor: pointer;
        position: relative;
        transition: border-color 150ms ease, background 150ms ease;
      }

      .rr-tk-hover-btn:hover {
        border-color: rgba(34, 211, 238, 0.6);
        background: rgba(0, 0, 0, 0.92);
      }

      .rr-tk-hover-btn img {
        position: static !important;
        inset: auto !important;
        width: 16px !important; height: 16px !important;
        min-width: auto !important; max-width: none !important;
        min-height: auto !important; max-height: none !important;
        background: transparent !important;
        padding: 0 !important;
        box-sizing: content-box !important;
        display: block !important;
        filter: brightness(0) invert(1);
        transition: opacity 150ms ease, filter 150ms ease;
        opacity: 0.9 !important;
      }

      .rr-tk-hover-btn:hover img {
        opacity: 1 !important;
        filter: brightness(0) saturate(100%) invert(72%) sepia(98%) saturate(400%)
          hue-rotate(155deg) brightness(105%);
      }

      .rr-tk-hover-tip {
        position: absolute; top: 50%; left: -6px;
        transform: translate(-100%, -50%);
        background: rgba(5, 10, 12, 0.96);
        border: 1px solid rgba(34, 211, 238, 0.25);
        color: #e8f8fc; font-size: 0.75rem; line-height: 1;
        padding: 4px 8px; border-radius: 6px; white-space: nowrap;
        opacity: 0; pointer-events: none; z-index: 99999;
        box-shadow: 0 8px 18px rgba(0, 0, 0, 0.35); transition: opacity 120ms ease;
      }

      .rr-tk-hover-btn:hover .rr-tk-hover-tip {
        opacity: 1;
      }
    `),
        document.head.appendChild(l));
    }
    function m(l, y, E) {
      const I = document.createElement("div");
      ((I.className = "rr-tk-hover-btn"),
        setTikTokActionData(I, {
          videoId: l,
          profileName: y,
          photoFlag: E,
        }));
      const v = document.createElement("img");
      v.src = chrome.runtime.getURL("Icons/Hover/arrowDownBlack.png");
      const w = document.createElement("div");
      return (
        (w.className = "rr-tk-hover-tip"),
        (w.textContent = "Download"),
        I.appendChild(v),
        I.appendChild(w),
        I
      );
    }
    function h(l, y, E, I) {
      if (l.hasAttribute(e)) return;
      (l.setAttribute(e, "true"),
        window.getComputedStyle(l).position === "static" &&
          (l.style.position = "relative"));
      const v = document.createElement("div");
      if (
        ((v.className = t),
        o && v.appendChild(m(y, E, I)),
        !v.hasChildNodes())
      )
        return;
      const w = document.createElement("div");
      ((w.className = n), l.appendChild(w), l.appendChild(v));
    }
    function d() {
      if (!i() || sessionStorage.getItem("sortFeedStatusTikTok") || !o)
        return;
      Array.from(document.querySelectorAll("a[href]"))
        .filter((y) =>
          /\/@[^\/]+\/(video|photo)\/\d+/.test(y.getAttribute("href") || ""),
        )
        .forEach((y) => {
          if (y.hasAttribute(e)) return;
          const E = c(y.getAttribute("href"));
          E && h(y, E.videoId, E.profileName, E.isPhoto);
        });
    }
    function b() {
      (document.querySelectorAll(`.${t}`).forEach((l) => l.remove()),
        document.querySelectorAll(`.${n}`).forEach((l) => l.remove()),
        document.querySelectorAll(`[${e}]`).forEach((l) => {
          (l.removeAttribute(e), (l.style.position = ""));
        }));
    }
    let f = window.location.pathname,
      p = null;
    const k = new MutationObserver(() => {
      if (
        (window.location.pathname !== f &&
          ((f = window.location.pathname), b()),
        sessionStorage.getItem("sortFeedStatusTikTok"))
      ) {
        b();
        return;
      }
      (clearTimeout(p), (p = setTimeout(d, 300)));
    });
    function g() {
      (s(), k.observe(document.body, { childList: !0, subtree: !0 }), d());
    }
    document.body ? g() : document.addEventListener("DOMContentLoaded", g);
  })(),
  (function () {
    if (window !== window.top) return;
    const e = "rr-tk-sp-pill";
    let t = !0;
    (chrome.storage.local.get(["sortfeed_tiktok_download_enabled"], (u) => {
      u.sortfeed_tiktok_download_enabled === !1 && (t = !1);
    }),
      chrome.storage.onChanged.addListener((u) => {
        "sortfeed_tiktok_download_enabled" in u &&
          ((t = u.sortfeed_tiktok_download_enabled.newValue !== !1), b(), p());
      }));
    function o() {
      return /\/@[^\/]+\/(video|photo)\/\d+/.test(window.location.pathname);
    }
    function r() {
      const u = window.location.pathname.match(/\/(video|photo)\/(\d+)/);
      return u ? u[2] : null;
    }
    function a() {
      const u = window.location.pathname.match(/\/@([^\/]+)\//);
      return u ? u[1] : "";
    }
    function i() {
      return /\/photo\/\d+/.test(window.location.pathname);
    }
    function c() {
      if (document.getElementById("rr-tk-sp-style")) return;
      const u = document.createElement("style");
      ((u.id = "rr-tk-sp-style"),
        (u.textContent = `
      @keyframes rr-tk-sp-fadein {
        from { opacity: 0; transform: scale(0.88); }
        to   { opacity: 1; transform: scale(1); }
      }

      #${e} {
        display: flex;
        flex-direction: column;
        gap: 8px;
        align-items: center;
        z-index: 10;
        animation: rr-tk-sp-fadein 350ms cubic-bezier(0.16, 1, 0.3, 1) both;
      }

      .rr-tk-sp-btn {
        background: rgba(0, 0, 0, 0.82);
        border: 1px solid rgba(34, 211, 238, 0.25);
        border-radius: 8px;
        backdrop-filter: blur(8px);
        -webkit-backdrop-filter: blur(8px);
        padding: 6px 10px;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 6px;
        cursor: pointer;
        position: relative;
        transition: border-color 150ms ease, background 150ms ease;
      }

      .rr-tk-sp-btn:hover {
        border-color: rgba(34, 211, 238, 0.6);
        background: rgba(0, 0, 0, 0.92);
      }

      .rr-tk-sp-icon {
        width: 16px;
        height: 16px;
        background-color: transparent;
        background-size: 16px 16px;
        background-repeat: no-repeat;
        background-position: center;
        filter: brightness(0) invert(1);
        opacity: 0.9;
        transition: opacity 150ms ease, filter 150ms ease;
      }

      .rr-tk-sp-btn:hover .rr-tk-sp-icon {
        filter: brightness(0) saturate(100%) invert(72%) sepia(98%) saturate(400%)
          hue-rotate(155deg) brightness(105%);
        opacity: 1;
      }

      .rr-tk-sp-tip {
        position: absolute;
        top: 50%;
        left: calc(100% + 6px);
        transform: translateY(-50%);
        background: rgba(5, 10, 12, 0.96);
        border: 1px solid rgba(34, 211, 238, 0.25);
        color: #e8f8fc;
        font-size: 0.75rem;
        line-height: 1;
        padding: 4px 8px;
        border-radius: 6px;
        white-space: nowrap;
        opacity: 0;
        pointer-events: none;
        z-index: 99999;
        box-shadow: 0 8px 18px rgba(0, 0, 0, 0.35);
        transition: opacity 120ms ease;
        display: flex;
        align-items: center;
        gap: 5px;
      }

      .rr-tk-sp-btn:hover .rr-tk-sp-tip {
        opacity: 1 !important;
      }
    `),
        document.head.appendChild(u));
    }
    function s(u, _, x) {
      const T = document.createElement("div");
      T.className = "rr-tk-sp-btn";
      const S = document.createElement("div");
      ((S.className = "rr-tk-sp-icon"),
        (S.style.backgroundImage = `url("${chrome.runtime.getURL("Icons/Hover/arrowDownBlack.png")}")`));
      const L = document.createElement("div");
      return (
        (L.className = "rr-tk-sp-tip"),
        (L.textContent = "Download"),
        setTikTokActionData(T, {
          videoId: u,
          profileName: _,
          photoFlag: x,
        }),
        T.appendChild(S),
        T.appendChild(L),
        T
      );
    }
    function m() {
      const u = document.querySelector('div[class*="DivVideoWrapper"]');
      if (u) return u;
      const _ = document.querySelector('[data-e2e="browse-video"]');
      if (_) {
        let T = _;
        for (; T.parentElement; ) {
          if (
            ((T = T.parentElement),
            T.className && T.className.includes("DivVideoWrapper"))
          )
            return T;
          if (T.tagName === "MAIN" || T === document.body) break;
        }
        if (_.parentElement?.parentElement?.parentElement)
          return _.parentElement.parentElement.parentElement;
      }
      const x = document.querySelector('video[crossorigin="use-credentials"]');
      if (x) {
        let T = x;
        for (let S = 0; S < 6 && T.parentElement; S++)
          if (
            ((T = T.parentElement),
            T.className && T.className.includes("DivVideoWrapper"))
          )
            return T;
      }
      return null;
    }
    function h() {
      const u = document.getElementById(e);
      return u && document.body.contains(u);
    }
    function d() {
      if (!o() || !t) return !1;
      if (h()) return !0;
      b();
      const u = r();
      if (!u) return !1;
      const _ = m();
      if (!_) return !1;
      const x = a(),
        T = i(),
        S = document.createElement("div");
      ((S.id = e), S.appendChild(s(u, x, T)));
      const L = getComputedStyle(_).position;
      return (
        (L === "static" || L === "") && (_.style.position = "relative"),
        (S.style.position = "absolute"),
        (S.style.left = "16px"),
        (S.style.top = "50%"),
        (S.style.transform = "translateY(-50%)"),
        (S.style.zIndex = "20"),
        _.appendChild(S),
        !0
      );
    }
    function b() {
      const u = document.getElementById(e);
      u && u.remove();
    }
    let f = null;
    function p() {
      if ((k(), !o())) return;
      let u = 0;
      const _ = 25;
      function x() {
        u >= _ || (o() && (u++, d() || (f = setTimeout(x, 150))));
      }
      x();
    }
    function k() {
      f && (clearTimeout(f), (f = null));
    }
    let g = location.href;
    function l() {
      location.href !== g && ((g = location.href), k(), b(), p());
    }
    const y = history.pushState;
    history.pushState = function () {
      (y.apply(this, arguments), l());
    };
    const E = history.replaceState;
    ((history.replaceState = function () {
      (E.apply(this, arguments), l());
    }),
      window.addEventListener("popstate", l));
    let I = null;
    const v = new MutationObserver(() => {
      (clearTimeout(I),
        (I = setTimeout(() => {
          o() && !h() && p();
        }, 100)));
    });
    function w() {
      (c(), v.observe(document.body, { childList: !0, subtree: !0 }), p());
    }
    document.body ? w() : document.addEventListener("DOMContentLoaded", w);
  })());
function remove_items_local_storage_tiktok() {
  (sessionStorage.removeItem("sortFeedSortBy"),
    sessionStorage.removeItem("sortFeedNoItems"),
    sessionStorage.removeItem("sortFeedStatus"),
    sessionStorage.removeItem("sortFeedStatusTikTok"),
    sessionStorage.removeItem("sortFeedData"),
    sessionStorage.removeItem("sortFeedDataSorted"),
    sessionStorage.removeItem("sortItemsVsDates"));
}
function handle_empty_slots(e, t) {
  const n = e.length,
    o = e[n - 1].element;
  function r(a) {
    let i = document.createElement("div");
    t.appendChild(i);
  }
  if (n === 1) (r(o), r(o), r(o));
  else if (n === 2) (r(o), r(o));
  else if (n === 3) r(o);
  else return;
}
function formatNumber(e) {
  if (e === null || e === 0 || (e >= 1 && e <= 999)) return e;
  if (e >= 1e3 && e < 1e6) return (e / 1e3).toFixed(1) + "K";
  if (e >= 1e6) return (e / 1e6).toFixed(1) + "M";
}
function createItemTikTok(
  e = "",
  t = null,
  n = null,
  o = null,
  r = null,
  a = null,
  i = null,
  c = null,
) {
  const s = document.createElement("div");
  if (
    ((s.innerHTML = e),
    (s.style.cssText = "position: relative; isolation: isolate;"),
    (s.dataset.sfSortedItem = "true"),
    c)
  )
    try {
      s.dataset.sfItemJson = JSON.stringify(c);
    } catch {}
  const m = s.querySelector('[data-e2e="user-post-item"]');
  if (!m) return s;
  (m.addEventListener(
    "click",
    (g) => {
      if (
        g.defaultPrevented ||
        g.button !== 0 ||
        g.metaKey ||
        g.ctrlKey ||
        g.shiftKey ||
        g.altKey ||
        g.target?.closest?.("#download-sort-feed-video")
      )
        return;
      const y = (
        g.target.closest('a[href*="/video/"], a[href*="/photo/"]') ||
        m.querySelector('a[href*="/video/"], a[href*="/photo/"]')
      )?.href;
      y &&
        (g.preventDefault(),
        g.stopPropagation(),
        window.open(y, "_blank", "noopener,noreferrer"));
    },
    !0,
  ),
    (m.style.position = "relative"),
    s
      .querySelectorAll('a[href*="/video/"], a[href*="/photo/"]')
      .forEach((g) => {
        g.setAttribute("data-rr-tk-hover", "true");
      }));
  const h = document.createElement("div");
  if (
    ((h.dataset.sfCustomUi = "true"),
    (h.style.cssText = `
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.80);
    opacity: 0;
    pointer-events: none;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 16px;
    font-weight: bold;
    z-index: 10000;
    transition: opacity 120ms ease-out;
  `),
    n !== null && o !== null && t !== null)
  ) {
    const g = document.createElement("div");
    g.style.cssText = `
      display: flex;
      flex-direction: column;
      gap: 25px;
      align-items: center;
    `;
    const l = document.createElement("span");
    ((l.style.cssText = "display: flex; align-items: center; gap: 5px;"),
      (l.innerHTML = `
      <img src="${chrome.runtime.getURL("Icons/Hover/PlayIG.png")}" style="width: 16px;" />
      ${t}
    `));
    const y = document.createElement("span");
    ((y.style.cssText = "display: flex; align-items: center; gap: 5px;"),
      (y.innerHTML = `
      <img src="${chrome.runtime.getURL("Icons/Hover/LoveWhite.png")}" style="width: 16px;" />
      ${n}
    `));
    const E = document.createElement("span");
    ((E.style.cssText = "display: flex; align-items: center; gap: 5px;"),
      (E.innerHTML = `
      <img src="${chrome.runtime.getURL("Icons/Hover/sharesTK.png")}" style="width: 16px;" />
      ${o}
    `),
      g.appendChild(l),
      g.appendChild(y),
      g.appendChild(E),
      h.appendChild(g));
  }
  let d = null;
  ((d = document.createElement("div")),
    (d.dataset.sfCustomUi = "true"),
    setTikTokActionData(d, {
      videoId: r,
      profileName: a,
      photoFlag: i,
    }),
    (d.style.cssText = `
      position: absolute;
      bottom: 10px;
      right: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      opacity: 0;
      transition: opacity 120ms ease-out;
      z-index: 10001;
    `));
  const b = document.createElement("img");
  ((b.id = "download-sort-feed-video"),
    (b.src = chrome.runtime.getURL("Icons/Hover/arrowDownBlack.png")),
    (b.style = `
      width: 20px;
      height: 20px;
      border-radius: 3px;
      background: #22d3ee;
      padding: 5px;
    `),
    d.appendChild(b));
  const f = document.createElement("div");
  ((f.textContent = "Download"),
    (f.style.cssText = `
      position: absolute;
      top: 50%;
      left: -6px;
      transform: translate(-100%, -50%);
      background: #000;
      color: #fff;
      font-size: 10px;
      line-height: 1;
      padding: 4px 8px;
      border-radius: 6px;
      white-space: nowrap;
      opacity: 0;
      pointer-events: none;
      z-index: 99999;
      box-shadow: 0 2px 8px rgba(0,0,0,0.2);
      transition: opacity 120ms ease;
    `),
    d.appendChild(f),
    d.addEventListener("mouseenter", () => {
      ((b.style.opacity = "0.75"), (f.style.opacity = "1"));
    }),
    d.addEventListener("mouseleave", () => {
      ((b.style.opacity = "1"), (f.style.opacity = "0"));
    }));
  if (!document.getElementById("slideInUp")) {
    const g = document.createElement("style");
    ((g.id = "slideInUp"),
      (g.textContent = `
      @keyframes slideInUp {
        0% { transform: translateY(100%); opacity: 0; }
        100% { transform: translateY(0); opacity: 1; }
      }
    `),
      document.head.appendChild(g));
  }
  return (
    m.appendChild(h),
    d && m.appendChild(d),
    m.addEventListener("mouseenter", () => {
      ((h.style.opacity = "1"), d && (d.style.opacity = "1"));
    }),
    m.addEventListener("mouseleave", (g) => {
      const l = g.relatedTarget;
      m.contains(l) || ((h.style.opacity = "0"), d && (d.style.opacity = "0"));
    }),
    s
  );
}
async function add_sorted_items_tiktok(e) {
  const t = e || [],
    n = document.querySelector('div[data-e2e="user-post-item-list"]');
  if (!n) return (console.error("[SF] Original container not found."), !1);
  (document.querySelector('[data-sortfeed="true"]')?.remove(),
    (n.style.cssText = ""),
    n.removeAttribute("data-rr-hidden"));
  const o = document.createElement("div");
  (o.setAttribute("data-sortfeed", "true"), (o.className = n.className));
  let r = 0;
  for (const a of t) {
    const i = document.createElement("div");
    i.innerHTML = a.element;
    const c = i.firstElementChild?.cloneNode(!0);
    if (!c) continue;
    const s = createItemTikTok(
      c.outerHTML,
      formatNumber(a.viewCount),
      formatNumber(a.likesCount),
      formatNumber(a.shareCount),
      a.code,
      a.userName,
      a.photoFlag,
      {
        code: a.code,
        userName: a.userName,
        createDate: a.createDate,
        viewCount: a.viewCount,
        likesCount: a.likesCount,
        shareCount: a.shareCount,
        commentsCount: a.commentsCount,
        savesCount: a.savesCount,
        caption: a.caption,
        photoFlag: a.photoFlag,
        musicUrl: a.musicUrl ?? null,
      },
    );
    (o.appendChild(s), r++);
  }
  return r === 0
    ? (console.warn("[SF] 0 items rendered; not hiding original."),
      o.remove(),
      !1)
    : (n.before(o),
      n.setAttribute("data-rr-hidden", "true"),
      (n.style.position = "absolute"),
      (n.style.left = "-99999px"),
      (n.style.top = "0"),
      (n.style.width = "1px"),
      (n.style.height = "1px"),
      (n.style.overflow = "hidden"),
      (n.style.pointerEvents = "none"),
      (n.style.opacity = "0"),
      !0);
}
function handle_header(e, t) {
  if (e === "views") return `Most Viewed ${t}`;
  if (e === "comments") return `Most Commented ${t}`;
  if (e === "likes") return `Most Liked ${t}`;
  if (e === "oldest") return `Oldest ${t}`;
  if (e === "shares") return `Most Shared ${t}`;
  if (e === "saves") return `Most Saved ${t}`;
}
function handle_sub_header(e, t, n, o) {
  if (n === "items") return `Latest ${e} ${t}`;
  if (n === "dates" && o === "1_week") return `${e} ${t} from 1 Week Back`;
  if (n === "dates" && o === "1_month") return `${e} ${t} from 1 Month Back`;
  if (n === "dates" && o === "3_month") return `${e} ${t} from 3 Months Back`;
  if (n === "dates" && o === "6_month") return `${e} ${t} from 6 Months Back`;
  if (n === "dates" && o === "1_year") return `${e} ${t} from 1 Year Back`;
  if (n === "dates" && o === "all_reels") return `${e} ${t}`;
}
function remove_default_banner() {
  const e = document.querySelector('[data-e2e="user-post-item-list"]');
  if (e) {
    const t = e.parentElement;
    if (t) {
      const n = t.parentElement;
      if (n) {
        const o = Array.from(n.children);
        for (const r of o) {
          if (r === t) break;
          r.tagName.toLowerCase() === "div" && n.removeChild(r);
        }
      }
    }
  }
}
function tiktok_tiktoks(e) {
  return e === 1 ? "TikTok" : "TikToks";
}
function copyTikTokToClipboard(e) {
  if (!e || e.length === 0) return;
  const t = [
      "Profile",
      "TikTok",
      "Create Date",
      "Views",
      "Likes",
      "Shares",
      "Comments",
      "Saves",
      "Caption",
    ],
    n = e.map((r) => {
      const a = `https://www.tiktok.com/@${r.userName}/video/${r.code}`,
        i = r.createDate ? r.createDate.slice(0, 10) : "";
      return [
        r.userName,
        a,
        i,
        r.viewCount,
        r.likesCount,
        r.shareCount,
        r.commentsCount,
        r.savesCount,
        r.caption ?? "",
      ];
    }),
    o = [t, ...n].map((r) => r.join("	")).join(`
`);
  navigator.clipboard.writeText(o);
}
function getTikTokTheme() {
  return document.documentElement.getAttribute("data-tux-color-scheme") ===
    "dark"
    ? {
        isDark: !0,
        backgroundColor: "#0b1014",
        textColor: "#f2f3f5",
        bannerBorder: "rgba(255,255,255,0.08)",
        bannerShadow: "0 1px 3px rgba(0,0,0,0.3)",
        buttonBg: "transparent",
        buttonHoverBg: "rgba(255,255,255,0.06)",
        buttonText: "#f2f3f5",
        menuBg: "rgba(20, 24, 29, 0.98)",
        menuBorder: "rgba(255,255,255,0.10)",
        menuShadow: "0 12px 30px rgba(0,0,0,0.55)",
        menuItemHoverBg: "rgba(255,255,255,0.08)",
        menuText: "#f2f3f5",
        menuMutedText: "rgba(242,243,245,0.7)",
        copyIcon: "Icons/BannerIconNew/CopyIconNew.svg",
        exportIcon: "Icons/BannerIconNew/ExportIconNew.svg",
        checkIcon: "Icons/BannerIcons/whiteCheckBanner.png",
        buttonIconFilter: "brightness(0) invert(1) brightness(0.85)",
      }
    : {
        isDark: !1,
        backgroundColor: "white",
        textColor: "black",
        bannerBorder: "rgba(0,0,0,0.08)",
        bannerShadow: "0 1px 3px rgba(0,0,0,0.06)",
        buttonBg: "transparent",
        buttonHoverBg: "rgba(0,0,0,0.04)",
        buttonText: "#000",
        menuBg: "rgba(255,255,255,0.98)",
        menuBorder: "rgba(0,0,0,0.10)",
        menuShadow: "0 12px 30px rgba(0,0,0,0.12)",
        menuItemHoverBg: "rgba(0,0,0,0.04)",
        menuText: "#111",
        menuMutedText: "rgba(0,0,0,0.55)",
        copyIcon: "Icons/BannerIconNew/CopyIconNew.svg",
        exportIcon: "Icons/BannerIconNew/ExportIconNew.svg",
        checkIcon: "Icons/BannerIcons/blackCheckBanner.png",
        buttonIconFilter: "none",
      };
}
function _sfInjectSelectStylesTikTok() {
  if (document.getElementById("rr-select-anim-tk")) return;
  const e = document.createElement("style");
  ((e.id = "rr-select-anim-tk"),
    (e.textContent = `
    @keyframes rr-btn-in-tk {
      from { opacity: 0; transform: translateX(8px) scale(0.96); }
      to   { opacity: 1; transform: translateX(0)   scale(1);    }
    }
    @keyframes rr-btn-out-tk {
      from { opacity: 1; transform: translateX(0)    scale(1);    }
      to   { opacity: 0; transform: translateX(-8px) scale(0.96); }
    }
    .rr-btn-out-tk { animation: rr-btn-out-tk 100ms ease-in  forwards; }
    .rr-btn-in-tk  { animation: rr-btn-in-tk  140ms ease-out forwards; }

    @keyframes rr-row-in-tk {
      from { opacity: 0; transform: scale(0.97) translateY(2px); }
      to   { opacity: 1; transform: scale(1)    translateY(0);   }
    }
    .rr-row-in-tk { animation: rr-row-in-tk 140ms cubic-bezier(.2,.8,.2,1) forwards; }

    body.rr-tk-select-active [data-rr-custom-ui],
    body.rr-tk-select-active [data-rr-custom-ui] * {
      opacity: 0 !important;
      pointer-events: none !important;
    }

    .rr-menu, .rr-menu * { box-sizing: border-box; }
    .rr-menu {
      position: absolute;
      bottom: calc(100% + 8px);
      right: 0;
      min-width: 170px;
      padding: 6px;
      border-radius: 10px;
      opacity: 0;
      pointer-events: none;
      transform-origin: bottom right;
      transform: translateY(6px) scale(0.98);
      transition: opacity 120ms ease, transform 140ms cubic-bezier(.2,.8,.2,1);
      z-index: 2147483647;
    }
    .rr-menu.open {
      opacity: 1;
      transform: translateY(0) scale(1);
      pointer-events: auto;
    }
    .rr-menu-item {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: flex-start;
      gap: 10px;
      padding: 9px 10px;
      border-radius: 8px;
      cursor: pointer;
      user-select: none;
      font-size: 13px;
      font-weight: 500;
      line-height: 1;
      margin: 0;
    }
  `),
    document.head.appendChild(e));
}
let _sfSelectCounterTk = 0;
function _sfToggleCircleTikTok(e) {
  const t = e.querySelector("img");
  (e.dataset.sfSelected === "true"
    ? ((e.dataset.sfSelected = "false"),
      (e.dataset.sfSelectOrder = ""),
      (e.style.background = "transparent"),
      (e.style.borderColor = "rgba(255,255,255,0.9)"),
      t && (t.style.opacity = "0"))
    : ((e.dataset.sfSelected = "true"),
      (e.dataset.sfSelectOrder = ++_sfSelectCounterTk),
      (e.style.background = "white"),
      (e.style.borderColor = "white"),
      t && (t.style.opacity = "1")),
    _sfUpdateExportSelectedBtnTikTok());
}
function _sfUpdateExportSelectedBtnTikTok() {
  const e = document.getElementById("rr-export-selected-btn-tk");
  if (!e) return;
  const t = e.dataset.sfThemeDark === "1",
    n = e.dataset.sfIconFilter || "none",
    o = e.querySelector("span"),
    r = e.querySelector("img"),
    i = document.querySelectorAll(
      ".rr-select-circle-tk[data-rr-selected='true']",
    ).length;
  let c = document.getElementById("rr-select-count-badge-tk");
  i > 0
    ? ((e.style.pointerEvents = "auto"),
      (e.style.cursor = "pointer"),
      o && (o.style.color = ""),
      r && (r.style.filter = n),
      c ||
        ((c = document.createElement("span")),
        (c.id = "rr-select-count-badge-tk"),
        (c.style.cssText = `
        display: inline-flex;
        align-items: center;
        justify-content: center;
        background: #22d3ee;
        color: #021014;
        font-size: 0.68rem;
        font-weight: 500;
        border-radius: 100px;
        height: 18px;
        min-width: 18px;
        padding: 0 5px;
        line-height: 1;
        box-sizing: border-box;
      `),
        e.appendChild(c)),
      (c.textContent = i))
    : ((e.style.pointerEvents = "none"),
      (e.style.cursor = "default"),
      c && c.remove(),
      o && (o.style.color = t ? "rgba(242,243,245,0.25)" : "rgba(0,0,0,0.28)"),
      r &&
        (r.style.filter = t
          ? "brightness(0) invert(1) brightness(0.3)"
          : "brightness(0) opacity(0.22)"));
}
function _sfEnterItemSelectModeTikTok() {
  document.body.classList.add("rr-tk-select-active");
  const e = chrome.runtime.getURL("Icons/ButtonIcons/check.svg");
  document.querySelectorAll("[data-rr-sorted-item]").forEach((o) => {
    if (o.querySelector(".rr-select-circle-tk")) return;
    const a = o.querySelector('[data-e2e="user-post-item"]') || o,
      i = document.createElement("div");
    ((i.className = "rr-select-circle-tk"),
      (i.dataset.sfSelected = "false"),
      (i.dataset.sfAction = "true"),
      (i.style.cssText = `
      position: absolute;
      top: 8px; left: 8px;
      width: 22px; height: 22px;
      border-radius: 50%;
      border: 2px solid rgba(255,255,255,0.9);
      background: transparent;
      z-index: 10002;
      cursor: pointer;
      box-sizing: border-box;
      display: flex; align-items: center; justify-content: center;
      transition: background-color 0.12s ease, border-color 0.12s ease;
      box-shadow: 0 1px 4px rgba(0,0,0,0.35);
    `));
    const c = document.createElement("img");
    ((c.src = e),
      (c.style.cssText = `
      width: 10px; height: 10px;
      pointer-events: none;
      opacity: 0;
      filter: brightness(0);
      transition: opacity 0.1s ease;
    `),
      i.appendChild(c),
      a.appendChild(i));
  });
  const n = (o) => {
    const r = o.target.closest("[data-rr-sorted-item]");
    if (!r) return;
    (o.stopPropagation(), o.preventDefault());
    const a = r.querySelector(".rr-select-circle-tk");
    a && _sfToggleCircleTikTok(a);
  };
  ((document._sfSelectClickHandlerTk = n),
    document.addEventListener("click", n, !0));
}
function _sfExitItemSelectModeTikTok() {
  (document.body.classList.remove("rr-tk-select-active"),
    document
      .querySelectorAll(".rr-select-circle-tk")
      .forEach((e) => e.remove()),
    document._sfSelectClickHandlerTk &&
      (document.removeEventListener(
        "click",
        document._sfSelectClickHandlerTk,
        !0,
      ),
      delete document._sfSelectClickHandlerTk));
}
function enterSelectModeTikTok(e, t) {
  _sfInjectSelectStylesTikTok();
  const n = document.getElementById("rr-btn-row-tk"),
    o = document.getElementById("copy-native"),
    r = document.getElementById("export-native"),
    a = document.getElementById("select-native");
  if (!n) return;
  [o, r, a].forEach((u, _) => {
    u &&
      ((u.style.animationDelay = `${_ * 20}ms`),
      u.classList.add("rr-btn-out-tk"));
  });
  const i = e.isDark,
    c = i ? "transparent" : "white",
    s = i ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.04)",
    m = i ? "brightness(0) invert(1) brightness(0.85)" : "none",
    h = `
    background-color: ${c};
    color: ${i ? "rgba(242,243,245,0.85)" : "#1a1a1a"};
    display: flex;
    align-items: center;
    cursor: pointer;
    gap: 0.65rem;
    padding: 10px 16px;
    border-radius: 6px;
    border: 1px solid ${i ? "rgb(162 162 162 / 22%)" : "rgb(230, 230, 230)"};
    transition: background-color 0.15s ease;
    font-size: 0.82rem;
    font-weight: 500;
    line-height: 1;
    font-family: SF Pro Display, SF Pro Icons, Helvetica Neue, Helvetica, Arial, sans-serif;
    white-space: nowrap;
    user-select: none;
    position: relative;
    overflow: visible;
  `,
    d = document.createElement("div");
  ((d.id = "rr-export-selected-btn-tk"),
    (d.style.cssText = h),
    (d.dataset.sfThemeDark = i ? "1" : "0"),
    (d.dataset.sfIconFilter = m));
  const b = document.createElement("img");
  ((b.src = chrome.runtime.getURL("Icons/BannerIconNew/ExportIconNew.svg")),
    (b.style.cssText = "height: 0.85rem; width: auto; pointer-events: none;"));
  const f = document.createElement("span");
  ((f.textContent = "Export Selected"),
    d.appendChild(b),
    d.appendChild(f),
    (d.style.pointerEvents = "none"),
    (d.style.cursor = "default"),
    (f.style.color = i ? "rgba(242,243,245,0.25)" : "rgba(0,0,0,0.28)"),
    (b.style.filter = i
      ? "brightness(0) invert(1) brightness(0.3)"
      : "brightness(0) opacity(0.22)"));
  const p = document.createElement("div");
  ((p.className = "rr-menu"),
    (p.style.background = e.menuBg),
    (p.style.border = `1px solid ${e.menuBorder}`),
    (p.style.boxShadow = e.menuShadow),
    (p.style.color = e.menuText),
    (p.style.fontFamily =
      "SF Pro Display, SF Pro Icons, Helvetica Neue, Helvetica, Arial, sans-serif"),
    (p.style.overflow = "hidden"),
    (p.style.borderRadius = "12px"),
    (p.style.padding = "6px"),
    (p.style.zIndex = "2147483647"));
  const k = () => p.classList.contains("open"),
    g = () => p.classList.add("open"),
    l = () => p.classList.remove("open"),
    y = (u, _) => {
      const x = document.createElement("div");
      ((x.className = "rr-menu-item"),
        (x.style.color = e.menuText),
        (x.textContent = u));
      return (
        x.addEventListener("mouseenter", () => {
          x.style.background = e.menuItemHoverBg;
        }),
        x.addEventListener("mouseleave", () => {
          x.style.background = "transparent";
        }),
        x.addEventListener("click", (T) => {
          (T.stopPropagation(),
            chrome.runtime.sendMessage({ command: "checkProStatus" }, (S) => {
              if (S?.isPro) {
                const L = Array.from(
                    document.querySelectorAll(
                      ".rr-select-circle-tk[data-rr-selected='true']",
                    ),
                  ).sort(
                    (M, B) =>
                      Number(M.dataset.sfSelectOrder) -
                      Number(B.dataset.sfSelectOrder),
                  ),
                  C = [];
                (L.forEach((M) => {
                  const B = M.closest("[data-rr-sorted-item]");
                  if (!(!B || !B.dataset.sfItemJson))
                    try {
                      C.push(JSON.parse(B.dataset.sfItemJson));
                    } catch {}
                }),
                  startSelectMissionTikTok(C, _),
                  l());
              } else {
                const L = document.querySelectorAll(
                  ".rr-select-circle-tk[data-rr-selected='true']",
                ).length;
                (l(),
                  typeof upgradeProBanner == "function" && upgradeProBanner());
                const C = document.querySelector(".sort-banner .message");
                C &&
                  (C.innerHTML = `${L} TikTok${L !== 1 ? "s" : ""} selected \u2014 export available with Pro`);
              }
            }));
        }),
        x
      );
    };
  (p.appendChild(y("Excel", "excel")),
    p.appendChild(y("CSV", "csv")),
    p.appendChild(y("JSON", "json")),
    d.appendChild(p),
    d.addEventListener("mouseover", () => {
      d.style.pointerEvents !== "none" && (d.style.backgroundColor = s);
    }),
    d.addEventListener("mouseout", () => {
      d.style.backgroundColor = c;
    }),
    d.addEventListener("click", (u) => {
      d.style.pointerEvents !== "none" &&
        (u.stopPropagation(), k() ? l() : g());
    }));
  const E = (u) => {
      d.contains(u.target) || l();
    },
    I = (u) => {
      u.key === "Escape" && l();
    };
  (document.addEventListener("click", E),
    document.addEventListener("keydown", I),
    (d._sf_cleanup_tk = () => {
      (document.removeEventListener("click", E),
        document.removeEventListener("keydown", I));
    }));
  const v = document.createElement("div");
  ((v.id = "rr-select-close-btn-tk"),
    (v.style.cssText = `
    background-color: ${c};
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; padding: 10px; border-radius: 6px;
    border: 1px solid ${i ? "rgb(162 162 162 / 22%)" : "rgb(230, 230, 230)"};
    transition: background-color 0.15s ease;
  `));
  const w = document.createElement("img");
  ((w.src = chrome.runtime.getURL("Icons/BannerIconNew/CloseIconNew.svg")),
    (w.style.cssText = `height: 0.6rem; width: 0.6rem; object-fit: contain; pointer-events: none; filter: ${m};`),
    v.appendChild(w),
    v.addEventListener("mouseover", () => {
      v.style.backgroundColor = s;
    }),
    v.addEventListener("mouseout", () => {
      v.style.backgroundColor = c;
    }),
    v.addEventListener("click", () => exitSelectModeTikTok(e, t)),
    setTimeout(() => {
      ([o, r, a].forEach((u) => {
        u &&
          (u.classList.remove("rr-btn-out-tk"),
          (u.style.animationDelay = ""),
          (u.style.display = "none"));
      }),
        d.classList.add("rr-btn-in-tk"),
        v.classList.add("rr-btn-in-tk"),
        (v.style.animationDelay = "30ms"),
        n.appendChild(d),
        n.appendChild(v),
        _sfEnterItemSelectModeTikTok());
    }, 120));
}
function exitSelectModeTikTok(e, t) {
  const n = document.getElementById("rr-export-selected-btn-tk"),
    o = document.getElementById("rr-select-close-btn-tk");
  (n?._sf_cleanup_tk && n._sf_cleanup_tk(),
    _sfExitItemSelectModeTikTok(),
    [n, o].forEach((r, a) => {
      r &&
        ((r.style.animationDelay = `${a * 20}ms`),
        r.classList.add("rr-btn-out-tk"));
    }),
    setTimeout(() => {
      (n && n.remove(), o && o.remove());
      const r = document.getElementById("rr-btn-row-tk"),
        a = document.getElementById("copy-native"),
        i = document.getElementById("export-native"),
        c = document.getElementById("select-native");
      ([a, i, c].forEach((s) => {
        s &&
          ((s.style.display = "flex"),
          (s.style.animationDelay = ""),
          s.classList.remove("rr-btn-in-tk"));
      }),
        r &&
          (r.classList.add("rr-row-in-tk"),
          r.addEventListener(
            "animationend",
            () => {
              r.classList.remove("rr-row-in-tk");
            },
            { once: !0 },
          )));
    }, 120));
}
function export_button_on_banner_tiktok(e, t) {
  const n = document.getElementById("export-native");
  if (!n) return;
  if (
    (n._sf_cleanup_tiktok && n._sf_cleanup_tiktok(),
    !document.getElementById("rr-export-menu-styles-tiktok"))
  ) {
    const f = document.createElement("style");
    ((f.id = "rr-export-menu-styles-tiktok"),
      (f.textContent = `
      .rr-menu, .rr-menu * { box-sizing: border-box; }

      .rr-menu {
        position: absolute;
        bottom: calc(100% + 8px);   /* \u2705 above the button */
        right: 0;

        min-width: 170px;
        padding: 6px;
        border-radius: 10px;

        opacity: 0;
        pointer-events: none;

        transform-origin: bottom right;
        transform: translateY(6px) scale(0.98);

        transition:
          opacity 120ms ease,
          transform 140ms cubic-bezier(.2,.8,.2,1);

        z-index: 2147483647;
      }

      .rr-menu.open {
        opacity: 1;
        transform: translateY(0) scale(1);
        pointer-events: auto;
      }

      .rr-menu-item {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: flex-start;
        gap: 10px;
        padding: 9px 10px;
        border-radius: 8px;
        cursor: pointer;
        user-select: none;
        font-size: 13px;
        font-weight: 500;
        line-height: 1;
        margin: 0;
      }

      /* \u2705 hide tooltip while menu is open */
      #export-native.rr-menu-open .tooltip {
        opacity: 0 !important;
        pointer-events: none !important;
      }
    `),
      document.head.appendChild(f));
  }
  const o = n.querySelector(".rr-menu");
  o && o.remove();
  const r = document.createElement("div");
  ((r.className = "rr-menu"),
    (r.style.background = e.menuBg),
    (r.style.border = `1px solid ${e.menuBorder}`),
    (r.style.boxShadow = e.menuShadow),
    (r.style.color = e.menuText),
    (r.style.fontFamily =
      "SF Pro Display, SF Pro Icons, Helvetica Neue, Helvetica, Arial, sans-serif"),
    (r.style.overflow = "hidden"),
    (r.style.borderRadius = "12px"),
    (r.style.padding = "6px"),
    (r.style.zIndex = "2147483647"));
  const a = () => {
      const f = n.querySelector(".tooltip");
      f && (f.style.opacity = "0");
    },
    i = (f, p) => {
      const k = document.createElement("div");
      ((k.className = "rr-menu-item"), (k.textContent = f));
      return (
        k.addEventListener("mouseenter", () => {
          k.style.background = e.menuItemHoverBg;
        }),
        k.addEventListener("mouseleave", () => {
          k.style.background = "transparent";
        }),
        k.addEventListener("click", (g) => {
          (g.stopPropagation(),
            chrome.runtime.sendMessage({
              export_click_tiktok: !0,
              export_format: p,
              sorted_data: t,
            }),
            m());
        }),
        k
      );
    };
  (r.appendChild(i("Excel", "excel")),
    r.appendChild(i("CSV", "csv")),
    r.appendChild(i("JSON", "json")),
    n.appendChild(r));
  const c = () => r.classList.contains("open"),
    s = () => {
      (n.classList.add("rr-menu-open"), r.classList.add("open"), a());
    },
    m = () => {
      (n.classList.remove("rr-menu-open"), r.classList.remove("open"));
    },
    h = () => (c() ? m() : s());
  n._sf_clickBound_tiktok ||
    ((n._sf_clickBound_tiktok = !0),
    n.addEventListener("click", (f) => {
      (f.stopPropagation(), h());
    }));
  const d = (f) => {
    n.contains(f.target) || m();
  };
  document.addEventListener("click", d);
  const b = (f) => {
    f.key === "Escape" && m();
  };
  (document.addEventListener("keydown", b),
    (n._sf_cleanup_tiktok = () => {
      (document.removeEventListener("click", d),
        document.removeEventListener("keydown", b));
    }));
}
function add_banner(e, t, n, o, r) {
  const a = tiktok_tiktoks(t),
    i = handle_header(n, a),
    c = handle_sub_header(t, a, o, r),
    s = getTikTokTheme(),
    h = document.querySelector(
      '[data-e2e="user-post-item-list"]',
    )?.parentElement,
    d = document.createElement("div");
  ((d.id = "banner_most_viewed_reels"),
    (d.style = `
    display: flex;
    align-items: center;
    background-color: ${s.backgroundColor};
    color: ${s.textColor};
    padding: 20px 40px;
    justify-content: space-between;
    margin-bottom: 1em;
    border: 1px solid ${s.bannerBorder};
    box-shadow: ${s.bannerShadow};
    border-top-left-radius: 12px;
    border-top-right-radius: 12px;
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;

  position: relative;     /* \u2705 anchor for absolute dropdown */
  overflow: visible;      /* \u2705 let menu spill */
  z-index: 1;             /* \u2705 don't compete with TikTok nav */
  `),
    (d.className = "animate__animated animate__bounce"),
    h.insertBefore(d, h.firstChild),
    remove_default_banner(),
    (d.innerHTML = `
    <div class="text_section" style="display: flex; flex-direction: row; width: 100%; justify-content: space-between;">
      <div class="metrics_section">
        <div id="reels_number_section" style="display: flex; flex-direction: row; margin-bottom: -2px; align-items: center;">
          <h2 style="color: ${s.textColor}; margin: 0; font-size: 0.8rem; line-height: 1.1667; font-weight: 500; letter-spacing: 0.02em; font-family: SF Pro Display, SF Pro Icons, Helvetica Neue, Helvetica, Arial, sans-serif;">
            ${c}
          </h2>
        </div>
        <h1 style="color: ${s.textColor}; margin: 0; font-size: 1.6rem; line-height: 1.1667; font-weight: 600; letter-spacing: -0.01em; font-family: SF Pro Display, SF Pro Icons, Helvetica Neue, Helvetica, Arial, sans-serif;">
          ${i}
        </h1>
      </div>

      <div class="button_section" style="display: flex; flex-direction: column; justify-content: center;">
        <div id="rr-btn-row-tk" style="display: flex; flex-direction: row; gap: 0.4rem; align-items: stretch;">

          <!-- Copy Button -->
          <div id="copy-native" style="
            background-color: ${s.isDark ? "transparent" : "white"};
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            position: relative;
            padding: 10px;
            border-radius: 6px;
            border: 1px solid ${s.isDark ? "rgb(162 162 162 / 22%)" : "rgb(230, 230, 230)"};
            transition: background-color 0.15s ease;
          ">
            <img src="${chrome.runtime.getURL(s.copyIcon)}" style="
              height: 0.95rem;
              width: auto;
              pointer-events: none;
              filter: ${s.buttonIconFilter};
            "/>
            <div class="tooltip" style="
              position: absolute;
              bottom: calc(100% + 6px);
              left: 50%;
              transform: translateX(-50%) translateY(4px);
              background-color: rgba(0, 0, 0, 0.85);
              color: white;
              padding: 4px 8px;
              border-radius: 4px;
              font-size: 0.75rem;
              font-weight: 500;
              white-space: nowrap;
              pointer-events: none;
              opacity: 0;
              transition: all 0.2s ease;
              font-family: SF Pro Display, SF Pro Icons, Helvetica Neue, Helvetica, Arial, sans-serif;
              z-index: 1000;
            ">Copy results</div>
          </div>

          <!-- Export Button (popup menu injected in JS) -->
          <div id="export-native" style="
            background-color: ${s.isDark ? "transparent" : "white"};
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            position: relative;
            padding: 10px;
            border-radius: 6px;
            border: 1px solid ${s.isDark ? "rgb(162 162 162 / 22%)" : "rgb(230, 230, 230)"};
            transition: background-color 0.15s ease;
          ">
            <img src="${chrome.runtime.getURL(s.exportIcon)}" style="
              height: 0.95rem;
              width: auto;
              pointer-events: none;
              filter: ${s.buttonIconFilter};
            "/>
            <div class="tooltip" style="
              position: absolute;
              bottom: calc(100% + 6px);
              left: 50%;
              transform: translateX(-50%) translateY(4px);
              background-color: rgba(0, 0, 0, 0.85);
              color: white;
              padding: 4px 8px;
              border-radius: 4px;
              font-size: 0.75rem;
              font-weight: 500;
              white-space: nowrap;
              pointer-events: none;
              opacity: 0;
              transition: all 0.2s ease;
              font-family: SF Pro Display, SF Pro Icons, Helvetica Neue, Helvetica, Arial, sans-serif;
              z-index: 1000;
            ">Export</div>
          </div>

          <!-- Select Button -->
          <div id="select-native" style="
            background-color: ${s.isDark ? "transparent" : "white"};
            color: ${s.isDark ? "rgba(242,243,245,0.85)" : "#1a1a1a"};
            display: flex;
            align-items: center;
            cursor: pointer;
            position: relative;
            padding: 10px 16px;
            border-radius: 6px;
            border: 1px solid ${s.isDark ? "rgb(162 162 162 / 22%)" : "rgb(230, 230, 230)"};
            transition: background-color 0.15s ease;
            font-size: 0.82rem;
            font-weight: 500;
            font-family: SF Pro Display, SF Pro Icons, Helvetica Neue, Helvetica, Arial, sans-serif;
            white-space: nowrap;
            user-select: none;
            gap: 0.4rem;
          ">Select<span style="
            font-size: 0.58rem;
            font-weight: 500;
            background: ${s.isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.06)"};
            color: ${s.isDark ? "rgba(242,243,245,0.5)" : "rgba(0,0,0,0.38)"};
            padding: 2px 5px;
            border-radius: 4px;
            letter-spacing: 0.03em;
            margin-left: 6px;
            font-family: SF Pro Display, SF Pro Icons, Helvetica Neue, Helvetica, Arial, sans-serif;
          ">New</span></div>

        </div>
      </div>
    </div>
  `));
  const b = document.getElementById("reels_number_section"),
    f = document.createElement("img");
  (setFeedBadgeIconTikTok(f),
    (f.style = `
    width: auto;
    margin-right: 0.2rem;
    height: 0.7rem;
  `),
    b.insertBefore(f, b.firstChild));
  const p = document.getElementById("export-native"),
    k = p.querySelector(".tooltip");
  (p.addEventListener("mouseover", () => {
    ((p.style.backgroundColor = s.buttonHoverBg),
      (k.style.opacity = "1"),
      (k.style.transform = "translateX(-50%) translateY(0)"));
  }),
    p.addEventListener("mouseout", () => {
      ((p.style.backgroundColor = s.buttonBg),
        (k.style.opacity = "0"),
        (k.style.transform = "translateX(-50%) translateY(4px)"));
    }));
  const g = document.getElementById("copy-native"),
    l = g.querySelector(".tooltip");
  (g.addEventListener("mouseover", () => {
    p.classList.contains("rr-menu-open") ||
      ((g.style.backgroundColor = s.buttonHoverBg),
      (l.style.opacity = "1"),
      (l.style.transform = "translateX(-50%) translateY(0)"));
  }),
    g.addEventListener("mouseout", () => {
      ((g.style.backgroundColor = s.buttonBg),
        (l.style.opacity = "0"),
        (l.style.transform = "translateX(-50%) translateY(4px)"));
    }));
  const y = document.getElementById("select-native"),
    E = s.isDark ? "transparent" : "white",
    I = s.isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.04)";
  (y.addEventListener("mouseover", () => {
    y.style.backgroundColor = I;
  }),
    y.addEventListener("mouseout", () => {
      y.style.backgroundColor = E;
    }),
    y.addEventListener("click", () => {
      enterSelectModeTikTok(s, e);
    }),
    export_button_on_banner_tiktok(s, e),
    g.addEventListener("click", () => {
      copyTikTokToClipboard(e);
      const v = g.querySelector(".tooltip"),
        w = g.querySelector("img"),
        u = v.textContent,
        _ = w.src;
      ((v.textContent = "Copied results"),
        (w.src = chrome.runtime.getURL(s.checkIcon)),
        (w.style.height = "0.95rem"),
        (w.style.width = "auto"),
        (w.style.transition = "none"),
        (w.style.opacity = "0"),
        (w.style.transform = "scale(0.5)"),
        requestAnimationFrame(() => {
          ((w.style.transition =
            "opacity 0.18s ease, transform 0.22s cubic-bezier(0.34, 1.56, 0.64, 1)"),
            (w.style.opacity = "1"),
            (w.style.transform = "scale(1)"));
        }),
        setTimeout(() => {
          ((w.style.transition = "opacity 0.15s ease, transform 0.15s ease"),
            (w.style.opacity = "0"),
            (w.style.transform = "scale(0.7)"),
            setTimeout(() => {
              ((v.textContent = u),
                (w.src = _),
                (w.style.transition = "none"),
                (w.style.opacity = "1"),
                (w.style.transform = "scale(1)"));
            }, 150));
        }, 1350));
    }));
}
function remove_unneeded_elements() {
  const e = document.querySelector('div[data-e2e="user-post-item-list"]');
  e &&
    (e.setAttribute("data-rr-soft-hidden", "true"),
    (e.style.opacity = "0"),
    (e.style.pointerEvents = "none"),
    (e.style.height = "0"),
    (e.style.minHeight = "0"),
    (e.style.margin = "0"),
    (e.style.padding = "0"),
    (e.style.overflow = "hidden"));
  const t = document.getElementById("export-btn-sort-reels");
  t &&
    ((t.style.display = "none"), t.setAttribute("data-rr-soft-hidden", "true"));
}
function add_overlay() {
  const e = document.getElementsByTagName("body")[0];
  let t = document.createElement("div");
  ((t.id = "overlay_sort_reels"),
    t.setAttribute(
      "style",
      `
      position: fixed;
      display: block;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      background-color: rgba(34, 211, 238, 0.18);
      z-index: 9999; /* make sure it\u2019s above everything */
      cursor: pointer;
    `,
    ),
    e.appendChild(t));
}
(window.addEventListener("message", (e) => {
  if (e.source === window) {
    if (e.data.logo_animate_off_tiktok) {
      let t = e.data.payload;
      add_sorted_items_tiktok(t).then(() => {
        let n = t.length,
          o = sessionStorage.getItem("sortFeedSortBy"),
          r = sessionStorage.getItem("sortFeedPostsVSReels"),
          a = sessionStorage.getItem("sortItemsVsDates"),
          i = sessionStorage.getItem("sortFeedNoItems");
        (window.scrollTo({ top: 0, behavior: "smooth" }),
          add_banner(t, n, o, a, i),
          remove_items_local_storage_tiktok(),
          chrome.runtime.sendMessage({ logo_animate_off: !0 }));
      });
    } else if (e.data.logo_animate_off_zero_tiktok_time_period) {
      let t = null,
        n = sessionStorage.getItem("sortFeedSortBy"),
        o = 0,
        r = sessionStorage.getItem("sortItemsVsDates"),
        a = sessionStorage.getItem("sortFeedNoItems");
      (window.scrollTo({ top: 0, behavior: "smooth" }),
        add_banner(t, o, n, r, a),
        remove_unneeded_elements(),
        remove_items_local_storage_tiktok(),
        chrome.runtime.sendMessage({ logo_animate_off: !0 }));
    } else if (e.data.overlay_on)
      (add_overlay(), chrome.runtime.sendMessage({ logo_animate_on: !0 }));
    else if (e.data.item_collected_no) {
      let t = e.data.number_items;
      chrome.runtime.sendMessage({ item_collected_no: !0, number_items: t });
    }
  }
}),
  window.addEventListener("load", function () {
    sessionStorage.getItem("sortFeedStatusTikTok") &&
      (add_overlay(), chrome.runtime.sendMessage({ logo_animate_on: !0 }));
  }));
function _sfGetBannerStackTikTok() {
  let e = document.getElementById("rr-banner-stack-tk");
  return (
    e ||
      ((e = document.createElement("div")),
      (e.id = "rr-banner-stack-tk"),
      (e.style.cssText = [
        "position:fixed",
        "top:15%",
        "left:50%",
        "transform:translateX(-50%)",
        "display:flex",
        "flex-direction:column",
        "gap:8px",
        "width:90%",
        "max-width:600px",
        "z-index:9999",
      ].join(";")),
      document.body.appendChild(e)),
    e
  );
}
window.addEventListener("message", (e) => {
  if (e.data.insta_banner_notification) {
    let t = e.data.count;
    injectSortFeedBanner(t);
  }
});
function injectSortFeedBanner(e = 25) {
  if (sessionStorage.getItem("sortFeedStopSorting") === "on") return;
  const n = document.querySelector(".sort-banner");
  if (n) {
    const r = n.querySelector(".message");
    r && (r.innerHTML = `${e} TikToks sorted - don't scroll yet`);
    return;
  }
  if (!document.getElementById("rr-tk-sort-banner-style")) {
    const r = document.createElement("style");
    ((r.id = "rr-tk-sort-banner-style"),
      (r.textContent = `
    @keyframes slideBounceDown {
      0%   { transform: translateY(-120%); opacity: 0; }
      60%  { transform: translateY(10px);  opacity: 1; }
      80%  { transform: translateY(-5px); }
      100% { transform: translateY(0); }
    }
    @keyframes slideBounceUp {
      0%   { transform: translateY(0);     opacity: 1; }
      20%  { transform: translateY(-10px); }
      100% { transform: translateY(-120%); opacity: 0; }
    }
    @keyframes bounceLogo {
      0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
      40% { transform: translateY(-20px); }
      60% { transform: translateY(-10px); }
    }
    .sort-banner .icon {
      padding: 4px;
      width: 18px !important;
      height: 18px !important;
      min-width: 18px;
      flex-shrink: 0;
      object-fit: contain;
      margin-right: 8px;
      animation: bounceLogo 1s infinite;
    }
    .sort-banner {
      width: 100%; box-sizing: border-box;
      background: #ffffff; padding: 12px 16px; display: flex; align-items: center;
      animation: slideBounceDown 0.25s ease;
      border: 1px solid rgba(0, 0, 0, 0.15); border-radius: 0.75rem;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
    }
    .sort-banner .stop-btn:hover { background: #e5e7eb; }
    .sort-banner .message {
      font-size: 16px; color: #000; flex-grow: 1; font-weight: 400;
      font-family: SF Pro Display, SF Pro Icons, Helvetica Neue, Helvetica, Arial, sans-serif;
    }
    .sort-banner .stop-btn {
      font-size: 15px; color: #000; background: #f3f4f6; border: none;
      border-radius: 8px; cursor: pointer; font-weight: 400; padding: 8px 14px;
      font-family: SF Pro Display, SF Pro Icons, Helvetica Neue, Helvetica, Arial, sans-serif;
      display: inline-flex; align-items: center; gap: 8px;
    }
    .sort-banner .stop-btn img {
      width: 10px; height: 10px; display: block;
      background: rgba(0,0,0,0.85); border-radius: 2px;
    }
    @media (max-width: 400px) {
      .sort-banner { padding: 10px 12px; }
      .sort-banner .message, .sort-banner .stop-btn { font-size: 14px; }
    }
  `),
      document.head.appendChild(r));
  }
  const o = document.createElement("div");
  ((o.className = "sort-banner"),
    (o.innerHTML = `
    <img class="icon" src="${chrome.runtime.getURL("Icons/reelradar-logo.svg")}" alt="" onerror="this.style.display='none'" />
    <div class="message">${e} TikToks sorted - don't scroll yet</div>
    <button class="stop-btn">
      <img src="${chrome.runtime.getURL("Icons/StopIcon.png")}" alt="">
      <span>Stop Sorting</span>
    </button>
  `),
    o.querySelector(".stop-btn").addEventListener("click", () => {
      sessionStorage.setItem("sortFeedStopSorting", "on");
    }),
    _sfGetBannerStackTikTok().appendChild(o));
}
function removeSortFeedBanner() {
  const e = document.querySelector(".sort-banner");
  e &&
    ((e.style.animation = "slideBounceUp 0.25s ease forwards"),
    setTimeout(() => e.remove(), 250));
}
window.addEventListener("message", (e) => {
  e.data.insta_banner_notification_remove && removeSortFeedBanner();
});
function csvEscape(e) {
  const t = e == null ? "" : String(e);
  return t.includes(",") ||
    t.includes('"') ||
    t.includes(`
`)
    ? '"' + t.replace(/"/g, '""') + '"'
    : t;
}
function exportTikTokToCSV(e) {
  if (!e || e.length === 0) return;
  const t = [
      "Profile",
      "TikTok",
      "Create Date",
      "Views",
      "Likes",
      "Shares",
      "Comments",
      "Saves",
      "Caption",
    ];
  const o = e[0].userName,
    n = e.map((s) => {
      const m = `https://www.tiktok.com/@${s.userName}/video/${s.code}`,
        h = s.createDate ? s.createDate.slice(0, 10) : "",
        d = [
          csvEscape(s.userName),
          csvEscape(m),
          h,
          s.viewCount,
          s.likesCount,
          s.shareCount,
          s.commentsCount,
          s.savesCount,
          csvEscape(s.caption),
        ];
      return d;
    }),
    r = [t, ...n].map((s) => s.join(",")).join(`
`),
    a = new Blob([r], { type: "text/csv;charset=utf-8;" }),
    c = document.createElement("a");
  if (c.download !== void 0) {
    const s = URL.createObjectURL(a);
    (c.setAttribute("href", s),
      c.setAttribute("download", `${o}_${e.length}_tiktok.csv`),
      (c.style.visibility = "hidden"),
      document.body.appendChild(c),
      c.click(),
      document.body.removeChild(c));
  }
}
chrome.runtime.onMessage.addListener((e, t, n) => {
  if (e.export_click_background_tiktok && e.export_format === "csv") {
    let o = e.sorted_data;
    exportTikTokToCSV(o);
  }
});
function exportTikTokToJSON(e) {
  if (!e || e.length === 0) return;
  const t = e[0].userName,
    n = e.map((i) => {
      const c = `https://www.tiktok.com/@${i.userName}/video/${i.code}`,
        s = new Date(i.createDate).toLocaleString("en-US", {
          year: "numeric",
          month: "numeric",
          day: "numeric",
          hour: "numeric",
          minute: "2-digit",
          second: "2-digit",
          hour12: !0,
        }),
        m = {
          Profile: i.userName,
          TikTok: c,
          "Create Date": s,
          Views: i.viewCount,
          Likes: i.likesCount,
          Shares: i.shareCount,
          Comments: i.commentsCount,
          Saves: i.savesCount,
          Captions: i.caption,
        };
      return m;
    }),
    o = JSON.stringify(n, null, 2),
    r = new Blob([o], { type: "application/json" }),
    a = document.createElement("a");
  if (a.download !== void 0) {
    const i = URL.createObjectURL(r);
    (a.setAttribute("href", i),
      a.setAttribute("download", `${t}_${e.length}_tiktok.json`),
      (a.style.visibility = "hidden"),
      document.body.appendChild(a),
      a.click(),
      document.body.removeChild(a));
  }
}
chrome.runtime.onMessage.addListener((e, t, n) => {
  e.export_click_background_tiktok &&
    e.export_format === "json" &&
    exportTikTokToJSON(e.sorted_data);
});
function exportTikTokToExcel(e) {
  if (!e || e.length === 0) return;
  const t = e[0].userName,
    n = "TikTok",
    o = [
      "Profile",
      "TikTok",
      "Create Date",
      "Views",
      "Likes",
      "Shares",
      "Comments",
      "Saves",
      "Captions",
    ];
  const r = e.map((h) => {
      const d = `https://www.tiktok.com/@${h.userName}/video/${h.code}`,
        b = new Date(h.createDate).toLocaleString("en-US", {
          year: "numeric",
          month: "numeric",
          day: "numeric",
          hour: "numeric",
          minute: "2-digit",
          second: "2-digit",
          hour12: !0,
        }),
        f = [
          h.userName,
          d,
          b,
          h.viewCount,
          h.likesCount,
          h.shareCount,
          h.commentsCount,
          h.savesCount,
          h.caption,
        ];
      return f;
    }),
    a = [o, ...r],
    i = XLSX.utils.aoa_to_sheet(a),
    s = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(s, i, n);
  const m = `${t}_${e.length}_tiktok.xlsx`;
  XLSX.writeFile(s, m);
}
(chrome.runtime.onMessage.addListener((e, t, n) => {
  e.export_click_background_tiktok &&
    e.export_format === "excel" &&
    exportTikTokToExcel(e.sorted_data);
}),
  window.addEventListener("message", (e) => {
    const t = e.data;
    if (t && t.download && t.download_item === "tiktok") {
      if (document.querySelector(".download-reel-banner")) return;
      (showDownloadBanner(t.iconUrl),
        download_tiktok_video(
          t.download_video_id,
          t.download_profile_name,
          t.photoFlag,
        ));
    }
  }));
async function download_tiktok_video(e, t, n) {
  const o = await downloadTikTok({ profile: t, videoId: e, photoFlag: n });
}
async function downloadTikTok({ profile: e, videoId: t, photoFlag: n }) {
  try {
    const o = `https://www.tiktok.com/@${e}/video/${t}`,
      a = (
        await fetch(o, {
          credentials: "include",
          mode: "cors",
          referrer: "https://www.tiktok.com/",
        }).then((v) => {
          if (!v.ok) throw new Error(`Detail page HTTP ${v.status}`);
          return v.text();
        })
      ).match(
        /<script id="__UNIVERSAL_DATA_FOR_REHYDRATION__" type="application\/json">([^<]+)<\/script>/,
      );
    if (!a) throw new Error("Could not find embedded JSON");
    const i = JSON.parse(a[1]),
      c = i?.__DEFAULT_SCOPE__?.["webapp.video-detail"]?.itemInfo?.itemStruct,
      s = i?.__DEFAULT_SCOPE__?.["webapp.video-detail"]?.ItemModule,
      m = c || (s && (s[t] || Object.values(s)[0]));
    if (!m) throw new Error("No itemStruct found");
    if (n) {
      const v = m.imagePost?.images;
      if (!v?.length) throw new Error("No images found in photo post");
      const w = v.length,
        u = [];
      for (let _ = 0; _ < w; _++) {
        const x = v[_].imageURL?.urlList?.[0];
        if (!x) continue;
        const T = Math.round((_ / w) * 100),
          S = Math.round(((_ + 1) / w) * 100),
          L = await fetch(x, {
            mode: "cors",
            referrer: "https://www.tiktok.com/",
          });
        if (!L.ok) continue;
        const C = L.headers.get("content-length"),
          M = C ? parseInt(C, 10) : 0;
        let B = 0,
          U = T;
        const D = S - 2,
          N = setInterval(() => {
            U < D && (U++, updateBannerProgress(U));
          }, 40),
          F = L.body.getReader(),
          A = [];
        for (;;) {
          const { done: R, value: $ } = await F.read();
          if (R) break;
          if ((A.push($), (B += $.length), M > 0)) {
            const H = Math.round((B / M) * 100);
            ((U = T + Math.round((H / 100) * (S - T))),
              updateBannerProgress(Math.min(U, S - 1)));
          }
        }
        (clearInterval(N), (U = S), updateBannerProgress(Math.min(U, 99)));
        const P = new Blob(A, { type: "image/jpeg" });
        u.push({ name: `${e}_${t}_${_ + 1}.jpeg`, blob: P });
      }
      if (u.length > 0) {
        const _ = await buildZipTk(u),
          x = document.createElement("a");
        ((x.href = URL.createObjectURL(_)),
          (x.download = `${e}_${t}.zip`),
          document.body.appendChild(x),
          x.click(),
          URL.revokeObjectURL(x.href),
          x.remove());
      }
      return (hideDownloadBanner(), !0);
    }
    if (!m.video) throw new Error("No itemStruct.video found");
    const h = m.video.bitrateInfo,
      b =
        (Array.isArray(h) &&
          h.length > 0 &&
          (h[0].PlayAddr?.UrlList?.[0] || h[0].PlayAddr)) ||
        m.video.playAddr ||
        m.video.downloadAddr;
    if (!b) throw new Error("No playable URL found");
    const f = await fetch(b, {
      mode: "cors",
      credentials: "include",
      referrer: "https://www.tiktok.com/",
    });
    if (!f.ok) throw new Error(`CDN HTTP ${f.status}`);
    const p = f.headers.get("content-length"),
      k = p ? parseInt(p, 10) : 0;
    let g = 0;
    const l = f.body.getReader(),
      y = [];
    for (;;) {
      const { done: v, value: w } = await l.read();
      if (v) break;
      (y.push(w),
        (g += w.length),
        k > 0 && updateBannerProgress(Math.round((g / k) * 100)));
    }
    const E = new Blob(y, { type: "video/mp4" }),
      I = document.createElement("a");
    return (
      (I.href = URL.createObjectURL(E)),
      (I.download = `${e}_${t}.mp4`),
      document.body.appendChild(I),
      I.click(),
      URL.revokeObjectURL(I.href),
      I.remove(),
      hideDownloadBanner(),
      !0
    );
  } catch (o) {
    return (
      console.error("\u274C Download error:", o.message),
      hideDownloadBanner(),
      !1
    );
  }
}
function showDownloadBanner(e) {
  if (!document.getElementById("rr-tk-dl-banner-style")) {
    const n = document.createElement("style");
    ((n.id = "rr-tk-dl-banner-style"),
      (n.textContent = `
    @keyframes slideBounceDown {
      0%   { transform: translateY(-120%); opacity: 0; }
      60%  { transform: translateY(10px);  opacity: 1; }
      80%  { transform: translateY(-5px); }
      100% { transform: translateY(0); }
    }
    @keyframes slideBounceUp {
      0%   { transform: translateY(0);     opacity: 1; }
      20%  { transform: translateY(-10px); }
      100% { transform: translateY(-120%); opacity: 0; }
    }
    @keyframes bounceLogo {
      0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
      40% { transform: translateY(-20px); }
      60% { transform: translateY(-10px); }
    }
    .download-reel-banner .icon {
      padding: 4px;
      width: 18px !important;
      height: 18px !important;
      min-width: 18px;
      flex-shrink: 0;
      object-fit: contain;
      margin-right: 8px;
      animation: bounceLogo 1s infinite;
    }
    .download-reel-banner {
      width: 100%; box-sizing: border-box;
      background: #ffffff; padding: 12px 16px; display: flex; align-items: center;
      animation: slideBounceDown 0.25s ease;
      border: 1px solid rgba(0, 0, 0, 0.15); border-radius: 0.75rem;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
    }
    .download-reel-banner .message {
      font-size: 16px; font-weight: 400; color: #000; flex-grow: 1;
      font-family: SF Pro Display, SF Pro Icons, Helvetica Neue, Helvetica, Arial, sans-serif;
    }
    @media (max-width: 400px) {
      .download-reel-banner { padding: 10px 12px; }
      .download-reel-banner .message { font-size: 14px; }
    }
  `),
      document.head.appendChild(n));
  }
  const t = document.createElement("div");
  ((t.className = "download-reel-banner"),
    (t.innerHTML = `
    <img class="icon" src="${chrome.runtime.getURL("Icons/reelradar-logo.svg")}" alt="" onerror="this.style.display='none'" />
    <div class="message">0% Downloaded</div>
  `),
    _sfGetBannerStackTikTok().appendChild(t));
}
function updateBannerProgress(e) {
  const t = document.querySelector(".download-reel-banner");
  if (!t) return;
  const n = t.querySelector(".message");
  n && (n.innerHTML = `${e}% Downloaded`);
}
function hideDownloadBanner() {
  const e = document.querySelector(".download-reel-banner");
  e &&
    ((e.style.animation = "slideBounceUp 0.25s ease forwards"),
    setTimeout(() => e.remove(), 250));
}
async function buildZipTk(e) {
  const t = [],
    n = [];
  let o = 0;
  for (const c of e) {
    const s = new TextEncoder().encode(c.name),
      m = new Uint8Array(await c.blob.arrayBuffer()),
      h = crc32Tk(m),
      d = new ArrayBuffer(30 + s.length),
      b = new DataView(d);
    (b.setUint32(0, 67324752, !0),
      b.setUint16(4, 20, !0),
      b.setUint16(6, 0, !0),
      b.setUint16(8, 0, !0),
      b.setUint16(10, 0, !0),
      b.setUint16(12, 0, !0),
      b.setUint32(14, h, !0),
      b.setUint32(18, m.length, !0),
      b.setUint32(22, m.length, !0),
      b.setUint16(26, s.length, !0),
      b.setUint16(28, 0, !0),
      new Uint8Array(d, 30).set(s));
    const f = new ArrayBuffer(46 + s.length),
      p = new DataView(f);
    (p.setUint32(0, 33639248, !0),
      p.setUint16(4, 20, !0),
      p.setUint16(6, 20, !0),
      p.setUint16(8, 0, !0),
      p.setUint16(10, 0, !0),
      p.setUint16(12, 0, !0),
      p.setUint16(14, 0, !0),
      p.setUint32(16, h, !0),
      p.setUint32(20, m.length, !0),
      p.setUint32(24, m.length, !0),
      p.setUint16(28, s.length, !0),
      p.setUint16(30, 0, !0),
      p.setUint16(32, 0, !0),
      p.setUint16(34, 0, !0),
      p.setUint16(36, 0, !0),
      p.setUint32(38, 0, !0),
      p.setUint32(42, o, !0),
      new Uint8Array(f, 46).set(s),
      t.push(new Uint8Array(d), m),
      n.push(new Uint8Array(f)),
      (o += d.byteLength + m.length));
  }
  const r = n.reduce((c, s) => c + s.length, 0),
    a = new ArrayBuffer(22),
    i = new DataView(a);
  return (
    i.setUint32(0, 101010256, !0),
    i.setUint16(4, 0, !0),
    i.setUint16(6, 0, !0),
    i.setUint16(8, e.length, !0),
    i.setUint16(10, e.length, !0),
    i.setUint32(12, r, !0),
    i.setUint32(16, o, !0),
    i.setUint16(20, 0, !0),
    new Blob([...t, ...n, new Uint8Array(a)], { type: "application/zip" })
  );
}
const crc32TkTable = (() => {
  const e = new Uint32Array(256);
  for (let t = 0; t < 256; t++) {
    let n = t;
    for (let o = 0; o < 8; o++) n = n & 1 ? 3988292384 ^ (n >>> 1) : n >>> 1;
    e[t] = n;
  }
  return e;
})();
function crc32Tk(e) {
  let t = 4294967295;
  for (let n = 0; n < e.length; n++)
    t = crc32TkTable[(t ^ e[n]) & 255] ^ (t >>> 8);
  return (t ^ 4294967295) >>> 0;
}
function startSelectMissionTikTok(e, t) {
  chrome.runtime.sendMessage({ command: "checkProStatus" }, (n) => {
    if (!n?.isPro) return;
    chrome.runtime.sendMessage({
      export_click_tiktok: !0,
      export_format: t,
      sorted_data: e,
    });
  });
}
