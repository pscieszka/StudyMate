# Generated by Django 4.2 on 2025-01-21 13:19

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0005_systemuser_favorites'),
    ]

    operations = [
        migrations.AlterField(
            model_name='add',
            name='learning_mode',
            field=models.CharField(blank=True, max_length=50, null=True),
        ),
    ]
