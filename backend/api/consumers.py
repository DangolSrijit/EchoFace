import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from api.models import Room  # Assuming you have a Room model defined

class VideoCallConsumer(AsyncWebsocketConsumer):
    @database_sync_to_async
    def room_exists(self, room_id):
        return Room.objects.filter(id=room_id).exists()
    
    async def connect(self):
        self.room_id = self.scope['url_route']['kwargs']['room_id']

        if not await self.room_exists(self.room_id):
            # Reject the connection if room doesn't exist
            await self.close(code=4001)  # Custom close code for "room does not exist"
            return

        self.room_group_name = f'call_{self.room_id}'

        await self.channel_layer.group_add(self.room_group_name, self.channel_name)
        await self.accept()

        # Optional immediate notify others (React usually triggers 'join' manually)
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'user_joined',
                'peer_id': self.channel_name,
            }
        )

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

        # Notify others that the user left
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'user_left',
                'peer_id': self.channel_name,
            }
        )

    async def receive(self, text_data):
        data = json.loads(text_data)
        action = data.get('action')
        peer_id = data.get('peer_id', self.channel_name)
        target = data.get('target')
        signal = data.get('signal')
        candidate = data.get('candidate')
        message = data.get('message')

        if action == 'join':
            # User joined the room – broadcast to all
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    "type": "user_joined",
                    "peer_id": self.channel_name,
                }
            )

        elif action == 'ready':
            # Notify all others a peer is ready
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'new_peer',
                    'peer_id': self.channel_name,
                }
            )

        elif action == 'offer':
            if target:
                await self.channel_layer.send(
                    target,
                    {
                        'type': 'signal_message',
                        'message': {
                            'action': 'offer',
                            'from': self.channel_name,
                            'signal': signal,
                        }
                    }
                )

        elif action == 'answer':
            if target:
                await self.channel_layer.send(
                    target,
                    {
                        'type': 'signal_message',
                        'message': {
                            'action': 'answer',
                            'from': self.channel_name,
                            'signal': signal,
                        }
                    }
                )

        elif action == 'candidate':
            if target:
                await self.channel_layer.send(
                    target,
                    {
                        'type': 'signal_message',
                        'message': {
                            'action': 'candidate',
                            'from': self.channel_name,
                            'candidate': candidate,
                        }
                    }
                )

        elif action == 'chat':
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'chat_message',
                    'message': json.dumps({
                        'action': 'chat',
                        'from': self.channel_name,
                        'message': message,
                    }),
                }
            )

    # Handler: Broadcast new peer to others
    async def new_peer(self, event):
        if event['peer_id'] != self.channel_name:
            await self.send(text_data=json.dumps({
                'action': 'new-peer',
                'peer_id': event['peer_id'],
            }))

    # Handler: Notify others someone joined
    async def user_joined(self, event):
        if event['peer_id'] != self.channel_name:
            await self.send(text_data=json.dumps({
                'action': 'user-joined',
                'peer_id': event['peer_id'],
            }))

    # Handler: Notify all someone left
    async def user_left(self, event):
        await self.send(text_data=json.dumps({
            'action': 'user-left',
            'peer_id': event['peer_id'],
        }))

    # Handler: Send direct signaling message
    async def signal_message(self, event):
        await self.send(text_data=json.dumps(event['message']))

    # Handler: Optional group chat messages
    async def chat_message(self, event):
        await self.send(text_data=event["message"])
