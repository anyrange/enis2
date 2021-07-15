# enis2

Unofficial NIS client, inspired by [enis](https://github.com/superhooman/enis)

[![Netlify Status](https://api.netlify.com/api/v1/badges/23dfe53d-5fee-4df5-820d-45d6109b713a/deploy-status)](https://app.netlify.com/sites/enis2/deploys)

## Installation

Install dev-dependencies to run client and server concurrently

`npm install`

Then, install client and server dependencies

`npm run install-all`

Run client and server concurrently

`npm run dev`

Or separately using commands

`npm run serve`  
`npm run server`

### Environment variables

Rename [.env.example](/.env.example) to .env and set your variables or keep the default

### Mock API

Due to the fact that during the development the original client was unavailable, mock date was added and enabled by default in development mode, you can comment it out or leave it on

### API documentation

Starting the app will let you investigate the API via Swagger by getting detailed information about endpoints, and their request/response schemas at [http://localhost:8887/doc](http://localhost:8887/doc)

![Swagger](https://i.imgur.com/fULUHZr.png)

## Contributing

Contributions are welcome. Just submit a pull request or open an issue

## License

[MIT](/LICENSE)
