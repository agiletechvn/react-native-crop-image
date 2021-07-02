package com.tmgmo.dev;

import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.util.Base64;

import androidx.annotation.NonNull;


import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import com.facebook.react.bridge.WritableMap;
import com.facebook.react.module.annotations.ReactModule;


import java.io.ByteArrayOutputStream;

@ReactModule(name = CropImageModule.NAME)
public class CropImageModule extends ReactContextBaseJavaModule {
    public static final String NAME = "CropImage";

    public CropImageModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    @NonNull
    public String getName() {
        return NAME;
    }

    @ReactMethod
    public void crop(String base64, int x, int y, int width, int height, Promise promise) {
        // from base64 to bitmap
        try {
          byte[] decodedString = Base64.decode(base64, Base64.DEFAULT);
          Bitmap originBitmap = BitmapFactory.decodeByteArray(decodedString, 0,decodedString.length);
          // crop bitmap
          Bitmap croppedBitmap = Bitmap.createBitmap(originBitmap, x, y, width, height);

          // // encode cropped bitmap
          ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
          croppedBitmap.compress(Bitmap.CompressFormat.PNG, 100, byteArrayOutputStream);
          byte[] byteArray = byteArrayOutputStream .toByteArray();

          String encoded = Base64.encodeToString(byteArray, Base64.DEFAULT);

          promise.resolve(encoded);
        } catch (Exception exception) {
          promise.reject(exception);
        }
    }

    @ReactMethod
    public void getImageInfo(String base64, Promise promise) {
      try {
        byte[] decodedString = Base64.decode(base64, Base64.DEFAULT);
        Bitmap originBitmap = BitmapFactory.decodeByteArray(decodedString, 0,decodedString.length);

        WritableMap map = Arguments.createMap();
        map.putInt("width", originBitmap.getWidth());
        map.putInt("height", originBitmap.getHeight());
        map.putInt("size", originBitmap.getByteCount());
        // data
        promise.resolve(map);
      } catch (Exception exception) {
        promise.reject(exception);
      }
    }

}
