//
//  OTSubscriber.h
//  OpenTok iOS SDK
//
//  Copyright (c) 2013 Tokbox, Inc. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <OpenTok/OpenTok.h>

@class OTVideoView;

/**
 * Renders OpenTok streams, and provides a UIView that renders video and
 * provides some simple end-user controls.
 *
 * To use this class, you must add the XCode -ObjC flag to the "Other Linker
 * Flags" build setting. (This class uses a third-party library that uses
 * Objective-C categories.)
 */
@interface OTSubscriber : OTSubscriberKit

/**
 * The view containing a playback buffer for associated video data. Add this
 * view to your view heirarchy to display a video stream.
 */
@property(readonly) UIView* view;

@end
