from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from .models import Activity, LeaderboardEntry, Team, User, Workout


class OctofitApiTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create(name='Test User', email='test@example.com', team='Marvel')
        self.team = Team.objects.create(name='Marvel', members=['Iron Man', 'Captain America'])
        self.activity = Activity.objects.create(user='Test User', activity='Running', duration=30)
        self.leaderboard = LeaderboardEntry.objects.create(user='Test User', points=100, rank=1)
        self.workout = Workout.objects.create(name='Power Up', description='Strength routine', duration_minutes=45, difficulty='Medium')

    def test_api_root_contains_collections(self):
        url = reverse('api-root')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('users', response.data)
        self.assertIn('teams', response.data)
        self.assertIn('activities', response.data)
        self.assertIn('leaderboard', response.data)
        self.assertIn('workouts', response.data)

    def test_user_list_endpoint(self):
        url = reverse('user-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_team_list_endpoint(self):
        url = reverse('team-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_activity_list_endpoint(self):
        url = reverse('activity-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_leaderboard_list_endpoint(self):
        url = reverse('leaderboard-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_workout_list_endpoint(self):
        url = reverse('workout-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
