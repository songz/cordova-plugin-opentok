PhoneGap Plugin for OpenTok iOS
===

Weave video chat into your web (and now mobile!) application.

## Step 1. Install and create a PhoneGap app
**Make sure You have PhoneGap 3.2 Installed** If you haven't, check out PhoneGap's [Installation](http://phonegap.com/install/) Page.

1. Create a PhoneGap app by typing into Terminal:  
`phonegap create my-app`  

2. Go into your app directory and run your app:
`cd my-app`  
`phonegap run ios`


## Step 2. Install the OpenTok Plugin using plugman
Make sure you have Plugman installed to manage plugins. If you haven't, check out Plugman's [Installation](http://docs.phonegap.com/en/3.2.0/plugin_ref_plugman.md.html) Page.  

1. Make sure you are in your project's root directory. 
`cd my-app`

2. Install OpenTok's PhoneGap Plugin:  
`plugman install --platform ios --project /<fullPath to your phonegap app>/platforms/ios --plugin https://github.com/opentok/PhoneGap-Plugin`

3. Compile and run. Make sure you are running on your device because OpenTok needs to run on a device to be stable.  
`phonegap run ios --device`


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
