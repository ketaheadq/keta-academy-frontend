FROM pnpm/node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# SECURITY: Disabling scripts during install to prevent arbitrary code execution.
# Build/start scripts are explicitly called later.
RUN pnpm install --ignore-scripts

# Copy app source
COPY . .

# Build the app
RUN pnpm run build

# Expose port
EXPOSE 3000

# Start command
CMD ["pnpm", "run", "start"]
