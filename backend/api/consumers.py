# File: backend/api/consumers.py
import json
from channels.generic.websocket import AsyncWebsocketConsumer

class FaceAlertConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        # Add this connection to the "face_alerts" group
        await self.channel_layer.group_add("face_alerts", self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        # Remove from group on disconnect
        await self.channel_layer.group_discard("face_alerts", self.channel_name)

    async def send_alert(self, event):
        # Send alert message to WebSocket client
        await self.send(text_data=json.dumps({
            "message": event["message"]
        }))
