const DEBUG = !1;
const RR_LEGACY_USER_KEY = "rrLegacyUser";
const SORTFEED_LEGACY_USER_KEY = "userSortFeed";
const NOT_CONFIGURED_REASON = "not_configured";
function buildNotConfiguredResponse(extra = {}) {
  return { ok: !1, reason: NOT_CONFIGURED_REASON, ...extra };
}
async function getLocalUserState() {
  try {
    const e = await chrome.storage.local.get(["rr_state"]);
    return e.rr_state || "active";
  } catch {
    return "active";
  }
}
async function getLegacyProFlag() {
  try {
    const e = await getDBItem(RR_LEGACY_USER_KEY);
    if (e === "Pro") return !0;
    return (await getDBItem(SORTFEED_LEGACY_USER_KEY)) === "Pro";
  } catch {
    return !1;
  }
}
async function removeLegacyFlagIndexDB() {
  try {
    return (
      await Promise.allSettled([
        deleteDBItem(RR_LEGACY_USER_KEY),
        deleteDBItem(SORTFEED_LEGACY_USER_KEY),
      ]),
      { ok: !0 }
    );
  } catch (e) {
    return { ok: !1, error: String(e) };
  }
}
async function ensureLocalSession() {
  try {
    const t = await chrome.storage.local.get(["rr_user_id", "rrUser"]);
    const e =
      t.rr_user_id ||
      t.rrUser?.userID ||
      `rr-${Math.random().toString(36).slice(2, 10)}`;
    const r = t.rrUser || {};
    await chrome.storage.local.set({
      rr_user_id: e,
      rr_state: "active",
      rrUser: { ...r, userID: e, cachedAt: Date.now() },
    });
    return e;
  } catch {}
}
async function migrateLegacyStorageKeys() {
  try {
    const e = await chrome.storage.local.get([
      "sort_feed_user_id",
      "sortFeedUser",
      "sort_feed_state_type_flag",
    ]);
    if (e.sort_feed_user_id || e.sortFeedUser || e.sort_feed_state_type_flag) {
      const s = e.sort_feed_user_id || e.sortFeedUser?.userID || null;
      await chrome.storage.local.set({
        ...(s ? { rr_user_id: s } : {}),
        ...(e.sortFeedUser
          ? {
              rrUser: {
                ...e.sortFeedUser,
                userID: s || e.sortFeedUser.userID,
              },
            }
          : {}),
      });
      await chrome.storage.local.remove([
        "sort_feed_user_id",
        "sortFeedUser",
        "sort_feed_state_type_flag",
      ]);
    }
  } catch {}
}
async function initializeExtensionState() {
  await migrateLegacyStorageKeys();
  await removeLegacyFlagIndexDB();
  await ensureLocalSession();
}
function sendMessageToTab(e, s) {
  e != null && chrome.tabs.sendMessage(e, s).catch(() => {});
}
(chrome.runtime.onInstalled.addListener(async function () {
  await initializeExtensionState();
}),
  chrome.runtime.onStartup.addListener(() => {
    ensureLocalSession();
  }),
  chrome.action.onClicked.addListener((e) => {
    chrome.tabs.query({ active: !0, currentWindow: !0 }, (s) => {
      let o = s[0].url;
      chrome.action.setPopup({ tabId: s[0].id, popup: "popup.html" });
    });
  }),
  chrome.tabs.onUpdated.addListener((e, s, o) => {
    chrome.tabs.query({ active: !0, currentWindow: !0 }, (n) => {
      chrome.action.setPopup({ tabId: n[0].id, popup: "popup.html" });
    });
  }));
function openDB() {
  return new Promise((e, s) => {
    const o = indexedDB.open("SortFeedDB", 1);
    ((o.onupgradeneeded = (n) => {
      const t = n.target.result;
      t.objectStoreNames.contains("settings") ||
        t.createObjectStore("settings");
    }),
      (o.onsuccess = () => e(o.result)),
      (o.onerror = () => s(o.error)));
  });
}
function setDBItem(e, s) {
  return openDB().then(
    (o) =>
      new Promise((n, t) => {
        const r = o.transaction("settings", "readwrite");
        (r.objectStore("settings").put(s, e),
          (r.oncomplete = n),
          (r.onerror = () => t(r.error)));
      }),
  );
}
function getDBItem(e) {
  return openDB().then(
    (s) =>
      new Promise((o, n) => {
        const r = s
          .transaction("settings", "readonly")
          .objectStore("settings")
          .get(e);
        ((r.onsuccess = () => o(r.result)), (r.onerror = () => n(r.error)));
      }),
  );
}
function deleteDBItem(e) {
  return openDB().then(
    (s) =>
      new Promise((o, n) => {
        const r = s
          .transaction("settings", "readwrite")
          .objectStore("settings")
          .delete(e);
        ((r.onsuccess = () => o()), (r.onerror = () => n(r.error)));
      }),
  );
}
function checkUserStatusNew(e) {
  return (e({ isPro: !0 }), !0);
}
async function isUserSortFeedPro() {
  return !0;
}
(chrome.runtime.onMessage.addListener((e, s, o) => {
  if (e?.type === "GET_STATE_BASED_USERID")
    return (
      (async () => {
        const r = await getLocalUserState();
        o({ type: "HANDLE_STATE_BASED_USERID", userState: r });
      })(),
      !0
    );
  if (e.refresh === "ON")
    return (
      (async () => {
        const t = await isUserSortFeedPro(),
          r = e.dates_items === "items",
          u = e.no_items === "25_reels",
          c = e.dates_items === "dates",
          f = e.no_items === "1_week";
        ((r && (u || t)) || (c && (f || t))) &&
          chrome.tabs.query({ active: !0, currentWindow: !0 }, (a) => {
            chrome.tabs.sendMessage(a[0].id, {
              action: "refreshPage",
              sort_by: e.sort_by,
              no_items: e.no_items,
              dates_items: e.dates_items,
            });
          });
      })(),
      !0
    );
  if (e.refresh === "ON_TikTok")
    return (
      (async () => {
        const t = await isUserSortFeedPro(),
          r = e.dates_items === "items",
          u = e.no_items === "25_reels",
          c = e.dates_items === "dates",
          f = e.no_items === "1_week";
        ((r && (u || t)) || (c && (f || t))) &&
          chrome.tabs.query({ active: !0, currentWindow: !0 }, (a) => {
            chrome.tabs.sendMessage(a[0].id, {
              action: "refreshPageTikTok",
              sort_by: e.sort_by,
              no_items: e.no_items,
              dates_items: e.dates_items,
            });
          });
      })(),
      !0
    );
  if (e.sort_feed_error)
    chrome.tabs.query({ active: !0, currentWindow: !0 }, function (t) {
      chrome.tabs.sendMessage(t[0].id, {
        sort_feed_error: !0,
        error_type: e.error_type,
      });
    });
  else if (e.logo_animate_on)
    chrome.tabs.query({ active: !0, currentWindow: !0 }, function (t) {
      chrome.tabs.sendMessage(t[0].id, { logo_animate_on: !0 });
    });
  else if (e.message === "scroll tiktok")
    chrome.tabs.query({ active: !0, currentWindow: !0 }, function (t) {
      chrome.tabs.sendMessage(t[0].id, { message: "scroll tiktok" });
    });
  else if (e.item_collected_no)
    chrome.tabs.query({ active: !0, currentWindow: !0 }, function (t) {
      chrome.tabs.sendMessage(t[0].id, {
        item_collected_no: !0,
        number_items: e.number_items,
      });
    });
  else if (e.logo_animate_off)
    chrome.tabs.query({ active: !0, currentWindow: !0 }, function (t) {
      chrome.tabs.sendMessage(t[0].id, { logo_animate_off: !0 });
    });
  else if (e.export_click)
    chrome.tabs.query({ active: !0, currentWindow: !0 }, function (t) {
      chrome.tabs.sendMessage(t[0].id, {
        export_click_background: !0,
        posts_vs_reels: e.posts_vs_reels,
        sorted_data: e.sorted_data,
        export_format: e.export_format,
      });
    });
  else if (e.export_click_tiktok)
    chrome.tabs.query({ active: !0, currentWindow: !0 }, function (t) {
      chrome.tabs.sendMessage(t[0].id, {
        export_click_background_tiktok: !0,
        posts_vs_reels: e.posts_vs_reels,
        sorted_data: e.sorted_data,
        export_format: e.export_format,
      });
    });
  else {
    if (e?.type === "CHECK_SERVER_USER")
      return (o(buildNotConfiguredResponse()), !0);
    if (e.type === "GET_CHROME_EMAIL")
      return (o(buildNotConfiguredResponse({ email: "" })), !0);
    if (e.page_loaded)
      chrome.tabs.query({ active: !0, currentWindow: !0 }, function (t) {
        chrome.tabs.sendMessage(t[0].id, { page_loaded_completed: "ON" });
      });
    else if (e.action === "forwardMessage")
      chrome.tabs.query({ active: !0, currentWindow: !0 }, (t) => {
        chrome.tabs.sendMessage(t[0].id, { action: "receiveMessage" });
      });
    else if (e.zero_state === "instagram") {
      var n = "https://www.instagram.com/";
      chrome.tabs.create({ url: n });
    } else if (e.zero_state === "tiktok") {
      var n = "https://www.tiktok.com/";
      chrome.tabs.create({ url: n });
    }
  }
  if (e.command === "activatePro")
    setDBItem(RR_LEGACY_USER_KEY, "Pro").then(() => {});
  else {
    if (e.command === "checkProStatus") return (o({ isPro: !0 }), !0);
  }
}),
  chrome.webNavigation.onCompleted.addListener((e) => {
    e.frameId === 0 &&
      chrome.tabs
        .sendMessage(e.tabId, { action: "pageLoaded", url: e.url })
        .catch(() => {});
  }));
ensureLocalSession();
