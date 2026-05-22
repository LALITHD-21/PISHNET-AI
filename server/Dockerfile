FROM node:22-alpine AS deps
WORKDIR /api
COPY server/package*.json ./
RUN npm install

FROM deps AS build
COPY server/tsconfig.json ./tsconfig.json
COPY server/src ./src
RUN npm run build

FROM node:22-alpine AS runner
WORKDIR /api
ENV NODE_ENV=production
COPY --from=deps /api/node_modules ./node_modules
COPY --from=build /api/dist ./dist
COPY server/package*.json ./
EXPOSE 4000
CMD ["node", "dist/index.js"]
