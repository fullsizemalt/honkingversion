# Use an official Python runtime as a parent image
FROM python:3.10-slim

WORKDIR /app

# Dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Keep code under /app/api so absolute imports like `api.routes` work
COPY . /app/api
ENV PYTHONPATH=/app

# Command to run the application
CMD ["uvicorn", "api.main:app", "--host", "0.0.0.0", "--port", "8000"]
