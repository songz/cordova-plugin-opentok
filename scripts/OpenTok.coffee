getPosition = (divName) ->
  # Get the position of element
  pubDiv = document.getElementById(divName)
  width = pubDiv.style.width
  height = pubDiv.style.height
  curtop = curleft = 0
  if(pubDiv.offsetParent)
    curleft += pubDiv.offsetLeft
    curtop += pubDiv.offsetTop
    while(pubDiv = pubDiv.offsetParent)
      curleft += pubDiv.offsetLeft
      curtop += pubDiv.offsetTop
  return {top:curtop, left:curleft, width:width, height:height}

replaceWithObject = (divName, streamId, properties) ->
  # Replace and add to streamsConnected
  newId = "TBStreamConnection"+streamId
  objDiv = document.getElementById(newId)

  if objDiv?
    return objDiv
  else
    oldDiv = document.getElementById(divName)
    objDiv = document.createElement("object")

    # Setting object Attributes
    objDiv.id = newId
    objDiv.style.width = properties.width+"px"
    objDiv.style.height = properties.height+"px"
    objDiv.setAttribute('streamId',streamId)
    objDiv.textContext = streamId
    objDiv.className = 'TBstreamObject'
    oldDiv.parentNode.replaceChild(objDiv, oldDiv)
    return objDiv

TBError = (error) ->
  navigator.notification.alert(error)

TBSuccess = ->
  console.log("TB NOTHING IS CALLED!")

TBUpdateObjects = ()->
  console.log("JS: Objects being updated")
  objects = document.getElementsByClassName('TBstreamObject')
  for e in objects
    console.log("JS: Object updated")
    streamId = e.getAttribute('streamId')
    id = e.id
    position = getPosition(id)
    Cordova.exec(TBSuccess, TBError, "TokBox", "updateView", [streamId, position.top, position.left, position.width, position.height] )
  return
TBGenerateDomHelper = ->
  domId = "PubSub" + Date.now()
  div = document.createElement('div')
  div.setAttribute( 'id', domId )
  document.body.appendChild(div)
  return domId


# TB Object:
#   Methods: 
#     TB.addEventListener( type:String, listener:Function )
#     TB.initPublisher( apiKey:String [, replaceElementId:String] [, properties:Object] ):Publisher
#     TB.initSession( sessionId:String [, production] ):Session 
#     TB.removeEventListner( type:String, listener:Function )
#  Methods that doesn't do anything:
#     TB.setLogLevel(logLevel:String)
window.TB =
  updateViews: ->
    TBUpdateObjects()
  , addEventListener: (event, handler) ->
    if(event=="exception")
      console.log("JS: TB Exception Handler added")
      Cordova.exec(handler, TBError, "TokBox", "exceptionHandler", [] )
  , initSession: (sid, production) ->
    if production? and (typeof(production)=="boolean" )
      return new TBSession(sid, production)
    return new TBSession(sid, false)
  , initPublisher: (one, two, three) ->
    if( three? )
      # apiKey, domId, properties
      return new TBPublisher(one, two, three)
    if( two? )
      # apiKey, domId || apiKey, properties || domId, properties
      if( typeof(two) == "object" )
        objDiv = document.getElementById(one)
        if objDiv?
          return new TBPublisher("", one, two)
        domId = TBGenerateDomHelper()
        return new TBPublisher(one, domId, two)
      else
        return new TBPublisher(one, two, {})
    # apiKey || domId
    objDiv = document.getElementById(one)
    if objDiv?
      return new TBPublisher("", one, {})
    else
      domId = TBGenerateDomHelper()
      return new TBPublisher(one, domId, {})
  , setLogLevel: (a) ->
    console.log("Log Level Set")

window.TBTesting = (handler) ->
  Cordova.exec(handler, TBError, "TokBox", "TBTesting", [] )

TBGetZIndex = (ele) ->
  while( ele? )
    val = document.defaultView.getComputedStyle(ele,null).getPropertyValue('z-index')
    console.log val
    if ( parseInt(val) )
      return val
    ele = ele.offsetParent
  return 0

# Publisher Object:
#   Properties:
#     id (String) — The ID of the DOM element through which the Publisher stream is displayed
#     session (Session) — The Session to which the Publisher is publishing a stream. If the Publisher is not publishing a stream to a Session, this property is set to null.
#     replaceElementId (String) — The ID of the DOM element that was replaced when the Publisher video stream was inserted.
#   Methods: 
#     destroy() - not yet implemented
class TBPublisher
  constructor: (@key, @domId, @properties={}) ->
    console.log("JS: Publish Called")
    width = 160
    height = 120
    name="TBNameHolder"
    publishAudio="true"
    publishVideo="true"
    zIndex = TBGetZIndex(document.getElementById(@domId))
    if(@properties?)
      width = @properties.width ? 160
      height = @properties.height ? 120
      name = @properties.name ? ""
      if(@properties.publishAudio? and @properties.publishAudio==false)
        publishAudio="false"
      if(@properties.publishVideo? and @properties.publishVideo==false)
        publishVideo="false"
    @obj = replaceWithObject(@domId, "TBPublisher", {width:width, height:height})
    position = getPosition(@obj.id)
    TBUpdateObjects()
    Cordova.exec(TBSuccess, TBError, "TokBox", "initPublisher", [position.top, position.left, width, height, name, publishAudio, publishVideo, zIndex] )
  destroy: ->
    Cordova.exec(TBSuccess, TBError, "TokBox", "destroyPublisher", [] )


class TBSession
  constructor: (@sessionId, @production) ->
    console.log @production
    Cordova.exec(TBSuccess, TBSuccess, "TokBox", "initSession", [@sessionId, @production] )

  cleanUpDom: ->
    objects = document.getElementsByClassName('TBstreamObject')
    for e in objects
      element.parentNode.removeChild(e)

  sessionDisconnectedHandler: (event) ->
    console.log("JS: Session Disconnected Handler Called")
    @cleanUpDom()

  addEventListener: (event, handler) ->
    console.log("JS: Add Event Listener Called")

    # Set Handlers based on Events
    # Events: sessionConnected, sessionDisconnected, streamCreated, streamDestroyed
    if(event == 'sessionConnected')
      # Parse information returned from iOS before calling handler
      @sessionConnectedHandler = (event) =>
        @connection = event.connection
        # When user first connect, there are no streams in the session
        return handler(event)
    else if(event == 'streamCreated')
      # Parse information returned from iOS before calling handler
      @streamCreatedHandler = (response) ->
        arr = response.split(' ')
        stream = {connection:{connectionId:arr[0]}, streamId:arr[1]}
        return handler({streams:[stream]})

      # ios: After setting up function, set up listener in ios
      Cordova.exec(@streamCreatedHandler, TBSuccess, "TokBox", "streamCreatedHandler", [] )
    else if(event=='sessionDisconnected')
      @sessionDisconnectedHandler = (event) ->
        @cleanUpDom()
        return handler(event)

  connect: (apiKey, token, properties={}) ->
    console.log("JS: Connect Called")
    @apiKey = apiKey
    @token = token
    # ios: Set up key/token, and call _session connectWithApiKey
    Cordova.exec(@sessionConnectedHandler, TBError, "TokBox", "connect", [@apiKey, @token] )

    # Housekeeping Listeners: Session needs to be removed from DOM after being created
    Cordova.exec(@streamDisconnectedHandler, TBError, "TokBox", "streamDisconnectedHandler", [] )
    Cordova.exec(@sessionDisconnectedHandler, TBError, "TokBox", "sessionDisconnectedHandler", [] )
    return

  disconnect: () ->
    Cordova.exec(@sessionDisconnectedHandler, TBError, "TokBox", "disconnect", [] )

  publish: (divName, properties) ->
    @publisher = new TBPublisher(divName, properties, @)
    return @publisher
  publish: (publisher) ->
    @publisher = publisher
    newId = "TBStreamConnection"+@connection.connectionId
    @publisher.obj.id = newId
    Cordova.exec(TBSuccess, TBError, "TokBox", "publish", [] )
  unpublish:() ->
    console.log("JS: Unpublish")

    elementId = "TBStreamConnection"+@connection.connectionId
    element = document.getElementById(elementId)
    if(element)
      element.parentNode.removeChild(element)
      TBUpdateObjects()
    return Cordova.exec(TBSuccess, TBError, "TokBox", "unpublish", [] )

  subscribe: (one, two, three) ->
    if( three? )
      # stream, domId, properties
      return new TBSubscriber(one, two, three)
    if( two? )
      # stream, domId || stream, properties
      if( typeof(two) == "object" )
        domId = TBGenerateDomHelper()
        return new TBSubscriber(one, domId, two)
      else
        return new TBSubscriber(one, two, {})
    # stream
    domId = TBGenerateDomHelper()
    return new TBSubscriber(one, domId, {})


  streamDisconnectedHandler: (streamId) ->
    console.log("JS: Stream Disconnected Handler Executed")
    elementId = "TBStreamConnection"+streamId
    element = document.getElementById(elementId)
    if(element)
      element.parentNode.removeChild(element)
      TBUpdateObjects()
    return
  
TBSubscriber = (stream, divName, properties)->
  console.log("JS: Subscribing")
  width = 160
  height = 120
  subscribeToVideo="true"
  zIndex = TBGetZIndex(document.getElementById(divName))
  if(properties?)
    width = properties.width ? 160
    height = properties.height ? 120
    name = properties.name ? ""
    if(properties.subscribeToVideo? and properties.subscribeToVideo == false)
      subscribeToVideo="false"
  obj = replaceWithObject(divName, stream.streamId, {width:width, height:height})
  position = getPosition(obj.id)
  Cordova.exec(TBSuccess, TBError, "TokBox", "subscribe", [stream.streamId, position.top, position.left, width, height, subscribeToVideo, zIndex] )

