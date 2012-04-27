function TBError(){
  navigator.notification.alert("Error!");
};
function TBNothing(){
  console.log("TB NOTHING IS CALLED!");
};

/**
* Function Helpers
* @param {String} divName   Id of the div
* @return {top:y, left:x}   Returns an object with position coordinates
*/
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
}


/**
* replaceWithObject  Replace input divName with object element
* @param {String}, {String} divName, connectionId   Id of the div
* @return {top:y, left:x}   Returns an object with position coordinates
*/
function replaceWithObject(divName, connectionId, properties){
  // Replace and add to streamsConnected
  var newId = "TBStreamConnection"+connectionId;
  var oldDiv = document.getElementById(divName);
  var objDiv = document.createElement("object");
  oldDiv.parentNode.replaceChild(objDiv, oldDiv);

  // Setting object Attributes
  objDiv.id = newId;
  objDiv.style.width = properties.width+"px";
  objDiv.style.height = properties.height+"px";
  objDiv.setAttribute('cid',connectionId);
  objDiv.textContext = connectionId;
  objDiv.className = 'TBstreamObject';
  return getPosition(objDiv.id);
}


/**
 * TBSession Object
 *
 */
function TBSession(){
    var self = this;

    this.connect = function(apiKey, token, properties){
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

    this.publish = function(divName, properties){
      console.log("JS: Publish Called");
      var width = 320, height = 240;
      if(properties){
        if(properties.width){
          width = properties.width;
        }
        if(properties.height){
          height = properties.height;
        }
      }
      pubProperties = {width:width, height:height};
      var position = replaceWithObject(divName, self.connection.connectionId, pubProperties);
      // Would like to pass into exec as {top:35, left:3535, width:35, height:458}
      return Cordova.exec(TBNothing, TBError, "Tokbox", "publish", [position.top, position.left, pubProperties.width, pubProperties.height] );
    };

    this.unpublish = function(){
      return Cordova.exec(TBNothing, TBError, "Tokbox", "unpublish", [] );
    };

    this.subscribe = function(stream, divName, properties){
      console.log("JS: Subscribe Called");
      var connectionId = stream.connection.connectionId; 
      var width = 320, height = 240;
      if(properties){
        if(properties.width){
          width = properties.width;
        }
        if(properties.height){
          height = properties.height;
        }
      }
      var property = {width:width, height:height};
      var position = replaceWithObject(divName, connectionId, property);
      return Cordova.exec(TBNothing, TBError, "Tokbox", "subscribe", [connectionId, position.top, position.left, property.width, property.height] );
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
