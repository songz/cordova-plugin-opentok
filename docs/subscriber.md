# Subscriber Object

The Subscriber object references a stream that you have subscribed to. The `subscribe()` method of the Session object returns a Subscriber object.

## Properties

**session** ( [Session](stream.md) ) — The session to which this subscriber belongs.

**stream** ( [Stream](stream.md) ) — The stream to which you are subscribing.

**subscribeToAudio** (Boolean) — Whether to subscribe to the stream’s audio. You determine this when you call the Session.subscribe() method.

**subscribeToVideo** (Boolean) — Whether to subscribe to the stream’s video. You determine this when you call the Session.subscribe() method.

*Note*: These properties should only be used as a read-only entities. The results of using JavaScript to directly change the properties will be unpredictable.

