# Generated by Django 4.2 on 2025-01-19 14:38

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0004_add_username'),
    ]

    operations = [
        migrations.AddField(
            model_name='systemuser',
            name='favorites',
            field=models.ManyToManyField(blank=True, related_name='favorited_by', to='api.add'),
        ),
    ]
