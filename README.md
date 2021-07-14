# enis2

[![Netlify Status](https://api.netlify.com/api/v1/badges/23dfe53d-5fee-4df5-820d-45d6109b713a/deploy-status)](https://app.netlify.com/sites/enis2/deploys)

Unofficial NIS client, inspired by [enis](https://github.com/superhooman/enis)

## Installation

Install **client** dependencies in [client](/client/) folder and run

```bash
npm run serve
```

Then install **server** dependencies in [server](/server/) folder and run

```bash
npm run dev
```

### Environment variables

Rename [.env.example](/.env.example) to `.env` and set your variables or keep the default

### Mock API

Due to the fact that during the development the original client was unavailable, mock date was added and enabled by default in development mode, you can comment it out or leave it on

### API documentation

Starting the app will let you investigate the API via Swagger by getting detailed information about endpoints, and their request/response schemas at [http://localhost:8887/doc](http://localhost:8887/doc)

![Swagger](https://i.imgur.com/fULUHZr.png)

## Contributing

Contributions are welcome. Just submit a pull request or open an issue

## License

[MIT](/LICENSE)
