//
//  OTError.h
//
//  Copyright (c) 2014 Tokbox, Inc. All rights reserved.
//

#define OT_SESSION_ERROR_DOMAIN @"OTSessionErrorDomain"
#define OT_PUBLISHER_ERROR_DOMAIN @"OTPublisherErrorDomain"
#define OT_SUBSCRIBER_ERROR_DOMAIN @"OTSubscriberErrorDomain"

/**
 * Enumerations of error code values used by 
 * <[OTSessionDelegate session:didFailWithError:]>.
 */
typedef NS_ENUM(NSInteger, OTSessionErrorCode) {
    /** Ignore. Used internally. */
    OTSessionSuccess = 0,
    
    /** An invalid API key or token was provided */
    OTAuthorizationFailure = 1004,

    /** An invalid session ID was provided */
    OTErrorInvalidSession  = 1005,
    
    /** There was an error connecting to OpenTok services */
    OTConnectionFailed     = 1006,

    /** A parameter passed in to the request is null or invalid. */
    OTNullOrInvalidParameter = 1011,
    
    /** The session is not connected, and the requested action requires an
     active session connection */
    OTNotConnected  = 1010,
    
    /** A method has been invoked at an illegal or inappropriate time for this
     * session. For example, attempting to connect an already connected session
     * will return this error. */
    OTSessionIllegalState  = 1015,
    
    /** No messaging server is available for this session */
    OTNoMessagingServer     = 1503,
    
    /** A socket could not be opened to the messaging server. Check that
      outbound ports 443 and 8080 are accessible. */
    OTConnectionRefused     = 1023,
    
    /** The connection timed out while attempting to get the session's state */
    OTSessionStateFailed    = 1020,
    
    /** A peer-to-peer enabled session can only have two participants. */
    OTP2PSessionMaxParticipants = 1403,
    
    /**  The connection timed out while attempting to connect to the session. */
    OTSessionConnectionTimeout  = 1021,
    
    /** Thread dispatch failure, out of memory, parse error, etc. */
    OTSessionInternalError   = 2000,
    
    /** You attempted to send a signal with an invalid type. */
    OTSessionInvalidSignalType = 1461,
    
    /** You attempted to send a signal with a data string that is greater than
     the maximum length (8KB). */
    OTSessionSignalDataTooLong = 1413,
    
    /** The connection to the OpenTok messaging server was dropped.. */
    OTConnectionDropped = 1022,
    
    /**
     * The subscriber is unknown to this session. This is usually the result of
     * attempting to unsubscribe a subscriber that is not associated with the
     * session.
     */
    OTSessionSubscriberNotFound = 1112,
    
    /** 
     * The publisher is unknown to this session. This is usually the result of
     * attempting to unpublish a publisher that is not associated with the
     * session.
     */
    OTSessionPublisherNotFound = 1113,

};

/**
 * Enumerations of error code values used by
 * <[OTPublisherKitDelegate publisher:didFailWithError:]>.
 */
typedef NS_ENUM(NSInteger, OTPublisherErrorCode) {
    /** Ignore. Used internally. */
    OTPublisherSuccess = 0,
    
    /** Attempting to publish to a disconnected session */
    OTSessionDisconnected = 1010,
    
    /** Thread dispatch failure, out of memory, etc. */
    OTPublisherInternalError = 2000,
    
    /** The publisher failed due to a WebRTC error. Check the error
     description for details. */
    OTPublisherWebRTCError = 1610,
};

/**
 * Enumerations of error code values used by
 * <[OTSubscriberKitDelegate subscriber:didFailWithError:]>.
 */
typedef NS_ENUM(NSInteger, OTSubscriberErrorCode) {
    /** Ignore. Used internally. */
    OTSubscriberSuccess = 0,
    
    /** The subscriber timed out while attempting to connect to stream.
     Try subscribing again. */
    OTConnectionTimedOut = 1542,
    
    /** The subscriber failed because the client is disconnected from the
     session. */
    OTSubscriberSessionDisconnected = 1541,
    
    /** The subscriber failed due to a WebRTC error. Check the error
     description for details. */
    OTSubscriberWebRTCError = 1600,
    
    /** The subscriber failed due to the stream being missing. This can
     happen if the subscriber is created at the same time the stream is
     removed from the session (eg. as a result of 
     <[OTSession unpublish:error:]>). 
     */
    OTSubscriberServerCannotFindStream = 1604,

    /** The OTSubscriber failed due to an internal error. */
    OTSubscriberInternalError = 2000,
};


/**
 * Defines errors for the OpenTok iOS SDK.
 */
@interface OTError : NSError

@end
