Cordova Plugin for Opentok iOS SDK
===

Weave video chat into your web ( and now mobile! ) application.

## Step 1. Install / create Cordova app
<http://phonegap.com/start/>
> Make sure 'use automatic reference counting' is **not** selected when you create the project.  
> Before you proceed, make sure you have run the application and 'www' is linked in your project. If not, please look at the Cordova docs again! 

## Step 2. Install Opentok Framework
The Easiest way is to do this: take a working Opentok app and clone Opentok Framework and all the dependencies to your project.  Here's how to do that.

1. Clone from <https://github.com/opentok/OpenTok-iOS-Hello-World.git> and open the Hello-World xcode project.  
Be sure to git clone with --recursive to grab the required OpenTok iOS SDK submodule!  
`git clone --recursive https://github.com/opentok/OpenTok-iOS-Hello-World.git`

2. Drag the Opentok.framework and all dependencies from Hello-World in xcode into your project's *Frameworks* folder.   
Make sure `Copy items into destination group's folder` is **not** selected
![framework](http://songz.github.com/phonegap-plugin-opentok/images/framework.png)

3. click on your project in **File Navigator** and select **Build Settings**  

> Make sure **Standard (armv7)** is selected for **Architectures**  
> Make sure **armv7** is the ONLY option selected for **Valid Architectures**   
>> Sometimes xcode doesn't update immediately. Click outside on the white box and your change will appear!

![architecture](http://songz.github.com/phonegap-plugin-opentok/images/arch.png)

## Step 3. Install Opentok Phonegap Plugin
1. Clone from <https://github.com/songz/phonegap-plugin-opentok>

2. Copy `OpentokPlugin.h`, `OpentokPlugin.m`, `OpentokStreamInfo.h`, and `OpentokStreamInfo.h` into your **Classes** folder
Make sure `Copy items into destination group's folder` **is selected**
![ios](http://songz.github.com/phonegap-plugin-opentok/images/ioslib.png)

3. Copy `Opentok.iOS.js` into your `www` folder, the file will automatically appear in your xcode project manager  
![js](http://songz.github.com/phonegap-plugin-opentok/images/jslib.png)

### Done!

---

## Getting Started:
All your editing will be done in your www folder.

To use the opentok library, make sure you include **Opentok.iOS.js** file in your HTML document.  
` <script type="text/javascript" charset="utf-8" src="Opentok.iOS.js"></script>`

For smoother experience with video, you should prevent dragging. Uncomment the following lines in the HTML:

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

## Quick Tutorial:
Go through our [15 minute tutorial](http://www.tokbox.com/opentok/api/documentation/gettingstarted)! After that, try implementing the same thing on your cordova app.   
Here's a completed version of a working `index.html` file:


