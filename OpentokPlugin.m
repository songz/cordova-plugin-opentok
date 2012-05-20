//
//  OpentokPlugin.m
//  opentokTest
//
//  Created by Song Zheng on 4/19/12.
//  Copyright (c) 2012 __MyCompanyName__. All rights reserved.
//

#import "OpentokPlugin.h"



@implementation OpentokStreamInfo

@synthesize height;
@synthesize width;
@synthesize top;
@synthesize left;
@synthesize name;
@synthesize stream;
@synthesize subscriber;
@synthesize env;
@synthesize subscribeToVideo;

- (void)setInfo:(NSMutableArray*)arguments withEnv:(OpentokPlugin*)environment{    
    
    self.top = [[arguments objectAtIndex:1] intValue];
    self.left = [[arguments objectAtIndex:2] intValue];
    self.width = [[arguments objectAtIndex:3] intValue];
    self.height = [[arguments objectAtIndex:4] intValue];
    self.subscribeToVideo = [arguments objectAtIndex:5];
    
    NSLog(@" Setting Info, top: %d, height: %d, SubscribeToVid: %@", self.top, self.height, self.subscribeToVideo);
    
    
    self.subscriber = [[OTSubscriber alloc] initWithStream:self.stream delegate:self];
    self.env = environment;
    if ([self.subscribeToVideo isEqualToString:@"false"]) {
        [self.subscriber setSubscribeToVideo:NO];
    }
}

- (void)subscriberDidConnectToStream:(OTSubscriber*)subs
{
    NSLog(@"iOS Connected To Stream");
    
    // Create a View to be drawn
    if([self.subscribeToVideo isEqualToString:@"true"]){
        [subs.view setFrame:CGRectMake(self.left, self.top, self.width, self.height)];
        [env.webView.superview addSubview:subscriber.view];
    }else {
        //_subscribeToVideo=YES;
    }
}

- (void)subscriber:(OTSubscriber*)subscrib didFailWithError:(NSError*)error
{
    NSLog(@"subscriber %@ didFailWithError %@", subscriber.stream.streamId, error);
    CDVPluginResult* callbackResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString: subscrib.stream.connection.connectionId];
    [callbackResult setKeepCallbackAsBool:YES];
    //    [self writeJavascript: [callbackResult toSuccessCallbackString:self.streamDisconnectedId]];
}

@end




@implementation OpentokPlugin{
    OTSession* _session;
    OTPublisher* _publisher;
    OTSubscriber* _subscriber;
    NSMutableDictionary *streamDictionary;
}

@synthesize callbackID;
@synthesize streamDisconnectedId;
@synthesize streamCreatedId;
@synthesize sessionDisconnectedId;
@synthesize exceptionId;

// Called by TB.addEventListener('exception', fun...)
-(void)exceptionHandler:(NSMutableArray*)arguments withDict:(NSMutableDictionary*)options{
    NSLog(@"iOS Added exception Event Handler");
    self.exceptionId = [arguments pop];
}

// Called by TB.initsession()
-(void)initSession:(NSMutableArray*)arguments withDict:(NSMutableDictionary*)options{
    NSLog(@"iOS Initializing Session");
    
    // Get Parameters
    self.callbackID = [arguments pop];
    NSString* sessionId = [arguments objectAtIndex:0];
    NSString* production = [arguments objectAtIndex:1];
    
    // Create Session
    if ([production isEqualToString:@"true"]) {
        _session = [[OTSession alloc] initWithSessionId:sessionId delegate:self environment:OTSessionEnvironmentProduction];
    }else {
        _session = [[OTSession alloc] initWithSessionId:sessionId delegate:self];
    }
    
    // Initialize Dictionary, contains DOM info for every stream
    streamDictionary = [[NSMutableDictionary alloc] init];
    
    // Return Result
    CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
    [self writeJavascript: [pluginResult toSuccessCallbackString:self.callbackID]];
}

// Called by addEventListener() for streamCreated
- (void)streamCreatedHandler:(NSMutableArray*)arguments withDict:(NSMutableDictionary*)options{
    NSLog(@"iOS Adding Stream Created Event Listener");
    self.streamCreatedId = [arguments pop];
}

// Called by session.connect(key, token)
-(void)connect:(NSMutableArray *)arguments withDict:(NSMutableDictionary *)options{
    NSLog(@"iOS Connecting to Session");
    
    // Get Parameters
    self.callbackID = [arguments pop];
    NSString* tbKey = [arguments objectAtIndex:0];
    NSString* tbToken = [arguments objectAtIndex:1];
    
    [_session connectWithApiKey:tbKey token:tbToken];
}

// Called by session.disconnect()
-(void)disconnect:(NSMutableArray*)arguments withDict:(NSMutableDictionary*)options{
    [_session disconnect];
}

// Called by session.publish(top, left)
- (void)publish:(NSMutableArray*)arguments withDict:(NSMutableDictionary*)options{
    NSLog(@"iOS session Publishing");
    BOOL bpubAudio = YES;
    BOOL bpubVideo = YES;
    
    // Get Parameters
    self.callbackID = [arguments pop];
    int top = [[arguments objectAtIndex:0] intValue];
    int left = [[arguments objectAtIndex:1] intValue];
    int width = [[arguments objectAtIndex:2] intValue];
    int height = [[arguments objectAtIndex:3] intValue];
    
    NSString* name = [arguments objectAtIndex:4];
    if ([name isEqualToString:@""]) {
        name = [[UIDevice currentDevice] name];
    }
    
    NSString* publishAudio = [arguments objectAtIndex:5];
    if ([publishAudio isEqualToString:@"false"]) {
        bpubAudio = NO;
    }
    NSString* publishVideo = [arguments objectAtIndex:6];
    if ([publishVideo isEqualToString:@"false"]) {
        bpubVideo = NO;
    }    
    // Publish and set View
    _publisher = [[OTPublisher alloc] initWithDelegate:self name:name];
    [_publisher setPublishAudio:bpubAudio];
    [_publisher setPublishVideo:bpubVideo];
    [_session publish:_publisher];
    [self.webView.superview addSubview:_publisher.view];
    [_publisher.view setFrame:CGRectMake(left, top, width, height)];
    
    // Return to Javascript
    CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
    [self writeJavascript: [pluginResult toSuccessCallbackString:self.callbackID]];
}

// Called by session.unpublish(...)
- (void)unpublish:(NSMutableArray*)arguments withDict:(NSMutableDictionary*)options{
    NSLog(@"iOS Unpublishing publisher");
    [_session unpublish:_publisher];
}

// Called by session.subscribe(streamId, top, left)
- (void)subscribe:(NSMutableArray*)arguments withDict:(NSMutableDictionary*)options{
    NSLog(@"iOS scribing to stream");
    
    // Get Parameters
    self.callbackID = [arguments pop];
    NSString* sid = [arguments objectAtIndex:0];
    
    // Retrieve streamInfo from dictionary
    OpentokStreamInfo* sinfo = [streamDictionary objectForKey:sid];
    [sinfo setInfo:arguments withEnv:self];
    
    
    // Return to JS event handler
    CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
    [self writeJavascript: [pluginResult toSuccessCallbackString:self.callbackID]];
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
        [streamsArray addObject: [session.streams objectForKey:key]];
    }
    [sessionDict setObject:streamsArray forKey:@"streams"];
    
    // After session is successfully connected, the connection property is available
    NSMutableDictionary* connection = [[NSMutableDictionary alloc] init];
    [connection setObject:session.connection.connectionId forKey:@"connectionId"];
    NSString* strDate= [NSString stringWithFormat:@"%.0f", [session.connection.creationTime timeIntervalSince1970]];
    [connection setObject:strDate forKey:@"creationTime"];
    [sessionDict setObject:connection forKey:@"connection"];
    
    // Session Environment
    if (session.environment==OTSessionEnvironmentProduction) {
        [sessionDict setObject:@"production" forKey:@"environment"];
    }else {
        [sessionDict setObject:@"staging" forKey:@"environment"];
    }
    
    // After session dictionary is constructed, return the result!
    CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary:sessionDict];
    [self writeJavascript: [pluginResult toSuccessCallbackString:self.callbackID]];
}
- (void)session:(OTSession*)mySession didReceiveStream:(OTStream*)stream{
    NSLog(@"iOS Received Stream");
    
    // Create StreamInfo object:
    OpentokStreamInfo* streamInfo = [[OpentokStreamInfo alloc] init];
    streamInfo.stream = stream;
    
    // Add stream to Dictionary
    [streamDictionary setObject:streamInfo forKey:stream.streamId];
    
    
    NSLog(@"Connected Sessions: %@", _session.streams);
    
    // Set up result, trigger JS event handler
    NSString* result = [[NSString alloc] initWithFormat:@"%@ %@", stream.connection.connectionId, stream.streamId];
    CDVPluginResult* callbackResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString: result];
    [callbackResult setKeepCallbackAsBool:YES];
    [self writeJavascript: [callbackResult toSuccessCallbackString:self.streamCreatedId]];
}
- (void)session:(OTSession*)session didFailWithError:(NSError*)error {
    NSLog(@"iOS Session didFailWithError");
    NSMutableDictionary* err = [[NSMutableDictionary alloc] init];
    [err setObject:error.localizedDescription forKey:@"message"];
    
    CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary: err];
    [pluginResult setKeepCallbackAsBool:YES];
    [self writeJavascript: [pluginResult toSuccessCallbackString:self.exceptionId]];
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
    [self writeJavascript: [pluginResult toSuccessCallbackString:self.sessionDisconnectedId]];
}
- (void)session:(OTSession*)session didDropStream:(OTStream*)stream{
    NSLog(@"iOS Drop Stream");
    CDVPluginResult* callbackResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString: stream.streamId];
    [callbackResult setKeepCallbackAsBool:YES];
    [self writeJavascript: [callbackResult toSuccessCallbackString:self.streamDisconnectedId]];
}


// Called by addEventListener() for session/stream Disconnected
-(void)streamDisconnectedHandler:(NSMutableArray*)arguments withDict:(NSMutableDictionary*)options{
    self.streamDisconnectedId = [arguments pop];
}
-(void)sessionDisconnectedHandler:(NSMutableArray*)arguments withDict:(NSMutableDictionary*)options{
    self.sessionDisconnectedId = [arguments pop];
}

// Helper function to update Views
- (void)updateView:(NSMutableArray*)arguments withDict:(NSMutableDictionary*)options{
    self.callbackID = [arguments pop];
    NSString* sid = [arguments objectAtIndex:0];
    int top = [[arguments objectAtIndex:1] intValue];
    int left = [[arguments objectAtIndex:2] intValue];


    OpentokStreamInfo* streamInfo = [streamDictionary objectForKey:sid];
    if (streamInfo) {
        // Reposition the video feeds!
        CGAffineTransform xform = CGAffineTransformMakeTranslation(left-streamInfo.left, top-streamInfo.top);
        streamInfo.top = top;
        streamInfo.left = left;
        streamInfo.subscriber.view.transform = xform;
    }
    
    CDVPluginResult* callbackResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
    [callbackResult setKeepCallbackAsBool:YES];
    [self writeJavascript: [callbackResult toSuccessCallbackString:self.callbackID]];
}



/***** Errors
 ****/
- (void)publisher:(OTPublisher*)publisher didFailWithError:(NSError*) error {
    NSLog(@"iOS Publisher didFailWithError");
    NSMutableDictionary* err = [[NSMutableDictionary alloc] init];
    [err setObject:error.localizedDescription forKey:@"message"];
    
    CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary: err];
    [pluginResult setKeepCallbackAsBool:YES];
    [self writeJavascript: [pluginResult toSuccessCallbackString:self.exceptionId]];
}

/**** End of Errors
 ****/



/***** Notes
 
 
 NSString *stringObtainedFromJavascript = [arguments objectAtIndex:0];
 CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString: stringObtainedFromJavascript];
 
 if(YES){
 [self writeJavascript: [pluginResult toSuccessCallbackString:self.callbackID]];
 }else{
 //Call  the Failure Javascript function
 [self writeJavascript: [pluginResult toErrorCallbackString:self.callbackID]];  
 }
 
******/


@end
