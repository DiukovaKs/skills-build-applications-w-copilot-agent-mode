from rest_framework import viewsets

from .models import Activity, LeaderboardEntry, Team, User, Workout
from .serializers import (
    ActivitySerializer,
    LeaderboardSerializer,
    TeamSerializer,
    UserSerializer,
    WorkoutSerializer,
)


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer


class TeamViewSet(viewsets.ModelViewSet):
    queryset = Team.objects.all()
    serializer_class = TeamSerializer


class ActivityViewSet(viewsets.ModelViewSet):
    queryset = Activity.objects.all()
    serializer_class = ActivitySerializer


class LeaderboardViewSet(viewsets.ModelViewSet):
    queryset = LeaderboardEntry.objects.all()
    serializer_class = LeaderboardSerializer


class WorkoutViewSet(viewsets.ModelViewSet):
    queryset = Workout.objects.all()
    serializer_class = WorkoutSerializer
