const DEBUG = !1;
let profileNameIG = null;
const inMemoryFeedData = { items: [] };
function save_data_locally_again(e) {
  return (inMemoryFeedData.items.push(e), inMemoryFeedData.items);
}
function reset_in_memory_feed_data() {
  inMemoryFeedData.items = [];
}
function createMetadataJson(e) {
  let t = {},
    o = e?.taken_at,
    s = o ? o * 1e3 : null;
  return (
    (t.createDate = s ? new Date(s).toISOString() : ''),
    (t.code = e?.code || ''),
    (t.commentsCount = e?.comment_count ?? null),
    (t.likesCount = e?.like_count ?? null),
    (t.mediaType = e?.media_type ?? null),
    (t.viewCount = e?.view_count ?? null),
    (t.userName = e?.user?.username || ''),
    (t.caption = e?.caption?.text || ''),
    (t.postID = e?.pk ?? null),
    t
  );
}
function getUserNameReels() {
  if (profileNameIG) return profileNameIG;
  {
    const e = document.querySelector('header h2 span');
    if (e) return ((profileNameIG = e.innerText.trim()), profileNameIG);
  }
}
function createMetadataJsonReels(e) {
  let t = {},
    o = e?.play_count ?? e?.view_count ?? null;
  ((t.viewCount = o),
    (t.code = e?.code || ''),
    (t.commentsCount = e?.comment_count ?? null),
    (t.likesCount = e?.like_count ?? null),
    (t.mediaType = e?.media_type ?? null));
  let s = getUserNameReels?.() || '';
  return ((t.userName = s), (t.reelID = e?.pk ?? null), t);
}
function scroll_to_view(e) {
  e.scrollIntoView({ behavior: 'smooth', block: 'center' });
}
function save_data_locally(e) {
  if (sessionStorage.getItem('sortFeedData') !== null) {
    let t = JSON.parse(sessionStorage.getItem('sortFeedData'));
    return (
      t.push(e),
      sessionStorage.setItem('sortFeedData', JSON.stringify(t)),
      t
    );
  } else {
    let t = [];
    return (
      t.push(e),
      sessionStorage.setItem('sortFeedData', JSON.stringify(t)),
      t
    );
  }
}
function return_number_selected() {
  let e = sessionStorage.getItem('sortFeedNoItems');
  return e === 'all_reels' ? 0 : parseInt(e.replace('_reels', ''), 10) || 0;
}
function return_herf(e) {
  return [1, 8].includes(e.mediaType)
    ? `/${e.userName}/p/${e.code}/`
    : `/${e.userName}/reel/${e.code}/`;
}
function find_element(e, t = 30, o = 100) {
  return new Promise((s) => {
    const a = (n) => {
      const i = document.querySelector(`a[href*="${e}"]`);
      if (i) {
        const r = i.closest('div');
        s(r);
      } else n > 0 ? setTimeout(() => a(n - 1), o) : s(null);
    };
    a(t);
  });
}
function find_element_instagram_again(e, t = 30, o = 100) {
  return new Promise((s) => {
    const a = (n) => {
      const i = document.querySelector(`a[href*="${e}"]`);
      if (i) {
        const r = i.closest('div');
        r?.scrollIntoView({ behavior: 'auto', block: 'center' });
        const _ = () => {
            const l = r
                ?.querySelector('[style*="background-image"]')
                ?.style?.backgroundImage?.match(/url\(["']?(.*?)["']?\)/),
              m = l ? l[1] : '';
            return m && !m.startsWith('data:image/gif');
          },
          d = () => {
            _() ? s(r) : t-- > 0 ? setTimeout(d, o) : s(r);
          };
        _() ? s(r) : setTimeout(d, 200);
      } else n > 0 ? setTimeout(() => a(n - 1), o) : s(null);
    };
    a(t);
  });
}
function find_element_instagram_again_posts(e, t = 30, o = 100) {
  return new Promise((s) => {
    const a = (n) => {
      const i = document.querySelector(`a[href*="${e}"]`);
      if (i) {
        const r = i.closest('div');
        r?.scrollIntoView({ behavior: 'auto', block: 'center' });
        const _ = (l) => l && !l.startsWith('data:image/gif'),
          d = () => {
            const m = r?.querySelector('img[src]')?.getAttribute('src') || '',
              g =
                r
                  ?.querySelector('[style*="background-image"]')
                  ?.style?.backgroundImage?.match(
                    /url\(["']?(.*?)["']?\)/
                  )?.[1] || '';
            return _(m) || _(g);
          },
          u = () => {
            d() ? s(r) : t-- > 0 ? setTimeout(u, o) : s(r);
          };
        d() ? s(r) : setTimeout(u, 200);
      } else n > 0 ? setTimeout(() => a(n - 1), o) : s(null);
    };
    a(t);
  });
}
function sort_items(e, t) {
  return t === 'views'
    ? [...e].sort((o, s) => s.viewCount - o.viewCount)
    : t === 'likes'
      ? [...e].sort((o, s) => s.likesCount - o.likesCount)
      : t === 'comments'
        ? [...e].sort((o, s) => s.commentsCount - o.commentsCount)
        : t === 'oldest'
          ? [...e].reverse()
          : 0;
}
function update_data_object_with_element(e, t) {
  return ((e.element = t?.outerHTML), e);
}
function send_items_collected_no(e) {
  if (e !== null)
    try {
      let t = e.length;
      window.postMessage({ item_collected_no: !0, number_items: t }, '*');
    } catch (t) {
      console.error('Error sending message', t);
    }
}
function insta_banner_notification(e, t) {
  if (e !== null)
    try {
      let o = e.length;
      window.postMessage(
        { insta_banner_notification: !0, count: o, type: t },
        '*'
      );
    } catch (o) {
      console.error('Error sending message', o);
    }
}
function removeSortFeedBannerMessage() {
  window.postMessage({ insta_banner_notification_remove: !0 }, '*');
}
async function sort_item_posts(e, t, o, s) {
  return new Promise(async (a) => {
    for (let n = 0; n < e; n++) {
      let i =
          t.data.xdt_api__v1__feed__user_timeline_graphql_connection.edges[n]
            .node,
        r = createMetadataJson(i),
        _ = r.code,
        d = await find_element_instagram_again_posts(_),
        u = update_data_object_with_element(r, d),
        l = save_data_locally_again(u);
      if (sessionStorage.getItem('sortFeedStatus')) {
        if (
          (send_items_collected_no(l),
          insta_banner_notification(l, 'Posts'),
          sessionStorage.getItem('sortFeedStopSorting') === 'on')
        ) {
          (sessionStorage.removeItem('sortFeedStopSorting'),
            sessionStorage.removeItem('sortFeedStatus'),
            (profileNameIG = null),
            a(l));
          return;
        } else if (l.length === o) {
          (sessionStorage.removeItem('sortFeedStopSorting'),
            sessionStorage.removeItem('sortFeedStatus'),
            (profileNameIG = null),
            a(l));
          return;
        } else if (n === e - 1 && !s) {
          (sessionStorage.removeItem('sortFeedStopSorting'),
            sessionStorage.removeItem('sortFeedStatus'),
            (profileNameIG = null),
            a(l));
          return;
        } else if (n === e - 1 && s) break;
      }
    }
  });
}
async function sort_not_all_reels(e, t, o, s) {
  return new Promise(async (a) => {
    for (let n = 0; n < e; n++) {
      let i =
        t.data.xdt_api__v1__clips__user__connection_v2.edges[n].node.media;
      if (i.media_type === 2) {
        let r = createMetadataJsonReels(i),
          _ = return_herf(r),
          d = r.code,
          u = await find_element_instagram_again(d),
          l = update_data_object_with_element(r, u),
          m = save_data_locally_again(l);
        if (sessionStorage.getItem('sortFeedStatus')) {
          if (
            (send_items_collected_no(m),
            insta_banner_notification(m, 'Reels'),
            sessionStorage.getItem('sortFeedStopSorting') === 'on')
          ) {
            (sessionStorage.removeItem('sortFeedStopSorting'),
              sessionStorage.removeItem('sortFeedStatus'),
              (profileNameIG = null),
              a(m));
            return;
          } else if (m.length === o) {
            (sessionStorage.removeItem('sortFeedStopSorting'),
              sessionStorage.removeItem('sortFeedStatus'),
              (profileNameIG = null),
              a(m));
            return;
          } else if (n === e - 1 && !s) {
            (sessionStorage.removeItem('sortFeedStopSorting'),
              sessionStorage.removeItem('sortFeedStatus'),
              (profileNameIG = null),
              a(m));
            return;
          } else if (n === e - 1 && s) break;
        }
      }
    }
  });
}
function remove_overlay() {
  const e = document.getElementById('overlay_sort_reels');
  e && e.remove();
}
function return_date_range(e) {
  let t = new Date(),
    o = new Date();
  if (e === '1_week') return (t.setDate(o.getDate() - 7), [t, o]);
  if (e === '1_month') return (t.setDate(o.getDate() - 30), [t, o]);
  if (e === '3_month') return (t.setDate(o.getDate() - 90), [t, o]);
  if (e === '6_month') return (t.setDate(o.getDate() - 180), [t, o]);
  if (e === '1_year') return (t.setDate(o.getDate() - 360), [t, o]);
  if (e === 'all_reels') return (t.setDate(o.getDate() - 3600), [t, o]);
}
function is_create_date_in_range(e, t, o) {
  const s = new Date(e);
  if (isNaN(s) || isNaN(t) || isNaN(o)) throw new Error('Invalid date format');
  return s >= t && s < o;
}
async function sort_date_posts(e, t, o, s, a) {
  return new Promise(async (n) => {
    for (let i = 0; i < e; i++) {
      let r =
          t.data.xdt_api__v1__feed__user_timeline_graphql_connection.edges[i]
            .node,
        _ = createMetadataJson(r),
        d = await find_element_instagram_again_posts(_.code),
        u = update_data_object_with_element(_, d),
        l = u.createDate;
      if (sessionStorage.getItem('sortFeedStatus')) {
        if (sessionStorage.getItem('sortFeedStopSorting') === 'on') {
          let c = save_data_locally_again(u);
          (removeSortFeedBannerMessage(),
            sessionStorage.removeItem('sortFeedStopSorting'),
            sessionStorage.removeItem('sortFeedStatus'),
            n(c));
          return;
        } else if (is_create_date_in_range(l, s, a) && i !== e - 1) {
          let c = save_data_locally_again(u);
          (send_items_collected_no(c), insta_banner_notification(c, 'Posts'));
        } else if (
          is_create_date_in_range(l, s, a) &&
          i === e - 1 &&
          o === !1
        ) {
          let c = save_data_locally_again(u);
          (send_items_collected_no(c),
            insta_banner_notification(c, 'Posts'),
            sessionStorage.removeItem('sortFeedStopSorting'),
            sessionStorage.removeItem('sortFeedStatus'),
            n(c));
        } else if (
          is_create_date_in_range(l, s, a) &&
          i === e - 1 &&
          o === !0
        ) {
          let c = save_data_locally_again(u);
          (send_items_collected_no(c), insta_banner_notification(c, 'Posts'));
        } else if (!is_create_date_in_range(l, s, a)) {
          if (
            r.timeline_pinned_user_ids &&
            r.timeline_pinned_user_ids.length > 0
          )
            continue;
          {
            let c = inMemoryFeedData.items;
            (sessionStorage.removeItem('sortFeedStopSorting'),
              sessionStorage.removeItem('sortFeedStatus'),
              n(c));
            break;
          }
        }
      }
    }
  });
}
(function () {
  const e = XMLHttpRequest.prototype.open,
    t = XMLHttpRequest.prototype.send;
  ((XMLHttpRequest.prototype.open = function (o, s, a, n, i) {
    return ((this._url = s), e.apply(this, arguments));
  }),
    (XMLHttpRequest.prototype.send = function (o) {
      return (
        this.addEventListener('load', function () {
          if (
            this._url.includes('/graphql/query') &&
            (this.responseType === '' || this.responseType === 'text') &&
            sessionStorage.getItem('sortFeedStatus') &&
            sessionStorage.getItem('sortFeedPostsVSReels') === 'Posts' &&
            sessionStorage.getItem('sortItemsVsDates') === 'dates'
          )
            try {
              let s = JSON.parse(this.responseText);
              if (s.data.xdt_api__v1__feed__user_timeline_graphql_connection) {
                let a =
                    s.data.xdt_api__v1__feed__user_timeline_graphql_connection
                      .edges.length,
                  n =
                    s.data.xdt_api__v1__feed__user_timeline_graphql_connection
                      .page_info.has_next_page,
                  i = sessionStorage.getItem('sortFeedNoItems'),
                  [r, _] = return_date_range(i);
                sort_date_posts(a, s, n, r, _).then((d) => {
                  if (d === null)
                    (removeSortFeedBannerMessage(),
                      remove_overlay(),
                      window.postMessage(
                        { logo_animate_off_zero_insta_time_period: !0 },
                        '*'
                      ));
                  else {
                    let u = sessionStorage.getItem('sortFeedSortBy'),
                      l = sort_items(d, u);
                    (removeSortFeedBannerMessage(),
                      remove_overlay(),
                      window.postMessage(
                        { logo_animate_off: !0, payload: l },
                        '*'
                      ));
                  }
                });
              }
            } catch {}
          else if (
            this._url.includes('/graphql/query') &&
            (this.responseType === '' || this.responseType === 'text') &&
            sessionStorage.getItem('sortFeedStatus') &&
            sessionStorage.getItem('sortFeedPostsVSReels') === 'Posts' &&
            sessionStorage.getItem('sortItemsVsDates') === 'items'
          )
            try {
              let s = JSON.parse(this.responseText);
              if (s.data.xdt_api__v1__feed__user_timeline_graphql_connection) {
                let a =
                    s.data.xdt_api__v1__feed__user_timeline_graphql_connection
                      .edges.length,
                  n =
                    s.data.xdt_api__v1__feed__user_timeline_graphql_connection
                      .page_info.has_next_page,
                  i = return_number_selected(),
                  r = i == 0 ? 1e4 : i;
                sort_item_posts(a, s, r, n).then((_) => {
                  let d = sessionStorage.getItem('sortFeedSortBy'),
                    u = sort_items(_, d);
                  (removeSortFeedBannerMessage(),
                    remove_overlay(),
                    window.postMessage(
                      { logo_animate_off: !0, payload: u },
                      '*'
                    ));
                });
              }
            } catch {}
          else if (
            this._url.includes('/graphql/query') &&
            (this.responseType === '' || this.responseType === 'text') &&
            sessionStorage.getItem('sortFeedStatus') &&
            sessionStorage.getItem('sortFeedPostsVSReels') === 'Reels'
          )
            try {
              let s = JSON.parse(this.responseText);
              if (s.data?.xdt_api__v1__clips__user__connection_v2) {
                let a =
                    s.data.xdt_api__v1__clips__user__connection_v2.edges.length,
                  n =
                    s.data.xdt_api__v1__clips__user__connection_v2.page_info
                      .has_next_page,
                  i = return_number_selected(),
                  r = i == 0 ? 1e4 : i;
                sort_not_all_reels(a, s, r, n)
                  .then((_) => {
                    let d = sessionStorage.getItem('sortFeedSortBy'),
                      u = sort_items(_, d);
                    (removeSortFeedBannerMessage(),
                      remove_overlay(),
                      window.postMessage(
                        { logo_animate_off: !0, payload: u },
                        '*'
                      ));
                  })
                  .catch((_) => {
                    console.error('Reels sort error:', _);
                  });
              }
            } catch (s) {
              console.error(s);
            }
        }),
        t.apply(this, arguments)
      );
    }));
})();
