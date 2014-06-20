//
//  OTStream.h
//
//  Copyright (c) 2014 Tokbox, Inc. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <QuartzCore/QuartzCore.h>

@class OTSession, OTConnection;

/**
 * An OTStream object represents a stream of multimedia, which may
 * contain video and/or audio data.
 *
 * Use OTStream instances to initialize <OTSubscriber> interfaces. Do not
 * attempt to initialize an OTStream directly.
 */
@interface OTStream : NSObject

/** @name Getting basic stream information */

/**
 * The <OTConnection> object corresponding to the connection that is publishing the stream.
 * You can compare this to to the <[OTSession connection]> property to see if the stream
 * is being published by the local device.
 */
@property(readonly) OTConnection* connection;

/**
 * The session (an <OTSession> object) the stream is bound to.
 */
@property(readonly) OTSession* session;

/**
 * The unique ID of the stream.
 */
@property(readonly) NSString* streamId;

/**
 * The timestamp for the creation of the stream on the OpenTok media server.
 */
@property(readonly) NSDate *creationTime;

/**
 * The name of the stream. In the OpenTok iOS SDK, you can specify a published stream's name
 * when you send the <[OTPublisherKit initWithDelegate:name:]> message.
 */
@property(readonly) NSString* name;

/** @name Getting audio and video information */

/**
 * Whether the stream is publishing audio (YES) or not (NO).
 * See <[OTPublisherKit publishAudio]> and <[OTSubscriberKit subscribeToAudio]>.
 */
@property(readonly) BOOL hasAudio;

/**
 * Whether the stream is publishing video (YES) or not (NO).
 * See <[OTPublisherKit publishVideo]> and <[OTSubscriberKit subscribeToVideo]>.
 */
@property(readonly) BOOL hasVideo;

/**
 * The current dimensions of the video media track on this stream. 
 * This property can change if a stream published from an
 * iOS device resizes, based on a change in the device orientation, or a change
 * in video resolution occurs.
 */
@property (readonly) CGSize videoDimensions;

@end
