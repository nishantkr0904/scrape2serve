# Stage 1: Scrape the website using Node.js and Chromium
FROM node:22-bookworm-slim AS scraper

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

WORKDIR /app

RUN apt-get update \
    && apt-get install -y --no-install-recommends \
       chromium \
       ca-certificates \
       fonts-liberation \
    && rm -rf /var/lib/apt/lists/*

COPY package.json package-lock.json ./
RUN npm ci

COPY scrape.js ./

ARG SCRAPE_URL=https://example.com
ENV SCRAPE_URL=${SCRAPE_URL}

RUN node scrape.js


# Stage 2: Serve the scraped JSON using Python and Flask
FROM python:3.12-slim AS server

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PORT=5000 \
    DATA_FILE=/app/scraped_data.json

WORKDIR /app

COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

COPY server.py ./
COPY --from=scraper /app/scraped_data.json ./scraped_data.json

EXPOSE 5000

CMD ["python", "server.py"]