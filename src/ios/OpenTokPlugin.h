//
//  OpentokPlugin.h
//
//  Copyright (c) 2012 TokBox. All rights reserved.
//  Please see the LICENSE included with this distribution for details.
//

#import <Foundation/Foundation.h>
#import <Cordova/CDVPlugin.h>
#import <UIKit/UIKit.h>
#import <Opentok/Opentok.h>

@interface OpenTokPlugin : CDVPlugin <OTSessionDelegate, OTPublisherDelegate, OTSubscriberKitDelegate>

@property(nonatomic, copy) NSString* exceptionId;

// Tokbox Library Functions
- (void)addEvent:(CDVInvokedUrlCommand*)command;

// TB
- (void)initPublisher:(CDVInvokedUrlCommand*)command;
-(void)initSession:(CDVInvokedUrlCommand*)command;
-(void)exceptionHandler:(CDVInvokedUrlCommand*)command;
- (void)updateView:(CDVInvokedUrlCommand*)command;

// Publisher
- (void)publishAudio:(CDVInvokedUrlCommand*)command;
- (void)publishVideo:(CDVInvokedUrlCommand*)command;
- (void)setCameraPosition:(CDVInvokedUrlCommand*)command;
- (void)destroyPublisher:(CDVInvokedUrlCommand*)command;

// Session
-(void)connect:(CDVInvokedUrlCommand*)command;
-(void)disconnect:(CDVInvokedUrlCommand*)command;
- (void)publish:(CDVInvokedUrlCommand*)command;
- (void)unpublish:(CDVInvokedUrlCommand*)command;
- (void)subscribe:(CDVInvokedUrlCommand*)command;
- (void)unsubscribe:(CDVInvokedUrlCommand*)command;


// HouseKeeping



- (void)TBTesting:(CDVInvokedUrlCommand*)command;

@end
