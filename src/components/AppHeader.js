import React from 'react';
import {TouchableOpacity, View} from 'react-native';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import ResponsiveText from './ResponsiveText';

const AppHeader = (props) => {
  return (
    <View style={[styles.customStyle, props.containerStyle]}>
      <View style={[styles.left, props.leftStyle]}>
        {props.left && (
          <TouchableOpacity activeOpacity={0.8} onPress={props.leftPress}>
            {props.left}
          </TouchableOpacity>
        )}
      </View>
      <View style={[styles.body, props.bodyStyle]}>
        {props.body}
        {/* <ResponsiveText>Online</ResponsiveText> */}
       {props.typing}

        </View>
      <View style={[styles.right, props.rightStyle]}>
        {props.right && (
          <TouchableOpacity activeOpacity={0.8} onPress={props.rightPress}>
            {props.right}
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default AppHeader;

const styles = {
  customStyle: {
    
    height: wp('16%'),
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: wp('5'),
    backgroundColor: 'white',
  },
  left: {
    flex: 1,
    flexDirection: 'row',
  },
  body: {
    flex: 4,
    alignItems: 'center',
  },
  right: {
    flex: 1,
    alignItems: 'flex-end',
  },
};
