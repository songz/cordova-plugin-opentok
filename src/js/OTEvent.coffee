class TBEvent
  constructor: (prop) ->
    for k,v of prop
      @[k] = v
    @defaultPrevented = false
    return
  isDefaultPrevented: =>
    return @defaultValue
  preventDefault: =>
    # todo: implement preventDefault
    return


