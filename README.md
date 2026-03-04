# cast-media

Cast local audio files to Chromecast devices from a web UI.

This project has:

- A Node.js/Fastify server (`server/`) that discovers Chromecast devices and serves audio.
- A React client (`client/`) that lists files and lets you choose a cast target.

## Features

- Discover Chromecast devices on your local network.
- Cast `.mp3` and `.wav` files from a local directory.
- Optional cover art support: if `track.mp3` exists and `track.png` exists with the same base name, the image is sent as media cover art.
- Basic browser recording UI that uploads audio to the server.

## Requirements

- Node.js 18+ (recommended)
- npm
- Chromecast device(s) on the same LAN/WiFi as the host running this app

## Install

```bash
git clone git@github.com:robmcelhinney/cast-media.git
cd cast-media
cd server && npm install
cd ../client && npm install
```

## Run

### Option A: Serve built client from the server (single process)

```bash
cd server
npm start
```

This runs:

1. `client` production build
2. Fastify server on port `4567` by default

Open: `http://<server-ip>:4567`

### Option B: Run server manually

```bash
cd server
node bin.js
```

Useful flags:

```bash
node bin.js --path=public/ --port=4567
node bin.js --path=/path/to/your/audio --port=5000
```

## Development workflow

Run server:

```bash
cd server
npm run start-server
```

Run client dev server (separate terminal):

```bash
cd client
npm start
```

Client dev proxy target is configurable in `client/src/setupProxy.js`:

1. `API_PROXY_TARGET`
2. `REACT_APP_API_PROXY_TARGET`
3. fallback: `http://localhost:4567`

Example:

```bash
cd client
API_PROXY_TARGET=http://192.168.1.42:4567 npm start
```

## How file discovery works

- The server scans only the configured base directory (non-recursive).
- Hidden files are ignored.
- Only `.mp3` and `.wav` files are returned by `/api/files`.

Default base directory for `node bin.js` is:

`server/public/`

## Notes and current limitations

- Device and server must be on the same local network.
- Audio recording in browsers generally requires HTTPS (or localhost in some cases).
- Directory browsing is currently limited; file listing is flat from the base directory.
- No automated test suite is configured in `server` yet.

## License

See [LICENSE.md](LICENSE.md).
