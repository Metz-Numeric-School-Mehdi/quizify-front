FROM oven/bun:1 AS base

WORKDIR /app

COPY package*.json ./

RUN bun install

COPY . .

RUN apt-get update && apt-get install -y curl

RUN bun run build

COPY healthcheck.sh /usr/local/bin/healthcheck.sh

RUN chmod +x /usr/local/bin/healthcheck.sh

CMD ["bun", "run", ".output/server/index.mjs"]