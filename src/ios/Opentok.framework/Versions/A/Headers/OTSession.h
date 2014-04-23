//
//  OTSession.h
//
//  Copyright (c) 2013 Tokbox, Inc. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <OpenTok/OpenTokObjC.h>

@class OTError, OTConnection, OTPublisherKit, OTSubscriberKit, OTStream;

@protocol OTSessionDelegate;

/**
 * @enum OTSessionConnectionStatus
 *
 * @abstract
 * The connection status codes, available through 
 * OTSession.sessionConnectionStatus.
 *
 * @constant   OTSessionConnectionStatusNotConnected
 * The session is not connected.
 * @constant   OTSessionConnectionStatusConnected
 * The session is connected.
 * @constant   OTSessionConnectionStatusConnecting
 * The session is connecting.
 * @constant   OTSessionConnectionStatusDisconnecting
 * The session is disconnecting.
 * @constant   OTSessionConnectionStatusFailed
 * The session has experienced a fatal error.
 */
typedef enum {
    OTSessionConnectionStatusNotConnected,
    OTSessionConnectionStatusConnected,
    OTSessionConnectionStatusConnecting,
    OTSessionConnectionStatusDisconnecting,
    OTSessionConnectionStatusFailed,
} OTSessionConnectionStatus;

/**
 * The first step in using the OpenTok iOS SDK is to initialize
 * an OTSession object with your API key and a valid
 * [session ID]( http://tokbox.com/opentok/tutorials/create-session )
 * Use the OTSession object to connect to OpenTok using your developer
 * [API key]( https://dashboard.tokbox.com/projects ) and a valid
 * [token]( http://tokbox.com/opentok/tutorials/create-token )
 */
@interface OTSession : NSObject

/** @name Getting information about the session */

/**
 * The status of this OTSession instance. Useful for ad-hoc queries about
 * session status.
 *
 * Valid values are defined in OTSessionConnectionStatus:
 *
 * - `OTSessionConnectionStatusNotConnected` - The session is not connected.
 * - `OTSessionConnectionStatusConnected` - The session is connected.
 * - `OTSessionConnectionStatusConnecting` - The session is connecting.
 * - `OTSessionConnectionStatusDisconnecting` - The session is disconnecting.
 * - `OTSessionConnectionStatusFailed` - The session has experienced a fatal
 *    error 
 *
 * On instantiation, expect the `sessionConnectionStatus` to have the value 
 * `OTSessionConnectionStatusNotConnected`.
 *
 * You can use a key-value observer to monitor this property. However, the 
 * <[OTSessionDelegate sessionDidConnect:]>
 * and <[OTSessionDelegate sessionDidDisconnect:]> messages are sent to the
 * session's delegate when the session
 * connects and disconnects.
 */
@property(readonly) OTSessionConnectionStatus sessionConnectionStatus;

/**
 * The [session ID]( http://tokbox.com/opentok/tutorials/create-session )
 * of this instance. Once initialized, this is an immutable value.
 */
@property(readonly) NSString* sessionId;

/**
 * The number of discrete clients connected to this session. Individual iOS 
 * clients
 * connect to a session by sending the <[OTSession connectWithToken:]>
 * message.
 */
@property(readonly) int connectionCount;

/**
 * The streams that are a part of this session, keyed by streamId.
 */
@property(readonly) NSDictionary* streams;

/**
 * The <OTConnection> object for this session. The connection property is only
 * available
 * once the <[OTSessionDelegate sessionDidConnect:]> message is sent. If the 
 * session fails to connect,
 * this property shall remain nil.
 */
@property(readonly) OTConnection* connection;

/**
 * The <OTSessionDelegate> object that serves as a delegate object for this
 * OTSession object,
 * handling messages on behalf of this session.
 */
@property(nonatomic, assign) id<OTSessionDelegate> delegate;

/**
 * The delegate callback queue is application-definable. The GCD queue for
 * issuing callbacks to the delegate may be overridden to allow integration with
 * XCTest (new in XCode 5) or other frameworks that need the to operate in the
 * main thread.
 */
@property(nonatomic, assign) dispatch_queue_t apiQueue;

/** @name Initializing and connecting to a session */

/**
 * Initialize this session with your OpenTok API key , a
 * [session ID]( http://tokbox.com/opentok/tutorials/create-session ),
 * and delegate before connecting to OpenTok. Send the 
 * <[OTSession connectWithToken:error:]> message
 * to connect to the session.
 *
 * @param apiKey Your OpenTok API key.
 * @param sessionId The session ID of this instance.
 * @param delegate The delegate (OTSessionDelegate) that handles messages on
 * behalf of this session.
 *
 * @return The OTSession object, or nil if initialization fails.
 */
- (id)initWithApiKey:(NSString*)apiKey
           sessionId:(NSString*)sessionId
            delegate:(id<OTSessionDelegate>)delegate;


/**
 * Once your application has a valid 
 * [token]( http://tokbox.com/opentok/tutorials/create-token ),
 * connect with your [API key](https://dashboard.tokbox.com/projects) to begin
 * participating in an OpenTok session.
 *
 * When the session connects successfully, the
 * <[OTSessionDelegate sessionDidConnect:]> message is sent to
 * the session's delegate.
 *
 * If the session cannot connect, the
 * <[OTSessionDelegate session:didFailWithError:]> message is sent to
 * the session's delegate.
 *
 * When the session disconnects, the <[OTSessionDelegate sessionDidDisconnect:]>
 * message is sent to the session's delegate.
 *
 * Note that sessions automatically disconnect when the app is suspended.
 *
 * Be sure to set up a delegate method for the 
 * <[OTSessionDelegate session:didFailWithError:]> message.
 *
 * @param token The token generated for this connection.
 *
 * @param error Set if an error occurs synchronously while processing the
 * request. The `OTSessionErrorCode` enum (defined in the OTError.h file)
 * defines values for the `code` property of this object. This object is NULL
 * if no synchronous error occurs.
 *
 * If an asynchronous error occurs, the
 * <[OTSessionDelegate session:didFailWithError:]> message is sent to
 * the session's delegate.
 */
- (void)connectWithToken:(NSString*)token
                   error:(OTError **)error;

/**
 * Disconnect from an active OpenTok session.
 *
 * This method tears down all OTPublisher and OTSubscriber objects that have 
 * been initialized.
 *
 * When the session disconnects, the <[OTSessionDelegate sessionDidDisconnect:]>
 * message is sent to the
 * session's delegate.
 *
 * @param error Set if an error occurs synchronously while processing the
 * request. The `OTSessionErrorCode` enum (defined in the OTError.h file)
 * defines values for the `code` property of this object. This object is NULL
 * if no error occurs.
 */
- (void)disconnect:(OTError**)error;

- (void)disconnect
__attribute__((deprecated("use disconnect: instead")));

/** @name Publishing audio-video streams to a session */

/**
 * Adds a publisher to the session.
 *
 * When the publisher begins streaming data, the 
 * <[OTPublisherKitDelegate publisher:streamCreated:]> message
 * is sent to the publisher delegate delegate.
 *
 * Also, when the operation is complete, the
 * <[OTSessionDelegate session:didAddPublisher:]>
 * message is sent to the publisher's delegate.
 *
 * If publishing fails, 
 * <[OTPublisherKitDelegate publisher:didFailWithError:]>
 * is sent to the publisher delegate and no session delegate message will be
 * passed.
 *
 * Note that multiple publishers are not supported.
 *
 * @param publisher The <OTPublisherKit> object to stream with.
 *
 * @param error Set if an error occurs synchronously while processing the
 * request. The `OTPublisherErrorCode` enum (defined in the OTError.h file)
 * defines values for the `code` property of this object. This object is NULL
 * if no error occurs.
 *
 * If an asynchronous error occurs, the
 * <[OTPublisherKitDelegate publisher:didFailWithError:]> message is sent to
 * the publisher's delegate.
 */
- (void)publish:(OTPublisherKit*)publisher
          error:(OTError**)error;

- (void)publish:(OTPublisherKit*)publisher
__attribute__((deprecated("use publish:error: instead")));

/**
 * Removes a publisher from the session.
 *
 * Upon removing the publisher, the 
 * <[OTPublisherKitDelegate publisher:streamDestroyed:]> message is sent
 * to the publisher delegate after streaming has stopped. Additionally,
 * <[OTSessionDelegate session:didRemovePublisher:]> is invoked after the 
 * instance has been cleanly removed from the session.
 *
 * @param publisher The <OTPublisher> object to remove from the session.
 *
 * @param error Set if an error occurs synchronously while processing the
 * request. The `OTPublisherErrorCode` enum (defined in the OTError.h file)
 * defines values for the `code` property of this object. This object is NULL
 * if no error occurs.
 */
- (void)unpublish:(OTPublisherKit*)publisher
            error:(OTError**)error;

- (void)unpublish:(OTPublisherKit*)publisher
__attribute__((deprecated("use unpublish:error: instead")));

/**
 * Connects this subscriber instance to the session and begins subscribing.
 * If the subscriber passed is created from an `OTStream` instance from a 
 * different `OTSession` instance, the behavior of this function is undefined.
 *
 * @param subscriber The subscriber to connect and begin subscribing.
 *
* @param error Set if an error occurs synchronously while processing the
 * request. The `OTSubscriberErrorCode` enum (defined in the OTError.h file)
 * defines values for the `code` property of this object. This object is NULL
 * if no error occurs.
 *
 * If an asynchronous error occurs, the
 * <[OTSubscriberKitDelegate subscriber:didFailWithError:]> message is sent to
 * the subscriber's delegate.
 */
- (void)subscribe:(OTSubscriberKit*)subscriber
            error:(OTError**)error;

- (void)subscribe:(OTSubscriberKit*)subscriber
__attribute__((deprecated("use subscribe:error: instead")));

/**
 * Disconnects this subscriber instance from the session and begins object 
 * cleanup.
 * @param subscriber The subscriber to disconnect and remove from this session.
 *
 * @param error Set if an error occurs synchronously while processing the
 * request. The `OTSubscriberErrorCode` enum (defined in the OTError.h file)
 * defines values for the `code` property of this object. This object is NULL
 * if no error occurs.
 */
- (void)unsubscribe:(OTSubscriberKit*)subscriber
              error:(OTError**)error;

- (void)unsubscribe:(OTSubscriberKit*)subscriber
__attribute__((deprecated("use unsubscribe:error: instead")));

/** @name Sending and receiving signals in a session */

/**
 * Sends a signal to one or more clients in a session.
 *
 * For information on charges for signaling, see the
 * [OpenTok pricing](http://tokbox.com/pricing) page.
 *
 * See 
 * <[OTSessionDelegate session:receivedSignalType:fromConnection:withString:]>.
 *
 *
 * @param type The type of the signal. The type is also set in the
 * <[OTSessionDelegate session:receivedSignalType:fromConnection:withString:]>
 * message.
 * @param string The data to send. The limit to the size of data is 8KiB. 
 * @param connection A destination OTConnection object.
 * Set this parameter to nil to signal all participants in the session.
 * @param error If sending a signal fails, this value is set to an OTError
 * object. The OTSessionErrorCode enum (in OTError.h) includes
 * OTSessionInvalidSignalType and OTSessionSignalDataTooLong constants for these
 * errors. Note that success indicates that the options passed into the method
 * are valid and the signal was sent. It does not indicate that the signal was
 * sucessfully received by any of the intended recipients.
 */
- (void)signalWithType:(NSString*) type
                string:(NSString*)string
            connection:(OTConnection*)connection
                 error:(OTError**)error;

@end

/**
 * Used to send messages for an OTSession instance. The OTSession class 
 * includes a
 * `delegate` property. When you send the 
 * <[OTSession initWithApiKey:sessionId:delegate:]> message,
 * you specify an OTSessionDelegate object.
 */
@protocol OTSessionDelegate <NSObject>

/** @name Connecting to a session */

/**
 * Sent when the client connects to the session.
 *
 * @param session The <OTSession> instance that sent this message.
 */
- (void)sessionDidConnect:(OTSession*)session;

/**
 * Sent when the client disconnects from the session.
 *
 * @param session The <OTSession> instance that sent this message.
 */
- (void)sessionDidDisconnect:(OTSession*)session;

/**
 * Sent if the session fails to connect, some time after your application
 * invokes [OTSession connectWithToken:].
 *
 * @param session The <OTSession> instance that sent this message.
 * @param error An <OTError> object describing the issue. The 
 * `OTSessionErrorCode` enum
 * (defined in the OTError.h file) defines values for the `code` property of
 * this object.
 */
- (void)session:(OTSession*)session didFailWithError:(OTError*)error;

/** @name Monitoring streams in a session */

/**
 * Sent when a new stream is created in this session.
 *
 * Note that if your application publishes to this session, your own session
 * delegate will not receive the [OTSessionDelegate session:streamCreated:]
 * message for its own published stream. For that event, see the delegate 
 * callback [OTPublisherKit publisher:streamCreated:].
 *
 * @param session The OTSession instance that sent this message.
 * @param stream The stream associated with this event.
 */
- (void)session:(OTSession*)session streamCreated:(OTStream*)stream;

/**
 * Sent when a stream is no longer published to the session.
 *
 * @param session The <OTSession> instance that sent this message.
 * @param stream The stream associated with this event.
 */
- (void)session:(OTSession*)session streamDestroyed:(OTStream*)stream;

@optional

/** @name Monitoring connections in a session */

/**
 * Sent when another client connects to the session. The `connection` object
 * represents the client's connection.
 *
 * This message is not sent when your own client connects to the session. 
 * Instead, the <[OTSessionDelegate sessionDidConnect:]>
 * message is sent when your own client connects to the session.
 *
 * @param session The <OTSession> instance that sent this message.
 * @param connection The new <OTConnection> object.
 */
- (void)  session:(OTSession*) session
connectionCreated:(OTConnection*) connection;

/**
 * Sent when another client disconnects from the session. The `connection`
 * object represents the connection that the client had to the session.
 *
 * This message is not sent when your own client disconnects from the session. 
 * Instead, the <[OTSessionDelegate sessionDidDisconnect:]>
 * message is sent when your own client connects to the session.
 *
 * @param session The <OTSession> instance that sent this message.
 * @param connection The <OTConnection> object for the client that disconnected
 * from the session.
 */
- (void)    session:(OTSession*) session
connectionDestroyed:(OTConnection*) connection;

/**
 * Sent when this client starts publishing a stream to the session.
 *
 * @param session The <OTSession> instance that sent this message.
 * @param publisher The <OTPublsiherKit> object that defines the stream being 
 * sent.
 */
- (void)session:(OTSession*)session didAddPublisher:(OTPublisherKit*)publisher;
/**
 * Sent when this client stops publishing a stream to the session.
 *
 * @param session The <OTSession> instance that sent this message.
 * @param publisher The <OTPublsiherKit> object that defines the stream that
 * stopped being sent.
 */
- (void)   session:(OTSession*)session
didRemovePublisher:(OTPublisherKit*)publisher;

/**
 * Sent when a message is received in the session.
 * @param session The <OTSession> instance that sent this message.
 * @param type The type string of the signal.
 * @param connection The connection identifying the client that sent the
 * message.
 * @param string The signal data.
 */
- (void)   session:(OTSession*)session
receivedSignalType:(NSString*)type
    fromConnection:(OTConnection*)connection
        withString:(NSString*)string;

- (void)session:(OTSession*)session
archiveCreatedWithId:(NSString*)archiveId
           name:(NSString*)name
         status:(NSString*)status;

- (void)session:(OTSession*)session
archiveUpdatedWithId:(NSString*)archiveId
         status:(NSString*)status;

@end
