// AWS Amplify
import Auth from '@aws-amplify/auth'
import Amplify, { Hub } from '@aws-amplify/core'
import config from '../../aws-exports'
import { 
  CognitoUser, 
  CognitoIdToken, 
  CognitoAccessToken, 
  CognitoRefreshToken, 
  CognitoUserSession, 
  CognitoUserPool } from 'amazon-cognito-identity-js';
const userPool = new CognitoUserPool({
  UserPoolId: config.aws_user_pools_id,
  ClientId: config.aws_user_pools_web_client_id
});

// your Cognito Hosted UI configuration
const oauth = {
  domain: 'presentor.auth.us-west-2.amazoncognito.com',
  scope: ['phone', 'email', 'profile', 'openid', 'aws.cognito.signin.user.admin'],
  redirectSignIn: `${encodeURIComponent(AuthSession.getRedirectUrl())}`,
  redirectSignOut: `${encodeURIComponent(AuthSession.getRedirectUrl())}`,
  responseType: 'code' // or token
};

import * as AuthSession from 'expo-auth-session';
import React from 'react'
import {
    StyleSheet,
    View,
    Text,
    AsyncStorage,
    TouchableOpacity,
    TouchableWithoutFeedback,
    SafeAreaView,
    StatusBar,
    KeyboardAvoidingView,
    Keyboard,
    Animated,
    Linking,
    Platform,
    
    } from 'react-native'
//import SafariView from 'react-native-safari-view'
import { 
  Container,
  Item,
  Input,
  Icon,
  Button } from 'native-base';
import styles from '../styles/signIn';

const logo = require('../images/logo.jpg')


  export default class SignInScreen extends React.Component {
    constructor(props) {
      super(props)
      this.state = {
        username: '',
        password: '',
        fadeIn: new Animated.Value(0),
        fadeOut: new Animated.Value(0),
        isHidden: false,
        signInURL: `https://presentor.auth.us-west-2.amazoncognito.com/authorize?response_type=code&client_id=10eavoe3ufj2d70m5m3m2hl4pl&redirect_uri=${encodeURIComponent(AuthSession.getRedirectUrl())}&scope=aws.cognito.signin.user.admin%20email%20openid%20phone%20profile`
      }
    }

      getTokenbyCode = async (code) => {
        const details = {
          grant_type: 'authorization_code',
          code,
          client_id: '10eavoe3ufj2d70m5m3m2hl4pl',
          redirect_uri: AuthSession.getRedirectUrl()
        }
        const formBody = Object.keys(details)
          .map(
            key => `${encodeURIComponent(key)}=${encodeURIComponent(details[key])}`
          )
          .join("&");
        try {
         let res = await fetch(
            'https://presentor.auth.us-west-2.amazoncognito.com/oauth2/token',
            {
              method: "POST",
              headers: {
                'Content-type': 'application/x-www-form-urlencoded;charset=UTF-8'
              },
              body: formBody
            }
          )
            let tokenRequestJson = await res.json();
            const IdToken = new CognitoIdToken({ IdToken: tokenRequestJson.id_token });
            const AccessToken = new CognitoAccessToken({ AccessToken: tokenRequestJson.access_token });
            const RefreshToken = new CognitoRefreshToken({ RefreshToken: tokenRequestJson.refresh_token })
            let userSession = new CognitoUserSession({ IdToken, AccessToken, RefreshToken });
            console.log('userSession: ', userSession);
            const userData = {
              Username: userSession.idToken.payload['cognito:username'],
              Pool: userPool
            };
            console.log('userData: ', userData);
            const cognitoUser = new CognitoUser(userData);
            cognitoUser.setSignInUserSession(userSession);
            const authUser = Auth.createCognitoUser(cognitoUser.getUsername())
            authUser.setSignInUserSession(userSession)
            this.props.handleUserSignIn(authUser)
            
          } catch(error) {
            console.log('error: ', error);
          }
      }

      // Open URL in a browser
      openURL = async (url) => {
        let result = await AuthSession.startAsync({ authUrl: url })
        this.getTokenbyCode(result.params.code)
      };
      componentDidMount() {
        this.fadeIn()
      }
      fadeIn() {
        Animated.timing(
        this.state.fadeIn,
        {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true
        }
        ).start()
        this.setState({isHidden: true})
      }

      fadeOut() {
        Animated.timing(
        this.state.fadeOut,
        {
          toValue: 0, // 1 in the SignInScreen component
          duration: 700,
          useNativeDriver: true
        }
        ).start()
        this.setState({isHidden: false})
      }

      onChangeText(key, value) {
          this.setState({[key]: value})
      }
      async signIn () {
        console.log('sign in started')
        const { username, password } = this.state
        try {
        let user = await Auth.signIn(username, password)
            // console.log('user: ', user)
          this.setState({ user })
            // this.props.navigation.navigate('AuthLoading')
        } catch(err) {
            if (! err.message) {
            console.log('Error when signing in: ', err)
            // Alert.alert('Error when signing in: ', err)
            } else {
                if (err.code === "UserNotConfirmedException") {
                    this.props.navigation.navigate('ConfirmUser');
                }
            console.log('Error when signing in: ', err, '; ', err.message)
            // Alert.alert('Error when signing in: ', err.message)
            }
        }
      }

    render() {
      console.log('sign in props: ', this.props)
        let { fadeOut, fadeIn, isHidden } = this.state
      return (
        <SafeAreaView style={styles.container} >
            <StatusBar/>
            <KeyboardAvoidingView style={styles.container} behavior='padding' enabled>
                <TouchableWithoutFeedback style={styles.container} onPress={Keyboard.dismiss}>
                    <View style={styles.container}>
                    {/* App Logo */}
                    <View style={styles.logoContainer}>
                    {
                        isHidden ?
                        <Animated.Image source={logo} style={{opacity: fadeIn}} />
                        :
                        <Animated.Image
                            source={logo}
                            style={{ opacity: fadeOut, width: 113.46, height: 117 }} />
                    }
                    </View>
                    <Container style={styles.infoContainer}>
                        <View style={styles.container}>
                          <Button primary onPress={() => this.openURL(this.state.loginURL)}
                            style={styles.buttonStyle}>
                            <Text style={styles.buttonText}>Sign In with Facebook</Text>
                          </Button>
                        </View>
                        <View style={styles.container}>
                        <Item rounded style={styles.itemStyle}>
                            <Icon
                            active
                            name='person'
                            style={styles.iconStyle}
                            />
                            <Input
                            style={styles.input}
                            placeholder='Username'
                            placeholderTextColor='#adb4bc'
                            keyboardType={'email-address'}
                            returnKeyType='next'
                            autoCapitalize='none'
                            autoCorrect={false}
                            onSubmitEditing={(event) => {this.refs.SecondInput._root.focus()}}
                            onChangeText={value => this.onChangeText('username', value)}
                            />
                        </Item>
                        <Item rounded style={styles.itemStyle}>
                            <Icon
                            active
                            name='lock'
                            style={styles.iconStyle}
                            />
                            <Input
                            style={styles.input}
                            placeholder='Password'
                            placeholderTextColor='#adb4bc'
                            returnKeyType='go'
                            autoCapitalize='none'
                            autoCorrect={false}
                            secureTextEntry={true}
                            ref='SecondInput'
                            onChangeText={value => this.onChangeText('password', value)}
                            />
                        </Item>
                        <Button
                            onPress={() => this.signIn()}
                            style={styles.buttonStyle}>
                            <Text style={styles.buttonText}>
                            Sign In
                            </Text>
                        </Button>
                        
                        <Button onPress={() => this.openURL(this.state.signInURL)} primary style={[styles.buttonStyle, {backgroundColor: '#3b5998'}]} containerViewStyle={{width: '100%',marginLeft: 0}}>
                            <Text style={styles.buttonText}>Sign In with Facebook</Text>
                        </Button>
                        </View>
                    </Container>
                    </View>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </SafeAreaView>
      )
    }
  }