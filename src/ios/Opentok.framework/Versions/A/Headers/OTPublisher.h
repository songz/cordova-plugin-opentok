//
//  OTPublisher.h
//  opentok-ios-sdk
//
//  Created by Charley Robinson on 10/24/11.
//  Copyright (c) 2011 Tokbox, Inc. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>
#import <AVFoundation/AVFoundation.h>
#import "Opentok.h"

@class OTError;

@protocol OTPublisherDelegate;

/**
 * A publisher captures an audio-video stream from the device's microphone and camera. You can then
 * publish the audio-video stream to an OpenTok session by sending the <[OTSession publish:]>
 * message.
 *
 * The OpenTok iOS SDK supports publishing on all devices, except the iPhone 3GS.
 * see "Developer and client requirements" in the README file for
 * [the OpenTok iOS SDK](https://github.com/opentok/opentok-ios-sdk) or for
 * [the OpenTok on WebRTC iOS SDK](https://github.com/opentok/opentok-ios-sdk-webrtc).
 */
@interface OTPublisher : NSObject 

/** @name Initializing a publisher */

/**
 * Initialize a publisher object and specify the delegate object.
 *
 * When running in the XCode iOS Simulator, this method returns `nil`.
 *
 * @param delegate The delegate (<OTPublisherDelegate>) object for the publisher.
 *
 * @return The pointer to the instance, or `nil` if initialization failed.
 */
- (id)initWithDelegate:(id<OTPublisherDelegate>)delegate;
/**
 * Initialize a publisher object, and specify the delegate object and the stream's name.
 *
 * When running in the XCode iOS Simulator, this method returns `nil`.
 *
 * @param delegate The delegate (<OTPublisherDelegate>) object for the publisher.
 *
 * @param name  The name for this stream. This string is displayed at the bottom of publisher
 * videos and at the bottom of subscriber videos associated with the published stream.
 *
 * @return The pointer to the instance, or `nil` if initialization failed.
 */
- (id)initWithDelegate:(id<OTPublisherDelegate>)delegate name:(NSString*)name;

/** @name Getting information about the publisher */

/**
 * The <OTPublisherDelegate> object, which is the delegate for the OTPublisher object.
 */
@property(nonatomic, weak) id<OTPublisherDelegate> delegate;

/**
 * The session that owns this publisher.
 */
@property(readonly) OTSession* session;

/**
 * The view for this publisher. If this view becomes visible, it will 
 * display a preview of the active camera feed.
 */
@property(readonly) OTVideoView* view;

/**
 * A string that will be associated with this publisher's stream. This string is displayed at the bottom of publisher
 * videos and at the bottom of subscriber videos associated with the published stream. You can set this name after
 * initializing the publisher and before sending the <[OTSession publish:]> message. Setting the property after
 * sending the <[OTSession publish:]> message has no effect on the name displayed for the stream.
 * 
 * Note that you can also set the name when you send the <[OTPublisher initWithDelegate:name:]> message.
 * 
 * This value defaults to an empty string.
 */
@property(nonatomic, copy) NSString* name;

/** @name Controlling audio and video output for a publisher */

/**
 * Whether to publish audio. 
 *
 * The default value is TRUE.
 */
@property(atomic) BOOL publishAudio;
 
/**
 * Whether to publish video. 
 *
 * The default value is TRUE.
 */
@property(atomic) BOOL publishVideo;

/** @name Setting publisher device configuration */

/**
 * The preferred camera position. When setting this property, if the change is possible, the publisher
 * will use the camera with the specified position. If the publisher has begun publishing, getting
 * this property returns the current camera position; if the publisher has not yet begun publishing,
 * getting this property returns the preferred camera position.
 */
@property(atomic) AVCaptureDevicePosition cameraPosition;

@end


/**
 * Used for sending messages for an OTPublisher instance. The OTPublisher class includes a
 * `delegate` property. When you send the <[OTPublisher initWithDelegate:]> message or the
 * <[OTPublisher initWithDelegate:name:]> message, you specify an OTSessionDelegate object.
 */
@protocol OTPublisherDelegate <NSObject>

/**
 * Sent if the publisher encounters an error. After this message is sent, 
 * the publisher can be considered fully detached from a session and may
 * be released.
 * @param publisher The publisher that signalled this event.
 * @param error The error (an <OTError> object). The `OTPublisherErrorCode` enum (defined in the OTError class)
 * defines values for the `code` property of this object.
 */
- (void)publisher:(OTPublisher*)publisher didFailWithError:(OTError*)error;

@optional

/**
 * Sent when the publisher begins streaming device capture data to a session. Note that the session
 * delegate will also receive an <[OTSessionDelegate session:didReceiveStream:]> message for your publisher's stream.
 * @param publisher The publisher that signalled this event.
 */
-(void)publisherDidStartStreaming:(OTPublisher*)publisher;

/**
 * Sent when the publisher stops streaming device capture data to a session. Note that the session
 * delegate will also receive an <[OTSessionDelegate session:didDropStream:]> message for your publisher's stream.
 * @param publisher The publisher that signalled this event.
 */
-(void)publisherDidStopStreaming:(OTPublisher*)publisher;

/**
 * Sent when the camera device is changed.
 * @param publisher The publisher that signalled this event.
 * @param position The new camera position.
 */
-(void)publisher:(OTPublisher*)publisher didChangeCameraPosition:(AVCaptureDevicePosition)position;

@end