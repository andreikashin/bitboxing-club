import os
from netbox.configuration import *

SECRET_KEY = "12345678901234567890123456789012345678901234567890"
ALLOWED_HOSTS = ["*"]
DEBUG = True

REDIS = {
    'default': {
        'HOST': os.getenv('REDIS_HOST', 'localhost'),
        'PORT': int(os.getenv('REDIS_PORT', 6379)),
        'PASSWORD': os.getenv('REDIS_PASSWORD', None),
        'DATABASE': 0,
    },
    'tasks': { # BG tasks
        'HOST': os.getenv('REDIS_HOST', 'redis'),
        'PORT': int(os.getenv('REDIS_PORT', 6379)),
        'PASSWORD': os.getenv('REDIS_PASSWORD', None),
        'DATABASE': 1,
    },
    'caching': {  # cache
        'HOST': os.getenv('REDIS_HOST', 'redis'),
        'PORT': int(os.getenv('REDIS_PORT', 6379)),
        'PASSWORD': os.getenv('REDIS_PASSWORD', None),
        'DATABASE': 2,
    },
}

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': os.getenv('DB_NAME', 'netbox'),
        'USER': os.getenv('DB_USER', 'netbox'),
        'PASSWORD': os.getenv('DB_PASSWORD', 'netbox'),
        'HOST': os.getenv('DB_HOST', 'postgres'),
        'PORT': os.getenv('DB_PORT', 5432),
    }
}
