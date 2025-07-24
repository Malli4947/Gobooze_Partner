package com.goboozepartnerapp;

import android.content.Context;
import android.net.ConnectivityManager;
import android.net.NetworkCapabilities;
import android.os.Build;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Promise;

public class NetworkTypeModule extends ReactContextBaseJavaModule {
  private final ReactApplicationContext reactContext;

  public NetworkTypeModule(ReactApplicationContext reactContext) {
    super(reactContext);
    this.reactContext = reactContext;
  }

  @Override
  public String getName() {
    return "NetworkTypeModule";
  }

  @ReactMethod
  public void getActiveNetworkType(Promise promise) {
    try {
      ConnectivityManager cm = (ConnectivityManager) reactContext.getSystemService(Context.CONNECTIVITY_SERVICE);
      if (cm != null) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
          NetworkCapabilities nc = cm.getNetworkCapabilities(cm.getActiveNetwork());
          if (nc != null) {
            if (nc.hasTransport(NetworkCapabilities.TRANSPORT_WIFI)) {
              promise.resolve("wifi");
              return;
            } else if (nc.hasTransport(NetworkCapabilities.TRANSPORT_CELLULAR)) {
              promise.resolve("mobile");
              return;
            }
          }
        }
      }
      promise.resolve("none");
    } catch (Exception e) {
      promise.reject("NETWORK_TYPE_ERROR", e.getMessage());
    }
  }
}
