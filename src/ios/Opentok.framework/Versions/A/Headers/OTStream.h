//
//  OTStream.h
//  opentok-ios-sdk
//
//  Created by Charley Robinson on 11/2/11.
//  Copyright (c) 2011 Tokbox, Inc. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <QuartzCore/QuartzCore.h>

@class OTSession, OTConnection, Participant;

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
@property(readonly, strong) OTConnection* connection;

/**
 * The session (an <OTSession> object) the stream is bound to.
 */
@property(readonly) OTSession* session;

/**
 * The unique ID of the stream.
 */
@property(readonly, strong) NSString* streamId;

/**
 * The type of the stream. This value can be `"basic"` or `"archive"`.
 * The value `"basic"` identifies a stream published by a user connected to the session.
 * The value `"archive"` identifies an [archive stream](http://www.tokbox.com/opentok/docs/concepts/archiving.html)
 * (from an archive being played back).
 */
@property(readonly) NSString* type;

/**
 * The timestamp for the creation of the stream on the OpenTok media server.
 */
@property(readonly, strong) NSDate *creationTime;

/**
 * The name of the stream. In the OpenTok iOS SDK, you can specify a published stream's name
 * when you send the <[OTPublisher initWithDelegate:name:]> message.
 */
@property(readonly) NSString* name;

/** @name Getting audio and video information */

/**
 * Whether the stream is publishing audio (YES) or not (NO).
 * See <[OTPublisher publishAudio]> and <[OTSubscriber subscribeToAudio]>.
 */
@property(readonly) BOOL hasAudio;

/**
 * Whether the stream is publishing video (YES) or not (NO).
 * See <[OTPublisher publishVideo]> and <[OTSubscriber subscribeToVideo]>.
 */
@property(readonly) BOOL hasVideo;

/**
 * The current dimensions of the video media track on this stream. This property can change if a stream published from an
 * iOS device resizes, based on a change in the device orientation. When this occurs, the [OTSubscriberDelegate stream:didChangeVideoDimensions:] 
 * message is sent (for an OTSubscriber subscribing to the stream).
 *
 * This property is available for WebRTC only.
 */
@property (readonly) CGSize videoDimensions;

@end
