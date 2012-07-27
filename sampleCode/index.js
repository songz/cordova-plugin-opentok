var app = {
    initialize: function() {
        this.bind();
    },
    bind: function() {
        document.addEventListener('deviceready', this.deviceready, false);
    },
    deviceready: function() {
      var apiKey = ""; // Replace with your apiKey.
      var sessionId = ""; // Replace with your own session ID. Make sure it matches helloWorld.html
      var token = ""; // Replace with your session Token.
      // To Generate Sessions and Tokens, See http://www.tokbox.com/opentok/api/tools/generator

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


