from django.urls import re_path
from . import consumers

websocket_urlpatterns = [
    re_path(r'ws/alerts/$', consumers.FaceAlertConsumer.as_asgi()),
]
# This file defines the WebSocket routing for the Django Channels application.
# It maps the WebSocket URL to the FaceAlertConsumer, which handles incoming WebSocket connections.
# The URL pattern 'ws/alerts/' is used to establish a WebSocket connection for face alerts.