import json
import boto3
import time
from boto3.dynamodb.conditions import Key, Attr

TABLE_NAME = "nodeusers"
dynamodb = boto3.resource('dynamodb', region_name='us-east-1')
table = dynamodb.Table(TABLE_NAME)


def lambda_handler(event, context):
    # TODO implement
    response = {
        statusCode: 200,
        body: None,
        headers: {
            Access-Control-Allow-Origin: "*"
        }
    }

    email = json.loads(event['body'])['loginJsonObject']['email']
    password = json.loads(event['body'])['loginJsonObject']['password']

    if event['path'] == "/login":
        result = login(email, password, TABLE_NAME)
        if result['status']:
            response['body'] = json.dumps({"userExists": True})
        else:
            response['body'] = json.dumps({"userExists": False})

    elif event['path'] == "/signup":
        result = signup(email, password, TABLE_NAME)
        if result['status']:
            response['body'] = json.dumps({"userExists": True})
        else:
            response['body'] = json.dumps({"userExists": False})

    return response


def signup(email, password):

    response = table.put_item(
        Item={
            'email': email,
            'password': password,
            'time_of_insertion': str(time.time())
        }
    )

    status = response['ResponseMetadata']['HTTPStatusCode']
    if status == 200:
        return {"status": True}
    else:
        return {"status": False}


def login(email, password):
   
    response = table.query(
    KeyConditionExpression=Key('email').eq(email)
    )
    items = response['Items']
   
    if items[0]['password'] == password:
        return {"status": True}
    else:
       
        return {"status": False}


    # response = table.get_item(
    #     Key={
    #         'email': email,
    #         'password': password
    #     }
    # )
    # status = response['ResponseMetadata']['HTTPStatusCode']
    # if status == 200:
    #     return {"status": True}
    # else:
    #     return {"status": False}
