import React, {Component} from 'react';
import {View, Text, Image} from 'react-native';
import {connect} from 'react-redux';
import AppHeader from '../../../components/AppHeader';
import Container from '../../../components/Container';
import ResponsiveText from '../../../components/ResponsiveText';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen/index';
import Fonts from '../../../themes/Fonts';
import {Colors} from '../../../themes/Colors';
import Button from '../../../components/Button';
import { logoutUser } from '../../../redux/user/actions';
import { clearAllData } from '../../../redux/groups/actions';

class Profile extends Component {
  render() {
    return (
      <Container barStyle={'dark-content'}  statusBarColor={Colors.PrimaryLight}  lottie >
        <AppHeader
          containerStyle={styles.header}
          body={
            <ResponsiveText style={styles.headertitle}>Profile</ResponsiveText>
          }
        />
        <View style={styles.clearFix} />
        <View style={styles.content}>
          <ResponsiveText style={styles.welcome}>
            Welcome{' '}
            <ResponsiveText style={styles.name}>
              {this.props.user && this.props.user.full_name}
            </ResponsiveText>
          </ResponsiveText>
          <Image
            source={require('../../../assets/images/full_Logo.png')}
            style={styles.logo}
          />

          <Button
            text={'Logout'}
            containerStyle={styles.logoutButton}
            // disabled={true}
            leftIcon={
              <Image
                source={require('../../../assets/icons/logout.png')}
                style={styles.logoutIcon}
              />
            }
            onPress={()=>{
              this.props.reduxlogoutUser()
              this.props.reduxClearAllData()
            }}
          />
        </View>
      </Container>
    );
  }
}
const mapDispatchToProps = (dispatch) => {
  return {
    reduxlogoutUser: () => dispatch(logoutUser()),
    reduxClearAllData: () => dispatch(clearAllData()),


    
  };
};
const mapStateToProps = (state) => {
  // console.log("redux state==>", state);
  return {
    user: state.user.user,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Profile);



const styles = {
  logoutIcon: {
    height: wp(6),
    width: wp(6),
    resizeMode: 'contain',
    marginRight: 5,
    tintColor: 'white',
  },
  logoutButton: {opacity:0.9},
  logo: {
    height: wp(50),
    width: wp(50),
    resizeMode: 'contain',
  },
  name: {
    color: Colors.Primary,
    fontSize: 5.5,
    fontFamily: Fonts.RobotoBold,
  },
  welcome: {
    fontSize: 5,
    textAlign: 'center',
  },
  content: {
    flexGrow: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: wp(7),
    paddingVertical:wp(15)
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'green',
  },
  text: {
    color: 'white',
  },
  header: {
    backgroundColor:Colors.PrimaryLight

  },
  headertitle: {
    fontFamily: Fonts.OpenSansRegular,
    fontSize: 5.3,
    color:Colors.Primary
  },
  clearFix: {
    height: wp('0.4'),
    backgroundColor: '#E1E1E1',
    // marginBottom:wp('4')
  },
};
