# Generated by Django 4.1.10 on 2023-08-19 09:38

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='userhash',
            name='hash_value',
            field=models.CharField(max_length=256),
        ),
    ]