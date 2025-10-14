import boto3
import psycopg2
import os
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger()

# Environment variables
REGION = os.environ["REGION"]

def handler(event, context):
    logger.info("Handler invoked with event: %s", event)
    return {
        "statusCode": 200,
        "body": "Data ingestion lambda executed successfully."
    }