# notifications/utils.py
import json
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from .models import Notification

def send_notification(user_id, data):
    print(f"[DEBUG] Sending notification to user {user_id} with data: {data}")

    # Save to DB
    Notification.objects.create(
        user_id=user_id,
        title=data.get("title", ""),
        message=data.get("message", "")
    )

    # Send to WebSocket
    channel_layer = get_channel_layer()
    group_name = f"user_{user_id}"
    print(f"[DEBUG] group_send to: {group_name}")

    async_to_sync(channel_layer.group_send)(
        group_name, {
            "type": "notify",
            "message": data  # 🔄 NOTE: This should be 'message' not 'data'
        }
    )

