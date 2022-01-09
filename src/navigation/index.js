
import React, {Component} from 'react';
import { Image,Text } from "react-native";
import {connect} from 'react-redux';
import {NavigationContainer} from '@react-navigation/native';

import { createNativeStackNavigator,
    // CardStyleInterpolators
 } from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import GetStarted from '../screens/authentication/GettingStarted';
import Login from '../screens/authentication/Login';
import Signup from '../screens/authentication/Signup';
import Walkthrough from '../screens/authentication/Walkthrough';
// import Home from '../screens/dashboard/Home';
import Inbox from '../screens/dashboard/inbox/Inbox';
// import Profile from '../screens/dashboard/profile/Profile';
import Messages from '../screens/dashboard/inbox/Messages';
import Fonts from '../themes/Fonts';
import { Colors } from '../themes/Colors';
import Profile from '../screens/dashboard/profile/Profile';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

class Navigation extends Component {
    DashboardTab = () => {
        return (
          <Tab.Navigator
            screenOptions={({route}) => ({
                headerShown: false,
                tabBarActiveTintColor: Colors.Primary,
                tabBarInactiveTintColor: '#8a8a8a',
                tabBarStyle: {
                  height: wp('15'),
                  backgroundColor:Colors.PrimaryLight
                  // borderTopWidth: 0,
                  // elevation: 0,
                },
              tabBarIcon: ({focused, color, size}) => {
                
                if (route.name == 'Inbox') {
                  return (
                    <>
                      <Image
                        source={require('../assets/icons/Inbox_tab.png')}
                        style={[styles.tabBarIcon, {tintColor: color}]}
                      />
                      <Text
                        style={{
                          color: color,
                          fontSize: wp('3'),
                          fontFamily: Fonts.RobotoBold,
                        }}>
                        Inbox
                      </Text>
                    </>
                  );
                }
                if (route.name == 'Profile') {
                  return (
                    <>
                      <Image
                        source={require('../assets/icons/profile_tab.png')}
                        style={[styles.tabBarIcon, {tintColor: color}]}
                      />
                      <Text
                        style={{
                          color: color,
                          fontSize: wp('3'),
                          fontFamily: Fonts.RobotoBold,
                        }}>
                        Profile
                      </Text>
                    </>
                  );
                }
              },
            })}
           >
            <Tab.Screen name="Inbox" options={{title: ''}} component={Inbox} />
            <Tab.Screen name="Profile" options={{title: ''}} component={Profile} />
          </Tab.Navigator>
        );
      };

    render(){
        return (
         <NavigationContainer>
        <Stack.Navigator
        //   screenOptions={{
        //     // cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        //   }}
          screenOptions={{
            headerShown: false
          }}
          headerMode={'none'}>
          {!this.props.user ? (
            <>
              <Stack.Screen name="GetStarted" component={GetStarted} />
              <Stack.Screen name="Walkthrough" component={Walkthrough} />
              <Stack.Screen name="Login" component={Login} />
              <Stack.Screen name="Signup" component={Signup} />
            </>
          ) : (
            <>
              {/* <Stack.Screen name="Profile" component={Profile} /> */}

              <Stack.Screen name="Dashboard" component={this.DashboardTab} /> 
             <Stack.Screen name="Messages" component={Messages} />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
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


export default connect(mapStateToProps,mapDispatchToProps)(Navigation);


const styles = {
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'green',
    },
    text: {
      color: 'white',
    },
    tabBarIcon: {
      height: wp('6.5'),
      width: wp('6.5'),
      resizeMode: 'contain',
      marginTop: wp('3'),
    },
  };
