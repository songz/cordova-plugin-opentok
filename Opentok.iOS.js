function TBError(error){
  navigator.notification.alert(error);
};
function TBNothing(){
  console.log("TB NOTHING IS CALLED!");
};

function getPosition(divName){
  pubDiv = document.getElementById(divName);

  // Get the position of element
  var curtop = curleft = 0;
  if(pubDiv.offsetParent){
    do{
      curleft += pubDiv.offsetLeft;
      curtop += pubDiv.offsetTop;
    }while(pubDiv = pubDiv.offsetParent);
  }
  return {top:curtop, left:curleft};
};

function replaceWithObject(divName, streamId, properties){
  // Replace and add to streamsConnected
  var newId = "TBStreamConnection"+streamId;
  var oldDiv = document.getElementById(divName);
  var objDiv = document.createElement("object");
  oldDiv.parentNode.replaceChild(objDiv, oldDiv);

  // Setting object Attributes
  objDiv.id = newId;
  objDiv.style.width = properties.width+"px";
  objDiv.style.height = properties.height+"px";
  objDiv.setAttribute('streamId',streamId);
  objDiv.textContext = streamId;
  objDiv.className = 'TBstreamObject';
  return getPosition(objDiv.id);
};


/** 
 * TBSubscriber Object
 *
 */
function TBSubscriber(stream, divName, properties, env){
  console.log("JS: Subscribing");
  var width = 320, height = 240, subscribeToVideo="true";
  if(properties){
    if(properties.width){
      width = properties.width;
    }
    if(properties.height){
      height = properties.height;
    }
    if(properties.subscribeToVideo === false){
      subscribeToVideo="false";
    }
  }
  var property = {width:width, height:height};
  var position = replaceWithObject(divName, stream.streamId, property);
  Cordova.exec(TBNothing, TBError, "Tokbox", "subscribe", [stream.streamId, position.top, position.left, property.width, property.height, subscribeToVideo] );
}


/** 
 * TBPublisher Object
 *
 */
function TBPublisher(divName, properties, env){
      console.log("JS: Publish Called");
      var width = 160, height = 120, name="", publishAudio="true", publishVideo="true";
      if(properties){
        if(properties.width){
          width = properties.width;
        }
        if(properties.height){
          height = properties.height;
        }
        if(properties.name){
          name = properties.name;
        }
        if(properties.publishAudio===false){
          publishAudio="false"
        }
        if(properties.publishVideo===false){
          publishVideo="false"
        }
      }
      var pubProperties = {width:width, height:height};
      var position = replaceWithObject(divName, env.connection.connectionId, pubProperties);
      //Cordova.exec(TBNothing, TBError, "Tokbox", "publish", [position.top, position.left, pubProperties.width, pubProperties.height, name] );
      Cordova.exec(TBNothing, TBError, "Tokbox", "publish", [position.top, position.left, pubProperties.width, pubProperties.height, name, publishAudio, publishVideo] );
}


/**
 * TBSession Object
 *
 */
function TBSession(sid, production){
    var self = this;
    self.sessionId = sid;

    // production is set as strings because NSStrings are most reliable for Phonegap Plugins
    if(production){
      self.production = "true";
    }else{
      self.production="false";
    }
    // ios: InitSession creates an OTSession Object with given sessionId
    Cordova.exec(TBNothing, TBNothing, "Tokbox", "initSession", [self.sessionId, self.production] );

    this.cleanUpDom = function(){
      // Remove all dom objects:
      var objects = document.getElementsByClassName('TBstreamObject');
      for(var i = 0; i < objects.length; i++) {
        var element = objects[i];
        element.parentNode.removeChild(element);
      }
    };
    this.sessionDisconnectedHandler = function(event){
      console.log("JS: Session Disconnected Handler Called");
      self.cleanUpDom();
    };

    this.addEventListener = function(event, handler){
        console.log("JS: Add Event Listener Called");

        // Set Handlers based on Events
        // Events: sessionConnected, sessionDisconnected, streamCreated, streamDestroyed
        if(event == 'sessionConnected'){
          // Parse information returned from iOS before calling handler
          self.sessionConnectedHandler = function(event){
            self.connection = event.connection;
            // When user first connect, there are no streams in the session
            return handler(event);
          }
        }else if(event == 'streamCreated'){
          // Parse information returned from iOS before calling handler
          self.streamCreatedHandler = function(response){
            var arr = response.split(' ');
            var stream = {connection:{connectionId:arr[0]}, streamId:arr[1]};
            return handler({streams:[stream]});
          };
          // ios: After setting up function, set up listener in ios 
          Cordova.exec(self.streamCreatedHandler, TBNothing, "Tokbox", "streamCreatedHandler", [] );
        }else if(event=='sessionDisconnected'){
          self.sessionDisconnectedHandler = function(event){
            self.cleanUpDom();
            return handler(event)
          }
        }
    };

    this.connect = function(apiKey, token, properties){
        console.log("JS: Connect Called");
        self.apiKey = apiKey;
        self.token = token;
        // ios: Set up key/token, and call _session connectWithApiKey
        Cordova.exec(self.sessionConnectedHandler, TBError, "Tokbox", "connect", [self.apiKey, self.token] );

        // Housekeeping Listeners: Session needs to be removed from DOM after being created
        Cordova.exec(self.streamDisconnectedHandler, TBError, "Tokbox", "streamDisconnectedHandler", [] );
        Cordova.exec(self.sessionDisconnectedHandler, TBError, "Tokbox", "sessionDisconnectedHandler", [] );
        return;
    };

    this.disconnect = function(){
      Cordova.exec(self.sessionDisconnectedHandler, TBError, "Tokbox", "disconnect", [] );
    };

    this.publish = function(divName, properties){
      self.publisher = new TBPublisher(divName, properties, self);
      return self.publisher
    };

    this.unpublish = function(){
      var elementId = "TBStreamConnection"+self.connection.connectionId;
      var element = document.getElementById(elementId);
      if(element){
        element.parentNode.removeChild(element);
        self.updateObjects();
      }
      return Cordova.exec(TBNothing, TBError, "Tokbox", "unpublish", [] );
    };

    this.subscribe = function(stream, divName, properties){
      return new TBSubscriber(stream, divName, properties, self);
    };

    // Housekeeping:
    this.streamDisconnectedHandler = function(streamId){
      console.log("JS: Stream Disconnected Handler Executed");
      var elementId = "TBStreamConnection"+streamId;
      var element = document.getElementById(elementId);
      if(element){
        element.parentNode.removeChild(element);
        self.updateObjects();
      }
      return;
    };
    
    // When stream disconnects, this function repositions all objects
    this.updateObjects = function(){
      console.log("JS: Objects being updated");
      var objects = document.getElementsByClassName('TBstreamObject')
      for(var i=0; i<objects.length; i++ ){
        console.log("JS: Object updated");
        var streamId = objects[i].getAttribute('streamId');
        var id = objects[i].id;
        var position = getPosition(id);
        Cordova.exec(TBNothing, TBError, "Tokbox", "updateView", [streamId, position.top, position.left] );
      }
      return
    };
};

var TB = {
    initSession: function(sid, production){
      return new TBSession(sid, production);
    },
    setLogLevel: function(a){
     console.log("Log Level Set");
    },
    addEventListener: function(event, handler){
      if(event=="exception"){
        console.log("JS: TB Exception Handler added");
        Cordova.exec(handler, TBError, "Tokbox", "exceptionHandler", [] );
      }
    }
};
