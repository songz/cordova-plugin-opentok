//
//  OpentokStreamInfo.h
//  opentokTest
//
//  Created by Song Zheng on 4/24/12.
//  Copyright (c) 2012 __MyCompanyName__. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <Opentok/Opentok.h>

@interface OpentokStreamInfo : NSObject

@property int width;
@property int height;
@property int top;
@property int left;
@property NSString* name;
@property OTStream* stream;
@property OTSubscriber* subscriber;

@end
