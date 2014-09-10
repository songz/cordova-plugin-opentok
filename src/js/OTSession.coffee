# Session Object:
#   Properties:
#     capabilities ( Capabilities ) - A Capabilities object includes info about capabilities of the client. All properties of capabilities object are undefined until connected to a session
#     connection ( Connection ) - connection property is only available once session object dispatches sessionConnected event
#     sessionId ( String ) - session Id for this session
#   Methods: 
#     connect( token, completionHandler )
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
  connect: (@token, connectCompletionCallback) ->
    if( typeof(connectCompletionCallback) != "function" and connectCompletionCallback? )
      TB.showError( "Session.connect() takes a token and an optional completionHandler" )
      return
    if( connectCompletionCallback? ) then @on('sessionConnected', connectCompletionCallback)
    Cordova.exec(@eventReceived, TBError, OTPlugin, "addEvent", ["sessionEvents"] )
    Cordova.exec(TBSuccess, TBError, OTPlugin, "connect", [@token] )
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
  publish: (divName, properties) =>
    if( @alreadyPublishing )
      pdebug("Session is already publishing", {})
      return
    @alreadyPublishing = true
    @publisher = new TBPublisher(divName, properties)
    @publish( @publisher )
  publish: () =>
    if( @alreadyPublishing )
      pdebug("Session is already publishing", {})
      return
    @alreadyPublishing = true
    if(typeof arguments[0] == "object")
      @publisher = arguments[0]
    else
      @publisher = OT.initPublisher(arguments)
    @publisher.setSession(@)
    Cordova.exec(TBSuccess, TBError, OTPlugin, "publish", [] )
    return @publisher
  signal: (signal, signalCompletionHandler) ->
    # signal payload: [type, data, connection( separated by spaces )]
    type = if signal.type? then signal.type else ""
    data = if signal.data? then signal.data else ""
    to = if signal.to? then signal.to else ""
    to = if typeof(to)=="string" then to else to.connectionId
    Cordova.exec(TBSuccess, TBError, OTPlugin, "signal", [type, data, to] )
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
    @alreadyPublishing = false
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

  constructor: (@apiKey, @sessionId) ->
    @apiKey = @apiKey.toString()
    @connections = {}
    @streams = {}
    @alreadyPublishing = false
    OT.getHelper().eventing(@)
    Cordova.exec(TBSuccess, TBSuccess, OTPlugin, "initSession", [@apiKey, @sessionId] )
  cleanUpDom: ->
    objects = document.getElementsByClassName('OT_root')
    while( objects.length > 0 )
      e = objects[0]
      if e and e.parentNode and e.parentNode.removeChild
        e.parentNode.removeChild(e)
      objects = document.getElementsByClassName('OT_root')

  # event listeners
  # todo - other events: connectionCreated, connectionDestroyed, signal?, streamPropertyChanged, signal:type?
  eventReceived: (response) =>
    pdebug "session event received", response
    @[response.eventType](response.data)
  connectionCreated: (event) =>
    connection = new TBConnection( event.connection )
    connectionEvent = new TBEvent( {connection: connection } )
    @connections[connection.connectionId] = connection
    @trigger("connectionCreated", connectionEvent)
    return @
  connectionDestroyed: (event) =>
    pdebug "connectionDestroyedHandler", event
    connection = @connections[ event.connection.connectionId ]
    connectionEvent = new TBEvent( {connection: connection, reason: "clientDisconnected" } )
    @trigger("connectionDestroyed", connectionEvent)
    delete( @connections[ connection.connectionId] )
    return @
  sessionConnected: (event) =>
    pdebug "sessionConnectedHandler", event
    @trigger("sessionConnected")
    @connection = new TBConnection( event.connection )
    event = null
    return @
  sessionDisconnected: (event) =>
    pdebug "sessionDisconnected event", event
    @alreadyPublishing = false
    sessionDisconnectedEvent = new TBEvent( { reason: event.reason } )
    @trigger("sessionDisconnected", sessionDisconnectedEvent)
    @cleanUpDom()
    return @
  streamCreated: (event) =>
    pdebug "streamCreatedHandler", event
    stream = new TBStream( event.stream, @connections[event.stream.connectionId] )
    @streams[ stream.streamId ] = stream
    streamEvent = new TBEvent( {stream: stream } )
    @trigger("streamCreated", streamEvent)
    return @
  streamDestroyed: (event) =>
    pdebug "streamDestroyed event", event
    stream = @streams[event.stream.streamId]
    streamEvent = new TBEvent( {stream: stream, reason: "clientDisconnected" } )
    @trigger("streamDestroyed", streamEvent)
    # remove stream DOM
    element = streamElements[ stream.streamId ]
    if(element)
      element.parentNode.removeChild(element)
      delete( streamElements[ stream.streamId ] )
      TBUpdateObjects()
    delete( @streams[ stream.streamId ] )
    return @
  signalReceived: (event) =>
    pdebug "signalReceived event", event
    streamEvent = new TBEvent( {type: event.type, data: event.data, from: @connections[event.connectionId] } )
    @trigger("signal", streamEvent)
    @trigger("signal:#{event.type}", streamEvent)

  # deprecating
  addEventListener: (event, handler) -> # deprecating soon
    @on( event, handler )
    return @
  removeEventListener: ( event, handler ) ->
    @off( event, handler )
    return @



