//
//  OTVideoView.h
//  opentok-ios-sdk
//
//  Created by Don Holly on 1/27/12.
//  Copyright (c) 2012 TokBox, Inc. All rights reserved.
//

#import <UIKit/UIKit.h>

/**
 * A generic view hierarchy for viewable objects with video in the OpenTok iOS SDK.
 */
@interface OTVideoView : UIView 

/**
 * This view holds the bottom bar of video panels. Included is a
 * nameplate showing the stream's name, and buttons for muting tracks
 * and (for a publisher) switching the camera.
 */
@property(readonly, strong) UIView* toolbarView;

/**
 * This view contains the video track for a stream, when available.
 * For subscribers, this view renders frames of the stream.
 * For publishers, this view renders frames as they are encoded to a stream.
 */
@property(readonly) UIView* videoView;

/**
 * Take a snapshot of the current video frame displayed
 *
 * @param block - a block that will be invoked upon a successful image capture with a resulting UIImage
 */

- (void)getImageWithBlock:(void (^)(UIImage* snapshot))block;

@end
