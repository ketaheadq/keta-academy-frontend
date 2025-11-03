FROM guergeiro/pnpm:20-10-alpine AS base

WORKDIR /app

COPY package*.json ./

# SECURITY: Disabling scripts during install to prevent arbitrary code execution.
# Build/start scripts are explicitly called later.
RUN pnpm install --ignore-scripts


EXPOSE 3000
CMD [ "pnpm", "run", "start" ]