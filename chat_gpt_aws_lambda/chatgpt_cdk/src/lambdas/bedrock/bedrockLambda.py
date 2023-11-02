from BedRockHandler import BedrockHandler as BedrockClass

def bedrockHandler(event, context=None):
  bedrockHandler = BedrockClass(event=event)
  return bedrockHandler.post()