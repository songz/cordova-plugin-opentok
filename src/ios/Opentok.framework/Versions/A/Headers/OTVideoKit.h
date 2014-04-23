//
//  OTVideoKit.h
//
//  Copyright (c) 2013 TokBox, Inc. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <CoreMedia/CMTime.h>

/**
 * @enum OTVideoOrientation
 *
 * @abstract
 * Defines values for video orientations (up, down, left, right) for the
 * orieintation property of an OTVideoFrame object.
 *
 * @constant   OTVideoOrientationUp
 * The video is oriented top up. No rotation is applies.
 * @constant   OTVideoOrientationDown
 * The video is rotated 180 degrees.
 * @constant   OTVideoOrientationLeft
 * The video is rotated 90 degrees.
 * @constant   OTVideoOrientationRight
 * The video is rotated 270 degrees.
 */
typedef enum {
    OTVideoOrientationUp = 1,
    OTVideoOrientationDown = 2,
    OTVideoOrientationLeft = 3,
    OTVideoOrientationRight = 4,
    
} OTVideoOrientation;

/**
 * @enum OTPixelFormat
 *
 * @abstract
 * Defines values for pixel format for the pixelFormat property of an
 * OTVideoFrame object.
 *
 * @constant   OTPixelFormatI420
 * I420 format.
 * @constant   OTPixelFormatARGB
 * ARGB format.
 * @constant   OTPixelFormatNV12
 * NV12 format.
 */
typedef enum {
    OTPixelFormatI420 = 'I420',
    OTPixelFormatARGB = 'ARGB',
    OTPixelFormatNV12 = 'NV12',
} OTPixelFormat;

/**
 * Defines the video format assigned to an instance of an <OTVideoFrame> object.
 */
@interface OTVideoFormat : NSObject

/**
 * The name you assign to the video format
 */
@property(nonatomic, copy) NSString* name;
/**
 * The pixel format. Valid values are defined in the OTPixelFormat enum.
 */
@property(nonatomic, assign) OTPixelFormat pixelFormat;
/**
 * The number of bytes per row of the video.
 */
@property(nonatomic, retain) NSMutableArray* bytesPerRow;
/**
 * The width of the video, in pixels.
 */
@property(nonatomic, assign) uint32_t imageWidth;
/**
 * The height of the video, in pixels.
 */
@property(nonatomic, assign) uint32_t imageHeight;
/**
 * The estimated number of frames per second in the video.
 */
@property(nonatomic, assign) double estimatedFramesPerSecond;
/**
 * The estimated capture delay, in milliseconds, of the video.
 */
@property(nonatomic, assign) double estimatedCaptureDelay;

+ (OTVideoFormat*)videoFormatI420WithWidth:(uint32_t)width
                                   height:(uint32_t)height;

/**
 * Returns an OTVideoFormat object with the specified width and height.
 *
 * @param width The width, in pixels.
 * @param height The height, in pixels.
 */
+ (OTVideoFormat*)videoFormatNV12WithWidth:(uint32_t)width
                                    height:(uint32_t)height;
@end

/**
 * Defines a frame of a video. See <[OTVideoRender renderVideoFrame:]> and
 * <[OTVideoCaptureConsumer consumeFrame:]>.
 */
@interface OTVideoFrame : NSObject

/**
 * An array of planes in the video frame.
 */
@property(nonatomic, retain) NSPointerArray* planes;
/**
 * A timestap of the video frame.
 */
@property(nonatomic, assign) CMTime timestamp;
/**
 * The orientation of the video frame.
 */
@property(nonatomic, assign) OTVideoOrientation orientation;
/**
 * The format of the video frame.
 */
@property(nonatomic, retain) OTVideoFormat* format;

/**
 * Initializes an OTVideoFrame object.
 */
- (id)init;

/**
 * Initializes an OTVideoFrame object with a specified format.
 *
 * @param videoFormat The video format used by the video frame.
 */
- (id)initWithFormat:(OTVideoFormat*)videoFormat;
/**
 * Sets planes for the video frame.
 *
 * @param planes The planes to assign.
 * @param numPlanes The number of planes to assign.
 */
- (void)setPlanesWithPointers:(uint8_t*[])planes numPlanes:(int)numPlanes;
/**
 * Cleans the planes in the video frame.
 */
- (void)clearPlanes;
@end

/**
 * Defines a the consumer of an OTVideoCapture object.
 */
@protocol OTVideoCaptureConsumer <NSObject>

/**
 * Consumes a frame.
 *
 * @param frame The frame to consume.
 */
- (void)consumeFrame:(OTVideoFrame*)frame;

@end

/**
 * Defines a video capturer to be used by an <OTPublisherKit> object.
 * See the `videoCapture` property of an <OTPublisherKit> object.
 */
@protocol OTVideoCapture <NSObject>

/**
 * The object that consumes frames for the video capturer.
 */
@property(atomic, assign) id<OTVideoCaptureConsumer>videoCaptureConsumer;

/**
 * Initializes the video capturer.
 */
- (void)initCapture;
/**
 * Releases the video capturer.
 */
- (void)releaseCapture;
/**
 * Starts capturing video.
 */
- (int32_t)startCapture;
/**
 * Stops capturing video.
 */
- (int32_t)stopCapture;
/**
 * Whether video is being captured.
 */
- (BOOL)isCaptureStarted;
/**
 * The video format of the video capturer.
 * @param videoFormat The video format used.
 */
- (int32_t)captureSettings:(OTVideoFormat*)videoFormat;

@end


/**
 * Defines a video renderer to be used by an <OTPublisherKit> object or an
 * <OTSubscriberKit> object. See the `videoRender` properties of
 * <OTPublisherKit> object and <OTSubscriberKit>.
 */
@protocol OTVideoRender <NSObject>

/**
 * Renders a frame to the video renderer.
 *
 * @param frame The frame to render.
 */
- (void)renderVideoFrame:(OTVideoFrame*) frame;

@end