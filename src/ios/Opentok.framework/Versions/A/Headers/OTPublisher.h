//
//  OTPublisher.h
//  OpenTok iOS SDK
//
//  Copyright (c) 2014 Tokbox, Inc. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>
#import <AVFoundation/AVFoundation.h>

@class OTError, OTPublisherKit;

@protocol OTPublisherDelegate;
@protocol OTPublisherKitDelegate;

/**
 * A publisher captures an audio-video stream from the device's microphone and 
 * camera. You can then publish the audio-video stream to an OpenTok session by
 * sending the <[OTSession publish:error:]> message.
 *
 * Use OTPublisherKit to interface with <[OTSession]> to push audio and video
 * to other peers or the OpenTok Cloud Media Router (aka. "Mantis").
 *
 * The OpenTok iOS SDK supports publishing on all multi-core iOS devices.
 * See "Developer and client requirements" in the README file for the
 * [OpenTok iOS SDK](http://tokbox.com/opentok/libraries/client/ios).
 */
@interface OTPublisher : OTPublisherKit

/**
 * The view for this publisher. If this view becomes visible, it will
 * display a preview of the active camera feed.
 */
@property(readonly) UIView* view;

/** @name Setting publisher device configuration */

/**
 * The preferred camera position. When setting this property, if the change is 
 * possible, the publisher will use the camera with the specified position. If
 * the publisher has begun publishing, getting this property returns the current
 * camera position; if the publisher has not yet begun publishing,
 * getting this property returns the preferred camera position.
 */
@property(nonatomic) AVCaptureDevicePosition cameraPosition;

@end

/**
 * Used for sending messages for an OTPublisher instance.
 */
@protocol OTPublisherDelegate <OTPublisherKitDelegate>

@optional
/**
 * Sent when the camera device is changed.
 *
 * @param publisher The publisher that signalled this event.
 * @param position The position of the new camera.
 */
-(void)publisher:(OTPublisher*)publisher
didChangeCameraPosition:(AVCaptureDevicePosition)position;

@end
