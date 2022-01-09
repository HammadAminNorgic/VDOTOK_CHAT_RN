import React from 'react';
import {View, Text, Image} from 'react-native';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import Container from '../../components/Container';
import Button from '../../components/Button';
import ResponsiveText from '../../components/ResponsiveText';
import Fonts from '../../themes/Fonts';


class GetStarted extends React.Component {
  render() {
    return (
      <Container lottieStyle={1} lottie style={styles.container}>
        <View style={styles.bottomContainer}>
          <Image
            source={require('../../assets/images/full_Logo.png')}
            style={styles.logo}
          />
          <View>
          <Button
            text={'Get Started'}
            containerStyle={styles.button}
            textStyle={styles.buttonText}
            onPress={() => this.props.navigation.navigate('Walkthrough')}

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

export default GetStarted;

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
    // backgroundColor:'red',
    height:'100%',
    justifyContent:'space-between'
    // position:'absolute',
  },
  logo: {
    height: wp('100'),
    width: wp('35'),
    resizeMode: 'contain',
    // marginBottom: '15%',
  },
  button: {
    width: wp('85'),
    height: wp('15'),
    // backgroundColor: '#0089FF',
    elevation: 0,
  },
  buttonText: {
    // fontWeight: 'bold',
    fontSize: 5,
    // fontFamily: Fonts.SourceSansProSemiBold,
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
    fontFamily: Fonts.RobotoRegular
  },
  
};