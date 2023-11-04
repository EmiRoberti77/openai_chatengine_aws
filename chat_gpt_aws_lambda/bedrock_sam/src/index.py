
import boto3
import json

bedrock = boto3.client(service_name='bedrock-runtime')

def httpApiReturn(code, body):
    if isinstance(body, Exception):
        body = str(body)
    
    return {
        "isBase64Encoded": False,
        "statusCode": code,
        "headers": {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "OPTIONS,GET,POST,PUT,DELETE",  
            "Access-Control-Allow-Headers": "Content-Type,Authorization" 
        },
        "body": body
    }

def lambda_handler(event, context):
    print("boto3 version"+ boto3.__version__)
    httpMethod = event['httpMethod']
    if(httpMethod == 'GET'):
        return get(event)
    elif(httpMethod == 'POST'):
        return post(event)

def get(event):
    print("def get(event)")
    response = httpApiReturn(200, json.dumps({
        "message": "hello emibedrock api",
        "httpMethod": "GET"
    }))
    print(response)
    return response


def post(event): 
    try:
        json_body = json.loads(event['body'])
        prompt= json_body.get("input")
        body = json.dumps({
            "prompt": prompt,
            "maxTokens": 1525,
            "temperature": 0.7,
            "topP": 1,
            "stopSequences":[],
            "countPenalty":{"scale":0},
            "presencePenalty":{"scale":0},
            "frequencyPenalty":{"scale":0}})
        modelId = 'ai21.j2-ultra-v1'
        accept = 'application/json'
        contentType = 'application/json'

        response = bedrock.invoke_model(body=body, modelId=modelId, accept=accept, contentType=contentType)

        response_body = response.get('body').read()
        
        #result = json.dumps(response_body.get("completions")[0].get("data").get("text"))
        result = response_body
        response = httpApiReturn(200, result)
        print(response)
        return response 
    except Exception as e:
        return httpApiReturn(502, e)

