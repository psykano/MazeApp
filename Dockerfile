# Use Node 24 alpine image as the base builder
FROM node:24-alpine as builder

WORKDIR /app

# Install dependencies exclusively
COPY package.json package-lock.json* ./
RUN npm install --ignore-scripts

# Copy whole repository and build
COPY . .
RUN npm run build

# Use NGINX to serve the static built SPA
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
