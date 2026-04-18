function post_tab_check(e) {
  let t = e.replace(/^\/|\/$/g, "").split("/");
  const o =
    e.includes("reels") ||
    e.includes("tagged") ||
    e.includes("feed") ||
    e.includes("reposts");
  if (t.length >= 1 && !o) return !0;
}
function reels_tab_check(e) {
  return e.includes("reels");
}
function handle_errors_instagram(e, t) {
  if (document.getElementById("banner_most_viewed_reels") !== null)
    return (
      chrome.runtime.sendMessage({
        sort_feed_error: !0,
        error_type: "back_to_back_sorting",
      }),
      !1
    );
  {
    let o = document.querySelectorAll('[role="tablist"]')[0];
    if (typeof o < "u") {
      let a = o
        .querySelectorAll('[aria-selected="true"]')[0]
        .getAttribute("href");
      return post_tab_check(a)
        ? e === "views"
          ? (chrome.runtime.sendMessage({
              sort_feed_error: !0,
              error_type: "post_views",
            }),
            !1)
          : (sessionStorage.setItem("sortFeedPostsVSReels", "Posts"), !0)
        : reels_tab_check(a)
          ? t === "dates"
            ? (chrome.runtime.sendMessage({
                sort_feed_error: !0,
                error_type: "dates_on_reels",
              }),
              !1)
            : (sessionStorage.setItem("sortFeedPostsVSReels", "Reels"), !0)
          : (chrome.runtime.sendMessage({
              sort_feed_error: !0,
              error_type: "no_posts_reels",
            }),
            !1);
    } else
      return (
        chrome.runtime.sendMessage({
          sort_feed_error: !0,
          error_type: "profile_pages",
        }),
        !1
      );
  }
}
const RR_FEED_ICON_PATH = "Icons/128-ReelRadar.png",
  RR_FEED_ICON_FALLBACK_PATH = "Icons/reelradar-logo.svg";
function setFeedBadgeIcon(e) {
  const t = chrome.runtime.getURL(RR_FEED_ICON_FALLBACK_PATH);
  ((e.onerror = () => {
    e.dataset.rrIconFallback === "1" ||
      ((e.dataset.rrIconFallback = "1"),
      console.warn("[ReelRadar] Feed icon failed to load, falling back to SVG."),
      (e.src = t));
  }),
    (e.src = chrome.runtime.getURL(RR_FEED_ICON_PATH)));
}
if (
  (chrome.runtime.onMessage.addListener((e, t, o) => {
    e.action === "refreshPage" &&
      handle_errors_instagram(e.sort_by, e.dates_items) &&
      (sessionStorage.removeItem("sortFeedSortBy"),
      sessionStorage.removeItem("sortFeedNoItems"),
      sessionStorage.removeItem("sortFeedStatus"),
      sessionStorage.removeItem("sortItemsVsDates"),
      sessionStorage.removeItem("sortFeedData"),
      sessionStorage.setItem("sortFeedSortBy", e.sort_by),
      sessionStorage.setItem("sortFeedNoItems", e.no_items),
      sessionStorage.setItem("sortFeedStatus", !0),
      sessionStorage.setItem("sortItemsVsDates", e.dates_items),
      window.location.reload());
  }),
  location.hostname === "www.instagram.com" ||
    location.hostname === "instagram.com")
) {
  var s = document.createElement("script");
  ((s.src = chrome.runtime.getURL("Instagram/script_instagram.js")),
    (s.onload = function () {
      this.remove();
    }),
    (document.head || document.documentElement).appendChild(s));
}
function _sfInjectSelectStyles() {
  if (document.getElementById("rr-select-anim")) return;
  const e = document.createElement("style");
  ((e.id = "rr-select-anim"),
    (e.textContent = `
    @keyframes rr-btn-in {
      from { opacity: 0; transform: translateX(8px) scale(0.96); }
      to   { opacity: 1; transform: translateX(0)   scale(1);    }
    }
    @keyframes rr-btn-out {
      from { opacity: 1; transform: translateX(0)    scale(1);    }
      to   { opacity: 0; transform: translateX(-8px) scale(0.96); }
    }
    .rr-btn-out { animation: rr-btn-out 100ms ease-in  forwards; }
    .rr-btn-in  { animation: rr-btn-in  140ms ease-out forwards; }

    @keyframes rr-row-in {
      from { opacity: 0; transform: scale(0.97) translateY(2px); }
      to   { opacity: 1; transform: scale(1)    translateY(0);   }
    }
    .rr-row-in { animation: rr-row-in 140ms cubic-bezier(.2,.8,.2,1) forwards; }

    body.rr-select-active [data-rr-custom-ui],
    body.rr-select-active [data-rr-custom-ui] * {
      opacity: 0 !important;
      pointer-events: none !important;
    }

    body.rr-select-active .rr-hover-btns-wrapper {
      display: none !important;
    }
  `),
    document.head.appendChild(e));
}
function _sfInjectExportMenuStyles() {
  if (document.getElementById("rr-export-menu-styles")) return;
  const e = document.createElement("style");
  ((e.id = "rr-export-menu-styles"),
    (e.textContent = `
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
  `),
    document.head.appendChild(e));
}
function _sfUpdateExportSelectedBtn() {
  const e = document.getElementById("rr-export-selected-btn");
  if (!e) return;
  const t = e.dataset.sfThemeDark === "1",
    o = e.dataset.sfIconFilter || "none",
    n = e.querySelector("span"),
    a = e.querySelector("img"),
    c = document.querySelectorAll(
      ".rr-select-circle[data-rr-selected='true']",
    ).length;
  let l = document.getElementById("rr-select-count-badge");
  c > 0
    ? ((e.style.pointerEvents = "auto"),
      (e.style.cursor = "pointer"),
      n && (n.style.color = ""),
      a && (a.style.filter = o),
      l ||
        ((l = document.createElement("span")),
        (l.id = "rr-select-count-badge"),
        (l.style.cssText = `
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
        e.appendChild(l)),
      (l.textContent = c))
    : ((e.style.pointerEvents = "none"),
      (e.style.cursor = "default"),
      l && l.remove(),
      n && (n.style.color = t ? "rgba(242,243,245,0.25)" : "rgba(0,0,0,0.28)"),
      a &&
        (a.style.filter = t
          ? "brightness(0) invert(1) brightness(0.3)"
          : "brightness(0) opacity(0.22)"));
}
let _sfSelectCounter = 0;
function _sfToggleCircle(e) {
  const t = e.querySelector("img");
  (e.dataset.sfSelected === "true"
    ? ((e.dataset.sfSelected = "false"),
      (e.dataset.sfSelectOrder = ""),
      (e.style.background = "transparent"),
      (e.style.borderColor = "rgba(255,255,255,0.9)"),
      t && (t.style.opacity = "0"))
    : ((e.dataset.sfSelected = "true"),
      (e.dataset.sfSelectOrder = ++_sfSelectCounter),
      (e.style.background = "white"),
      (e.style.borderColor = "white"),
      t && (t.style.opacity = "1")),
    _sfUpdateExportSelectedBtn());
}
function _sfEnterItemSelectMode() {
  ((document.body.dataset.sfSelectMode = "true"),
    document.body.classList.add("rr-select-active"),
    document.querySelectorAll("[data-rr-custom-ui]").forEach((n) => {
      ((n.style.display = "none"),
        Array.from(n.children).forEach((a) => {
          a.style.opacity = "0";
        }));
    }));
  const e = chrome.runtime.getURL("Icons/ButtonIcons/check.svg");
  document.querySelectorAll("[data-rr-sorted-item]").forEach((n) => {
    if (n.querySelector(".rr-select-circle")) return;
    const a = document.createElement("div");
    ((a.className = "rr-select-circle"),
      (a.dataset.sfSelected = "false"),
      (a.dataset.sfAction = "true"),
      (a.style.cssText = `
      position: absolute;
      top: 8px; left: 8px;
      width: 22px; height: 22px;
      border-radius: 50%;
      border: 2px solid rgba(255,255,255,0.9);
      background: transparent;
      z-index: 20;
      cursor: pointer;
      box-sizing: border-box;
      display: flex; align-items: center; justify-content: center;
      transition: background-color 0.12s ease, border-color 0.12s ease;
      box-shadow: 0 1px 4px rgba(0,0,0,0.35);
    `));
    const i = document.createElement("img");
    ((i.src = e),
      (i.style.cssText = `
      width: 10px; height: 10px;
      pointer-events: none;
      opacity: 0;
      filter: brightness(0);
      transition: opacity 0.1s ease;
    `),
      a.appendChild(i),
      n.appendChild(a));
  });
  const o = (n) => {
    const a = n.target.closest("[data-rr-sorted-item]");
    if (!a) return;
    (n.stopPropagation(), n.preventDefault());
    const i = a.querySelector(".rr-select-circle");
    i && _sfToggleCircle(i);
  };
  ((document._sfSelectClickHandler = o),
    document.addEventListener("click", o, !0));
}
function _sfExitItemSelectMode() {
  (delete document.body.dataset.sfSelectMode,
    document.body.classList.remove("rr-select-active"),
    document.querySelectorAll("[data-rr-custom-ui]").forEach((e) => {
      (Array.from(e.children).forEach((t) => {
        t.style.opacity = "0";
      }),
        (e.style.display = ""));
    }),
    document.querySelectorAll(".rr-select-circle").forEach((e) => e.remove()),
    document._sfSelectClickHandler &&
      (document.removeEventListener(
        "click",
        document._sfSelectClickHandler,
        !0,
      ),
      delete document._sfSelectClickHandler));
}
function enterSelectMode(e) {
  const t = document.getElementById("rr-btn-row");
  if (!t) return;
  (_sfInjectSelectStyles(), (t.style.alignItems = "stretch"));
  const o = document.getElementById("copy-native"),
    n = document.getElementById("export-native"),
    a = document.getElementById("select-native");
  [o, n, a].forEach((I, U) => {
    I &&
      ((I.style.animationDelay = `${U * 20}ms`), I.classList.add("rr-btn-out"));
  });
  const i = e.isDark ? "transparent" : "white",
    c = e.isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.04)",
    l = e.isDark ? "brightness(0) invert(1) brightness(0.85)" : "none",
    m = `
    background-color: ${i};
    color: ${e.isDark ? "rgba(242,243,245,0.85)" : "#1a1a1a"};
    display: flex;
    align-items: center;
    cursor: pointer;
    gap: 0.65rem;
    padding: 10px 16px;
    border-radius: 6px;
    border: 1px solid ${e.isDark ? "rgba(255,255,255,0.22)" : "rgb(230, 230, 230)"};
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
    r = document.createElement("div");
  ((r.id = "rr-export-selected-btn"),
    (r.style.cssText = m),
    (r.dataset.sfThemeDark = e.isDark ? "1" : "0"),
    (r.dataset.sfIconFilter = l));
  const u = document.createElement("img");
  ((u.src = chrome.runtime.getURL("Icons/BannerIconNew/ExportIconNew.svg")),
    (u.style.cssText = "height: 0.85rem; width: auto; pointer-events: none;"));
  const d = document.createElement("span");
  ((d.textContent = "Export Selected"),
    r.appendChild(u),
    r.appendChild(d),
    (r.style.pointerEvents = "none"),
    (r.style.cursor = "default"),
    (d.style.color = e.isDark ? "rgba(242,243,245,0.25)" : "rgba(0,0,0,0.28)"),
    (u.style.filter = e.isDark
      ? "brightness(0) invert(1) brightness(0.3)"
      : "brightness(0) opacity(0.22)"));
  const p = document.createElement("div");
  ((p.id = "rr-select-close-btn"),
    (p.style.cssText = `
    background-color: ${i};
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    padding: 10px;
    border-radius: 6px;
    border: 1px solid ${e.isDark ? "rgba(255,255,255,0.22)" : "rgb(230, 230, 230)"};
    transition: background-color 0.15s ease;
  `));
  const b = document.createElement("img");
  ((b.src = chrome.runtime.getURL("Icons/BannerIconNew/CloseIconNew.svg")),
    (b.style.cssText = `height: 0.6rem; width: 0.6rem; object-fit: contain; pointer-events: none; filter: ${l};`),
    p.appendChild(b),
    r.addEventListener("mouseover", () => {
      r.style.pointerEvents !== "none" && (r.style.backgroundColor = c);
    }),
    r.addEventListener("mouseout", () => {
      r.style.backgroundColor = i;
    }),
    p.addEventListener("mouseover", () => {
      p.style.backgroundColor = c;
    }),
    p.addEventListener("mouseout", () => {
      p.style.backgroundColor = i;
    }),
    p.addEventListener("click", () => exitSelectMode(e)),
    _sfInjectExportMenuStyles());
  const f = document.createElement("div");
  ((f.className = "rr-menu"),
    (f.style.background = e.menuBg),
    (f.style.border = `1px solid ${e.menuBorder}`),
    (f.style.boxShadow = e.menuShadow),
    (f.style.color = e.menuText),
    (f.style.fontFamily =
      "SF Pro Display, SF Pro Icons, Helvetica Neue, Helvetica, Arial, sans-serif"),
    (f.style.overflow = "hidden"),
    (f.style.borderRadius = "12px"),
    (f.style.padding = "6px"),
    (f.style.zIndex = "2147483647"));
  const E = () => f.classList.contains("open"),
    x = () => f.classList.add("open"),
    v = () => f.classList.remove("open"),
    _ = () => (E() ? v() : x()),
    T = (I, U) => {
      const D = document.createElement("div");
      ((D.className = "rr-menu-item"), (D.textContent = I));
      return (
        D.addEventListener("mouseenter", () => {
          D.style.background = e.menuItemHoverBg;
        }),
        D.addEventListener("mouseleave", () => {
          D.style.background = "transparent";
        }),
        D.addEventListener("click", (L) => {
          (L.stopPropagation(),
            chrome.runtime.sendMessage({ command: "checkProStatus" }, (A) => {
              if (A?.isPro) {
                const F = Array.from(
                    document.querySelectorAll(
                      ".rr-select-circle[data-rr-selected='true']",
                    ),
                  ).sort(
                    (z, P) =>
                      Number(z.dataset.sfSelectOrder) -
                      Number(P.dataset.sfSelectOrder),
                  ),
                  H = [];
                (F.forEach((z) => {
                  const P = z.closest("[data-rr-sorted-item]");
                  if (!(!P || !P.dataset.sfItemJson))
                    try {
                      H.push(JSON.parse(P.dataset.sfItemJson));
                    } catch {}
                }),
                  startSelectMission(
                    H,
                    U,
                    sessionStorage.getItem("sortFeedPostsVSReels"),
                    e,
                  ),
                  v());
              } else {
                const F = document.querySelectorAll(
                  ".rr-select-circle[data-rr-selected='true']",
                ).length;
                (v(),
                  typeof upgradeProBanner == "function" && upgradeProBanner());
                const H = document.querySelector(".sort-banner .message");
                H &&
                  (H.innerHTML = `${F} Post${F !== 1 ? "s" : ""} selected \u2014 export available with Pro`);
              }
            }));
        }),
        D
      );
    };
  (f.appendChild(T("Excel", "excel")),
    f.appendChild(T("CSV", "csv")),
    f.appendChild(T("JSON", "json")),
    r.appendChild(f),
    r.addEventListener("click", (I) => {
      r.style.pointerEvents !== "none" && (I.stopPropagation(), _());
    }));
  const R = (I) => {
      r.contains(I.target) || v();
    },
    M = (I) => {
      I.key === "Escape" && v();
    };
  (document.addEventListener("click", R),
    document.addEventListener("keydown", M),
    (r._sf_cleanup = () => {
      (document.removeEventListener("click", R),
        document.removeEventListener("keydown", M));
    }),
    setTimeout(() => {
      ([o, n, a].forEach((I) => {
        I &&
          (I.classList.remove("rr-btn-out"),
          (I.style.animationDelay = ""),
          (I.style.display = "none"));
      }),
        r.classList.add("rr-btn-in"),
        p.classList.add("rr-btn-in"),
        (p.style.animationDelay = "30ms"),
        t.appendChild(r),
        t.appendChild(p),
        _sfEnterItemSelectMode());
    }, 120));
}
function exitSelectMode(e) {
  const t = document.getElementById("rr-export-selected-btn"),
    o = document.getElementById("rr-select-close-btn");
  (t?._sf_cleanup && t._sf_cleanup(),
    _sfExitItemSelectMode(),
    [t, o].forEach((n, a) => {
      n &&
        ((n.style.animationDelay = `${a * 20}ms`),
        n.classList.add("rr-btn-out"));
    }),
    setTimeout(() => {
      (t && t.remove(), o && o.remove());
      const n = document.getElementById("rr-btn-row"),
        a = document.getElementById("copy-native"),
        i = document.getElementById("export-native"),
        c = document.getElementById("select-native");
      (n && (n.style.alignItems = "stretch"),
        [a, i, c].forEach((l) => {
          l &&
            ((l.style.display = "flex"),
            (l.style.animationDelay = ""),
            l.classList.remove("rr-btn-in"));
        }),
        n &&
          (n.classList.add("rr-row-in"),
          n.addEventListener(
            "animationend",
            () => {
              n.classList.remove("rr-row-in");
            },
            { once: !0 },
          )));
    }, 120));
}
function startSelectMission(e, t, o) {
  e?.length &&
    chrome.runtime.sendMessage({ command: "checkProStatus" }, (n) => {
      n?.isPro &&
        chrome.runtime.sendMessage({
          export_click: !0,
          export_format: t,
          posts_vs_reels: e[0]?.postsVsReels ?? o,
          sorted_data: e,
        });
    });
}
function add_overlay() {
  const e = document.getElementsByTagName("body")[0];
  let t = document.createElement("div");
  ((t.id = "overlay_sort_reels"),
    (t.style = `
  position: fixed;
  display: block;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(34, 211, 238, 0.18);
  z-index: 2;
  cursor: pointer;
  `),
    (t.class = "animate__animated animate__zoomIn"),
    e.append(t));
}
function formatNumber(e) {
  if (e === null || e === 0 || (e >= 1 && e <= 999)) return e;
  if (e >= 1e3 && e < 1e6) return (e / 1e3).toFixed(1) + "K";
  if (e >= 1e6) return (e / 1e6).toFixed(1) + "M";
}
function attachOpenInNewTab(e) {
  !e ||
    e._sfNewTabAttached ||
    ((e._sfNewTabAttached = !0),
    e.addEventListener(
      "click",
      (t) => {
        if (t.target.closest('[data-rr-action="true"]')) return;
        const o = t.target.closest("a") || e.querySelector("a");
        if (!o) return;
        const n = o.getAttribute("href");
        if (!n || !n.startsWith("/")) return;
        (t.preventDefault(), t.stopPropagation());
        const a = new URL(n, "https://www.instagram.com").toString();
        window.open(a, "_blank", "noopener,noreferrer");
      },
      !0,
    ));
}
function setInstagramActionData(
  e,
  { mediaId: t = "", mediaType: o = "posts", profileName: n = "", code: a = "" },
) {
  ((e.dataset.rrAction = "true"),
    (e.dataset.sfAction = "true"),
    (e.dataset.rrIgAction = "download"),
    (e.dataset.rrMediaId = t ? String(t) : ""),
    (e.dataset.rrMediaType = o),
    (e.dataset.rrProfileName = n),
    a ? (e.dataset.rrCode = a) : delete e.dataset.rrCode);
}
function handleInstagramActionClick(e) {
  const t = e.target.closest("[data-rr-ig-action='download']");
  if (!t) return;
  (e.stopPropagation(),
    e.preventDefault(),
    window.postMessage({
      download: !0,
      download_item: t.dataset.rrMediaType || "posts",
      download_reel_id:
        t.dataset.rrMediaType === "reels" ? t.dataset.rrMediaId : void 0,
      download_post_id:
        t.dataset.rrMediaType === "posts" ? t.dataset.rrMediaId : void 0,
      download_profile_name: t.dataset.rrProfileName || "",
      download_code: t.dataset.rrCode || "",
    }));
}
window._rrIgActionClickBound ||
  ((window._rrIgActionClickBound = !0),
  document.addEventListener("click", handleInstagramActionClick, !0));
function createItem(e = "", t = null, o = null, n = null, a = null) {
  const i = document.createElement("div");
  ((i.innerHTML = e), (i.style = "position: relative;"));
  const c = document.createElement("div");
  if (
    ((c.style = `
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.80);
    opacity: 0;
    pointer-events: none;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 16px;
    font-weight: bold;
  `),
    t !== null && o !== null)
  ) {
    const d = document.createElement("div");
    d.style = `
      display: flex;
      gap: 40px;
      align-items: center;
      flex-direction: column;
    `;
    const p = document.createElement("span");
    ((p.style = "display: flex; align-items: center; gap: 5px;"),
      (p.innerHTML = `
      <img src="${chrome.runtime.getURL("Icons/Hover/LoveIG.png")}" style="width: 16px;" />
      ${t}
    `));
    const b = document.createElement("span");
    ((b.style = "display: flex; align-items: center; gap: 5px;"),
      (b.innerHTML = `
      <img src="${chrome.runtime.getURL("Icons/Hover/whiteBubble.png")}" style="width: 16px;" />
      ${o}
    `),
      d.appendChild(p),
      d.appendChild(b),
      c.appendChild(d));
  }
  const l = document.createElement("div");
  l.style = `
    position: absolute;
    bottom: 10px;
    right: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    opacity: 0;
    z-index: 10;
    pointer-events: auto;
  `;
  setInstagramActionData(l, {
    mediaId: n,
    mediaType: "posts",
    profileName: a,
  });
  const m = document.createElement("img");
  ((m.src = chrome.runtime.getURL("Icons/Hover/arrowDownBlack.png")),
    (m.style = `
    width: 9px;
    height: 9px;
    border-radius: 3px;
    background: #22d3ee;
    padding: 5px;
  `),
    l.appendChild(m));
  const r = document.createElement("div");
  ((r.textContent = "Download"),
    (r.style = `
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
    l.appendChild(r),
    l.addEventListener("mouseenter", () => {
      r.style.opacity = "1";
    }),
    l.addEventListener("mouseleave", () => {
      r.style.opacity = "0";
    }));
  const u = document.createElement("div");
  return (
    (u.dataset.sfCustomUi = "true"),
    (u.style = `
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 10;
    pointer-events: none;
  `),
    u.appendChild(c),
    u.appendChild(l),
    i.appendChild(u),
    i.addEventListener("mouseenter", () => {
      document.body.dataset.sfSelectMode ||
        ((c.style.opacity = "1"), (l.style.opacity = "1"));
    }),
    i.addEventListener("mouseleave", (d) => {
      if (document.body.dataset.sfSelectMode) return;
      const p = d.relatedTarget;
      i.contains(p) || ((c.style.opacity = "0"), (l.style.opacity = "0"));
    }),
    attachOpenInNewTab(i),
    i
  );
}
function createItemSingleReel(
  e = "",
  t = null,
  o = null,
  n = null,
  a = null,
  i = null,
) {
  const c = document.createElement("div");
  c.style = "position: relative;";
  const l = document.createElement("div");
  ((l.innerHTML = e), (l.style.pointerEvents = "none"), c.appendChild(l));
  const m = document.createElement("div");
  if (
    ((m.style = `
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.62);
    opacity: 0;
    pointer-events: none;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 16px;
    font-weight: bold;
  `),
    t !== null && o !== null)
  ) {
    const v = document.createElement("div");
    v.style = `
      display: flex;
      gap: 40px;
      align-items: center;
      flex-direction: column;
    `;
    const _ = document.createElement("span");
    ((_.style = "display: flex; align-items: center; gap: 5px;"),
      (_.innerHTML = `
      <img src="${chrome.runtime.getURL("Icons/Hover/LoveIG.png")}" style="width: 16px;" />
      ${t}
    `));
    const T = document.createElement("span");
    ((T.style = "display: flex; align-items: center; gap: 5px;"),
      (T.innerHTML = `
      <img src="${chrome.runtime.getURL("Icons/Hover/whiteBubble.png")}" style="width: 16px;" />
      ${o}
    `),
      v.appendChild(_),
      v.appendChild(T),
      m.appendChild(v));
  }
  const r = document.createElement("div");
  r.style = `
    position: absolute;
    bottom: 10px; right: 10px;
    display: flex; flex-direction: column; gap: 5px;
    align-items: flex-end;
    opacity: 0; z-index: 10;
    pointer-events: auto;
  `;
  const u = document.createElement("div");
  u.style = `
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; position: relative;
  `;
  setInstagramActionData(u, {
    mediaId: n,
    mediaType: "reels",
    profileName: a,
    code: i,
  });
  const d = document.createElement("img");
  ((d.src = chrome.runtime.getURL("Icons/Hover/arrowDownBlack.png")),
    (d.style = `
    width: 9px; height: 9px; border-radius: 3px;
    background: #22d3ee; padding: 5px; transition: opacity 0.15s ease;
  `),
    u.appendChild(d));
  const p = document.createElement("div");
  ((p.textContent = "Download"),
    (p.style = `
    position: absolute; top: 50%; left: -6px;
    transform: translate(-100%, -50%);
    background: #000; color: #fff; font-size: 10px; line-height: 1;
    padding: 4px 8px; border-radius: 6px; white-space: nowrap;
    opacity: 0; pointer-events: none; z-index: 99999;
    box-shadow: 0 2px 8px rgba(0,0,0,0.2); transition: opacity 120ms ease;
  `),
    u.appendChild(p),
    u.addEventListener("mouseenter", () => {
      p.style.opacity = "1";
    }),
    u.addEventListener("mouseleave", () => {
      p.style.opacity = "0";
    }));
  const x = document.createElement("div");
  return (
    (x.dataset.sfCustomUi = "true"),
    (x.style = `
    position: absolute; top: 0; left: 0;
    width: 100%; height: 100%;
    z-index: 10; pointer-events: none;
  `),
    (r.style.pointerEvents = "auto"),
    (m.style.pointerEvents = "none"),
    r.appendChild(u),
    x.appendChild(m),
    x.appendChild(r),
    c.appendChild(x),
    c.addEventListener("mouseover", () => {
      document.body.dataset.sfSelectMode ||
        ((m.style.opacity = "1"), (r.style.opacity = "1"));
    }),
    c.addEventListener("mouseout", (v) => {
      if (document.body.dataset.sfSelectMode) return;
      const _ = v.relatedTarget;
      (_ && c.contains(_)) ||
        ((m.style.opacity = "0"), (r.style.opacity = "0"));
    }),
    attachOpenInNewTab(c),
    c
  );
}
function createItemReelsDownload(
  e = "",
  t = null,
  o = null,
  n = null,
  a = null,
  i = null,
  c = null,
) {
  const l = document.createElement("div");
  l.style = "position: relative;";
  const m = document.createElement("div");
  ((m.innerHTML = e), (m.style.pointerEvents = "none"), l.appendChild(m));
  const r = document.createElement("div");
  if (
    ((r.style = `
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.62);
    opacity: 0;
    pointer-events: none;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 15px;
    font-weight: bold;
  `),
    t !== null && o !== null && n !== null)
  ) {
    const _ = document.createElement("div");
    _.style = `
      display: flex;
      flex-direction: column;
      gap: 30px;
      align-items: center;
    `;
    const T = (R, M) => {
      const I = document.createElement("span");
      return (
        (I.style = "display: flex; align-items: center; gap: 5px;"),
        (I.innerHTML = `
        <img src="${R}" style="width: 15px;" />
        ${M}
      `),
        I
      );
    };
    (_.appendChild(T(chrome.runtime.getURL("Icons/Hover/PlayIG.png"), n)),
      _.appendChild(T(chrome.runtime.getURL("Icons/Hover/LoveWhite.png"), t)),
      _.appendChild(T(chrome.runtime.getURL("Icons/Hover/whiteBubble.png"), o)),
      r.appendChild(_));
  }
  const u = document.createElement("div");
  u.style = `
    position: absolute;
    bottom: 10px;
    right: 10px;
    display: flex;
    gap: 5px;
    opacity: 0;
    z-index: 10;
    pointer-events: auto;
    flex-direction: column;      /* \u2B05\uFE0F stack buttons vertically */
    align-items: flex-end;       /* \u2B05\uFE0F keep them right-aligned */
  `;
  const d = document.createElement("div");
  d.style = `
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    position: relative; /* for centered tooltip */
  `;
  setInstagramActionData(d, {
    mediaId: a,
    mediaType: "reels",
    profileName: i,
    code: c,
  });
  const p = document.createElement("img");
  ((p.src = chrome.runtime.getURL("Icons/Hover/arrowDownBlack.png")),
    (p.style = `
    width: 9px;
    height: 9px;
    border-radius: 3px;
    background: #22d3ee;
    padding: 5px;
  `),
    d.appendChild(p));
  const b = document.createElement("div");
  ((b.textContent = "Download"),
    (b.style = `
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
    d.appendChild(b),
    d.addEventListener("mouseenter", () => {
      b.style.opacity = "1";
    }),
    d.addEventListener("mouseleave", () => {
      b.style.opacity = "0";
    }));
  const v = document.createElement("div");
  return (
    (v.dataset.sfCustomUi = "true"),
    (v.style = `
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 10;
  pointer-events: none; /* non-interactive container */
`),
    (u.style.pointerEvents = "auto"),
    (r.style.pointerEvents = "none"),
    u.appendChild(d),
    v.appendChild(r),
    v.appendChild(u),
    l.appendChild(v),
    l.addEventListener("mouseover", () => {
      document.body.dataset.sfSelectMode ||
        ((r.style.opacity = "1"), (u.style.opacity = "1"));
    }),
    l.addEventListener("mouseout", (_) => {
      if (document.body.dataset.sfSelectMode) return;
      const T = _.relatedTarget;
      (T && l.contains(T)) ||
        ((r.style.opacity = "0"), (u.style.opacity = "0"));
    }),
    attachOpenInNewTab(l),
    l
  );
}
function createItemReels(e = "", t = null, o = null, n = null) {
  const a = document.createElement("div");
  a.style = "position: relative;";
  const i = document.createElement("div");
  ((i.innerHTML = e), a.appendChild(i));
  const c = document.createElement("img");
  (setFeedBadgeIcon(c),
    (c.style = `
    position: absolute;
    top: 10px;
    left: 10px;
    width: 15px;
    height: 15px;
    opacity: 0;
    z-index: 10;
    pointer-events: none;
  `));
  const l = document.createElement("div");
  if (
    ((l.style = `
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.40);
    opacity: 0;
    pointer-events: none;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 15px;
    font-weight: bold;
  `),
    t !== null && o !== null && n !== null)
  ) {
    const r = document.createElement("div");
    r.style = `
      display: flex;
      flex-direction: column;
      gap: 30px;
      align-items: center;
    `;
    const u = document.createElement("span");
    ((u.style = "display: flex; align-items: center; gap: 5px;"),
      (u.innerHTML = `
      <img src="${chrome.runtime.getURL("Icons/Hover/PlayIG.png")}" style="width: 15px;" />
      ${n}
    `));
    const d = document.createElement("span");
    ((d.style = "display: flex; align-items: center; gap: 5px;"),
      (d.innerHTML = `
      <img src="${chrome.runtime.getURL("Icons/Hover/LoveWhite.png")}" style="width: 15px;" />
      ${t}
    `));
    const p = document.createElement("span");
    ((p.style = "display: flex; align-items: center; gap: 5px;"),
      (p.innerHTML = `
      <img src="${chrome.runtime.getURL("Icons/Hover/whiteBubble.png")}" style="width: 15px;" />
      ${o}
    `),
      r.appendChild(u),
      r.appendChild(d),
      r.appendChild(p),
      l.appendChild(r));
  }
  const m = document.createElement("div");
  return (
    (m.style = `
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 10;
    pointer-events: none;
  `),
    (m.dataset.sfCustomUi = "true"),
    m.appendChild(c),
    m.appendChild(l),
    a.appendChild(m),
    a.addEventListener("mouseenter", () => {
      document.body.dataset.sfSelectMode ||
        ((c.style.opacity = "1"), (l.style.opacity = "1"));
    }),
    a.addEventListener("mouseleave", (r) => {
      if (document.body.dataset.sfSelectMode) return;
      const u = r.relatedTarget;
      a.contains(u) || ((c.style.opacity = "0"), (l.style.opacity = "0"));
    }),
    a
  );
}
function remove_items_local_storage() {
  (sessionStorage.removeItem("sortFeedSortBy"),
    sessionStorage.removeItem("sortFeedNoItems"),
    sessionStorage.removeItem("sortFeedStatus"),
    sessionStorage.removeItem("sortFeedData"),
    sessionStorage.removeItem("sortFeedDataSorted"),
    sessionStorage.removeItem("sortFeedPostsVSReels"),
    sessionStorage.removeItem("sortFeedProfileName"),
    sessionStorage.removeItem("sortItemsVsDates"));
}
function getVideosDiv() {
  const o = document
    .getElementsByTagName("main")[0]
    .getElementsByTagName("div")[0]
    .querySelector('[role="tablist"]')?.parentElement;
  if (!o) return null;
  let n = o.nextElementSibling;
  for (; n && n.tagName !== "DIV"; ) n = n.nextElementSibling;
  return n;
}
function add_sorted_items(e, t) {
  return new Promise((o) => {
    if (t === "Posts") {
      const n = getVideosDiv();
      n.style.display = "none";
      let a = document.createElement("div");
      ((a.id = "div_most_viewed_reels"),
        a.setAttribute("data-sortfeed", "true"),
        (a.className = n.className),
        (a.style =
          "display: flex; flex-direction: column; padding-bottom: 0px; padding-top: 0px; position: relative;"),
        n.after(a));
      let i = document.getElementById("div_most_viewed_reels");
      for (let c = 0; c < e.length; c += 4) {
        let l = document.createElement("div");
        for (
          l.className = "_ac7v xat24cr x1f01sob xcghwft xzboxd6",
            e.slice(c, c + 4).forEach((r) => {
              const u = [1, 8].includes(r.mediaType)
                  ? `https://www.instagram.com/${r.userName}/p/${r.code}/`
                  : `https://www.instagram.com/${r.userName}/reel/${r.code}/`,
                d = JSON.stringify({
                  id: r.postID ?? null,
                  code: r.code ?? null,
                  userName: r.userName ?? null,
                  url: u,
                  postsVsReels: "Posts",
                  createDate: r.createDate ? r.createDate.slice(0, 10) : null,
                  likesCount: r.likesCount ?? null,
                  commentsCount: r.commentsCount ?? null,
                  viewCount: r.viewCount ?? null,
                  shareCount: r.shareCount ?? null,
                  mediaType: r.mediaType ?? null,
                  caption: r.caption ?? null,
                });
              if (r.mediaType == 2) {
                const p = createItemSingleReel(
                  r.element,
                  formatNumber(r.likesCount),
                  formatNumber(r.commentsCount),
                  r.postID,
                  r.userName,
                  r.code,
                );
                ((p.dataset.sfSortedItem = "true"),
                  (p.dataset.sfItemJson = d),
                  l.appendChild(p));
              } else {
                const p = createItem(
                  r.element,
                  formatNumber(r.likesCount),
                  formatNumber(r.commentsCount),
                  r.postID,
                  r.userName,
                );
                ((p.dataset.sfSortedItem = "true"),
                  (p.dataset.sfItemJson = d),
                  l.appendChild(p));
              }
            });
          l.children.length < 4;
        ) {
          let r = document.createElement("div");
          ((r.className = "x11i5rnm x1ntc13c x9i3mqj x2pgyrj"),
            l.appendChild(r));
        }
        i.appendChild(l);
      }
      o(!0);
    } else if (t === "Reels") {
      const n = getVideosDiv();
      n.style.display = "none";
      let a = document.createElement("div");
      ((a.id = "div_most_viewed_reels"),
        a.setAttribute("data-sortfeed", "true"),
        (a.className = n.className),
        (a.style =
          "display: flex; flex-direction: column; padding-bottom: 0px; padding-top: 0px; position: relative;"),
        n.after(a));
      let i = document.getElementById("div_most_viewed_reels");
      for (let c = 0; c < e.length; c += 4) {
        let l = document.createElement("div");
        for (
          l.className = "_ac7v xat24cr x1f01sob xcghwft xzboxd6",
            e.slice(c, c + 4).forEach((r) => {
              let u = createItemReelsDownload(
                r.element,
                formatNumber(r.likesCount),
                formatNumber(r.commentsCount),
                formatNumber(r.viewCount),
                r.reelID,
                r.userName,
                r.code,
              );
              ((u.dataset.sfSortedItem = "true"),
                (u.dataset.sfItemJson = JSON.stringify({
                  id: r.reelID ?? null,
                  code: r.code ?? null,
                  userName: r.userName ?? null,
                  url: `https://www.instagram.com/${r.userName}/reel/${r.code}/`,
                  postsVsReels: "Reels",
                  createDate: r.createDate ? r.createDate.slice(0, 10) : null,
                  likesCount: r.likesCount ?? null,
                  commentsCount: r.commentsCount ?? null,
                  viewCount: r.viewCount ?? null,
                  shareCount: r.shareCount ?? null,
                  mediaType: r.mediaType ?? null,
                  caption: r.caption ?? null,
                })),
                u.querySelectorAll("li").forEach((d) => {
                  const p = d.querySelectorAll("span");
                  p.length >= 2 &&
                    (p[0].remove(), p[1].remove(), p[2].remove());
                }),
                l.appendChild(u));
            });
          l.children.length < 4;
        ) {
          let r = document.createElement("div");
          ((r.className = "x11i5rnm x1ntc13c x9i3mqj x2pgyrj"),
            l.appendChild(r));
        }
        i.appendChild(l);
      }
      o(!0);
    }
  });
}
function handle_sub_header(e, t, o, n) {
  if (o === "items") return `Latest ${e} ${t}`;
  if (o === "dates" && n === "1_week") return `${e} ${t} from 1 Week Back`;
  if (o === "dates" && n === "1_month") return `${e} ${t} from 1 Month Back`;
  if (o === "dates" && n === "3_month") return `${e} ${t} from 3 Months Back`;
  if (o === "dates" && n === "6_month") return `${e} ${t} from 6 Months Back`;
  if (o === "dates" && n === "1_year") return `${e} ${t} from 1 Year Back`;
  if (o === "dates" && n === "all_reels") return `${e} ${t}`;
}
function handle_header(e, t) {
  if (e === "views") return `Most Viewed ${t}`;
  if (e === "comments") return `Most Commented ${t}`;
  if (e === "likes") return `Most Liked ${t}`;
  if (e === "oldest") return `Oldest ${t}`;
}
function posts_reels_label(e, t) {
  return e === 1 ? t.slice(0, -1) : t;
}
function copyToClipboard(e, t) {
  let o, n;
  t === "Posts"
    ? ((o = ["Profile", "Post", "Create Date", "Likes", "Comments", "Caption"]),
      (n = e.map((i) => {
        const c = [1, 8].includes(i.mediaType)
            ? `https://www.instagram.com/${i.userName}/p/${i.code}/`
            : `https://www.instagram.com/${i.userName}/reel/${i.code}/`,
          l = i.createDate ? i.createDate.slice(0, 10) : "";
        return [
          i.userName,
          c,
          l,
          i.likesCount,
          i.commentsCount,
          i.caption ?? "",
        ];
      })))
    : t === "Reels" &&
      ((o = ["Profile", "Reel", "Views", "Likes", "Comments"]),
      (n = e.map((i) => {
        const c = `https://www.instagram.com/${i.userName}/reel/${i.code}/`;
        return [i.userName, c, i.viewCount, i.likesCount, i.commentsCount];
      })));
  const a = [o, ...n].map((i) => i.join("	")).join(`
`);
  navigator.clipboard.writeText(a);
}
function getInstagramThemeClassList() {
  const e = document.documentElement;
  return Array.from(e.classList).some((o) => o.toLowerCase().includes("dark"))
    ? {
        isDark: !0,
        backgroundColor: "rgb(14, 20, 26)",
        textColor: "#f2f3f5",
        bannerBorder: "rgba(255,255,255,0.08)",
        bannerShadow: "0 1px 3px rgba(0,0,0,0.3)",
        buttonBg: "rgba(255,255,255,0.07)",
        buttonHoverBg: "rgba(255,255,255,0.22)",
        buttonBorder: "rgba(255,255,255,0.13)",
        buttonShadow: "none",
        buttonText: "rgba(242,243,245,0.85)",
        buttonIconFilter: "brightness(0) invert(1) brightness(0.85)",
        menuBg: "rgba(20, 24, 29, 0.98)",
        menuBorder: "rgba(255,255,255,0.10)",
        menuShadow: "0 12px 30px rgba(0,0,0,0.55)",
        menuItemHoverBg: "rgba(255,255,255,0.08)",
        menuText: "#f2f3f5",
        menuMutedText: "rgba(242,243,245,0.7)",
        copyIcon: "Icons/BannerIconNew/CopyIconNew.svg",
        exportIcon: "Icons/BannerIconNew/ExportIconNew.svg",
        checkIcon: "Icons/BannerIcons/whiteCheckBanner.png",
      }
    : {
        isDark: !1,
        backgroundColor: "white",
        textColor: "black",
        bannerBorder: "rgba(0,0,0,0.08)",
        bannerShadow: "0 1px 3px rgba(0,0,0,0.06)",
        buttonBg: "white",
        buttonHoverBg: "rgba(0,0,0,0.04)",
        buttonBorder: "#E6E6E6",
        buttonShadow: "0 1px 2px rgba(0,0,0,0.05)",
        buttonText: "#37352F",
        buttonIconFilter: "none",
        menuBg: "rgba(255,255,255,0.98)",
        menuBorder: "rgba(0,0,0,0.10)",
        menuShadow: "0 12px 30px rgba(0,0,0,0.12)",
        menuItemHoverBg: "rgba(0,0,0,0.04)",
        menuText: "#111",
        menuMutedText: "rgba(0,0,0,0.55)",
        copyIcon: "Icons/BannerIconNew/CopyIconNew.svg",
        exportIcon: "Icons/BannerIconNew/ExportIconNew.svg",
        checkIcon: "Icons/BannerIcons/blackCheckBanner.png",
      };
}
function export_button_on_banner(e, t, o) {
  const n = document.getElementById("export-native");
  if (!n) return;
  if (
    (n._sf_cleanup && n._sf_cleanup(),
    !document.getElementById("rr-export-menu-styles"))
  ) {
    const f = document.createElement("style");
    ((f.id = "rr-export-menu-styles"),
      (f.textContent = `
      .rr-menu, .rr-menu * { box-sizing: border-box; }

      .rr-menu {
        position: absolute;
        bottom: calc(100% + 8px);   /* above the button */
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

      /* \u2705 hide the export tooltip while menu is open */
      #export-native.rr-menu-open .tooltip {
        opacity: 0 !important;
        pointer-events: none !important;
      }
    `),
      document.head.appendChild(f));
  }
  const a = n.querySelector(".rr-menu");
  a && a.remove();
  const i = document.createElement("div");
  ((i.className = "rr-menu"),
    (i.style.background = e.menuBg),
    (i.style.border = `1px solid ${e.menuBorder}`),
    (i.style.boxShadow = e.menuShadow),
    (i.style.color = e.menuText),
    (i.style.fontFamily =
      "SF Pro Display, SF Pro Icons, Helvetica Neue, Helvetica, Arial, sans-serif"),
    (i.style.overflow = "hidden"),
    (i.style.borderRadius = "12px"),
    (i.style.padding = "6px"),
    (i.style.zIndex = "2147483647"));
  const c = () => {
      const f = n.querySelector(".tooltip");
      f && (f.style.opacity = "0");
    },
    l = (f, E) => {
      const x = document.createElement("div");
      ((x.className = "rr-menu-item"), (x.textContent = f));
      return (
        x.addEventListener("mouseenter", () => {
          x.style.background = e.menuItemHoverBg;
        }),
        x.addEventListener("mouseleave", () => {
          x.style.background = "transparent";
        }),
        x.addEventListener("click", (v) => {
          (v.stopPropagation(),
            chrome.runtime.sendMessage({
              export_click: !0,
              export_format: E,
              posts_vs_reels: t,
              sorted_data: o,
            }),
            u());
        }),
        x
      );
    };
  (i.appendChild(l("Excel", "excel")),
    i.appendChild(l("CSV", "csv")),
    i.appendChild(l("JSON", "json")),
    n.appendChild(i));
  const m = () => i.classList.contains("open"),
    r = () => {
      (n.classList.add("rr-menu-open"), i.classList.add("open"), c());
    },
    u = () => {
      (n.classList.remove("rr-menu-open"), i.classList.remove("open"));
    },
    d = () => (m() ? u() : r());
  n._sf_clickBound ||
    ((n._sf_clickBound = !0),
    n.addEventListener("click", (f) => {
      (f.stopPropagation(), d());
    }));
  const p = (f) => {
    n.contains(f.target) || u();
  };
  document.addEventListener("click", p);
  const b = (f) => {
    f.key === "Escape" && u();
  };
  (document.addEventListener("keydown", b),
    (n._sf_cleanup = () => {
      (document.removeEventListener("click", p),
        document.removeEventListener("keydown", b));
    }));
}
function add_banner(
  e = null,
  t = null,
  o = null,
  n = null,
  a = null,
  i = null,
) {
  let c = posts_reels_label(e, t),
    l = handle_header(o, c),
    m = handle_sub_header(e, c, a, i);
  const u = document
      .getElementsByTagName("main")[0]
      .getElementsByTagName("div")[0]
      .querySelectorAll('[role="tablist"]')[0],
    d = getInstagramThemeClassList();
  let p = document.createElement("div");
  ((p.id = "banner_most_viewed_reels"),
    (p.style = `
    display: flex;
    align-items: center;
    background-color: ${d.backgroundColor};
    color: ${d.textColor};
    padding: 20px 40px;
    justify-content: space-between;
    margin-bottom: 0.2em;
    border: 1px solid ${d.bannerBorder};
    box-shadow: ${d.bannerShadow};
    border-top-left-radius: 12px;
    border-top-right-radius: 12px;
    border-bottom-left-radius: 0;  /* straight bottom edge */
    border-bottom-right-radius: 0;

      position: relative;     /* \u2705 creates stacking context */
      overflow: visible;      /* \u2705 dropdown can spill outside banner */

  `),
    (p.className = "animate__animated animate__bounce"),
    u.replaceWith(p),
    (document.getElementById("banner_most_viewed_reels").innerHTML = `
    <div class="text_section" style="display: flex; flex-direction: row; width: 100%; justify-content: space-between;">
      <div class="metrics_section">
        <div id="reels_number_section" style="display: flex; flex-direction: row; margin-bottom: -2px; align-items: center;">
          <h2 style="color: ${d.textColor}; margin: 0; font-size: 0.8rem; line-height: 1.1667; font-weight: 500; letter-spacing: 0.02em; font-family: SF Pro Display, SF Pro Icons, Helvetica Neue, Helvetica, Arial, sans-serif;">
            ${m}
          </h2>
        </div>
        <h1 style="color: ${d.textColor}; margin: 0; font-size: 1.6rem; line-height: 1.1667; font-weight: 600; letter-spacing: -0.01em; font-family: SF Pro Display, SF Pro Icons, Helvetica Neue, Helvetica, Arial, sans-serif;">
          ${l}
        </h1>
      </div>

      <div class="button_section" style="display: flex; flex-direction: column; justify-content: center;">
        <div id="rr-btn-row" style="display: flex; flex-direction: row; gap: 0.6rem; align-items: stretch;">

          <!-- Copy Button (icon only) -->
          <div id="copy-native" style="
            background-color: ${d.isDark ? "transparent" : "white"};
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            position: relative;
            padding: 10px;
            border-radius: 6px;
            border: 1px solid ${d.isDark ? "rgba(255,255,255,0.22)" : "rgb(230, 230, 230)"};
            transition: background-color 0.15s ease;
          ">
            <img src="${chrome.runtime.getURL(d.copyIcon)}" style="
              height: 0.95rem;
              width: auto;
              pointer-events: none;
              filter: ${d.buttonIconFilter};
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
              font-weight: 400;
              white-space: nowrap;
              pointer-events: none;
              opacity: 0;
              transition: all 0.2s ease;
              font-family: SF Pro Display, SF Pro Icons, Helvetica Neue, Helvetica, Arial, sans-serif;
              z-index: 1000;
            ">Copy results</div>
          </div>

          <!-- Export Button (icon only) -->
          <div id="export-native" style="
            background-color: ${d.isDark ? "transparent" : "white"};
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            position: relative;
            padding: 10px;
            border-radius: 6px;
            border: 1px solid ${d.isDark ? "rgba(255,255,255,0.22)" : "rgb(230, 230, 230)"};
            transition: background-color 0.15s ease;
          ">
            <img src="${chrome.runtime.getURL(d.exportIcon)}" style="
              height: 0.95rem;
              width: auto;
              pointer-events: none;
              filter: ${d.buttonIconFilter};
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
              font-weight: 400;
              white-space: nowrap;
              pointer-events: none;
              opacity: 0;
              transition: all 0.2s ease;
              font-family: SF Pro Display, SF Pro Icons, Helvetica Neue, Helvetica, Arial, sans-serif;
              z-index: 1000;
            ">Export</div>
          </div>

          <!-- Select Button (text only, Notion border) -->
          <div id="select-native" style="
            background-color: ${d.isDark ? "transparent" : "white"};
            color: ${d.isDark ? "rgba(242,243,245,0.85)" : "#1a1a1a"};
            display: flex;
            align-items: center;
            cursor: pointer;
            position: relative;
            padding: 10px 16px;
            border-radius: 6px;
            border: 1px solid ${d.isDark ? "rgba(255,255,255,0.22)" : "rgb(230, 230, 230)"};
            transition: background-color 0.15s ease;
            font-size: 0.82rem;
            font-weight: 500;
            font-family: SF Pro Display, SF Pro Icons, Helvetica Neue, Helvetica, Arial, sans-serif;
            white-space: nowrap;
            user-select: none;
          ">Select<span style="
              font-size: 0.58rem;
              font-weight: 500;
              background: ${d.isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.06)"};
              color: ${d.isDark ? "rgba(242,243,245,0.5)" : "rgba(0,0,0,0.38)"};
              padding: 2px 5px;
              border-radius: 3px;
              margin-left: 5px;
              line-height: 1;
              vertical-align: middle;
              letter-spacing: 0.02em;
            ">New</span></div>

        </div>
      </div>
    </div>
  `));
  let b = document.getElementById("reels_number_section"),
    f = document.createElement("img");
  (setFeedBadgeIcon(f),
    (f.style = `
    width: auto;
    margin-right: 0.2rem;
    height: 0.7rem;
  `),
    b.insertBefore(f, b.firstChild));
  const E = document.getElementById("export-native"),
    x = E.querySelector(".tooltip");
  (E.addEventListener("mouseover", () => {
    E.classList.contains("rr-menu-open") ||
      ((E.style.backgroundColor = R),
      (x.style.opacity = "1"),
      (x.style.transform = "translateX(-50%) translateY(0)"));
  }),
    E.addEventListener("mouseout", () => {
      ((E.style.backgroundColor = T),
        (x.style.opacity = "0"),
        (x.style.transform = "translateX(-50%) translateY(4px)"));
    }));
  const v = document.getElementById("copy-native"),
    _ = v.querySelector(".tooltip"),
    T = d.isDark ? "transparent" : "white",
    R = d.isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.04)";
  (v.addEventListener("mouseover", () => {
    ((v.style.backgroundColor = R),
      (_.style.opacity = "1"),
      (_.style.transform = "translateX(-50%) translateY(0)"));
  }),
    v.addEventListener("mouseout", () => {
      ((v.style.backgroundColor = T),
        (_.style.opacity = "0"),
        (_.style.transform = "translateX(-50%) translateY(4px)"));
    }));
  const M = document.getElementById("select-native"),
    I = d.isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.04)",
    U = d.isDark ? "transparent" : "white";
  (M.addEventListener("mouseover", () => {
    M.style.backgroundColor = I;
  }),
    M.addEventListener("mouseout", () => {
      M.style.backgroundColor = U;
    }),
    M.addEventListener("click", () => {
      enterSelectMode(d);
    }),
    export_button_on_banner(d, t, n),
    v.addEventListener("click", () => {
      copyToClipboard(n, t);
      const D = v.querySelector(".tooltip"),
        L = v.querySelector("img"),
        A = D.textContent,
        F = L.src;
      ((D.textContent = "Results copied"),
        (L.src = chrome.runtime.getURL(d.checkIcon)),
        (L.style.height = "0.95rem"),
        (L.style.width = "auto"),
        (L.style.transition = "none"),
        (L.style.opacity = "0"),
        (L.style.transform = "scale(0.5)"),
        requestAnimationFrame(() => {
          ((L.style.transition =
            "opacity 0.18s ease, transform 0.22s cubic-bezier(0.34, 1.56, 0.64, 1)"),
            (L.style.opacity = "1"),
            (L.style.transform = "scale(1)"));
        }),
        setTimeout(() => {
          ((L.style.transition = "opacity 0.15s ease, transform 0.15s ease"),
            (L.style.opacity = "0"),
            (L.style.transform = "scale(0.7)"),
            setTimeout(() => {
              ((D.textContent = A),
                (L.src = F),
                (L.style.transition = "none"),
                (L.style.opacity = "1"),
                (L.style.transform = "scale(1)"));
            }, 150));
        }, 1350));
    }));
}
function unhide_all_images() {
  document.querySelectorAll('img[style*="visibility: hidden"]').forEach((e) => {
    e.style.visibility = "visible";
  });
}
function remove_unneeded_elements() {
  let e = document.querySelector('[role="tablist"]');
  if (e) {
    const t = e.parentElement,
      o = Array.from(t.children),
      n = o.indexOf(e),
      a = o[n + 1];
    a && a.remove();
  }
}
(window.addEventListener("message", (e) => {
  if (e.source === window) {
    if (e.data.logo_animate_off) {
      let t = e.data.payload,
        o = sessionStorage.getItem("sortFeedPostsVSReels");
      add_sorted_items(t, o).then(() => {
        let n = t.length,
          a = sessionStorage.getItem("sortFeedSortBy"),
          i = sessionStorage.getItem("sortFeedPostsVSReels"),
          c = sessionStorage.getItem("sortItemsVsDates"),
          l = sessionStorage.getItem("sortFeedNoItems");
        (window.scrollTo({ top: 0, behavior: "smooth" }), unhide_all_images());
        const m = () => {
          window.scrollY === 0
            ? add_banner(n, i, a, t, c, l)
            : requestAnimationFrame(m);
        };
        (requestAnimationFrame(m),
          remove_items_local_storage(),
          chrome.runtime.sendMessage({ logo_animate_off: !0 }));
      });
    } else if (e.data.logo_animate_off_zero_insta_time_period) {
      let t = null,
        o = sessionStorage.getItem("sortFeedSortBy"),
        n = 0,
        a = sessionStorage.getItem("sortItemsVsDates"),
        i = sessionStorage.getItem("sortFeedNoItems");
      (window.scrollTo({ top: 0, behavior: "smooth" }),
        remove_unneeded_elements(),
        add_banner(n, "Posts", o, t, a, i),
        remove_items_local_storage(),
        chrome.runtime.sendMessage({ logo_animate_off: !0 }));
    } else if (e.data.item_collected_no) {
      let t = e.data.number_items;
      chrome.runtime.sendMessage({ item_collected_no: !0, number_items: t });
    }
  }
}),
  window.addEventListener("load", function () {
    sessionStorage.getItem("sortFeedStatus") &&
      (add_overlay(), chrome.runtime.sendMessage({ logo_animate_on: !0 }));
  }),
  window.addEventListener("message", (e) => {
    if (e.data.insta_banner_notification) {
      let t = e.data.count,
        o = e.data.type;
      injectSortFeedBanner(t, o);
    }
  }));
function _sfGetBannerStack() {
  let e = document.getElementById("rr-banner-stack");
  return (
    e ||
      ((e = document.createElement("div")),
      (e.id = "rr-banner-stack"),
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
function injectSortFeedBanner(e = 25, t = "Posts") {
  const o = document.querySelector(".sort-banner");
  if (o) {
    const a = o.querySelector(".message");
    a && (a.innerHTML = `${e} ${t} sorted \u2014 don't scroll`);
    return;
  }
  if (!document.getElementById("rr-sort-banner-style")) {
    const a = document.createElement("style");
    ((a.id = "rr-sort-banner-style"),
      (a.textContent = `
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
      width: 100%;
      box-sizing: border-box;
      background: #ffffff;
      padding: 12px 16px;
      display: flex;
      align-items: center;
      animation: slideBounceDown 0.25s ease;
      border: 1px solid rgba(0, 0, 0, 0.15);
      border-radius: 0.75rem;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
    }

    .sort-banner .stop-btn:hover {
      background: #e5e7eb;
    }

    .sort-banner .message {
      font-size: 16px;
      font-weight: 400;
      color: #000;
      flex-grow: 1;
      letter-spacing: 0.01em;
      font-family: SF Pro Display, SF Pro Icons, Helvetica Neue, Helvetica, Arial, sans-serif;
    }

    .sort-banner .stop-btn {
      font-size: 15px;
      color: #000;
      background: #f3f4f6;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      font-weight: 400;
      padding: 8px 14px;
      font-family: SF Pro Display, SF Pro Icons, Helvetica Neue, Helvetica, Arial, sans-serif;
      display: inline-flex;
      align-items: center;
      gap: 8px;
    }
    .sort-banner .stop-btn img {
      width: 10px;
      height: 10px;
      display: block;
      background: rgba(0,0,0,0.85);
      border-radius: 2px;
    }

    @media (max-width: 400px) {
      .sort-banner { padding: 10px 12px; }
      .sort-banner .message,
      .sort-banner .stop-btn { font-size: 14px; }
    }
  `),
      document.head.appendChild(a));
  }
  const n = document.createElement("div");
  ((n.className = "sort-banner"),
    (n.innerHTML = `
  <img class="icon" src="${chrome.runtime.getURL("Icons/reelradar-logo.svg")}" alt="" onerror="this.style.display='none'" />
  <div class="message">
    Sorting ${e} ${t} \u2014 don't scroll
  </div>
  <button class="stop-btn">
    <img src="${chrome.runtime.getURL("Icons/StopIcon.png")}" alt="">
    <span>Stop Sorting</span>
  </button>
`),
    n.querySelector(".stop-btn").addEventListener("click", () => {
      sessionStorage.setItem("sortFeedStopSorting", "on");
    }),
    _sfGetBannerStack().appendChild(n));
}
function removeSortFeedBanner() {
  const e = document.querySelector(".sort-banner");
  e &&
    ((e.style.animation = "slideBounceUp 0.25s ease forwards"),
    setTimeout(() => {
      e.remove();
    }, 250));
}
window.addEventListener("message", (e) => {
  if (e.data.insta_banner_notification_remove) {
    removeSortFeedBanner();
    const t = document.getElementById("overlay_sort_reels");
    t && t.remove();
  }
});
const SF_HOVER_ATTR = "data-rr-hover-injected",
  SF_HOVER_CLASS = "rr-hover-btns-wrapper";
let sfIgDownloadEnabled = !0;
(chrome.storage.local.get(["sortfeed_ig_download_enabled"], (e) => {
  e.sortfeed_ig_download_enabled === !1 && (sfIgDownloadEnabled = !1);
}),
  chrome.storage.onChanged.addListener((e) => {
    "sortfeed_ig_download_enabled" in e &&
      ((sfIgDownloadEnabled = e.sortfeed_ig_download_enabled.newValue !== !1),
      refreshHoverButtons());
  }));
function refreshHoverButtons() {
  (document.querySelectorAll(`[${SF_HOVER_ATTR}]`).forEach((e) => {
    (e.removeAttribute(SF_HOVER_ATTR),
      e.querySelector(`.${SF_HOVER_CLASS}`)?.remove());
  }),
    injectIntoAllTiles());
}
function shortcodeToMediaId(e) {
  const t = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";
  let o = BigInt(0);
  for (const n of e) {
    const a = t.indexOf(n);
    a !== -1 && (o = o * BigInt(64) + BigInt(a));
  }
  return o.toString();
}
function getProfileName() {
  return window.location.pathname.replace(/^\/|\/$/g, "").split("/")[0] || "";
}
function isSupportedPage() {
  const e = window.location.pathname;
  if (/\/saved\/audio\/?$/.test(e)) return !1;
  if (
    /\/saved\//.test(e) ||
    /^\/explore\/?$/.test(e) ||
    /^\/explore\/search\/?/.test(e)
  )
    return !0;
  const t = [
      "explore",
      "reels",
      "stories",
      "direct",
      "accounts",
      "notifications",
      "p",
      "reel",
      "tv",
      "locations",
      "hashtag",
      "audio",
    ],
    o = e.replace(/^\/|\/$/g, "").split("/");
  return !!(
    (o.length === 1 && !t.includes(o[0])) ||
    (o.length === 2 && ["reels", "tagged"].includes(o[1]))
  );
}
function detectIsReel(e) {
  const t = e.getAttribute("href") || "";
  return !!(
    /\/reel\/[^\/]+\//.test(t) ||
    e.querySelector(
      '[aria-label="Clip"], [aria-label*="Reel"], [aria-label*="Video"]',
    ) ||
    e.querySelector("video")
  );
}
function ensureHoverStyle() {
  if (document.getElementById("rr-hover-style")) return;
  const e = document.createElement("style");
  ((e.id = "rr-hover-style"),
    (e.textContent = `
    .${SF_HOVER_CLASS} {
      position: absolute;
      bottom: 12px; right: 12px;
      display: flex; flex-direction: column; gap: 8px;
      align-items: flex-end;
      opacity: 0;
      pointer-events: none;
      z-index: 10;
    }

    /* Show on anchor hover \u2014 CSS keeps IG's KPI layer alive */
    a[${SF_HOVER_ATTR}]:hover .${SF_HOVER_CLASS} {
      opacity: 1;
      pointer-events: auto;
    }

    .rr-hover-btn {
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

    .rr-hover-btn:hover {
      border-color: rgba(34, 211, 238, 0.6);
      background: rgba(0, 0, 0, 0.92);
    }

    .rr-hover-btn img {
      width: 16px;
      height: 16px;
      display: block;
      filter: brightness(0) invert(1);
      opacity: 0.9;
      transition: opacity 150ms ease, filter 150ms ease;
    }

    .rr-hover-btn:hover img {
      opacity: 1;
      filter: brightness(0) saturate(100%) invert(72%) sepia(98%) saturate(400%)
        hue-rotate(155deg) brightness(105%);
    }

    .rr-hover-tip {
      position: absolute; top: 50%; left: -6px;
      transform: translate(-100%, -50%);
      background: rgba(5, 10, 12, 0.96);
      border: 1px solid rgba(34, 211, 238, 0.25);
      color: #e8f8fc; font-size: 0.75rem; line-height: 1;
      padding: 4px 8px; border-radius: 6px; white-space: nowrap;
      opacity: 0; pointer-events: none; z-index: 99999;
      box-shadow: 0 8px 18px rgba(0, 0, 0, 0.35); transition: opacity 120ms ease;
    }

    .rr-hover-btn:hover .rr-hover-tip {
      opacity: 1;
    }
  `),
    document.head.appendChild(e));
}
function makeButton(e, t, o) {
  const n = document.createElement("div");
  ((n.className = "rr-hover-btn"),
    setInstagramActionData(n, {
      mediaId: e,
      mediaType: o ? "reels" : "posts",
      profileName: t,
    }));
  const a = document.createElement("img");
  a.src = chrome.runtime.getURL("Icons/Hover/arrowDownBlack.png");
  const i = document.createElement("div");
  return (
    (i.className = "rr-hover-tip"),
    (i.textContent = "Download"),
    n.appendChild(a),
    n.appendChild(i),
    n
  );
}
function injectHoverButtons(e, t, o) {
  if (e.hasAttribute(SF_HOVER_ATTR)) return;
  e.setAttribute(SF_HOVER_ATTR, "true");
  const n = shortcodeToMediaId(t),
    a = getProfileName(),
    i = document.createElement("div");
  if (
    ((i.className = SF_HOVER_CLASS),
    sfIgDownloadEnabled && i.appendChild(makeButton(n, a, o)),
    !i.hasChildNodes())
  )
    return;
  const c = e.querySelector("._aajz");
  c ? c.appendChild(i) : e.appendChild(i);
}
function injectIntoAllTiles() {
  if (
    !isSupportedPage() ||
    sessionStorage.getItem("sortFeedStatus") === "true" ||
    !sfIgDownloadEnabled
  )
    return;
  Array.from(document.querySelectorAll("a[href]"))
    .filter((t) => /\/(p|reel)\/[^\/]+\//.test(t.getAttribute("href") || ""))
    .forEach((t) => {
      const n = t.getAttribute("href").match(/\/(p|reel)\/([^\/]+)\//);
      if (!n) return;
      const a = n[2];
      if (t.hasAttribute(SF_HOVER_ATTR)) return;
      const i = detectIsReel(t);
      injectHoverButtons(t, a, i);
    });
}
function removeAllHoverButtons() {
  (document.querySelectorAll(`.${SF_HOVER_CLASS}`).forEach((e) => e.remove()),
    document
      .querySelectorAll(`[${SF_HOVER_ATTR}]`)
      .forEach((e) => e.removeAttribute(SF_HOVER_ATTR)));
}
let lastPath = window.location.pathname,
  injectTimer = null;
const sfHoverObserver = new MutationObserver(() => {
  (window.location.pathname !== lastPath &&
    ((lastPath = window.location.pathname), removeAllHoverButtons()),
    clearTimeout(injectTimer),
    (injectTimer = setTimeout(injectIntoAllTiles, 300)));
});
window.addEventListener("message", (e) => {
  e.data && e.data.sf_sort_started && removeAllHoverButtons();
});
function start() {
  (ensureHoverStyle(),
    sfHoverObserver.observe(document.body, { childList: !0, subtree: !0 }),
    injectIntoAllTiles());
}
(document.body ? start() : document.addEventListener("DOMContentLoaded", start),
  (function () {
    const e = "rr-sp-pill";
    let t = !0;
    (chrome.storage.local.get(["sortfeed_ig_download_enabled"], (g) => {
      g.sortfeed_ig_download_enabled === !1 && (t = !1);
    }),
      chrome.storage.onChanged.addListener((g) => {
        "sortfeed_ig_download_enabled" in g &&
          ((t = g.sortfeed_ig_download_enabled.newValue !== !1), P(), Y());
      }));
    function n() {
      return /\/(p|reel|reels)\/[^\/]+\/?$/.test(window.location.pathname);
    }
    function a() {
      const g = window.location.pathname.match(/\/(p|reel|reels)\/([^\/]+)/);
      return g ? g[2] : null;
    }
    function i() {
      return /\/(reel|reels)\//.test(window.location.pathname);
    }
    function c(g) {
      const C =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";
      let S = BigInt(0);
      for (const k of g) {
        const B = C.indexOf(k);
        B !== -1 && (S = S * BigInt(64) + BigInt(B));
      }
      return S.toString();
    }
    const l = [
      "explore",
      "reels",
      "reel",
      "p",
      "direct",
      "accounts",
      "stories",
      "notifications",
    ];
    function m() {
      const g = window.location.pathname.match(/^\/([^\/]+)\/(p|reel)\//);
      if (g) return g[1];
      const C = a();
      if (C) {
        const h = document.querySelector(`a[href*="/${C}/"]`);
        if (h) {
          const w = (h.getAttribute("href") || "").match(
            /^\/([^\/]+)\/(p|reel|reels)\//,
          );
          if (w) return w[1];
        }
      }
      const S = document.querySelectorAll('a[role="link"][href*="/reels/"]');
      for (const h of S) {
        const w = (h.getAttribute("href") || "").match(/^\/([^\/]+)\/reels\//);
        if (w && !l.includes(w[1])) return w[1];
      }
      const k = document.querySelectorAll('img[alt*="profile picture"]');
      for (const h of k) {
        const w = (h.getAttribute("alt") || "").match(
          /^([^']+)'s profile picture/,
        );
        if (w) {
          const $ = w[1].trim();
          if ($ && !l.includes($)) return $;
        }
      }
      const B = document.querySelectorAll('header a[href*="/"]');
      for (const h of B) {
        const w = (h.getAttribute("href") || "").match(/^\/([^\/]+)\/?$/);
        if (w && !l.includes(w[1])) return w[1];
      }
      const N = document.querySelector(
        'a[role="link"][href^="/"][tabindex="0"]',
      );
      if (N) {
        const y = (N.getAttribute("href") || "").match(/^\/([^\/]+)\/?$/);
        if (y && !l.includes(y[1])) return y[1];
      }
      return "";
    }
    function r() {
      if (document.getElementById("rr-sp-style")) return;
      const g = document.createElement("style");
      ((g.id = "rr-sp-style"),
        (g.textContent = `
      @keyframes rr-sp-fadein {
        from { opacity: 0; transform: scale(0.88); }
        to   { opacity: 1; transform: scale(1); }
      }

      #${e} {
        position: absolute;
        top: 10px;
        right: 10px;
        display: flex;
        flex-direction: column;
        gap: 8px;
        align-items: flex-end;
        z-index: 10;
        animation: rr-sp-fadein 350ms cubic-bezier(0.16, 1, 0.3, 1) both;
      }

      .rr-sp-btn {
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

      .rr-sp-btn:hover {
        border-color: rgba(34, 211, 238, 0.6);
        background: rgba(0, 0, 0, 0.92);
      }

      .rr-sp-btn img {
        width: 16px;
        height: 16px;
        display: block;
        filter: brightness(0) invert(1);
        opacity: 0.9;
        transition: opacity 150ms ease, filter 150ms ease;
      }

      .rr-sp-btn:hover img {
        opacity: 1;
        filter: brightness(0) saturate(100%) invert(72%) sepia(98%) saturate(400%)
          hue-rotate(155deg) brightness(105%);
      }

      .rr-sp-tip {
        position: absolute;
        top: 50%;
        left: -6px;
        transform: translate(-100%, -50%);
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

      .rr-sp-btn:hover .rr-sp-tip {
        opacity: 1 !important;
      }
    `),
        document.head.appendChild(g));
    }
    function u(g, C, S, k) {
      const B = document.createElement("div");
      B.className = "rr-sp-btn";
      const N = document.createElement("img");
      N.src = chrome.runtime.getURL("Icons/Hover/arrowDownBlack.png");
      const h = document.createElement("div");
      return (
        (h.className = "rr-sp-tip"),
        (h.textContent = "Download"),
        setInstagramActionData(B, {
          mediaId: g,
          mediaType: k ? "reels" : "posts",
          profileName: S,
          code: C,
        }),
        B.appendChild(N),
        B.appendChild(h),
        B
      );
    }
    function d() {
      if (p()) {
        const h = document.querySelector('div[role="presentation"]');
        if (h) {
          let y = h;
          for (; y.parentElement; ) {
            if (
              ((y = y.parentElement),
              y.getAttribute("role") === "button" && y.hasAttribute("tabindex"))
            ) {
              const w = y.getBoundingClientRect();
              if (w.width > 200 && w.height > 200)
                return { el: y, hasVideo: !!y.querySelector("video") };
            }
            if (y.tagName === "ARTICLE" || y === document.body) break;
          }
          for (y = h; y.parentElement; ) {
            y = y.parentElement;
            const w = y.getBoundingClientRect();
            if (w.width > 200 && w.height > 200)
              return { el: y, hasVideo: !!y.querySelector("video") };
            if (y.tagName === "ARTICLE" || y === document.body) break;
          }
        }
      }
      const g = document.querySelectorAll(
        'div[aria-label="Video player"][role="group"]',
      );
      if (g.length > 1)
        for (const h of g) {
          const y = h.getBoundingClientRect();
          if (y.top >= -100 && y.top < window.innerHeight / 2)
            return { el: h, hasVideo: !0 };
        }
      const C = g[0];
      if (C) return { el: C, hasVideo: !0 };
      const S = document.querySelector("div._aatk");
      if (S) {
        const h = S.querySelector('div[role="button"][tabindex]');
        if (h) return { el: h, hasVideo: !!h.querySelector("video") };
      }
      for (const h of ["article._aatb", "article._ab6k", "article._aalr"]) {
        const y = document.querySelector(h);
        if (y) {
          const w = y.querySelector('div[role="button"][tabindex]');
          if (w) {
            const $ = w.getBoundingClientRect();
            if ($.width > 250 && $.height > 250)
              return { el: w, hasVideo: !!w.querySelector("video") };
          }
        }
      }
      const k = document.querySelector("div._aagu");
      if (k) {
        let h = k;
        for (; h.parentElement; ) {
          if (
            ((h = h.parentElement),
            h.getAttribute("role") === "button" && h.hasAttribute("tabindex"))
          )
            return { el: h, hasVideo: !!h.querySelector("video") };
          if (h.tagName === "ARTICLE" || h === document.body) break;
        }
        for (h = k; h.parentElement; ) {
          h = h.parentElement;
          const y = h.getBoundingClientRect();
          if (y.width > 200 && y.height > 200)
            return { el: h, hasVideo: !!h.querySelector("video") };
          if (h.tagName === "ARTICLE" || h === document.body) break;
        }
        return { el: k, hasVideo: !1 };
      }
      const B = document.querySelector("video");
      if (B) {
        let h = B;
        for (; h.parentElement; ) {
          if (
            ((h = h.parentElement),
            h.getAttribute("role") === "button" && h.hasAttribute("tabindex"))
          ) {
            const y = h.getBoundingClientRect();
            if (y.width > 250 && y.height > 250) return { el: h, hasVideo: !0 };
          }
          if (h === document.body) break;
        }
      }
      const N = document.querySelectorAll('img[crossorigin="anonymous"]');
      for (const h of N) {
        const y = h.getBoundingClientRect();
        if (y.width < 200 || y.height < 200) continue;
        let w = h;
        for (; w.parentElement; ) {
          if (
            ((w = w.parentElement),
            w.getAttribute("role") === "button" && w.hasAttribute("tabindex"))
          )
            return { el: w, hasVideo: !!w.querySelector("video") };
          if (w.tagName === "ARTICLE" || w === document.body) break;
        }
      }
      return null;
    }
    function p() {
      return !!document.querySelector("._acnb");
    }
    const R = "data-rr-reels-injected";
    let M = null;
    function I() {
      return /\/reels\//.test(window.location.pathname);
    }
    function U(g) {
      const C = g.querySelector('a[role="link"][href*="/reels/"]');
      if (C) {
        const k = (C.getAttribute("href") || "").match(/^\/([^\/]+)\/reels\//);
        if (k && !l.includes(k[1])) return k[1];
      }
      const S = g.querySelector('img[alt*="profile picture"]');
      if (S) {
        const k = (S.getAttribute("alt") || "").match(
          /^([^']+)'s profile picture/,
        );
        if (k) return k[1].trim();
      }
      return "";
    }
    function D(g) {
      const C = document.createElement("div");
      C.className = "rr-sp-btn";
      const S = document.createElement("img");
      S.src = chrome.runtime.getURL("Icons/Hover/arrowDownBlack.png");
      const k = document.createElement("div");
      k.className = "rr-sp-tip";
      const B = a() || "",
        N = c(B),
        h = U(g) || m();
      return (
        (k.textContent = "Download"),
        setInstagramActionData(C, {
          mediaId: N,
          mediaType: "reels",
          profileName: h,
          code: B,
        }),
        C.appendChild(S),
        C.appendChild(k),
        C
      );
    }
    function L(g) {
      if (g.hasAttribute(R)) return;
      g.setAttribute(R, "true");
      const C = g.querySelector('div[aria-label="Video player"][role="group"]');
      if (!C) return;
      const S = getComputedStyle(C).position;
      (S === "static" || S === "") && (C.style.position = "relative");
      const k = document.createElement("div");
      ((k.className = "rr-sp-pill-reels"),
        (k.style.cssText = `
      position: absolute; top: 10px; right: 10px;
      display: flex; flex-direction: column; gap: 5px; align-items: flex-end;
      z-index: 10;
      animation: rr-sp-fadein 350ms cubic-bezier(0.16, 1, 0.3, 1) both;
    `),
        t && k.appendChild(D(g)),
        C.appendChild(k));
    }
    function A() {
      const g =
        document.querySelector('div[tabindex="-1"][style*="scroll-snap"]') ||
        document.querySelector('div[tabindex="-1"].x1pq812k');
      if (!g) return !1;
      const C = g.children;
      for (const S of C) S.tagName === "DIV" && L(S);
      return (
        M ||
          ((M = new MutationObserver((S) => {
            for (const k of S)
              for (const B of k.addedNodes)
                B.nodeType === 1 &&
                  B.tagName === "DIV" &&
                  setTimeout(() => L(B), 200);
          })),
          M.observe(g, { childList: !0 })),
        !0
      );
    }
    function F() {
      (M && (M.disconnect(), (M = null)),
        document
          .querySelectorAll(".rr-sp-pill-reels")
          .forEach((g) => g.remove()),
        document
          .querySelectorAll(`[${R}]`)
          .forEach((g) => g.removeAttribute(R)));
    }
    function H() {
      const g = document.getElementById(e);
      return g && document.body.contains(g);
    }
    function z() {
      if (!n() || !t) return !1;
      if (I()) return A();
      if (H()) return !0;
      P();
      const g = a();
      if (!g) return !1;
      const C = d();
      if (!C) return !1;
      const { el: S, hasVideo: k } = C,
        B = getComputedStyle(S).position;
      (B === "static" || B === "") && (S.style.position = "relative");
      const N = c(g),
        h = m(),
        y = i() || k,
        $ = document.createElement("div");
      return (
        ($.id = e),
        $.appendChild(u(N, g, h, y)),
        S.appendChild($),
        !0
      );
    }
    function P() {
      const g = document.getElementById(e);
      (g && g.remove(), F());
    }
    let q = null;
    function Y() {
      if ((X(), !n())) return;
      let g = 0;
      const C = 25;
      function S() {
        g >= C || (n() && (g++, z() || (q = setTimeout(S, 150))));
      }
      S();
    }
    function X() {
      q && (clearTimeout(q), (q = null));
    }
    let J = location.pathname;
    function G() {
      setTimeout(() => {
        location.pathname !== J && ((J = location.pathname), X(), P(), Y());
      }, 0);
    }
    const Q = history.pushState;
    history.pushState = function () {
      (Q.apply(this, arguments), G());
    };
    const Z = history.replaceState;
    ((history.replaceState = function () {
      (Z.apply(this, arguments), G());
    }),
      window.addEventListener("popstate", G));
    let W = null;
    const ee = new MutationObserver(() => {
      (clearTimeout(W),
        (W = setTimeout(() => {
          n() && !H() && Y();
        }, 100)));
    });
    function K() {
      (r(), ee.observe(document.body, { childList: !0, subtree: !0 }), Y());
    }
    document.body ? K() : document.addEventListener("DOMContentLoaded", K);
  })());
function csvEscape(e) {
  const t = e == null ? "" : String(e);
  return t.includes(",") ||
    t.includes('"') ||
    t.includes(`
`)
    ? '"' + t.replace(/"/g, '""') + '"'
    : t;
}
function exportToCSV(e = null, t = null, o = null) {
  if (o === "Posts") {
    const a = [
      "Profile",
      "Post",
      "Create Date",
      "Likes",
      "Comments",
      "Caption",
    ];
    const i = t.map((r) => {
        const u = [1, 8].includes(r.mediaType)
            ? `https://www.instagram.com/${r.userName}/p/${r.code}/`
            : `https://www.instagram.com/${r.userName}/reel/${r.code}/`,
          d = r.createDate ? r.createDate.slice(0, 10) : "",
          p = [
            csvEscape(r.userName),
            csvEscape(u),
            d,
            r.likesCount,
            r.commentsCount,
            csvEscape(r.caption),
          ];
        return p;
      }),
      c = [a, ...i].map((r) => r.join(",")).join(`
`),
      l = new Blob([c], { type: "text/csv;charset=utf-8;" }),
      m = document.createElement("a");
    if (m.download !== void 0) {
      const r = URL.createObjectURL(l);
      (m.setAttribute("href", r),
        m.setAttribute("download", `${e}_${t.length}_${o.toLowerCase()}.csv`),
      (m.style.visibility = "hidden"),
        document.body.appendChild(m),
        m.click(),
        document.body.removeChild(m));
    }
  } else if (o === "Reels") {
    const a = ["Profile", "Reel", "Views", "Likes", "Comments"];
    const i = t.map((r) => {
        const u = `https://www.instagram.com/${r.userName}/reel/${r.code}/`,
          d = [r.userName, u, r.viewCount, r.likesCount, r.commentsCount];
        return d;
      }),
      c = [a, ...i].map((r) => r.join(",")).join(`
`),
      l = new Blob([c], { type: "text/csv;charset=utf-8;" }),
      m = document.createElement("a");
    if (m.download !== void 0) {
      const r = URL.createObjectURL(l);
      (m.setAttribute("href", r),
        m.setAttribute("download", `${e}_${t.length}_${o.toLowerCase()}.csv`),
        (m.style.visibility = "hidden"),
        document.body.appendChild(m),
        m.click(),
        document.body.removeChild(m));
    }
  }
}
chrome.runtime.onMessage.addListener((e, t, o) => {
  if (e.export_click_background && e.export_format === "csv") {
    let n = e.sorted_data[0].userName,
      a = e.sorted_data,
      i = e.posts_vs_reels;
    exportToCSV(n, a, i);
  }
});
function exportToJSON(e = null, t = null, o = null) {
  const n = `${e}_${t.length}_${o.toLowerCase()}.json`,
    a = t.map((r) => {
      if (o === "Posts") {
        const u = [1, 8].includes(r.mediaType)
            ? `https://www.instagram.com/${r.userName}/p/${r.code}/`
            : `https://www.instagram.com/${r.userName}/reel/${r.code}/`,
          d = new Date(r.createDate).toLocaleString("en-US", {
            year: "numeric",
            month: "numeric",
            day: "numeric",
            hour: "numeric",
            minute: "2-digit",
            second: "2-digit",
            hour12: !0,
          }),
          p = {
            Profile: r.userName,
            Post: u,
            "Create Date": d,
            Likes: r.likesCount,
            Comments: r.commentsCount,
            Captions: r.caption,
          };
        return p;
      }
      if (o === "Reels") {
        const u = `https://www.instagram.com/${r.userName}/reel/${r.code}/`,
          d = {
            Profile: r.userName,
            Reel: u,
            Views: r.viewCount,
            Likes: r.likesCount,
            Comments: r.commentsCount,
          };
        return d;
      }
      return {};
    }),
    i = new Blob([JSON.stringify(a, null, 2)], {
      type: "application/json;charset=utf-8;",
    }),
    c = document.createElement("a"),
    l = URL.createObjectURL(i);
  (c.setAttribute("href", l),
    c.setAttribute("download", n),
    (c.style.visibility = "hidden"),
    document.body.appendChild(c),
    c.click(),
    document.body.removeChild(c));
}
chrome.runtime.onMessage.addListener((e, t, o) => {
  if (e.export_click_background && e.export_format === "json") {
    const n = e.sorted_data[0].userName,
      a = e.sorted_data,
      i = e.posts_vs_reels;
    exportToJSON(n, a, i);
  }
});
function exportToExcel(e = null, t = null, o = null) {
  let n = [],
    a = [];
  o === "Posts"
    ? ((n = [
        "Profile",
        "Post",
        "Create Date",
        "Likes",
        "Comments",
        "Captions",
      ]),
      (a = t.map((u) => {
        const d = [1, 8].includes(u.mediaType)
            ? `https://www.instagram.com/${u.userName}/p/${u.code}/`
            : `https://www.instagram.com/${u.userName}/reel/${u.code}/`,
          p = new Date(u.createDate).toLocaleString("en-US", {
            year: "numeric",
            month: "numeric",
            day: "numeric",
            hour: "numeric",
            minute: "2-digit",
            second: "2-digit",
            hour12: !0,
          }),
          b = [u.userName, d, p, u.likesCount, u.commentsCount, u.caption];
        return b;
      })))
    : o === "Reels" &&
      ((n = ["Profile", "Reel", "Views", "Likes", "Comments"]),
      (a = t.map((u) => {
        const d = `https://www.instagram.com/${u.userName}/reel/${u.code}/`,
          p = [u.userName, d, u.viewCount, u.likesCount, u.commentsCount];
        return p;
      })));
  const c = [n, ...a],
    l = XLSX.utils.aoa_to_sheet(c),
    m = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(m, l, o);
  const r = `${e}_${t.length}_${o.toLowerCase()}.xlsx`;
  XLSX.writeFile(m, r);
}
(chrome.runtime.onMessage.addListener((e, t, o) => {
  if (e.export_click_background && e.export_format === "excel") {
    const n = e.sorted_data[0].userName,
      a = e.sorted_data,
      i = e.posts_vs_reels;
    exportToExcel(n, a, i);
  }
}),
  window.addEventListener("message", (e) => {
    const t = e.data;
    if (t && t.download && t.download_item === "reels") {
      if (document.querySelector(".download-reel-banner")) return;
      (show_downloading_reel_banner(t.download_profile_name, "0% Downloaded"),
        get_reel_download_url(
          t.download_reel_id,
          t.download_profile_name,
          t.download_code || "",
        ));
    } else if (t && t.download && t.download_item === "posts") {
      if (document.querySelector(".download-reel-banner")) return;
      get_post_download_url(
        t.download_post_id,
        t.download_profile_name,
        t.download_code || "",
      );
    }
  }));
async function get_post_download_url(e, t, o) {
  const n = `https://www.instagram.com/api/v1/media/${e}/info/`;
  try {
    const a = await fetch(n, {
      method: "GET",
      credentials: "include",
      headers: {
        "x-ig-app-id": "936619743392459",
        "x-ig-www-claim": window._sharedData?.config?.csrf_token || "",
      },
    });
    if (!a.ok) throw new Error(`Failed: ${a.status}`);
    const i = await a.json();
    o || (o = i.items?.[0]?.code || "");
    const { carouselFlag: c, ReelFlag: l } = check_if_carousell(i);
    if (!c && l) {
      show_downloading_reel_banner(i.download_profile_name, "0% Downloaded");
      const m = i.items?.[0]?.video_versions?.[0]?.url;
      m &&
        (await actually_download_reel(m, t, o)) &&
        unshow_downloading_reel_banner();
    } else if (!c && !l) {
      show_downloading_reel_banner(i.download_profile_name, "0% Downloaded");
      const m = i.items[0].image_versions2.candidates[0].url;
      m &&
        (await actually_download_post(m, t, o)) &&
        unshow_downloading_reel_banner();
    } else if (c) {
      const m = i.items[0].carousel_media,
        r = m.length;
      show_downloading_reel_banner(i.download_profile_name, "0% Downloaded");
      const u = [];
      for (let d = 0; d < r; d++) {
        const p = m[d],
          b = !!p.video_versions,
          f = b ? p.video_versions[0].url : p.image_versions2.candidates[0].url,
          E = b ? "mp4" : "jpg",
          x = `${t}_${o}_${d + 1}.${E}`,
          v = Math.round((d / r) * 100),
          _ = Math.round(((d + 1) / r) * 100);
        try {
          const T = await fetch(f);
          if (!T.ok) continue;
          const R = T.headers.get("content-length"),
            M = R ? parseInt(R, 10) : 0;
          let I = 0,
            U = v;
          const D = _ - 2,
            L = setInterval(() => {
              U < D && (U++, updateCarouselBanner(U));
            }, 40),
            A = T.body.getReader(),
            F = [];
          for (;;) {
            const { done: P, value: q } = await A.read();
            if (P) break;
            if ((F.push(q), (I += q.length), M > 0)) {
              const Y = Math.round((I / M) * 100);
              ((U = v + Math.round((Y / 100) * (_ - v))),
                updateCarouselBanner(Math.min(U, _ - 1)));
            }
          }
          (clearInterval(L), (U = _), updateCarouselBanner(Math.min(U, 99)));
          const H = E === "mp4" ? "video/mp4" : "image/jpeg",
            z = new Blob(F, { type: H });
          u.push({ name: x, blob: z });
        } catch {}
      }
      if (u.length > 0) {
        const d = await buildZip(u),
          p = URL.createObjectURL(d),
          b = document.createElement("a");
        ((b.href = p),
          (b.download = `${t}_${o}.zip`),
          document.body.appendChild(b),
          b.click(),
          document.body.removeChild(b),
          URL.revokeObjectURL(p));
      }
      unshow_downloading_reel_banner();
    }
    return i;
  } catch (a) {
    return (console.error("Error fetching reel info:", a), null);
  }
}
function check_if_carousell(e) {
  const t = !!e.items?.[0]?.carousel_media_count,
    o = !!e.items?.[0]?.video_versions;
  return { carouselFlag: t, ReelFlag: o };
}
async function get_reel_download_url(e, t, o) {
  const n = `https://www.instagram.com/api/v1/media/${e}/info/`;
  try {
    const a = await fetch(n, {
      method: "GET",
      credentials: "include",
      headers: {
        "x-ig-app-id": "936619743392459",
        "x-ig-www-claim": window._sharedData?.config?.csrf_token || "",
      },
    });
    if (!a.ok) throw new Error(`Failed: ${a.status}`);
    const i = await a.json();
    o || (o = i.items?.[0]?.code || "");
    const c = i.items?.[0]?.video_versions?.[0]?.url;
    return (
      c &&
        (await actually_download_reel(c, t, o)) &&
        unshow_downloading_reel_banner(),
      i
    );
  } catch (a) {
    return (console.error("Error fetching reel info:", a), null);
  }
}
async function actually_download_reel(e, t, o) {
  try {
    const n = await fetch(e);
    if (!n.ok) throw new Error(`Failed to fetch video: ${n.status}`);
    const a = n.headers.get("content-length"),
      i = a ? parseInt(a, 10) : 0;
    let c = 0;
    const l = n.body.getReader(),
      m = [];
    for (;;) {
      const { done: p, value: b } = await l.read();
      if (p) break;
      if ((m.push(b), (c += b.length), i > 0)) {
        const f = document.querySelector(".download-reel-banner"),
          E = Math.round((c / i) * 100);
        if (f) {
          const x = f.querySelector(".message");
          x && (x.innerHTML = `${E}% Downloaded`);
        }
      }
    }
    const r = new Blob(m, { type: "video/mp4" }),
      u = URL.createObjectURL(r),
      d = document.createElement("a");
    return (
      (d.href = u),
      (d.download = `${t}_${o}.mp4`),
      document.body.appendChild(d),
      d.click(),
      document.body.removeChild(d),
      URL.revokeObjectURL(u),
      !0
    );
  } catch (n) {
    return (console.error("Error downloading reel:", n), !1);
  }
}
async function actually_download_post(e, t, o) {
  try {
    const n = await fetch(e);
    if (!n.ok) throw new Error(`Failed to fetch image: ${n.status}`);
    const a = n.headers.get("content-length"),
      i = a ? parseInt(a, 10) : 0;
    let c = 0;
    const l = n.body.getReader(),
      m = [];
    for (;;) {
      const { done: p, value: b } = await l.read();
      if (p) break;
      if ((m.push(b), (c += b.length), i > 0)) {
        const f = document.querySelector(".download-reel-banner"),
          E = Math.round((c / i) * 100);
        if (f) {
          const x = f.querySelector(".message");
          x && (x.innerHTML = `${E}% Downloaded`);
        }
      }
    }
    const r = new Blob(m, { type: "image/jpeg" }),
      u = URL.createObjectURL(r),
      d = document.createElement("a");
    return (
      (d.href = u),
      (d.download = `${t}_${o}.jpg`),
      document.body.appendChild(d),
      d.click(),
      document.body.removeChild(d),
      URL.revokeObjectURL(u),
      !0
    );
  } catch (n) {
    return (console.error("Error downloading post:", n), !1);
  }
}
function show_downloading_reel_banner(e, t) {
  const o = document.createElement("style");
  ((o.textContent = `
  @keyframes slideBounceDown {
    0% { transform: translateY(-120%); opacity: 0; }
    60% { transform: translateY(10px); opacity: 1; }
    80% { transform: translateY(-5px); }
    100% { transform: translateY(0); }
  }

  @keyframes slideBounceUp {
    0% { transform: translateY(0); opacity: 1; }
    20% { transform: translateY(-10px); }
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
    width: 100%;
    box-sizing: border-box;
    background: #ffffff;
    padding: 12px 16px;
    display: flex;
    align-items: center;
    animation: slideBounceDown 0.25s ease;
    border: 1px solid rgba(0, 0, 0, 0.15);
    border-radius: 0.75rem;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
  }

  .download-reel-banner .message {
    font-size: 16px;
    font-weight: 400;
    color: #000;
    flex-grow: 1;
    letter-spacing: 0.01em;
    font-family: SF Pro Display, SF Pro Icons, Helvetica Neue, Helvetica, Arial, sans-serif;
  }

  @media (max-width: 400px) {
    .download-reel-banner { padding: 10px 12px; }
    .download-reel-banner .message { font-size: 14px; }
  }
  `),
    document.head.appendChild(o));
  const n = document.createElement("div");
  ((n.className = "download-reel-banner"),
    (n.innerHTML = `
  <img class="icon" src="${chrome.runtime.getURL("Icons/reelradar-logo.svg")}" alt="" onerror="this.style.display='none'" />
  <div class="message">
      ${t}
  </div>
`),
    _sfGetBannerStack().appendChild(n));
}
function updateCarouselBanner(e) {
  const t = document.querySelector(".download-reel-banner");
  if (!t) return;
  const o = t.querySelector(".message");
  o && (o.innerHTML = `${e}% Downloaded`);
}
function unshow_downloading_reel_banner() {
  const e = document.querySelector(".download-reel-banner");
  e &&
    ((e.style.animation = "slideBounceUp 0.25s ease forwards"),
    setTimeout(() => {
      e.remove();
    }, 250));
}
async function buildZip(e) {
  const t = [],
    o = [];
  let n = 0;
  for (const l of e) {
    const m = new TextEncoder().encode(l.name),
      r = new Uint8Array(await l.blob.arrayBuffer()),
      u = crc32(r),
      d = new ArrayBuffer(30 + m.length),
      p = new DataView(d);
    (p.setUint32(0, 67324752, !0),
      p.setUint16(4, 20, !0),
      p.setUint16(6, 0, !0),
      p.setUint16(8, 0, !0),
      p.setUint16(10, 0, !0),
      p.setUint16(12, 0, !0),
      p.setUint32(14, u, !0),
      p.setUint32(18, r.length, !0),
      p.setUint32(22, r.length, !0),
      p.setUint16(26, m.length, !0),
      p.setUint16(28, 0, !0),
      new Uint8Array(d, 30).set(m));
    const b = new ArrayBuffer(46 + m.length),
      f = new DataView(b);
    (f.setUint32(0, 33639248, !0),
      f.setUint16(4, 20, !0),
      f.setUint16(6, 20, !0),
      f.setUint16(8, 0, !0),
      f.setUint16(10, 0, !0),
      f.setUint16(12, 0, !0),
      f.setUint16(14, 0, !0),
      f.setUint32(16, u, !0),
      f.setUint32(20, r.length, !0),
      f.setUint32(24, r.length, !0),
      f.setUint16(28, m.length, !0),
      f.setUint16(30, 0, !0),
      f.setUint16(32, 0, !0),
      f.setUint16(34, 0, !0),
      f.setUint16(36, 0, !0),
      f.setUint32(38, 0, !0),
      f.setUint32(42, n, !0),
      new Uint8Array(b, 46).set(m),
      t.push(new Uint8Array(d), r),
      o.push(new Uint8Array(b)),
      (n += d.byteLength + r.length));
  }
  const a = o.reduce((l, m) => l + m.length, 0),
    i = new ArrayBuffer(22),
    c = new DataView(i);
  return (
    c.setUint32(0, 101010256, !0),
    c.setUint16(4, 0, !0),
    c.setUint16(6, 0, !0),
    c.setUint16(8, e.length, !0),
    c.setUint16(10, e.length, !0),
    c.setUint32(12, a, !0),
    c.setUint32(16, n, !0),
    c.setUint16(20, 0, !0),
    new Blob([...t, ...o, new Uint8Array(i)], { type: "application/zip" })
  );
}
const crc32Table = (() => {
  const e = new Uint32Array(256);
  for (let t = 0; t < 256; t++) {
    let o = t;
    for (let n = 0; n < 8; n++) o = o & 1 ? 3988292384 ^ (o >>> 1) : o >>> 1;
    e[t] = o;
  }
  return e;
})();
function crc32(e) {
  let t = 4294967295;
  for (let o = 0; o < e.length; o++)
    t = crc32Table[(t ^ e[o]) & 255] ^ (t >>> 8);
  return (t ^ 4294967295) >>> 0;
}
function upgradeProBanner() {
  const e = document.querySelector(".sort-banner");
  if (e) {
    const o = e.querySelector(".message");
    o && (o.innerHTML = "Upgrade to Pro to export");
    return;
  }
  if (!document.getElementById("sort-banner-style")) {
    const o = document.createElement("style");
    ((o.id = "sort-banner-style"),
      (o.textContent = `
      @keyframes slideBounceDown {
        0% { transform: translateY(-120%); opacity: 0; }
        60% { transform: translateY(10px); opacity: 1; }
        80% { transform: translateY(-5px); }
        100% { transform: translateY(0); opacity: 1; }
      }

      @keyframes slideBounceUp {
        0% { transform: translateY(0); opacity: 1; }
        20% { transform: translateY(-10px); }
        100% { transform: translateY(-120%); opacity: 0; }
      }

      .sort-banner {
        width: 100%;
        box-sizing: border-box;
        background: #fff;
        padding: 12px 16px;
        display: flex;
        align-items: center;
        animation: slideBounceDown 0.25s ease;
        border: 1px solid rgba(0,0,0,0.15);
        border-radius: 0.75rem;
        box-shadow: 0 4px 12px rgba(0,0,0,0.12);
        transition: all 0.4s ease;
      }

      .sort-banner.hide {
        animation: slideBounceUp 0.4s ease forwards;
      }

      .sort-banner .iconUpgrade {
        width: 1.1rem !important;
        height: auto !important;
        margin-right: 8px;
      }

      .sort-banner .message {
        font-size: 16px;
        color: #000;
        flex-grow: 1;
        font-family: SF Pro Display, Helvetica Neue, Arial, sans-serif;
      }

      .sort-banner .upgradePro-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 15px;
          color: #fff;              /* white text */
          background-color: #000;   /* black button */
          border: none;             /* no border */
          border-radius: 10px;
          cursor: pointer;
          font-weight: 400;
          padding: 8px 16px;
          font-family: "SF Pro Display", "Helvetica Neue", Arial, sans-serif;
          transition: all 0.05s ease;
          backdrop-filter: blur(2px);          /* slight glassy feel */          
      }

      .sort-banner .upgradePro-btn img {
        width: 12px;
        height: 12px;
        filter: invert(1);
      }

      .sort-banner .upgradePro-btn:hover {
          opacity: 0.85;
      }

      @media (max-width: 400px) {
        .sort-banner { padding: 10px 12px; }
        .sort-banner .message,
        .sort-banner .upgradePro-btn { font-size: 14px; }
      }
    `),
      document.head.appendChild(o));
  }
  const t = document.createElement("div");
  ((t.className = "sort-banner"),
    (t.innerHTML = `
    <div class="message">Upgrade to Pro to export selected items</div>
    <button class="upgradePro-btn">
      <img src="${chrome.runtime.getURL("Icons/ZeroStateIcons/black_star.svg")}" alt="star" />
      Dismiss
    </button>
  `),
    t.querySelector(".upgradePro-btn").addEventListener("click", () => {
      t.remove();
    }),
    _sfGetBannerStack().appendChild(t),
    setTimeout(() => {
      (t.classList.add("hide"), setTimeout(() => t.remove(), 400));
    }, 5e3));
}
