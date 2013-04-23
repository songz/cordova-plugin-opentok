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

@interface OpenTokPlugin : CDVPlugin <OTSessionDelegate, OTPublisherDelegate, OTSubscriberDelegate>

@property(nonatomic, copy) NSString* callbackID;
@property(nonatomic, copy) NSString* streamCreatedId;
@property(nonatomic, copy) NSString* streamDisconnectedId;
@property(nonatomic, copy) NSString* sessionDisconnectedId;
@property(nonatomic, copy) NSString* exceptionId;

// Tokbox Library Functions
// TB
- (void)initPublisher:(CDVInvokedUrlCommand*)command;
-(void)initSession:(CDVInvokedUrlCommand*)command;

// Publisher
- (void)destroy:(CDVInvokedUrlCommand*)command;

-(void)streamCreatedHandler:(CDVInvokedUrlCommand*)command;
-(void)connect:(CDVInvokedUrlCommand*)command;
-(void)disconnect:(CDVInvokedUrlCommand*)command;
- (void)publish:(CDVInvokedUrlCommand*)command;
- (void)unpublish:(CDVInvokedUrlCommand*)command;
- (void)subscribe:(CDVInvokedUrlCommand*)command;
- (void)unsubscribe:(CDVInvokedUrlCommand*)command;

// Listeners
-(void)streamDisconnectedHandler:(CDVInvokedUrlCommand*)command;
-(void)sessionDisconnectedHandler:(CDVInvokedUrlCommand*)command;
-(void)exceptionHandler:(CDVInvokedUrlCommand*)command;

// HouseKeeping
- (void)updateView:(CDVInvokedUrlCommand*)command;



- (void)TBTesting:(CDVInvokedUrlCommand*)command;

@end


