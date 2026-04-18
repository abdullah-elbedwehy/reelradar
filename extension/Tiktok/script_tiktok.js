(() => {
  if (window.__sfFetchHooked) return;
  window.__sfFetchHooked = !0;
  const e = performance.now(),
    t = () => (performance.now() - e).toFixed(1) + "ms",
    o = window.fetch;
  window.fetch = async function (s, l) {
    const a = typeof s == "string" ? s : s?.url || "",
      c = String(a).includes("/api/post/item_list"),
      n = await o.apply(this, arguments);
    if (!c || !sessionStorage.getItem("sortFeedStatusTikTok")) return n;
    try {
      const f = await n.clone().text();
      if (!f.trim().startsWith("{")) return n;
      const u = JSON.parse(f),
        _ = u?.itemList ?? u?.item_list ?? u?.aweme_list;
      if (!Array.isArray(_) || _.length === 0) return n;
      const S = u?.hasMore ?? u?.has_more ?? u?.has_more === 1 ?? !1;
      window.postMessage(
        {
          source: "tiktokApiObserver",
          action: "tiktokApiData",
          numberItems: _.length,
          jsonResponse: _,
          nextPage: !!S,
          url: a,
        },
        "*",
      );
    } catch {}
    return n;
  };
})();
const DBUG = !1;
let isSortingSessionActive = !1;
window.__sfSortInProgress = !1;
const inMemoryFeedData = { items: [] };
function save_data_locally_again(e) {
  return (inMemoryFeedData.items.push(e), inMemoryFeedData.items);
}
function reset_in_memory_feed_data() {
  inMemoryFeedData.items = [];
}
window.addEventListener("message", (e) => {
  e.data?.source === "sortfeed" &&
    e.data?.type === "reset_tiktok_session" &&
    (reset_in_memory_feed_data(), (window.__sfSeenIds = new Set()));
});
function createMetadataJsonTikTok(e) {
  let t = {},
    o = e?.createTime,
    s = o ? o * 1e3 : null;
  ((t.createDate = s ? new Date(s).toISOString() : ""),
    (t.code = e?.id || ""),
    (t.userName = e?.author?.uniqueId || ""),
    (t.viewCount = e?.stats?.playCount ?? null),
    (t.likesCount = e?.stats?.diggCount ?? null),
    (t.commentsCount = e?.stats?.commentCount ?? null),
    (t.shareCount = e?.stats?.shareCount ?? null),
    (t.savesCount = e?.stats?.collectCount ?? null));
  const l = typeof e?.desc == "string" && e.desc.trim() !== "" ? e.desc : " ";
  return (
    (t.caption = l),
    (t.photoFlag =
      Array.isArray(e?.imagePost?.images) && e.imagePost.images.length > 0),
    (t.musicUrl = e?.music?.playUrl ?? null),
    t
  );
}
function save_data_locally_tiktok(e) {
  if (sessionStorage.getItem("sortFeedData") !== null) {
    let t = JSON.parse(sessionStorage.getItem("sortFeedData"));
    return (
      t.push(e),
      sessionStorage.setItem("sortFeedData", JSON.stringify(t)),
      t
    );
  } else {
    let t = [];
    return (
      t.push(e),
      sessionStorage.setItem("sortFeedData", JSON.stringify(t)),
      t
    );
  }
}
function startSmartScroll() {
  let e = 0,
    t = 0;
  const o = 15,
    s = 100;
  let l = null,
    a = !1;
  function c() {
    if (a) return;
    const n = document.body.scrollHeight;
    (n > e
      ? (window.scrollTo(0, n), (e = n), (t = 0))
      : (window.scrollBy(0, 200), t++),
      t < o
        ? (l = setTimeout(c, s))
        : DBUG && console.log("No more content to load or hit max attempts."));
  }
  return (
    c(),
    function () {
      ((a = !0),
        l && clearTimeout(l),
        DBUG && console.log("Smart scroll manually stopped."));
    }
  );
}
function send_items_collected_no(e) {
  if (e !== null)
    try {
      let t = e.length;
      window.postMessage({ item_collected_no: !0, number_items: t }, "*");
    } catch (t) {
      DBUG && console.error("Error sending message", t);
    }
}
function insta_banner_notification(e) {
  if (e !== null)
    try {
      let t = e.length;
      window.postMessage({ insta_banner_notification: !0, count: t }, "*");
    } catch (t) {
      DBUG && console.error("Error sending message", t);
    }
}
function removeSortFeedBannerMessage() {
  window.postMessage({ insta_banner_notification_remove: !0 }, "*");
}
function update_data_object_with_element_tiktok(e, t) {
  return ((e.element = t.outerHTML), e);
}
function quickHumanScroll(e) {
  const t = e.getBoundingClientRect(),
    o = (Math.random() - 0.5) * 80,
    s = window.scrollY + t.top - window.innerHeight / 2 + o;
  window.scrollTo({ top: s, behavior: "auto" });
}
function find_element_tiktok_again(e, t = {}) {
  const {
      maxAttempts: o = 12,
      baseDelayMs: s = 220,
      maxDelayMs: l = 1200,
      mediaTimeoutMs: a = 1200,
      scrollPadding: c = 140,
    } = t,
    n = () => !!sessionStorage.getItem("sortFeedStatusTikTok"),
    m = (r) => new Promise((i) => setTimeout(i, r)),
    f = (r, i = 0.35) => {
      const g = r * i;
      return Math.max(0, Math.round(r + (Math.random() * 2 - 1) * g));
    },
    u = (r) =>
      new Promise((i) => {
        typeof requestIdleCallback == "function"
          ? requestIdleCallback(() => i(r()), { timeout: 300 })
          : setTimeout(() => i(r()), 0);
      }),
    _ = (r) => {
      const i = r.getBoundingClientRect();
      return i.top >= -50 && i.top <= window.innerHeight - 120;
    },
    S = async (r) => {
      if (_(r)) return;
      const i = r.getBoundingClientRect(),
        w = window.scrollY + i.top - c - window.scrollY,
        k = Math.max(-500, Math.min(500, w));
      (window.scrollTo({ top: window.scrollY + k, behavior: "auto" }),
        await m(f(120, 0.5)));
    },
    h = () => {
      const r = document.querySelector(`a[href*="${e}"]`);
      if (!r) return null;
      const i = r.closest('[data-e2e="user-post-item-list"]');
      if (!i) return null;
      let g = r;
      for (; g && g.parentElement !== i; ) g = g.parentElement;
      return g || null;
    },
    d = (r) => {
      const i = r.querySelectorAll("img");
      for (let g = 0; g < Math.min(i.length, 2); g++) {
        const w = i[g],
          k = w.currentSrc || w.src || w.getAttribute("src") || "";
        if (
          !(!k || k.startsWith("data:")) &&
          w.complete &&
          (w.naturalWidth || 0) > 0 &&
          (w.naturalHeight || 0) > 0
        )
          return !0;
      }
      return i.length === 0;
    },
    p = async (r) => {
      const i = performance.now();
      for (; performance.now() - i < a; ) {
        if (!n()) return null;
        if (d(r)) return r;
        await m(f(180, 0.5));
      }
      return r;
    };
  return new Promise(async (r) => {
    if (!n()) return r(null);
    let i = s;
    for (let g = 0; g < o; g++) {
      if (!n()) return r(null);
      const w = await u(h);
      if (w) {
        await S(w);
        const k = await p(w);
        return r(k);
      }
      (await m(f(i)), (i = Math.min(l, Math.round(i * 1.35))));
    }
    r(null);
  });
}
function update_data_object_with_element_tiktok_again(e, t) {
  return (t && (e.element = t.outerHTML), e);
}
function scrollLikeHumanToBottom(e = 5, t = 50) {
  const o = () => {
    const s = document.body.scrollHeight - window.innerHeight;
    window.scrollY < s && (window.scrollBy(0, t), setTimeout(o, e));
  };
  o();
}
async function sort_videos_tiktok(e, t, o, s) {
  return new Promise(async (l) => {
    for (let a = 0; a < e; a++) {
      let c = t[a],
        n = createMetadataJsonTikTok(c),
        m = await find_element_tiktok_again(n.code),
        f = update_data_object_with_element_tiktok_again(n, m),
        u = save_data_locally_again(f);
      if (sessionStorage.getItem("sortFeedStatusTikTok")) {
        if (
          (send_items_collected_no(u),
          insta_banner_notification(u),
          sessionStorage.getItem("sortFeedStopSorting") === "on")
        ) {
          (sessionStorage.removeItem("sortFeedStopSorting"),
            sessionStorage.removeItem("sortFeedStatusTikTok"),
            removeSortFeedBannerMessage(),
            l({ itemsCleaned: u }));
          return;
        } else if (u.length === o) {
          (sessionStorage.removeItem("sortFeedStopSorting"),
            sessionStorage.removeItem("sortFeedStatusTikTok"),
            l({ itemsCleaned: u }));
          return;
        } else if (a === e - 1 && s === !1) {
          (sessionStorage.removeItem("sortFeedStopSorting"),
            sessionStorage.removeItem("sortFeedStatusTikTok"),
            l({ itemsCleaned: u }));
          return;
        } else if (a === e - 1 && s === !0) break;
      }
    }
  });
}
function return_sort_selection() {
  const e = sessionStorage.getItem("sortFeedNoItems");
  if (e === "all_reels") return 1e4;
  const t = e.match(/^(\d+)_reels$/);
  return t ? parseInt(t[1], 10) : null;
}
function sort_items_tiktok(e, t) {
  return t === "views"
    ? [...e].sort((o, s) => s.viewCount - o.viewCount)
    : t === "likes"
      ? [...e].sort((o, s) => s.likesCount - o.likesCount)
      : t === "comments"
        ? [...e].sort((o, s) => s.commentsCount - o.commentsCount)
        : t === "saves"
          ? [...e].sort((o, s) => s.savesCount - o.savesCount)
          : t === "shares"
            ? [...e].sort((o, s) => s.shareCount - o.shareCount)
            : t === "oldest"
              ? [...e].reverse()
              : 0;
}
function return_date_range(e) {
  let t = new Date(),
    o = new Date();
  if (e === "1_week") return (t.setDate(o.getDate() - 7), [t, o]);
  if (e === "1_month") return (t.setDate(o.getDate() - 30), [t, o]);
  if (e === "3_month") return (t.setDate(o.getDate() - 90), [t, o]);
  if (e === "6_month") return (t.setDate(o.getDate() - 180), [t, o]);
  if (e === "1_year") return (t.setDate(o.getDate() - 360), [t, o]);
  if (e === "all_reels") return (t.setDate(o.getDate() - 3600), [t, o]);
}
function is_create_date_in_range(e, t, o) {
  const s = new Date(e);
  if (isNaN(s) || isNaN(t) || isNaN(o)) throw new Error("Invalid date format");
  return s >= t && s < o;
}
async function sort_videos_tiktok_dates(e, t, o, s, l, a) {
  return new Promise(async (c) => {
    for (let n = 0; n < e; n++) {
      let m = t[n],
        f = createMetadataJsonTikTok(m),
        u = await find_element_tiktok_again(f.code),
        _ = update_data_object_with_element_tiktok_again(f, u),
        S = _.createDate,
        h = sessionStorage.getItem("sortFeedStopSorting");
      if (sessionStorage.getItem("sortFeedStatusTikTok")) {
        if (h === "on") {
          sessionStorage.removeItem("sortFeedStopSorting");
          let d = save_data_locally_again(_);
          (removeSortFeedBannerMessage(),
            sessionStorage.removeItem("sortFeedStatusTikTok"),
            c({ itemsCleaned: d }));
          return;
        } else if (is_create_date_in_range(S, l, a) && n !== e - 1) {
          let d = save_data_locally_again(_);
          (send_items_collected_no(d), insta_banner_notification(d));
        } else if (
          is_create_date_in_range(S, l, a) &&
          n === e - 1 &&
          s === !1
        ) {
          let d = save_data_locally_again(_);
          (send_items_collected_no(d),
            insta_banner_notification(d),
            sessionStorage.removeItem("sortFeedStatusTikTok"),
            c({ itemsCleaned: d }));
        } else if (
          is_create_date_in_range(S, l, a) &&
          n === e - 1 &&
          s === !0
        ) {
          let d = save_data_locally_again(_);
          (send_items_collected_no(d), insta_banner_notification(d));
        } else if (!is_create_date_in_range(S, l, a)) {
          if (m.isPinnedItem) continue;
          {
            let d = inMemoryFeedData.items;
            (sessionStorage.removeItem("sortFeedStatusTikTok"),
              c({ itemsCleaned: d }));
            break;
          }
        }
      }
    }
  });
}
function remove_overlay() {
  const e = document.getElementById("overlay_sort_reels");
  e && e.remove();
}
function send_add_overlay_msg() {
  document.getElementById("overlay_sort_reels") ||
    window.postMessage({ overlay_on: !0 }, "*");
}
function remove_uneeded_stuff() {
  (sessionStorage.removeItem("sortFeedSortBy"),
    sessionStorage.removeItem("sortFeedNoItems"),
    sessionStorage.removeItem("sortFeedStatus"),
    sessionStorage.removeItem("sortFeedStatusTikTok"),
    sessionStorage.removeItem("sortFeedData"),
    sessionStorage.removeItem("sortFeedDataSorted"),
    sessionStorage.removeItem("sortItemsVsDates"),
    reset_in_memory_feed_data());
}
window.addEventListener("message", (e) => {
  if (
    e.data.source === "tiktokApiObserver" &&
    e.data.action === "tiktokApiData"
  ) {
    let t = e.data.url;
    if (
      t.includes("api/post/item_list") &&
      sessionStorage.getItem("sortFeedStatusTikTok") &&
      sessionStorage.getItem("sortItemsVsDates") === "items"
    ) {
      send_add_overlay_msg();
      let o = e.data.numberItems,
        s = e.data.jsonResponse,
        l = e.data.nextPage,
        a = return_sort_selection();
      sort_videos_tiktok(o, s, a, l).then(({ itemsCleaned: c }) => {
        let n = sessionStorage.getItem("sortFeedSortBy"),
          m = sort_items_tiktok(c, n);
        (removeSortFeedBannerMessage(),
          remove_overlay(),
          window.postMessage({ logo_animate_off_tiktok: !0, payload: m }, "*"));
      });
    } else if (
      t.includes("api/post/item_list") &&
      sessionStorage.getItem("sortFeedStatusTikTok") &&
      sessionStorage.getItem("sortItemsVsDates") === "dates"
    ) {
      send_add_overlay_msg();
      let o = e.data.numberItems,
        s = e.data.jsonResponse,
        l = e.data.nextPage,
        a = sessionStorage.getItem("sortFeedNoItems"),
        [c, n] = return_date_range(a);
      sort_videos_tiktok_dates(o, s, a, l, c, n).then(({ itemsCleaned: m }) => {
        if (m === null)
          (removeSortFeedBannerMessage(),
            remove_overlay(),
            window.postMessage(
              { logo_animate_off_zero_tiktok_time_period: !0 },
              "*",
            ));
        else {
          let f = sessionStorage.getItem("sortFeedSortBy"),
            u = sort_items_tiktok(m, f);
          (removeSortFeedBannerMessage(),
            remove_overlay(),
            window.postMessage(
              { logo_animate_off_tiktok: !0, payload: u },
              "*",
            ));
        }
      });
    }
  }
});
