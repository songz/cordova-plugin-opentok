# Publisher Object

The Publisher object provides information about the publishing stream. Calling the TB.initPublisher() method creates a Publisher object.

## Properties

**id** (String) — The ID of the DOM element through which the Publisher stream is displayed

**session** (Session) — The Session to which the Publisher is publishing a stream. If the Publisher is not publishing a stream to a Session, this property is set to null.

**replaceElementId** (String) — The ID of the DOM element that was replaced when the Publisher video stream was inserted.

*Note*: Publisher properties should only be used as read-only entities.
