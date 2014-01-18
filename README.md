PhoneGap Plugin for OpenTok iOS
===

Weave video chat into your web (and now mobile!) application.

## Using Cordova CLI
**Make sure You have Cordova 3.3 Installed** If you haven't, check out PhoneGap's [Installation](http://phonegap.com/install/) Page.  
Clone this repo to get the source code for OpenTok's Cordova plugin

1. Create a Cordova app by typing into Terminal:  
`cordova create my-app`  

2. Install OpenTok plugin into your app:
`cd my-app`  
`cordova plugin add path/to/Opentok's/CordovaPlugin/that/you/cloned`

3a. For **Android Apps**, add Android platform into your cordova app
`cordova platform add android`

3b. For **iOS Apps**, add iOS platform into your cordova app
`cordova platform add ios`

4. Edit your code in the created `www` folder

5. To deploy your app to your android device:
`cordova run android --device`

6. To deploy your app to your iOS device:  
> As of 1/17/2014, you cannot deploy to device with Cordova CLI for iOS apps. You need to first prepare you iOS app: `cordova prepare iOS`  
> Next, open the project in xcode and run it on device: `open platforms/ios/HelloWorld.xcodeproj`


---

## Getting Started on your Project:
All your editing will be done in your www folder.

To use the opentok library, make sure you include **opentok.js** file in your HTML document.  
` <script type="text/javascript" charset="utf-8" src="opentok.js"></script>`

All JavaScript code should be written in `deviceready` function in */js/index.js* folder because it is executed after all dependencies has loaded.

    deviceready: function() {
        // Do Your Stuff Here!
        app.report('deviceready');
    },

---

## Tutorial and sample code
Go through the [OpenTok API demo](http://www.tokbox.com/opentok/demo) to learn the basics!  

Have Fun!

----

## [Documentation for PhoneGap Plugin](/opentok/PhoneGap-Plugin/blob/master/docs/README.md)

----

License
===

Copyright (c) 2012 TokBox, Inc.

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:


The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

The software complies with Terms of Service for the OpenTok platform described in <http://www.tokbox.com/termsofservice>.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
