const DBUG = !1;
function slideIn(e, t) {
  (e.classList.remove(
    "animate__animated",
    "animate__slideInLeft",
    "animate__slideInRight",
  ),
    e.offsetWidth,
    e.classList.add(
      "animate__animated",
      t === "left" ? "animate__slideInLeft" : "animate__slideInRight",
    ),
    e.style.setProperty("--animate-duration", ".2s"),
    e.addEventListener(
      "animationend",
      () => {
        e.classList.remove(
          "animate__animated",
          "animate__slideInLeft",
          "animate__slideInRight",
        );
      },
      { once: !0 },
    ));
}
function handleWarningLabelTikTok() {
  const e = document.getElementById("itemButtonTikTok"),
    t = document.getElementById("dateRangeButtonTikTok"),
    n = document.getElementById("no_reels_selected_tiktok"),
    o = document.getElementById("dates_selected_tiktok"),
    l = document.getElementById("tiktokItemsWarning");
  let i = "item";
  function a() {}
  (e.addEventListener("click", function () {
    i = "item";
  }),
    t.addEventListener("click", function () {
      i = "date";
    }),
    n.addEventListener("change", function () {
      i === "item" && void 0;
    }),
    o.addEventListener("change", function () {
      i === "date" && void 0;
    }));
}
function handleWarningLabelInsta() {
  const e = document.getElementById("itemButton"),
    t = document.getElementById("dateRangeButton"),
    n = document.getElementById("no_reels_selected"),
    o = document.getElementById("dates_selected"),
    l = document.getElementById("instaItemsWarning"),
    i = document.getElementById("OnlyWorksPosts");
  let a = "item";
  function s() {
    a === "date" && ((i.style.display = "inline"), (l.style.display = "none"));
  }
  (e.addEventListener("click", function () {
    ((a = "item"), s());
  }),
    t.addEventListener("click", function () {
      ((a = "date"), s());
    }),
    n.addEventListener("change", function () {
      a === "item" && s();
    }),
    o.addEventListener("change", function () {
      a === "date" && s();
    }),
    s());
}
document.addEventListener("DOMContentLoaded", function () {
  (feature_banner(),
    chrome.tabs.query({ active: !0, currentWindow: !0 }, function (e) {
      let n = e[0].url;
      n.startsWith("https://www.instagram.com")
        ? (insta_mode_on(), feature_banner("insta"))
        : n.startsWith("https://www.tiktok.com")
          ? (tiktok_mode_on(),
            checkUserStatus((o) => {
              o && feature_banner("tiktok");
            }))
          : (zero_state_on(), feature_banner("zero"));
    }));
});
var dateRangeButtonTikTok = document.getElementById("dateRangeButtonTikTok");
dateRangeButtonTikTok.addEventListener("click", function () {
  (document
    .getElementById("dates_selected_tiktok")
    .setAttribute("active", "on"),
    (dateRangeButtonTikTok.className = "itemButtonClassTikTok"));
  var e = document.getElementById("itemButtonTikTok");
  ((e.className = "dateRangeButtonClassTikTok"),
    document
      .getElementById("no_reels_selected_tiktok")
      .setAttribute("active", "off"));
  const t = document.getElementById("sf-dd-tt-items"),
    n = document.getElementById("sf-dd-tt-dates");
  (t && (t.style.display = "none"),
    n && ((n.style.display = "flex"), slideIn(n, "right")),
    localStorage.setItem("sf_tt_sub_tab", "date"));
});
var itemButtonTikTok = document.getElementById("itemButtonTikTok");
itemButtonTikTok.addEventListener("click", function () {
  if (
    document
      .getElementById("no_reels_selected_tiktok")
      .getAttribute("active") !== "on"
  ) {
    (document
      .getElementById("no_reels_selected_tiktok")
      .setAttribute("active", "on"),
      (itemButtonTikTok.className = "itemButtonClassTikTok"));
    var e = document.getElementById("dateRangeButtonTikTok");
    ((e.className = "dateRangeButtonClassTikTok"),
      document
        .getElementById("dates_selected_tiktok")
        .setAttribute("active", "off"));
    const t = document.getElementById("sf-dd-tt-items"),
      n = document.getElementById("sf-dd-tt-dates");
    (n && (n.style.display = "none"),
      t && ((t.style.display = "flex"), slideIn(t, "left")),
      localStorage.setItem("sf_tt_sub_tab", "item"));
  }
});
var dateRangeButton = document.getElementById("dateRangeButton");
dateRangeButton.addEventListener("click", function () {
  (document.getElementById("dates_selected").setAttribute("active", "on"),
    (dateRangeButton.className = "itemButtonClass"));
  var e = document.getElementById("itemButton");
  ((e.className = "dateRangeButtonClass"),
    document.getElementById("no_reels_selected").setAttribute("active", "off"));
  const t = document.getElementById("sf-dd-ig-items"),
    n = document.getElementById("sf-dd-ig-dates");
  (t && (t.style.display = "none"),
    n && ((n.style.display = "flex"), slideIn(n, "right")));
  var o = document.getElementById("OnlyWorksPosts");
  ((o.textContent = "Sorting by date only works in the posts tab"),
    (o.style.display = "flex"),
    localStorage.setItem("sf_ig_sub_tab", "date"));
});
var itemsButton = document.getElementById("itemButton");
itemsButton.addEventListener("click", function () {
  if (
    document.getElementById("no_reels_selected").getAttribute("active") !== "on"
  ) {
    (document.getElementById("no_reels_selected").setAttribute("active", "on"),
      (itemsButton.className = "itemButtonClass"));
    var e = document.getElementById("dateRangeButton");
    ((e.className = "dateRangeButtonClass"),
      document.getElementById("dates_selected").setAttribute("active", "off"));
    const t = document.getElementById("sf-dd-ig-items"),
      n = document.getElementById("sf-dd-ig-dates");
    (n && (n.style.display = "none"),
      t && ((t.style.display = "flex"), slideIn(t, "left")));
    const o = document.getElementById("OnlyWorksPosts");
    (o && (o.style.display = "none"),
      localStorage.setItem("sf_ig_sub_tab", "item"));
  }
});
var igSortTab = document.getElementById("igSortTab"),
  igDownloadTab = document.getElementById("igDownloadTab");
(igDownloadTab.addEventListener("click", function () {
  if (igSortTab.className === "itemButtonClass") {
    ((igSortTab.className = "dateRangeButtonClass"),
      (igDownloadTab.className = "itemButtonClass"));
    const e = document.getElementById("igSortContent"),
      t = document.getElementById("igDownloadContent");
    ((e.style.display = "none"),
      (t.style.display = "flex"),
      slideIn(t, "right"),
      localStorage.setItem("sf_ig_main_tab", "download"));
  }
}),
  igSortTab.addEventListener("click", function () {
    if (igDownloadTab.className === "itemButtonClass") {
      ((igDownloadTab.className = "dateRangeButtonClass"),
        (igSortTab.className = "itemButtonClass"));
      const e = document.getElementById("igSortContent"),
        t = document.getElementById("igDownloadContent");
      ((t.style.display = "none"),
        (e.style.display = "flex"),
        slideIn(e, "left"),
        localStorage.setItem("sf_ig_main_tab", "sort"));
    }
  }));
var ttSortTab = document.getElementById("ttSortTab"),
  ttDownloadTab = document.getElementById("ttDownloadTab");
(ttDownloadTab.addEventListener("click", function () {
  if (ttSortTab.className === "itemButtonClassTikTok") {
    ((ttSortTab.className = "dateRangeButtonClassTikTok"),
      (ttDownloadTab.className = "itemButtonClassTikTok"));
    const e = document.getElementById("ttSortContent"),
      t = document.getElementById("ttDownloadContent");
    ((e.style.display = "none"),
      (t.style.display = "flex"),
      slideIn(t, "right"),
      localStorage.setItem("sf_tt_main_tab", "download"));
  }
}),
  ttSortTab.addEventListener("click", function () {
    if (ttDownloadTab.className === "itemButtonClassTikTok") {
      ((ttDownloadTab.className = "dateRangeButtonClassTikTok"),
        (ttSortTab.className = "itemButtonClassTikTok"));
      const e = document.getElementById("ttSortContent"),
        t = document.getElementById("ttDownloadContent");
      ((t.style.display = "none"),
        (e.style.display = "flex"),
        slideIn(e, "left"),
        localStorage.setItem("sf_tt_main_tab", "sort"));
    }
  }));
function handleTikTokSortClick(e) {
  const t = document.getElementById("no_reels_selected_tiktok"),
    n = document.getElementById("dates_selected_tiktok");
  if (t.getAttribute("active") === "on") {
    const o = t.value;
    chrome.runtime.sendMessage({
      refresh: "ON_TikTok",
      sort_by: e,
      no_items: o,
      dates_items: "items",
    });
  } else if (n.getAttribute("active") === "on") {
    const o = n.value;
    chrome.tabs.query({ active: !0, currentWindow: !0 }, () => {
      chrome.runtime.sendMessage({
        refresh: "ON_TikTok",
        sort_by: e,
        no_items: o,
        dates_items: "dates",
      });
    });
  }
}
(document
  .getElementById("sortViewsClickTikTok")
  ?.addEventListener("click", () => handleTikTokSortClick("views")),
  document
    .getElementById("sortLikesClickTikTok")
    ?.addEventListener("click", () => handleTikTokSortClick("likes")),
  document
    .getElementById("sortCommentsClickTikTok")
    ?.addEventListener("click", () => handleTikTokSortClick("comments")),
  document
    .getElementById("sortOldestClicksTikTok")
    ?.addEventListener("click", () => handleTikTokSortClick("oldest")),
  document
    .getElementById("sortSavesClickTikTok")
    ?.addEventListener("click", () => handleTikTokSortClick("saves")),
  document
    .getElementById("sortSharesClickTikTok")
    ?.addEventListener("click", () => handleTikTokSortClick("shares")));
function handleInstagramSortClick(e) {
  const t = document.getElementById("no_reels_selected"),
    n = document.getElementById("dates_selected");
  if (t.getAttribute("active") === "on") {
    const o = t.value;
    chrome.runtime.sendMessage({
      refresh: "ON",
      sort_by: e,
      no_items: o,
      dates_items: "items",
    });
  } else if (n.getAttribute("active") === "on") {
    const o = n.value;
    chrome.runtime.sendMessage({
      refresh: "ON",
      sort_by: e,
      no_items: o,
      dates_items: "dates",
    });
  }
}
(document
  .getElementById("sortViewsClick")
  ?.addEventListener("click", () => handleInstagramSortClick("views")),
  document
    .getElementById("sortLikesClick")
    ?.addEventListener("click", () => handleInstagramSortClick("likes")),
  document
    .getElementById("sortCommentsClick")
    ?.addEventListener("click", () => handleInstagramSortClick("comments")),
  document
    .getElementById("sortOldestClicks")
    ?.addEventListener("click", () => handleInstagramSortClick("oldest")));
function checkUserStatus(e) {
  chrome.runtime.sendMessage({ command: "checkProStatus" }, (t) => {
    const n = t?.isPro;
    e(n);
  });
}
function add_be_back_message() {}
function insta_mode_off() {
  let e = document.getElementsByClassName("InstaMain")[0];
  e && (e.style.display = "none");
}
function tiktok_mode_off() {
  let e = document.getElementsByClassName("TikTokMain")[0];
  e && (e.style.display = "none");
}
function zero_state_off() {
  let e = document.getElementsByClassName("main_nav_div_zero_state")[0];
  e && (e.style.display = "none");
}
function zero_state_on() {
  (insta_mode_off(), tiktok_mode_off(), enableTikTokSection());
  let e = document.getElementsByClassName("main_nav_div_zero_state")[0];
  e && (e.style.display = "flex");
}
function ensureExitAnimStyle() {
  if (document.getElementById("sf-exit-style")) return;
  const e = document.createElement("style");
  ((e.id = "sf-exit-style"),
    (e.textContent = `
    @keyframes sfExitRight {
      0%   { transform: translateX(0); opacity: 1; filter: none; }
      40%  { transform: translateX(10px); opacity: 0.9; filter: blur(0.3px); }
      100% { transform: translateX(120%); opacity: 0; filter: blur(1px); }
    }
    .sf-exit-right {
      animation: sfExitRight 0.35s cubic-bezier(.22,1,.36,1) forwards;
      will-change: transform, opacity, filter;
    }
  `),
    document.head.appendChild(e));
}
function feature_banner(e) {
  const t = document.querySelector(".footer_div_again_sub_feature");
  if (!t) return;
  const n = t.querySelector(".close_banner_icon"),
    o = t.querySelector(".footer_text_again_subheader_sub_bottom"),
    l = t.querySelector(".sf_banner__partyIcon__v1");
  if (!n || !o) return;
  const a = {
    zero: {
      key: "bannerClosed_zero_state_v7",
      html: "Open any post, reel, or TikTok URL to download media",
    },
    insta: {
      key: "bannerClosed_instagram_v7",
      html: "Open any post or reel URL to download media",
    },
    tiktok: {
      key: "bannerClosed_tiktok_v8",
      html: "Open any TikTok URL to download media",
    },
  }[e];
  if (!a) {
    t.style.display = "none";
    return;
  }
  const s = new Date("2026-08-01"),
    d = new Date();
  if (localStorage.getItem(a.key) === "true" || d >= s) {
    t.style.display = "none";
    return;
  }
  ((t.style.display = "flex"), (o.innerHTML = a.html));
  const c = `bound_${e}`;
  t.dataset[c] ||
    ((t.dataset[c] = "1"),
    n.addEventListener("click", () => {
      (localStorage.setItem(a.key, "true"),
        ensureExitAnimStyle(),
        t.classList.add("sf-exit-right"));
      const r = () => {
        ((t.style.display = "none"), t.classList.remove("sf-exit-right"));
      };
      (t.addEventListener("animationend", r, { once: !0 }), setTimeout(r, 600));
    }));
}
function disableTikTokSection() {
  const e = document.querySelector(".TikTokMain");
}
function enableTikTokSection() {
  const e = document.querySelector(".TikTokMain");
  e && e.classList.remove("sf-section-disabled");
}
function insta_mode_on() {
  (zero_state_off(),
    tiktok_mode_off(),
    enableTikTokSection(),
    default_sort_selection());
  let e = document.getElementsByClassName("InstaMain")[0];
  (e && (e.style.display = "flex"),
    localStorage.getItem("sf_ig_main_tab") === "download" &&
      igDownloadTab.click(),
    localStorage.getItem("sf_ig_sub_tab") === "date" &&
      dateRangeButton.click());
}
function showTikTokDowntimeBanner() {
  const e = document.querySelector(".footer_div_again_sub_feature");
  e &&
    ((e.style.display = "flex"),
    (e.innerHTML = `
    <div class="footer_text_with_icon">

      <!-- intentionally no starsIcon -->
      <p class="footer_text_again_subheader_sub_bottom">
        Seeing "Something went wrong" after heavy sorting? Clearing TikTok site data usually fixes it.
      </p>

      <!-- intentionally no close button -->
      <img src="Icons/close_banner.png" class="close_banner_icon" alt="Close" />

    </div>
  `));
}
function setTikTokDefaults() {
  const e = document.getElementById("no_reels_selected_tiktok"),
    t = document.getElementById("dates_selected_tiktok");
  (e && e.setAttribute("active", "on"),
    t && t.setAttribute("active", "off"),
    e && (e.style.display = "flex"),
    t && (t.style.display = "none"));
}
function tiktok_mode_on() {
  (zero_state_off(), insta_mode_off());
  const e = document.getElementsByClassName("TikTokMain")[0];
  (e && (e.style.display = "flex"),
    default_sort_selection(),
    localStorage.getItem("sf_tt_main_tab") === "download" &&
      ttDownloadTab.click(),
    localStorage.getItem("sf_tt_sub_tab") === "date" &&
      dateRangeButtonTikTok.click());
  const t = document.getElementById("tiktokItemsWarning");
  t && (t.style.display = "none");
}
var instaButton = document.getElementById("instaButton");
instaButton.addEventListener("click", function () {
  chrome.tabs.query({ active: !0, currentWindow: !0 }, function (e) {
    chrome.runtime.sendMessage({ zero_state: "instagram" });
  });
});
var tiktokButton = document.getElementById("tiktokButton");
(tiktokButton.addEventListener("click", function () {
  chrome.tabs.query({ active: !0, currentWindow: !0 }, function (e) {
    chrome.runtime.sendMessage({ zero_state: "tiktok" });
  });
}),
  document.addEventListener("DOMContentLoaded", () => {
    const e = document.getElementById("footerMenuBtn"),
      t = document.getElementById("footerMenu");
    if (!e || !t) return;
    const n = () => {
        (t.classList.remove("sf-hidden"),
          e.setAttribute("aria-expanded", "true"),
          t.setAttribute("aria-hidden", "false"));
      },
      o = () => {
        (t.classList.add("sf-hidden"),
          e.setAttribute("aria-expanded", "false"),
          t.setAttribute("aria-hidden", "true"));
      },
      l = () => {
        t.classList.contains("sf-hidden") ? n() : o();
      };
    (e.addEventListener("click", (s) => {
      (s.stopPropagation(), l());
    }),
      document.addEventListener("click", () => o()),
      t.addEventListener("click", (s) => s.stopPropagation()),
      document.addEventListener("keydown", (s) => {
        s.key === "Escape" && o();
      }),
      t.querySelectorAll("a").forEach((s) => {
        s.addEventListener("click", () => o());
      }));
  }),
  chrome.runtime.onMessage.addListener((e, t, n) => {
    if (e.sort_feed_error) {
      let o = "";
      if (
        (e.error_type === "back_to_back_sorting"
          ? (o =
              "Hmm! Back-to-back sorting isn't supported yet. Refresh the page to start a new sort")
          : e.error_type === "post_views"
            ? (o =
                "Oops! Posts don't include views data. Go to the Reels tab to sort by views")
            : e.error_type === "no_posts_reels"
              ? (o = "Sorting works on Posts & Reels tabs only")
              : e.error_type === "profile_pages"
                ? (o = "Oops! Sorting works on Profile pages only")
                : e.error_type === "dates_on_reels"
                  ? (o = "Sorting by dates only works on Posts tab")
                  : e.error_type === "latest_tab_tiktok"
                    ? (o =
                        "Sorting only works on the Latest tab. Switch to Latest to continue")
                    : e.error_type === "video_tab_tiktok"
                      ? (o =
                          "Sorting only works on the Videos tab. Switch to Videos to continue")
                      : e.error_type === "profile_page_tiktok" &&
                        (o = "Oops! Sorting works on Profile pages only"),
        document.getElementById("error_message") == null)
      ) {
        const i = document.getElementsByClassName("main_div")[0],
          a = document.getElementById("error_message");
        a && a.remove();
        const s = document.createElement("div");
        ((s.className =
          "warning_message animate__animated animate__bounceInRight"),
          s.style.setProperty("--animate-duration", ".5s"),
          (s.style.cssText = `
        z-index: 100;
        position: absolute;
        width: 100%;
        background-color: #fbe8ea;
        padding: 0 16px;
        box-sizing: border-box;
      `),
          (s.id = "error_message"),
          (s.innerHTML = `
        <p class="warning_text">
          ${o}
        </p>
      `),
          i.insertBefore(s, i.firstChild),
          setTimeout(() => {
            if (!document.getElementById("sf-exit-style")) {
              const d = document.createElement("style");
              ((d.id = "sf-exit-style"),
                (d.textContent = `
            @keyframes sfExitUp {
              0%   { transform: translateY(0); opacity: 1; filter: none; }
              40%  { transform: translateY(-6px); opacity: 0.9; filter: blur(0.3px); }
              100% { transform: translateY(-120%); opacity: 0; filter: blur(1px); }
            }
            .sf-exit-up {
              animation: sfExitUp 0.35s cubic-bezier(.22,1,.36,1) forwards;
              will-change: transform, opacity, filter;
            }
          `),
                document.head.appendChild(d));
            }
            (s.classList.remove("animate__bounceInRight"),
              s.classList.add("sf-exit-up"),
              s.addEventListener("animationend", () => s.remove(), {
                once: !0,
              }));
          }, 3500));
      }
    }
  }));
function default_sort_selection() {
  function e(i, a) {
    const s = document.getElementById(i),
      d = document.getElementById(a);
    if (!s || !d) return;
    const m = d.value,
      c = s.querySelector(`.sf-dd-opt[data-value="${m}"]`);
    if (!c) return;
    const r =
      c.querySelector("span:first-child")?.textContent ||
      c.childNodes[0]?.textContent?.trim();
    (r && (s.querySelector(".sf-dd-label").textContent = r),
      s
        .querySelectorAll(".sf-dd-opt")
        .forEach((u) => u.classList.remove("sf-dd-selected")),
      c.classList.add("sf-dd-selected"));
  }
  const t = localStorage.getItem("sortfeed_ig_items");
  if (t) {
    const i = document.getElementById("no_reels_selected");
    i && ((i.value = t), e("sf-dd-ig-items", "no_reels_selected"));
  }
  const n = localStorage.getItem("sortfeed_ig_dates");
  if (n) {
    const i = document.getElementById("dates_selected");
    i && ((i.value = n), e("sf-dd-ig-dates", "dates_selected"));
  }
  const o = localStorage.getItem("sortfeed_tiktok_items");
  if (o) {
    const i = document.getElementById("no_reels_selected_tiktok");
    i && ((i.value = o), e("sf-dd-tt-items", "no_reels_selected_tiktok"));
  }
  const l = localStorage.getItem("sortfeed_tiktok_dates");
  if (l) {
    const i = document.getElementById("dates_selected_tiktok");
    i && ((i.value = l), e("sf-dd-tt-dates", "dates_selected_tiktok"));
  }
}
function setupDropdownLogger(e) {
  const t = document.getElementById(e);
  t &&
    t.addEventListener("change", () => {
      e === "no_reels_selected"
        ? localStorage.setItem("sortfeed_ig_items", t.value)
        : e === "dates_selected"
          ? localStorage.setItem("sortfeed_ig_dates", t.value)
          : e === "no_reels_selected_tiktok"
            ? localStorage.setItem("sortfeed_tiktok_items", t.value)
            : e === "dates_selected_tiktok" &&
              localStorage.setItem("sortfeed_tiktok_dates", t.value);
    });
}
(setupDropdownLogger("no_reels_selected"),
  setupDropdownLogger("dates_selected"),
  setupDropdownLogger("no_reels_selected_tiktok"),
  setupDropdownLogger("dates_selected_tiktok"));
const TOGGLE_KEYS = {
  igDownloadToggle: "sortfeed_ig_download_enabled",
  ttDownloadToggle: "sortfeed_tiktok_download_enabled",
};
function restoreToggleStates() {
  const e = Object.values(TOGGLE_KEYS);
  chrome.storage.local.get(e, (t) => {
    for (const [n, o] of Object.entries(TOGGLE_KEYS)) {
      const l = document.getElementById(n);
      l && (l.checked = t[o] !== !1);
    }
  });
}
function setupToggleListeners() {
  for (const [e, t] of Object.entries(TOGGLE_KEYS)) {
    const n = document.getElementById(e);
    n &&
      n.addEventListener("change", () => {
        chrome.storage.local.set({ [t]: n.checked });
      });
  }
}
(restoreToggleStates(), setupToggleListeners());
