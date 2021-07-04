# enis2

[![Netlify Status](https://api.netlify.com/api/v1/badges/23dfe53d-5fee-4df5-820d-45d6109b713a/deploy-status)](https://app.netlify.com/sites/enis2/deploys)

> Unofficial NIS client, inspired by [enis](https://github.com/superhooman/enis)

## Running Locally

### Installation

Clone this repository

```bash
git clone https://github.com/anyrange/enis2.git
cd enis2
```

Install **client** dependencies in root folder, and **server** dependencies in [server](/server/) folder

```bash
npm install && cd server
npm install && cd ..
```

Run client and server concurrently

```bash
npm run dev
```

Or separately using commands

```bash
npm run serve
npm run server
```

### Environment variables

Rename [.env.example](/.env.example) to `.env` and set your variables or keep the default

### Mock API

Due to the fact that during the development of `enis2` the original client was unavailable, mock date was added and enabled by default in development mode, you can comment it out or leave it on

### API documentation

Starting the app will let you investigate the API via Swagger by getting detailed information about endpoints, and their request/response schemes at [http://localhost:8887/doc](http://localhost:8887/doc)

![Swagger](https://i.imgur.com/fULUHZr.png)

## Contributing

Contributions are welcome. Just submit a pull request or open an issue

## License

[MIT](/LICENSE)
