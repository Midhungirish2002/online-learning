from rest_framework import serializers
from ..models import Comment

class CommentSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    profile_image = serializers.SerializerMethodField()
    replies = serializers.SerializerMethodField()
    
    # Explicitly allow null lesson
    lesson = serializers.PrimaryKeyRelatedField(
        queryset=Comment.lesson.field.related_model.objects.all(), 
        required=False, 
        allow_null=True
    )

    class Meta:
        model = Comment
        fields = (
            "id", "user", "username", "profile_image",
            "course", "lesson", "text", "parent",
            "created_at", "replies"
        )
        read_only_fields = ("id", "user", "course", "created_at", "replies")

    def get_profile_image(self, obj):
        if obj.user.profile_image:
            return obj.user.profile_image.url
        return None

    def get_replies(self, obj):
        if obj.replies.exists():
            return CommentSerializer(obj.replies.all(), many=True).data
        return []
