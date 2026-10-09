// Songs come only from your Spotify playlist (see server.js). This table just remembers the genre and
// the old id of songs that were in the player before syncing, so genre filters and your playlists keep working.
// Genre label given to every song that is not in the table below. Change it, or leave the table empty ({}).
const DEFAULT_GENRE = "New";
const KNOWN = {
  "2wuyWxVLDb77f8IQDm0Wud": [1, "Desi Hip Hop"],
  "03gyypnQJAVHQvvvMDzBry": [2, "Desi Hip Hop"],
  "2Xv14bnP2GP8CybxqUswoK": [3, "Desi Hip Hop"],
  "2sKGuYiQKoBR9CTqbkwSuF": [4, "Desi Hip Hop"],
  "1MGGL4HhGkixTKXpNj43Zb": [5, "Desi Hip Hop"],
  "2yBdPWudIIKN3xTxenXQq7": [6, "EDM"],
  "3flzo4373JcoXicO9UaauH": [7, "Desi Hip Hop"],
  "4EN2UWenJaUz7oqedBb71J": [8, "Desi Hip Hop"],
  "6NgoXXde6qt8hyoFm9AvGZ": [9, "Desi Hip Hop"],
  "66s9aISvW3W2Pc4rtabwqV": [10, "Indie"],
  "4LjxlyDVFAKC9o9Zwff7OI": [11, "Indie"],
  "1UoQLTy4DunNgehLLzB1j3": [12, "Desi Hip Hop"],
  "1Q0GqD12MfkQd7pvLh8eBp": [13, "Other"],
  "2Et2DyR9xtbM0omIgmlItk": [14, "Phonk"],
  "3VFySvZMSn4z4X4YDDQb0H": [15, "Phonk"],
  "7yZlRfxDEw9d7pTc0ftdSF": [16, "Desi Hip Hop"],
  "6XjDF6nds4DE2BBbagZol6": [17, "Reggaeton"],
  "27xsLWmSmEAiXABnOngOw7": [18, "Desi Hip Hop"],
  "0nXYmY9YtiHkFGlR3cusur": [19, "Desi Hip Hop"],
  "27RUSRuxpvs7h3M6d4VR3l": [20, "Desi Hip Hop"],
  "53LVgD7RguP5syVZfA76G7": [21, "Desi Hip Hop"],
  "6Z3GcU6x1v1Wm2R7FRWuJF": [22, "Desi Hip Hop"],
  "0O6wigduA3rtduPAm7vmci": [23, "Desi Hip Hop"],
  "2VX9Q3uMmTH5S8dt8PzMmX": [24, "Desi Hip Hop"],
  "5Fm2q30qXK4VnEAg6XX4sv": [25, "Desi Hip Hop"],
  "0F9n5d5lIUgBxqbizQkHII": [26, "Desi Hip Hop"],
  "19pHSvXUwErAXFktkvYMk9": [27, "Desi Hip Hop"],
  "3l3BzT3Ovdx2mQK366r5Ei": [28, "Desi Hip Hop"],
  "13eTaCUUVpmzevPC1789aA": [29, "Desi Hip Hop"],
  "1Iqn110sncyGBTNEHGnhAU": [30, "Desi Hip Hop"],
  "6DtmY1H3Uo1g6MoD6sKKjm": [31, "Desi Hip Hop"],
  "2qb5ASYergjk2qNLvYEQJD": [32, "Desi Hip Hop"],
  "26XaOsDMbl0e1cVKYfkz6w": [33, "Pop"],
  "1vgVsR5rkXGP4NmUcoroJH": [34, "Bollywood"],
  "2XWb9OsiLL6U6SZErdo28E": [35, "Desi Hip Hop"],
  "15zn8wY4uZ05htjsWBanjS": [36, "Desi Hip Hop"],
  "1hg3RlqFZXJb5YgRoK9qmF": [37, "Drill"],
  "4Ttg2ZRg24knfykSp52aiM": [38, "Desi Hip Hop"],
  "2ZRo7axmMPeSVUvDbGkJah": [39, "Hip Hop"],
  "2HIQKpI6qxrU8LjDLHmbSb": [40, "Desi Hip Hop"],
  "3ezm3DukK26vagWIIPvmgS": [41, "Desi Hip Hop"],
  "0tG08mgXKpGLBUT1Kd8f2W": [42, "Desi Hip Hop"],
  "1K9ctCB2Rr5VpSeco0HGfU": [43, "Desi Hip Hop"],
  "6mvCUCswLeGI86YviMtCCb": [44, "Desi Hip Hop"],
  "46NDirefnVQnrNXzpkF5DP": [45, "Desi Hip Hop"],
  "7JCbPoEUv22J07SL0HsAUi": [46, "Desi Hip Hop"],
  "3kemh3cl49TaroK0xJdTPm": [47, "Desi Hip Hop"],
  "0H0EK7Jl2TWhdJNyUDYWDu": [48, "Desi Hip Hop"],
  "6sXibluMzgiLgLBvjySOdd": [49, "Bollywood"],
  "2ikI9Y7PCPIavU0TMSpF31": [50, "Desi Hip Hop"],
  "57BGVV6wcyhbn3hsjlqEZB": [51, "Drill"],
  "792HwhrdO3ErRKL5yRe4Ge": [52, "Drill"],
  "6M47gaKejso9772SKTa3yH": [53, "Hip Hop"],
  "2IodN2cQX9LASXaRu6Ovqd": [54, "Desi Hip Hop"]
};
const songs = [];

// ---------- State ----------
const store = {
  get(key, fallback) {
    try { const v = localStorage.getItem(key); return v === null ? fallback : JSON.parse(v); }
    catch { return fallback; }
  },
  set(key, value) { try { localStorage.setItem(key, JSON.stringify(value)); } catch {} }
};
const thumbs = store.get("thumbs", {});       // cover art links, remembered between visits
songs.push(...store.get("synced-songs", []).map(s => ({ ...s, thumb: thumbs[s.id] })));

let currentId = songs[0]?.id ?? null;
let queue = songs.map(s => s.id);             // songs that Next/Prev move through
let genre = "All", shuffle = false, repeat = "off";   // repeat: off | all | one
let playlists = store.get("playlists-v2", {});         // { name: [songId, ...] }
let selectedPlaylist = null;
let loadToken = 0;

const $ = id => document.getElementById(id);
const card = document.querySelector(".card");
const byId = id => songs.find(s => s.id === id);
const say = msg => { $("status").textContent = msg; };

const placeholder = name => "data:image/svg+xml," + encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" fill="#4a3f6b"/><text x="50" y="66" font-size="48" text-anchor="middle" fill="#e6dcff" font-family="Georgia,serif">${name[0]}</text></svg>`);
function setArt(img, song) {
  img.onerror = () => { img.onerror = null; img.src = placeholder(song.name); };
  img.src = song.thumb || placeholder(song.name);
}

// ---------- Theme ----------
function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  $("theme-toggle").checked = theme === "dark";
  store.set("theme", theme);
}
function toggleTheme() { applyTheme($("theme-toggle").checked ? "dark" : "light"); }

// ---------- Library ----------
function songRow(song, onClick) {
  const b = document.createElement("button");
  b.className = "song-row" + (song.id === currentId ? " active" : "");
  const img = document.createElement("img");
  img.alt = ""; img.dataset.id = song.id; setArt(img, song);
  const meta = document.createElement("span");
  meta.className = "meta";
  meta.innerHTML = "<span></span><span></span>";
  meta.children[0].textContent = song.name;
  meta.children[1].textContent = song.artist;
  b.append(img, meta);
  b.onclick = onClick;
  return b;
}

function visibleSongs() {
  const q = $("song-search").value.trim().toLowerCase();
  return songs.filter(s =>
    (genre === "All" || s.genre === genre) &&
    (s.name.toLowerCase().includes(q) || s.artist.toLowerCase().includes(q)));
}

function renderGenres() {
  const box = $("genre-chips");
  box.innerHTML = "";
  ["All", ...new Set(songs.map(s => s.genre))].forEach(g => {
    const b = document.createElement("button");
    b.textContent = g === "All" ? "All genres" : g;
    b.setAttribute("aria-pressed", String(g === genre));
    b.onclick = () => { genre = g; renderGenres(); showSongs(); };
    box.appendChild(b);
  });
}

function showSongs() {
  const list = $("songs-list");
  list.innerHTML = "";
  const found = visibleSongs();
  if (!found.length) {
    list.innerHTML = `<p class="empty">${songs.length ? "No songs match in your list." : "No songs yet. Start node server.js, open http://127.0.0.1:5500/ and press Sync playlist."}</p>`;
    return;
  }
  found.forEach(song => list.appendChild(songRow(song, () => {
    queue = found.map(s => s.id);
    loadSong(song.id, true);
  })));
}

// Cover art for the list, from Spotify's public oEmbed (no key needed). Slow on purpose.
let warming = false;
const triedThumbs = new Set();
async function warmThumbs() {
  if (warming) return;
  warming = true;
  let s;
  while ((s = songs.find(x => !x.thumb && !triedThumbs.has(x.id)))) {   // picks up songs added while running
    triedThumbs.add(s.id);
    try {
      const url = encodeURIComponent(`https://open.spotify.com/track/${s.spotify}`);
      const res = await fetch(`https://open.spotify.com/oembed?url=${url}`);
      if (res.ok) {
        s.thumb = (await res.json()).thumbnail_url;
        thumbs[s.id] = s.thumb; store.set("thumbs", thumbs);
        document.querySelectorAll(`img[data-id="${s.id}"]`).forEach(i => { i.src = s.thumb; });
        if (s.id === currentId) setArt($("card-img"), s);
      }
    } catch { /* offline: keep placeholders */ }
    await new Promise(r => setTimeout(r, 150));
  }
  warming = false;
}

// ---------- Sync with the Spotify playlist (needs server.js) ----------
let lastSync = 0, firstSync = true, lastSig = "";
async function syncPlaylist(force, manual) {
  if (!force && Date.now() - lastSync < 15000) return;
  lastSync = Date.now();
  try {
    const res = await fetch(manual ? "/api/playlist?fresh=1" : "/api/playlist");
    if (!res.ok) throw new Error("helper unavailable");
    const tracks = await res.json();
    if (!Array.isArray(tracks) || !tracks.length) throw new Error("empty");
    const merged = tracks.map(t => {
      const k = KNOWN[t.spotify];
      const id = k ? k[0] : `pl${t.spotify}`;
      return { id, spotify: t.spotify, name: t.name, artist: t.artist, genre: k ? k[1] : DEFAULT_GENRE, thumb: thumbs[id] };
    });
    const sig = JSON.stringify(merged.map(s => [s.id, s.name, s.artist]));
    if (sig === lastSig) {                       // nothing changed: leave the list alone
      triedThumbs.clear(); warmThumbs();
      if (manual) say(`Already up to date: ${songs.length} songs.`);
      firstSync = false;
      return;
    }
    lastSig = sig;
    triedThumbs.clear();
    const before = new Set(songs.map(s => s.spotify));
    const added = merged.filter(s => !before.has(s.spotify)).length;
    songs.splice(0, songs.length, ...merged);
    store.set("synced-songs", songs.map(({ thumb, ...s }) => s));
    if (currentId === null) { currentId = songs[0].id; loadSong(currentId, false); }
    if (firstSync) queue = songs.map(s => s.id);
    renderGenres(); showSongs(); warmThumbs();
    if (firstSync || manual) say(`Synced with your Spotify playlist: ${songs.length} songs${manual && added ? `, ${added} new` : ""}.`);
    firstSync = false;
  } catch {
    if (firstSync || manual) say("Couldn't read your playlist. Start it with node server.js and open http://127.0.0.1:5500/");
    firstSync = false;
  }
}

// ---------- Player (Spotify's own player does the playing) ----------
let spController = null, spReady = null, wantPlay = false, armedFor = 0;

function spotifyApi() {
  return spReady ??= new Promise(resolve => {
    window.onSpotifyIframeApiReady = api => resolve(api);
    const s = document.createElement("script");
    s.src = "https://open.spotify.com/embed/iframe-api/v1"; s.async = true;
    s.onerror = () => resolve(null);
    document.head.appendChild(s);
  });
}

let lastPos = 0;   // how far the current song got while playing
function onPlayback(e) {
  const d = e.data;
  if (!d) return;
  if (location.hash === "#debug") console.log("spotify playback_update", d);
  card.classList.toggle("playing", !d.isPaused);
  if (!d.isPaused) { wantPlay = false; lastPos = d.position; }
  // Spotify sends no "ended" event. A song has finished when the player stops at its end,
  // or stops and rewinds to 0 after it was playing. Leftover updates from the previous song are ignored.
  if (d.duration && d.position < d.duration - 1500) armedFor = loadToken;
  const atEnd = d.duration && d.position >= d.duration - 800;
  const rewound = d.position === 0 && lastPos > 5000;
  if (d.isPaused && armedFor === loadToken && (atEnd || rewound)) {
    armedFor = 0; lastPos = 0;
    handleEnded();
  }
}

async function loadSong(id, autoplay) {
  const song = byId(id);
  if (!song) return;
  const token = ++loadToken;
  currentId = id; wantPlay = autoplay; lastPos = 0;
  $("card-title").textContent = song.name;
  $("card-artist").textContent = song.artist;
  setArt($("card-img"), song);
  say("");
  showSongs(); renderPlaylistSongs();
  document.querySelector("#songs-list .active")?.scrollIntoView({ block: "nearest" });

  const api = await spotifyApi();
  if (token !== loadToken) return;               // another song was picked meanwhile
  if (!api) { say("Spotify's player couldn't load. Check your internet connection."); return; }
  const uri = `spotify:track:${song.spotify}`;
  if (spController) {
    spController.loadUri(uri);
    if (autoplay) spController.play();
    return;
  }
  const mount = document.createElement("div");
  $("embed-wrap").replaceChildren(mount);
  api.createController(mount, { uri, width: "100%", height: 152 }, c => {
    spController = c;
    c.addListener("ready", () => { if (wantPlay) c.play(); });
    c.addListener("playback_update", onPlayback);
  });
}

function togglePlay() {
  if (spController) spController.togglePlay(); else loadSong(currentId, true);
}

function step(dir) {
  if (!queue.length) return;
  let i = queue.indexOf(currentId);
  if (shuffle && queue.length > 1) {
    do { i = Math.floor(Math.random() * queue.length); } while (queue[i] === currentId);
  } else {
    i = (i + dir + queue.length) % queue.length;
  }
  loadSong(queue[i], true);
}

function handleEnded() {
  if (repeat === "one") { spController.seek(0); spController.play(); return; }
  const last = queue.indexOf(currentId) === queue.length - 1;
  if (last && repeat === "off" && !shuffle) return;
  step(1);
}

$("play-btn").onclick = togglePlay;
$("prev-btn").onclick = () => step(-1);
$("next-btn").onclick = () => step(1);
$("shuffle-btn").onclick = e => {
  shuffle = !shuffle;
  e.currentTarget.setAttribute("aria-pressed", String(shuffle));
};
$("repeat-btn").onclick = e => {
  repeat = { off: "all", all: "one", one: "off" }[repeat];
  const b = e.currentTarget;
  b.dataset.mode = repeat;
  b.title = `Repeat: ${repeat}`;
  b.setAttribute("aria-label", b.title);
  b.setAttribute("aria-pressed", String(repeat !== "off"));
};

document.addEventListener("keydown", e => {
  if (e.code === "Space" && !/^(INPUT|BUTTON|SELECT|TEXTAREA|A|IFRAME)$/.test(document.activeElement.tagName)) {
    e.preventDefault(); togglePlay();
  }
});

// ---------- Playlists ----------
const savePlaylists = () => store.set("playlists-v2", playlists);

function createPlaylist() {
  const input = $("playlist-name-input");
  const name = input.value.trim();
  if (!name) { say("Enter a playlist name first."); return; }
  if (Object.hasOwn(playlists, name)) { say(`A playlist named "${name}" already exists.`); return; }
  playlists[name] = [];
  selectedPlaylist = name;
  input.value = "";
  savePlaylists(); renderPlaylists(); renderPlaylistSongs();
  say(`Created "${name}". Add songs with "Add to playlist".`);
}

function addToPlaylist() {
  if (!selectedPlaylist) { say("Create or select a playlist first."); return; }
  const list = playlists[selectedPlaylist];
  if (list.includes(currentId)) { say(`"${byId(currentId).name}" is already in ${selectedPlaylist}.`); return; }
  list.push(currentId);
  savePlaylists(); renderPlaylistSongs();
  say(`Added to ${selectedPlaylist}.`);
}

function removeFromPlaylist(name, id) {
  playlists[name] = playlists[name].filter(x => x !== id);
  savePlaylists(); renderPlaylistSongs();
}

function deletePlaylist(name) {
  if (!confirm(`Delete the playlist "${name}"?`)) return;
  delete playlists[name];
  if (selectedPlaylist === name) selectedPlaylist = null;
  savePlaylists(); renderPlaylists(); renderPlaylistSongs();
}

function row(label, active, onOpen, actions) {
  const div = document.createElement("div");
  div.className = "item-row" + (active ? " active" : "");
  const name = document.createElement("button");
  name.className = "name"; name.textContent = label; name.onclick = onOpen;
  const box = document.createElement("div");
  box.className = "row-actions";
  actions.forEach(([text, fn]) => {
    const b = document.createElement("button");
    b.className = "small"; b.textContent = text;
    b.onclick = e => { e.stopPropagation(); fn(); };
    box.appendChild(b);
  });
  div.append(name, box);
  return div;
}

function renderPlaylists() {
  const box = $("all-playlists-list");
  const q = $("playlist-search").value.trim().toLowerCase();
  box.innerHTML = "";
  const names = Object.keys(playlists).filter(n => n.toLowerCase().includes(q));
  if (!names.length) {
    box.innerHTML = `<p class="empty">${Object.keys(playlists).length ? "No playlists match your search." : "No playlists yet. Create one above."}</p>`;
    return;
  }
  names.forEach(n => box.appendChild(row(n, n === selectedPlaylist,
    () => { selectedPlaylist = n; renderPlaylists(); renderPlaylistSongs(); },
    [["Delete", () => deletePlaylist(n)]])));
}

function renderPlaylistSongs() {
  const box = $("current-playlist-songs");
  box.innerHTML = "";
  if (!selectedPlaylist) {
    box.innerHTML = '<p class="empty">Select or create a playlist.</p>';
    return;
  }
  const ids = playlists[selectedPlaylist];
  const title = document.createElement("h3");
  title.textContent = selectedPlaylist;
  box.appendChild(title);
  if (!ids.length) {
    box.insertAdjacentHTML("beforeend", '<p class="empty">Empty. Play a song and choose "Add to playlist".</p>');
    return;
  }
  ids.forEach(id => {
    const s = byId(id);
    if (!s) return;
    box.appendChild(row(`${s.name} - ${s.artist}`, id === currentId,
      () => { queue = [...ids]; loadSong(id, true); },
      [["Remove", () => removeFromPlaylist(selectedPlaylist, id)]]));
  });
}

// ---------- Init ----------
$("theme-toggle").onchange = toggleTheme;
$("song-search").oninput = showSongs;
$("sync-btn").onclick = () => syncPlaylist(true, true);
$("playlist-search").oninput = renderPlaylists;
$("create-btn").onclick = createPlaylist;
$("playlist-name-input").onkeydown = e => { if (e.key === "Enter") createPlaylist(); };
$("add-to-playlist-btn").onclick = addToPlaylist;

window.onload = () => {
  applyTheme(store.get("theme", matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark"));
  renderGenres(); showSongs(); renderPlaylists(); renderPlaylistSongs();
  if (currentId !== null) loadSong(currentId, false);   // browsers block autoplay on page load
  syncPlaylist(true).finally(warmThumbs);
  document.addEventListener("visibilitychange", () => { if (!document.hidden) syncPlaylist(); });
  setInterval(() => { if (!document.hidden) syncPlaylist(); }, 20000);   // quiet check while the page is open
};
