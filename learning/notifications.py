"""
Utility functions for sending real-time notifications.
"""
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync


def send_notification(user_id, notification_type, message, data=None):
    """
    Send a real-time notification to a user via WebSocket and save to database.
    
    Args:
        user_id: The user's ID to send the notification to
        notification_type: Type of notification (e.g., 'QUIZ_GRADED', 'ENROLLED')
        message: Human-readable notification message
        data: Optional dict with additional context (e.g., course_id, score)
    
    Returns:
        The created Notification object
    """
    from learning.models import Notification
    
    # Save notification to database
    notification = Notification.objects.create(
        user_id=user_id,
        notification_type=notification_type,
        message=message,
        data=data or {}
    )
    
    # Send to WebSocket channel
    channel_layer = get_channel_layer()
    group_name = f'notifications_{user_id}'
    
    async_to_sync(channel_layer.group_send)(
        group_name,
        {
            'type': 'send_notification',
            'notification': {
                'id': notification.id,
                'notification_type': notification_type,
                'message': message,
                'data': data or {},
                'is_read': False,
                'created_at': notification.created_at.isoformat(),
            }
        }
    )
    
    return notification
