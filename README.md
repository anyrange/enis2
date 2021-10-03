# enis2

Unofficial NIS client, inspired by [enis](https://github.com/superhooman/enis)

[![Uptime Robot](https://img.shields.io/uptimerobot/status/m788722189-0972bdac9b2e03392769f154?label=heroku)](https://stats.uptimerobot.com/kXD0runRnw/788722189)
[![Netlify](https://img.shields.io/netlify/23dfe53d-5fee-4df5-820d-45d6109b713a)](https://app.netlify.com/sites/enis2/deploys)

## Installation

Install dependencies

`npm install`

Run client and server concurrently

`npm run dev`

Or separately using commands

`npm run serve`  
`npm run server`

### Environment variables

Rename [.env.example](/.env.example) to .env and set your variables or keep the default

### Mock API

Due to the fact that during the development the original client was unavailable, mock data was added and enabled by default in development mode, you can comment it out or leave it on

### API documentation

Starting the server will let you investigate the API via Swagger by getting detailed information about endpoints, and their request/response schemas at [http://localhost:8887/docs](http://localhost:8887/docs)

![Swagger](https://i.imgur.com/pPxuhW9.png)

## Contributing

Contributions are welcome. Just submit a pull request or open an issue

## License

[MIT](/LICENSE)
