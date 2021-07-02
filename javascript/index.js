import React, { useState, useEffect } from "react";

import { View, Image, StyleSheet, Text, TouchableOpacity } from "react-native";

import { getBottomSpace } from "react-native-iphone-x-helper";

import { Dimensions, Alert } from "react-native";

import Box from "@src/components/Box";

import NavigationCroppingImage from "./NavigationCroppingImage";

import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedGestureHandler,
} from "react-native-reanimated";
import { PanGestureHandler } from "react-native-gesture-handler";

import {
  decodeBase64Image,
  formatBase64Image,
  getOriginSize,
} from "@src/utils/image";

import { useConfigStateValue } from "@src/atoms/config";

import i18n from "@src/utils/i18n";

import {
  detectImage,
  formatVisionObjectResult,
  formatVisionResult,
  getVisionFirstLocalizedObject,
} from "@src/utils/vision";

import { useSetLoadingState } from "@src/atoms/loading";

import CropImage from "@src/utils/cropImage";

import { useNavigation } from "@react-navigation/native";

import styles from "./style";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const RANGE = 20;

const CroppingImage = ({ image, coordinates }) => {
  const setLoading = useSetLoadingState();
  const navigation = useNavigation();
  const config = useConfigStateValue();

  const x1 = useSharedValue(coordinates[0].x * windowWidth || 0);
  const y1 = useSharedValue(coordinates[0].y * windowHeight || 0);

  const x2 = useSharedValue(coordinates[1].x * windowWidth || 0);
  const y2 = useSharedValue(coordinates[1].y * windowHeight || 0);

  const x3 = useSharedValue(coordinates[2].x * windowWidth || 0);
  const y3 = useSharedValue(coordinates[2].y * windowHeight || 0);

  const x4 = useSharedValue(coordinates[3].x * windowWidth || 0);
  const y4 = useSharedValue(coordinates[3].y * windowHeight || 0);

  const gestureHandler1 = useAnimatedGestureHandler({
    onStart: (_, ctx) => {
      ctx.startX1 = x1.value;
      ctx.startY1 = y1.value;
      ctx.startX2 = x2.value;
      ctx.startY2 = y2.value;
      ctx.startX4 = x4.value;
      ctx.startY4 = y4.value;
    },
    onActive: (event, ctx) => {
      if (
        ctx.startX1 + event.translationX <= ctx.startX2 - RANGE &&
        ctx.startX1 + event.translationX >= 0
      ) {
        x1.value = ctx.startX1 + event.translationX;
        x4.value = ctx.startX4 + event.translationX;
      }
      if (
        ctx.startY1 + event.translationY <= ctx.startY4 - RANGE &&
        ctx.startY1 + event.translationY >= 0
      ) {
        y1.value = ctx.startY1 + event.translationY;
        y2.value = ctx.startY2 + event.translationY;
      }
    },
  });

  const gestureHandler2 = useAnimatedGestureHandler({
    onStart: (_, ctx) => {
      ctx.startX1 = x1.value;
      ctx.startY1 = y1.value;
      ctx.startX2 = x2.value;
      ctx.startY2 = y2.value;
      ctx.startX3 = x3.value;
      ctx.startY3 = y3.value;
    },
    onActive: (event, ctx) => {
      if (
        ctx.startX2 + event.translationX > ctx.startX1 + RANGE &&
        ctx.startX2 + event.translationX <= windowWidth - RANGE
      ) {
        x2.value = ctx.startX2 + event.translationX;
        x3.value = ctx.startX3 + event.translationX;
      }
      if (
        ctx.startY2 + event.translationY < ctx.startY3 - RANGE &&
        ctx.startY2 + event.translationY >= 0
      ) {
        y2.value = ctx.startY2 + event.translationY;
        y1.value = ctx.startY1 + event.translationY;
      }
    },
  });
  const gestureHandler3 = useAnimatedGestureHandler({
    onStart: (_, ctx) => {
      ctx.startX2 = x2.value;
      ctx.startY2 = y2.value;
      ctx.startX3 = x3.value;
      ctx.startY3 = y3.value;
      ctx.startX4 = x4.value;
      ctx.startY4 = y4.value;
    },
    onActive: (event, ctx) => {
      if (
        ctx.startX3 + event.translationX > ctx.startX4 + RANGE &&
        ctx.startX3 + event.translationX <= windowWidth - RANGE
      ) {
        x3.value = ctx.startX3 + event.translationX;
        x2.value = ctx.startX2 + event.translationX;
      }
      if (
        ctx.startY3 + event.translationY > ctx.startY2 + RANGE &&
        ctx.startY3 + event.translationY <= windowHeight - RANGE
      ) {
        y3.value = ctx.startY3 + event.translationY;
        y4.value = ctx.startY4 + event.translationY;
      }
    },
  });
  const gestureHandler4 = useAnimatedGestureHandler({
    onStart: (_, ctx) => {
      ctx.startX1 = x1.value;
      ctx.startY1 = y1.value;
      ctx.startX3 = x3.value;
      ctx.startY3 = y3.value;
      ctx.startX4 = x4.value;
      ctx.startY4 = y4.value;
    },
    onActive: (event, ctx) => {
      if (
        ctx.startX4 + event.translationX < ctx.startX3 - RANGE &&
        ctx.startX4 + event.translationX >= 0
      ) {
        x4.value = ctx.startX4 + event.translationX;
        x1.value = ctx.startX1 + event.translationX;
      }
      if (
        ctx.startY4 + event.translationY > ctx.startY1 + RANGE &&
        ctx.startY4 + event.translationY <= windowHeight - RANGE
      ) {
        y4.value = ctx.startY4 + event.translationY;
        y3.value = ctx.startY3 + event.translationY;
      }
    },
  });

  const gestureHandlerReatangle = useAnimatedGestureHandler({
    onStart: (_, ctx) => {
      ctx.startX1 = x1.value;
      ctx.startY1 = y1.value;
      ctx.startX2 = x2.value;
      ctx.startY2 = y2.value;
      ctx.startX3 = x3.value;
      ctx.startY3 = y3.value;
      ctx.startX4 = x4.value;
      ctx.startY4 = y4.value;
    },
    onActive: (event, ctx) => {
      if (
        ctx.startX1 + event.translationX >= 0 &&
        ctx.startX2 + event.translationX <= windowWidth - RANGE &&
        ctx.startY4 + event.translationY <= windowHeight - RANGE &&
        ctx.startY1 + event.translationY >= 0
      ) {
        x1.value = ctx.startX1 + event.translationX;
        y1.value = ctx.startY1 + event.translationY;
        x2.value = ctx.startX2 + event.translationX;
        y2.value = ctx.startY2 + event.translationY;
        x3.value = ctx.startX3 + event.translationX;
        y3.value = ctx.startY3 + event.translationY;
        x4.value = ctx.startX4 + event.translationX;
        y4.value = ctx.startY4 + event.translationY;
      }
    },
  });

  const animatedStyle1 = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: x1.value,
        },
        {
          translateY: y1.value,
        },
      ],
    };
  });

  const animatedStyle2 = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: x2.value,
        },
        {
          translateY: y2.value,
        },
      ],
    };
  });

  const animatedStyle3 = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: x3.value,
        },
        {
          translateY: y3.value,
        },
      ],
    };
  });

  const animatedStyle4 = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: x4.value,
        },
        {
          translateY: y4.value,
        },
      ],
    };
  });

  const animatedStyleRectangle = useAnimatedStyle(() => {
    return {
      height: y4.value - y1.value + RANGE,
      width: x2.value - x1.value + RANGE,
      transform: [
        {
          translateX: x1.value,
        },
        {
          translateY: y1.value,
        },
      ],
    };
  });

  const animatedStyleTop = useAnimatedStyle(() => {
    return {
      position: "absolute",
      top: 0,
      width: windowWidth,
      height: windowHeight - (windowHeight - y1.value),
    };
  });

  const animatedStyleLeft = useAnimatedStyle(() => {
    return {
      width: x1.value,
      height: y4.value - y1.value + RANGE,
      transform: [
        {
          translateY: y1.value,
        },
      ],
    };
  });

  const animatedStyleRight = useAnimatedStyle(() => {
    return {
      width: windowWidth - x2.value - RANGE,
      height: y4.value - y1.value + RANGE,
      transform: [
        {
          translateY: y2.value,
        },
      ],
    };
  });

  const animatedStyleBottom = useAnimatedStyle(() => {
    return {
      width: windowWidth,
      height: windowHeight - y4.value,
      position: "absolute",
      transform: [
        {
          translateY: y4.value + RANGE,
        },
      ],
    };
  });

  const onCropImage = async () => {
    try {
      const imageSize = await getOriginSize(image);

      const originWidth = imageSize?.width || 1;
      const originHeight = imageSize?.height || 1;

      const x1Value = (x1.value / windowWidth) * originWidth;
      const y1Value = (y1.value / windowHeight) * originHeight;

      const rectangleWidth =
        ((x2.value - x1.value + RANGE) / windowWidth) * originWidth;

      const rectangleHeight =
        ((y4.value - y1.value + RANGE) / windowHeight) * originHeight;

      const result = await CropImage.crop(
        decodeBase64Image(image),
        Math.ceil(x1Value),
        Math.ceil(y1Value),
        Math.ceil(rectangleWidth),
        Math.ceil(rectangleHeight)
      );

      setLoading(true);
      const visions = await detectImage(
        result,
        config?.enable_object_detection
          ? [{ max_results: 5, type: "OBJECT_LOCALIZATION" }]
          : config?.google_visions_features || []
      );
      setLoading(false);

      navigation.navigate("ProductList", {
        search: config?.enable_object_detection
          ? formatVisionObjectResult(visions[0])
          : formatVisionResult(visions[0]),
        localizationObject: config?.enable_object_detection
          ? getVisionFirstLocalizedObject(visions[0])
          : null,
        image: image,
        name: i18n.t("camera_vision_search_result"),
        isVisionSearch: true,
      });
    } catch (error) {
      setLoading(false);
      Alert.alert(i18n.t("product_search_empty"), "", [
        {
          text: i18n.t("common_cancel"),
          onPress: () => {},
        },
      ]);
    }
  };

  return (
    <>
      <Box flex={1} style={styles.relative}>
        <Image
          resizeMode="stretch"
          style={styles.image}
          source={{
            uri: image,
          }}
        />
        <Box style={styles.relative}>
          <PanGestureHandler>
            <Animated.View style={[styles.block, animatedStyleTop]} />
          </PanGestureHandler>
          <PanGestureHandler>
            <Animated.View
              style={[styles.block, styles.left, animatedStyleLeft]}
            />
          </PanGestureHandler>
          <PanGestureHandler>
            <Animated.View
              style={[styles.block, styles.right, animatedStyleRight]}
            />
          </PanGestureHandler>
          <PanGestureHandler>
            <Animated.View style={[styles.block, animatedStyleBottom]} />
          </PanGestureHandler>
        </Box>
        <Box style={styles.relative}>
          <PanGestureHandler onGestureEvent={gestureHandler1}>
            <Animated.View style={[styles.box, animatedStyle1]}>
              <Box style={styles.relative}>
                <View style={[styles.line, styles.line1]} />
                <View style={[styles.column, styles.column1]} />
              </Box>
            </Animated.View>
          </PanGestureHandler>
          <PanGestureHandler onGestureEvent={gestureHandler2}>
            <Animated.View style={[styles.box, animatedStyle2]}>
              <Box style={styles.relative}>
                <View style={[styles.line, styles.line2]} />
                <View style={[styles.column, styles.column2]} />
              </Box>
            </Animated.View>
          </PanGestureHandler>
          <PanGestureHandler onGestureEvent={gestureHandler3}>
            <Animated.View style={[styles.box, animatedStyle3]}>
              <Box style={styles.relative}>
                <View style={[styles.line, styles.line3]} />
                <View style={[styles.column, styles.column3]} />
              </Box>
            </Animated.View>
          </PanGestureHandler>
          <PanGestureHandler onGestureEvent={gestureHandler4}>
            <Animated.View style={[styles.box, animatedStyle4]}>
              <Box style={styles.relative}>
                <View style={[styles.line, styles.line4]} />
                <View style={[styles.column, styles.column4]} />
              </Box>
            </Animated.View>
          </PanGestureHandler>
          <PanGestureHandler onGestureEvent={gestureHandlerReatangle}>
            <Animated.View style={[styles.box5, animatedStyleRectangle]} />
          </PanGestureHandler>
        </Box>
        <Box style={[styles.absolute, styles.navigationBottom]}>
          <NavigationCroppingImage onCropImage={onCropImage} />
        </Box>
      </Box>
    </>
  );
};

export default CroppingImage;
