# enis2
s
[![Uptime Robot](https://img.shields.io/uptimerobot/status/m788722189-0972bdac9b2e03392769f154?label=server)](https://stats.uptimerobot.com/kXD0runRnw/788722189)
[![Netlify](https://img.shields.io/netlify/23dfe53d-5fee-4df5-820d-45d6109b713a)](https://app.netlify.com/sites/enis2/deploys)

One of many _enis_ implementations.

> _enis_ is a common name references unofficial client for an electronic school journal used in NIS schools.

Similar apps:

- [enis](https://github.com/superhooman/enis)
- [eNIS](https://github.com/kekland/enis-app.v3) - [Google Play](https://play.google.com/store/apps/details?id=com.kekland.enis)
- NISx - [Google Play](https://play.google.com/store/apps/details?id=com.release.nisx)

## Known Issues

As it is described [here](https://github.com/superhooman/enis-proxy), NIS doesn't have a public API, so we had to do a custom server that works as an interlayer to bypass the CORS policy since the approach with a proxy server doesn't seem to work anymore. That's why it leads to additional delays and privacy concerns.

## Contributing

### Development Setup

This project requires [Node.js](https://nodejs.org/en/download/current/) 16+ and [pnpm](https://pnpm.io/)

Fork this repository, clone it and run:

```bash
pnpm i
npx simple-git-hooks
```

Available scripts

```bash
pnpm dev # run project in development mode
pnpm build # build client
pnpm start # start in production mode
pnpm format # format code with prettier
pnpm lint # check code with eslint
```

### Environment variables

Rename [.env.example](/.env.example) to `.env` and set your variables.

## API documentation

Starting the server will let you investigate the API via Swagger by getting detailed information about endpoints, and their request/response schemas at [http://localhost:4000/docs](http://localhost:4000/docs)

![Swagger](https://i.imgur.com/pPxuhW9.png)

## License

[MIT](/LICENSE)
