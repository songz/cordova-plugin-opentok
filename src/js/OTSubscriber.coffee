# Subscriber Object:
#   Properties:
#     id (string) - dom id of the subscriber
#     stream (Stream) - stream to which you are subscribing
#   Methods: 
#     getAudioVolume()
#     getImgData() : String
#     getStyle() : Objects
#     off( type, listener ) : objects
#     on( type, listener ) : objects
#     setAudioVolume( value ) : subscriber
#     setStyle( style, value ) : subscriber
#     subscribeToAudio( value ) : subscriber
#     subscribeToVideo( value ) : subscriber
class TBSubscriber
  getAudioVolume: ->
    return 0
  getImgData: ->
    return ""
  getStyle: ->
    return {}
  off: (event, handler) ->
    return @
  on: (event, handler) ->
# todo - videoDisabled
    return @
  setAudioVolume:(value) ->
    return @
  setStyle: (style, value) ->
    return @
  subscribeToAudio: (value) ->
    return @
  subscribeToVideo: (value) ->
    return @

  constructor: (stream, divName, properties) ->
    element = document.getElementById(divName)
    pdebug "creating subscriber", properties
    @streamId = stream.streamId
    if(properties? && properties.width=="100%" && properties.height == "100%")
      element.style.width="100%"
      element.style.height="100%"
      properties.width = ""
      properties.height = ""
    divPosition = getPosition( divName )
    subscribeToVideo="true"
    zIndex = TBGetZIndex(element)
    if(properties?)
      width = properties.width || divPosition.width
      height = properties.height || divPosition.height
      name = properties.name ? ""
      subscribeToVideo = "true"
      subscribeToAudio = "true"
      if(properties.subscribeToVideo? and properties.subscribeToVideo == false)
        subscribeToVideo="false"
      if(properties.subscribeToAudio? and properties.subscribeToAudio == false)
        subscribeToAudio="false"
    if (not width?) or width == 0 or (not height?) or height==0
      width = DefaultWidth
      height = DefaultHeight
    obj = replaceWithVideoStream(divName, stream.streamId, {width:width, height:height})
    position = getPosition(obj.id)
    ratios = TBGetScreenRatios()
    pdebug "final subscriber position", position
    Cordova.exec(TBSuccess, TBError, OTPlugin, "subscribe", [stream.streamId, position.top, position.left, width, height, zIndex, subscribeToAudio, subscribeToVideo, ratios.widthRatio, ratios.heightRatio] )

  # deprecating
  removeEventListener: (event, listener) ->
    return @



