from rest_framework import serializers

from .models import Activity, LeaderboardEntry, Team, User, Workout


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'name', 'email', 'team']


class TeamSerializer(serializers.ModelSerializer):
    class Meta:
        model = Team
        fields = ['id', 'name', 'members']


class ActivitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Activity
        fields = ['id', 'user', 'activity', 'duration', 'date']


class LeaderboardSerializer(serializers.ModelSerializer):
    class Meta:
        model = LeaderboardEntry
        fields = ['id', 'user', 'points', 'rank']


class WorkoutSerializer(serializers.ModelSerializer):
    class Meta:
        model = Workout
        fields = ['id', 'name', 'description', 'duration_minutes', 'difficulty']
