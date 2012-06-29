//
//  OTSession.h
//  opentok-ios-sdk
//
//  Created by Charley Robinson on 10/24/11.
//  Copyright (c) 2011 Tokbox, Inc. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "Opentok.h"

@class OTError;

@protocol OTSessionDelegate;

/**
 * @enum OTSessionEnvironment
 *
 * @abstract
 * The environment you wish to deploy your application to. This default environment is set to staging.
 * See <[OTSession initWithSessionId: delegate: environment:]> and <OTSession.environment>.
 *
 * @constant   OTSessionEnvironmentProduction
 * The session will connect to our production environment. Point your OpenTok server-side library to api.opentok.com.
 * @constant   OTSessionEnvironmentStaging
 * The session will connect to our staging environment. Point your OpenTok server-side library to staging.tokbox.com.
 */
typedef enum {     
    OTSessionEnvironmentProduction,
    OTSessionEnvironmentStaging,
} OTSessionEnvironment;


/**
 * @enum OTSessionConnectionStatus
 *
 * @abstract
 * The connection status codes, available through OTSession.sessionConnectionStatus.
 *
 * @constant   OTSessionConnectionStatusConnected
 * The session is connected.
 * @constant   OTSessionConnectionStatusConnecting
 * The session is connecting.
 * @constant   OTSessionConnectionStatusDisconnected
 * The session is not connected.
 * @constant   OTSessionConnectionStatusFailed
 * The attempt to connect to the session failed.
 */
typedef enum {     
    OTSessionConnectionStatusConnected,
    OTSessionConnectionStatusConnecting,
    OTSessionConnectionStatusDisconnected,
    OTSessionConnectionStatusFailed,
} OTSessionConnectionStatus;

/**
 * The first step in using the OpenTok iOS SDK is to initialize
 * an OTSession object with a valid
 * [session ID](http://www.tokbox.com/opentok/api/tools/js/documentation/overview/session%5Fcreation.html). 
 * Use the OTSession object to connect to OpenTok using your developer
 * [API key](http://www.tokbox.com/opentok/api/tools/js/apikey) and a valid
 * [token](http://www.tokbox.com/opentok/api/tools/js/documentation/overview/token%5Fcreation.html).
 */
@interface OTSession : NSObject

/** @name Getting information about the session */

/**
 * The status of this OTSession instance. Useful for ad-hoc queries about session status. 
 *
 * Valid values are defined in OTSessionConnectionStatus:
 *
 * - `OTSessionConnectionStatusConnected` - The session is connected.
 * - `OTSessionConnectionStatusConnecting` - The session is connecting.
 * - `OTSessionConnectionStatusDisconnected` - The session is not connected.
 * - `OTSessionConnectionStatusFailed` - The attempt to connect to the session failed.
 *
 * On instantiation, expect the `sessionConnectionStatus` to have the value `OTSessionConnectionStatusDisconnected`.
 *
 * You can use a key-value observer to monitor this property. However, the <[OTSessionDelegate sessionDidConnect:]>
 * and <[OTSessionDelegate sessionDidDisconnect:]> messages are sent to the session's delegate when the session 
 * connects and disconnects.
 */
@property(readonly) OTSessionConnectionStatus sessionConnectionStatus;

/**
 * The [session ID](http://www.tokbox.com/opentok/api/tools/js/documentation/overview/session%5Fcreation.html)
 * of this instance. Once initialized, this is an immutable value.
 */
@property(nonatomic, copy) NSString* sessionId;

/**
 * The number of discrete clients connected to this session. Individual iOS clients
 * connect to a session by sending the <[OTSession connectWithApiKey:token:]> message.
 */
@property(readonly) int connectionCount;

/**
 * The streams that are a part of this session, keyed by streamId. 
 */
@property(readonly) NSDictionary* streams;

/**
 * The <OTConnection> object for this session. The connection property is only available
 * once the <[OTSessionDelegate sessionDidConnect:]> message is sent. If the session fails to connect,
 * this property shall remain nil.
 */
@property(readonly) OTConnection* connection;

/**
 * The <OTSessionDelegate> object that serves as a delegate object for this OTSession object,
 * handling messages on behalf of this session.
 */
@property(nonatomic, weak) id<OTSessionDelegate> delegate;

/**
 * The active environment for this session. The environment determines whether your app will connect to
 * the OpenTok staging or production media server (see
 * [Testing and production](http://www.tokbox.com/opentok/api/tools/js/documentation/overview/production.html)).
 *
 * Values for this property are defined in the OTSessionEnvironment enum:
 *
 * - `OTSessionEnvironmentProduction` -- The session will connect to the OpenTok production environment. Point your
 * OpenTok server-side library to api.opentok.com.
 * - `OTSessionEnvironmentStaging` -- The session will connect to the OpenTok staging environment. Point your
 * OpenTok server-side library to staging.tokbox.com.
 *
 * Once connected, this value is immutable; subsequent calls to `setEnvironment` will silently fail.
 *
 * You can set the environment when you initialize an OTSession object by sending the
 * <[OTSession initWithSessionId:delegate:environment:]> message.
 *
 * Alternatively, you can send the <[OTSession initWithSessionId:delegate:]> message and set the
 * <[OTSession environment]> property before you connect to the session.
 * 
 * Send the <[OTSession connectWithApiKey:token:]> message to connect to the session.
 */
@property(nonatomic) OTSessionEnvironment environment;

/** @name Initializing and connecting to a session */

/**
 * Initialize this session with a given [session ID](http://www.tokbox.com/opentok/api/tools/js/documentation/overview/session%5Fcreation.html)
 * and delegate before connecting to OpenTok. Send the <[OTSession connectWithApiKey:token:]> message
 * to connect to the session.
 *
 * See <[OTSession initWithSessionId:delegate:environment:]>.
 *
 * @param sessionId The session ID of this instance.
 * @param delegate The delegate (OTSessionDelegate) that handles messages on behalf of this session.
 *
 * @return The OTSession object, or nil if initialization fails.
 */
- (id)initWithSessionId:(NSString*)sessionId
               delegate:(id<OTSessionDelegate>)delegate;


/**
 * Initialize this session with a given [session ID](http://www.tokbox.com/opentok/api/tools/js/documentation/overview/session%5Fcreation.html), 
 * delegate, and environment, before connecting to OpenTok. The environment determines whether your app will
 * connect to the OpenTok staging or production media server (see
 * [Testing and production](http://www.tokbox.com/opentok/api/tools/js/documentation/overview/production.html)).
 *
 * Alternatively, you can send the <[OTSession initWithSessionId:delegate:]> message and set the
 * <[OTSession environment]> property before you connect to the session.
 *
 * Send the <[OTSession connectWithApiKey:token:]> message to connect to the session.
 *
 * @param sessionId The session ID of this instance.
 * @param delegate The delegate (OTSessionDelegate) that handles messages on behalf of this session.
 * @param environment The environment that this session will attempt to connect to. Set this parameter to a value in
 * the OTSessionEnvironment enum:
 *
 * - `OTSessionEnvironmentProduction` -- The session will connect to the OpenTok production environment. Point your
 * OpenTok server-side library to api.opentok.com.
 * - `OTSessionEnvironmentStaging` -- The session will connect to the OpenTok staging environment. Point your
 * OpenTok server-side library to staging.tokbox.com.
 *
 * See <[OTSession initWithSessionId:delegate:]> and <[OTSession environment]>.
 *
 * @return The OTSession object, or nil if initialization fails.
 */
- (id)initWithSessionId:(NSString*)sessionId
               delegate:(id<OTSessionDelegate>)delegate
            environment:(OTSessionEnvironment)environment;

/**
 * Once your application has a valid [token](http://www.tokbox.com/opentok/api/tools/js/documentation/overview/token%5Fcreation.html),
 * connect with your [API key](http://www.tokbox.com/opentok/api/tools/js/apikey) to begin participating in an OpenTok session.
 *
 * When the session connects successfully, the <[OTSessionDelegate sessionDidConnect:]> message is sent to
 * the session's delegate.
 *
 * If the session cannot connect, the <[OTSessionDelegate session:didFailWithError:]> message is sent to
 * the session's delegate.
 *
 * When the session disconnects, the <[OTSessionDelegate sessionDidDisconnect:]> message is sent to the
 * session's delegate.
 *
 * Note that sessions automatically disconnect when the app is suspended. 
 *
 * Be sure to set up a delegate method for the [OTSessionDelegate session: didFailWithError:] message. See the 
 * OTSessionErrorCode emum defined in OTError.h. It defines code values for the error. An error with code
 * OTSDKUpdateRequired indicates that the OpenTok iOS SDK used to compile the app is not longer compatible
 * with the OpenTok infrastructure.
 *
 * @param apiKey Your OpenTok API key.
 * @param token The token generated for this connection.
 */
- (void)connectWithApiKey:(NSString*)apiKey
                    token:(NSString*)token;

/**
 * Disconnect from an active OpenTok session.
 *
 * This method tears down all OTPublisher and OTSubscriber objects that have been initialized.
 *
 * When the session disconnects, the <[OTSessionDelegate sessionDidDisconnect:]> message is sent to the
 * session's delegate.
 */
- (void)disconnect;

/** @name Publishing audio-video streams to a session */

/**
 * Adds a publisher to the session.
 * 
 * When the publisher begins streaming data, the <[OTSessionDelegate session:didReceiveStream:]> message 
 * is sent to the session's delegate. You can compare the `connection.connectionId` property of the
 * OTSession object with the `connection.connectionId` property of the OTStream object. If they match,
 * the stream is published from your connection. 
 *
 * Also, when the publisher begins streaming data the <[OTPublisherDelegate publisherDidStartStreaming:]>
 * message is sent to the publisher's delegate.
 *
 * If publishing fails, the [OTPublisherDelegate publisher:didFailWithError:] is sent to the publisher's
 * delegate.
 *
 * When running in the XCode iOS Simulator, the <[OTPublisher initWithDelegate:]> and
 * <[OTPublisher initWithDelegate:name:]> methods return `nil`. Sending the [OTSession publish:] message to
 * `nil` results in no operation.
 *
 * Note that multiple publishers are not supported.
 *
 * @param publisher The <OTPublisher> object for the stream to be published.
 */
- (void)publish:(OTPublisher*) publisher;

/**
 * Removes a publisher from the session.
 *
 * Upon removing the publisher, the <[OTPublisherDelegate publisherDidStopStreaming:]> message is sent
 * to the publisher's delegate. The publisher's view is removed from its superview. Also, the
 * [OTSessionDelegate session:didDropStream:] message is sent to the session's delegate.
 *
 * @param publisher The <OTPublisher> object to remove from the session.
 */
- (void)unpublish:(OTPublisher*) publisher;

@end

/**
 * Used to send messages for an OTSession instance. The OTSession class includes a
 * `delegate` property. When you send the <[OTSession initWithSessionId:delegate:]> message,
 * you specify an OTSessionDelegate object.
 */
@protocol OTSessionDelegate <NSObject>

/** @name Connecting to a session */

/**
 * Sent when the session connects.
 *
 * @param session The <OTSession> instance that sent this message.
 */
- (void)sessionDidConnect:(OTSession*)session;

/**
 * Sent when the session disconnects.
 *
 * When a session disconnects, all <OTSubscriber> and <OTPublisher> objects' views are
 * removed from their superviews.
 *
 * @param session The <OTSession> instance that sent this message.
 */
- (void)sessionDidDisconnect:(OTSession*)session;

/**
 * Sent if the session fails to connect, some time after your applications sends the
 * [OTSession connectWithApiKey:token:] message.
 *
 * @param session The <OTSession> instance that sent this message.
 * @param error An <OTError> object describing the issue. The `OTSessionErrorCode` enum
 * (defined in the OTError class) defines values for the `code` property of this object.
 */
- (void)session:(OTSession*)session didFailWithError:(OTError*)error;

/** @name Monitoring streams in a session */

/**
 * Sent when a new stream is created in this session.
 * 
 * Note that if your application successfuly publishes to this session, its session delegate is sent
 * an [OTSessionDelegate session:didReceiveStream:] message for its own published stream.
 * You can compare the `stream.connection.connectionId` property with the `session.connection.connectionId`
 * property. (If they matches, the stream is published from your connection.)
 *
 * @param session The OTSession instance that sent this message.
 * @param stream The stream associated with this event.
 */
- (void)session:(OTSession*)session didReceiveStream:(OTStream*)stream;

/**
 * Sent when a stream is no longer published to the session.
 *
 * Note that if your application stops publishing a stream to the session, its session delegate is
 * sent an [OTSessionDelegate session:didDropStream:] message for its own published stream.
 * You can check the stream.connection.connectionId property to see if it matches
 * the `session.connection.connectionId` property. (If it matches, the stream was
 * published from your connection.)
 *
 * When a stream is dropped, the view for any <OTSubscriber> object for the stream is
 * removed from its superview. If the stream corresponds to an <OTPublisher> object,
 * the <OTPublisher> object's view is removed from its superview. 
 *
 * @param session The <OTSession> instance that sent this message.
 * @param stream The stream associated with this event.
 */
- (void)session:(OTSession*)session didDropStream:(OTStream*)stream;

@end
