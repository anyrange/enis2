# enis2

Unofficial NIS client, inspired by previous _enis_ apps:

- [enis](https://github.com/superhooman/enis)
- [eNIS](https://github.com/kekland/enis-app.v3) ([Google Play](https://play.google.com/store/apps/details?id=com.kekland.enis))

[![Uptime Robot](https://img.shields.io/uptimerobot/status/m788722189-0972bdac9b2e03392769f154?label=heroku)](https://stats.uptimerobot.com/kXD0runRnw/788722189)
[![Netlify](https://img.shields.io/netlify/23dfe53d-5fee-4df5-820d-45d6109b713a)](https://app.netlify.com/sites/enis2/deploys)

## Build Setup

**Requires Node.js 16+ and pnpm (preferably)**

```bash
# install dependencies
pnpm install # or npm/yarn

# run client and server concurrently
pnpm dev

# with mock data
pnpm dev:mock

# or separately using commands
pnpm client
pnpm server
```

### Environment variables

Rename [.env.example](/.env.example) to .env and set your variables or keep the default

### API documentation

Starting the server will let you investigate the API via Swagger by getting detailed information about endpoints, and their request/response schemas at [http://localhost:8887/docs](http://localhost:8887/docs)

![Swagger](https://i.imgur.com/pPxuhW9.png)

## Contributing

Contributions are welcome. Just submit a pull request or open an issue

## License

[MIT](/LICENSE)
