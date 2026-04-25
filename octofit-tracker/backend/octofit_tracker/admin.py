from django.contrib import admin

from .models import Activity, LeaderboardEntry, Team, User, Workout


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'team')
    search_fields = ('name', 'email', 'team')


@admin.register(Team)
class TeamAdmin(admin.ModelAdmin):
    list_display = ('name',)
    search_fields = ('name',)


@admin.register(Activity)
class ActivityAdmin(admin.ModelAdmin):
    list_display = ('user', 'activity', 'duration', 'date')
    search_fields = ('user', 'activity')


@admin.register(LeaderboardEntry)
class LeaderboardEntryAdmin(admin.ModelAdmin):
    list_display = ('user', 'points', 'rank')
    search_fields = ('user',)


@admin.register(Workout)
class WorkoutAdmin(admin.ModelAdmin):
    list_display = ('name', 'duration_minutes', 'difficulty')
    search_fields = ('name',)
