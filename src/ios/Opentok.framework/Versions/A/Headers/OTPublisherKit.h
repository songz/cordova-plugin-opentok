//
//  OTPublisherKit.h
//
//  Copyright (c) 2014 Tokbox, Inc. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <AVFoundation/AVFoundation.h>

@class OTPublisherKit, OTSession, OTError, OTStream;

@protocol OTVideoCapture;
@protocol OTVideoRender;
@protocol OTPublisherKitDelegate;
@protocol OTPublisherKitAudioLevelDelegate;

/**
 * A publisher captures an audio-video stream from the sources you specify. You
 * can then publish the audio-video stream to an OpenTok session by sending the
 * <[OTSession publish:error:]> message.
 *
 * The OpenTok iOS SDK supports publishing on all multi-core iOS devices.
 * See "Developer and client requirements" in the README file for the
 * [OpenTok iOS SDK](http://tokbox.com/opentok/libraries/client/ios).
 */
@interface OTPublisherKit : NSObject

/** @name Initializing a publisher */

/**
 * Initialize a publisher object and specify the delegate object.
 *
 * When running in the XCode iOS Simulator, this method returns `nil`.
 *
 * @param delegate The delegate (<OTPublisherKitDelegate>) object for the
 * publisher.
 *
 * @return The pointer to the instance, or `nil` if initialization failed.
 */
- (id)initWithDelegate:(id<OTPublisherKitDelegate>)delegate;

/**
 * Initialize a publisher object, and specify the delegate object and the 
 * stream's name.
 *
 * When running in the XCode iOS Simulator, this method returns `nil`.
 *
 * @param delegate The delegate (<OTPublisherKitDelegate>) object for the 
 * publisher.
 *
 * @param name  The name for this stream. This string is displayed at the
 * bottom of publisher
 * videos and at the bottom of subscriber videos associated with the published 
 * stream.
 *
 * @return The pointer to the instance, or `nil` if initialization failed.
 */
- (id)initWithDelegate:(id<OTPublisherKitDelegate>)delegate
                  name:(NSString*)name;

/** @name Getting information about the publisher */

/**
 * The <OTPublisherDelegate> object, which is the delegate for the OTPublisher
 * object.
 */
@property(nonatomic, assign) id<OTPublisherKitDelegate> delegate;

/**
 * Periodically receives reports of audio levels for this publisher.
 *
 * This is a separate delegate object from that set as the delegate property
 * (the OTPublisherKitDelegate object).
 *
 * If you do not set this property, the audio sampling subsystem is disabled.
 */
@property (nonatomic, assign)
id<OTPublisherKitAudioLevelDelegate> audioLevelDelegate;

/**
 * The session that owns this publisher.
 */
@property(readonly) OTSession* session;

/**
 * The <OTStream> object associated with the publisher.
 */
@property(readonly) OTStream* stream;

/**
 * A string that will be associated with this publisher's stream. This string is
 * displayed at the bottom of subscriber videos associated with the published
 * stream, if an overlay to display the name exists. 
 *
 * Name must be set at initialization, when you when you send the
 * <[OTPublisherKit initWithDelegate:name:]> message.
 *
 * This value defaults to an empty string.
 */
@property(readonly) NSString* name;

/** @name Controlling audio and video output for a publisher */

/**
 * Whether to publish audio.
 *
 * The default value is TRUE.
 */
@property(nonatomic) BOOL publishAudio;

/**
 * Whether to publish video.
 *
 * The default value is TRUE.
 */
@property(nonatomic) BOOL publishVideo;

/** @name Setting publisher device configuration */

/**
 * The <OTVideoCapture> instance used to capture video to stream to the OpenTok
 * session.
 */
@property(nonatomic, retain) id<OTVideoCapture> videoCapture;

/**
 * The <OTVideoRender> instance used to render video to stream to the OpenTok
 * session.
 */
@property(nonatomic, retain) id<OTVideoRender> videoRender;

@end


/**
 * Used for sending messages for an OTPublisher instance. The OTPublisher class
 * includes a `delegate` property. When you send the
 * <[OTPublisherKit initWithDelegate:]> message or the
 * <[OTPublisherKit initWithDelegate:name:]> message, you specify an 
 * OTSessionDelegate object.
 */
@protocol OTPublisherKitDelegate <NSObject>

/**
 * Sent if the publisher encounters an error. After this message is sent,
 * the publisher can be considered fully detached from a session and may
 * be released.
 * @param publisher The publisher that signalled this event.
 * @param error The error (an <OTError> object). The `OTPublisherErrorCode` 
 * enum (defined in the OTError class)
 * defines values for the `code` property of this object.
 */
- (void)publisher:(OTPublisherKit*)publisher didFailWithError:(OTError*)error;

@optional

/**
 * Sent when the publisher starts streaming.
 *
 * @param publisher The publisher of the stream.
 * @param stream The stream that was created.
 */
- (void)publisher:(OTPublisherKit*)publisher streamCreated:(OTStream*)stream;

/**
 * Sent when the publisher stops streaming.
 * @param publisher The publisher that stopped sending this stream.
 * @param stream The stream that ended.
 */
- (void)publisher:(OTPublisherKit*)publisher streamDestroyed:(OTStream*)stream;

@end

/**
 * Used for monitoring the audio levels of the publisher.
 */
@protocol OTPublisherKitAudioLevelDelegate <NSObject>

/**
 * Sent on a regular interval with the recent representative audio level.
 *
 * @param publisher The publisher instance being represented.
 * @param audioLevel A value between 0 and 1, representing the audio level.
 * Adjust this value logarithmically for use in a user interface
 * visualization of the volume (such as a volume meter).
 */
- (void)publisher:(OTPublisherKit*)publisher
audioLevelUpdated:(float)audioLevel;

@end

