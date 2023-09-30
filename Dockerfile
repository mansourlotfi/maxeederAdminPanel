FROM node:16.20.0-alpine3.18 AS builder
#Test
WORKDIR /app
# Cache and Install dependencies
COPY package.json .
COPY yarn.lock .
RUN yarn install --production
# Copy app files
COPY . .
# Build the app
ENV GENERATE_SOURCEMAP=false
RUN yarn build

# Choose NGINX as our base Docker image
FROM nginx:alpine

# Remove default nginx static assets
RUN rm ../etc/nginx/conf.d/default.conf
COPY ./nginx-configs ../etc/nginx/conf.d

# Set working directory to nginx asset directory
WORKDIR /usr/share/nginx/html


# Copy static assets from builder stage
COPY --from=builder /app/build .

# Entry point when Docker container has started
ENTRYPOINT ["nginx", "-g", "daemon off;"]
