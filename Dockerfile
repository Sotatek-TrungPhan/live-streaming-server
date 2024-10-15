FROM node:18.13.0-alpine AS development

WORKDIR /app
COPY package*.json ./
COPY pnpm*.yaml ./

RUN npm install glob rimraf
RUN npm install -g pnpm

COPY . .

RUN pnpm install --only=dev

RUN pnpm run build

COPY config ./dist/config

#PRODUCTION

FROM node:18.13.0-alpine as production

WORKDIR /app
COPY  package*.json .
COPY pnpm*.yaml .

ARG NODE_ENV=product
ENV NODE_ENV=${NODE_ENV}

RUN npm install -g pnpm
RUN pnpm install --prod
COPY . .

COPY --from=development /app/dist ./dist

CMD ["node" , "dist/main"]