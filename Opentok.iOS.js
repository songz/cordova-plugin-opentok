function TBError(){
    navigator.notification.alert("Error!");
};
function TBNothing(){
  console.log("TB NOTHING IS CALLED!");
};

// Helper: Dom Element replace with UIView
function getPosition(divName){
  pubDiv = document.getElementById(divName);

  // Get the absolute position of element
  var curtop = curleft = 0;
  if(pubDiv.offsetParent){
    do{
      curleft += pubDiv.offsetLeft;
      curtop += pubDiv.offsetTop;
    }while(pubDiv = pubDiv.offsetParent);
  }
  return {top:curtop, left:curleft};
}

function replaceWithObject(divName, connectionId){
  // Replace and add to streamsConnected
  var newId = "TBStreamConnection"+connectionId;
  var oldDiv = document.getElementById(divName);
  var objDiv = document.createElement("object");
  oldDiv.parentNode.replaceChild(objDiv, oldDiv);
  objDiv.id = newId;
  objDiv.style.width = "330px";
  objDiv.style.height = "240px";
  objDiv.setAttribute('cid',connectionId);
  objDiv.textContext = connectionId;
  objDiv.className = 'TBstreamObject';
  return getPosition(objDiv.id);
}

function TBSession(){
    var self = this;
    self.streamsConnected = [];

    this.connect = function(apiKey, token){
        console.log("JS: Connect Called");
        self.apiKey = apiKey;
        self.token = token;
        Cordova.exec(self.sessionConnectedHandler, TBError, "Tokbox", "connect", [self.apiKey, self.token] );

        // Housekeeping Listeners
        Cordova.exec(self.streamDisconnectedHandler, TBError, "Tokbox", "streamDisconnectedHandler", [] );
        return;
    };
    this.disconnect = function(){
      Cordova.exec(self.streamDisconnectedHandler, TBError, "Tokbox", "disconnect", [] );
    };

    this.publish = function(divName){
      console.log("JS: Publish Called");
      var position = replaceWithObject(divName, self.connection.connectionId);
      return Cordova.exec(TBNothing, TBError, "Tokbox", "publish", [position.top, position.left] );
    };

    this.unpublish = function(){
      return Cordova.exec(TBNothing, TBError, "Tokbox", "unpublish", [] );
    };

    this.subscribe = function(stream, divName){
      console.log("JS: Subscribe Called");
      var connectionId = stream.connection.connectionId; 
      var position = replaceWithObject(divName, connectionId);
      self.streamsConnected.push(connectionId);
      return Cordova.exec(TBNothing, TBError, "Tokbox", "subscribe", [connectionId, position.top, position.left] );
    };

    this.addEventListener = function(event, handler){
        console.log("JS: Add Event Listener Called");

        // Set Handlers based on Events
        if(event == 'sessionConnected'){
          // Parse information returned from iOS before calling handler
          self.sessionConnectedHandler = function(response){
            self.connection = {connectionId:response};
            return handler({streams:[]});
          }
        }else if(event == 'streamCreated'){
          // Parse information returned from iOS before calling handler
          self.streamCreatedHandler = function(response){
            var arr = response.split(' ');
            var stream = {connection:{connectionId:arr[0]}, streamId:arr[1]};
            return handler({streams:[stream]});
          };
          
          // Set up Stream Created Handler: Could receive many callbacks
          Cordova.exec(self.streamCreatedHandler, TBNothing, "Tokbox", "addStreamCreatedEvent", [] );
        } 
    };

    // Housekeeping:
    this.streamDisconnectedHandler = function(connectionId){
      console.log("JS: Diconnected Handler Executed");
      var elementId = "TBStreamConnection"+connectionId;
      var element = document.getElementById(elementId);
      element.parentNode.removeChild(element);
      self.updateObjects();
      return;
    }
    
    // When stream disconnects, this function repositions all objects
    this.updateObjects = function(){
      console.log("JS: Objects being updated");
      var objects = document.getElementsByClassName('TBstreamObject')
      for(var i=0; i<objects.length; i++ ){
        console.log("JS: Object updated");
        var cid = objects[i].getAttribute('cid');
        var id = objects[i].id;
        var position = getPosition(id);
        Cordova.exec(TBNothing, TBError, "Tokbox", "updateView", [cid, position.top, position.left] );
      }
      return
    };
};

var TB = {
    initSession: function(sid){
        var result = new TBSession();
        result.sessionId = sid;
        Cordova.exec(TBNothing, TBNothing, "Tokbox", "initSession", [result.sessionId] );
        return result;
    }
};
