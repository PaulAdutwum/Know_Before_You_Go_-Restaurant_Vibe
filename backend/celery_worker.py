"""
Celery Worker

Entry point for Celery worker process.

Start with:
    celery -A celery_worker worker --loglevel=info
"""

from celery import Celery
import os
import sys

# Add parent directory to path
sys.path.insert(0, os.path.dirname(__file__))

# Create Celery app
celery_app = Celery('vibefinder')

# Load config
celery_app.config_from_object('app.core.celery_config')

# Auto-discover tasks
celery_app.autodiscover_tasks(['app.services'])

if __name__ == '__main__':
    celery_app.start()

