"""
ASGI config for backend project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.2/howto/deployment/asgi/
"""

# import os

# from django.core.asgi import get_asgi_application

# os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')

# application = get_asgi_application()
import os
from channels.auth import AuthMiddlewareStack
from channels.routing import ProtocolTypeRouter, URLRouter
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')  
django.setup()

import backend.routing  # make sure this file exists in your app directory

application = ProtocolTypeRouter({
    'http': django.core.asgi.get_asgi_application(),
    'websocket': AuthMiddlewareStack(
        URLRouter(
            backend.routing.websocket_urlpatterns
        )
    ),
})

