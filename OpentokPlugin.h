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

@interface OpentokPlugin : CDVPlugin <OTSessionDelegate, OTPublisherDelegate>{
    NSString* callbackID;
}

@property(nonatomic, copy) NSString* callbackID;
@property(nonatomic, copy) NSString* streamCreatedId;
@property(nonatomic, copy) NSString* streamDisconnectedId;
@property(nonatomic, copy) NSString* sessionDisconnectedId;
@property(nonatomic, copy) NSString* exceptionId;

// Tokbox Library Functions
-(void)initSession:(NSMutableArray*)arguments withDict:(NSMutableDictionary*)options;
-(void)streamCreatedHandler:(NSMutableArray*)arguments withDict:(NSMutableDictionary*)options;
-(void)connect:(NSMutableArray*)arguments withDict:(NSMutableDictionary*)options;
-(void)disconnect:(NSMutableArray*)arguments withDict:(NSMutableDictionary*)options;
- (void)publish:(NSMutableArray*)arguments withDict:(NSMutableDictionary*)options;
- (void)unpublish:(NSMutableArray*)arguments withDict:(NSMutableDictionary*)options;
- (void)subscribe:(NSMutableArray*)arguments withDict:(NSMutableDictionary*)options;

// Listeners
-(void)streamDisconnectedHandler:(NSMutableArray*)arguments withDict:(NSMutableDictionary*)options;
-(void)sessionDisconnectedHandler:(NSMutableArray*)arguments withDict:(NSMutableDictionary*)options;
-(void)exceptionHandler:(NSMutableArray*)arguments withDict:(NSMutableDictionary*)options;

- (void)updateView:(NSMutableArray*)arguments withDict:(NSMutableDictionary*)options;

@end



// Stream Information
@interface OpentokStreamInfo : NSObject <OTSubscriberDelegate>

@property int width;
@property int height;
@property int top;
@property int left;
@property(nonatomic, strong) NSString* name;
@property(nonatomic, strong) OTStream* stream;
@property(nonatomic, strong) OTSubscriber* subscriber;
@property(nonatomic, strong) OpentokPlugin* env;
@property(nonatomic, strong) NSString* subscribeToVideo;


- (void)setInfo:(NSMutableArray*)arguments withEnv:(OpentokPlugin*)environment;

@end


