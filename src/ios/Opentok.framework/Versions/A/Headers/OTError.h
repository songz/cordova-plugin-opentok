//
//  OTError.h
//
//  Copyright (c) 2013 Tokbox, Inc. All rights reserved.
//

#define OT_SESSION_ERROR_DOMAIN @"OTSessionErrorDomain"
#define OT_PUBLISHER_ERROR_DOMAIN @"OTPublisherErrorDomain"
#define OT_SUBSCRIBER_ERROR_DOMAIN @"OTSubscriberErrorDomain"

typedef enum {
    OTSessionSuccess = 0,
    
    /* An invalid API key or token was provided */
    OTAuthorizationFailure = 1004,
    /* An invalid session ID was provided */
    OTErrorInvalidSession  = 1005,
    
    /* NOTE seems to refer to webservices There was an error connecting to
     OpenTok services */
    OTConnectionFailed     = 1006,

    /* A parameter passed in to the request is null or invalid. */
    OTNullOrInvalidParameter = 1011,
    
    /* The session is not connected, and the requested action requires an
     active session connection */
    OTNotConnected  = 1010,
    
    /* A method has been invoked at an illegal or inappropriate time for this
     * session. For example, attempting to connect an already connected session
     * will return this error. */
    OTSessionIllegalState  = 1015,
    
    /* No messaging server is available for this session */
    OTNoMessagingServer     = 1503,
    
    /* NOTE seems to refer to Rumor.  A socket could not be opened to the
     messaging server. Check that outbound ports 5560 or 8080 are accessible */
    OTConnectionRefused     = 1023,
    
    /* The connection timed out while attempting to get the session's state */
    OTSessionStateFailed    = 1020,
    
    /* A peer-to-peer enabled session can only have two participants */
    OTP2PSessionMaxParticipants = 1403,
    
    /* 
     * The connection timed out while attempting to connect to the session
     */
    OTSessionConnectionTimeout  = 1021,
    
    /* Thread dispatch failure, out of memory, parse error, etc. */
    OTSessionInternalError   = 2000,
    
    OTSessionInvalidSignalType = 1461,
    
    OTSessionSignalDataTooLong = 1413,
    
    OTConnectionDropped = 1022,
    
} OTSessionErrorCode;

typedef enum {
    OTPublisherSuccess = 0,
    
    /* Attempting to publish to a disconnected session */
    OTSessionDisconnected = 1010,
    
    /* Thread dispatch failure, out of memory, etc. */
    OTPublisherInternalError = 2000,
    
    OTPublisherWebRTCError = 1610,
} OTPublisherErrorCode;

typedef enum {
    OTSubscriberSuccess = 0,
    
    /* TODO Subscriber timed out while attempting to connect to stream.
     Can reattempt connection */
    OTConnectionTimedOut = 1542,
    
    /* NEW */
    OTSubscriberSessionDisconnected = 1541,
    
    /* NEW Failure reported by WebRTC accompanied by string */
    OTSubscriberWebRTCError = 1600,
    
    /* NEW */
    OTSubscriberInternalError = 2000,
} OTSubscriberErrorCode;


/**
 * Defines errors for the OpenTok iOS SDK.
 */
@interface OTError : NSError

@end
