import React from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  Dimensions,
  Platform,
  ToastAndroid,
  TouchableOpacity,
} from 'react-native';
import { connect } from 'react-redux';

import Container from '../../components/Container';
import Toast, {DURATION} from 'react-native-easy-toast';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import ResponsiveText from '../../components/ResponsiveText';
import InputField from '../../components/InputField';
import Button from '../../components/Button';
import Fonts from '../../themes/Fonts';
import bg from '../../assets/images/mountain.png';

import {Colors} from '../../themes/Colors';
import User from '../../services/User';
import { logoutUser, storeUserInfo } from '../../redux/user/actions';
const height = Dimensions.get('window').height;

const toastStyle = {
  backgroundColor: Colors.Primary,
  width: 300,
  height: Platform.OS === 'ios' ? 50 : 100,
  color: '#ffffff',
  fontSize: 15,
  lineHeight: 2,
  lines: 4,
  borderRadius: 15,
  fontWeight: 'bold',
  yOffset: 40,
};
class Signup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isPasswordVisible: false,
      email: '',
      userName: '',
      password: '',
      nameError: '',
      emailError: '',
      passwordError: '',
      loading: false,
      otherError: '',
    };
  }
  Signup = () => {
    const Emailreg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    const {userName, password, email} = this.state;
    if (email.trim().length === 0) {
      this.setState({emailError: 'Enter Email'});
    } else if (!Emailreg.test(email)) {
      this.setState({emailError: 'Enter Valid Email !'});
    } else if (userName.trim().length === 0) {
      this.setState({nameError: 'Enter Username'});
    } else if (userName.trim().length < 4) {
      this.setState({nameError: 'Username must contain 4 characters'});
    } else if (password.trim().length === 0) {
      this.setState({passwordError: 'Enter Password'});
    } else if (password.trim().length < 8) {
      this.setState({
        passwordError: 'Password must contain atleast 8 characters',
      });
    } else {
      this.setState({
        loading: true,
        emailError: '',
        passwordError: '',
        nameError: '',
        otherError: '',
      });
      let user = {
       
        full_name:this.state.userName,
        email:this.state.email,
        password:this.state.password,
        device_type:"android",
        device_model:"Redmi",
        device_os_ver:"13.3",
        app_version:"1.1.5 (269)",
        project_id: "176GK5IN"
      };
      console.log('data before signup-->',user);
      User.Signup(user)
        .then(res => {
          console.log('res on signup-->', res.data);
          if (res.data  && res.data.status == 200) {
            this.props.reduxstoreUserInfo(res.data)
          } else {
            this.setState({otherError: res.data.message});
          }
        })
        .catch(err => console.log('err on signup-->', err))
        .finally(() => {
          this.setState({loading: false});
        });
    }
  };
  render() {
    const {nameError, passwordError, otherError,emailError} = this.state;
    return (
      <Container
        lottie
        backgroundImage={bg}
        backgroundImageStyle={styles.containerBack}
        style={{flex: 1}}>
        <ScrollView contentContainerStyle={styles.scrollView}>
          <View style={styles.topContainer}>
            <Image
              source={require('../../assets/images/full_Logo.png')}
              style={styles.logo}
            />
            
            <ResponsiveText style={styles.loginText}>Sign Up</ResponsiveText>
            <InputField
              //   autoFocus
              placeholder={'Enter Email'}
              value={this.state.email}
              containerStyle={[
                styles.usernameInpt,
                {backgroundColor: emailError ? 'rgba(255, 0, 0,0.15)' : 'white'},
              ]}
              keyboardType={'email-address'}
              onChangeText={e => this.setState({email: e, emailError: ''})}
            />
            <ResponsiveText style={styles.errorText}>
              {emailError}
            </ResponsiveText>
            <InputField
              //   autoFocus
              placeholder={'Enter Username'}
              value={this.state.userName}
              containerStyle={[
                styles.usernameInpt,
                {backgroundColor: nameError ? 'rgba(255, 0, 0,0.15)' : 'white'},
              ]}
              keyboardType={'email-address'}
              onChangeText={e => this.setState({userName: e, nameError: ''})}
            />
            <ResponsiveText style={styles.errorText}>
              {nameError}
            </ResponsiveText>
            <InputField
              placeholder={'Enter Password'}
              containerStyle={[
                styles.passwordInput,
                {
                  backgroundColor: passwordError
                    ? 'rgba(255, 0, 0,0.15)'
                    : 'white',
                },
              ]}
              onChangeText={e =>
                this.setState({password: e, passwordError: ''})
              }
              value={this.state.password}
              secureTextEntry={this.state.isPasswordVisible ? false : true}
              right={
                <Image
                  source={require('../../assets/icons/eye.png')}
                  style={[
                    styles.eye,
                    {
                      tintColor: this.state.isPasswordVisible
                        ? Colors.Primary
                        : 'grey',
                    },
                  ]}
                />
              }
              rightPress={() =>
                this.setState(prev => ({
                  isPasswordVisible: !prev.isPasswordVisible,
                }))
              }
            />
            <ResponsiveText style={styles.errorText}>
              {passwordError}
            </ResponsiveText>

            <Button
              loading={this.state.loading}
              text={'Signup'}
              containerStyle={styles.Loginbutton}
              textStyle={styles.LoginbuttonText}
              onPress={
                () => this.Signup()
                //  this.props.navigation.navigate('GetReady')
              }
            />
            <ResponsiveText style={styles.errorText}>
              {otherError}
            </ResponsiveText>
          </View>
          <TouchableOpacity
            disabled={this.state.loading}
            onPress={() => this.props.navigation.navigate('Login')}
            style={{
              flexDirection: 'row',
              paddingBottom: wp('5'),
            }}>
            <Text
              style={{
                textDecorationLine: 'underline',
                fontFamily: Fonts.RobotoRegular,
                color: '#7E7E7E',
              }}>
              Already have an account?{' '}
            </Text>
            <Text
              style={{
                color: Colors.Primary,
                textDecorationLine: 'underline',
                fontFamily: Fonts.RobotoRegular,
              }}>
              Log In
            </Text>
          </TouchableOpacity>
        </ScrollView>
        <Toast
          ref="toast"
          style={{
            backgroundColor: Colors.Primary,
            width: '100%',
            borderRadius: 0,
            height: 50,
            justifyContent: 'center',
            alignItems: 'center',
          }}
          position="top"
          positionValue={0}
          fadeInDuration={0}
          fadeOutDuration={2000}
          opacity={0.9}
          textStyle={{color: 'white', fontFamily: Fonts.RobotoMedium}}
        />
      </Container>
    );
  }
}
const mapDispatchToProps = (dispatch) => {
  return {
    reduxstoreUserInfo: (user) => dispatch(storeUserInfo(user)),
    reduxlogoutUser: () => dispatch(logoutUser()),

  };
};
const mapStateToProps = (state) => {
  // console.log('redux state==>',state);
  return {
    user: state.user.user,
  };
};


export default connect(mapStateToProps, mapDispatchToProps)(Signup);

const styles = {
  scrollView: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  containerBack: {
    width: wp('100%'),
    height: 300,
    top: undefined,
    tintColor: Colors.PrimaryLight,
    opacity: 0.6,
  },
  errorText: {
    fontSize: 3.2,
    color: 'red',
    marginVertical: wp(1.2),
  },
  logo: {
    height: wp('30'),
    width: wp('30'),
    resizeMode: 'contain',
    marginBottom: wp('7'),
  },
  topContainer: {
    alignItems: 'center',
    paddingTop: wp('15'),
  },
  loginText: {
    fontSize: 6.5,
    // fontWeight: 'bold',
    marginBottom: wp('5'),
    fontFamily: Fonts.RobotoMedium,
  },
  usernameInpt: {
    width: wp('80'),
    borderColor: Colors.Primary,
    paddingHorizontal: wp('4'),
    // marginBottom: wp('6'),
  },
  passwordInput: {
    width: wp('80'),
    borderColor: Colors.Primary,
    paddingHorizontal: wp('4'),
    // marginBottom: wp('6'),
  },
  eye: {
    height: wp('5.5'),
    width: wp('5.5'),
    padding: wp('2'),
  },
  forgotContainer: {alignSelf: 'flex-end', marginBottom: wp('7')},
  forgotText: {
    textDecorationLine: 'underline',
    color: '#7E7E7E',
    fontFamily: Fonts.RobotoRegular,
  },

  Loginbutton: {
    width: wp('80'),
    height: wp('15'),
    // backgroundColor: '#0089FF',
    marginBottom: wp('3.5'),
    elevation: 0,
    marginTop: wp('10'),
  },
  LoginbuttonText: {
    fontSize: 5,
    // fontFamily: Fonts.SourceSansProSemiBold,
  },
};
