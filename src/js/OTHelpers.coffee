streamElements = {} # keep track of DOM elements for each stream

# Whenever updateViews are involved, parameters passed through will always have:
# TBPublisher constructor, TBUpdateObjects, TBSubscriber constructor
# [id, top, left, width, height, zIndex, ... ]

#
# Helper methods
#
getPosition = (divName) ->
  # Get the position of element
  pubDiv = document.getElementById(divName)
  if !pubDiv then return {}
  computedStyle = if window.getComputedStyle then getComputedStyle(pubDiv, null) else {}
  width = pubDiv.offsetWidth
  height = pubDiv.offsetHeight
  curtop = pubDiv.offsetTop
  curleft = pubDiv.offsetLeft
  while(pubDiv = pubDiv.offsetParent)
    curleft += pubDiv.offsetLeft
    curtop += pubDiv.offsetTop
  marginTop = parseInt(computedStyle.marginTop) || 0
  marginBottom = parseInt(computedStyle.marginBottom) || 0
  marginLeft = parseInt(computedStyle.marginLeft) || 0
  marginRight = parseInt(computedStyle.marginRight) || 0
  return {
    top:curtop + marginTop
    left:curleft + marginLeft
    width:width - (marginLeft + marginRight)
    height:height - (marginTop + marginBottom)
  }

replaceWithVideoStream = (divName, streamId, properties) ->
  typeClass = if streamId == PublisherStreamId then PublisherTypeClass else SubscriberTypeClass
  element = document.getElementById(divName)
  element.setAttribute( "class", "OT_root #{typeClass}" )
  element.setAttribute( "data-streamid", streamId )
  element.style.width = properties.width+"px"
  element.style.height = properties.height+"px"
  element.style.overflow = "hidden"
  element.style['background-color'] = "#000000"
  streamElements[ streamId ] = element

  internalDiv = document.createElement( "div" )
  internalDiv.setAttribute( "class", VideoContainerClass)
  internalDiv.style.width = "100%"
  internalDiv.style.height = "100%"
  internalDiv.style.left = "0px"
  internalDiv.style.top = "0px"

  videoElement = document.createElement( "video" )
  videoElement.style.width = "100%"
  videoElement.style.height = "100%"
  # todo: js change styles or append css stylesheets? Concern: users will not be able to change via css

  internalDiv.appendChild( videoElement )
  element.appendChild( internalDiv )
  return element

TBError = (error) ->
  navigator.notification.alert(error)

TBSuccess = ->
  console.log("success")

TBUpdateObjects = ()->
  console.log("JS: Objects being updated in TBUpdateObjects")
  objects = document.getElementsByClassName('OT_root')

  ratios = TBGetScreenRatios()

  for e in objects
    console.log("JS: Object updated")
    streamId = e.dataset.streamid
    console.log("JS sessionId: " + streamId )
    id = e.id
    position = getPosition(id)
    Cordova.exec(TBSuccess, TBError, OTPlugin, "updateView", [streamId, position.top, position.left, position.width, position.height, TBGetZIndex(e), ratios.widthRatio, ratios.heightRatio] )
  return
TBGenerateDomHelper = ->
  domId = "PubSub" + Date.now()
  div = document.createElement('div')
  div.setAttribute( 'id', domId )
  document.body.appendChild(div)
  return domId

TBGetZIndex = (ele) ->
  while( ele? )
    val = document.defaultView.getComputedStyle(ele,null).getPropertyValue('z-index')
    console.log val
    if ( parseInt(val) )
      return val
    ele = ele.offsetParent
  return 0

TBGetScreenRatios = ()->
    # Ratio between browser window size and viewport size
    return {
        widthRatio: window.outerWidth / window.innerWidth,
        heightRatio: window.outerHeight / window.innerHeight
    }

pdebug = (msg, data) ->
  console.log "JS Lib: #{msg} - ", data
