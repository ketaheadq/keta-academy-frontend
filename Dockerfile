FROM node:20-alpine

# Install pnpm globally
RUN npm install -g pnpm

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies with pnpm
RUN pnpm install

# Copy the rest of the application
COPY . .

# Build the app
RUN pnpm run build

# Expose port
EXPOSE 3000

# Start the app
CMD ["pnpm", "run", "start"]
