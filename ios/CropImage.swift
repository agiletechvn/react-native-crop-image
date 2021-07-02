//
//  CropImage.swift
//  tmg_department_mobile
//
//  Created by Admin on 6/28/21.
//

@objc(CropImage)
class CropImage: NSObject {
  
  @objc(crop:withX:withY:withWidth:withHeight:withResolver:withRejecter:)
  func crop(base64: String, x: Int, y: Int, width: Int, height: Int, resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) -> Void {
      let decodedData = Data(base64Encoded: base64)!
      let image = UIImage(data: decodedData)
    
      let rect:CGRect = CGRect(x: CGFloat(x), y: CGFloat(y), width: CGFloat(width), height: CGFloat(height))
      let croppedImageRef = image?.cgImage?.cropping(to: rect)
      
      let croppedImage:UIImage = UIImage(cgImage: croppedImageRef!)
      
      let data:Data = croppedImage.pngData()!
      let base64 = data.base64EncodedString();
    
      resolve(base64)
      
  }

  @objc(getImageInfo:withResolver:withRejecter:)
  func getImageInfo(base64: String, resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) -> Void {
      
    let decodedData = Data(base64Encoded: base64)!
    let image = UIImage(data: decodedData)
        
    let width = image?.size.width
    let height = image?.size.height
    let size = decodedData.count
        
    let result:NSDictionary = [
      "width" : width!,
      "height" : height!,
      "size" : size,
    ]

    resolve(result)
  }
}
    
