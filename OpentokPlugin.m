//
//  OpentokPlugin.m
//  opentokTest
//
//  Created by Song Zheng on 4/19/12.
//  Copyright (c) 2012 __MyCompanyName__. All rights reserved.
//

#import "OpentokPlugin.h"

@implementation OpentokPlugin{
    OTSession* _session;
    OTPublisher* _publisher;
    OTSubscriber* _subscriber;
    int subscriberTop;
    int subscriberLeft;
}
static double widgetHeight = 240;
static double widgetWidth = 320;

static NSString* const kApiKey = @"1127";
static NSString* const kToken = @"devtoken";
static NSString* const kSessionId = @"1_MX4xMjMyMDgxfjcyLjUuMTY3LjE0OH4yMDEyLTA0LTE3IDEzOjA5OjQxLjEyNDc3OSswMDowMH4wLjg4ODcwMzk2Njc2OH4";

@synthesize callbackID;
@synthesize streamCreatedHandler;
@synthesize streamDisconnectedId;
@synthesize allStreams;

// Called by TB.initsession()
-(void)initSession:(NSMutableArray*)arguments withDict:(NSMutableDictionary*)options{
    NSLog(@"iOS Initializing Session");
    
    // Get Parameters
    self.callbackID = [arguments pop];
    NSString* sessionId = [arguments objectAtIndex:0];
    
    // Create Session
    _session = [[OTSession alloc] initWithSessionId:sessionId delegate:self];
    
    // Return Result
    CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
    [self writeJavascript: [pluginResult toSuccessCallbackString:self.callbackID]];
}

// Called by addEventListener() for streamCreated
- (void)addStreamCreatedEvent:(NSMutableArray*)arguments withDict:(NSMutableDictionary*)options{
    NSLog(@"iOS Adding Stream Created Event Listener");
    self.streamCreatedHandler = [arguments pop];
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
-(void)disconnect:(NSMutableArray*)arguments withDict:(NSMutableDictionary*)options{
    [_session disconnect];
}

// Delegate for sessionConnect
- (void)sessionDidConnect:(OTSession*)session
{
    NSLog(@"iOS Connected to Session");
    
    // Execute Session Connected Handler
    CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:session.connection.connectionId];
    [self writeJavascript: [pluginResult toSuccessCallbackString:self.callbackID]];
}

// Delegate for session disconnect
- (void)sessionDidDisconnect:(OTSession*)session
{
    NSString* alertMessage = [NSString stringWithFormat:@"Session disconnected: (%@)", session.sessionId];
    NSLog(@"sessionDidDisconnect (%@)", alertMessage);
}

// Called by session.publish(top, left)
- (void)publish:(NSMutableArray*)arguments withDict:(NSMutableDictionary*)options{
    NSLog(@"iOS session Publishing");
    
    // Get Parameters
    self.callbackID = [arguments pop];
    int top = [[arguments objectAtIndex:0] intValue];
    int left = [[arguments objectAtIndex:1] intValue];
    
    // Publish and set View
    _publisher = [[OTPublisher alloc] initWithDelegate:self];
    [_publisher setName:[[UIDevice currentDevice] name]];
    [_session publish:_publisher];
    [self.webView.superview addSubview:_publisher.view];
    [_publisher.view setFrame:CGRectMake(left, top, widgetWidth, widgetHeight)];
    
    // Return to Javascript
    CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
    [self writeJavascript: [pluginResult toSuccessCallbackString:self.callbackID]];
}
- (void)unpublish:(NSMutableArray*)arguments withDict:(NSMutableDictionary*)options{
    NSLog(@"iOS Unpublishing publisher");
    [_session unpublish:_publisher];
}

// Delegate for receiving Streams
- (void)session:(OTSession*)mySession didReceiveStream:(OTStream*)stream{
    NSLog(@"iOS Received Stream");
    
    // Create StreamInfo object:
    OpentokStreamInfo* streamInfo = [[OpentokStreamInfo alloc] init];
    streamInfo.stream = stream;
    
    // Create/add an array of streams
    if (!allStreams) {
        allStreams = [[NSMutableArray alloc] initWithObjects:streamInfo,nil];
    }else {
        NSLog(@"Allstreams array: %@",allStreams);
        [allStreams addObject:streamInfo];
    }
    
    // Set up result, trigger JS event handler
    NSString* result = [[NSString alloc] initWithFormat:@"%@ %@", stream.connection.connectionId, stream.streamId];
    CDVPluginResult* callbackResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString: result];
    [callbackResult setKeepCallbackAsBool:YES];
    [self writeJavascript: [callbackResult toSuccessCallbackString:self.streamCreatedHandler]];
}

// Called by session.subscribe(streamId, top, left)
- (void)subscribe:(NSMutableArray*)arguments withDict:(NSMutableDictionary*)options{
    NSLog(@"iOS scribing to stream");
    
    // Get Parameters
    self.callbackID = [arguments pop];
    NSString* sid = [arguments objectAtIndex:0];
    int top = [[arguments objectAtIndex:1] intValue];
    int left = [[arguments objectAtIndex:2] intValue];
    
    // Iterate through all streams, subscribe to the correct one
    for (OpentokStreamInfo* streamInfo in allStreams) {
        if ([streamInfo.stream.connection.connectionId isEqualToString: sid]) {
            // Setup Parameter
            subscriberTop = top;
            subscriberLeft = left;
            _subscriber = [[OTSubscriber alloc] initWithStream:streamInfo.stream delegate:self];
            streamInfo.subscriber = _subscriber;
            streamInfo.top = subscriberTop;
            streamInfo.left = subscriberLeft;
            streamInfo.width = widgetWidth;
            streamInfo.height = widgetHeight;
        }
    }
    
    // Return to JS event handler
    CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
    [self writeJavascript: [pluginResult toSuccessCallbackString:self.callbackID]];
}

// Delegate for Stream connected
- (void)subscriberDidConnectToStream:(OTSubscriber*)subscriber
{
    NSLog(@"iOS Connected To Stream");
    
    // Create a View to be drawn
    [subscriber.view setFrame:CGRectMake(subscriberLeft, subscriberTop, widgetWidth, widgetHeight)];
    [self.webView.superview addSubview:subscriber.view];
}

// Delegate for Stream Dropped
- (void)session:(OTSession*)session didDropStream:(OTStream*)stream{
    NSLog(@"iOS Drop Stream");
    CDVPluginResult* callbackResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString: stream.connection.connectionId];
    [callbackResult setKeepCallbackAsBool:YES];
    [self writeJavascript: [callbackResult toSuccessCallbackString:self.streamDisconnectedId]];
}



/**** Housekeeping
 *******************
 ****/
-(void)streamDisconnectedHandler:(NSMutableArray*)arguments withDict:(NSMutableDictionary*)options{
    self.streamDisconnectedId = [arguments pop];
}

- (void)updateView:(NSMutableArray*)arguments withDict:(NSMutableDictionary*)options{
    self.callbackID = [arguments pop];
    NSString* cid = [arguments objectAtIndex:0];
    int top = [[arguments objectAtIndex:1] intValue];
    int left = [[arguments objectAtIndex:2] intValue];
    for (OpentokStreamInfo* streamInfo in allStreams) {
        if ([streamInfo.stream.connection.connectionId isEqualToString: cid]) {
            // Setup Translate, and update coordinates
            CGAffineTransform xform = CGAffineTransformMakeTranslation(left-streamInfo.left, top-streamInfo.top);
            streamInfo.top = top;
            streamInfo.left = left;
            streamInfo.subscriber.view.transform = xform;
        }
    }    
    CDVPluginResult* callbackResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
    [callbackResult setKeepCallbackAsBool:YES];
    [self writeJavascript: [callbackResult toSuccessCallbackString:self.callbackID]];
}



/***** Errors
 ****/
- (void)publisher:(OTPublisher*)publisher didFailWithError:(NSError*) error {
    NSLog(@"publisher didFailWithError %@", error);
}

- (void)subscriber:(OTSubscriber*)subscriber didFailWithError:(NSError*)error
{
    NSLog(@"subscriber %@ didFailWithError %@", subscriber.stream.streamId, error);
    CDVPluginResult* callbackResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString: subscriber.stream.connection.connectionId];
    [callbackResult setKeepCallbackAsBool:YES];
    [self writeJavascript: [callbackResult toSuccessCallbackString:self.streamDisconnectedId]];
}

- (void)session:(OTSession*)session didFailWithError:(NSError*)error {
    NSLog([NSString stringWithFormat:@"There was an error connecting to session %@", session.sessionId]);
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
