//
//  OTStream.h
//  opentok-ios-sdk
//
//  Created by Charley Robinson on 11/2/11.
//  Copyright (c) 2011 Tokbox, Inc. All rights reserved.
//

#import <Foundation/Foundation.h>

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
 * The type of the stream. This value can be `"basic"`, `"multiplexed"`, or `"archive"`.
 * The value `"basic"` identifies a stream published by a user connected to the session.
 * The value `"multiplexed"` identifies a multiplexed stream, created by the OpenTok server.
 * The value `"archive"` identifies an archive stream (from an archive being played back).
 */
@property(readonly) NSString* type;

/**
 * The timestamp for the creation of the stream on the OpenTok media server.
 */
@property(readonly) NSDate *creationTime;

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

@end
