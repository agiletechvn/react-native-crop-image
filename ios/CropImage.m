#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(CropImage, NSObject)

RCT_EXTERN_METHOD(
  crop:base64
  withX:(int)x
  withY:(int)y
  withWidth: (int)width
  withHeight: (int)height
  withResolver:(RCTPromiseResolveBlock)resolve
  withRejecter:(RCTPromiseRejectBlock)reject
)

RCT_EXTERN_METHOD(
  getImageInfo:base64
  withResolver:(RCTPromiseResolveBlock)resolve
  withRejecter:(RCTPromiseRejectBlock)reject
)

@end
