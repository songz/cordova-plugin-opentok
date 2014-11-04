window.OT = {
  checkSystemRequirements: function() {
    return 1;
  },
  initPublisher: function(one, two, three) {
    return new TBPublisher(one, two, three);
  },
  initSession: function(apiKey, sessionId) {
    if (sessionId == null) {
      this.showError("OT.initSession takes 2 parameters, your API Key and Session ID");
    }
    return new TBSession(apiKey, sessionId);
  },
  log: function(message) {
    return pdebug("TB LOG", message);
  },
  off: function(event, handler) {},
  on: function(event, handler) {
    if (event === "exception") {
      console.log("JS: TB Exception Handler added");
      return Cordova.exec(handler, TBError, OTPlugin, "exceptionHandler", []);
    }
  },
  setLogLevel: function(a) {
    return console.log("Log Level Set");
  },
  upgradeSystemRequirements: function() {
    return {};
  },
  updateViews: function() {
    return TBUpdateObjects();
  },
  getHelper: function() {
    if (typeof jasmine === "undefined" || !jasmine || !jasmine['getEnv']) {
      window.jasmine = {
        getEnv: function() {}
      };
    }
    this.OTHelper = this.OTHelper || OTHelpers.noConflict();
    return this.OTHelper;
  },
  showError: function(a) {
    return alert(a);
  },
  addEventListener: function(event, handler) {
    return this.on(event, handler);
  },
  removeEventListener: function(type, handler) {
    return this.off(type, handler);
  }
};

window.TB = OT;

window.addEventListener("orientationchange", (function() {
  setTimeout((function() {
    OT.updateViews();
  }), 1000);
}), false);

var TBConnection;

TBConnection = (function() {
  function TBConnection(prop) {
    this.connectionId = prop.connectionId;
    this.creationTime = prop.creationTime;
    this.data = prop.data;
    return;
  }

  TBConnection.prototype.toJSON = function() {
    return {
      connectionId: this.connectionId,
      creationTime: this.creationTime,
      data: this.data
    };
  };

  return TBConnection;

})();

var OTError;

OTError = (function() {
  var codesToTitle;

  function OTError(errCode, errMsg) {
    this.code = errCode;
    if (errMsg != null) {
      this.message = errMsg;
    } else {
      if (codesToTitle[errCode]) {
        this.message = codesToTitle[errCode];
      } else {
        this.message = "OpenTok Error";
      }
    }
  }

  codesToTitle = {
    1004: 'OTAuthorizationFailure',
    1005: 'OTErrorInvalidSession',
    1006: 'OTConnectionFailed    ',
    1011: 'OTNullOrInvalidParameter',
    1010: 'OTNotConnected ',
    1015: 'OTSessionIllegalState ',
    1503: 'OTNoMessagingServer    ',
    1023: 'OTConnectionRefused    ',
    1020: 'OTSessionStateFailed   ',
    1403: 'OTP2PSessionMaxParticipants',
    1021: 'OTSessionConnectionTimeout ',
    2000: 'OTSessionInternalError  ',
    1461: 'OTSessionInvalidSignalType',
    1413: 'OTSessionSignalDataTooLong',
    1022: 'OTConnectionDropped',
    1112: 'OTSessionSubscriberNotFound',
    1113: 'OTSessionPublisherNotFound',
    0: 'OTPublisherSuccess',
    1010: 'OTSessionDisconnected',
    2000: 'OTPublisherInternalError',
    1610: 'OTPublisherWebRTCError',
    0: 'OTSubscriberSuccess$',
    1542: 'OTConnectionTimedOut',
    1541: 'OTSubscriberSessionDisconnected',
    1600: 'OTSubscriberWebRTCError',
    1604: 'OTSubscriberServerCannotFindStream',
    2000: 'OTSubscriberInternalError'
  };

  return OTError;

})();

var TBEvent,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

TBEvent = (function() {
  function TBEvent(prop) {
    this.preventDefault = __bind(this.preventDefault, this);
    this.isDefaultPrevented = __bind(this.isDefaultPrevented, this);
    var k, v;
    for (k in prop) {
      v = prop[k];
      this[k] = v;
    }
    this.defaultPrevented = false;
    return;
  }

  TBEvent.prototype.isDefaultPrevented = function() {
    return this.defaultValue;
  };

  TBEvent.prototype.preventDefault = function() {};

  return TBEvent;

})();

var TBError, TBGenerateDomHelper, TBGetScreenRatios, TBGetZIndex, TBSuccess, TBUpdateObjects, getPosition, pdebug, replaceWithVideoStream, streamElements;

streamElements = {};

getPosition = function(divName) {
  var computedStyle, curleft, curtop, height, marginBottom, marginLeft, marginRight, marginTop, pubDiv, width;
  pubDiv = document.getElementById(divName);
  if (!pubDiv) {
    return {};
  }
  computedStyle = window.getComputedStyle ? getComputedStyle(pubDiv, null) : {};
  width = pubDiv.offsetWidth;
  height = pubDiv.offsetHeight;
  curtop = pubDiv.offsetTop;
  curleft = pubDiv.offsetLeft;
  while ((pubDiv = pubDiv.offsetParent)) {
    curleft += pubDiv.offsetLeft;
    curtop += pubDiv.offsetTop;
  }
  marginTop = parseInt(computedStyle.marginTop) || 0;
  marginBottom = parseInt(computedStyle.marginBottom) || 0;
  marginLeft = parseInt(computedStyle.marginLeft) || 0;
  marginRight = parseInt(computedStyle.marginRight) || 0;
  return {
    top: curtop + marginTop,
    left: curleft + marginLeft,
    width: width - (marginLeft + marginRight),
    height: height - (marginTop + marginBottom)
  };
};

replaceWithVideoStream = function(divName, streamId, properties) {
  var element, internalDiv, typeClass, videoElement;
  typeClass = streamId === PublisherStreamId ? PublisherTypeClass : SubscriberTypeClass;
  element = document.getElementById(divName);
  element.setAttribute("class", "OT_root " + typeClass);
  element.setAttribute("data-streamid", streamId);
  element.style.width = properties.width + "px";
  element.style.height = properties.height + "px";
  element.style.overflow = "hidden";
  element.style['background-color'] = "#000000";
  streamElements[streamId] = element;
  internalDiv = document.createElement("div");
  internalDiv.setAttribute("class", VideoContainerClass);
  internalDiv.style.width = "100%";
  internalDiv.style.height = "100%";
  internalDiv.style.left = "0px";
  internalDiv.style.top = "0px";
  videoElement = document.createElement("video");
  videoElement.style.width = "100%";
  videoElement.style.height = "100%";
  internalDiv.appendChild(videoElement);
  element.appendChild(internalDiv);
  return element;
};

TBError = function(error) {
  return navigator.notification.alert(error);
};

TBSuccess = function() {
  return console.log("success");
};

TBUpdateObjects = function() {
  var e, id, objects, position, ratios, streamId, _i, _len;
  console.log("JS: Objects being updated in TBUpdateObjects");
  objects = document.getElementsByClassName('OT_root');
  ratios = TBGetScreenRatios();
  for (_i = 0, _len = objects.length; _i < _len; _i++) {
    e = objects[_i];
    console.log("JS: Object updated");
    streamId = e.dataset.streamid;
    console.log("JS sessionId: " + streamId);
    id = e.id;
    position = getPosition(id);
    Cordova.exec(TBSuccess, TBError, OTPlugin, "updateView", [streamId, position.top, position.left, position.width, position.height, TBGetZIndex(e), ratios.widthRatio, ratios.heightRatio]);
  }
};

TBGenerateDomHelper = function() {
  var div, domId;
  domId = "PubSub" + Date.now();
  div = document.createElement('div');
  div.setAttribute('id', domId);
  document.body.appendChild(div);
  return domId;
};

TBGetZIndex = function(ele) {
  var val;
  while ((ele != null)) {
    val = document.defaultView.getComputedStyle(ele, null).getPropertyValue('z-index');
    console.log(val);
    if (parseInt(val)) {
      return val;
    }
    ele = ele.offsetParent;
  }
  return 0;
};

TBGetScreenRatios = function() {
  return {
    widthRatio: window.outerWidth / window.innerWidth,
    heightRatio: window.outerHeight / window.innerHeight
  };
};

pdebug = function(msg, data) {
  return console.log("JS Lib: " + msg + " - ", data);
};

var TBPublisher,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

TBPublisher = (function() {
  function TBPublisher(one, two, three) {
    this.removePublisherElement = __bind(this.removePublisherElement, this);
    this.streamDestroyed = __bind(this.streamDestroyed, this);
    this.streamCreated = __bind(this.streamCreated, this);
    this.eventReceived = __bind(this.eventReceived, this);
    this.setSession = __bind(this.setSession, this);
    var cameraName, height, name, position, publishAudio, publishVideo, ratios, width, zIndex, _ref, _ref1, _ref2, _ref3;
    this.sanitizeInputs(one, two, three);
    pdebug("creating publisher", {});
    position = getPosition(this.domId);
    name = "";
    publishAudio = "true";
    publishVideo = "true";
    cameraName = "front";
    zIndex = TBGetZIndex(document.getElementById(this.domId));
    ratios = TBGetScreenRatios();
    if (this.properties != null) {
      width = (_ref = this.properties.width) != null ? _ref : position.width;
      height = (_ref1 = this.properties.height) != null ? _ref1 : position.height;
      name = (_ref2 = this.properties.name) != null ? _ref2 : "";
      cameraName = (_ref3 = this.properties.cameraName) != null ? _ref3 : "front";
      if ((this.properties.publishAudio != null) && this.properties.publishAudio === false) {
        publishAudio = "false";
      }
      if ((this.properties.publishVideo != null) && this.properties.publishVideo === false) {
        publishVideo = "false";
      }
    }
    if ((width == null) || width === 0 || (height == null) || height === 0) {
      width = DefaultWidth;
      height = DefaultHeight;
    }
    this.pubElement = document.getElementById(this.domId);
    replaceWithVideoStream(this.domId, PublisherStreamId, {
      width: width,
      height: height
    });
    position = getPosition(this.domId);
    TBUpdateObjects();
    OT.getHelper().eventing(this);
    Cordova.exec(TBSuccess, TBError, OTPlugin, "initPublisher", [name, position.top, position.left, width, height, zIndex, publishAudio, publishVideo, cameraName, ratios.widthRatio, ratios.heightRatio]);
    Cordova.exec(this.eventReceived, TBSuccess, OTPlugin, "addEvent", ["publisherEvents"]);
  }

  TBPublisher.prototype.setSession = function(session) {
    return this.session = session;
  };

  TBPublisher.prototype.eventReceived = function(response) {
    pdebug("publisher event received", response);
    return this[response.eventType](response.data);
  };

  TBPublisher.prototype.streamCreated = function(event) {
    var streamEvent;
    pdebug("publisher streamCreatedHandler", event);
    pdebug("publisher streamCreatedHandler", this.session);
    pdebug("publisher streamCreatedHandler", this.session.sessionConnection);
    this.stream = new TBStream(event.stream, this.session.sessionConnection);
    streamEvent = new TBEvent({
      stream: this.stream
    });
    this.trigger("streamCreated", streamEvent);
    return this;
  };

  TBPublisher.prototype.streamDestroyed = function(event) {
    var streamEvent;
    pdebug("publisher streamDestroyed event", event);
    streamEvent = new TBEvent({
      stream: this.stream,
      reason: "clientDisconnected"
    });
    this.trigger("streamDestroyed", streamEvent);
    return this;
  };

  TBPublisher.prototype.removePublisherElement = function() {
    this.pubElement.parentNode.removeChild(this.pubElement);
    return this.pubElement = false;
  };

  TBPublisher.prototype.destroy = function() {
    if (this.pubElement) {
      return Cordova.exec(this.removePublisherElement, TBError, OTPlugin, "destroyPublisher", []);
    }
  };

  TBPublisher.prototype.getImgData = function() {
    return "";
  };

  TBPublisher.prototype.getStyle = function() {
    return {};
  };

  TBPublisher.prototype.publishAudio = function(state) {
    this.publishMedia("publishAudio", state);
    return this;
  };

  TBPublisher.prototype.publishVideo = function(state) {
    this.publishMedia("publishVideo", state);
    return this;
  };

  TBPublisher.prototype.setCameraPosition = function(cameraPosition) {
    pdebug("setting camera position", {
      cameraPosition: cameraPosition
    });
    Cordova.exec(TBSuccess, TBError, OTPlugin, "setCameraPosition", [cameraPosition]);
    return this;
  };

  TBPublisher.prototype.setStyle = function(style, value) {
    return this;
  };

  TBPublisher.prototype.publishMedia = function(media, state) {
    var publishState;
    if (media !== "publishAudio" && media !== "publishVideo") {
      return;
    }
    publishState = "true";
    if ((state != null) && (state === false || state === "false")) {
      publishState = "false";
    }
    pdebug("setting publishstate", {
      media: media,
      publishState: publishState
    });
    return Cordova.exec(TBSuccess, TBError, OTPlugin, media, [publishState]);
  };

  TBPublisher.prototype.sanitizeInputs = function(one, two, three) {
    var position;
    if ((three != null)) {
      this.apiKey = one;
      this.domId = two;
      this.properties = three;
    } else if ((two != null)) {
      if (typeof two === "object") {
        this.properties = two;
        if (document.getElementById(one)) {
          this.domId = one;
        } else {
          this.apiKey = one;
        }
      } else {
        this.apiKey = one;
        this.domId = two;
      }
    } else if ((one != null)) {
      if (typeof one === "object") {
        this.properties = one;
      } else if (document.getElementById(one)) {
        this.domId = one;
      }
    }
    this.apiKey = this.apiKey != null ? this.apiKey : "";
    this.properties = this.properties && typeof (this.properties === "object") ? this.properties : {};
    if (this.domId && document.getElementById(this.domId)) {
      if (!this.properties.width || !this.properties.height) {
        console.log("domId exists but properties width or height is not specified");
        position = getPosition(this.domId);
        console.log(" width: " + position.width + " and height: " + position.height + " for domId " + this.domId + ", and top: " + position.top + ", left: " + position.left);
        if (position.width > 0 && position.height > 0) {
          this.properties.width = position.width;
          this.properties.height = position.height;
        }
      }
    } else {
      this.domId = TBGenerateDomHelper();
    }
    this.domId = this.domId && document.getElementById(this.domId) ? this.domId : TBGenerateDomHelper();
    return this.apiKey = this.apiKey.toString();
  };

  return TBPublisher;

})();

var TBSession,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

TBSession = (function() {
  TBSession.prototype.connect = function(token, connectCompletionCallback) {
    this.token = token;
    if (typeof connectCompletionCallback !== "function" && (connectCompletionCallback != null)) {
      TB.showError("Session.connect() takes a token and an optional completionHandler");
      return;
    }
    if ((connectCompletionCallback != null)) {
      this.on('sessionConnected', connectCompletionCallback);
    }
    Cordova.exec(this.eventReceived, TBError, OTPlugin, "addEvent", ["sessionEvents"]);
    Cordova.exec(TBSuccess, TBError, OTPlugin, "connect", [this.token]);
  };

  TBSession.prototype.disconnect = function() {
    return Cordova.exec(TBSuccess, TBError, OTPlugin, "disconnect", []);
  };

  TBSession.prototype.forceDisconnect = function(connection) {
    return this;
  };

  TBSession.prototype.forceUnpublish = function(stream) {
    return this;
  };

  TBSession.prototype.getPublisherForStream = function(stream) {
    return this;
  };

  TBSession.prototype.getSubscribersForStream = function(stream) {
    return this;
  };

  TBSession.prototype.publish = function(divName, properties) {
    if (this.alreadyPublishing) {
      pdebug("Session is already publishing", {});
      return;
    }
    this.alreadyPublishing = true;
    this.publisher = new TBPublisher(divName, properties);
    return this.publish(this.publisher);
  };

  TBSession.prototype.publish = function() {
    if (this.alreadyPublishing) {
      pdebug("Session is already publishing", {});
      return;
    }
    this.alreadyPublishing = true;
    if (typeof arguments[0] === "object") {
      this.publisher = arguments[0];
    } else {
      this.publisher = OT.initPublisher(arguments);
    }
    this.publisher.setSession(this);
    Cordova.exec(TBSuccess, TBError, OTPlugin, "publish", []);
    return this.publisher;
  };

  TBSession.prototype.signal = function(signal, signalCompletionHandler) {
    var data, to, type;
    type = signal.type != null ? signal.type : "";
    data = signal.data != null ? signal.data : "";
    to = signal.to != null ? signal.to : "";
    to = typeof to === "string" ? to : to.connectionId;
    Cordova.exec(TBSuccess, TBError, OTPlugin, "signal", [type, data, to]);
    return this;
  };

  TBSession.prototype.subscribe = function(one, two, three, four) {
    var domId, subscriber;
    this.subscriberCallbacks = {};
    if ((four != null)) {
      subscriber = new TBSubscriber(one, two, three);
      this.subscriberCallbacks[one.streamId] = four;
      return subscriber;
    }
    if ((three != null)) {
      if ((typeof two === "string" || two.nodeType === 1) && typeof three === "object") {
        console.log("stream, domId, props");
        subscriber = new TBSubscriber(one, two, three);
        return subscriber;
      }
      if ((typeof two === "string" || two.nodeType === 1) && typeof three === "function") {
        console.log("stream, domId, completionHandler");
        this.subscriberCallbacks[one.streamId] = three;
        subscriber = new TBSubscriber(one, domId, {});
        return subscriber;
      }
      if (typeof two === "object" && typeof three === "function") {
        console.log("stream, props, completionHandler");
        this.subscriberCallbacks[one.streamId] = three;
        domId = TBGenerateDomHelper();
        subscriber = new TBSubscriber(one, domId, two);
        return subscriber;
      }
    }
    if ((two != null)) {
      if (typeof two === "string" || two.nodeType === 1) {
        subscriber = new TBSubscriber(one, two, {});
        return subscriber;
      }
      if (typeof two === "object") {
        domId = TBGenerateDomHelper();
        subscriber = new TBSubscriber(one, domId, two);
        return subscriber;
      }
      if (typeof two === "function") {
        this.subscriberCallbacks[one.streamId] = two;
        domId = TBGenerateDomHelper();
        subscriber = new TBSubscriber(one, domId, {});
        return subscriber;
      }
    }
    domId = TBGenerateDomHelper();
    subscriber = new TBSubscriber(one, domId, {});
    return subscriber;
  };

  TBSession.prototype.unpublish = function() {
    var element;
    this.alreadyPublishing = false;
    console.log("JS: Unpublish");
    element = document.getElementById(this.publisher.domId);
    if (element) {
      element.parentNode.removeChild(element);
      TBUpdateObjects();
    }
    return Cordova.exec(TBSuccess, TBError, OTPlugin, "unpublish", []);
  };

  TBSession.prototype.unsubscribe = function(subscriber) {
    var element, elementId;
    console.log("JS: Unsubscribe");
    elementId = subscriber.streamId;
    element = document.getElementById("TBStreamConnection" + elementId);
    console.log("JS: Unsubscribing");
    element = streamElements[elementId];
    if (element) {
      element.parentNode.removeChild(element);
      delete streamElements[streamId];
      TBUpdateObjects();
    }
    return Cordova.exec(TBSuccess, TBError, OTPlugin, "unsubscribe", [subscriber.streamId]);
  };

  function TBSession(apiKey, sessionId) {
    this.apiKey = apiKey;
    this.sessionId = sessionId;
    this.signalReceived = __bind(this.signalReceived, this);
    this.subscribedToStream = __bind(this.subscribedToStream, this);
    this.streamDestroyed = __bind(this.streamDestroyed, this);
    this.streamCreated = __bind(this.streamCreated, this);
    this.sessionDisconnected = __bind(this.sessionDisconnected, this);
    this.sessionConnected = __bind(this.sessionConnected, this);
    this.connectionDestroyed = __bind(this.connectionDestroyed, this);
    this.connectionCreated = __bind(this.connectionCreated, this);
    this.eventReceived = __bind(this.eventReceived, this);
    this.publish = __bind(this.publish, this);
    this.publish = __bind(this.publish, this);
    this.apiKey = this.apiKey.toString();
    this.connections = {};
    this.streams = {};
    this.alreadyPublishing = false;
    OT.getHelper().eventing(this);
    Cordova.exec(TBSuccess, TBSuccess, OTPlugin, "initSession", [this.apiKey, this.sessionId]);
  }

  TBSession.prototype.cleanUpDom = function() {
    var e, objects, _results;
    objects = document.getElementsByClassName('OT_root');
    _results = [];
    while (objects.length > 0) {
      e = objects[0];
      if (e && e.parentNode && e.parentNode.removeChild) {
        e.parentNode.removeChild(e);
      }
      _results.push(objects = document.getElementsByClassName('OT_root'));
    }
    return _results;
  };

  TBSession.prototype.eventReceived = function(response) {
    pdebug("session event received", response);
    return this[response.eventType](response.data);
  };

  TBSession.prototype.connectionCreated = function(event) {
    var connection, connectionEvent;
    connection = new TBConnection(event.connection);
    connectionEvent = new TBEvent({
      connection: connection
    });
    this.connections[connection.connectionId] = connection;
    this.trigger("connectionCreated", connectionEvent);
    return this;
  };

  TBSession.prototype.connectionDestroyed = function(event) {
    var connection, connectionEvent;
    pdebug("connectionDestroyedHandler", event);
    connection = this.connections[event.connection.connectionId];
    connectionEvent = new TBEvent({
      connection: connection,
      reason: "clientDisconnected"
    });
    this.trigger("connectionDestroyed", connectionEvent);
    delete this.connections[connection.connectionId];
    return this;
  };

  TBSession.prototype.sessionConnected = function(event) {
    pdebug("sessionConnectedHandler", event);
    this.trigger("sessionConnected");
    this.connection = new TBConnection(event.connection);
    this.connections[event.connection.connectionId] = this.connection;
    event = null;
    return this;
  };

  TBSession.prototype.sessionDisconnected = function(event) {
    var sessionDisconnectedEvent;
    pdebug("sessionDisconnected event", event);
    this.alreadyPublishing = false;
    sessionDisconnectedEvent = new TBEvent({
      reason: event.reason
    });
    this.trigger("sessionDisconnected", sessionDisconnectedEvent);
    this.cleanUpDom();
    return this;
  };

  TBSession.prototype.streamCreated = function(event) {
    var stream, streamEvent;
    pdebug("streamCreatedHandler", event);
    stream = new TBStream(event.stream, this.connections[event.stream.connectionId]);
    this.streams[stream.streamId] = stream;
    streamEvent = new TBEvent({
      stream: stream
    });
    this.trigger("streamCreated", streamEvent);
    return this;
  };

  TBSession.prototype.streamDestroyed = function(event) {
    var element, stream, streamEvent;
    pdebug("streamDestroyed event", event);
    stream = this.streams[event.stream.streamId];
    streamEvent = new TBEvent({
      stream: stream,
      reason: "clientDisconnected"
    });
    this.trigger("streamDestroyed", streamEvent);
    if (stream) {
      element = streamElements[stream.streamId];
      if (element) {
        element.parentNode.removeChild(element);
        delete streamElements[stream.streamId];
        TBUpdateObjects();
      }
      delete this.streams[stream.streamId];
    }
    return this;
  };

  TBSession.prototype.subscribedToStream = function(event) {
    var callbackFunc, error, streamId;
    streamId = event.streamId;
    callbackFunc = this.subscriberCallbacks[streamId];
    if (callbackFunc == null) {
      return;
    }
    if (event.errorCode != null) {
      error = new OTError(event.errorCode);
      callbackFunc(error);
    } else {
      callbackFunc();
    }
  };

  TBSession.prototype.signalReceived = function(event) {
    var streamEvent;
    pdebug("signalReceived event", event);
    streamEvent = new TBEvent({
      type: event.type,
      data: event.data,
      from: this.connections[event.connectionId]
    });
    this.trigger("signal", streamEvent);
    return this.trigger("signal:" + event.type, streamEvent);
  };

  TBSession.prototype.addEventListener = function(event, handler) {
    this.on(event, handler);
    return this;
  };

  TBSession.prototype.removeEventListener = function(event, handler) {
    this.off(event, handler);
    return this;
  };

  return TBSession;

})();

var TBStream;

TBStream = (function() {
  function TBStream(prop, connection) {
    var k, v;
    this.connection = connection;
    for (k in prop) {
      v = prop[k];
      this[k] = v;
    }
    this.videoDimensions = {
      width: 0,
      height: 0
    };
  }

  return TBStream;

})();

var TBSubscriber;

TBSubscriber = (function() {
  TBSubscriber.prototype.getAudioVolume = function() {
    return 0;
  };

  TBSubscriber.prototype.getImgData = function() {
    return "";
  };

  TBSubscriber.prototype.getStyle = function() {
    return {};
  };

  TBSubscriber.prototype.off = function(event, handler) {
    return this;
  };

  TBSubscriber.prototype.on = function(event, handler) {
    return this;
  };

  TBSubscriber.prototype.setAudioVolume = function(value) {
    return this;
  };

  TBSubscriber.prototype.setStyle = function(style, value) {
    return this;
  };

  TBSubscriber.prototype.subscribeToAudio = function(value) {
    return this;
  };

  TBSubscriber.prototype.subscribeToVideo = function(value) {
    return this;
  };

  function TBSubscriber(stream, divName, properties) {
    var divPosition, element, height, name, obj, position, ratios, subscribeToAudio, subscribeToVideo, width, zIndex, _ref;
    element = document.getElementById(divName);
    pdebug("creating subscriber", properties);
    this.streamId = stream.streamId;
    if ((properties != null) && properties.width === "100%" && properties.height === "100%") {
      element.style.width = "100%";
      element.style.height = "100%";
      properties.width = "";
      properties.height = "";
    }
    divPosition = getPosition(divName);
    subscribeToVideo = "true";
    zIndex = TBGetZIndex(element);
    if ((properties != null)) {
      width = properties.width || divPosition.width;
      height = properties.height || divPosition.height;
      name = (_ref = properties.name) != null ? _ref : "";
      subscribeToVideo = "true";
      subscribeToAudio = "true";
      if ((properties.subscribeToVideo != null) && properties.subscribeToVideo === false) {
        subscribeToVideo = "false";
      }
      if ((properties.subscribeToAudio != null) && properties.subscribeToAudio === false) {
        subscribeToAudio = "false";
      }
    }
    if ((width == null) || width === 0 || (height == null) || height === 0) {
      width = DefaultWidth;
      height = DefaultHeight;
    }
    obj = replaceWithVideoStream(divName, stream.streamId, {
      width: width,
      height: height
    });
    position = getPosition(obj.id);
    ratios = TBGetScreenRatios();
    pdebug("final subscriber position", position);
    Cordova.exec(TBSuccess, TBError, OTPlugin, "subscribe", [stream.streamId, position.top, position.left, width, height, zIndex, subscribeToAudio, subscribeToVideo, ratios.widthRatio, ratios.heightRatio]);
  }

  TBSubscriber.prototype.removeEventListener = function(event, listener) {
    return this;
  };

  return TBSubscriber;

})();

var DefaultHeight, DefaultWidth, OTPlugin, PublisherStreamId, PublisherTypeClass, StringSplitter, SubscriberTypeClass, VideoContainerClass;

OTPlugin = "OpenTokPlugin";

PublisherStreamId = "TBPublisher";

PublisherTypeClass = "OT_publisher";

SubscriberTypeClass = "OT_subscriber";

VideoContainerClass = "OT_video-container";

StringSplitter = "$2#9$";

DefaultWidth = 264;

DefaultHeight = 198;
;/**
 * @license  Common JS Helpers on OpenTok 0.2.0 1f056b9 master
 * http://www.tokbox.com/
 *
 * Copyright (c) 2014 TokBox, Inc.
 *
 * Date: May 23 06:20:46 2014
 *
 */

// OT Helper Methods
//
// helpers.js                           <- the root file
// helpers/lib/{helper topic}.js        <- specialised helpers for specific tasks/topics
//                                          (i.e. video, dom, etc)
//
// @example Getting a DOM element by it's id
//  var element = OTHelpers('domId');
//
// @example Testing for web socket support
//  if (OT.supportsWebSockets()) {
//      // do some stuff with websockets
//  }
//

/*jshint browser:true, smarttabs:true*/

!(function(window, undefined) {


  var OTHelpers = function(domId) {
    return document.getElementById(domId);
  };

  var previousOTHelpers = window.OTHelpers;

  window.OTHelpers = OTHelpers;

  OTHelpers.keys = Object.keys || function(object) {
    var keys = [], hasOwnProperty = Object.prototype.hasOwnProperty;
    for(var key in object) {
      if(hasOwnProperty.call(object, key)) {
        keys.push(key);
      }
    }
    return keys;
  };

  var _each = Array.prototype.forEach || function(iter, ctx) {
    for(var idx = 0, count = this.length || 0; idx < count; ++idx) {
      if(idx in this) {
        iter.call(ctx, this[idx], idx);
      }
    }
  };

  OTHelpers.forEach = function(array, iter, ctx) {
    return _each.call(array, iter, ctx);
  };

  var _map = Array.prototype.map || function(iter, ctx) {
    var collect = [];
    _each.call(this, function(item, idx) {
      collect.push(iter.call(ctx, item, idx));
    });
    return collect;
  };

  OTHelpers.map = function(array, iter) {
    return _map.call(array, iter);
  };

  var _filter = Array.prototype.filter || function(iter, ctx) {
    var collect = [];
    _each.call(this, function(item, idx) {
      if(iter.call(ctx, item, idx)) {
        collect.push(item);
      }
    });
    return collect;
  };

  OTHelpers.filter = function(array, iter, ctx) {
    return _filter.call(array, iter, ctx);
  };

  var _some = Array.prototype.some || function(iter, ctx) {
    var any = false;
    for(var idx = 0, count = this.length || 0; idx < count; ++idx) {
      if(idx in this) {
        if(iter.call(ctx, this[idx], idx)) {
          any = true;
          break;
        }
      }
    }
    return any;
  };

  OTHelpers.some = function(array, iter, ctx) {
    return _some.call(array, iter, ctx);
  };

  var _indexOf = Array.prototype.indexOf || function(searchElement, fromIndex) {
    var i,
        pivot = (fromIndex) ? fromIndex : 0,
        length;

    if (!this) {
      throw new TypeError();
    }

    length = this.length;

    if (length === 0 || pivot >= length) {
      return -1;
    }

    if (pivot < 0) {
      pivot = length - Math.abs(pivot);
    }

    for (i = pivot; i < length; i++) {
      if (this[i] === searchElement) {
        return i;
      }
    }
    return -1;
  };

  OTHelpers.arrayIndexOf = function(array, searchElement, fromIndex) {
    return _indexOf.call(array, searchElement, fromIndex);
  };

  var _bind = Function.prototype.bind || function() {
    var args = Array.prototype.slice.call(arguments),
        ctx = args.shift(),
        fn = this;
    return function() {
      return fn.apply(ctx, args.concat(Array.prototype.slice.call(arguments)));
    };
  };

  OTHelpers.bind = function() {
    var args = Array.prototype.slice.call(arguments),
        fn = args.shift();
    return _bind.apply(fn, args);
  };

  var _trim = String.prototype.trim || function() {
    return this.replace(/^\s+|\s+$/g, '');
  };

  OTHelpers.trim = function(str) {
    return _trim.call(str);
  };

  OTHelpers.noConflict = function() {
    OTHelpers.noConflict = function() {
      return OTHelpers;
    };
    window.OTHelpers = previousOTHelpers;
    return OTHelpers;
  };

  OTHelpers.isNone = function(obj) {
    return obj === undefined || obj === null;
  };

  OTHelpers.isObject = function(obj) {
    return obj === Object(obj);
  };

  OTHelpers.isFunction = function(obj) {
    return !!obj && (obj.toString().indexOf('()') !== -1 ||
      Object.prototype.toString.call(obj) === '[object Function]');
  };

  OTHelpers.isArray = OTHelpers.isFunction(Array.isArray) && Array.isArray ||
    function (vArg) {
      return Object.prototype.toString.call(vArg) === '[object Array]';
    };

  OTHelpers.isEmpty = function(obj) {
    if (obj === null || obj === undefined) return true;
    if (OTHelpers.isArray(obj) || typeof(obj) === 'string') return obj.length === 0;

    // Objects without enumerable owned properties are empty.
    for (var key in obj) {
      if (obj.hasOwnProperty(key)) return false;
    }

    return true;
  };

// Extend a target object with the properties from one or
// more source objects
//
// @example:
//    dest = OTHelpers.extend(dest, source1, source2, source3);
//
  OTHelpers.extend = function(/* dest, source1[, source2, ..., , sourceN]*/) {
    var sources = Array.prototype.slice.call(arguments),
        dest = sources.shift();

    OTHelpers.forEach(sources, function(source) {
      for (var key in source) {
        dest[key] = source[key];
      }
    });

    return dest;
  };

// Ensures that the target object contains certain defaults.
//
// @example
//   var options = OTHelpers.defaults(options, {
//     loading: true     // loading by default
//   });
//
  OTHelpers.defaults = function(/* dest, defaults1[, defaults2, ..., , defaultsN]*/) {
    var sources = Array.prototype.slice.call(arguments),
        dest = sources.shift();

    OTHelpers.forEach(sources, function(source) {
      for (var key in source) {
        if (dest[key] === void 0) dest[key] = source[key];
      }
    });

    return dest;
  };

  OTHelpers.clone = function(obj) {
    if (!OTHelpers.isObject(obj)) return obj;
    return OTHelpers.isArray(obj) ? obj.slice() : OTHelpers.extend({}, obj);
  };



// Handy do nothing function
  OTHelpers.noop = function() {};

// Returns true if the client supports WebSockets, false otherwise.
  OTHelpers.supportsWebSockets = function() {
    return 'WebSocket' in window;
  };

// Returns the number of millisceonds since the the UNIX epoch, this is functionally
// equivalent to executing new Date().getTime().
//
// Where available, we use 'performance.now' which is more accurate and reliable,
// otherwise we default to new Date().getTime().
  OTHelpers.now = (function() {
    var performance = window.performance || {},
        navigationStart,
        now =  performance.now       ||
               performance.mozNow    ||
               performance.msNow     ||
               performance.oNow      ||
               performance.webkitNow;

    if (now) {
      now = OTHelpers.bind(now, performance);
      navigationStart = performance.timing.navigationStart;

      return  function() { return navigationStart + now(); };
    } else {
      return function() { return new Date().getTime(); };
    }
  })();

  var _browser = function() {
    var userAgent = window.navigator.userAgent.toLowerCase(),
        appName = window.navigator.appName,
        navigatorVendor,
        browser = 'unknown',
        version = -1;

    if (userAgent.indexOf('opera') > -1 || userAgent.indexOf('opr') > -1) {
      browser = 'Opera';

      if (/opr\/([0-9]{1,}[\.0-9]{0,})/.exec(userAgent) !== null) {
        version = parseFloat( RegExp.$1 );
      }

    } else if (userAgent.indexOf('firefox') > -1)   {
      browser = 'Firefox';

      if (/firefox\/([0-9]{1,}[\.0-9]{0,})/.exec(userAgent) !== null) {
        version = parseFloat( RegExp.$1 );
      }

    } else if (appName === 'Microsoft Internet Explorer') {
      // IE 10 and below
      browser = 'IE';

      if (/msie ([0-9]{1,}[\.0-9]{0,})/.exec(userAgent) !== null) {
        version = parseFloat( RegExp.$1 );
      }

    } else if (appName === 'Netscape' && userAgent.indexOf('trident') > -1) {
      // IE 11+

      browser = 'IE';

      if (/trident\/.*rv:([0-9]{1,}[\.0-9]{0,})/.exec(userAgent) !== null) {
        version = parseFloat( RegExp.$1 );
      }

    } else if (userAgent.indexOf('chrome') > -1) {
      browser = 'Chrome';

      if (/chrome\/([0-9]{1,}[\.0-9]{0,})/.exec(userAgent) !== null) {
        version = parseFloat( RegExp.$1 );
      }

    } else if ((navigatorVendor = window.navigator.vendor) &&
      navigatorVendor.toLowerCase().indexOf('apple') > -1) {
      browser = 'Safari';

      if (/version\/([0-9]{1,}[\.0-9]{0,})/.exec(userAgent) !== null) {
        version = parseFloat( RegExp.$1 );
      }
    }

    return {
      browser: browser,
      version: version,
      iframeNeedsLoad: userAgent.indexOf('webkit') < 0
    };
  }();

  OTHelpers.browser = function() {
    return _browser.browser;
  };

  OTHelpers.browserVersion = function() {
    return _browser;
  };


  OTHelpers.canDefineProperty = true;

  try {
    Object.defineProperty({}, 'x', {});
  } catch (err) {
    OTHelpers.canDefineProperty = false;
  }

// A helper for defining a number of getters at once.
//
// @example: from inside an object
//   OTHelpers.defineGetters(this, {
//     apiKey: function() { return _apiKey; },
//     token: function() { return _token; },
//     connected: function() { return this.is('connected'); },
//     capabilities: function() { return _socket.capabilities; },
//     sessionId: function() { return _sessionId; },
//     id: function() { return _sessionId; }
//   });
//
  OTHelpers.defineGetters = function(self, getters, enumerable) {
    var propsDefinition = {};

    if (enumerable === void 0) enumerable = false;

    for (var key in getters) {
      propsDefinition[key] = {
        get: getters[key],
        enumerable: enumerable
      };
    }

    OTHelpers.defineProperties(self, propsDefinition);
  };

  var generatePropertyFunction = function(object, getter, setter) {
    if(getter && !setter) {
      return function() {
        return getter.call(object);
      };
    } else if(getter && setter) {
      return function(value) {
        if(value !== void 0) {
          setter.call(object, value);
        }
        return getter.call(object);
      };
    } else {
      return function(value) {
        if(value !== void 0) {
          setter.call(object, value);
        }
      };
    }
  };

  OTHelpers.defineProperties = function(object, getterSetters) {
    for (var key in getterSetters) {
      object[key] = generatePropertyFunction(object, getterSetters[key].get,
        getterSetters[key].set);
    }
  };


// Polyfill Object.create for IE8
//
// See https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Object/create
//
  if (!Object.create) {
    Object.create = function (o) {
      if (arguments.length > 1) {
        throw new Error('Object.create implementation only accepts the first parameter.');
      }
      function F() {}
      F.prototype = o;
      return new F();
    };
  }

  OTHelpers.setCookie = function(key, value) {
    try {
      localStorage.setItem(key, value);
    } catch (err) {
      // Store in browser cookie
      var date = new Date();
      date.setTime(date.getTime()+(365*24*60*60*1000));
      var expires = '; expires=' + date.toGMTString();
      document.cookie = key + '=' + value + expires + '; path=/';
    }
  };

  OTHelpers.getCookie = function(key) {
    var value;

    try {
      value = localStorage.getItem('opentok_client_id');
      return value;
    } catch (err) {
      // Check browser cookies
      var nameEQ = key + '=';
      var ca = document.cookie.split(';');
      for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0) === ' ') {
          c = c.substring(1,c.length);
        }
        if (c.indexOf(nameEQ) === 0) {
          value = c.substring(nameEQ.length,c.length);
        }
      }

      if (value) {
        return value;
      }
    }

    return null;
  };


// These next bits are included from Underscore.js. The original copyright
// notice is below.
//
// http://underscorejs.org
// (c) 2009-2011 Jeremy Ashkenas, DocumentCloud Inc.
// (c) 2011-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
// Underscore may be freely distributed under the MIT license.

  // Invert the keys and values of an object. The values must be serializable.
  OTHelpers.invert = function(obj) {
    var result = {};
    for (var key in obj) if (obj.hasOwnProperty(key)) result[obj[key]] = key;
    return result;
  };


  // List of HTML entities for escaping.
  var entityMap = {
    escape: {
      '&':  '&amp;',
      '<':  '&lt;',
      '>':  '&gt;',
      '"':  '&quot;',
      '\'': '&#x27;',
      '/':  '&#x2F;'
    }
  };

  entityMap.unescape = OTHelpers.invert(entityMap.escape);

  // Regexes containing the keys and values listed immediately above.
  var entityRegexes = {
    escape:   new RegExp('[' + OTHelpers.keys(entityMap.escape).join('') + ']', 'g'),
    unescape: new RegExp('(' + OTHelpers.keys(entityMap.unescape).join('|') + ')', 'g')
  };

  // Functions for escaping and unescaping strings to/from HTML interpolation.
  OTHelpers.forEach(['escape', 'unescape'], function(method) {
    OTHelpers[method] = function(string) {
      if (string === null || string === undefined) return '';
      return ('' + string).replace(entityRegexes[method], function(match) {
        return entityMap[method][match];
      });
    };
  });

// By default, Underscore uses ERB-style template delimiters, change the
// following template settings to use alternative delimiters.
  OTHelpers.templateSettings = {
    evaluate    : /<%([\s\S]+?)%>/g,
    interpolate : /<%=([\s\S]+?)%>/g,
    escape      : /<%-([\s\S]+?)%>/g
  };

// When customizing `templateSettings`, if you don't want to define an
// interpolation, evaluation or escaping regex, we need one that is
// guaranteed not to match.
  var noMatch = /(.)^/;

// Certain characters need to be escaped so that they can be put into a
// string literal.
  var escapes = {
    '\'':     '\'',
    '\\':     '\\',
    '\r':     'r',
    '\n':     'n',
    '\t':     't',
    '\u2028': 'u2028',
    '\u2029': 'u2029'
  };

  var escaper = /\\|'|\r|\n|\t|\u2028|\u2029/g;

// JavaScript micro-templating, similar to John Resig's implementation.
// Underscore templating handles arbitrary delimiters, preserves whitespace,
// and correctly escapes quotes within interpolated code.
  OTHelpers.template = function(text, data, settings) {
    var render;
    settings = OTHelpers.defaults({}, settings, OTHelpers.templateSettings);

    // Combine delimiters into one regular expression via alternation.
    var matcher = new RegExp([
      (settings.escape || noMatch).source,
      (settings.interpolate || noMatch).source,
      (settings.evaluate || noMatch).source
    ].join('|') + '|$', 'g');

    // Compile the template source, escaping string literals appropriately.
    var index = 0;
    var source = '__p+=\'';
    text.replace(matcher, function(match, escape, interpolate, evaluate, offset) {
      source += text.slice(index, offset)
        .replace(escaper, function(match) { return '\\' + escapes[match]; });

      if (escape) {
        source += '\'+\n((__t=(' + escape + '))==null?\'\':OTHelpers.escape(__t))+\n\'';
      }
      if (interpolate) {
        source += '\'+\n((__t=(' + interpolate + '))==null?\'\':__t)+\n\'';
      }
      if (evaluate) {
        source += '\';\n' + evaluate + '\n__p+=\'';
      }
      index = offset + match.length;
      return match;
    });
    source += '\';\n';

    // If a variable is not specified, place data values in local scope.
    if (!settings.variable) source = 'with(obj||{}){\n' + source + '}\n';

    source = 'var __t,__p=\'\',__j=Array.prototype.join,' +
      'print=function(){__p+=__j.call(arguments,\'\');};\n' +
      source + 'return __p;\n';

    try {
      // evil is necessary for the new Function line
      /*jshint evil:true */
      render = new Function(settings.variable || 'obj', source);
    } catch (e) {
      e.source = source;
      throw e;
    }

    if (data) return render(data);
    var template = function(data) {
      return render.call(this, data);
    };

    // Provide the compiled function source as a convenience for precompilation.
    template.source = 'function(' + (settings.variable || 'obj') + '){\n' + source + '}';

    return template;
  };

})(window);

/*jshint browser:true, smarttabs:true*/

// tb_require('../../helpers.js')

(function(window, OTHelpers, undefined) {

  OTHelpers.statable = function(self, possibleStates, initialState, stateChanged,
    stateChangedFailed) {
    var previousState,
        currentState = self.currentState = initialState;

    var setState = function(state) {
      if (currentState !== state) {
        if (OTHelpers.arrayIndexOf(possibleStates, state) === -1) {
          if (stateChangedFailed && OTHelpers.isFunction(stateChangedFailed)) {
            stateChangedFailed('invalidState', state);
          }
          return;
        }

        self.previousState = previousState = currentState;
        self.currentState = currentState = state;
        if (stateChanged && OTHelpers.isFunction(stateChanged)) stateChanged(state, previousState);
      }
    };


    // Returns a number of states and returns true if the current state
    // is any of them.
    //
    // @example
    // if (this.is('connecting', 'connected')) {
    //   // do some stuff
    // }
    //
    self.is = function (/* state0:String, state1:String, ..., stateN:String */) {
      return OTHelpers.arrayIndexOf(arguments, currentState) !== -1;
    };


    // Returns a number of states and returns true if the current state
    // is none of them.
    //
    // @example
    // if (this.isNot('connecting', 'connected')) {
    //   // do some stuff
    // }
    //
    self.isNot = function (/* state0:String, state1:String, ..., stateN:String */) {
      return OTHelpers.arrayIndexOf(arguments, currentState) === -1;
    };

    return setState;
  };

})(window, window.OTHelpers);

/*!
 *  This is a modified version of Robert Kieffer awesome uuid.js library.
 *  The only modifications we've made are to remove the Node.js specific
 *  parts of the code and the UUID version 1 generator (which we don't
 *  use). The original copyright notice is below.
 *
 *     node-uuid/uuid.js
 *
 *     Copyright (c) 2010 Robert Kieffer
 *     Dual licensed under the MIT and GPL licenses.
 *     Documentation and details at https://github.com/broofa/node-uuid
 */
// tb_require('../helpers.js')

/*global crypto:true, Uint32Array:true, Buffer:true */
/*jshint browser:true, smarttabs:true*/

(function(window, OTHelpers, undefined) {

  // Unique ID creation requires a high quality random # generator, but
  // Math.random() does not guarantee "cryptographic quality".  So we feature
  // detect for more robust APIs, normalizing each method to return 128-bits
  // (16 bytes) of random data.
  var mathRNG, whatwgRNG;

  // Math.random()-based RNG.  All platforms, very fast, unknown quality
  var _rndBytes = new Array(16);
  mathRNG = function() {
    var r, b = _rndBytes, i = 0;

    for (i = 0; i < 16; i++) {
      if ((i & 0x03) === 0) r = Math.random() * 0x100000000;
      b[i] = r >>> ((i & 0x03) << 3) & 0xff;
    }

    return b;
  };

  // WHATWG crypto-based RNG - http://wiki.whatwg.org/wiki/Crypto
  // WebKit only (currently), moderately fast, high quality
  if (window.crypto && crypto.getRandomValues) {
    var _rnds = new Uint32Array(4);
    whatwgRNG = function() {
      crypto.getRandomValues(_rnds);

      for (var c = 0 ; c < 16; c++) {
        _rndBytes[c] = _rnds[c >> 2] >>> ((c & 0x03) * 8) & 0xff;
      }
      return _rndBytes;
    };
  }

  // Select RNG with best quality
  var _rng = whatwgRNG || mathRNG;

  // Buffer class to use
  var BufferClass = typeof(Buffer) == 'function' ? Buffer : Array;

  // Maps for number <-> hex string conversion
  var _byteToHex = [];
  var _hexToByte = {};
  for (var i = 0; i < 256; i++) {
    _byteToHex[i] = (i + 0x100).toString(16).substr(1);
    _hexToByte[_byteToHex[i]] = i;
  }

  // **`parse()` - Parse a UUID into it's component bytes**
  function parse(s, buf, offset) {
    var i = (buf && offset) || 0, ii = 0;

    buf = buf || [];
    s.toLowerCase().replace(/[0-9a-f]{2}/g, function(oct) {
      if (ii < 16) { // Don't overflow!
        buf[i + ii++] = _hexToByte[oct];
      }
    });

    // Zero out remaining bytes if string was short
    while (ii < 16) {
      buf[i + ii++] = 0;
    }

    return buf;
  }

  // **`unparse()` - Convert UUID byte array (ala parse()) into a string**
  function unparse(buf, offset) {
    var i = offset || 0, bth = _byteToHex;
    return  bth[buf[i++]] + bth[buf[i++]] +
            bth[buf[i++]] + bth[buf[i++]] + '-' +
            bth[buf[i++]] + bth[buf[i++]] + '-' +
            bth[buf[i++]] + bth[buf[i++]] + '-' +
            bth[buf[i++]] + bth[buf[i++]] + '-' +
            bth[buf[i++]] + bth[buf[i++]] +
            bth[buf[i++]] + bth[buf[i++]] +
            bth[buf[i++]] + bth[buf[i++]];
  }

  // **`v4()` - Generate random UUID**

  // See https://github.com/broofa/node-uuid for API details
  function v4(options, buf, offset) {
    // Deprecated - 'format' argument, as supported in v1.2
    var i = buf && offset || 0;

    if (typeof(options) == 'string') {
      buf = options == 'binary' ? new BufferClass(16) : null;
      options = null;
    }
    options = options || {};

    var rnds = options.random || (options.rng || _rng)();

    // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`
    rnds[6] = (rnds[6] & 0x0f) | 0x40;
    rnds[8] = (rnds[8] & 0x3f) | 0x80;

    // Copy bytes to buffer, if provided
    if (buf) {
      for (var ii = 0; ii < 16; ii++) {
        buf[i + ii] = rnds[ii];
      }
    }

    return buf || unparse(rnds);
  }

  // Export public API
  var uuid = v4;
  uuid.v4 = v4;
  uuid.parse = parse;
  uuid.unparse = unparse;
  uuid.BufferClass = BufferClass;

  // Export RNG options
  uuid.mathRNG = mathRNG;
  uuid.whatwgRNG = whatwgRNG;

  OTHelpers.uuid = uuid;

}(window, window.OTHelpers));
/*jshint browser:true, smarttabs:true*/

// tb_require('../helpers.js')

(function(window, OTHelpers, undefined) {

OTHelpers.useLogHelpers = function(on){

    // Log levels for OTLog.setLogLevel
    on.DEBUG    = 5;
    on.LOG      = 4;
    on.INFO     = 3;
    on.WARN     = 2;
    on.ERROR    = 1;
    on.NONE     = 0;

    var _logLevel = on.NONE,
        _logs = [],
        _canApplyConsole = true;

    try {
        Function.prototype.bind.call(window.console.log, window.console);
    } catch (err) {
        _canApplyConsole = false;
    }

    // Some objects can't be logged in the console, mostly these are certain
    // types of native objects that are exposed to JS. This is only really a
    // problem with IE, hence only the IE version does anything.
    var makeLogArgumentsSafe = function(args) { return args; };

    if (OTHelpers.browser() === 'IE') {
        makeLogArgumentsSafe = function(args) {
            return [toDebugString(Array.prototype.slice.apply(args))];
        };
    }

    // Generates a logging method for a particular method and log level.
    //
    // Attempts to handle the following cases:
    // * the desired log method doesn't exist, call fallback (if available) instead
    // * the console functionality isn't available because the developer tools (in IE)
    // aren't open, call fallback (if available)
    // * attempt to deal with weird IE hosted logging methods as best we can.
    //
    function generateLoggingMethod(method, level, fallback) {
        return function() {
            if (on.shouldLog(level)) {
                var cons = window.console,
                    args = makeLogArgumentsSafe(arguments);

                // In IE, window.console may not exist if the developer tools aren't open
                // This also means that cons and cons[method] can appear at any moment
                // hence why we retest this every time.
                if (cons && cons[method]) {
                    // the desired console method isn't a real object, which means
                    // that we can't use apply on it. We force it to be a real object
                    // using Function.bind, assuming that's available.
                    if (cons[method].apply || _canApplyConsole) {
                        if (!cons[method].apply) {
                            cons[method] = Function.prototype.bind.call(cons[method], cons);
                        }

                        cons[method].apply(cons, args);
                    }
                    else {
                        // This isn't the same result as the above, but it's better
                        // than nothing.
                        cons[method](args);
                    }
                }
                else if (fallback) {
                    fallback.apply(on, args);

                    // Skip appendToLogs, we delegate entirely to the fallback
                    return;
                }

                appendToLogs(method, makeLogArgumentsSafe(arguments));
            }
        };
    }

    on.log = generateLoggingMethod('log', on.LOG);

    // Generate debug, info, warn, and error logging methods, these all fallback to on.log
    on.debug = generateLoggingMethod('debug', on.DEBUG, on.log);
    on.info = generateLoggingMethod('info', on.INFO, on.log);
    on.warn = generateLoggingMethod('warn', on.WARN, on.log);
    on.error = generateLoggingMethod('error', on.ERROR, on.log);


    on.setLogLevel = function(level) {
        _logLevel = typeof(level) === 'number' ? level : 0;
        on.debug("TB.setLogLevel(" + _logLevel + ")");
        return _logLevel;
    };

    on.getLogs = function() {
        return _logs;
    };

    // Determine if the level is visible given the current logLevel.
    on.shouldLog = function(level) {
        return _logLevel >= level;
    };

    // Format the current time nicely for logging. Returns the current
    // local time.
    function formatDateStamp() {
        var now = new Date();
        return now.toLocaleTimeString() + now.getMilliseconds();
    }

    function toJson(object) {
        try {
            return JSON.stringify(object);
        } catch(e) {
            return object.toString();
        }
    }

    function toDebugString(object) {
        var components = [];

        if (typeof(object) === 'undefined') {
            // noop
        }
        else if (object === null) {
            components.push('NULL');
        }
        else if (OTHelpers.isArray(object)) {
            for (var i=0; i<object.length; ++i) {
                components.push(toJson(object[i]));
            }
        }
        else if (OTHelpers.isObject(object)) {
            for (var key in object) {
                var stringValue;

                if (!OTHelpers.isFunction(object[key])) {
                    stringValue = toJson(object[key]);
                }
                else if (object.hasOwnProperty(key)) {
                    stringValue = 'function ' + key + '()';
                }

                components.push(key + ': ' + stringValue);
            }
        }
        else if (OTHelpers.isFunction(object)) {
            try {
                components.push(object.toString());
            } catch(e) {
                components.push('function()');
            }
        }
        else  {
            components.push(object.toString());
        }

        return components.join(", ");
    }

    // Append +args+ to logs, along with the current log level and the a date stamp.
    function appendToLogs(level, args) {
        if (!args) return;

        var message = toDebugString(args);
        if (message.length <= 2) return;

        _logs.push(
            [level, formatDateStamp(), message]
        );
    }
};

OTHelpers.useLogHelpers(OTHelpers);
OTHelpers.setLogLevel(OTHelpers.ERROR);

})(window, window.OTHelpers);

/*jshint browser:true, smarttabs:true*/

// tb_require('../helpers.js')

(function(window, OTHelpers, undefined) {

OTHelpers.castToBoolean = function(value, defaultValue) {
    if (value === undefined) return defaultValue;
    return value === 'true' || value === true;
};

OTHelpers.roundFloat = function(value, places) {
    return Number(value.toFixed(places));
};

})(window, window.OTHelpers);
/*jshint browser:true, smarttabs:true*/

// tb_require('../helpers.js')
// tb_require('../vendor/uuid.js')

(function(window, OTHelpers, undefined) {

  var timeouts = [],
      messageName = 'OTHelpers.' + OTHelpers.uuid.v4() + '.zero-timeout';

  var handleMessage = function(event) {
    if (event.data === messageName) {
      if(OTHelpers.isFunction(event.stopPropagation)) {
        event.stopPropagation();
      }
      event.cancelBubble = true;
      if (timeouts.length > 0) {
        var args = timeouts.shift(),
            fn = args.shift();

        fn.apply(null, args);
      }
    }
  };

  if(window.addEventListener) {
    window.addEventListener('message', handleMessage, true);
  } else if(window.attachEvent) {
    window.attachEvent('onmessage', handleMessage);
  }

  // Calls the function +fn+ asynchronously with the current execution.
  // This is most commonly used to execute something straight after
  // the current function.
  //
  // Any arguments in addition to +fn+ will be passed to +fn+ when it's
  // called.
  //
  // You would use this inplace of setTimeout(fn, 0) type constructs. callAsync
  // is preferable as it executes in a much more predictable time window,
  // unlike setTimeout which could execute anywhere from 2ms to several thousand
  // depending on the browser/context.
  //
  OTHelpers.callAsync = function (/* fn, [arg1, arg2, ..., argN] */) {
    timeouts.push(Array.prototype.slice.call(arguments));
    window.postMessage(messageName, '*');
  };


  // Wraps +handler+ in a function that will execute it asynchronously
  // so that it doesn't interfere with it's exceution context if it raises
  // an exception.
  OTHelpers.createAsyncHandler = function(handler) {
    return function() {
      var args = Array.prototype.slice.call(arguments);

      OTHelpers.callAsync(function() {
        handler.apply(null, args);
      });
    };
  };

})(window, window.OTHelpers);

/*jshint browser:true, smarttabs:true*/
/*global jasmine:true*/

// tb_require('../../helpers.js')
// tb_require('../callbacks.js')

(function(window, OTHelpers, undefined) {

/**
* This base class defines the <code>on</code>, <code>once</code>, and <code>off</code>
* methods of objects that can dispatch events.
*
* @class EventDispatcher
*/
  OTHelpers.eventing = function(self, syncronous) {
    var _events = {};


    // Call the defaultAction, passing args
    function executeDefaultAction(defaultAction, args) {
      if (!defaultAction) return;

      defaultAction.apply(null, args.slice());
    }

    // Execute each handler in +listeners+ with +args+.
    //
    // Each handler will be executed async. On completion the defaultAction
    // handler will be executed with the args.
    //
    // @param [Array] listeners
    //    An array of functions to execute. Each will be passed args.
    //
    // @param [Array] args
    //    An array of arguments to execute each function in  +listeners+ with.
    //
    // @param [String] name
    //    The name of this event.
    //
    // @param [Function, Null, Undefined] defaultAction
    //    An optional function to execute after every other handler. This will execute even
    //    if +listeners+ is empty. +defaultAction+ will be passed args as a normal
    //    handler would.
    //
    // @return Undefined
    //
    function executeListenersAsyncronously(name, args, defaultAction) {
      var listeners = _events[name];
      if (!listeners || listeners.length === 0) return;

      var listenerAcks = listeners.length;

      OTHelpers.forEach(listeners, function(listener) { // , index
        function filterHandlerAndContext(_listener) {
          return _listener.context === listener.context && _listener.handler === listener.handler;
        }

        // We run this asynchronously so that it doesn't interfere with execution if an
        // error happens
        OTHelpers.callAsync(function() {
          try {
            // have to check if the listener has not been removed
            if (_events[name] && OTHelpers.some(_events[name], filterHandlerAndContext)) {
              (listener.closure || listener.handler).apply(listener.context || null, args);
            }
          }
          finally {
            listenerAcks--;

            if (listenerAcks === 0) {
              executeDefaultAction(defaultAction, args);
            }
          }
        });
      });
    }


    // This is identical to executeListenersAsyncronously except that handlers will
    // be executed syncronously.
    //
    // On completion the defaultAction handler will be executed with the args.
    //
    // @param [Array] listeners
    //    An array of functions to execute. Each will be passed args.
    //
    // @param [Array] args
    //    An array of arguments to execute each function in  +listeners+ with.
    //
    // @param [String] name
    //    The name of this event.
    //
    // @param [Function, Null, Undefined] defaultAction
    //    An optional function to execute after every other handler. This will execute even
    //    if +listeners+ is empty. +defaultAction+ will be passed args as a normal
    //    handler would.
    //
    // @return Undefined
    //
    function executeListenersSyncronously(name, args) { // defaultAction is not used
      var listeners = _events[name];
      if (!listeners || listeners.length === 0) return;

      OTHelpers.forEach(listeners, function(listener) { // index
        (listener.closure || listener.handler).apply(listener.context || null, args);
      });
    }

    var executeListeners = syncronous === true ?
      executeListenersSyncronously : executeListenersAsyncronously;


    var removeAllListenersNamed = function (eventName, context) {
      if (_events[eventName]) {
        if (context) {
          // We are removing by context, get only events that don't
          // match that context
          _events[eventName] = OTHelpers.filter(_events[eventName], function(listener){
            return listener.context !== context;
          });
        }
        else {
          delete _events[eventName];
        }
      }
    };

    var addListeners = OTHelpers.bind(function (eventNames, handler, context, closure) {
      var listener = {handler: handler};
      if (context) listener.context = context;
      if (closure) listener.closure = closure;

      OTHelpers.forEach(eventNames, function(name) {
        if (!_events[name]) _events[name] = [];
        _events[name].push(listener);
      });
    }, self);


    var removeListeners = function (eventNames, handler, context) {
      function filterHandlerAndContext(listener) {
        return !(listener.handler === handler && listener.context === context);
      }

      OTHelpers.forEach(eventNames, OTHelpers.bind(function(name) {
        if (_events[name]) {
          _events[name] = OTHelpers.filter(_events[name], filterHandlerAndContext);
          if (_events[name].length === 0) delete _events[name];
        }
      }, self));

    };

    // Execute any listeners bound to the +event+ Event.
    //
    // Each handler will be executed async. On completion the defaultAction
    // handler will be executed with the args.
    //
    // @param [Event] event
    //    An Event object.
    //
    // @param [Function, Null, Undefined] defaultAction
    //    An optional function to execute after every other handler. This will execute even
    //    if there are listeners bound to this event. +defaultAction+ will be passed
    //    args as a normal handler would.
    //
    // @return this
    //
    self.dispatchEvent = function(event, defaultAction) {
      if (!event.type) {
        OTHelpers.error('OTHelpers.Eventing.dispatchEvent: Event has no type');
        OTHelpers.error(event);

        throw new Error('OTHelpers.Eventing.dispatchEvent: Event has no type');
      }

      if (!event.target) {
        event.target = this;
      }

      if (!_events[event.type] || _events[event.type].length === 0) {
        executeDefaultAction(defaultAction, [event]);
        return;
      }

      executeListeners(event.type, [event], defaultAction);

      return this;
    };

    // Execute each handler for the event called +name+.
    //
    // Each handler will be executed async, and any exceptions that they throw will
    // be caught and logged
    //
    // How to pass these?
    //  * defaultAction
    //
    // @example
    //  foo.on('bar', function(name, message) {
    //    alert("Hello " + name + ": " + message);
    //  });
    //
    //  foo.trigger('OpenTok', 'asdf');     // -> Hello OpenTok: asdf
    //
    //
    // @param [String] eventName
    //    The name of this event.
    //
    // @param [Array] arguments
    //    Any additional arguments beyond +eventName+ will be passed to the handlers.
    //
    // @return this
    //
    self.trigger = function(eventName) {
      if (!_events[eventName] || _events[eventName].length === 0) {
        return;
      }

      var args = Array.prototype.slice.call(arguments);

      // Remove the eventName arg
      args.shift();

      executeListeners(eventName, args);

      return this;
    };

   /**
    * Adds an event handler function for one or more events.
    *
    * <p>
    * The following code adds an event handler for one event:
    * </p>
    *
    * <pre>
    * obj.on("eventName", function (event) {
    *     // This is the event handler.
    * });
    * </pre>
    *
    * <p>If you pass in multiple event names and a handler method, the handler is
    * registered for each of those events:</p>
    *
    * <pre>
    * obj.on("eventName1 eventName2",
    *        function (event) {
    *            // This is the event handler.
    *        });
    * </pre>
    *
    * <p>You can also pass in a third <code>context</code> parameter (which is optional) to
    * define the value of <code>this</code> in the handler method:</p>
    *
    * <pre>obj.on("eventName",
    *        function (event) {
    *            // This is the event handler.
    *        },
    *        obj);
    * </pre>
    *
    * <p>
    * The method also supports an alternate syntax, in which the first parameter is an object
    * that is a hash map of event names and handler functions and the second parameter (optional)
    * is the context for this in each handler:
    * </p>
    * <pre>
    * obj.on(
    *    {
    *       eventName1: function (event) {
    *               // This is the handler for eventName1.
    *           },
    *       eventName2:  function (event) {
    *               // This is the handler for eventName2.
    *           }
    *    },
    *    obj);
    * </pre>
    *
    * <p>
    * If you do not add a handler for an event, the event is ignored locally.
    * </p>
    *
    * @param {String} type The string identifying the type of event. You can specify multiple event
    * names in this string, separating them with a space. The event handler will process each of
    * the events.
    * @param {Function} handler The handler function to process the event. This function takes
    * the event object as a parameter.
    * @param {Object} context (Optional) Defines the value of <code>this</code> in the event
    * handler function.
    *
    * @returns {EventDispatcher} The EventDispatcher object.
    *
    * @memberOf EventDispatcher
    * @method #on
    * @see <a href="#off">off()</a>
    * @see <a href="#once">once()</a>
    * @see <a href="#events">Events</a>
    */
    self.on = function(eventNames, handlerOrContext, context) {
      if (typeof(eventNames) === 'string' && handlerOrContext) {
        addListeners(eventNames.split(' '), handlerOrContext, context);
      }
      else {
        for (var name in eventNames) {
          if (eventNames.hasOwnProperty(name)) {
            addListeners([name], eventNames[name], handlerOrContext);
          }
        }
      }

      return this;
    };

   /**
    * Removes an event handler or handlers.
    *
    * <p>If you pass in one event name and a handler method, the handler is removed for that
    * event:</p>
    *
    * <pre>obj.off("eventName", eventHandler);</pre>
    *
    * <p>If you pass in multiple event names and a handler method, the handler is removed for
    * those events:</p>
    *
    * <pre>obj.off("eventName1 eventName2", eventHandler);</pre>
    *
    * <p>If you pass in an event name (or names) and <i>no</i> handler method, all handlers are
    * removed for those events:</p>
    *
    * <pre>obj.off("event1Name event2Name");</pre>
    *
    * <p>If you pass in no arguments, <i>all</i> event handlers are removed for all events
    * dispatched by the object:</p>
    *
    * <pre>obj.off();</pre>
    *
    * <p>
    * The method also supports an alternate syntax, in which the first parameter is an object that
    * is a hash map of event names and handler functions and the second parameter (optional) is
    * the context for this in each handler:
    * </p>
    * <pre>
    * obj.off(
    *    {
    *       eventName1: event1Handler,
    *       eventName2: event2Handler
    *    });
    * </pre>
    *
    * @param {String} type (Optional) The string identifying the type of event. You can
    * use a space to specify multiple events, as in "accessAllowed accessDenied
    * accessDialogClosed". If you pass in no <code>type</code> value (or other arguments),
    * all event handlers are removed for the object.
    * @param {Function} handler (Optional) The event handler function to remove. The handler
    * must be the same function object as was passed into <code>on()</code>. Be careful with
    * helpers like <code>bind()</code> that return a new function when called. If you pass in
    * no <code>handler</code>, all event handlers are removed for the specified event
    * <code>type</code>.
    * @param {Object} context (Optional) If you specify a <code>context</code>, the event handler
    * is removed for all specified events and handlers that use the specified context. (The
    * context must match the context passed into <code>on()</code>.)
    *
    * @returns {Object} The object that dispatched the event.
    *
    * @memberOf EventDispatcher
    * @method #off
    * @see <a href="#on">on()</a>
    * @see <a href="#once">once()</a>
    * @see <a href="#events">Events</a>
    */
    self.off = function(eventNames, handlerOrContext, context) {
      if (typeof eventNames === 'string') {
        if (handlerOrContext && OTHelpers.isFunction(handlerOrContext)) {
          removeListeners(eventNames.split(' '), handlerOrContext, context);
        }
        else {
          OTHelpers.forEach(eventNames.split(' '), function(name) {
            removeAllListenersNamed(name, handlerOrContext);
          }, this);
        }

      } else if (!eventNames) {
        // remove all bound events
        _events = {};

      } else {
        for (var name in eventNames) {
          if (eventNames.hasOwnProperty(name)) {
            removeListeners([name], eventNames[name], handlerOrContext);
          }
        }
      }

      return this;
    };


   /**
    * Adds an event handler function for one or more events. Once the handler is called,
    * the specified handler method is removed as a handler for this event. (When you use
    * the <code>on()</code> method to add an event handler, the handler is <i>not</i>
    * removed when it is called.) The <code>once()</code> method is the equivilent of
    * calling the <code>on()</code>
    * method and calling <code>off()</code> the first time the handler is invoked.
    *
    * <p>
    * The following code adds a one-time event handler for the <code>accessAllowed</code> event:
    * </p>
    *
    * <pre>
    * obj.once("eventName", function (event) {
    *    // This is the event handler.
    * });
    * </pre>
    *
    * <p>If you pass in multiple event names and a handler method, the handler is registered
    * for each of those events:</p>
    *
    * <pre>obj.once("eventName1 eventName2"
    *          function (event) {
    *              // This is the event handler.
    *          });
    * </pre>
    *
    * <p>You can also pass in a third <code>context</code> parameter (which is optional) to define
    * the value of
    * <code>this</code> in the handler method:</p>
    *
    * <pre>obj.once("eventName",
    *          function (event) {
    *              // This is the event handler.
    *          },
    *          obj);
    * </pre>
    *
    * <p>
    * The method also supports an alternate syntax, in which the first parameter is an object that
    * is a hash map of event names and handler functions and the second parameter (optional) is the
    * context for this in each handler:
    * </p>
    * <pre>
    * obj.once(
    *    {
    *       eventName1: function (event) {
    *                  // This is the event handler for eventName1.
    *           },
    *       eventName2:  function (event) {
    *                  // This is the event handler for eventName1.
    *           }
    *    },
    *    obj);
    * </pre>
    *
    * @param {String} type The string identifying the type of event. You can specify multiple
    * event names in this string, separating them with a space. The event handler will process
    * the first occurence of the events. After the first event, the handler is removed (for
    * all specified events).
    * @param {Function} handler The handler function to process the event. This function takes
    * the event object as a parameter.
    * @param {Object} context (Optional) Defines the value of <code>this</code> in the event
    * handler function.
    *
    * @returns {Object} The object that dispatched the event.
    *
    * @memberOf EventDispatcher
    * @method #once
    * @see <a href="#on">on()</a>
    * @see <a href="#off">off()</a>
    * @see <a href="#events">Events</a>
    */
    self.once = function(eventNames, handler, context) {
      var names = eventNames.split(' '),
          fun = OTHelpers.bind(function() {
            var result = handler.apply(context || null, arguments);
            removeListeners(names, handler, context);

            return result;
          }, this);

      addListeners(names, handler, context, fun);
      return this;
    };


    /**
    * Deprecated; use <a href="#on">on()</a> or <a href="#once">once()</a> instead.
    * <p>
    * This method registers a method as an event listener for a specific event.
    * <p>
    *
    * <p>
    *   If a handler is not registered for an event, the event is ignored locally. If the
    *   event listener function does not exist, the event is ignored locally.
    * </p>
    * <p>
    *   Throws an exception if the <code>listener</code> name is invalid.
    * </p>
    *
    * @param {String} type The string identifying the type of event.
    *
    * @param {Function} listener The function to be invoked when the object dispatches the event.
    *
    * @param {Object} context (Optional) Defines the value of <code>this</code> in the event
    * handler function.
    *
    * @memberOf EventDispatcher
    * @method #addEventListener
    * @see <a href="#on">on()</a>
    * @see <a href="#once">once()</a>
    * @see <a href="#events">Events</a>
    */
    // See 'on' for usage.
    // @depreciated will become a private helper function in the future.
    self.addEventListener = function(eventName, handler, context) {
      OTHelpers.warn('The addEventListener() method is deprecated. Use on() or once() instead.');
      addListeners([eventName], handler, context);
    };


    /**
    * Deprecated; use <a href="#on">on()</a> or <a href="#once">once()</a> instead.
    * <p>
    * Removes an event listener for a specific event.
    * <p>
    *
    * <p>
    *   Throws an exception if the <code>listener</code> name is invalid.
    * </p>
    *
    * @param {String} type The string identifying the type of event.
    *
    * @param {Function} listener The event listener function to remove.
    *
    * @param {Object} context (Optional) If you specify a <code>context</code>, the event
    * handler is removed for all specified events and event listeners that use the specified
    context. (The context must match the context passed into
    * <code>addEventListener()</code>.)
    *
    * @memberOf EventDispatcher
    * @method #removeEventListener
    * @see <a href="#off">off()</a>
    * @see <a href="#events">Events</a>
    */
    // See 'off' for usage.
    // @depreciated will become a private helper function in the future.
    self.removeEventListener = function(eventName, handler, context) {
      OTHelpers.warn('The removeEventListener() method is deprecated. Use off() instead.');
      removeListeners([eventName], handler, context);
    };


    /* test-code */
    self.__testonly__ =  {
      events: function() {
        return _events;
      }
    };

    // When this is being used inside Jasmime we create and expose spies for
    // several private methods. These are used for verification in our test
    // suites.
    var env = jasmine.getEnv();
    if (env) {
      addListeners = jasmine.createSpy('spy on OTHelpers.eventing.addListeners')
        .andCallFake(addListeners);
      removeListeners = jasmine.createSpy('spy on OTHelpers.eventing.removeListeners')
        .andCallFake(removeListeners);
      removeAllListenersNamed = jasmine
        .createSpy('spy on OTHelpers.eventing.removeAllListenersNamed')
        .andCallFake(removeAllListenersNamed);

      /*global afterEach:true*/
      afterEach(function() {
        self.__testonly__.resetSpies();
      });
    }

    self.__testonly__.removeAllListenersNamed = removeAllListenersNamed;
    self.__testonly__.removeListeners = removeListeners;
    self.__testonly__.addListeners = addListeners;

    self.__testonly__.resetSpies = function() {
      addListeners.reset();
      removeListeners.reset();
      removeAllListenersNamed.reset();
    };
    /* end-test-code */


    return self;
  };

  OTHelpers.eventing.Event = function() {

    return function (type, cancelable) {
      this.type = type;
      this.cancelable = cancelable !== undefined ? cancelable : true;

      var _defaultPrevented = false;

      this.preventDefault = function() {
        if (this.cancelable) {
          _defaultPrevented = true;
        } else {
          OTHelpers.warn('Event.preventDefault :: Trying to preventDefault ' +
            'on an Event that isn\'t cancelable');
        }
      };

      this.isDefaultPrevented = function() {
        return _defaultPrevented;
      };
    };

  };
  
})(window, window.OTHelpers);

/*jshint browser:true, smarttabs:true*/

// tb_require('../helpers.js')
// tb_require('./callbacks.js')

// DOM helpers
(function(window, OTHelpers, undefined) {

OTHelpers.isElementNode = function(node) {
    return node && typeof node === 'object' && node.nodeType == 1;
};

// Returns true if the client supports element.classList
OTHelpers.supportsClassList = function() {
    var hasSupport = typeof(document !== "undefined") && ("classList" in document.createElement("a"));
    OTHelpers.supportsClassList = function() { return hasSupport; };

    return hasSupport;
};

OTHelpers.removeElement = function(element) {
    if (element && element.parentNode) {
        element.parentNode.removeChild(element);
    }
};

OTHelpers.removeElementById = function(elementId) {
    this.removeElement(OTHelpers(elementId));
};

OTHelpers.removeElementsByType = function(parentElem, type) {
    if (!parentElem) return;

    var elements = parentElem.getElementsByTagName(type);

    // elements is a "live" NodesList collection. Meaning that the collection
    // itself will be mutated as we remove elements from the DOM. This means
    // that "while there are still elements" is safer than "iterate over each
    // element" as the collection length and the elements indices will be modified
    // with each iteration.
    while (elements.length) {
        parentElem.removeChild(elements[0]);
    }
};

OTHelpers.emptyElement = function(element) {
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }
    return element;
};

OTHelpers.createElement = function(nodeName, attributes, children, doc) {
    var element = (doc || document).createElement(nodeName);

    if (attributes) {
        for (var name in attributes) {
            if (typeof(attributes[name]) === 'object') {
                if (!element[name]) element[name] = {};

                var subAttrs = attributes[name];
                for (var n in subAttrs) {
                    element[name][n] = subAttrs[n];
                }
            }
            else if (name === 'className') {
                element.className = attributes[name];
            }
            else {
                element.setAttribute(name, attributes[name]);
            }
        }
    }

    var setChildren = function(child) {
        if(typeof child === 'string') {
            element.innerHTML = element.innerHTML + child;
        } else {
            element.appendChild(child);
        }
    };

    if(OTHelpers.isArray(children)) {
        OTHelpers.forEach(children, setChildren);
    } else if(children) {
        setChildren(children);
    }

    return element;
};

OTHelpers.createButton = function(innerHTML, attributes, events) {
    var button = OTHelpers.createElement('button', attributes, innerHTML);

    if (events) {
        for (var name in events) {
            if (events.hasOwnProperty(name)) {
                OTHelpers.on(button, name, events[name]);
            }
        }

        button._boundEvents = events;
    }

    return button;
};

// Helper function for adding event listeners to dom elements.
// WARNING: This doesn't preserve event types, your handler could be getting all kinds of different
// parameters depending on the browser. You also may have different scopes depending on the browser
// and bubbling and cancelable are not supported.
OTHelpers.on = function(element, eventName,  handler) {
    if (element.addEventListener) {
        element.addEventListener(eventName, handler, false);
    } else if (element.attachEvent) {
        element.attachEvent("on" + eventName, handler);
    } else {
        var oldHandler = element["on"+eventName];
        element["on"+eventName] = function() {
          handler.apply(this, arguments);
          if (oldHandler) oldHandler.apply(this, arguments);
        };
    }
    return element;
};

// Helper function for removing event listeners from dom elements.
OTHelpers.off = function(element, eventName, handler) {
    if (element.removeEventListener) {
        element.removeEventListener (eventName, handler,false);
    }
    else if (element.detachEvent) {
        element.detachEvent("on" + eventName, handler);
    }
};


// Detects when an element is not part of the document flow because it or one of it's ancesters has display:none.
OTHelpers.isDisplayNone = function(element) {
    if ( (element.offsetWidth === 0 || element.offsetHeight === 0) && OTHelpers.css(element, 'display') === 'none') return true;
    if (element.parentNode && element.parentNode.style) return OTHelpers.isDisplayNone(element.parentNode);
    return false;
};

OTHelpers.findElementWithDisplayNone = function(element) {
    if ( (element.offsetWidth === 0 || element.offsetHeight === 0) && OTHelpers.css(element, 'display') === 'none') return element;
    if (element.parentNode && element.parentNode.style) return OTHelpers.findElementWithDisplayNone(element.parentNode);
    return null;
};

function objectHasProperties(obj) {
    for (var key in obj) {
        if (obj.hasOwnProperty(key)) return true;
    }
    return false;
}


// Allows an +onChange+ callback to be triggered when specific style properties
// of +element+ are notified. The callback accepts a single parameter, which is
// a hash where the keys are the style property that changed and the values are
// an array containing the old and new values ([oldValue, newValue]).
//
// Width and Height changes while the element is display: none will not be
// fired until such time as the element becomes visible again.
//
// This function returns the MutationObserver itself. Once you no longer wish
// to observe the element you should call disconnect on the observer.
//
// Observing changes:
//  // observe changings to the width and height of object
//  dimensionsObserver = OTHelpers.observeStyleChanges(object, ['width', 'height'], function(changeSet) {
//      OT.debug("The new width and height are " + changeSet.width[1] + ',' + changeSet.height[1]);
//  });
//
// Cleaning up
//  // stop observing changes
//  dimensionsObserver.disconnect();
//  dimensionsObserver = null;
//
OTHelpers.observeStyleChanges = function(element, stylesToObserve, onChange) {
    var oldStyles = {};

    var getStyle = function getStyle(style) {
            switch (style) {
            case 'width':
                return OTHelpers.width(element);

            case 'height':
                return OTHelpers.height(element);

            default:
                return OTHelpers.css(element);
            }
        };

    // get the inital values
    OTHelpers.forEach(stylesToObserve, function(style) {
        oldStyles[style] = getStyle(style);
    });

    var observer = new MutationObserver(function(mutations) {
        var changeSet = {};

        OTHelpers.forEach(mutations, function(mutation) {
            if (mutation.attributeName !== 'style') return;

            var isHidden = OTHelpers.isDisplayNone(element);

            OTHelpers.forEach(stylesToObserve, function(style) {
                if(isHidden && (style == 'width' || style == 'height')) return;
                
                var newValue = getStyle(style);

                if (newValue !== oldStyles[style]) {
                    // OT.debug("CHANGED " + style + ": " + oldStyles[style] + " -> " + newValue);

                    changeSet[style] = [oldStyles[style], newValue];
                    oldStyles[style] = newValue;
                }
            });
        });

        if (objectHasProperties(changeSet)) {
            // Do this after so as to help avoid infinite loops of mutations.
            OTHelpers.callAsync(function() {
                onChange.call(null, changeSet);
            });
        }
    });

    observer.observe(element, {
        attributes:true,
        attributeFilter: ['style'],
        childList:false,
        characterData:false,
        subtree:false
    });

    return observer;
};


// trigger the +onChange+ callback whenever
// 1. +element+ is removed
// 2. or an immediate child of +element+ is removed.
//
// This function returns the MutationObserver itself. Once you no longer wish
// to observe the element you should call disconnect on the observer.
//
// Observing changes:
//  // observe changings to the width and height of object
//  nodeObserver = OTHelpers.observeNodeOrChildNodeRemoval(object, function(removedNodes) {
//      OT.debug("Some child nodes were removed");
//      OTHelpers.forEach(removedNodes, function(node) {
//          OT.debug(node);
//      });
//  });
//
// Cleaning up
//  // stop observing changes
//  nodeObserver.disconnect();
//  nodeObserver = null;
//
OTHelpers.observeNodeOrChildNodeRemoval = function(element, onChange) {
    var observer = new MutationObserver(function(mutations) {
        var removedNodes = [];

        OTHelpers.forEach(mutations, function(mutation) {
            if (mutation.removedNodes.length) {
                removedNodes = removedNodes.concat(Array.prototype.slice.call(mutation.removedNodes));
            }
        });

        if (removedNodes.length) {
            // Do this after so as to help avoid infinite loops of mutations.
            OTHelpers.callAsync(function() {
                onChange(removedNodes);
            });
        }
    });

    observer.observe(element, {
        attributes:false,
        childList:true,
        characterData:false,
        subtree:true
    });

    return observer;
};

})(window, window.OTHelpers);


/*jshint browser:true, smarttabs:true*/

// tb_require('../helpers.js')
// tb_require('./dom.js')

(function(window, OTHelpers, undefined) {

  OTHelpers.Modal = function(options) {

    OTHelpers.eventing(this, true);

    var callback = arguments[arguments.length - 1];

    if(!OTHelpers.isFunction(callback)) {
      throw new Error('OTHelpers.Modal2 must be given a callback');
    }

    if(arguments.length < 2) {
      options = {};
    }

    var domElement = document.createElement('iframe');

    domElement.id = options.id || OTHelpers.uuid();
    domElement.style.position = 'absolute';
    domElement.style.position = 'fixed';
    domElement.style.height = '100%';
    domElement.style.width = '100%';
    domElement.style.top = '0px';
    domElement.style.left = '0px';
    domElement.style.right = '0px';
    domElement.style.bottom = '0px';
    domElement.style.zIndex = 1000;
    domElement.style.border = '0';

    try {
      domElement.style.backgroundColor = 'rgba(0,0,0,0.2)';
    } catch (err) {
      // Old IE browsers don't support rgba and we still want to show the upgrade message
      // but we just make the background of the iframe completely transparent.
      domElement.style.backgroundColor = 'transparent';
      domElement.setAttribute('allowTransparency', 'true');
    }

    domElement.scrolling = 'no';
    domElement.setAttribute('scrolling', 'no');

    var wrappedCallback = function() {
      var doc = domElement.contentDocument || domElement.contentWindow.document;
      doc.body.style.backgroundColor = 'transparent';
      doc.body.style.border = 'none';
      callback(
        domElement.contentWindow,
        doc
      );
    };

    document.body.appendChild(domElement);
    
    if(OTHelpers.browserVersion().iframeNeedsLoad) {
      OTHelpers.on(domElement, 'load', wrappedCallback);
    } else {
      setTimeout(wrappedCallback);
    }

    this.close = function() {
      OTHelpers.removeElement(domElement);
      this.trigger('closed');
      this.element = domElement = null;
      return this;
    };

    this.element = domElement;

  };
  
})(window, window.OTHelpers);

/*
 * getComputedStyle from 
 * https://github.com/jonathantneal/Polyfills-for-IE8/blob/master/getComputedStyle.js

// tb_require('../helpers.js')
// tb_require('./dom.js')

/*jshint strict: false, eqnull: true, browser:true, smarttabs:true*/

(function(window, OTHelpers, undefined) {

  /*jshint eqnull: true, browser: true */


  function getPixelSize(element, style, property, fontSize) {
    var sizeWithSuffix = style[property],
        size = parseFloat(sizeWithSuffix),
        suffix = sizeWithSuffix.split(/\d/)[0],
        rootSize;

    fontSize = fontSize != null ?
      fontSize : /%|em/.test(suffix) && element.parentElement ?
        getPixelSize(element.parentElement, element.parentElement.currentStyle, 'fontSize', null) :
        16;
    rootSize = property === 'fontSize' ?
      fontSize : /width/i.test(property) ? element.clientWidth : element.clientHeight;

    return (suffix === 'em') ?
      size * fontSize : (suffix === 'in') ?
        size * 96 : (suffix === 'pt') ?
          size * 96 / 72 : (suffix === '%') ?
            size / 100 * rootSize : size;
  }

  function setShortStyleProperty(style, property) {
    var
    borderSuffix = property === 'border' ? 'Width' : '',
    t = property + 'Top' + borderSuffix,
    r = property + 'Right' + borderSuffix,
    b = property + 'Bottom' + borderSuffix,
    l = property + 'Left' + borderSuffix;

    style[property] = (style[t] === style[r] === style[b] === style[l] ? [style[t]]
    : style[t] === style[b] && style[l] === style[r] ? [style[t], style[r]]
    : style[l] === style[r] ? [style[t], style[r], style[b]]
    : [style[t], style[r], style[b], style[l]]).join(' ');
  }

  function CSSStyleDeclaration(element) {
    var currentStyle = element.currentStyle,
        style = this,
        fontSize = getPixelSize(element, currentStyle, 'fontSize', null),
        property;

    for (property in currentStyle) {
      if (/width|height|margin.|padding.|border.+W/.test(property) && style[property] !== 'auto') {
        style[property] = getPixelSize(element, currentStyle, property, fontSize) + 'px';
      } else if (property === 'styleFloat') {
        /*jshint -W069 */
        style['float'] = currentStyle[property];
      } else {
        style[property] = currentStyle[property];
      }
    }

    setShortStyleProperty(style, 'margin');
    setShortStyleProperty(style, 'padding');
    setShortStyleProperty(style, 'border');

    style.fontSize = fontSize + 'px';

    return style;
  }

  CSSStyleDeclaration.prototype = {
    constructor: CSSStyleDeclaration,
    getPropertyPriority: function () {},
    getPropertyValue: function ( prop ) {
      return this[prop] || '';
    },
    item: function () {},
    removeProperty: function () {},
    setProperty: function () {},
    getPropertyCSSValue: function () {}
  };

  function getComputedStyle(element) {
    return new CSSStyleDeclaration(element);
  }


  OTHelpers.getComputedStyle = function(element) {
    if(element &&
        element.ownerDocument &&
        element.ownerDocument.defaultView &&
        element.ownerDocument.defaultView.getComputedStyle) {
      return element.ownerDocument.defaultView.getComputedStyle(element);
    } else {
      return getComputedStyle(element);
    }
  };

})(window, window.OTHelpers);

// DOM Attribute helpers helpers

/*jshint browser:true, smarttabs:true*/

// tb_require('../helpers.js')
// tb_require('./dom.js')

(function(window, OTHelpers, undefined) {

OTHelpers.addClass = function(element, value) {
    // Only bother targeting Element nodes, ignore Text Nodes, CDATA, etc
    if (element.nodeType !== 1) {
        return;
    }

    var classNames = OTHelpers.trim(value).split(/\s+/),
        i, l;

    if (OTHelpers.supportsClassList()) {
        for (i=0, l=classNames.length; i<l; ++i) {
            element.classList.add(classNames[i]);
        }

        return;
    }

    // Here's our fallback to browsers that don't support element.classList

    if (!element.className && classNames.length === 1) {
        element.className = value;
    }
    else {
        var setClass = " " + element.className + " ";

        for (i=0, l=classNames.length; i<l; ++i) {
            if ( !~setClass.indexOf( " " + classNames[i] + " ")) {
                setClass += classNames[i] + " ";
            }
        }

        element.className = OTHelpers.trim(setClass);
    }

    return this;
};

OTHelpers.removeClass = function(element, value) {
    if (!value) return;

    // Only bother targeting Element nodes, ignore Text Nodes, CDATA, etc
    if (element.nodeType !== 1) {
        return;
    }

    var newClasses = OTHelpers.trim(value).split(/\s+/),
        i, l;

    if (OTHelpers.supportsClassList()) {
        for (i=0, l=newClasses.length; i<l; ++i) {
            element.classList.remove(newClasses[i]);
        }

        return;
    }

    var className = (" " + element.className + " ").replace(/[\s+]/, ' ');

    for (i=0,l=newClasses.length; i<l; ++i) {
        className = className.replace(' ' + newClasses[i] + ' ', ' ');
    }

    element.className = OTHelpers.trim(className);

    return this;
};


/**
 * Methods to calculate element widths and heights.
 */

var _width = function(element) {
        if (element.offsetWidth > 0) {
            return element.offsetWidth + 'px';
        }

        return OTHelpers.css(element, 'width');
    },

    _height = function(element) {
        if (element.offsetHeight > 0) {
            return element.offsetHeight + 'px';
        }

        return OTHelpers.css(element, 'height');
    };

OTHelpers.width = function(element, newWidth) {
    if (newWidth) {
        OTHelpers.css(element, 'width', newWidth);
        return this;
    }
    else {
        if (OTHelpers.isDisplayNone(element)) {
            // We can't get the width, probably since the element is hidden.
            return OTHelpers.makeVisibleAndYield(element, function() {
                return _width(element);
            });
        }
        else {
            return _width(element);
        }
    }
};

OTHelpers.height = function(element, newHeight) {
    if (newHeight) {
        OTHelpers.css(element, 'height', newHeight);
        return this;
    }
    else {
        if (OTHelpers.isDisplayNone(element)) {
            // We can't get the height, probably since the element is hidden.
            return OTHelpers.makeVisibleAndYield(element, function() {
                return _height(element);
            });
        }
        else {
            return _height(element);
        }
    }
};

// Centers +element+ within the window. You can pass through the width and height
// if you know it, if you don't they will be calculated for you.
OTHelpers.centerElement = function(element, width, height) {
    if (!width) width = parseInt(OTHelpers.width(element), 10);
    if (!height) height = parseInt(OTHelpers.height(element), 10);

    var marginLeft = -0.5 * width + "px";
    var marginTop = -0.5 * height + "px";
    OTHelpers.css(element, "margin", marginTop + " 0 0 " + marginLeft);
    OTHelpers.addClass(element, "OT_centered");
};

})(window, window.OTHelpers);

// CSS helpers helpers

/*jshint browser:true, smarttabs:true*/

// tb_require('../helpers.js')
// tb_require('./dom.js')
// tb_require('./getcomputedstyle.js')

(function(window, OTHelpers, undefined) {

  var displayStateCache = {},
      defaultDisplays = {};

  var defaultDisplayValueForElement = function(element) {
      if (defaultDisplays[element.ownerDocument] &&
        defaultDisplays[element.ownerDocument][element.nodeName]) {
        return defaultDisplays[element.ownerDocument][element.nodeName];
      }

      if (!defaultDisplays[element.ownerDocument]) defaultDisplays[element.ownerDocument] = {};
    
      // We need to know what display value to use for this node. The easiest way
      // is to actually create a node and read it out.
      var testNode = element.ownerDocument.createElement(element.nodeName),
          defaultDisplay;

      element.ownerDocument.body.appendChild(testNode);
      defaultDisplay = defaultDisplays[element.ownerDocument][element.nodeName] =
        OTHelpers.css(testNode, 'display');

      OTHelpers.removeElement(testNode);
      testNode = null;

      return defaultDisplay;
    };

  var isHidden = function(element) {
    var computedStyle = OTHelpers.getComputedStyle(element);
    return computedStyle.getPropertyValue('display') === 'none';
  };

  OTHelpers.show = function(element) {
    var display = element.style.display;

    if (display === '' || display === 'none') {
      element.style.display = displayStateCache[element] || '';
      delete displayStateCache[element];
    }

    if (isHidden(element)) {
      // It's still hidden so there's probably a stylesheet that declares this
      // element as display:none;
      displayStateCache[element] = 'none';

      element.style.display = defaultDisplayValueForElement(element);
    }

    return this;
  };

  OTHelpers.hide = function(element) {
    if (element.style.display === 'none') return;

    displayStateCache[element] = element.style.display;
    element.style.display = 'none';

    return this;
  };

  OTHelpers.css = function(element, nameOrHash, value) {
    if (typeof(nameOrHash) !== 'string') {
      var style = element.style;

      for (var cssName in nameOrHash) {
        style[cssName] = nameOrHash[cssName];
      }

      return this;

    } else if (value !== undefined) {
      element.style[nameOrHash] = value;
      return this;

    } else {
      // Normalise vendor prefixes from the form MozTranform to -moz-transform
      // except for ms extensions, which are weird...

      var name = nameOrHash.replace( /([A-Z]|^ms)/g, '-$1' ).toLowerCase(),
          computedStyle = OTHelpers.getComputedStyle(element),
          currentValue = computedStyle.getPropertyValue(name);

      if (currentValue === '') {
        currentValue = element.style[name];
      }

      return currentValue;
    }
  };


// Apply +styles+ to +element+ while executing +callback+, restoring the previous
// styles after the callback executes.
  OTHelpers.applyCSS = function(element, styles, callback) {
    var oldStyles = {},
        name,
        ret;

    // Backup the old styles
    for (name in styles) {
      if (styles.hasOwnProperty(name)) {
        // We intentionally read out of style here, instead of using the css
        // helper. This is because the css helper uses querySelector and we
        // only want to pull values out of the style (domeElement.style) hash.
        oldStyles[name] = element.style[name];

        OTHelpers.css(element, name, styles[name]);
      }
    }

    ret = callback();

    // Restore the old styles
    for (name in styles) {
      if (styles.hasOwnProperty(name)) {
        OTHelpers.css(element, name, oldStyles[name] || '');
      }
    }

    return ret;
  };

// Make +element+ visible while executing +callback+.
  OTHelpers.makeVisibleAndYield = function(element, callback) {
    // find whether it's the element or an ancester that's display none and
    // then apply to whichever it is
    var targetElement = OTHelpers.findElementWithDisplayNone(element);
    if (!targetElement) return;

    return OTHelpers.applyCSS(targetElement, {
      display: 'block',
      visibility: 'hidden'
    }, callback);
  };

})(window, window.OTHelpers);

// AJAX helpers

/*jshint browser:true, smarttabs:true*/

// tb_require('../helpers.js')

(function(window, OTHelpers, undefined) {

  function formatPostData(data) { //, contentType
    // If it's a string, we assume it's properly encoded
    if (typeof(data) === 'string') return data;

    var queryString = [];

    for (var key in data) {
      queryString.push(
        encodeURIComponent(key) + '=' + encodeURIComponent(data[key])
      );
    }

    return queryString.join('&').replace(/\+/g, '%20');
  }

  OTHelpers.getJSON = function(url, options, callback) {
    options = options || {};

    var done = function(error, event) {
      if(error) {
        callback(error, event && event.target && event.target.responseText);
      } else {
        var response;

        try {
          response = JSON.parse(event.target.responseText);
        } catch(e) {
          // Badly formed JSON
          callback(e, event && event.target && event.target.responseText);
          return;
        }

        callback(null, response, event);
      }
    };

    if(options.xdomainrequest) {
      OTHelpers.xdomainRequest(url, { method: 'GET' }, done);
    } else {
      var extendedHeaders = OTHelpers.extend({
        'Accept': 'application/json'
      }, options.headers || {});

      OTHelpers.get(url, OTHelpers.extend(options || {}, {
        headers: extendedHeaders
      }), done);
    }

  };

  OTHelpers.xdomainRequest = function(url, options, callback) {
    /*global XDomainRequest*/
    var xdr = new XDomainRequest(),
        _options = options || {},
        _method = _options.method;

    if(!_method) {
      callback(new Error('No HTTP method specified in options'));
      return;
    }

    _method = _method.toUpperCase();

    if(!(_method === 'GET' || _method === 'POST')) {
      callback(new Error('HTTP method can only be '));
      return;
    }

    function done(err, event) {
      xdr.onload = xdr.onerror = xdr.ontimeout = function() {};
      xdr = void 0;
      callback(err, event);
    }


    xdr.onload = function() {
      done(null, {
        target: {
          responseText: xdr.responseText,
          headers: {
            'content-type': xdr.contentType
          }
        }
      });
    };

    xdr.onerror = function() {
      done(new Error('XDomainRequest of ' + url + ' failed'));
    };

    xdr.ontimeout = function() {
      done(new Error('XDomainRequest of ' + url + ' timed out'));
    };

    xdr.open(_method, url);
    xdr.send(options.body && formatPostData(options.body));

  };

  OTHelpers.request = function(url, options, callback) {
    var request = new XMLHttpRequest(),
        _options = options || {},
        _method = _options.method;

    if(!_method) {
      callback(new Error('No HTTP method specified in options'));
      return;
    }

    // Setup callbacks to correctly respond to success and error callbacks. This includes
    // interpreting the responses HTTP status, which XmlHttpRequest seems to ignore
    // by default.
    if(callback) {
      request.addEventListener('load', function(event) {
        var status = event.target.status;

        // We need to detect things that XMLHttpRequest considers a success,
        // but we consider to be failures.
        if ( status >= 200 && status < 300 || status === 304 ) {
          callback(null, event);
        } else {
          callback(event);
        }
      }, false);

      request.addEventListener('error', callback, false);
    }

    request.open(options.method, url, true);

    if (!_options.headers) _options.headers = {};

    for (var name in _options.headers) {
      request.setRequestHeader(name, _options.headers[name]);
    }

    request.send(options.body && formatPostData(options.body));
  };

  OTHelpers.get = function(url, options, callback) {
    var _options = OTHelpers.extend(options || {}, {
      method: 'GET'
    });
    OTHelpers.request(url, _options, callback);
  };

  OTHelpers.post = function(url, options, callback) {
    var _options = OTHelpers.extend(options || {}, {
      method: 'POST'
    });

    if(_options.xdomainrequest) {
      OTHelpers.xdomainRequest(url, _options, callback);
    } else {
      OTHelpers.request(url, _options, callback);
    }
  };

})(window, window.OTHelpers);
