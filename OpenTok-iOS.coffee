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
    Cordova.exec(TBSuccess, TBError, "Tokbox", "updateView", [streamId, position.top, position.left, position.width, position.height] )
  return


window.TB =
  initSession: (sid, production) ->
    return new TBSession(sid, production)
  , initPublisher: (key, domId, properties) ->
    return new TBPublisher(key, domId, properties)
  , setLogLevel: (a) ->
   console.log("Log Level Set")
  , addEventListener: (event, handler) ->
    if(event=="exception")
      console.log("JS: TB Exception Handler added")
      Cordova.exec(handler, TBError, "Tokbox", "exceptionHandler", [] )

class TBPublisher
  constructor: (@key, @domId, @properties={}) ->
    console.log("JS: Publish Called")
    width = 160
    height = 120
    name="TBNameHolder"
    publishAudio="true"
    publishVideo="true"
    if(@properties?)
      width = @properties.width ? 160
      height = @properties.height ? 120
      name = @properties.name ? ""
      if(@properties.publishAudio? and @properties.publishAudio==false)
        publishAudio="false"
      if(@properties.publisherVideo? and @properties.publishVideo==false)
        publishVideo="false"
    #position = replaceWithObject(@domId, env.connection.connectionId, pubProperties)
    @obj = replaceWithObject(@domId, "TBPublisher", {width:width, height:height})
    position = getPosition(@obj.id)
    TBUpdateObjects()
    Cordova.exec(TBSuccess, TBError, "Tokbox", "initPublisher", [position.top, position.left, width, height, name, publishAudio, publishVideo] )


class TBSession
  constructor: (sid, production) ->
    @sessionId = sid
    # production is set as strings because NSStrings are most reliable for Phonegap Plugins
    if(@production? and production)
      @production = "true"
    else
      @production = "false"
    # ios: InitSession creates an OTSession Object with given sessionId
    Cordova.exec(TBSuccess, TBSuccess, "Tokbox", "initSession", [@sessionId, @production] )

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
      Cordova.exec(@streamCreatedHandler, TBSuccess, "Tokbox", "streamCreatedHandler", [] )
    else if(event=='sessionDisconnected')
      @sessionDisconnectedHandler = (event) ->
        @cleanUpDom()
        return handler(event)

  connect: (apiKey, token, properties) ->
    console.log("JS: Connect Called")
    @apiKey = apiKey
    @token = token
    # ios: Set up key/token, and call _session connectWithApiKey
    Cordova.exec(@sessionConnectedHandler, TBError, "Tokbox", "connect", [@apiKey, @token] )

    # Housekeeping Listeners: Session needs to be removed from DOM after being created
    Cordova.exec(@streamDisconnectedHandler, TBError, "Tokbox", "streamDisconnectedHandler", [] )
    Cordova.exec(@sessionDisconnectedHandler, TBError, "Tokbox", "sessionDisconnectedHandler", [] )
    return

  disconnect: () ->
    Cordova.exec(@sessionDisconnectedHandler, TBError, "Tokbox", "disconnect", [] )

  publish: (divName, properties) ->
    @publisher = new TBPublisher(divName, properties, @)
    return @publisher
  publish: (publisher) ->
    @publisher = publisher
    newId = "TBStreamConnection"+@connection.connectionId
    @publisher.obj.id = newId
    Cordova.exec(TBSuccess, TBError, "Tokbox", "publish", [] )
  unpublish:() ->
    console.log("JS: Unpublish")

    elementId = "TBStreamConnection"+@connection.connectionId
    element = document.getElementById(elementId)
    if(element)
      element.parentNode.removeChild(element)
      TBUpdateObjects()
    return Cordova.exec(TBSuccess, TBError, "Tokbox", "unpublish", [] )

  subscribe: (stream, divName, properties) ->
    return new TBSubscriber(stream, divName, properties)

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
  if(properties?)
    width = properties.width ? 160
    height = properties.height ? 120
    name = properties.name ? ""
    if(properties.subscribeToVideo? and properties.subscribeToVideo == false)
      subscribeToVideo="false"
  obj = replaceWithObject(divName, stream.streamId, {width:width, height:height})
  position = getPosition(obj.id)
  Cordova.exec(TBSuccess, TBError, "Tokbox", "subscribe", [stream.streamId, position.top, position.left, width, height, subscribeToVideo] )

