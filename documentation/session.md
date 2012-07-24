# Session Object

## Description

The Session object returned by the `TB.initSession()` method provides access to much of the OpenTok functionality. The Session object exposes functionality through properties, methods and event handlers.

## Properties

**connection** (Connection) - The Connection Object for this session. The connection property is only available once the `sessionConnected` event has been triggered. If the session fails to connect, this property shall remain nil.

**connectionCount** (Integer) - The number of discrete clients connected to this session. 

**sessionId** (String) - The session ID of this instance. (Note: a Session object is not connected to the TokBox server until you call the connect() method of the object and the object dispatches a connected event. See TB.initSession() and connect()).


## Connecting Session
```javascript
session.connect( apiKey:String, token [, properties:Object] )
```

Connects to an OpenTok session. Pass the API key as the apiKey parameter. You obtain a API key when you register with TokBox. Pass the token string as the token parameter.

Before calling this method, obtain a Session object by calling the TB.initSession(), which creates a session object based on a session ID.

Upon a successful connection, the Session object dispatches a sessionConnected event. Call the addEventListener() method to set up an event listener to process this event before calling other methods of the Session object.

The Session object dispatches a connectionCreated event when other clients create connections to the session.

The TB object dispatches an exception event if there is an error connecting to Session


### Parameters

**apikey** (String) - The API key that TokBox provided you when you registered for the OpenTok API.
**token** (String) - The session token. You generate a session token using the OpenTok server-side libraries or the Session and Token Generator page.
**properties** (Object) — Optional. There are currently no properties available for this function.

### Events Dispatched

**sessionConnected** (SessionConnectEvent) — Dispatched locally when the connection is established.  


## Disconnect
```javascript
session.connect()
```

Calling the disconnect() method ends your connection with the session. In the course of terminating your connection, it also ceases publishing any stream(s) you were publishing.


### Events dispatched

**sessionDisconnected** (SessionDisconnectEvent) — Dispatched locally when the connection is disconnected.

**streamDestroyed** (StreamEvent) — Dispatched if streams are lost as a result of the session disconnecting.


## Publish to Session
```javascript
session.publish( publisher:Publisher] )
```

The publish() method starts publishing an audio-video stream to the session. Upon successful publishing, the Session objects on all connected web pages dispatch streamCreated.

The TB object dispatches an exception event if the users role does not include permissions required to publish. For example, if the users role is set to subscriber, then they cannot publish. You define a users role when you create the user token in your server

### Parameters

**publisher** (Publisher) - You pass a Publisher object as the one parameter of the method. You can initialize a Publisher object by calling the TB.initPublisher() method. Before calling Session.publish(), you can use the Publisher object to set up and test the microphone and camera used by the Publisher.

### Events Dispatched
**streamCreated** (StreamEvent) — The stream has been published. The Session object dispatches this on all clients subscribed to the stream, as well as on the publishers client.



## Unpublish from Session
```javascript
session.unpublish( publisher:Publisher] )
```

The unpublish() method ceases publishing the specified publishers audio-video stream to the session.
Upon successful termination, the Session object on every connected web page dispatches a streamDestroyed event.

### Parameters
**publisher** (Publisher) — The Publisher object to stop streaming.

### Events Dispatched
**streamDestroyed** (StreamEvent) — The stream associated with the Publisher has been destroyed. Dispatched on the Publishers device and on device for all connections subscribing to the publishers stream.


## Subscribe to Stream
```javascript
var subscriber = subscribe(stream:Stream, [replaceElementId:String, properties:Object])
```

Subscribes to a stream that is available to the session. As other publishers connect to the session, the Session object dispatches a streamCreated event. This event object has a streams property, which is an updated array of the Stream objects corresponding to streams connected to the session.

### Parameters

**stream** (Stream) — Stream object representing the stream to which we are trying to subscribe.
**replaceElementId** (String) — String ID of the existing DOM element that the Subscriber replaces. If you do not specify a replaceElementId, the application appends a new DOM element to the HTML body.
**properties** (Object) - Optional. This is an optional object that contains the following properties:

* **height** (Number) — The desired height, in pixels, of the displayed Subscriber video stream (default: 198)
* **width** (Number) — The desired width, in pixels, of the displayed Subscriber video stream (default: 264)
* **subscribeToAudio** (Boolean) — Whether to initially subscribe to audio (if available) for the stream (default: true)
* **subscribeToVideo** (Boolean) — Whether to initially subscribe to video (if available) for the stream (default: true)

### Return

**Subscriber** — The Subscriber object for this stream. Stream control functions are exposed through the Subscriber object


## Unsubscribe to Stream
```javascript
unsubscribe( subscriber:Subscriber )
```

Stops subscribing to a stream in the session. The display of the audio-video stream is removed

### Parameters

**subscriber** (Subscriber) — The Subscriber object to unsubcribe.


## Add Event Listener
```javascript
session.addEventListener(type:String, listener:Function)
```

Registers a method as an event listener for a specific event.

### Parameters

**type** (String) — This string identifying the type of event. 
**listener** (Function) - The function to be invoked when the Session object dispatches the event. 


## Session Events:
sessionConnected  
sessionDisconnected  
streamCreated  
streamDestroyed  


## Learn More!
[Session Object](session.md)  
[Publisher Object](publisher.md)  
[Stream Object](stream.md)  
[Subscriber Object](subscriber.md)  
[ExceptionEvent Object](exceptionEvent.md)  
[Connection Object](connection.md)  


## License

Copyright (c) 2012 TokBox, Inc.
Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in 
the Software without restriction, including without limitation the rights to 
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies 
of the Software, and to permit persons to whom the Software is furnished to do 
so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all 
copies or substantial portions of the Software.

The software complies with Terms of Service for the OpenTok platform described 
in http://www.tokbox.com/termsofservice

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR 
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, 
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE 
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER 
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, 
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE 
SOFTWARE.

