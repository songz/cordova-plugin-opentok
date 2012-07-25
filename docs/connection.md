# Connection Object

## Description

The Connection object represents a connection to a TokBox session. The Session object has a connection property that is a Connection object representing the local user's connection. The Stream object has a connection property that is a Connection object representing the stream publisher's connection.

To initialize a session, call the TB.initSession() method, which returns the Session object. Then call the connect() method of the Session object to connect to a session. The Session object dispatches a sessionConnected event when the connection is made. 

## Properties

**connectionId** (String) — The ID of this connection.

**creationTime** (Number) — The timestamp for the creation of the connection. This value is calculated in milliseconds. You can convert this value to a Date object by calling new Date(creationTime), where creationTime is the creationTime property of the Connection object.


