
FROM node:20-slim AS build
WORKDIR /app
COPY package.json package-lock.json* pnpm-lock.yaml* yarn.lock* ./
RUN if [ -f package-lock.json ]; then npm ci;       elif [ -f pnpm-lock.yaml ]; then corepack enable && corepack prepare pnpm@latest --activate && pnpm i --frozen-lockfile;       elif [ -f yarn.lock ]; then yarn install --frozen-lockfile;       else npm install; fi
COPY . .
ENV VITE_BASE_PATH=/
RUN npm run build
FROM node:20-slim
WORKDIR /app
RUN npm i -g serve@14
COPY --from=build /app/dist ./dist
EXPOSE 10000
CMD ["serve","-s","dist","-l","10000"]
