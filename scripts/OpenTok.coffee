# define constants
OTPlugin = "OpenTokPlugin"
PublisherStreamId = "TBPublisher"
PublisherTypeClass = "OT_publisher"
SubscriberTypeClass = "OT_subscriber"
VideoContainerClass = "OT_video-container"

DefaultWidth = 264
DefaultHeight = 198

# TB Object:
#   Methods: 
#     TB.checkSystemRequirements() :number
#     TB.initPublisher( apiKey:String [, replaceElementId:String] [, properties:Object] ):Publisher
#     TB.initSession( sessionId:String [, production] ):Session 
#     TB.log( message )
#     TB.on( type:String, listener:Function )
#     TB.removeEventListner( type:String, listener:Function )
#  Methods that doesn't do anything:
#     TB.setLogLevel(logLevel:String)
#     TB.upgradeSystemRequirements()
window.TB =
  addEventListener: (event, handler) -> # deprecating soon
    @on( event, handler )
  checkSystemRequirements: ->
    return 1
  initPublisher: (one, two, three) ->
    return new TBPublisher( one, two, three )
  initSession: (sid) ->
    return new TBSession(sid)
  log: (message) ->
    console.debug message
  on: (event, handler) ->
    if(event=="exception")
      console.log("JS: TB Exception Handler added")
      Cordova.exec(handler, TBError, OTPlugin, "exceptionHandler", [] )
  removeEventListner: (type, handler ) ->
    #todo
  setLogLevel: (a) ->
    console.log("Log Level Set")
  upgradeSystemRequirements: ->
    return {}
  updateViews: ->
    TBUpdateObjects()

# Publisher Object:
#   Properties:
#     id (String) — The ID of the DOM element through which the Publisher stream is displayed
#     stream - The Stream object corresponding to the stream of the publisher
#     session (Session) — The Session to which the Publisher is publishing a stream. If the Publisher is not publishing a stream to a Session, this property is set to null.
#     replaceElementId (String) — The ID of the DOM element that was replaced when the Publisher video stream was inserted.
#   Methods: 
#     destroy():Publisher - not yet implemented
#     getImgData() : String - not yet implemented
#     getStyle() : Object - not yet implemented
#     on( type, listener )
#     publishAudio(value) : publisher - not yet implemented
#     publishVideo(value) : publisher - not yet implemented
#     removeEventListner( type, listener ) : publisher - not yet implemented
#     setStyle( style, value ) : publisher - not yet implemented
class TBPublisher
  constructor: (one, two, three) ->
    @sanitizeInputs( one,two, three )
    console.log("JS: Publish Called")
    width = 160
    height = 120
    name="TBNameHolder"
    publishAudio="true"
    publishVideo="true"
    zIndex = TBGetZIndex(document.getElementById(@domId))
    if(@properties?)
      width = @properties.width ? DefaultWidth
      height = @properties.height ? DefaultHeight
      name = @properties.name ? ""
      if(@properties.publishAudio? and @properties.publishAudio==false)
        publishAudio="false"
      if(@properties.publishVideo? and @properties.publishVideo==false)
        publishVideo="false"
    position = getPosition(@domId)
    console.log "first test publisher is getting created, position coordinates - top: #{position.top}, left: #{position.left}, width: #{position.width}, height: #{position.height}"
    replaceWithVideoStream(@domId, PublisherStreamId, {width:width, height:height})
    position = getPosition(@domId)
    console.log "publisher id is #{@domId}"
    console.log "publisher is getting created, position coordinates - top: #{position.top}, left: #{position.left}, width: #{position.width}, height: #{position.height}"
    TBUpdateObjects()
    Cordova.exec(TBSuccess, TBError, OTPlugin, "initPublisher", [ "publisher", position.top, position.left, width, height, zIndex, name, publishAudio, publishVideo] )
  destroy: ->
    Cordova.exec(TBSuccess, TBError, OTPlugin, "destroyPublisher", [] )
  getImgData: ->
    return ""
  getStyle: ->
    return {}
  on: ( event, handler ) ->
    return @
  publishAudio: (value) ->
    return @
  publishVideo: (value) ->
    return @
  removeEventListner: ( event, handler ) ->
    return @
  setStyle: (style, value ) ->
    return @

  sanitizeInputs: (one, two, three) ->
    if( three? )
      # all 3 required properties present: apiKey, domId, properties
      # Check if dom exists
      @apiKey = one
      @domId = two
      @properties = three
    else if( two? )
      # only 2 properties are present, possible inputs: apiKey, domId || apiKey, properties || domId, properties
      if( typeof(two) == "object" )
        # second input is property, so first input is either apiKey or domId
        @properties = two
        if document.getElementById(one)
          @domId = one
        else
          @apiKey = one
      else
        # no property object is passed in
        @apiKey = one
        @domId = two
    else if( one? )
      # only 1 property is present, apiKey || domId || properties
      if( typeof(one) == "object" )
        @properties = one
      else if document.getElementById(one)
        @domId = one
    @apiKey = if @apiKey? then @apiKey else ""
    @properties = if( @properties and typeof( @properties == "object" )) then @properties else {}
    # if domId exists but properties width or height is not specified, set properties
    if( @domId and document.getElementById( @domId ) )
      if !@properties.width or !@properties.height
        console.log "domId exists but properties width or height is not specified"
        position = getPosition( @domId )
        console.log " width: #{position.width} and height: #{position.height} for domId #{@domId}, and top: #{position.top}, left: #{position.left}"
        if position.width > 0 and position.height > 0
          @properties.width = position.width
          @properties.height = position.height
    else
      @domId = TBGenerateDomHelper()
    @domId = if( @domId and document.getElementById( @domId ) ) then @domId else TBGenerateDomHelper()


# Session Object:
#   Properties:
#     capabilities ( Capabilities ) - A Capabilities object includes info about capabilities of the client. All properties of capabilities object are undefined until connected to a session
#     connection ( Connection ) - connection property is only available once session object dispatches sessionConnected event
#     sessionId ( String ) - session Id for this session
#   Methods: 
#     connect( apiKey, token )
#     disconnect()
#     forceDisconnect( connection ) - forces a remote connection to leave the session
#     forceUnpublish( stream ) - forces publisher of the spicified stream to stop publishing the stream
#     getPublisherForStream( stream ) - returns the local publisher object for a given stream
#     getSubscribersForStream( stream ) - returns array of local subscriber objects for a given stream
#     on( type, listener ) 
#     publish( publisher ) - starts publishing
#     removeEventListner( type, listener )
#     signal( signal, completionHandler)
#     subscribe( stream, targetElement, properties ) : subscriber
#     unpublish( publisher )
#     unsubscribe( subscriber )
class TBSession
  connect: (apiKey, token, properties={}) =>
    console.log("JS: Connect Called")
    @apiKey = apiKey
    @token = token
    # ios: Set up key/token, and call _session connectWithApiKey
    Cordova.exec(@sessionConnectedHandler, TBError, OTPlugin, "connect", [@apiKey, @token] )

    # Housekeeping Listeners: Session needs to be removed from DOM after being created
    Cordova.exec(@streamDisconnectedHandler, TBError, OTPlugin, "streamDisconnectedHandler", [] )
    Cordova.exec(@sessionDisconnectedHandler, TBError, OTPlugin, "sessionDisconnectedHandler", [] )
    return
  disconnect: () ->
    Cordova.exec(TBSuccess, TBError, OTPlugin, "disconnect", [] )
  forceDisconnect: (connection) ->
    return @
  forceUnpublish: (stream ) ->
    return @
  getPublisherForStream: (stream) ->
    return @
  getSubscribersForStream: (stream) ->
    return @
  on: (event, handler) ->
    console.log("JS: Add Event Listener Called")
    # Set Handlers based on Events
    # Events: sessionConnected, sessionDisconnected, streamCreated, streamDestroyed
    switch event
      when "sessionConnected"
        # Parse information returned from iOS before calling handler
        @sessionConnectedHandler = (event) =>
          console.log "session connected"
          @connection = event.connection
          # When user first connect, there are no streams in the session
          return handler(event)
      when 'streamCreated'
        # Parse information returned from iOS before calling handler
        @streamCreatedHandler = (response) ->
          arr = response.split(' ')
          stream = new TBStream( arr[0], arr[1] )
          return handler({streams:[stream], stream: stream})
        # ios: After setting up function, set up listener in ios
        Cordova.exec(@streamCreatedHandler, TBSuccess, OTPlugin, "streamCreatedHandler", [] )
      when 'streamDestroyed'
        # Parse information returned from iOS before calling handler
        @streamDisconnectedHandler = (response) ->
          console.log "streamDestroyedHandler "
          arr = response.split(' ')
          stream = new TBStream( arr[0], arr[1] )
          return handler({streams:[stream], stream: stream})
      when 'sessionDisconnected'
        @sessionDisconnectedHandler = (event) =>
          #@cleanUpDom()
          return handler(event)
  publish: (divName, properties) ->
    @publisher = new TBPublisher(divName, properties, @)
    return @publisher
  publish: (publisher) ->
    @publisher = publisher
    Cordova.exec(TBSuccess, TBError, OTPlugin, "publish", [] )
  removeEventListner: ( event, handler ) ->
    return @
  signal: (signal, handler) ->
    return @
  subscribe: (one, two, three) ->
    if( three? )
      # stream, domId, properties
      subscriber = new TBSubscriber(one, two, three)
      return subscriber
    if( two? )
      # stream, domId || stream, properties
      if( typeof(two) == "object" )
        domId = TBGenerateDomHelper()
        subscriber = new TBSubscriber(one, domId, two)
        return subscriber
      else
        subscriber = new TBSubscriber(one, two, {})
        return subscriber
    # stream
    domId = TBGenerateDomHelper()
    subscriber = new TBSubscriber(one, domId, {})
    return subscriber
  unpublish:() ->
    console.log("JS: Unpublish")
    element = document.getElementById( @publisher.domId )
    if(element)
      element.parentNode.removeChild(element)
      TBUpdateObjects()
    return Cordova.exec(TBSuccess, TBError, OTPlugin, "unpublish", [] )
  unsubscribe: (subscriber) ->
    console.log("JS: Unsubscribe")
    elementId = subscriber.streamId
    element = document.getElementById( "TBStreamConnection#{elementId}" )
    console.log("JS: Unsubscribing")
    element = streamElements[ elementId ]
    if(element)
      element.parentNode.removeChild(element)
      delete( streamElements[ streamId ] )
      TBUpdateObjects()
    return Cordova.exec(TBSuccess, TBError, OTPlugin, "unsubscribe", [subscriber.streamId] )

  constructor: (@sessionId) ->
    Cordova.exec(TBSuccess, TBSuccess, OTPlugin, "initSession", [@sessionId] )
  cleanUpDom: ->
    objects = document.getElementsByClassName('OT_root')
    for e in objects
      e.parentNode.removeChild(e)
  sessionDisconnectedHandler: (event) ->
    #@cleanUpDom()
  streamDisconnectedHandler: (streamId) ->
    console.log("JS: Stream Disconnected Handler Executed")
    element = streamElements[ streamId ]
    if(element)
      element.parentNode.removeChild(element)
      delete( streamElements[ streamId ] )
      TBUpdateObjects()
    return
  addEventListener: (event, handler) -> # deprecating soon
    @on( event, handler )


# Subscriber Object:
#   Properties:
#     id (string) - dom id of the subscriber
#     stream (Stream) - stream to which you are subscribing
#   Methods: 
#     getAudioVolume()
#     getImgData() : String
#     getStyle() : Objects
#     on( type, listener ) : objects
#     removeEventListner( type, listener )
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
  on: (event, handler) ->
    return @
  removeEventListner: (event, listener) ->
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
    console.log("JS: Subscribing")
    @streamId = stream.streamId
    console.log( "creating a subscriber, replacing div #{divName}" )
    divPosition = getPosition( divName )
    width = divPosition.width ? DefaultWidth
    height = divPosition.height ? DefaultHeight
    console.log( "proposed width is #{width}, and height #{height}" )
    subscribeToVideo="true"
    zIndex = TBGetZIndex(document.getElementById(divName))
    if(properties?)
      width = properties.width ? width
      height = properties.height ? height
      name = properties.name ? ""
      if(properties.subscribeToVideo? and properties.subscribeToVideo == false)
        subscribeToVideo="false"
    console.log( "setting width to #{width}, and height to #{height}" )
    obj = replaceWithVideoStream(divName, stream.streamId, {width:width, height:height})
    position = getPosition(obj.id)
    Cordova.exec(TBSuccess, TBError, OTPlugin, "subscribe", [stream.streamId, position.top, position.left, width, height, zIndex, subscribeToVideo] )


# Stream Object:
#   Properties:
#     connection ( Connection ) - connection that corresponds to the connection publishing the stream
#     creationTime ( Number ) - timestamp for the creation of the stream, calculated in milliseconds
#     hasAudio ( Boolean ) 
#     hasVideo( Boolean )
#     videoDimensions( Object ) - width and height, numbers
#     name( String ) - name of the stream
class TBStream
  constructor: ( connectionId, @streamId ) ->
    @connection = new TBConnection( connectionId )
    @creationTime = 0
    @hasAudio = true
    @hasVideo = true
    @videoDimensions = {width: 0, height: 0}
    @name = ""

# Connection Object:
#   Properties:
#     id( String) - id of this connection
#     creationTime( number ) - timestamp for creation of the connection ( in milliseconds )
#     data ( string ) - string containing metadata describing the connection
class TBConnection
  constructor: (@connectionId) ->
    return


streamElements = {} # keep track of DOM elements for each stream

# Whenever updateViews are involved, parameters passed through will always have:
# TBPublisher constructor, TBUpdateObjects, TBSubscriber constructor
# [id, top, left, width, height, zIndex, ... ]

#
# Helper methods
#
getPosition = (divName) ->
  # Get the position of element
  pubDiv = document.getElementById(divName)
  if !pubDiv then return {}
  width = pubDiv.offsetWidth
  height = pubDiv.offsetHeight
  curtop = pubDiv.offsetTop
  curleft = pubDiv.offsetLeft
  while(pubDiv = pubDiv.offsetParent)
    curleft += pubDiv.offsetLeft
    curtop += pubDiv.offsetTop
  return {top:curtop, left:curleft, width:width, height:height}

replaceWithVideoStream = (divName, streamId, properties) ->
  typeClass = if streamId == PublisherStreamId then PublisherTypeClass else SubscriberTypeClass
  element = document.getElementById(divName)
  element.setAttribute( "class", "OT_root #{typeClass}" )
  element.setAttribute( "data-streamid", streamId )
  element.style.width = properties.width+"px"
  element.style.height = properties.height+"px"
  element.style.overflow = "hidden"
  element.style['background-color'] = "#000000"
  streamElements[ streamId ] = element

  internalDiv = document.createElement( "div" )
  internalDiv.setAttribute( "class", VideoContainerClass)
  internalDiv.style.width = "100%"
  internalDiv.style.height = "100%"
  internalDiv.style.left = "0px"
  internalDiv.style.top = "0px"

  videoElement = document.createElement( "video" )
  videoElement.style.width = "100%"
  videoElement.style.height = "100%"
  # todo: js change styles or append css stylesheets? Concern: users will not be able to change via css

  internalDiv.appendChild( videoElement )
  element.appendChild( internalDiv )
  return element

TBError = (error) ->
  navigator.notification.alert(error)

TBSuccess = ->
  console.log("success")

TBUpdateObjects = ()->
  console.log("JS: Objects being updated in TBUpdateObjects")
  objects = document.getElementsByClassName('OT_root')
  for e in objects
    console.log("JS: Object updated")
    streamId = e.dataset.streamid
    console.log("JS sessionId: " + streamId )
    id = e.id
    position = getPosition(id)
    Cordova.exec(TBSuccess, TBError, OTPlugin, "updateView", [streamId, position.top, position.left, position.width, position.height, TBGetZIndex(e)] )
  return
TBGenerateDomHelper = ->
  domId = "PubSub" + Date.now()
  div = document.createElement('div')
  div.setAttribute( 'id', domId )
  document.body.appendChild(div)
  return domId


window.TBTesting = (handler) ->
  Cordova.exec(handler, TBError, OTPlugin, "TBTesting", [] )

TBGetZIndex = (ele) ->
  while( ele? )
    val = document.defaultView.getComputedStyle(ele,null).getPropertyValue('z-index')
    console.log val
    if ( parseInt(val) )
      return val
    ele = ele.offsetParent
  return 0

