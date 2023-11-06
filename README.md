# fragmants

Fragments back-end API

Welcome to the Fragmants project! This README provides instructions on how to set up and run the project's scripts.

## Prerequisites

Before you begin, make sure you have the following software installed:

- [Node.js](https://nodejs.org/)
- [npm](https://www.npmjs.com/) (Node Package Manager)

## Installation

1. Clone this repository to your local machine:

   ```bash
   git clone https://github.com/senecaSparsh/fragmants.git
   cd fragmants
   ```

Install project dependencies using npm:
npm install

Available Scripts:
In the project directory, you can run the following npm scripts:

Lint:
The lint script uses ESLint to check your code for style and syntax issues.
npm run lint

Start:
The start script runs the server in production mode.
npm start

Dev:
The dev script runs the server in development mode using nodemon, which automatically restarts the server when code changes are detected. It also sets the log level to debug.
npm run dev

Debug:
The debug script is similar to dev, but it also starts the Node.js inspector on port 9229, allowing you to attach a debugger (e.g., VSCode) for in-depth debugging.
npm run debug

Usage:
To use these scripts effectively, follow these additional steps:

Setting Environment Variables:
The LOG_LEVEL environment variable can be used to control the log level when running dev or debug scripts. By default, it is set to debug. You can override it as needed.
LOG_LEVEL=info npm run dev

For Windows users, you can use the cross-env package to set environment variables:

npm install --save-dev cross-env
Then, use it like this:
npx cross-env LOG_LEVEL=info npm run dev

Debugging:
When using the debug script, you can attach a debugger (e.g., VSCode) to inspect and debug your code. Follow your debugger's documentation for details on how to do this.

## To Run`

`npm i`- installs necessary dependencies for running locally

`npm start` - to start running the server at `node src/index.js`

`npm run lint `- runs check on coding style and problems

When the server started successfully on `localhost:8080` with an health check and the logger message should show that `Server started` and `Cognito JWKS cached`.

# To Test

`npm run dev ` - run the server in development mode

`npm run debug ` - runs the server in debug mode

`nodemon` is configured and will keep monitorning for code changes and restarting the server.

# dependency setups & formatter

`prettier` setup in `.prettierrc`

`eslint` setup in `.eslintrc.js` run `npm run lint` to detect formatting issues.

`Hadolint` used for this project to format the Dockerfile.
Run `Hadolint Dockerfile` to format the Dockerfile.

# Docker image

This project is dockerized, image resides in Dockerhub: [sagarwal9/fragmants](https://hub.docker.com/repository/docker/sagarwal9/fragmants/general)

OR simply run

`docker pull sagarwal9/fragmants:latest`
