# Platform service image. Same image runs on Railway now and Google Cloud Run later (a redeploy, not a rewrite).
# Build from this folder:  docker build -t fornax-platform platform/service
FROM node:22-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY package.json ./
# When dependencies are added (e.g. pg): COPY package-lock.json and run `npm ci --omit=dev` here.
COPY server.mjs ./
USER node
EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s CMD wget -qO- http://127.0.0.1:${PORT:-8080}/health || exit 1
CMD ["node", "server.mjs"]
