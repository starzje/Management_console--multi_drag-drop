#-------------------------------------------------------------
# Ovo je multi-stage Dockerfile:
#
#  - "build-server-side" = kompilira server-side TypeScript
#  - "server-side-dependencies" = instalira server-side production dependencies
#  - "build-client-side" = kompilira client-side TypeScript
#  - "prod-image" = finalni image
#
#
# Kreirani image možemo brzinski testirati tako da ga
# izravno pokrenemo (standalone):
#   
#   docker run -e DEBUG=* -p 3000:3000 registry.ngit.hr/ngit/remote-module-demo:0.0.0
#
#-------------------------------------------------------------

#--------------------------------------------
# Stage: building server-side TypeScript
#--------------------------------------------
FROM node:16 as build-server-side

ENV WORKDIR=/app
WORKDIR /app

# (BOILERPLATE)
# kopiram SSH key & known_hosts koji su potrebni za `npm i`
# zato što `package.json` pri instalacija NGIT paketa koristi
# SSH autentikaciju
#
# NAPOMENA
# `package.json` koji se koristi u ovom stage-u ne mora nužno
# koristiti niti jedan takav modul > `ssh` keys kopirmao za
# svaki slučaj ako u budućnosti takav modul bude dodan
COPY _docker_assets/.ssh /root/.ssh
RUN chmod 700 /root/.ssh/*

COPY ./server/package*.json ./

# instaliram SVE pakete (+dev dependencies)
RUN npm i && npm cache clean --force

COPY ./server/tsconfig.json ./
COPY ./server/src ./src

# pokrećem build server-side TypeScript-a
RUN npm run build

#----------------------------------------------------
# Stage: install server-side production dependencies
#----------------------------------------------------
FROM node:16 as server-side-dependencies

ENV WORKDIR=/app

# (BOILERPLATE)
# kopiram SSH key & known_hosts koji su potrebni za `npm i`
# zato što `package.json` pri instalacija NGIT paketa koristi
# SSH autentikaciju
#
# NAPOMENA
# `package.json` koji se koristi u ovom stage-u ne mora nužno
# koristiti niti jedan takav modul > `ssh` keys kopirmao za
# svaki slučaj ako u budućnosti takav modul bude dodan
COPY _docker_assets/.ssh /root/.ssh
RUN chmod 700 /root/.ssh/*

WORKDIR /app

# instaliram samo production dependencies (BEZ dev dependencies - to mi ne treba u produkciji)
COPY server/package*.json ./
RUN npm i --only=production && npm cache clean --force

#--------------------------------------------
# Stage: building client-side TypeScript
#--------------------------------------------
FROM node:16 as build-client-side

ENV WORKDIR=/app
WORKDIR /app

# (BOILERPLATE)
# kopiram SSH key & known_hosts koji su potrebni za `npm i`
# zato što `package.json` pri instalacija NGIT paketa koristi
# SSH autentikaciju
#
# NAPOMENA
# `package.json` koji se koristi u ovom stage-u ne mora nužno
# koristiti niti jedan takav modul > `ssh` keys kopirmao za
# svaki slučaj ako u budućnosti takav modul bude dodan
COPY _docker_assets/.ssh /root/.ssh
RUN chmod 700 /root/.ssh/*

# instaliram SVE pakete (+dev dependencies)
COPY ./client/package*.json ./
RUN npm i && npm cache clean --force

# .env datoteku koristi `webpack.config.js`
COPY ./.env ./

# kopiram config datoteke
COPY ./client/tsconfig.json ./
COPY ./client/webpack.config.js ./
COPY ./client/.babelrc ./

# kopiram source datoteke
COPY ./client/src ./src

# WEBPACK CONFIG (vidi `webpack.config.js`)
#
# kada client-side source buildamo u Docker image-u tada struktura
# direktorija nije ista u dev okruženju: neka Webpack kreirane datoteke spremi
# u `build` direktorij, odakle će biti preuzete u finalnom build stage-u
ENV WEBPACK_DEST_DIR=/app/build
# .env datoteka se u containeru nalazi na drugom mjestu
ENV WEBPACK_ENV_FILE_PATH=./.env

# pokrećem build client-side TypeScript-a
RUN npm run build-prod

#--------------------------------------------
# Stage: assembling final image
#--------------------------------------------
FROM gcr.io/distroless/nodejs:16 as prod-image

WORKDIR /app

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

ARG APP_VERSION="v0.0.0"
ENV APP_VERSION=${APP_VERSION}

ARG BASE_PATH=""
ENV BASE_PATH=${BASE_PATH}

# Server-Side: kopiram kompilirani server-side app
COPY --from=build-server-side /app/build /app
# Server-Side: kopiram EJS template datoteke
# -> TypeScript compiler ga neće kopirati zato jer ne sadrži TypeScript datoteke
COPY ./server/src/views /app/views
# Server-Side: kopiram production dependencies
COPY --from=server-side-dependencies /app/node_modules /app/node_modules

# Client-Side: kopiram samo JS datoteke (sourcemap datoteke preskačem - ne želim da budu javno dostupne)
COPY --from=build-client-side /app/build/public/script/*.js ./public/script/
# Client-Side: kopiram EJS partial koji je generirao Webpack
COPY --from=build-client-side /app/build/views/partials/html-head--scripts.ejs ./views/partials/
# Client-Side: kopiram CSS datoteke (kreirao ga je webpack)
COPY --from=build-client-side /app/build/public/script/style/ ./public/script/style/

# server vrtim pod ograničenim "nobody" korisnikom
USER nobody:nobody

# Ovo je primjer healthcheck-a specifičan za distroless base image
#
# NAPOMENA: Docker će ovako definiran healthcheck  koristiti
# jedino ako container pokrenemo sa `run` naredbom
# **NEĆE** ga koristitit u swarm modu
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s \
   CMD ["/nodejs/bin/node", "./healthcheck.js"]

CMD ["./entry.js"]
