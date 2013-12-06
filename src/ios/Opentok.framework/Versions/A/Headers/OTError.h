//
//  OTError.h
//  opentok-ios-sdk
//
//  Created by Don Holly on 2/23/12.
//  Copyright (c) 2012 Tokbox, Inc. All rights reserved.
//

#define OT_SESSION_ERROR_DOMAIN @"OTSessionErrorDomain"
#define OT_PUBLISHER_ERROR_DOMAIN @"OTPublisherErrorDomain"
#define OT_SUBSCRIBER_ERROR_DOMAIN @"OTSubscriberErrorDomain"

typedef enum {
    OTAuthorizationFailure,         /* An invalid API key or token was provided */
    OTInvalidSessionId,             /* An invalid session ID was provided */
    OTConnectionFailed,             /* There was an error connecting to OpenTok services */
    OTNoMessagingServer,            /* No messaging server is available for this session */
    OTSDKUpdateRequired,            /* A new version of the OpenTok SDK is available and required to connect to this session */
    OTConnectionRefused,            /* A socket could not be opened to the messaging server. Check that outbound ports 5560 or 8080 are accessible */
    OTSessionStateFailed,           /* The connection timed out while attempting to get the session's state */
	OTP2PSessionUnsupported,        /* iOS does not currently support peer-to-peer OpenTok sessions */
    OTUnknownServerError,           /* The client was unable to communicate with the server, possibly due to a version incompatibility */
    OTP2PSessionRequired,           /* A peer-to-peer enabled session is required for WebRTC on iOS */
    OTP2PSessionMaxParticipants,    /* A peer-to-peer enabled session can only have two participants */
    OTSessionConnectionTimeout,     /* The connection timed out while attempting to connect to the session */
    OTSessionCompatibilityMismatch,  /* There was a mismatch with the session's capabilities. You're likely trying to connect iOS to a P2P Flash session on the web. */
	OTSessionSignalConnection /* There was an error sending the signal. Make sure the session is connected, the data parameter is of type NSDictionary, NSString, NSNumber, NSNull, or NSArray. Also make sure you did not exceed 1KB for the type and 8KB for the data. */
    
} OTSessionErrorCode;

typedef enum {
    OTNoMediaPublished,           /* Attempting to publish a stream with no audio or video */
    OTUserDeniedCameraAccess,     /* The user denied access to the camera during publishing */
    OTSessionDisconnected,        /* Attempting to publish to a disconnected session */
} OTPublisherErrorCode;

typedef enum {
    OTFailedToConnect,            /* Subscriber failed to connect to stream. Can reattempt connection */
    OTConnectionTimedOut,         /* Subscriber timed out while attempting to connect to stream. Can reattempt connection */
    OTNoStreamMedia,              /* The stream has no audio or video to subscribe to  */
    OTInitializationFailure,      /* Subscriber failed to initialize */
    OTInvalidStreamType,          /* The stream type is not currently supported by this version of the SDK */
    OTSelfSubscribeFailure        /* This version of the SDK cannot subscribe to its own streams */
} OTSubscriberErrorCode;

/**
 * The OTError class defines errors for the OpenTok iOS SDK. It extends the
 * [NSError](http://developer.apple.com/library/mac/#documentation/Cocoa/Reference/Foundation/Classes/NSError_Class/Reference/Reference.html) class.
 * 
 * The `OTPublisherErrorCode` enum defines values for the `code` property of the OTError object for errors
 * related to methods of the OTPublisher class:
 *
 * - `OTNoMediaPublished` -- Attempting to publish a stream with no audio or video.
 * - `OTUserDeniedCameraAccess` -- The user denied access to the camera during publishing.
 * - `OTSessionDisconnected` -- Attempting to publish to a disconnected session.
 *
 * The `OTSessionErrorCode` enum defines values for the `code` property of the OTError object for errors
 * related to methods of the OTSession class:
 *
 * - `OTAuthorizationFailure` - An invalid API key or token was provided.
 * - `OTInvalidSessionId` -- An invalid session ID was provided.
 * - `OTConnectionFailed` -- There was an error connecting to OpenTok services.
 * - `OTNoMessagingServer` -- No messaging server is available for this session.
 * - `OTSDKUpdateRequired` -- A new version of the OpenTok SDK is available and required to connect to this session.
 * - `OTConnectionRefused` -- A socket could not be opened to the messaging server. Check that outbound ports 5560 or 8080 are accessible
 * - `OTSessionStateFailed` -- The connection timed out while attempting to get the session's state
 * - `OTP2PSessionUnsupported` -- iOS does not currently support peer-to-peer OpenTok sessions.
 * - `OTUnknownServerError` -- The client was unable to communicate with the server, possibly due to a version incompatibility
 * - `OTP2PSessionRequired` -- A peer-to-peer enabled session is required to use this SDK
 * - `OTP2PSessionMaxParticipants` -- A peer-to-peer enabled session can only have two participants
 * - `OTSessionConnectionTimeout` -- The connection timed out while attempting to connect to the session
 * - `OTSessionCompatibilityMismatch` -- There was a mismatch with the session's capabilities. You're likely trying to connect iOS to
 * - `a P2P Flash session on the web.
 * - `OTSessionSignalConnection` -- There was an error sending the signal. Make sure the session is connected, the data parameter is of type NSDictionary, NSString, NSNumber, NSNull, or NSArray. Also make sure you did not exceed 1KB for the type and 8KB for the data.
 *
 *  The `OTSubscriberErrorCode` enum defines values for the `code` property of the OTError object for errors
 * related to methods of the OTSubscriber class:
 *
 * - `OTFailedToConnect` -- Subscriber failed to connect to stream. Can reattempt connection.
 * - `OTConnectionTimedOut` -- Subscriber timed out while attempting to connect to stream. Can reattempt connection.
 * - `OTNoStreamMedia` -- The stream has no audio or video to subscribe to.
 * - `OTInitializationFailure` -- Subscriber failed to initialize.
 * - `OTInvalidStreamType` -- The stream type is not currently supported by this version of the SDK.
 * - `OTSelfSubscribeFailure` -- This version of the SDK cannot subscribe to its own streams.
 */

@interface OTError : NSError

@end
