from django.core.management.base import BaseCommand
from django.conf import settings
from django.contrib.auth import get_user_model
from djongo import models


from pymongo import MongoClient

class Command(BaseCommand):
    help = 'Populate the octofit_db database with test data'

    def handle(self, *args, **options):
        # Очистка коллекций
        client = MongoClient('localhost', 27017)
        db = client['octofit_db']
        db.users.delete_many({})
        db.teams.delete_many({})
        db.activities.delete_many({})
        db.leaderboard.delete_many({})
        db.workouts.delete_many({})

        # Данные
        marvel_team = {'name': 'Marvel', 'members': ['Iron Man', 'Captain America', 'Thor', 'Hulk', 'Black Widow']}
        dc_team = {'name': 'DC', 'members': ['Superman', 'Batman', 'Wonder Woman', 'Flash', 'Aquaman']}

        users = [
            {'name': 'Tony Stark', 'email': 'ironman@marvel.com', 'team': 'Marvel'},
            {'name': 'Steve Rogers', 'email': 'cap@marvel.com', 'team': 'Marvel'},
            {'name': 'Clark Kent', 'email': 'superman@dc.com', 'team': 'DC'},
            {'name': 'Bruce Wayne', 'email': 'batman@dc.com', 'team': 'DC'},
        ]
        activities = [
            {'user': 'Tony Stark', 'activity': 'Running', 'duration': 30},
            {'user': 'Steve Rogers', 'activity': 'Cycling', 'duration': 45},
            {'user': 'Clark Kent', 'activity': 'Swimming', 'duration': 60},
            {'user': 'Bruce Wayne', 'activity': 'Boxing', 'duration': 50},
        ]
        leaderboard = [
            {'user': 'Tony Stark', 'points': 100},
            {'user': 'Clark Kent', 'points': 120},
        ]
        workouts = [
            {'name': 'Super Strength', 'description': 'Heavy lifting and power moves'},
            {'name': 'Speed Run', 'description': 'High intensity running'},
        ]

        # Вставка данных
        db.teams.insert_many([marvel_team, dc_team])
        db.users.insert_many(users)
        db.activities.insert_many(activities)
        db.leaderboard.insert_many(leaderboard)
        db.workouts.insert_many(workouts)

        # Индекс
        db.users.create_index([('email', 1)], unique=True)

        self.stdout.write(self.style.SUCCESS('octofit_db populated with test data'))
