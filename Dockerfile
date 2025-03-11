# Use official Python and Node images
FROM python:3.11.9-slim AS python-builder

# Install Poetry
RUN pip install poetry

# Set working directory for Python
WORKDIR /app

# Copy Python dependencies
COPY apps/fastapi-app/pyproject.toml apps/fastapi-app/poetry.lock ./
RUN poetry install --no-root --no-dev

# Copy FastAPI source code
COPY apps/fastapi-app /app/apps/fastapi-app


# ---- Build Next.js ----
FROM node:20 AS node-builder

# Set working directory for Next.js
WORKDIR /app

# Copy the monorepo and install dependencies
COPY . .

# Install dependencies and build Next.js
RUN yarn install --immutable
RUN yarn turbo run build --filter={your-nextjs-app}

# ---- Final Stage ----
FROM node:20 AS runner

# Set working directory for combined app
WORKDIR /app

# Copy built FastAPI and Next.js apps
COPY --from=python-builder /app/apps/fastapi-app /app/apps/fastapi-app
COPY --from=node-builder /app/apps/nextjs-app/.next /app/apps/nextjs-app/.next
COPY --from=node-builder /app/node_modules /app/node_modules
COPY --from=node-builder /app/package.json /app/package.json

# Install production dependencies only
RUN yarn install --production

# Install Python dependencies
RUN pip install poetry

# Expose ports for FastAPI and Next.js
EXPOSE 3000
EXPOSE 8000

# Start FastAPI and Next.js concurrently
CMD concurrently \
    "cd apps/fastapi-app && poetry run uvicorn main:app --host 0.0.0.0 --port 8000" \
    "cd apps/nextjs-app && yarn start"
