import json
import os
from pathlib import Path

from flask import Flask, jsonify

app = Flask(__name__)

DATA_FILE = Path(os.environ.get("DATA_FILE", "scraped_data.json"))


@app.get("/health")
def health():
    return jsonify({
        "status": "healthy",
        "service": "scrape2serve"
    })


@app.get("/")
def get_scraped_data():
    if not DATA_FILE.is_file():
        return jsonify({
            "error": "Scraped data file not found."
        }), 404

    try:
        with DATA_FILE.open("r", encoding="utf-8") as file:
            data = json.load(file)
    except (json.JSONDecodeError, OSError):
        app.logger.exception("Unable to read scraped data")
        return jsonify({
            "error": "Unable to read scraped data."
        }), 500

    return jsonify(data)


if __name__ == "__main__":
    app.run(
        host="0.0.0.0",
        port=int(os.environ.get("PORT", "5000"))
    )