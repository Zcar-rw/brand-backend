# Build stage
FROM node:14-alpine AS build
WORKDIR /app
COPY package*.json ./
COPY .sequelizerc ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM node:14-alpine AS production
WORKDIR /app
COPY package*.json ./
COPY .sequelizerc ./
RUN npm ci --only=production
COPY --from=build /app/build ./build
COPY . .
ENV NODE_ENV=production
EXPOSE 4001
CMD ["npm", "start"]

# Development stage
FROM node:14-alpine AS development
WORKDIR /app
COPY package*.json ./
COPY .sequelizerc ./
RUN npm ci 
COPY . .
ENV NODE_ENV=development
EXPOSE 4001
CMD ["npm", "run", "dev"]
