# Connection Object

## Description

The Connection object represents a connection to a TokBox session. The Session object has a connection property that is a Connection object. It represents the local user's connection. The Stream object has a connection property that is a Connection object. It represents the stream publisher's connection.

To initialize a session, call the TB.initSession() method, which returns the Session object. Then call the connect() method of the Session object to connect to a session. The Session object dispatches a sessionConnected event when the connection is made. 

## Properties

**connectionId** (String) - The ID of this connection.

**creationTime** (Integer) - The timestamp for the creation of the connection. This value is calculated in milliseconds. You can convert this value to a Date object by calling new Date(creationTime), where creationTime is the creationTime property of the Connection object.


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



