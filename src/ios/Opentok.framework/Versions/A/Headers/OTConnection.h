//
//  OTConnection.h
//
//  Copyright (c) 2014 TokBox, Inc. All rights reserved.
//

#import <Foundation/Foundation.h>

/**
 * Represents a connection to an OpenTok session. The <OTSession> class
 * includes a connection property, which is an OTConnection object. Also,
 * The <OTStream> class includes a connection property, which is an OTConnection
 * object.
 */
@interface OTConnection : NSObject

/** @name Getting information about the connection */

/**
 * The unique connection ID for this OTConnection object.
 */
@property(readonly) NSString* connectionId;

/**
 * The time at which the Connection was created on the OpenTok server.
 */
@property(readonly) NSDate* creationTime;

@property(readonly) NSString* data;

@end
