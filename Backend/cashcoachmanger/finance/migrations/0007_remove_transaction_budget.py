# Generated by Django 5.1.1 on 2024-10-17 04:19

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('finance', '0006_budget_category'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='transaction',
            name='budget',
        ),
    ]
