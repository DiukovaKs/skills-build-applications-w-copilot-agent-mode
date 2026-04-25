from djongo import models


class User(models.Model):
    name = models.CharField(max_length=150)
    email = models.EmailField(unique=True)
    team = models.CharField(max_length=100, blank=True)

    def __str__(self):
        return self.name


class Team(models.Model):
    name = models.CharField(max_length=100, unique=True)
    members = models.JSONField(default=list, blank=True)

    def __str__(self):
        return self.name


class Activity(models.Model):
    user = models.CharField(max_length=150)
    activity = models.CharField(max_length=150)
    duration = models.PositiveIntegerField(default=0)
    date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user} - {self.activity}"


class LeaderboardEntry(models.Model):
    user = models.CharField(max_length=150)
    points = models.IntegerField(default=0)
    rank = models.PositiveIntegerField(null=True, blank=True)

    class Meta:
        verbose_name = 'Leaderboard Entry'
        verbose_name_plural = 'Leaderboard Entries'

    def __str__(self):
        return f"{self.user}: {self.points}"


class Workout(models.Model):
    name = models.CharField(max_length=150)
    description = models.TextField(blank=True)
    duration_minutes = models.PositiveIntegerField(default=0)
    difficulty = models.CharField(max_length=50, blank=True)

    def __str__(self):
        return self.name
