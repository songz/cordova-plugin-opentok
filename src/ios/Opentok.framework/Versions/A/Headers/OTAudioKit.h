//
//  OTAudioKit.h
//
//  Copyright (c) 2014 TokBox, Inc. All rights reserved.
//

#import <Foundation/Foundation.h>

@protocol OTAudioDevice;

/**
 * Use the AudioDeviceManager to set a custom audio device to be used by the
 * app. The audio device manages access to the audio capturing and rendering
 * hardware.
 * <p>
 * You can only define a single audio capture source and rendering target for
 * the entire process. You cannot set these individually for each publisher
 * and subscriber.
 */
@interface OTAudioDeviceManager : NSObject

/**
 * Sets the audio device to be used.
 *
 * You must call this method before you connect to a session. Additionally, this
 * is a global operation that must persist throughout the lifetime of a
 * session.
 *
 * If you do not call this method, the app uses the iOS device's microphone and
 * speaker.
 *
 * @param device The <OTAudioDevice> interface implementation. This object is
 * retained.
 */
+ (void)setAudioDevice:(id<OTAudioDevice>)device;

/**
 * Gets the <OTAudioDevice> instance.
 *
 * @return id The <OTAudioDevice> implementation.
 */
+ (id<OTAudioDevice>)currentAudioDevice;

@end

/**
 * Defines the format of the audio when a custom audio driver is used.
 *
 * Note that on iOS devices, specify a sample rate of 32, 16, or 8 kHz (32000,
 * 16000, or 8000); do not use a sample rate of 44.1 kHz on iOS devices. On the
 * simulator, however, the sampling rate must be 44.1 kHz (44100) in order to
 * properly capture and render audio.
 *
 * Currently, the only available sample format is signed 16-bit integer PCM.
 */
@interface OTAudioFormat : NSObject

/**
 * The sample rate (in samples per second). For example, set this to 32000
 * for 32 kHz. The default value is 16000 (16kHz).
 */
@property(nonatomic, assign) uint16_t sampleRate;

/**
 * The number of audio channels. Currently, we support only 1 channel (mono)
 * in iOS, and this is the default.
 */
@property(nonatomic, assign) uint8_t numChannels;

@end


/**
 * The audio bus marshals audio data between the network and the audio device.
 * Call the <[OTAudioDevice setAudioBus:]> method to define the object that
 * implements the OTAudioBus protocol. The audio device pushes captured audio
 * samples to and fetches unrendered audio samples from the audio bus.
 *
 * The object that implements this protocol must invoke the
 * [OTAudioBus writeCaptureData:numberOfSamples:] and
 * [OTAudioBus readRenderData:numberOfSamples:] methods to provide
 * audio capture and render sample buffers.
 */

@protocol OTAudioBus <NSObject>

/**
 * Passes audio data to transmit to a session. 
 *
 * @param data A pointer to an audio buffer.
 * @param count The number of samples available for copying.
 */
- (void)writeCaptureData:(void*)data numberOfSamples:(uint32_t)count;

/**
 * Retrieves unrendered audio samples from the session. This is most commonly
 * used to send audio to the speakers, but is also an entry point for
 * further audio processing.
 *
 * @param data A pointer to an audio buffer.
 * @param count The number of samples requested.
 * @return uint32_t The number of samples copied out of the audio buffer.
 */
- (uint32_t)readRenderData:(void*)data numberOfSamples:(uint32_t)count;

@end

/**
 * Defines an audio device for use in a session. See
 * <[OTAudioDeviceManager setAudioDevice:]>.
 */
@protocol OTAudioDevice <NSObject>

@required

/** @name Setting the audio bus */

/**
 * Sets the OTAudioBus instance that this audio device uses.
 *
 * OTAudioDevice implementors use this bus to send and receive audio
 * samples to and from a session. The implementor should retain this
 * instance for the lifetime of the implementing object.
 *
 * @param audioBus An <OTAudioBus> implementation.
 * @return BOOL YES if successful; NO otherwise.
 */
- (BOOL)setAudioBus:(id<OTAudioBus>)audioBus;

/** @name Adjusting the audio format */

/**
 * The capture format used by this device.
 */
- (OTAudioFormat*)captureFormat;

/**
 * The render format used by this device.
 */
- (OTAudioFormat*)renderFormat;

/** @name Rendering audio */

/**
 * Used to check if audio rendering is available on the audio device.
 *
 * @return BOOL YES if rendering is available.
 */
- (BOOL)renderingIsAvailable;

/**
 * Requests the audio device to initialize itself for rendering. Call this
 * method before attempting to start rendering.
 *
 * @return BOOL YES if rendering is initialized.
 */
- (BOOL)initializeRendering;

/**
 * Checks if audio rendering is initialized.
 *
 * @return BOOL YES if audio rendering is initialized.
 */
- (BOOL)renderingIsInitialized;

/**
 * Requests that the device start rendering audio. After successful return from
 * this function, audio samples become available on the audio bus.
 *
 * @return BOOL YES if rendering starts.
 */
- (BOOL)startRendering;

/**
 * Requests that the device stop rendering audio.
 *
 * @return BOOL YES if rendering stops.
 */
- (BOOL)stopRendering;

/**
 * Checks if audio rendering has started.
 *
 * @return BOOL YES if rendering has started.
 */
- (BOOL)isRendering;

/**
 * Returns the estimated rendering delay in ms. This is used to adjust
 * audio signal processing and rendering.
 *
 * @return uint16_t
 */
- (uint16_t)estimatedRenderDelay;

/** @name Capturing audio */

/**
 * Checks if audio sampling is available on the audio device.
 *
 * @return BOOL YES if audio sampling is available.
 */
- (BOOL)captureIsAvailable;

/**
 * Requests the audio device to initialize itself for audio sampling. Call
 * this method before attempting to start sampling.
 *
 * @return BOOL YES if audio sampling was initialized.
 */
- (BOOL)initializeCapture;

/**
 * Checks if audio sampling is initialized.
 *
 * @return BOOL YES if sampling is initialized.
 */
- (BOOL)captureIsInitialized;

/**
 * Requests that the device start capturing audio samples. After successful
 * return from this function, the audio bus is ready to receive audio sample
 * data.
 *
 * @return BOOL YES if audio capture starts.
 */
- (BOOL)startCapture;

/**
 * Requests that the device stop sampling audio.
 *
 * @return BOOL YES if audio sampling stops.
 */
- (BOOL)stopCapture;

/**
 * Checks if the device is caputuring audio samples.
 *
 * @return BOOL YES if audio capture is initialized.
 */
- (BOOL)isCapturing;

/**
 * Returns the estimated capturing delay in ms. This is used to adjust timing
 * transmission information for encoded audio samples.
 *
 * @return uint16_t
 */
- (uint16_t)estimatedCaptureDelay;

@end