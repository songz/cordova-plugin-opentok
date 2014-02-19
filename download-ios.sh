#!/bin/sh

curl -O https://s3.amazonaws.com/artifact.tokbox.com/rel/ios-sdk/OpenTok-iOS-2.2.0-beta.2.tar.bz2
tar -xvjf OpenTok-iOS-2.2.0-beta.2.tar.bz2
mv OpenTok-iOS-2.2.0-beta.2/OpenTok.framework ./src/ios/Opentok.framework
rm -rf OpenTok-iOS-2.2.0-beta.2.tar.bz2 OpenTok-iOS-2.2.0-beta.2
