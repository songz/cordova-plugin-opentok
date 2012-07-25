# Stream Object

Specifies a stream. Properties of the Stream object provide information about the stream.

When a stream is added to a session, the Session object dispatches a streamCreatedEvent. When a stream is destroyed, the Session object dispatches a streamDestroyed event. The StreamEvent object, which defines these event objects, has a stream property, which is an array of Stream object. 


## Properties

**connection** ( [Connection](connection.md) ) — The Connection object corresponding to the connection that is publishing the stream. You can compare this to to the connection property of the Session object to see if the stream is being published by the local publisher

**creationTime** (Number) — The timestamp for the creation of the stream. This value is calculated in milliseconds. You can convert this value to a Date object by calling `new Date(creationTime)`.

**name** (String) — The name of the stream. Specify a name when you call TB.initPublisher().

**hasAudio** (Boolean) — Whether the stream has audio published, which you specify when you call TB.initPublisher().

**hasVideo** (Boolean) — Whether the stream has video published, which you specify when you call TB.initPublisher().

**streamId** (String) - The ID of the stream.

