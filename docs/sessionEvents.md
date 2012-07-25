# SessionConnectEvent

The Session object dispatches SessionConnectEvent object when a session has successfully connected in response to a call to the `connect()` method of the Session object.

## Properties

**connections** ( Array[Connection] ) — An array of [Connection](connection.md) objects, representing connections to the session. (Note that each connection can publish multiple streams)

**streams** ( Array[Stream] ) —  An array of [Stream](stream.md) objects corresponding to the streams currently available in the session that has connected.

**target** ( Object ) - The object that dispatched the event


# SessionDisconnectEvent

The Session object dispatches SessionDisconnectEvent object when a session has disconnected. This event may be dispatched asynchronously in response to a successful call to the `disconnect()` method of the session object.

## Properties

**target** ( Object ) - The object that dispatched the event
