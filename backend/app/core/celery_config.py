"""
Celery Configuration

Configuration for Celery task queue and Redis broker.
"""

import os
from kombu import Exchange, Queue

# Redis broker URL
broker_url = os.getenv('REDIS_URL', 'redis://localhost:6379/0')
result_backend = os.getenv('REDIS_URL', 'redis://localhost:6379/0')

# Task serialization
task_serializer = 'json'
accept_content = ['json']
result_serializer = 'json'
timezone = 'UTC'
enable_utc = True

# Task execution settings
task_track_started = True
task_time_limit = 30 * 60  # 30 minutes
task_soft_time_limit = 25 * 60  # 25 minutes

# Result backend settings
result_expires = 3600  # 1 hour

# Task routing
task_routes = {
    'app.services.background_jobs.scrape_restaurant_task': {'queue': 'scraping'},
    'app.services.background_jobs.process_ml_task': {'queue': 'ml_processing'},
}

# Queue configuration
task_queues = (
    Queue('scraping', Exchange('scraping'), routing_key='scraping'),
    Queue('ml_processing', Exchange('ml_processing'), routing_key='ml_processing'),
    Queue('default', Exchange('default'), routing_key='default'),
)

# Worker settings
worker_prefetch_multiplier = 1
worker_max_tasks_per_child = 50

# Logging
worker_log_format = "[%(asctime)s: %(levelname)s/%(processName)s] %(message)s"
worker_task_log_format = "[%(asctime)s: %(levelname)s/%(processName)s][%(task_name)s(%(task_id)s)] %(message)s"

