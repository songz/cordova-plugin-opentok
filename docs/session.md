# Session Object

The Session object returned by the `TB.initSession()` method provides access to much of the OpenTok functionality. The Session object exposes functionality through properties, methods and event handlers.

## Properties

**connection** ([Connection](connection.md)) - The Connection Object for this session. The connection property is only available once the `sessionConnected` event has been triggered. If the session fails to connect, this property shall remain nil.

**connectionCount** (Integer) - The number of discrete clients connected to this session. 

**sessionId** (String) - The session ID of this instance. (Note: a Session object is not connected to the TokBox server until you call the `connect()` method of the object and the object dispatches a connected event. See `TB.initSession()` and `connect()` ).


## Methods

[addEventListener()](#addEventListener)  
[connect()](#connect)  
[disconnect()](#disconnect)  
[publish()](#publish)  
[subscribe()](#subscribe)  
[unpublish()](#unpublish)  
[unsubscribe()](#unsubscribe)  


<a name="addEventListener"></a>
### addEventListener( type:String, listener:Function )

Example Code:  
```javascript
session.addEventListener( 'streamCreated', function(streamEvent){
  subscriber = session.subscribe( streamEvent.streams[0] );
});
```

Registers a method as an event listener for a specific event. See [Session Events](sessionEvents.md).

#### Parameters

**type** (String) — This string identifying the type of event. 

**listener** (Function) - The function to be invoked when the Session object dispatches the event. 


<a name="connect"></a>
### connect( apiKey:String, token [, properties:Object] )

Example Code:  
```javascript
session.connect( '1127', 'T1==aeoi3h3...' )
```

Connects to an OpenTok session.  
Upon a successful connection, the Session object dispatches a `sessionConnected` event. Call the `addEventListener()` method to set up an event listener to process this event before calling other methods of the Session object.

The TB object dispatches an `exceptionEvent` if there is an error connecting to Session

#### Parameters

**apikey** (String) - The API key that TokBox provided you when you registered for the OpenTok API.

**token** (String) - The session token. You generate a session token using the OpenTok server-side libraries or the [OpenTok dashboard](https://dashboard.tokbox.com/projects)

**properties** (Object) — Optional. There are currently no properties available for this function.

#### Events Dispatched

**sessionConnected** (SessionConnectEvent) — Dispatched locally when the connection is established.  


<a name="disconnect"></a>
### disconnect()

Example Code:  
```javascript
session.disconnect()
```

Calling the `disconnect()` method ends your connection with the session. In the course of terminating your connection, it also ceases publishing any stream(s) you were publishing.

#### Events dispatched

**sessionDisconnected** ([SessionDisconnectEvent](sessionEvents.md)) — Dispatched locally when the connection is disconnected.

**streamDestroyed** ([StreamEvent](streamEvents.md)) — Dispatched if streams are lost as a result of the session disconnecting.


<a name="publish"></a>
### publish( publisher:Publisher ):[Publisher](publisher.md)

Example Code:  
```javascript
var publisher = TB.initPublisher( '1127', 'publisherDiv' );
session.publish( publisher );
```

The `publish()` method starts publishing an audio-video stream to the session. Upon successful publishing, the Session objects on all connected web pages dispatch `streamCreated` events.

The TB object dispatches an exception event if the users role does not include permissions required to publish. For example, if the users role is set to subscriber, then they cannot publish. You define a users role when you create the user token in your server.

#### Parameters

**publisher** ([Publisher](publisher.md)) - You pass a Publisher object as the one parameter of the method. You can initialize a Publisher object by calling the `TB.initPublisher()` method. Before calling `session.publish()`, you can use the Publisher object to set up and test the microphone and camera used by the Publisher.

#### Events Dispatched
**streamCreated** ( [StreamEvent](streamEvents.md) ) — The stream has been published. The Session object dispatches this on all clients subscribed to the stream, as well as on the publishers client.



<a name="subscribe"></a>
### subscribe(stream:Stream, [replaceElementId:String, properties:Object]):Subscriber

Example Code:  
```javascript
var subscriber = session.subscribe( stream, 'streamDiv' );
```

Subscribes to a stream that is available to the session. As other publishers connect to the session, the Session object dispatches a streamCreated event. This event object has a streams property, which is an updated array of the Stream objects corresponding to streams connected to the session.

#### Parameters

**stream** ( [Stream](stream.md) ) — Stream object representing the stream to which we are trying to subscribe.

**replaceElementId** (String) — String ID of the existing DOM element that the Subscriber replaces. If you do not specify a replaceElementId, the application appends a new DOM element to the HTML body.

**properties** (Object) - Optional. This is an optional object that contains the following properties:

* **height** (Number) — The desired height, in pixels, of the displayed Subscriber video stream (default: 198)
* **width** (Number) — The desired width, in pixels, of the displayed Subscriber video stream (default: 264)
* **subscribeToAudio** (Boolean) — Whether to initially subscribe to audio (if available) for the stream (default: true)
* **subscribeToVideo** (Boolean) — Whether to initially subscribe to video (if available) for the stream (default: true)

#### Return

**Subscriber** — The Subscriber object for this stream. Stream control functions are exposed through the Subscriber object



<a name="unpublish"></a>
### unpublish( publisher:Publisher )

Example Code:  
```javascript
session.unpublish( publisher );
```

The `unpublish()` method ceases publishing the specified publishers audio-video stream to the session.
Upon successful termination, the Session object on every connected web page dispatches a streamDestroyed event.

#### Parameters
**publisher** ( [Publisher](publisher.md) ) — The Publisher object to stop streaming.

#### Events Dispatched
**streamDestroyed** ( [StreamEvent](streamEvents.md) ) — The stream associated with the Publisher has been destroyed. Dispatched on the Publishers device and on device for all connections subscribing to the publishers stream.


<a name="unsubscribe"></a>
### unsubscribe( subscriber:Subscriber )

Example Code:  
```javascript
session.unsubscribe( subscriber );
```

Stops subscribing to a stream in the session. The display of the audio-video stream is removed

#### Parameters

**subscriber** ( [Subscriber](subscriber.md) ) — The Subscriber object to unsubcribe.


<a name="events"></a>
## Session Events:

<table>
	<tr>
		<td>
      <a href="sessionEvents.md">sessionConnected</a>
    </td>
		<td>Triggered when session has successfully connected</td>
	</tr>
	<tr>
		<td>
      <a href="sessionEvents.md">sessionDisconnected</a>
    </td>
		<td>Triggered when a session has disconnected</td>
	</tr>
	<tr>
		<td>
      <a href="streamEvents.md">streamCreated</a>
    </td>
		<td>Triggered when new stream has been created in a session</td>
	</tr>
	<tr>
		<td>
      <a href="streamEvents.md">streamDestroyed</a>
    </td>
		<td>Triggered when stream has ended in a session</td>
	</tr>
</table>

