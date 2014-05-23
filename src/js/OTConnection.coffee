# Connection Object:
#   Properties:
#     id( String) - id of this connection
#     creationTime( number ) - timestamp for creation of the connection ( in milliseconds )
#     data ( string ) - string containing metadata describing the connection
class TBConnection
  constructor: (prop) ->
    @connectionId = prop.connectionId
    @creationTime = prop.creationTime
    @data = prop.data
    return
  toJSON: ->
    return {
      connectionId: @connectionId
      creationTime: @creationTime
      data: @data
    }


