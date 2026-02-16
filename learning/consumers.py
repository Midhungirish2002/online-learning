"""
WebSocket consumer for real-time notifications.
"""
import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from rest_framework_simplejwt.tokens import AccessToken
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError


class NotificationConsumer(AsyncWebsocketConsumer):
    """
    WebSocket consumer for sending real-time notifications to users.
    Authenticates via JWT token passed in query string.
    """

    async def connect(self):
        """Handle WebSocket connection with JWT authentication."""
        # Get token from query string
        query_string = self.scope.get('query_string', b'').decode()
        token = None
        for param in query_string.split('&'):
            if param.startswith('token='):
                token = param.split('=')[1]
                break

        if not token:
            await self.close(code=4001)  # Unauthorized
            return

        # Validate JWT token
        try:
            access_token = AccessToken(token)
            user_id = access_token['user_id']
        except (InvalidToken, TokenError, KeyError):
            await self.close(code=4001)  # Unauthorized
            return

        # Store user_id and join user-specific group
        self.user_id = user_id
        self.group_name = f'notifications_{user_id}'

        await self.channel_layer.group_add(
            self.group_name,
            self.channel_name
        )

        await self.accept()

    async def disconnect(self, close_code):
        """Handle WebSocket disconnection."""
        if hasattr(self, 'group_name'):
            await self.channel_layer.group_discard(
                self.group_name,
                self.channel_name
            )

    async def receive(self, text_data):
        """Handle incoming messages (for marking notifications as read)."""
        try:
            data = json.loads(text_data)
            action = data.get('action')

            if action == 'mark_read':
                notification_id = data.get('notification_id')
                if notification_id:
                    await self.mark_notification_read(notification_id)
            elif action == 'mark_all_read':
                await self.mark_all_notifications_read()
        except json.JSONDecodeError:
            pass

    async def send_notification(self, event):
        """Send notification to WebSocket client."""
        await self.send(text_data=json.dumps({
            'type': 'notification',
            'notification': event['notification']
        }))

    @database_sync_to_async
    def mark_notification_read(self, notification_id):
        """Mark a specific notification as read."""
        from learning.models import Notification
        Notification.objects.filter(
            id=notification_id,
            user_id=self.user_id
        ).update(is_read=True)

    @database_sync_to_async
    def mark_all_notifications_read(self):
        """Mark all user's notifications as read."""
        from learning.models import Notification
        Notification.objects.filter(
            user_id=self.user_id,
            is_read=False
        ).update(is_read=True)
