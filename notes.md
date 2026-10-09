# Music Player: project notes

## What is this?
A personal music player that runs in the browser. Its song list is a Spotify playlist (the author's playlist
"My Taste"). It shows each song with its cover, lets you search and filter the list, build your own playlists, and
plays whatever you pick through Spotify's own embedded player.

## What is it useful for?
- One tidy place to play a playlist, with a spinning-vinyl cover, a genre filter, search, shuffle and repeat.
- The list follows the Spotify playlist, so there is nothing to maintain by hand. Add a song in Spotify and it appears
  in the player; remove it and it disappears.
- Songs start playing as soon as you click them, and the next song starts when one ends.
- Light and dark themes, and your own playlists saved in the browser.
- A small learning project that combines HTML, CSS, JavaScript and a tiny Node.js server.

## How it works
There are three parts.

1. **The page** (`index.html`, `style.css`, `script.js`). It draws the interface, keeps the song list, the search,
   the genre filter, the queue and your own playlists (saved in the browser's local storage).
2. **The helper** (`server.js`). A small Node.js server that does two jobs: it serves the page, and it reads the
   public embed page of the Spotify playlist and returns the list of songs. This has to be done by a server because
   a web page cannot read Spotify's pages directly (the browser blocks it).
3. **Spotify's embedded player.** Playing is done by Spotify's own player, loaded with Spotify's official iFrame API.
   The page tells it which song to load and when to play. The page watches the player's position to notice when a song
   ends, then loads the next one.

The sync, step by step:
1. The page asks the helper for the playlist (on open, every 20 seconds, on returning to the tab, or when you press "Sync playlist").
2. The helper downloads the playlist's embed page, pulls out each song's id, title and artists, and sends the list back.
3. The page replaces its list with the new one, keeps the genre and id of songs it already knew, and fetches cover
   art for new songs from Spotify's public oEmbed address.
4. The last list is saved in the browser, so the page still shows songs when the helper is off.

## Spotify, Premium and ads
Songs are played by Spotify's own embedded player, not by this project. The project does not remove, block or skip
ads, and it does not give a free account Premium features. It only loads Spotify's official player and tells it which
song to play.

What the author saw while using it with a free Spotify account: the songs of the synced playlist played in the player
without ads, unlike listening to the same playlist in the Spotify app, where a free account hears ads between songs.
This is an observation, not something the project controls or guarantees:
- What the embedded player does, including whether it plays ads, is decided by Spotify and can change at any time.
- It depends on the account and on whether you are logged in to Spotify in the browser. Logged out, the player plays
  30-second previews instead of full songs.
- Other people, other accounts or other times may get different results.

So the benefit of syncing a playlist is that you get your songs in one place that updates by itself, and in the
author's experience without the ad breaks of the Spotify app.

## Limits
- The sync reads Spotify's public embed page. That is not an official API, so Spotify can change it and break the sync.
- The playlist must be public.
- Songs added to the playlist show up under one default genre label, because the genre is not available without
  Spotify's Web API (which needs Premium on the app owner's account).
- The helper must be running (`node server.js`) for the list to update.

## Files
| File | Purpose |
| --- | --- |
| `index.html` | page structure |
| `style.css` | layout, light and dark themes |
| `script.js` | player logic, sync, playlists, search |
| `server.js` | serves the page and reads the Spotify playlist |
| `package.json` | tells Node this folder is its own project |
| `README.md` | how to run it and how to use it with another playlist |
| `notes.md` | this file |
