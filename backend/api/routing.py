from django.urls import re_path
from . import consumers

websocket_urlpatterns = [
    re_path(r'ws/call/(?P<room_name>\w+)/$', consumers.VideoCallConsumer.as_asgi()),
    re_path(r'ws/alerts/$', consumers.FaceAlertConsumer.as_asgi()),
]
