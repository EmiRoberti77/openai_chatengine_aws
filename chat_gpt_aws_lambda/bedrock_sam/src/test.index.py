import json
from index import lambda_handler

body_content = {
  "input":"2+2+(5*5)?"
}

event = {
    "httpMethod": "GET",
    "headers": {
        # Example headers
        "Content-Type": "application/json"
    },
    "queryStringParameters": {
        "id": "123456789678680309273267"
    },
    "pathParameters": {
        "proxy": "path/to/resource"
    },
    "body": json.dumps(body_content),
}

response = lambda_handler(event,None)
print(response)

