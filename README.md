# enis2

[![Uptime Robot](https://img.shields.io/uptimerobot/status/m788722189-0972bdac9b2e03392769f154?label=heroku)](https://stats.uptimerobot.com/kXD0runRnw/788722189)
[![Netlify](https://img.shields.io/netlify/23dfe53d-5fee-4df5-820d-45d6109b713a)](https://app.netlify.com/sites/enis2/deploys)

Unofficial NIS client, inspired by previous _enis_ apps:

- [enis](https://github.com/superhooman/enis)
- [eNIS](https://github.com/kekland/enis-app.v3) ([Google Play](https://play.google.com/store/apps/details?id=com.kekland.enis))

## Development

### Setup

**This project requires [Node.js](https://nodejs.org/en/download/current/) 16+ and [pnpm](https://pnpm.io/)**

Install from GitHub and run

```bash
git clone https://github.com/anyrange/enis2.git
cd enis2
pnpm install
pnpm run dev
```

Available scripts

```bash
# run client and server separately using commands
pnpm run client
pnpm run server

# run client and server concurrently via
pnpm run dev

# check code with eslint
pnpm run lint

# format code with prettier
pnpm run format
```

### Environment variables

Rename [.env.example](/.env.example) to `.env` and set your variables. Never leave default values in production.

### API documentation

Starting the server will let you investigate the API via Swagger by getting detailed information about endpoints, and their request/response schemas at [http://localhost:8887/docs](http://localhost:8887/docs)

![Swagger](https://i.imgur.com/pPxuhW9.png)

## Deployment

### Client

Deploy your own _enis2_ in one click

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/anyrange/enis2#NODE_VERSION=16&VITE_SERVER_URL=https://enis2-shared.anyrange.ml/)

### Server

You can use Heroku, Railway etc. to deploy your own server for free but you should be aware of the delays.

## Contributing

Contributions are welcome. Just submit a pull request or open an issue

## License

[MIT](/LICENSE)
