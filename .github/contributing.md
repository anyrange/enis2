# Contributing Guide

## Development Setup

This project requires [Node.js](https://nodejs.org/en/download/current/) 16+ and [pnpm](https://pnpm.io/)

Fork this repository, clone it and run:

```bash
pnpm i # install the dependencies
```

## Scripts

```bash
pnpm run dev # run client and server concurrently

pnpm run client # run only client

pnpm run server # run only server

pnpm run lint # check code with eslint

pnpm run format # format code with prettier
```

## Environment variables

Rename [.env.example](/.env.example) to `.env` and set your variables.

## API documentation

Starting the server will let you investigate the API via Swagger by getting detailed information about endpoints, and their request/response schemas at [http://localhost:8887/docs](http://localhost:8887/docs)

![Swagger](https://i.imgur.com/pPxuhW9.png)
