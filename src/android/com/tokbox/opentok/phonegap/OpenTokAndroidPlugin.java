package com.tokbox.opentok.phonegap;

import java.util.HashMap;

import org.apache.cordova.CordovaInterface;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaWebView;
import org.apache.cordova.PluginResult;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import android.app.AlertDialog;
import android.content.Context;
import android.content.SharedPreferences;
import android.content.SharedPreferences.Editor;
import android.util.Log;
import android.view.View;
import android.view.ViewGroup;
import android.widget.RelativeLayout;
import android.widget.TextView;

import com.opentok.android.Connection;
import com.opentok.android.OpentokException;
import com.opentok.android.Publisher;
import com.opentok.android.Session;
import com.opentok.android.Stream;
import com.opentok.android.Subscriber;

public class OpenTokAndroidPlugin extends CordovaPlugin implements Session.Listener{
  protected Session mSession;
  protected Publisher mPublisher;
  public static final String TAG = "OTPlugin";
  public boolean sessionConnected;
  public boolean publishCalled;
  public RunnablePublisher myPublisher;
  public HashMap<String, CallbackContext> myEventListeners;
  public HashMap<String, Stream> streamCollection;
  public HashMap<String, Subscriber> subscriberCollection;
  
  static JSONObject viewList = new JSONObject();
  static CordovaInterface _cordova;
  static CordovaWebView _webView;
  
  public class ListenPublisher implements Publisher.Listener{
    @Override
    public void onPublisherStreamingStarted() {

    }

    @Override
    public void onPublisherStreamingStopped() {
        Log.i( TAG, "publisher is not streaming.");
    }

    @Override
    public void onPublisherChangedCamera(int i) {

    }

    @Override
    public void onPublisherException(OpentokException e) {

    }
  }
  
  public class ListenSubscriber implements Subscriber.Listener{
    @Override
    public void onSubscriberException(Subscriber subscriber, OpentokException e) {
        Log.e(TAG, "subscriber exception: " + e.getMessage() + ", stream id: " + subscriber.getStream().getStreamId());
    }
    @Override
    public void onSubscriberVideoDisabled(Subscriber subscriber) {
        Log.i(TAG, "subscriber video disabled, stream id: " + subscriber.getStream().getStreamId());
    }
    @Override
    public void onSubscriberConnected(Subscriber subscriber) {

    	Log.i(TAG, "subscriber is connected!");
    }
  }
   
  public class RunnablePublisher extends ListenPublisher implements Runnable{
	  public JSONArray property; 
	  public RunnablePublisher( JSONArray args ){
		  this.property = args;
		  
		  // prevent dialog box from showing
		  SharedPreferences prefs = cordova.getActivity().getApplicationContext().getSharedPreferences("permissions",
			        Context.MODE_PRIVATE);
		  Editor edit = prefs.edit();
		  edit.clear();
		  edit.putBoolean("opentok.publisher.accepted", true);
		  edit.commit();
	  }
	  
	  public void startPublishing(){
	      // Adding views
	      cordova.getActivity().runOnUiThread( this );
	  }
	  
      @Override
      public void run() {
    	  ViewGroup frame = (ViewGroup) cordova.getActivity().findViewById(android.R.id.content);
		  mPublisher = Publisher.newInstance(cordova.getActivity().getApplicationContext(), this, null);
		  View pubView = mPublisher.getView();
		  try{
			  Log.i( TAG, property.toString() );
			  pubView.setTranslationY( this.property.getInt(0));	
			  pubView.setTranslationX( this.property.getInt(1));
		      ViewGroup.LayoutParams rlp = new ViewGroup.LayoutParams( property.getInt(2), property.getInt(3) );
		      pubView.setLayoutParams( rlp );
		  }catch( Exception e ){
			  Log.i(TAG, "error when trying to retrieve publisher properties");
		  };
		  frame.addView( pubView );
		  mSession.publish(mPublisher);
      }
      
  }

  public class RunnableSubscriber extends ListenSubscriber implements Runnable{
	  
	  public JSONArray property;
	  //  [stream.streamId, position.top, position.left, width, height, subscribeToVideo, zIndex] )
	  public Subscriber mSubscriber;
	  
	  public RunnableSubscriber( JSONArray args, Stream stream ){
		  this.property = args;
		  
		 mSubscriber = Subscriber.newInstance(cordova.getActivity(), stream, this);
		 cordova.getActivity().runOnUiThread( this );
		 subscriberCollection.put(stream.getStreamId(), mSubscriber);
		  
	  }
      @Override
      public void run() {
    	  
    	  ViewGroup frame = (ViewGroup) cordova.getActivity().findViewById(android.R.id.content);
    	  
  View subView = mSubscriber.getView();
  try{
	  Log.i( TAG, property.toString() );
	  subView.setTranslationY( this.property.getInt(1));	
	  subView.setTranslationX( this.property.getInt(2));
      ViewGroup.LayoutParams rlp = new ViewGroup.LayoutParams( property.getInt(3), property.getInt(4) );
      subView.setLayoutParams( rlp );
  }catch( Exception e ){
	  Log.i(TAG, "error when trying to retrieve subscriber properties");
  };
    	  
    	  frame.addView( subView );
    	  mSession.subscribe(mSubscriber);
	    Log.i(TAG, "subscriber view is added to parent view!");
      }
  }
  
  @Override
  public void initialize(CordovaInterface cordova, CordovaWebView webView) {
      _cordova = cordova;
      _webView = webView;
      Log.d(TAG, "Initialize Plugin");
      // By default, get a pointer to mainView and add mainView to the viewList as it always exists (hold phonegap's view)
      if (!viewList.has("mainView")) {
          // Cordova view is not in the viewList so add it.
          try {
              viewList.put("mainView", webView);
              Log.d(TAG, "Found CordovaView ****** " + webView);
          } catch (JSONException e) {
              // Error handle (this should never happen!)
              Log.e(TAG, "Critical error. Failed to retrieve Cordova's view");
          }
      }
      
      // set OpenTok states
      publishCalled = false;
      sessionConnected = false;
      myEventListeners = new HashMap<String, CallbackContext>();
      streamCollection = new HashMap<String, Stream>();
      subscriberCollection = new HashMap<String, Subscriber>();
      
      super.initialize(cordova, webView);
  }

  @Override
  public boolean execute(String action, JSONArray args, CallbackContext callbackContext) throws JSONException {
    Log.i( TAG, action );
    if( action.equals("initPublisher")){
    	myPublisher = new RunnablePublisher( args );
    }else if( action.equals( "destroyPublisher" )){
    	
    }else if( action.equals( "initSession" )){
    	Log.i( TAG, "created new session with data: "+args.toString());
	    mSession = Session.newInstance( this.cordova.getActivity().getApplicationContext() , args.getString(0), this );
    }else if( action.equals( "streamCreatedHandler" )){
    	Log.i( TAG, "Stream created handler");
	    myEventListeners.put("streamCreated", callbackContext);
    }else if( action.equals( "connect" )){
    	Log.i( TAG, "connect command called");
	    mSession.connect( args.getString(0), args.getString(1));
	    myEventListeners.put("connect", callbackContext);
    }else if( action.equals( "streamDisconnectedHandler" )){
    	
    }else if( action.equals( "sessionDisconnectedHandler" )){
    	
    }else if( action.equals( "disconnect" )){
    	
    }else if( action.equals( "publish" )){
    	if( sessionConnected ){
    		myPublisher.startPublishing();
    	}
    }else if( action.equals( "unpublish" )){

    }else if( action.equals( "unsubscribe" )){
    	
    }else if( action.equals( "subscribe" )){
    	Log.i( TAG, "subscribe command called");
    	Log.i( TAG, "subscribe data: " + args.toString() );

		 Stream stream = streamCollection.get( args.getString(0) );
		 new RunnableSubscriber( args, stream );

    }else if( action.equals( "updateView" )){
    	
    }else if( action.equals( "exceptionHandler" )){
    	
    }
    return true;
  }
  
  public void alertUser( String message){
	// 1. Instantiate an AlertDialog.Builder with its constructor
	  AlertDialog.Builder builder = new AlertDialog.Builder( cordova.getActivity());
	  builder.setMessage( message ).setTitle( "TokBox Message");
	  AlertDialog dialog = builder.create();
  }
  
   @Override
    public void onSessionConnected() {
        Log.i(TAG, "session connected, triggering sessionConnected Event. My Cid is: "+ 
        		mSession.getConnection().getConnectionId()		);    	
        sessionConnected = true;
        JSONObject message = new JSONObject();        
        try{

            JSONObject connection= new JSONObject();
            connection.put("connectionId", mSession.getConnection().getConnectionId());

            message.put("connection", connection);
        }catch (JSONException e) {}
        
        myEventListeners.get("connect").success( message );
    }
    public void onSessionDisconnected() {
        Log.i(TAG, "session disconnected.");
    }

    @Override
    public void onSessionException(OpentokException e) {
        Log.e(TAG, "session exception: " + e.getMessage());
        alertUser("session error "+e.getMessage());
    }
 
    public void onSessionCreatedConnection(Connection connection) {
        Log.i(TAG, "connection created: " + connection.getConnectionId());
    }

    @Override
    public void onSessionDroppedConnection(Connection connection) {
        Log.i(TAG, "connection dropped: " + connection.getConnectionId());
    }


    @Override
    public void onSessionReceivedStream(Stream stream) {
    	Log.i(TAG, "stream received");

//        JSONArray message = new JSONArray();
//        message.put( stream.getConnection().getConnectionId() );
//        message.put( stream.getStreamId() );
    	String message = stream.getConnection().getConnectionId() + " " +stream.getStreamId() ; 

        Log.i(TAG, "stream array ready, returning: " + message.toString() );
        
        streamCollection.put(stream.getStreamId(), stream);
//        myEventListeners.get("streamCreated").success( message );
        //myEventListeners.get("streamCreated").( message );
        PluginResult myResult = new PluginResult(PluginResult.Status.OK, message);
        myResult.setKeepCallback(true);
        myEventListeners.get("streamCreated").sendPluginResult(myResult);
    }

    @Override
    public void onSessionDroppedStream(Stream stream) {
    }
}

