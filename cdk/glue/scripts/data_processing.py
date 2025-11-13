"""
Test Glue Python Shell job to verify pipeline triggering
This script just prints all received arguments for testing
"""

import sys
import json
from awsglue.utils import getResolvedOptions

print("=== GLUE PYTHON SHELL JOB TEST START ===")
print(f"All sys.argv: {sys.argv}")

# Get all possible job parameters (some may be optional)
try:
    args = getResolvedOptions(sys.argv, [
        'batch_id',
        'sqs_message_id',
        'sqs_message_body',
        'trigger_timestamp'
    ])
    print("=== RESOLVED ARGUMENTS FROM LAMBDA ===")
    for key, value in args.items():
        print(f"{key}: {value}")
        
    # Parse the SQS message body if available
    if 'sqs_message_body' in args:
        sqs_data = json.loads(args['sqs_message_body'])
        print("=== SQS MESSAGE DATA ===")
        for key, value in sqs_data.items():
            print(f"SQS {key}: {value}")
            
except Exception as e:
    print(f"Error resolving arguments: {e}")
    # Try with minimal required args
    args = getResolvedOptions(sys.argv, ['JOB_NAME'])
    print(f"Minimal args resolved: {args}")

print("=== PYTHON SHELL JOB INITIALIZED ===")
print("Python version:", sys.version)
print("=== TEST COMPLETED SUCCESSFULLY ===")