# Dockerfile

# Use node version 20.9.0
FROM node:20.9.0 AS dependencies

LABEL maintainer="Sparsh Agarwal <sagarwal9@myseneca.ca>"
LABEL description="Fragments node.js microservice"

# We default to use port 8080 in our service
ENV NODE_ENV=production​

# Reduce npm spam when installing within Docker
# https://docs.npmjs.com/cli/v8/using-npm/config#loglevel
ENV NPM_CONFIG_LOGLEVEL=warn

# Disable colour when run inside Docker
# https://docs.npmjs.com/cli/v8/using-npm/config#color
ENV NPM_CONFIG_COLOR=false

# Use /app as our working directory
WORKDIR /app

# Copy src to /app/src/
COPY ./src ./src

# Option 3: explicit filenames - Copy the package.json and package-lock.json
# files into the working dir (/app), using full paths and multiple source
# files.  All of the files will be copied into the working dir `./app`
COPY package.json package-lock.json ./

RUN npm ci --only=production

# Copy our HTPASSWD file
COPY ./tests/.htpasswd ./tests/.htpasswd

# Start the container by running our server
FROM node:20.9.0-alpine3.17 AS production

# install curl
WORKDIR /
RUN apk --no-cache add curl=8.2.1 && apk --no-cache add dumb-init=1.2.5-r1
COPY --chown=node:node --from=dependencies \
 /app/node_modules/ /app/ \   
/app/src/ /app/  \
/app/package.json ./ 

# We default to use port 8080 in our service
ENV PORT=8080

#Sets Healthcheck for our server
HEALTHCHECK --interval=15s \
  CMD curl –-fail http://localhost:${PORT}/ || exit 1​

# Add a user group node
USER node

# Start the container by running our server
CMD ["dumb-init","node","index.js"]

# We run our service on port 8080
EXPOSE 8080
