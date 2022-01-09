import React from 'react';
import {View, Text, Image} from 'react-native';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';

import Container from '../../components/Container';
import Button from '../../components/Button';
import ResponsiveText from '../../components/ResponsiveText';
import { Colors } from '../../themes/Colors';
import Fonts from '../../themes/Fonts';


class Walkthrough extends React.Component {
  render() {
    return (
      <Container lottieStyle={2} lottie style={styles.container}>
        <View style={styles.bottomContainer}>
          <Image
            source={require('../../assets/images/full_Logo.png')}
            style={styles.logo}
          />
          <View>
          <Button
            text={'Login'}
            containerStyle={styles.Loginbutton}
            textStyle={styles.LoginbuttonText}
            onPress={() => 
                this.props.navigation.navigate('Login')
            }
          />
          <Button
            text={'Sign up'}
            containerStyle={styles.Signupbutton}
            textStyle={styles.SignupbuttonText}
            onPress={() => 
                this.props.navigation.navigate('Signup')
            }
          />
          <View style={styles.textContainer}>
            <ResponsiveText style={styles.text}>
            Vdo Tok is a new go-to place for easy-to-use APIs for video and voice calls, messaging, live streaming and screen sharing.
            </ResponsiveText>
          </View>
          </View>
        </View>
      </Container>
    );
  }
}

export default Walkthrough;

const styles = {
  container: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
  },
  bottomContainer: {
    alignItems: 'center',
    height:'100%',
    justifyContent:'space-between'
    // position:'absolute',
  },
  logo: {
    height: wp('90'),
    width: wp('35'),
    resizeMode: 'contain',
    marginBottom: '10%',
  },
  Loginbutton: {
    width: wp('85'),
    height: wp('15'),
    marginBottom: wp('3.5'),
    elevation: 0,

  },
  Signupbutton: {
    width: wp('85'),
    height: wp('15'),
    backgroundColor: 'transparent',
    borderWidth: wp(0.6),
    borderColor: Colors.Primary,
    elevation: 0,
  },
  LoginbuttonText: {
    fontSize: 5,
    fontFamily:Fonts.RobotoMedium

  },
  SignupbuttonText:{
    fontSize: 5,
    color:Colors.Primary,
    fontFamily:Fonts.RobotoMedium


  },
  textContainer: {
    width: wp('80'),
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: wp('3'),
    paddingBottom: wp('8'),
  },
  text: {
    textAlign: 'center',
    fontSize: 3,
    color: '#686868',
    fontFamily:Fonts.RobotoRegular
  },
};