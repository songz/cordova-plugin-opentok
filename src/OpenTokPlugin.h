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
- (void)initPublisher:(NSMutableArray*)arguments withDict:(NSMutableDictionary*)options;
-(void)initSession:(NSMutableArray*)arguments withDict:(NSMutableDictionary*)options;

// Publisher
- (void)destroy:(NSMutableArray*)arguments withDict:(NSMutableDictionary*)options;

-(void)streamCreatedHandler:(NSMutableArray*)arguments withDict:(NSMutableDictionary*)options;
-(void)connect:(NSMutableArray*)arguments withDict:(NSMutableDictionary*)options;
-(void)disconnect:(NSMutableArray*)arguments withDict:(NSMutableDictionary*)options;
- (void)publish:(NSMutableArray*)arguments withDict:(NSMutableDictionary*)options;
- (void)unpublish:(NSMutableArray*)arguments withDict:(NSMutableDictionary*)options;
- (void)subscribe:(NSMutableArray*)arguments withDict:(NSMutableDictionary*)options;
- (void)unsubscribe:(NSMutableArray*)arguments withDict:(NSMutableDictionary*)options;

// Listeners
-(void)streamDisconnectedHandler:(NSMutableArray*)arguments withDict:(NSMutableDictionary*)options;
-(void)sessionDisconnectedHandler:(NSMutableArray*)arguments withDict:(NSMutableDictionary*)options;
-(void)exceptionHandler:(NSMutableArray*)arguments withDict:(NSMutableDictionary*)options;

// HouseKeeping
- (void)updateView:(NSMutableArray*)arguments withDict:(NSMutableDictionary*)options;



- (void)TBTesting:(NSMutableArray*)arguments withDict:(NSMutableDictionary*)options;

@end


