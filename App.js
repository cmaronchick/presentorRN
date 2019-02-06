// Amplify imports and config
import Amplify from '@aws-amplify/core'
import Auth from  '@aws-amplify/auth'
import config from './src/aws-exports'
Amplify.configure(config)

import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Icon } from 'native-base';

import { 
  createSwitchNavigator, 
  createStackNavigator,
  createBottomTabNavigator,
  createDrawerNavigator,
  createMaterialTopTabNavigator } from 'react-navigation'
import AuthLoadingScreen from './src/components/screens/AuthLoadingScreen'
import WelcomeScreen from './src/components/screens/WelcomeScreen'

// Auth Stack Screen Imports
import SignInScreen from './src/components/screens/SignInScreen'
import SignUpScreen from './src/components/screens/SignUpScreen'
import ForgotPasswordScreen from './src/components/screens/ForgotPasswordScreen'
import ConfirmUserScreen from './src/components/screens/ConfirmUserScreen'

//App Stack Screen Imports
import HomeScreen from './src/components/screens/HomeScreen';
import ProfileScreen from './src/components/screens/ProfileScreen';
import SettingsScreen from './src/components/screens/SettingsScreen';

// Auth Stack
const AuthStackNavigator = createStackNavigator({
  Welcome: {
    screen: WelcomeScreen,
    navigationOptions: () => ({
      title: `Welcome to this App`,  // for the header screen
      headerBackTitle: 'Back'
    }),
  },
  SignUp: {
    screen: SignUpScreen,
    navigationOptions: () => ({
      title: 'Create New Account',
    }),
  },
  ConfirmUser: {
    screen: ConfirmUserScreen,
    navigationOptions: () => ({
      title: 'Enter Confirmation Code',
    }),
  },
  SignIn: {
    screen: SignInScreen,
    navigationOptions: () => ({
      title: `Log in to your account`,
    }),
  },
  ForgotPassword: {
    screen: ForgotPasswordScreen,
    navigationOptions: () => ({
      title: `Create a new password`,
    }),
  },

});

// Bottom Tabs
const configuration = {
  Home: {
    screen: HomeScreen,
    navigationOptions: {
      tabBarLabel: 'Home',
      tabBarIcon: ({ tintColor }) => (
        <Icon name="ios-home" style={{fontSize: 26, color: tintColor}} />
      )
    }
  },
  Profile: {
    screen: ProfileScreen,
    navigationOptions: {
      tabBarLabel: 'Profile',
      tabBarIcon: ({tintColor}) => (
        <Icon name="ios-person" style={{fontSize: 26, color: tintColor}} />
      )
    }
  },
  Settings: {
    screen: SettingsScreen,
    navigationOptions: {
      tabBarLabel: 'Settings',
      tabBarIcon: ({ tintColor }) => (
        <Icon name="ios-settings" style={{fontSize: 26, color: tintColor}} />
      )
    }
  },
}

const options = {
  tabBarPosition: 'bottom',
  swipeEnabled: true,
  animationEnabled: true,
  navigationOptions: {
    tabBarVisible: true
  },
  tabBarOptions: {
    showLabel: true,
    activeTintColor: '#fff',
    inactiveTintColor: '#a8abaf',
    style: {
      backgroundColor: '#667292',
      borderTopWidth: 1,
      borderTopColor: '#ff99',//'#667292',
      paddingBottom: 0
    },
    labelStyle: {
      fontSize: 12,
      fontWeight: 'bold',
      marginBottom: 12,
      marginTop:12,
    },
    indicatorStyle: {
      height: 0,
    },
    showIcon: true,
  }
}

const AppTabNavigator = createMaterialTopTabNavigator(configuration, options)

// Making the common header title dynamic in AppTabNavigator
AppTabNavigator.navigationOptions = ({ navigation }) => {
  let { routeName } =   navigation.state.routes[navigation.state.index]
  let headerTitle = routeName
  return {
    headerTitle,
  }
}

const AppStackNavigator = createStackNavigator({
  AppStackNavigator: {
    screen: AppTabNavigator,
    navigationOptions: ({navigation}) => ({
      headerLeft: (
        <TouchableOpacity onPress={() => navigation.toggleDrawer()}>
          <View style={{paddingHorizontal: 10}}>
            <Icon name='md-menu' size={24} />
          </View>
        </TouchableOpacity>
      )
    })
  }
})

// App Stack for the Drawer
const AppDrawerNavigator = createDrawerNavigator({
  Tabs: AppStackNavigator,
  Home: HomeScreen,
  Profile: ProfileScreen,
  Settings: SettingsScreen
})

export default createSwitchNavigator({
  // screen: name
  AuthLoading: AuthLoadingScreen,
  Auth: AuthStackNavigator,
  App: AppDrawerNavigator
})

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
