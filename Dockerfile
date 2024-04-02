# syntax=docker/dockerfile:1

# Comments are provided throughout this file to help you get started.
# If you need more help, visit the Dockerfile reference guide at
# https://docs.docker.com/go/dockerfile-reference/

# Want to help us make this template better? Share your feedback here: https://forms.gle/ybq9Krt8jtBL3iCk7

ARG NODE_VERSION=20.11.0

FROM node:${NODE_VERSION}-alpine as builder

# Use production node environment by default.
ENV NODE_ENV production


WORKDIR /build

# Add a non-root user
# RUN adduser -D -u 1001 nonroot


# Download dependencies as a separate step to take advantage of Docker's caching.
# Leverage a cache mount to /root/.npm to speed up subsequent builds.
# Leverage a bind mounts to package.json and package-lock.json to avoid having to copy them into
# into this layer.
# Run the application as a non-root user.

# RUN npm ci --only=production

# RUN --mount=type=cache,target=/app/.npm \
#   npm set cache /app/.npm && \
#   npm ci --only=production

COPY package*.json .
RUN npm install

COPY tsconfig.json tsconfig.json
COPY . .

RUN npm run build

# stage-2

FROM node:${NODE_VERSION}-alpine as runner

WORKDIR /app

# USER nonroot

COPY --from=builder build/package*.json .
COPY --from=builder build/node_modules node_modules/
COPY --from=builder build/dist dist/

# Expose the port that the application listens on.
EXPOSE 5500

# Run the application.
CMD ["node","dist/index"]
