import json

def bedrockHandler(event, context=None):
  print('in bedrockHandler')
  print(event)
  http_method = event['httpMethod']
  query_parameters = event['queryStringParameters']
  print(http_method, query_parameters)
  response = {
    "statusCode":200,
    "body":json.dumps({
      "message":"hello python lambda",
      "httpMethod":http_method,
      "query_parameters":query_parameters
      })
  }