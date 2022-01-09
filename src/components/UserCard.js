import React, {Component} from 'react';
import {View, Text, TouchableOpacity, Image} from 'react-native';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import ResponsiveText from './ResponsiveText';
import Fonts from '../themes/Fonts';
import { Colors } from '../themes/Colors';

class UserCard extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    const {userName,item,selected,onPress} = this.props;
    // console.log(item.id);
    return (
      <View
      activeOpacity={0.8}
        onPress={() => onPress(item)}
        style={styles.cardContainer}>
        <View style={styles.innerContainer}>
          <View>
            <View style={styles.HashContainer}>
              <Image
                source={require('../assets/icons/hashtag.png')}
                style={styles.hashtag}
              />
            </View>
          </View>
          <View style={styles.HashNameContainer}>
            <ResponsiveText style={styles.HashTagText}>
              {item.full_name}
            </ResponsiveText>
          </View>
          {
            selected && (
              <View style={{position:'absolute',right:0,top:wp(5.5),alignItems:'center',justifyContent:'center'}}>
            <Image source={require('../assets/icons/tick.png')} style={{height:18,width:18,resizeMode:'contain',tintColor:Colors.Primary}}/>
          </View>
            )
          }
        </View>
      </View>
    );
  }
}

export default UserCard;
const styles = {
  cardContainer: {
    height: wp('15'),
    // backgroundColor:'red',
    borderBottomWidth: wp('0.3'),
    borderColor: '#E1E1E1',
    // borderColor:"#white",
    justifyContent: 'center',
  },
  innerContainer: {
    width: '100%',
    height: wp('15'),
    flexDirection: 'row',
  },
  HashContainer: {
    height: wp('13'),
    width: wp('13'),
    borderRadius: wp('13'),
    overflow: 'hidden',
    // backgroundColor: '#E6F4FF',
    backgroundColor:Colors.PrimaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },

  HashNameContainer: {
    marginLeft: wp('4.5'),
    // flexGrow:1,
    width: wp('45'),
    height: wp('15'),
    maxHeight: wp('14'),
    overflow: 'hidden',
    // marginTop: wp('1'),
    justifyContent: 'center',
  },
  HashTagText: {
    fontFamily: Fonts.OpenSansRegular,
    fontSize: 4.3,
  },
  hashtag: {
    height: '45%',
    width: '45%',
    resizeMode: 'contain',
    // tintColor: '#008AFF',
    tintColor:'white'
  },
};