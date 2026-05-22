FROM python:3.12-slim

WORKDIR /ai
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

COPY ai-service/requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

COPY ai-service/main.py ./
EXPOSE 8000
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
