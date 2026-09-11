FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source
COPY . .

# Build
RUN npm run build

# Serve with a simple HTTP server
RUN npm install -g http-server

EXPOSE 3000

CMD ["http-server", "dist", "-p", "3000", "--cors"]
