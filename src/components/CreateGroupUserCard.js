import React, {Component} from 'react';
import {View, Text, TouchableOpacity, Image,} from 'react-native';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import ResponsiveText from './ResponsiveText';
import Fonts from '../themes/Fonts';
import { Colors } from '../themes/Colors';

class CreateGroupUserCard extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    const {item,selected,pressCard} = this.props;
    return (
      <TouchableOpacity
      onPress={()=>pressCard(item)}
      activeOpacity={0.6}
        // onPress={() => this.props.navigation.navigate('Home')}
        style={styles.cardContainer}>
        <View style={styles.innerContainer}>
            <View style={styles.UserContainer}>
              <ResponsiveText style={{color:Colors.Primary}}>{item.full_name.substring(0,1).toUpperCase()}</ResponsiveText>
              {/* <Image
                source={require('../assets/icons/hashtag.png')}
                style={styles.hashtag}
              /> */}
            </View>
          <View style={styles.UserNameContainer}>
            <ResponsiveText style={styles.UserText}>
              {item.full_name}
            </ResponsiveText>
          </View>
        </View>
        <View style={{height:'100%',width:'10%',alignItems:'flex-end',justifyContent:'center'}}>
          {selected && <Image
                source={require('../assets/icons/tickSimple.png')}
                style={styles.hashtag}
              />}
        </View>
      </TouchableOpacity>
    );
  }
}

export default CreateGroupUserCard;
const styles = {
  cardContainer: {
    height: wp('15'),
    // backgroundColor:'red',
    borderBottomWidth: wp('0.3'),
    // paddingHorizontal:wp(5),
    borderColor: '#E1E1E1',
    // borderColor:"#white",
    flexDirection:'row',
    justifyContent: 'center',
    alignItems:'center'
  },
  innerContainer: {
    width: '90%',
    height: wp('15'),
    flexDirection: 'row',
    alignItems:'center'
  },
  UserContainer: {
    height: wp('10'),
    width: wp('10'),
    borderRadius: wp('10'),
    overflow: 'hidden',
    backgroundColor: '#faeb84',
    justifyContent: 'center',
    alignItems: 'center',
  },

  UserNameContainer: {
    marginLeft: wp('4.5'),
    // flexGrow:1,
    width: wp('45'),
    height: wp('15'),
    maxHeight: wp('14'),
    overflow: 'hidden',
    // marginTop: wp('1'),
    justifyContent: 'center',
  },
  UserText: {
    fontFamily: Fonts.OpenSansRegular,
    fontSize: 4.3,
  },
  hashtag: {
    height: 25,
    width: 25,
    resizeMode: 'contain',
    tintColor: Colors.Primary,
  },
};
