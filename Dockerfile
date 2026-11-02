FROM node:24-slim
WORKDIR /app

COPY . .
RUN npm ci && npm run build

ENV NODE_ENV=production HOST=0.0.0.0 PORT=3000
EXPOSE 3000
CMD ["node", ".output/server/index.mjs"]
