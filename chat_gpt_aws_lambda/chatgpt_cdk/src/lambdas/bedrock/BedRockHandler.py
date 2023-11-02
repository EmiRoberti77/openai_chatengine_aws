import json

class BedrockHandler:
  def __init__(self, event) -> None:
    self.event = event

  def post():
    response = {
    "statusCode":200,
    "body":json.dumps({
      "message":"POST hello python bedrock"
      })
    }
    return response
  
  def get():
    response = {
    "statusCode":200,
    "body":json.dumps({
      "message":"GET hello python bedrock"
      })
    }
    return response