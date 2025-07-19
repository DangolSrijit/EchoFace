import json
from channels.generic.websocket import AsyncWebsocketConsumer

class VideoCallConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.room_group_name = f'call_{self.room_name}'

        # Join room group
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()

        # Check how many people in the room (optional)
        # For simplicity, we track members with a set in-memory (not recommended for prod)

        # For demo: send 'init' message to tell client if initiator
        # For production, you'd track connections better (e.g., via DB or cache)
        if not hasattr(self.channel_layer, 'room_members'):
            self.channel_layer.room_members = {}

        members = self.channel_layer.room_members.setdefault(self.room_group_name, set())
        members.add(self.channel_name)

        initiator = False
        if len(members) == 1:
            initiator = True

        await self.send(text_data=json.dumps({
            'type': 'init',
            'initiator': initiator
        }))

    async def disconnect(self, close_code):
        # Leave room group
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )
        # Remove from members
        if hasattr(self.channel_layer, 'room_members'):
            members = self.channel_layer.room_members.get(self.room_group_name, set())
            members.discard(self.channel_name)

    # Receive message from WebSocket
    async def receive(self, text_data):
        data = json.loads(text_data)
        # Broadcast signaling data to group except sender
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'signal_message',
                'signal': data.get('signal'),
                'sender_channel': self.channel_name
            }
        )

    # Receive message from room group
    async def signal_message(self, event):
        # Don't send the message back to sender
        if self.channel_name != event['sender_channel']:
            await self.send(text_data=json.dumps({
                'type': 'signal',
                'signal': event['signal']
            }))



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
