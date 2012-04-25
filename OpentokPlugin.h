//
//  OpentokPlugin.h
//  opentokTest
//
//  Created by Song Zheng on 4/19/12.
//  Copyright (c) 2012 __MyCompanyName__. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <Cordova/CDVPlugin.h>
#import <UIKit/UIKit.h>
#import <Opentok/Opentok.h>
#include "OpentokStreamInfo.h"

@interface OpentokPlugin : CDVPlugin <OTSessionDelegate, OTSubscriberDelegate, OTPublisherDelegate>{
    NSString* callbackID;
}


@property(nonatomic, copy) NSString* callbackID;
@property(nonatomic, copy) NSString* streamCreatedHandler;
@property(nonatomic, copy) NSString* streamDisconnectedId;
@property(nonatomic, copy) NSMutableArray* allStreams;

// Tokbox Library Functions
-(void)initSession:(NSMutableArray*)arguments withDict:(NSMutableDictionary*)options;
-(void)addStreamCreatedEvent:(NSMutableArray*)arguments withDict:(NSMutableDictionary*)options;
-(void)connect:(NSMutableArray*)arguments withDict:(NSMutableDictionary*)options;
-(void)disconnect:(NSMutableArray*)arguments withDict:(NSMutableDictionary*)options;
- (void)publish:(NSMutableArray*)arguments withDict:(NSMutableDictionary*)options;
- (void)unpublish:(NSMutableArray*)arguments withDict:(NSMutableDictionary*)options;
- (void)subscribe:(NSMutableArray*)arguments withDict:(NSMutableDictionary*)options;

// Housekeeping
-(void)streamDisconnectedHandler:(NSMutableArray*)arguments withDict:(NSMutableDictionary*)options;
- (void)updateView:(NSMutableArray*)arguments withDict:(NSMutableDictionary*)options;

@end


