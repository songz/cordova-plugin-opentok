# Stream Object

## Description

Specifies a stream. Properties of the Stream object provide information about the stream.

When a stream is added to a session, the Session object dispatches a streamCreatedEvent. When a stream is destroyed, the Session object dispatches a streamDestroyed event. The StreamEvent object, which defines these event objects, has a stream property, which is an array of Stream object. 


## Properties

**connection** (Connection) — The Connection object corresponding to the connection that is publishing the stream. You can compare this to to the connection property of the Session object to see if the stream is being published by the local publisher

**creationTime** (Number) — The timestamp for the creation of the stream. This value is calculated in milliseconds. You can convert this value to a Date object by calling new Date(creationTime), where creationTime is the creationTime property of the Stream object.

**name** (String) — The name of the stream. Publishers can specify a name when publishing a stream (using the publish() method of the publishers Session object).

**hasAudio** (Boolean) — Whether the stream has audio published. See Session.publish()

**hasVideo** (Boolean) — Whether the stream has video published. See Session.publish()

**streamId** (String) - The ID of the stream.


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



