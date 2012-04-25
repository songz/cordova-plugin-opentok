Cordova Plugin for Opentok iOS SDK
===

Weave video chat into your web ( and now mobile! ) application.

## Step 1. Install / create Cordova app
<http://phonegap.com/start/>
> Make sure 'use automatic reference counting' is **not** selected when you create the project.

## Step 2. Install Opentok Framework
1. Clone from <https://github.com/opentok/opentok-ios-sdk>
2. Drag the Opentok.framework directory into your XCODE *Frameworks* folder
3. click on your project in **File Navigator** and select **Build Settings**  

> Make sure **Standard (armv7)** is selected for **Architectures**  
> Make sure **armv7** is the ONLY option selected for **Valid Architectures**  

## Step 3. Install Opentok Phonegap Plugin
1. Clone from <https://github.com/songz/phonegap-plugin-opentok>
2. Copy `OpentokPlugin.h`, `OpentokPlugin.m`, `OpentokStreamInfo.h`, and `OpentokStreamInfo.h` into your **Classes** folder
3. Copy `Opentok.iOS.js` into your `www` folder

### Done!

---

## Getting Started:
All your editing will be done in your www folder.

To use the opentok library, make sure you include **Opentok.iOS.js** file in your HTML document.  
` <script type="text/javascript" charset="utf-8" src="Opentok.iOS.js"></script>`

For smoother experience video video, you must prevent dragging. Uncomment the following lines in the HTML:

    function preventBehavior(e) 
    { 
      e.preventDefault(); 
    };
    document.addEventListener("touchmove", preventBehavior, false);

All code should be written in `onDeviceReady` function because it is executed after all the devices/libraries DOM has loaded.

	function onDeviceReady()
	{
		// do your thing!
	}

---

