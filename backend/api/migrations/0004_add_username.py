# Generated by Django 4.2 on 2025-01-18 17:27

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0003_delete_businessuser'),
    ]

    operations = [
        migrations.AddField(
            model_name='add',
            name='username',
            field=models.CharField(blank=True, max_length=150, null=True),
        ),
    ]
