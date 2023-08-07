# enis2

[![Uptime Robot](https://img.shields.io/uptimerobot/status/m788722189-0972bdac9b2e03392769f154?label=server)](https://stats.uptimerobot.com/kXD0runRnw/788722189)

One of many _enis_ implementations.

> _enis_ is a common name references unofficial client for an electronic school journal used in NIS schools.

[approximate history](https://lean-shadow-c79.notion.site/enis2-docs-3a033e48f5c94eb7aa153bd3c103d729?pvs=4)

## Known Issues

As it is described [here](https://github.com/superhooman/enis-proxy), NIS doesn't have a public API, so we had to do a custom server that works as an interlayer to bypass the CORS policy since the approach with a proxy server doesn't seem to work anymore. That's why it leads to additional delays and privacy concerns.

## Getting Started

This project requires [Node.js](https://nodejs.org/en/download/current/) 16+ and [yarn](https://yarnpkg.com/)

### Copy env template file

```bash
cp .env.development .env
```

### Install

```bash
yarn install
```

### Start

```bash
yarn dev
```

## API documentation

Starting the server will let you investigate the API via Swagger by getting detailed information about endpoints and their request/response schemas at [http://localhost:4000/docs](http://localhost:4000/docs)

<img src=".github/media/swagger.png" alt="Swagger"/>

## Contributing

- Fork the repo and create your branch from main
- Submit the pull request

## License

[MIT](/LICENSE)
