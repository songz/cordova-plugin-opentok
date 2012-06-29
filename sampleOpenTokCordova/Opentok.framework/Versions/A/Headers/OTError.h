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
    OTAuthorizationFailure,       /* An invalid API key or token was provided */
    OTInvalidSessionId,           /* An invalid session ID was provided */
    OTConnectionFailed,           /* There was an error connecting to OpenTok services */
    OTNoMessagingServer,          /* No messaging server is available for this session */
    OTSDKUpdateRequired,          /* A new version of the OpenTok SDK is available and required to connect to this session */
    OTP2PSessionUnsupported       /* iOS does not currently support Peer-to-Peer OpenTok sessions */
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
    OTInitializationFailure       /* Subscriber failed to initialize */
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
 * - `OTP2PSessionUnsupported` -- iOS does not currently support Peer-to-Peer OpenTok sessions.
 * 
 *  The `OTSubscriberErrorCode` enum defines values for the `code` property of the OTError object for errors
 * related to methods of the OTSubscriber class:
 *
 * - `OTFailedToConnect` -- Subscriber failed to connect to stream. Can reattempt connection.
 * - `OTConnectionTimedOut` -- Subscriber timed out while attempting to connect to stream. Can reattempt connection.
 * - `OTNoStreamMedia` -- The stream has no audio or video to subscribe to.
 * - `OTInitializationFailure` -- Subscriber failed to initialize.
 */

@interface OTError : NSError

@end
