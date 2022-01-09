import React from 'react';
import {SafeAreaView, Image, Dimensions, StatusBar, View} from 'react-native';
import { Colors } from '../themes/Colors';
import {widthPercentageToDP as wp,heightPercentageToDP as hp} from 'react-native-responsive-screen';
import LottieView from 'lottie-react-native';


const Container = (props) => {
  const {
    statusBarColor,
    backgroundImageStyle,
    barStyle,
    backgroundImage,
    overlay,
    overlayColor,
    style,
    lottie,
    lottieStyle
  } = props;

  let statusBarStyle = barStyle ? barStyle : 'dark-content';

  return (
    <SafeAreaView style={[styles.container, style]}>
      <StatusBar
        backgroundColor={statusBarColor || '#fff29e'}
        barStyle={statusBarStyle}
        translucent={false}
      />
      {backgroundImage && (
        <Image
          source={backgroundImage}
          style={[styles.backgroundImage, backgroundImageStyle]}
        />
      )}
      {lottie &&  <View style={[styles.lottieStyle,{opacity:lottieStyle?1:0.2}]}>

       <LottieView
          source={lottieStyle==1?require('../assets/json/Lottie9.json'):lottieStyle==2?require('../assets/json/Lottie13.json'):require('../assets/json/Lottie.json')}
          autoPlay
          loop
        />
        </View>}
      {overlay && (
        <View
          style={[
            styles.overlayStyle,
            {backgroundColor: overlayColor || 'black'},
          ]}
        />
      )}
      {props.children}
    </SafeAreaView>
  );
};

export default Container;

const styles = {
  container: {
    flex: 1,
    backgroundColor: 'white'
  },
  backgroundImage: {
    position: 'absolute',
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    tintColor:'red',
    resizeMode:'cover',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  overlayStyle: {
    position: 'absolute',
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.5,
  },
  lottieStyle: {
    position: 'absolute',
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    zIndex: 0,
    opacity:1
  },
};
