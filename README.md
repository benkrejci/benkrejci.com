# Structure

This package is divided into 3 yarn workspace packages:

- **back** - the "backend", a Strapi app which runs the CMS admin UI and API endpoints
- **deployer** - node process which exposes a local API which Strapi app uses to trigger build of "front"
- **front** - website react app

# Yarn commands

`yarn install`
Install dependencies

`yarn setup`
Run backend and deployer setup for server (this configures pm2 to manage processes for each)

`yarn build`
Build all workspace packages

`yarn build:back`
Build the backend

`yarn build:deployer`
Build the deployer

`yarn build:front`
Build the frontend

`yarn dev`
Start the frontend dev server