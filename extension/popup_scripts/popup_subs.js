function sfShowFooter(e) {
  (typeof e == "string" && (e = document.getElementById(e)),
    e.classList.remove("sf-fade-footer"),
    e.offsetWidth,
    e.classList.add("sf-fade-footer"),
    (e.style.display = "flex"));
}
const SF_DD_MAP = {
  "sf-dd-ig-items": "no_reels_selected",
  "sf-dd-ig-dates": "dates_selected",
  "sf-dd-tt-items": "no_reels_selected_tiktok",
  "sf-dd-tt-dates": "dates_selected_tiktok",
};
function sf_dd_init() {
  (Object.keys(SF_DD_MAP).forEach((e) => {
    const s = document.getElementById(e);
    if (!s) return;
    const t = s.querySelector(".sf-dd-trigger"),
      n = s.querySelector(".sf-dd-menu"),
      o = document.getElementById(SF_DD_MAP[e]);
    (t.addEventListener("click", (r) => {
      r.stopPropagation();
      const a = n.classList.contains("sf-dd-open");
      (document
        .querySelectorAll(".sf-dd-menu.sf-dd-open")
        .forEach((c) => c.classList.remove("sf-dd-open")),
        a || n.classList.add("sf-dd-open"));
    }),
      n.querySelectorAll(".sf-dd-opt").forEach((r) => {
        r.addEventListener("click", () => {
          if (r.classList.contains("sf-dd-locked")) return;
          const a = r.dataset.value,
            c =
              r.querySelector("span:first-child")?.textContent ||
              r.textContent.trim();
          ((s.querySelector(".sf-dd-label").textContent = c),
            (o.value = a),
            o.dispatchEvent(new Event("change")),
            n
              .querySelectorAll(".sf-dd-opt")
              .forEach((d) => d.classList.remove("sf-dd-selected")),
            r.classList.add("sf-dd-selected"),
            n.classList.remove("sf-dd-open"));
        });
      }));
  }),
    document.addEventListener("click", () => {
      document
        .querySelectorAll(".sf-dd-menu.sf-dd-open")
        .forEach((e) => e.classList.remove("sf-dd-open"));
    }));
}
function handle_lock_emojis() {
  (sf_dd_lock("sf-dd-ig-items", 0),
    sf_dd_lock("sf-dd-ig-dates", 0),
    sf_dd_lock("sf-dd-tt-items", 0),
    sf_dd_lock("sf-dd-tt-dates", 0),
    _lock_hidden_select("no_reels_selected", "25_reels"),
    _lock_hidden_select("dates_selected", "1_week"),
    _lock_hidden_select("no_reels_selected_tiktok", "25_reels"),
    _lock_hidden_select("dates_selected_tiktok", "1_week"));
}
function sf_dd_lock(e, s) {
  const t = document.getElementById(e);
  if (!t) return;
  t.querySelectorAll(".sf-dd-opt").forEach((i, r) => {
    if (r === s) i.classList.remove("sf-dd-locked");
    else if (
      (i.classList.add("sf-dd-locked"), !i.querySelector(".sf-dd-pro-pill"))
    ) {
      const a = document.createElement("span");
      ((a.className = "sf-dd-pro-pill"),
        (a.textContent = "Pro"),
        i.appendChild(a));
    }
  });
  const o = t.querySelector(".sf-dd-get-pro");
  o && (o.style.display = "flex");
}
function _lock_hidden_select(e, s) {
  const t = document.getElementById(e);
  if (t) for (const n of t.options) n.disabled = n.value !== s;
}
function unlock_all_options() {
  ([
    "sf-dd-ig-items",
    "sf-dd-ig-dates",
    "sf-dd-tt-items",
    "sf-dd-tt-dates",
  ].forEach((e) => {
    const s = document.getElementById(e);
    if (!s) return;
    s.querySelectorAll(".sf-dd-opt").forEach((n) => {
      n.classList.remove("sf-dd-locked");
      const o = n.querySelector(".sf-dd-pro-pill");
      o && o.remove();
    });
    const t = s.querySelector(".sf-dd-get-pro");
    t && (t.style.display = "none");
  }),
    [
      "no_reels_selected",
      "dates_selected",
      "no_reels_selected_tiktok",
      "dates_selected_tiktok",
    ].forEach((e) => {
      const s = document.getElementById(e);
      if (s) for (const t of s.options) t.disabled = !1;
    }));
}
function add_activate_pro_footer() {
  sfShowFooter("subFooter");
}
function show_footer_based_on_state(e) {
  const s = document.getElementById("subFooter");
  s && sfShowFooter(s);
}
function fetchUserStateFromBackground(e) {
  return new Promise((s) => {
    chrome.runtime.sendMessage(
      { type: "GET_STATE_BASED_USERID", userID: e },
      (t) => {
        s(t?.userState ?? null);
      },
    );
  });
}
async function save_state_type_for_user(e) {
  await chrome.storage.local.set({ rr_state: e });
}
function setView(e) {
  e === "free"
    ? (handle_lock_emojis(), show_footer_based_on_state("FREE SIGNED-IN"))
    : e === "pro" &&
      (unlock_all_options(),
      pro_tag_added(),
      show_footer_based_on_state("PAID SIGNED-IN"));
}
document.addEventListener("DOMContentLoaded", async () => {
  sf_dd_init();
  await chrome.storage.local.set({ rr_state: "pro" });
  (unlock_all_options(), pro_tag_added());
  show_footer_based_on_state("PAID SIGNED-IN");
});
function first_time_pro() {
  (pro_tag_added(), unlock_all_options());
}
function save_locally_user_pro() {
  chrome.runtime.sendMessage({ command: "activatePro" });
}
function show_error_banner(e) {
  if (document.getElementById("error_message") == null) {
    const t = document.getElementsByClassName("main_div")[0],
      n = document.getElementById("error_message");
    n && n.remove();
    const o = document.createElement("div");
    ((o.className = "warning_message animate__animated animate__bounceInRight"),
      o.style.setProperty("--animate-duration", ".5s"),
      (o.style.cssText = `
      z-index: 100;
      position: absolute;
      width: 100%;
      background-color: #fbe8ea;
      padding: 0 16px; /* \u2705 only adds left/right padding */
      box-sizing: border-box;
    `),
      (o.id = "error_message"),
      (o.innerHTML = `
      <p class="warning_text">
        ${e}
      </p>
    `),
      t.insertBefore(o, t.firstChild),
      setTimeout(() => {
        if (!document.getElementById("sf-exit-style")) {
          const i = document.createElement("style");
          ((i.id = "sf-exit-style"),
            (i.textContent = `
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
            document.head.appendChild(i));
        }
        (o.classList.remove("animate__bounceInRight"),
          o.classList.add("sf-exit-up"),
          o.addEventListener("animationend", () => o.remove(), { once: !0 }));
      }, 3500));
  }
}
function show_error_banner_no_icon(e) {
  const s = document.getElementsByClassName("main_div")[0],
    t = document.createElement("div");
  ((t.className = "warning_message animate__animated animate__bounceInRight"),
    t.style.setProperty("--animate-duration", ".5s"),
    (t.style.cssText =
      "z-index: 100; position: relative; background-color: #fbe8ea; position: absolute; padding-left: 17px; padding-right: 17px;"),
    (t.id = "error_message"),
    (t.innerHTML = `
  <p class="warning_text">
  ${e}
  </p>
  `),
    s.insertBefore(t, s.firstChild),
    setTimeout(() => {
      t.style.display = "none";
    }, 4500));
}
function show_sucess_banner() {
  const e = document.getElementsByClassName("main_div")[0];
  if (!e) return;
  const s = document.getElementById("success_message");
  s && s.remove();
  const t = document.createElement("div");
  ((t.className = "sucess_message animate__animated animate__bounceInRight"),
    t.style.setProperty("--animate-duration", ".5s"),
    (t.style.cssText = `
    z-index: 100;
    position: absolute;
    width: 100%;
    background-color: #F7FFF8;
    padding: 0 16px;
    box-sizing: border-box;
  `),
    (t.id = "success_message"),
    (t.innerHTML = `
    <p class="sucess_text">
      <img src="Icons/ZeroStateIcons/Party.png" alt="Success Icon" style="width: 13px; vertical-align: middle; margin-right: 5px; margin-top: -0.1rem;">
      Welcome to ReelRadar Pro!
    </p>
  `),
    e.insertBefore(t, e.firstChild),
    setTimeout(() => {
      if (!document.getElementById("sf-exit-style")) {
        const n = document.createElement("style");
        ((n.id = "sf-exit-style"),
          (n.textContent = `
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
          document.head.appendChild(n));
      }
      (t.classList.remove("animate__bounceInRight"),
        t.classList.add("sf-exit-up"),
        t.addEventListener("animationend", () => t.remove(), { once: !0 }));
    }, 3500));
}
function slide_pro_ui() {
  chrome.tabs.query({ active: !0, currentWindow: !0 }, function (e) {
    var s = e[0].url || "";
    if (s.includes("tiktok.com")) {
      const t = document.querySelector(".TikTokMain");
      (t &&
        ((t.style.display = "flex"), t.classList.add("slide-left-animation")),
        (document.getElementsByClassName(
          "main_nav_div_zero_state_sub",
        )[0].style.display = "none"));
    } else if (s.includes("instagram.com")) {
      const t = document.querySelector(".InstaMain");
      (t &&
        ((t.style.display = "flex"), t.classList.add("slide-left-animation")),
        (document.getElementsByClassName(
          "main_nav_div_zero_state_sub",
        )[0].style.display = "none"));
    } else {
      const t = document.querySelector(".main_nav_div_zero_state");
      (t &&
        ((t.style.display = "flex"), t.classList.add("slide-left-animation")),
        (document.getElementsByClassName(
          "main_nav_div_zero_state_sub",
        )[0].style.display = "none"));
    }
  });
}
function pro_tag_added() {
  const e = document.querySelector(".beta");
  if (e) {
    e.innerHTML = "";
    const s = document.createElement("img");
    ((s.src = "Icons/ZeroStateIcons/black_star.svg"),
      (s.style.width = "5px"),
      (s.style.marginRight = "2px"));
    const t = document.createTextNode("Pro");
    ((e.style.backgroundColor = "#22d3ee"),
      (e.style.color = "#021014"),
      (e.style.display = "inline-flex"),
      (e.style.alignItems = "center"),
      e.appendChild(s),
      e.appendChild(t));
  }
}
function active_button_loading_on() {
  const e = document.getElementById("activiatePro");
  if (!e) return;
  const s = e.querySelector("img");
  s &&
    ((s.src = "Icons/ZeroStateIcons/loading.png"),
    (s.style.animation = "spin 0.5s linear infinite"));
}
function active_button_loading_off() {
  const e = document.getElementById("activiatePro");
  if (!e) return;
  const s = e.querySelector("img");
  s &&
    ((s.src = "Icons/ZeroStateIcons/black_star.svg"),
    (s.style.animation = "none"));
}
function add_confetti() {
  confetti({ particleCount: 200, spread: 70, origin: { y: 0.6 } });
}
var activiatePro = document.getElementById("activiatePro"),
  licenseInputField = document.querySelector(".license-input_sub");
activiatePro &&
  activiatePro.addEventListener("click", function () {
    active_button_loading_off();
  });
licenseInputField &&
  licenseInputField.addEventListener("keydown", function (e) {
    e.key === "Enter" && active_button_loading_off();
  });
chrome.runtime.onMessage.addListener((e) => {
    if (e?.type !== "RR_HANDLE_STATE") return;
    (save_state_type_for_user("pro"),
      unlock_all_options(),
      pro_tag_added(),
      show_footer_based_on_state("PAID SIGNED-IN"),
      chrome.storage.local.set({ rr_state: "pro" }));
  });
var backButton = document.getElementById("BackFromLicensePage");
backButton &&
  backButton.addEventListener("click", function () {
  ((document.querySelector(".main_nav_div_zero_state_sub").style.display =
    "none"),
    chrome.tabs.query({ active: !0, currentWindow: !0 }, function (e) {
      var s = e[0].url || "";
      if (s.includes("tiktok.com")) {
        const t = document.querySelector(".TikTokMain");
        ((t.style.display = "flex"),
          t.classList.add("slide-right-animation"),
          sfShowFooter("subFooter"));
      } else if (s.includes("instagram.com")) {
        const t = document.querySelector(".InstaMain");
        ((t.style.display = "flex"),
          t.classList.add("slide-right-animation"),
          sfShowFooter("subFooter"));
      } else {
        const t = document.querySelector(".main_nav_div_zero_state");
        ((t.style.display = "flex"),
          t.classList.add("slide-right-animation"),
          sfShowFooter("subFooter"));
      }
    }));
  });
