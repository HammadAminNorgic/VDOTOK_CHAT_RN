import React, {Component} from 'react';
import {View, Text, TouchableOpacity, ImageBackground,Image} from 'react-native';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
// import {Image} from 'react-native-animatable';
import ResponsiveText from './ResponsiveText';
import Fonts from '../themes/Fonts';
import { Colors } from '../themes/Colors';

class ChatCard extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    const {
      profile_image,
      user_name,
      time,
      unseen_messsages,
      last_message,
      item,onPressCard
    } = this.props;

    return (
      <TouchableOpacity
        onPress={() =>{
          onPressCard()
        // setTimeout(() => {
        //   this.props.navigation.navigate('Messages', {
        //     profile_image,
        //     user_name,
        //     time,
        //     unseen_messsages,
        //     last_message,
        //   })
        // }, 50); 
        }
        }
        activeOpacity={1}
        style={styles.cardContainer}>
        <View style={styles.innerContainer}>
          <View>
            <View style={styles.imageContainer}>
              {/* <ImageBackground
                source={require('../assets/images/placeholder.png')}
                style={styles.placeholderImage}> */}
                {<Image
                  source={item.auto_created===0?require('../assets/icons/users.png'):require('../assets/icons/user.png')}
                  style={styles.profileImage}
                />}
              {/* </ImageBackground> */}
            </View>
            {unseen_messsages !== 0 && (
              <View style={styles.unseenBadge}>
                <ResponsiveText
                  style={{
                    fontSize: 3,
                    color: 'white',
                    fontFamily: Fonts.OpenSansRegular,
                  }}>
                  {unseen_messsages}
                </ResponsiveText>
              </View>
            )}
          </View>
          <View style={styles.nameContainer}>
            <ResponsiveText
                    numberOfLines={1}
            
            style={styles.name}>{item.auto_created == 0
                                    ? item.group_title
                                    : item.group_title.includes('-')?item.group_title
                                    .split("-")
                                    .find(
                                      (e) => e !== this.props.user.username
                                    ):item.group_title}</ResponsiveText>
            <View style={styles.lastMessage}>
              {last_message}
            </View>
          </View>
          <View style={styles.timeContainer}>
            {time}
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}

export default ChatCard;
const styles = {
  cardContainer: {
    height: wp('21'),
    backgroundColor:'white',
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
  imageContainer: {
    height: wp('14'),
    width: wp('14'),
    borderRadius: wp('14'),
    overflow: 'hidden',
    backgroundColor:'#faeb84',
    alignItems:'center',
    justifyContent:'center'
  },
  placeholderImage: {
    height: wp('14'),
    width: wp('14'),
  },
  profileImage: {
    height: wp('10'),
    width: wp('10'),
    borderRadius: wp('10'),
    tintColor:Colors.Primary,
    opacity:0.5
  },
  unseenBadge: {
    borderRadius: wp('10'),
    backgroundColor: '#ff3333',
    position: 'absolute',
    right: 0,
    paddingVertical: wp('0.5'),
    paddingHorizontal: wp('1.5'),
    elevation: 1,
  },
  nameContainer: {
    marginLeft: wp('3'),
    // flexGrow:1,
    width: wp('55'),
    height: wp('14'),
    maxHeight: wp('14'),
    overflow: 'hidden',
    marginTop: wp('1'),
  },
  name: {
    fontFamily: Fonts.OpenSansRegular,
    fontSize: 4.4,
    // maxHeight: wp('4.5'),
    marginBottom: wp('0.5'),
    color: 'black',
  },
  lastMessage: {
    fontFamily: Fonts.OpenSansRegular,
    fontSize: 3.2,
    maxHeight: wp('6'),
    color: '#3A3A3A',
    opacity: 0.6,
  },
  timeContainer: {
    flexGrow: 1,
     alignItems:'center'
  },
  time: {
    fontSize: 2.5,
    marginTop: wp('1'),
    color: '#3A3A3A',
    opacity: 0.5,
  },
};
