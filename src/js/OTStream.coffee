# Stream Object:
#   Properties:
#     connection ( Connection ) - connection that corresponds to the connection publishing the stream
#     creationTime ( Number ) - timestamp for the creation of the stream, calculated in milliseconds
#     hasAudio ( Boolean ) 
#     hasVideo( Boolean )
#     videoDimensions( Object ) - width and height, numbers
#     name( String ) - name of the stream
class TBStream
  constructor: ( prop, @connection ) ->
    for k,v of prop
      @[k] = v
    @videoDimensions = {width: 0, height: 0}


