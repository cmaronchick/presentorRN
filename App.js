// Amplify imports and config
import Amplify from '@aws-amplify/core'
import Auth from  '@aws-amplify/auth'
import config from './src/aws-exports'
Amplify.configure(config)

import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Icon } from 'native-base';
import { NavigationContainer } from '@react-navigation/native'

import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
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
import PresenteeScreen from './src/components/screens/PresenteeScreen';

// Auth Stack
const AuthStack = createStackNavigator()
const AuthStackNavigator = (props) => {
  return (
    <AuthStack.Navigator>
      <AuthStack.Screen name="Welcome" component={WelcomeScreen}
        options={() => ({
          title: `Welcome to this App`,  // for the header screen
          headerBackTitle: 'Back'
        })} />
      <AuthStack.Screen handleUserSignUp={props.handleUserLogin} name="SignUp" component={SignUpScreen} options={() => ({
          title: 'Create New Account',
        })} />
      <AuthStack.Screen name="ConfirmUser" component={ConfirmUserScreen} options={() => ({
          title: 'Enter Confirmation Code',
        }) } />
      <AuthStack.Screen name="SignIn" options={() => ({
          title: `Log in to your account`,
        })}>
          {signinprops => <SignInScreen handleUserSignIn={props.handleUserLogin} /> }
      </AuthStack.Screen>
      <AuthStack.Screen name="ForgotPassword" component={ForgotPasswordScreen}
        options={() => ({
          title: `Create a new password`,
        })} />
  </AuthStack.Navigator>
  )
};

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
const AppTab = createBottomTabNavigator();
const AppTabNavigator = (props) => {
  //(configuration, options)
  return (
    <AppTab.Navigator>
      <AppTab.Screen name="Home" component={HomeScreen} options={() => ({
          tabBarLabel: 'Home',
          tabBarIcon: ({ tintColor }) => (
            <Icon name="ios-home" style={{fontSize: 26, color: tintColor}} />
          )
          })
      } />
      <AppTab.Screen name="Profile" component={ProfileScreen} options={() => ({
          tabBarLabel: 'Profile',
          tabBarIcon: ({tintColor}) => (
            <Icon name="ios-person" style={{fontSize: 26, color: tintColor}} />
          )
          })
      } />
      <AppTab.Screen name="Settings" options={() => ({
          tabBarLabel: 'Settings',
          tabBarIcon: ({ tintColor }) => (
            <Icon name="ios-settings" style={{fontSize: 26, color: tintColor}} />
          )
          })
        }>
          {settingsProps => <SettingsScreen handleSignOut={props.handleSignOut} />}
      </AppTab.Screen>

      
    </AppTab.Navigator>

  )
}

// Making the common header title dynamic in AppTabNavigator
AppTabNavigator.navigationOptions = ({ navigation }) => {
  let { routeName } =   navigation.state.routes[navigation.state.index]
  let headerTitle = routeName
  return {
    headerTitle,
  }
}
// options={({navigation}) => ({
//   headerLeft: (
//     <TouchableOpacity onPress={() => navigation.toggleDrawer()}>
//       <View style={{paddingHorizontal: 10}}>
//         <Icon name='md-menu' size={24} />
//       </View>
//     </TouchableOpacity>
//   )
// })
// }
const AppStack = createStackNavigator()
const AppStackNavigator = (props) => {
  return (
    <AppStack.Navigator>
      <AppStack.Screen name="Tabs" options={{
        
      }}>
        {apptabprops=> <AppTabNavigator handleSignOut={props.handleSignOut} />}
      </AppStack.Screen>
      <AppStack.Screen name="Presentee" component={PresenteeScreen} />
    </AppStack.Navigator>
  )
}

// App Stack for the Drawer
const AppDrawer = createDrawerNavigator()
const AppDrawerNavigator = (props) => {
  return (
    <AppDrawer.Navigator>
      <AppDrawer.Screen name="App">
        {appstackprops => <AppStackNavigator handleSignOut={props.handleSignOut} />}
      </AppDrawer.Screen>
      <AppDrawer.Screen name="Home" component={HomeScreen} />
      <AppDrawer.Screen name="Profile" component={ProfileScreen} />
      <AppDrawer.Screen name="Settings">
       {
        settingsProps => {
          console.log('settings props in nav:', props, settingsProps)
          return (<SettingsScreen handleSignOut={props.handleSignOut} />)
        }
      }
      </AppDrawer.Screen>
    </AppDrawer.Navigator>
  )
}

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      user: null
    }
  }
  setUser = (user) => {
    console.log('user:', user)
    this.setState({
      user
    })
  }
  unsetUser = () => {
    this.setState({
      user: null
    })
  }
  async componentDidMount() {
      try {
          let user = await Auth.currentAuthenticatedUser()
          this.setUser(user)
      } catch(err) {
          console.log(err)
      }
      // this.props.navigation.navigate(this.state.userToken ? 'App' : 'Auth')
  }
  render() {
    return (
      <NavigationContainer>
        {/* <AuthLoadingScreen /> */}
        {this.state.user === null ? (
          <AuthStackNavigator handleUserLogin={this.setUser} />
        ) : (
          <AppDrawerNavigator handleSignOut={this.unsetUser} />
        )}
      </NavigationContainer>
    )
  }
}
export default App

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
