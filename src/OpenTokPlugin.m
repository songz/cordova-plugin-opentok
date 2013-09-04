//
//  OpentokPlugin.m
//
//  Copyright (c) 2012 TokBox. All rights reserved.
//  Please see the LICENSE included with this distribution for details.
//

#import "OpentokPlugin.h"


@implementation OpenTokPlugin{
    OTSession* _session;
    OTPublisher* _publisher;
    OTSubscriber* _subscriber;
    NSMutableDictionary *subscriberDictionary;
    NSMutableDictionary *streamDictionary;
}

@synthesize callbackID;
@synthesize streamDisconnectedId;
@synthesize streamCreatedId;
@synthesize sessionDisconnectedId;
@synthesize exceptionId;


/*** TB Methods
 ****/
// Called by TB.addEventListener('exception', fun...)
-(void)exceptionHandler:(CDVInvokedUrlCommand*)command{
    self.exceptionId = command.callbackId;
}

// Called by TB.initsession()
-(void)initSession:(CDVInvokedUrlCommand*)command{
    // Get Parameters
    NSString* sessionId = [command.arguments objectAtIndex:0];
    
    // Create Session
    _session = [[OTSession alloc] initWithSessionId:sessionId delegate:self];
    
    // Initialize Dictionary, contains DOM info for every stream
    subscriberDictionary = [[NSMutableDictionary alloc] init];
    streamDictionary = [[NSMutableDictionary alloc] init];
    
    // Return Result
    CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
}

// Called by TB.initPublisher()
- (void)initPublisher:(CDVInvokedUrlCommand *)command{
    NSLog(@"iOS creating Publisher");
    BOOL bpubAudio = YES;
    BOOL bpubVideo = YES;
    
    // Get Parameters
    int top = [[command.arguments objectAtIndex:0] intValue];
    int left = [[command.arguments objectAtIndex:1] intValue];
    int width = [[command.arguments objectAtIndex:2] intValue];
    int height = [[command.arguments objectAtIndex:3] intValue];
    
    NSString* name = [command.arguments objectAtIndex:4];
    if ([name isEqualToString:@"TBNameHolder"]) {
        name = [[UIDevice currentDevice] name];
    }
    
    NSString* publishAudio = [command.arguments objectAtIndex:5];
    if ([publishAudio isEqualToString:@"false"]) {
        bpubAudio = NO;
    }
    NSString* publishVideo = [command.arguments objectAtIndex:6];
    if ([publishVideo isEqualToString:@"false"]) {
        bpubVideo = NO;
    }
    int zIndex = [[command.arguments objectAtIndex:7] intValue];
    
    // Publish and set View
    _publisher = [[OTPublisher alloc] initWithDelegate:self name:name];
    [_publisher setPublishAudio:bpubAudio];
    [_publisher setPublishVideo:bpubVideo];
    [self.webView.superview addSubview:_publisher.view];
    [_publisher.view setFrame:CGRectMake(left, top, width, height)];
    if (zIndex>0) {
        _publisher.view.layer.zPosition = zIndex;
    }
    
    // Return to Javascript
    CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
}

/*** Publisher Methods
 ****/
- (void)destroy:(CDVInvokedUrlCommand*)command{
}


// Called by addEventListener() for streamCreated
- (void)streamCreatedHandler:(CDVInvokedUrlCommand*)command{
    NSLog(@"iOS Adding Stream Created Event Listener");
    self.streamCreatedId = command.callbackId;
}

/*** Session Methods
 ****/
// Called by session.connect(key, token)
- (void)connect:(CDVInvokedUrlCommand *)command{
    NSLog(@"iOS Connecting to Session");
    
    // Get Parameters
    self.callbackID = command.callbackId;
    NSString* tbKey = [command.arguments objectAtIndex:0];
    NSString* tbToken = [command.arguments objectAtIndex:1];
    
    [_session connectWithApiKey:tbKey token:tbToken];
}

// Called by session.disconnect()
- (void)disconnect:(CDVInvokedUrlCommand*)command{
    [_session disconnect];
}

// Called by session.publish(top, left)
- (void)publish:(CDVInvokedUrlCommand*)command{
    NSLog(@"iOS Publish stream to session");
    self.callbackID = command.callbackId;
    [_session publish:_publisher];
    
    // Return to Javascript
    CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
    [self.commandDelegate sendPluginResult:pluginResult callbackId:self.callbackID];
}

// Called by session.unpublish(...)
- (void)unpublish:(CDVInvokedUrlCommand*)command{
    NSLog(@"iOS Unpublishing publisher");
    [_session unpublish:_publisher];
}

// Called by session.subscribe(streamId, top, left)
- (void)subscribe:(CDVInvokedUrlCommand*)command{
    NSLog(@"iOS subscribing to stream");
    
    // Get Parameters
    self.callbackID = command.callbackId;
    NSString* sid = [command.arguments objectAtIndex:0];
   
    
    int top = [[command.arguments objectAtIndex:1] intValue];
    int left = [[command.arguments objectAtIndex:2] intValue];
    int width = [[command.arguments objectAtIndex:3] intValue];
    int height = [[command.arguments objectAtIndex:4] intValue];
    NSString* tmp = [command.arguments objectAtIndex:5];
    int zIndex = [[command.arguments objectAtIndex:6] intValue];
    
    // Acquire Stream, then create a subscriber object and put it into dictionary
    OTStream* myStream = [streamDictionary objectForKey:sid];
    OTSubscriber* sub = [[OTSubscriber alloc] initWithStream:myStream delegate:self];
    [subscriberDictionary setObject:sub forKey:myStream.streamId];
    
    [sub.view setFrame:CGRectMake(left, top, width, height)];
    if (zIndex>0) {
        sub.view.layer.zPosition = zIndex;
    }
    [self.webView.superview addSubview:sub.view];
    
    // Return to JS event handler
    CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
    [self.commandDelegate sendPluginResult:pluginResult callbackId:self.callbackID];
}

// Called by session.subscribe(streamId, top, left)
- (void)unsubscribe:(CDVInvokedUrlCommand*)command{
    NSLog(@"iOS unSubscribing to stream");
    //Get Parameters
    NSString* sid = [command.arguments objectAtIndex:0];
    OTSubscriber * subscriber = [subscriberDictionary objectForKey:sid];
    [subscriber close];
    subscriber = nil;
    [subscriberDictionary removeObjectForKey:sid];
}


/*** Subscriber Methods
 ****/
- (void)subscriberDidConnectToStream:(OTSubscriber*)sub{
    NSLog(@"iOS Connected To Stream");
     
}

- (void)subscriber:(OTSubscriber*)subscrib didFailWithError:(NSError*)error{
    CDVPluginResult* callbackResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString: subscrib.stream.connection.connectionId];
    [callbackResult setKeepCallbackAsBool:YES];
    //    [self.commandDelegate [callbackResult toSuccessCallbackString:self.streamDisconnectedId]];
}



// OTSession Connection Delegates
- (void)sessionDidConnect:(OTSession*)session{
    NSLog(@"iOS Connected to Session");
    
    NSMutableDictionary* sessionDict = [[NSMutableDictionary alloc] init];
    
    // SessionConnectionStatus
    NSString* connectionStatus = @"";
    if (session.sessionConnectionStatus==OTSessionConnectionStatusConnected) {
        connectionStatus = @"OTSessionConnectionStatusConnected";
    }else if (session.sessionConnectionStatus==OTSessionConnectionStatusConnecting) {
        connectionStatus = @"OTSessionConnectionStatusConnecting";
    }else if (session.sessionConnectionStatus==OTSessionConnectionStatusDisconnected) {
        connectionStatus = @"OTSessionConnectionStatusDisconnected";
    }else{
        connectionStatus = @"OTSessionConnectionStatusFailed";
    }
    [sessionDict setObject:connectionStatus forKey:@"sessionConnectionStatus"];
    
    // SessionId
    [sessionDict setObject:session.sessionId forKey:@"sessionId"];
    
    // Session ConnectionCount
    NSString* strInt = [NSString stringWithFormat:@"%d", session.connectionCount];
    [sessionDict setObject:strInt forKey:@"connectionCount"];
    
    // SessionStreams
    NSMutableArray* streamsArray = [[NSMutableArray alloc] init];
    for(id key in session.streams){
        OTStream* aStream = [session.streams objectForKey:key];
        [streamDictionary setObject:aStream forKey:aStream.streamId];

        NSMutableDictionary* streamInfo = [[NSMutableDictionary alloc] init];
        [streamInfo setObject:aStream.streamId forKey:@"streamId"];
        
        NSMutableDictionary* connectionInfo = [[NSMutableDictionary alloc] init];
        [connectionInfo setObject:aStream.connection.connectionId forKey:@"streamId"];
        [streamInfo setObject:connectionInfo forKey:@"connection"];
        [streamsArray addObject: streamInfo];
    }
    [sessionDict setObject:streamsArray forKey:@"streams"];
    
    // After session is successfully connected, the connection property is available
    NSMutableDictionary* connection = [[NSMutableDictionary alloc] init];
    [connection setObject:session.connection.connectionId forKey:@"connectionId"];
    NSString* strDate= [NSString stringWithFormat:@"%.0f", [session.connection.creationTime timeIntervalSince1970]];
    [connection setObject:strDate forKey:@"creationTime"];
    [sessionDict setObject:connection forKey:@"connection"];
    
    
    // Session Environment
    // Changed to production by default
    [sessionDict setObject:@"production" forKey:@"environment"];
    
    NSLog(@"object for session is %@", sessionDict);
    
    // After session dictionary is constructed, return the result!
    CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary:sessionDict];
    [self.commandDelegate sendPluginResult:pluginResult callbackId:self.callbackID];
}
- (void)session:(OTSession*)mySession didReceiveStream:(OTStream*)stream{
    NSLog(@"iOS Received Stream");

    // Store stream in streamDictionary, keeps track of available streams
    [streamDictionary setObject:stream forKey:stream.streamId];
    
    // Set up result, trigger JS event handler
    NSString* result = [[NSString alloc] initWithFormat:@"%@ %@", stream.connection.connectionId, stream.streamId];
    CDVPluginResult* callbackResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString: result];
    [callbackResult setKeepCallbackAsBool:YES];
    //[self.commandDelegate [callbackResult toSuccessCallbackString:self.streamCreatedId];
    [self.commandDelegate sendPluginResult:callbackResult callbackId:self.streamCreatedId];
}
- (void)session:(OTSession*)session didFailWithError:(NSError*)error {
    NSLog(@"Error: Session did not Connect");
    NSLog(@"Error: %@", error);
    NSNumber* code = [NSNumber numberWithInt:[error code]];
    NSMutableDictionary* err = [[NSMutableDictionary alloc] init];
    [err setObject:error.localizedDescription forKey:@"message"];
    [err setObject:code forKey:@"code"];
    
    if (self.exceptionId) {
        CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary: err];
        [pluginResult setKeepCallbackAsBool:YES];
        [self.commandDelegate sendPluginResult:pluginResult callbackId:self.exceptionId];
    }
}
- (void)sessionDidDisconnect:(OTSession*)session{
    NSString* alertMessage = [NSString stringWithFormat:@"Session disconnected: (%@)", session.sessionId];
    NSLog(@"sessionDidDisconnect (%@)", alertMessage);
    
    // Setting up event object
    NSMutableDictionary* event = [[NSMutableDictionary alloc] init];
    [event setObject:@"networkDisconnected" forKey:@"reason"];
    [event setObject:@"sessionDisconnected" forKey:@"type"];    
    
    CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary:event];
    [pluginResult setKeepCallbackAsBool:YES];
    [self.commandDelegate sendPluginResult:pluginResult callbackId:self.sessionDisconnectedId];
}
- (void)session:(OTSession*)session didDropStream:(OTStream*)stream{
    NSLog(@"iOS Drop Stream");
    NSString* result = [[NSString alloc] initWithFormat:@"%@ %@", stream.connection.connectionId, stream.streamId];
    CDVPluginResult* callbackResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString: result];
    [callbackResult setKeepCallbackAsBool:YES];
    [self.commandDelegate sendPluginResult:callbackResult callbackId:self.streamDisconnectedId];
}


// Called by addEventListener() for session/stream Disconnected
-(void)streamDisconnectedHandler:(CDVInvokedUrlCommand*)command{
    NSLog(@"iOS Adding Stream Destroyed Event Listener");
    self.streamDisconnectedId = command.callbackId;
}

-(void)sessionDisconnectedHandler:(CDVInvokedUrlCommand*)command{
    self.sessionDisconnectedId = command.callbackId;
}


// Helper function to update Views
- (void)updateView:(CDVInvokedUrlCommand*)command{
    NSString* callback = command.callbackId;
    NSString* sid = [command.arguments objectAtIndex:0];
    int top = [[command.arguments objectAtIndex:1] intValue];
    int left = [[command.arguments objectAtIndex:2] intValue];
    int width = [[command.arguments objectAtIndex:3] intValue];
    int height = [[command.arguments objectAtIndex:4] intValue];
    int zIndex = [[command.arguments objectAtIndex:5] intValue];
    if ([sid isEqualToString:@"TBPublisher"]) {
        NSLog(@"The Width is: %d", width);
        _publisher.view.frame = CGRectMake(left, top, width, height);
        _publisher.view.layer.zPosition = zIndex;
    }

    // Pulls the subscriber object from dictionary to prepare it for update
    OTSubscriber* streamInfo = [subscriberDictionary objectForKey:sid];
    
    if (streamInfo) {
        // Reposition the video feeds!
        streamInfo.view.frame = CGRectMake(left, top, width, height);
        streamInfo.view.layer.zPosition = zIndex;
    }
    
    CDVPluginResult* callbackResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
    [callbackResult setKeepCallbackAsBool:YES];
    //[self.commandDelegate sendPluginResult:callbackResult toSuccessCallbackString:command.callbackId];
    [self.commandDelegate sendPluginResult:callbackResult callbackId:command.callbackId];
}



/***** Errors
 ****/
- (void)publisher:(OTPublisher*)publisher didFailWithError:(NSError*) error {
    NSLog(@"iOS Publisher didFailWithError");
    NSMutableDictionary* err = [[NSMutableDictionary alloc] init];
    [err setObject:error.localizedDescription forKey:@"message"];
    
    CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary: err];
    [pluginResult setKeepCallbackAsBool:YES];
    [self.commandDelegate sendPluginResult:pluginResult callbackId:self.exceptionId];
}

/**** End of Errors
 ****/



- (void)TBTesting:(CDVInvokedUrlCommand*)command{
    if (!self.exceptionId) {
        self.exceptionId = command.callbackId;
    }
    
    NSMutableDictionary* err = [[NSMutableDictionary alloc] init];
    [err setObject:@"HMMM Test Error!" forKey:@"message"];
    
    CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary: err];
    [pluginResult setKeepCallbackAsBool:YES];
    [self.commandDelegate sendPluginResult:pluginResult callbackId:self.exceptionId];
}


/***** Notes
 
 
 NSString *stringObtainedFromJavascript = [command.arguments objectAtIndex:0];
 CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString: stringObtainedFromJavascript];
 
 if(YES){
 [self.commandDelegate sendPluginResult:pluginResult callbackId:self.callbackID]];
 }else{
 //Call  the Failure Javascript function
 [self.commandDelegate [pluginResult toErrorCallbackString:self.callbackID]];  
 }
 
******/


@end
