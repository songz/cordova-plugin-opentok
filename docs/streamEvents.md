# StreamCreated Event

The Session object dispatches StreamEvent event when a session has a stream created or destroyed. The StreamEvent object specifies a stream, along with additional information about why the event in question was dispatched.

## Properties

**streams** ( Array[Stream] ) —  An array of Stream objects corresponding to the streams to which this event refers. This is usually an array containing only one Stream object, corresponding to the stream that was added. However, the array may contain multiple Stream objects if multiple streams were added.

**target** ( Object ) - The object that dispatched the event


# StreamDestroyed Event

## Properties

**streams** ( Array[Stream] ) —  An array of Stream objects corresponding to the streams to which this event refers. This is usually an array containing only one Stream object, corresponding to the stream that was destroyed. However, the array may contain multiple Stream objects if multiple streams were destroyed.

**target** ( Object ) - The object that dispatched the event

