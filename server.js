// Serves the music player and keeps it in sync with your Spotify playlist.
//
// Run:  node server.js     then open  http://127.0.0.1:5500/
// Needs no Spotify account settings, API key or Premium. It reads the playlist's public
// embed page, the same one Spotify uses for "Share > Embed playlist". Needs Node.js 18 or newer.
const http = require("http");
const fs = require("fs");
const path = require("path");

const PLAYLIST_ID = "7vC8ofpebGs759CxxSGz65";   // from your playlist link
const PORT = process.env.PORT || 5500;
const CACHE_MS = 10000;
let cache = { time: 0, tracks: [] };

const TYPES = { ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8", ".json": "application/json", ".png": "image/png",
  ".jpg": "image/jpeg", ".svg": "image/svg+xml", ".ico": "image/x-icon", ".md": "text/plain; charset=utf-8" };

// Find every track in the embed page's JSON, in playlist order.
function parseTracks(html) {
  const m = html.match(/<script id="__NEXT_DATA__"[^>]*>([\s\S]*?)<\/script>/);
  if (!m) throw new Error("playlist data not found on the page");
  const tracks = [], seen = new Set();
  const clean = s => String(s ?? "").replace(/\u00a0/g, " ").trim();
  (function walk(node) {
    if (Array.isArray(node)) { node.forEach(walk); return; }
    if (!node || typeof node !== "object") return;
    if (typeof node.uri === "string" && node.uri.startsWith("spotify:track:") && node.title) {
      const id = node.uri.split(":")[2];
      if (!seen.has(id)) { seen.add(id); tracks.push({ spotify: id, name: clean(node.title), artist: clean(node.subtitle) }); }
      return;
    }
    Object.values(node).forEach(walk);
  })(JSON.parse(m[1]));
  return tracks;
}

async function getTracks(fresh) {
  if (fresh || Date.now() - cache.time > CACHE_MS || !cache.tracks.length) {
    const started = Date.now();
    // The changing "t" value stops Spotify's servers from handing back an old saved copy of the page.
    const res = await fetch(`https://open.spotify.com/embed/playlist/${PLAYLIST_ID}?t=${Date.now()}`,
      { headers: { "User-Agent": "Mozilla/5.0", "Cache-Control": "no-cache" } });
    if (!res.ok) throw new Error(`Spotify answered ${res.status}`);
    cache = { time: Date.now(), tracks: parseTracks(await res.text()) };
    console.log(`${new Date().toLocaleTimeString()}  playlist read: ${cache.tracks.length} songs in ${Date.now() - started} ms`);
  }
  return cache.tracks;
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, "http://127.0.0.1");
  if (url.pathname === "/api/playlist") {
    let status = 200, body;
    try { body = await getTracks(url.searchParams.has("fresh")); } catch (err) { status = 502; body = { error: String(err.message || err) }; }
    res.writeHead(status, { "Content-Type": "application/json", "Cache-Control": "no-store" });
    res.end(JSON.stringify(body));
    return;
  }
  const rel = decodeURIComponent(url.pathname === "/" ? "/index.html" : url.pathname);
  const file = path.join(__dirname, rel);
  if (!file.startsWith(__dirname + path.sep)) { res.writeHead(403); res.end("Forbidden"); return; }
  fs.readFile(file, (err, data) => {
    if (err) { res.writeHead(404); res.end("Not found"); return; }
    res.writeHead(200, { "Content-Type": TYPES[path.extname(file).toLowerCase()] || "application/octet-stream" });
    res.end(data);
  });
});

if (require.main === module) {
  server.listen(PORT, process.env.PORT ? "0.0.0.0" : "127.0.0.1", () =>
    console.log(`Music player running on port ${PORT}  (Ctrl+C to stop)`));
}
module.exports = { parseTracks };