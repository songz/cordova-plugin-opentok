# define constants
OTPlugin = "OpenTokPlugin"
PublisherStreamId = "TBPublisher"
PublisherTypeClass = "OT_publisher"
SubscriberTypeClass = "OT_subscriber"
VideoContainerClass = "OT_video-container"
StringSplitter = "$2#9$"

DefaultWidth = 264
DefaultHeight = 198

# TB Object:
#   Methods: 
#     TB.checkSystemRequirements() :number
#     TB.initPublisher( apiKey:String [, replaceElementId:String] [, properties:Object] ):Publisher
#     TB.initSession( sessionId:String [, production] ):Session 
#     TB.log( message )
#     TB.off( type:String, listener:Function )
#     TB.on( type:String, listener:Function )
#  Methods that doesn't do anything:
#     TB.setLogLevel(logLevel:String)
#     TB.upgradeSystemRequirements()
window.TB =
  checkSystemRequirements: ->
    return 1
  initPublisher: (one, two, three) ->
    return new TBPublisher( one, two, three )
  initSession: (sid) ->
    return new TBSession(sid)
  log: (message) ->
    pdebug "TB LOG", message
  off: (event, handler) ->
    #todo
  on: (event, handler) ->
    if(event=="exception") # TB object only dispatches one type of event
      console.log("JS: TB Exception Handler added")
      Cordova.exec(handler, TBError, OTPlugin, "exceptionHandler", [] )
  setLogLevel: (a) ->
    console.log("Log Level Set")
  upgradeSystemRequirements: ->
    return {}
  updateViews: ->
    TBUpdateObjects()

  # deprecating
  addEventListener: (event, handler) ->
    @on( event, handler )
  removeEventListener: (type, handler ) ->
    @off( type, handler )

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
#     off( type, listener )
#     on( type, listener )
#     publishAudio(Boolean) : publisher - change publishing state for Audio
#     publishVideo(Boolean) : publisher - change publishing state for Video
#     setStyle( style, value ) : publisher - not yet implemented
#
class TBPublisher
  constructor: (one, two, three) ->
    @sanitizeInputs( one,two, three )
    pdebug "creating publisher", {}
    position = getPosition(@domId)
    name="TBNameHolder"
    publishAudio="true"
    publishVideo="true"
    cameraName = "front"
    zIndex = TBGetZIndex(document.getElementById(@domId))

    if @properties?
      width = @properties.width ? position.width
      height = @properties.height ? position.height
      name = @properties.name ? "TBNameHolder"
      cameraName = @properties.cameraName ? "front"
      if(@properties.publishAudio? and @properties.publishAudio==false)
        publishAudio="false"
      if(@properties.publishVideo? and @properties.publishVideo==false)
        publishVideo="false"
    if (not width?) or width == 0 or (not height?) or height==0
      width = DefaultWidth
      height = DefaultHeight
    replaceWithVideoStream(@domId, PublisherStreamId, {width:width, height:height})
    position = getPosition(@domId)
    @userHandlers = {}
    TBUpdateObjects()
    Cordova.exec(@streamCreatedHandler, TBSuccess, OTPlugin, "addEvent", ["pubStreamCreated"] )
    Cordova.exec(@streamDestroyedHandler, TBError, OTPlugin, "addEvent", ["pubStreamDestroyed"] )
    Cordova.exec(TBSuccess, TBError, OTPlugin, "initPublisher", [name, position.top, position.left, width, height, zIndex, publishAudio, publishVideo, cameraName] )
  streamCreatedHandler: (response) =>
    pdebug "publisher streamCreatedHandler", response
    arr = response.split( StringSplitter )
    stream = new TBStream( arr )
    for e in @userHandlers["streamCreated"]
      e( {streams:[stream.toJSON()], stream: stream.toJSON()} )
    return @
  streamDestroyedHandler: (response) =>
    for e in @userHandlers["streamDestroyed"]
      e( {streams:[stream.toJSON()], stream: stream.toJSON()} )
    return @

  destroy: ->
    Cordova.exec(TBSuccess, TBError, OTPlugin, "destroyPublisher", [] )
  getImgData: ->
    return ""
  getStyle: ->
    return {}
  off: ( event, handler ) ->
    pdebug "removing event #{event}", @userHandlers
    if @userHandlers[event]?
      @userHandlers[event] = @userHandlers[event].filter ( item, index ) ->
        return item != handler
    pdebug "removed handlers, resulting handlers:", @userHandlers
    #todo
    return @
  on: ( event, handler ) ->
    pdebug "adding event handlers", @userHandlers
    if @userHandlers[event]?
      @userHandlers[event].push( handler )
    else
      @userHandlers[event] = [handler]
    return @
  publishAudio: (state) ->
    @publishMedia( "publishAudio", state )
    return @
  publishVideo: (state) ->
    @publishMedia( "publishVideo", state )
    return @
  setStyle: (style, value ) ->
    return @

  publishMedia: (media, state) ->
    if media not in ["publishAudio", "publishVideo"] then return
    publishState = "true"
    if state? and ( state == false or state == "false" )
      publishState = "false"
    pdebug "setting publishstate", {media: media, publishState: publishState}
    Cordova.exec(TBSuccess, TBError, OTPlugin, media, [publishState] )
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

  # deprecating
  removeEventListener: ( event, handler ) ->
    @off( event, handler )
    return @


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
#     off( type, listener ) 
#     on( type, listener ) 
#     publish( publisher ) - starts publishing
#     signal( signal, completionHandler)
#     subscribe( stream, targetElement, properties ) : subscriber
#     unpublish( publisher )
#     unsubscribe( subscriber )
class TBSession
  connect: (apiKey, token, properties={}) ->
    pdebug "connect", properties
    @apiKey = apiKey
    @token = token
    Cordova.exec(@connectionCreatedHandler, TBError, OTPlugin, "addEvent", ["sessConnectionCreated"] )
    Cordova.exec(@connectionDestroyedHandler, TBError, OTPlugin, "addEvent", ["sessConnectionDestroyed"] )
    Cordova.exec(@sessionConnectedHandler, TBError, OTPlugin, "addEvent", ["sessSessionConnected"] )
    Cordova.exec(@sessionDisconnectedHandler, TBError, OTPlugin, "addEvent", ["sessSessionDisconnected"] )
    Cordova.exec(@streamCreatedHandler, TBSuccess, OTPlugin, "addEvent", ["sessStreamCreated"] )
    Cordova.exec(@streamDestroyedHandler, TBError, OTPlugin, "addEvent", ["sessStreamDestroyed"] )
    Cordova.exec(@streamPropertyChanged, TBError, OTPlugin, "addEvent", ["sessStreamPropertyChanged"] )
    Cordova.exec(@signalReceived, TBError, OTPlugin, "addEvent", ["signalReceived"] )
    Cordova.exec(TBSuccess, TBError, OTPlugin, "connect", [@apiKey, @token] )
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
  off: (one, two, three) ->
    if typeof( one ) == "object"
      for k,v of one
        @removeEventHandler( k, v )
      return
    if typeof( one ) == "string"
      for e in one.split( ' ' )
        @removeEventHandler( e, two )
  on: (one, two, three) =>
    # Set Handlers based on Events
    pdebug "adding event handlers", @userHandlers
    if typeof( one ) == "object"
      for k,v of one
        @addEventHandlers( k, v )
      return
    if typeof( one ) == "string"
      for e in one.split( ' ' )
        @addEventHandlers( e, two )
      return
# todo - other events: connectionCreated, connectionDestroyed, signal?, streamPropertyChanged, signal:type?
  publish: (divName, properties) ->
    @publisher = new TBPublisher(divName, properties, @)
    return @publisher
  publish: (publisher) ->
    @publisher = publisher
    Cordova.exec(TBSuccess, TBError, OTPlugin, "publish", [] )
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
    @userHandlers = {}
    Cordova.exec(TBSuccess, TBSuccess, OTPlugin, "initSession", [@sessionId] )
  cleanUpDom: ->
    objects = document.getElementsByClassName('OT_root')
    for e in objects
      e.parentNode.removeChild(e)
  addEventHandlers: (event, handler) =>
    pdebug "adding Event", event
    if @userHandlers[event]?
      @userHandlers[event].push( handler )
    else
      @userHandlers[event] = [handler]
  removeEventHandler: (event, handler) =>
    pdebug "removing event #{event}", @userHandlers
    if not handler?
      delete @userHandlers[event]
    else
      if @userHandlers[event]?
        @userHandlers[event] = @userHandlers[event].filter ( item, index ) ->
          return item != handler
    return @


  # event listeners
  streamDestroyedHandler: (streamId) =>
    pdebug "streamDestroyedHandler", streamId
    element = streamElements[ streamId ]
    if(element)
      element.parentNode.removeChild(element)
      delete( streamElements[ streamId ] )
      TBUpdateObjects()
    if @userHandlers["streamDestroyed"]
      for e in @userHandlers["streamDestroyed"]
        e(event)
    return @
  sessionConnectedHandler: (event) =>
    pdebug "sessionConnectedHandler", event
    pdebug "what is apiKey: #{@apiKey}", {}
    pdebug "what is token: #{@token}", {}
    pdebug "what is userHandlers", @userHandlers
    @connection = event.connection
    for e in @userHandlers["sessionConnected"]
      e(event)
    return @
  streamCreatedHandler: (response) =>
    pdebug "streamCreatedHandler", response
    arr = response.split( StringSplitter )
    stream = new TBStream( arr )
    for e in @userHandlers["streamCreated"]
      e( {streams:[stream.toJSON()], stream: stream.toJSON()} )
    return @
  sessionDisconnectedHandler: (event) =>
    #@cleanUpDom()
    for e in @userHandlers["sessionDisconnected"]
      e( event )
    return @

  # deprecating
  addEventListener: (event, handler) -> # deprecating soon
    @on( event, handler )
    return @
  removeEventListener: ( event, handler ) ->
    @off( event, handler )
    return @


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
    pdebug "creating subscriber", properties
    @streamId = stream.streamId
    console.log( "creating a subscriber, replacing div #{divName}" )
    divPosition = getPosition( divName )
    subscribeToVideo="true"
    zIndex = TBGetZIndex(document.getElementById(divName))
    if(properties?)
      width = properties.width ? divPosition.width
      height = properties.height ? divPosition.height
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
    console.log( "setting width to #{width}, and height to #{height}" )
    obj = replaceWithVideoStream(divName, stream.streamId, {width:width, height:height})
    position = getPosition(obj.id)
    Cordova.exec(TBSuccess, TBError, OTPlugin, "subscribe", [stream.streamId, position.top, position.left, width, height, zIndex, subscribeToAudio, subscribeToVideo] )

  # deprecating
  removeEventListener: (event, listener) ->
    return @


# Stream Object:
#   Properties:
#     connection ( Connection ) - connection that corresponds to the connection publishing the stream
#     creationTime ( Number ) - timestamp for the creation of the stream, calculated in milliseconds
#     hasAudio ( Boolean ) 
#     hasVideo( Boolean )
#     videoDimensions( Object ) - width and height, numbers
#     name( String ) - name of the stream
class TBStream
  constructor: ( props ) ->
    pdebug "stream object being created with data:", props
    @connection = new TBConnection( props[0] )
    @streamId = props[1]
    @name = props[2]
    @hasAudio = if props[3]== "T" then true else false
    @hasVideo = if props[4]== "T" then true else false
    @creationTime = props[5]
    @videoDimensions = {width: 0, height: 0}
  toJSON: ->
    return {
      streamId: @streamId
      name: @name
      hasAudio: @hasAudio
      hasVideo: @hasVideo
      creationTime: @creationTime
      connection: @connection.toJSON()
    }

# Connection Object:
#   Properties:
#     id( String) - id of this connection
#     creationTime( number ) - timestamp for creation of the connection ( in milliseconds )
#     data ( string ) - string containing metadata describing the connection
class TBConnection
  constructor: (@connectionId) ->
    return
  toJSON: ->
    return {
      connectionId: @connectionId
    }


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

TBGetZIndex = (ele) ->
  while( ele? )
    val = document.defaultView.getComputedStyle(ele,null).getPropertyValue('z-index')
    console.log val
    if ( parseInt(val) )
      return val
    ele = ele.offsetParent
  return 0

pdebug = (msg, data) ->
  console.log "JS Lib: #{msg} - ", data
