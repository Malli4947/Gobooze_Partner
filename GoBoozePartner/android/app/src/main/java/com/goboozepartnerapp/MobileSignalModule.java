package com.goboozepartnerapp;


import android.telephony.TelephonyManager;
import android.telephony.CellSignalStrength;
import android.telephony.CellInfo;
import android.content.Context;
import android.os.Build;
import androidx.annotation.NonNull;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import java.util.List;

public class MobileSignalModule extends ReactContextBaseJavaModule {
  private final ReactApplicationContext reactContext;

  public MobileSignalModule(ReactApplicationContext reactContext) {
    super(reactContext);
    this.reactContext = reactContext;
  }

  @NonNull
  @Override
  public String getName() {
    return "MobileSignalModule";
  }

  @ReactMethod
  public void getMobileSignalStrength(Promise promise) {
    try {
      TelephonyManager telephonyManager = (TelephonyManager)
        reactContext.getSystemService(Context.TELEPHONY_SERVICE);
      if (telephonyManager != null) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
          List<CellInfo> cellInfoList = telephonyManager.getAllCellInfo();
          for (CellInfo cellInfo : cellInfoList) {
            if (cellInfo.isRegistered()) {
              CellSignalStrength signalStrength = cellInfo.getCellSignalStrength();
              int dbm = signalStrength.getDbm();
              promise.resolve(dbm);
              return;
            }
          }
          promise.resolve(-127); // fallback
        } else {
          promise.resolve(-1); // Unsupported
        }
      } else {
        promise.reject("TELEPHONY_ERROR", "TelephonyManager is null");
      }
    } catch (Exception e) {
      promise.reject("SIGNAL_ERROR", e.getMessage());
    }
  }
}
