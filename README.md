# Scrape2Serve

A Dockerized web scraper that uses Node.js, Puppeteer, and Chromium to extract website information and a Python Flask server to serve the scraped data as JSON.

## Requirements

- Docker

## Build

Build the Docker image and provide the URL to scrape:

    docker build --build-arg SCRAPE_URL=https://example.com -t scrape2serve .
- How to pass the URL to be scraped:
    --build-arg SCRAPE_URL=... shown in build command

## Run

Start the container and map port 5000 inside the container to port 5001 on your machine:

    docker run -d --name scrape2serve-container -p 5001:5000 scrape2serve

## Access the Data (the hosted scraped JSON data)

Open these endpoints in your browser:

- `http://localhost:5001/health` — Server health status
- `http://localhost:5001/` — Scraped website data in JSON format

## How It Works

1. The Node.js stage uses Puppeteer and Chromium to scrape the specified URL.
2. The scraped information is saved as a JSON file.
3. The Python stage copies that file into the final image.
4. Flask serves the JSON data over HTTP.

## Stop the Container

    docker stop scrape2serve-container
    docker rm scrape2serve-container

## Examples:

### Step 1: Build the latest Docker image
Run this from the project directory: </br>
Command: </br>
    `docker build --build-arg SCRAPE_URL=https://example.com -t scrape2serve .`
</br> Output: </br> 
[+] Building 109.3s (21/21) FINISHED ...
- Pass: The build finishes successfully and the scraper writes the JSON output.

### Step 2: 2. Verify the running application
Command: </br>
`docker run -d --name scrape2serve-container -p 5001:5000 scrape2serve`
</br>
Output: 69599e169b93ff01fba60f646f6a79281fe31cd246aa9627bd4fe1b1d738c662

Run: </br>
Command: </br>
`curl -i http://localhost:5001/`
</br>
Output: </br>
HTTP/1.1 200 OK </br>
**Server**: Werkzeug/3.1.9 Python/3.12.16 </br>
**Date**: Sun, 15 Nov 2026 11:44:25 GMT </br>
**Content-Type**: application/json </br>
**Content-Length**: 189 </br>
**Connection**: close </br>

{"finalUrl":"https://www.ship30for30.com/","heading":"Start Writing Online In 30 Days","title":"Ship 30 for 30 \u2014 Start Writing Online in 30 Days","url":"https://www.ship30for30.com/"}

- Pass: We receive HTTP 200 OK and JSON containing the scraped page's title and heading.

Also open http://localhost:5001/ in the browser. It should display the JSON data directly. </br>
For e.g.,: </br>
{
  "finalUrl": "https://www.ship30for30.com/",
  "heading": "Start Writing Online In 30 Days",
  "title": "Ship 30 for 30 — Start Writing Online in 30 Days",
  "url": "https://www.ship30for30.com/"
}