var app = {
    initialize: function() {
        this.bind();
    },
    bind: function() {
        document.addEventListener('deviceready', this.deviceready, false);
    },
    deviceready: function() {
      var apiKey = "16178811"; // Replace with your apiKey.
      var sessionId = "2_MX4xNjE3ODgxMX5-MjAxMi0wNy0yOCAxODo0MDo1NS43MTU2MzQrMDA6MDB-MC41MDIzNjAwNzUyNDl-"; // Replace with your own session ID. Make sure it matches helloWorld.html
      var token = "T1==cGFydG5lcl9pZD0xNjE3ODgxMSZzaWc9MmQ4YzRlYTc4NGIyOTRjZDg1ODgxNDM5NDVjOGU1MzYwZTMzY2UyZTpzZXNzaW9uX2lkPTJfTVg0eE5qRTNPRGd4TVg1LU1qQXhNaTB3TnkweU9DQXhPRG8wTURvMU5TNDNNVFUyTXpRck1EQTZNREItTUM0MU1ESXpOakF3TnpVeU5EbC0mY3JlYXRlX3RpbWU9MTM0Mzc3MDczMyZleHBpcmVfdGltZT0xMzQzODU3MTMzJnJvbGU9cHVibGlzaGVyJmNvbm5lY3Rpb25fZGF0YT0mbm9uY2U9ODMzMDA4"; // Replace with your session Token.
      // To Generate Sessions and Tokens, See https://dashboard.tokbox.com/projects

      var session = TB.initSession(sessionId); 
      var publisher = TB.initPublisher( apiKey, "myPublisherDiv" ); // Replace with your API key

      session.addEventListener("sessionConnected", sessionConnectedHandler);
      session.addEventListener("streamCreated", streamCreatedHandler);
      session.connect(apiKey, token);

      function sessionConnectedHandler(event) {
        subscribeToStreams(event.streams);
        session.publish( publisher );
      }

      function streamCreatedHandler(event) {
        subscribeToStreams(event.streams);
      }

      function subscribeToStreams(streams) {
        for (i = 0; i < streams.length; i++) {
          var stream = streams[i];
          if (stream.connection.connectionId != session.connection.connectionId) {
            var div = document.createElement('div');
            div.setAttribute('id', 'stream' + stream.streamId);
            document.body.appendChild(div);
            session.subscribe(stream, div.id);
          }
        }
      }
    },
    report: function(id) { 
        console.log("report:" + id);
        // hide the .pending <p> and show the .complete <p>
        document.querySelector('#' + id + ' .pending').className += ' hide';
        var completeElem = document.querySelector('#' + id + ' .complete');
        completeElem.className = completeElem.className.split('hide').join('');
    }
};


