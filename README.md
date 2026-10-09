# Music Player

A web music player that shows the songs of a Spotify playlist and plays them through Spotify's own player.
When you add or remove a song in the Spotify playlist, the player picks up the change by itself.
See `notes.md` for what the project is and how it works.

## Run it
1. Install Node.js 18 or newer (the LTS version) from https://nodejs.org.
2. Open a terminal in this folder and run: `node server.js`
3. Open http://127.0.0.1:5500/ in your browser. Keep the terminal open while you use the player.

Do not open `index.html` by double-clicking it, and do not use VS Code Live Server: the playlist is read by
`server.js`, so the page has to be opened through it.

## Using it with YOUR Spotify playlist
This copy is set up for the author's playlist. To use your own, change these things:

### 1. Required: the playlist id in `server.js`
Open `server.js` and change this line near the top:

```js
const PLAYLIST_ID = "7vC8ofpebGs759CxxSGz65";
```

To find your id: in Spotify open your playlist, choose Share, then Copy link to playlist. The link looks like
`https://open.spotify.com/playlist/7vC8ofpebGs759CxxSGz65?si=...`. The id is the part after `/playlist/` and before `?`.

The playlist must be **public** (in Spotify: playlist menu, then "Make public"), or the player cannot read it.

### 2. Recommended: clear the author's genre table in `script.js`
Near the top of `script.js` there is a table called `KNOWN`. It lists the author's songs with a genre each.
It does nothing for your songs, so replace the whole table with an empty one:

```js
const KNOWN = {};
```

Every song then gets the label in `DEFAULT_GENRE` (just above it). Set that to something useful, for example
`const DEFAULT_GENRE = "Songs";`. The genre buttons above the list are built from these labels. You can also add your
own entries to `KNOWN`, in the form `"<spotify track id>": [<unique number>, "<genre>"]`.

### 3. Optional
| What | Where | Change to |
| --- | --- | --- |
| Page title and heading | `index.html` (`<title>` and `<h1>`) | your own name for the player |
| Port | `PORT` in `server.js` | another number if 5500 is busy, then open that port in the browser |
| How often it checks the playlist | `setInterval(... 20000)` near the end of `script.js` | milliseconds between checks |
| Colours | the `:root` and `[data-theme="dark"]` blocks at the top of `style.css` | your own colours |

### 4. Start fresh
The player remembers the last synced song list, cover links and your own playlists in the browser. If you switch to a
different Spotify playlist and see leftovers, open the browser's developer tools (F12), go to Application, then
Local Storage, and clear the entries for `127.0.0.1`.

## How the sync behaves
- The list is read when you open the page, every 20 seconds while the page is open, when you switch back to the tab,
  and right away when you press "Sync playlist".
- If the helper is not running, the player shows the last list it saved. Start it and press "Sync playlist".
- The terminal running `server.js` prints a line each time it reads the playlist.

## Troubleshooting
- **Status line says it couldn't read the playlist:** check that `node server.js` is running, that the playlist is
  public, and that the id in `server.js` is correct.
- **"Invalid package config" error from Node:** a broken `package.json` exists in a parent folder. The `package.json`
  in this folder normally prevents that. If you deleted it, create one containing `{ "name": "music-player", "private": true }`.
- **List stopped updating after a long time of working:** the sync reads Spotify's public embed page, which is not an
  official API. If Spotify changes that page, `parseTracks` in `server.js` may need updating.
- **Songs stop after 30 seconds:** Spotify's player only plays previews unless you are logged in to Spotify in the same browser.
