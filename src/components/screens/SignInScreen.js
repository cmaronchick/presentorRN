// AWS Amplify
import Auth from '@aws-amplify/auth'

import Expo, { Facebook, AuthSession, WebBrowser } from 'expo'
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
    Alert,
    Animated,
    Linking,
    Platform,
    
    } from 'react-native'
//import SafariView from 'react-native-safari-view'
import { Container, Item, Input, Icon, Button } from 'native-base';
import styles from '../styles/signIn';
const logo = require('../images/logo.jpg')

  export default class SignInScreen extends React.Component {
      state = {
          username: '',
          password: '',
          fadeIn: new Animated.Value(0),
          fadeOut: new Animated.Value(0),
          isHidden: false,
          loginURL: `https://presentor.auth.us-west-2.amazoncognito.com/login?response_type=code&client_id=10eavoe3ufj2d70m5m3m2hl4pl&redirect_uri=${encodeURIComponent(AuthSession.getRedirectUrl())}&scope=aws.cognito.signin.user.admin%20email%20openid%20phone%20profile`
      }

      handleOpenURL = async ({ url }) => {
        console.log('url: ', url)
        // Extract stringified user string out of the URL
        const [, code] = url.match(/code=([^#]+)/);
        if (code.indexOf("#") > -1) {
          const code1 = code.split('#');
          this.getTokenbyCode(code1);
        } else {
          console.log('code: ', code);
          this.getTokenbyCode(code);
        }
      }

      getTokenbyCode = code => {
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

        fetch(
          'https://presentor.auth.us-west-2.amazoncognito.com/oauth2/token',
          {
            method: "POST",
            headers: {
              'Content-type': 'application/x-www-form-urlencoded;charset=UTF-8'
            },
            body: formBody
          }
        )
          .then(res => {
            console.log('res: ', res);
          })
          .catch(error => {
            console.log('error: ', error);
          });
      }

      // Open URL in a browser
      openURL = async (url) => {
        // let redirectURL = AuthSession.getRedirectUrl()
        // url += `${url}${encodeURIComponent(redirectURL)}`
        console.log('url :', url);
        // Use SafariView on iOS
        // if (Platform.OS === 'ios') {
        //   SafariViewManager.show({
        //     url: url,
        //     fromBottom: true,
        //   });
        // }
        // // Or Linking.openURL on Android
        // else {
        //   Linking.openURL(url)
        // }
        let result = await WebBrowser.openBrowserAsync(url)
      };
      componentDidMount() {
        this.fadeIn()
        WebBrowser.addEventListener('url', this.handleOpenURL)
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
        await Auth.signIn(username, password)
        .then(user => {
            console.log('user: ', user)
            this.setState({ user })
            this.props.navigation.navigate('AuthLoading')
        })
        .catch(err => {
            if (! err.message) {
            console.log('Error when signing in: ', err)
            Alert.alert('Error when signing in: ', err)
            } else {
                if (err.code === "UserNotConfirmedException") {
                    this.props.navigation.navigate('ConfirmUser');
                }
            console.log('Error when signing in: ', err, '; ', err.message)
            Alert.alert('Error when signing in: ', err.message)
            }
        })
      }

      
      async signInwithFacebook() {
        try {
          const { type, token, expires, user } = await Facebook.logInWithReadPermissionsAsync('405055010060445', {
            permissions: ['public_profile']
          })
          console.log('type: ', type)
          if (type === 'success') {
            // sign in with federated identity
            Auth.federatedSignIn('facebook', { token, expires_at: expires}, user)
              .then(credentials => {
                console.log('get aws credentials', credentials);
                return Auth.currentAuthenticatedUser()
              })
              .then(user => console.log('user :', user))
              .catch(async (e) => {
                console.log('e: ', e);
              });
          }
        }
        catch (FBError) {
          console.log('FBError: ', FBError)
        }
      }

    render() {
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
                        <TouchableOpacity
                            onPress={() => this.signIn()}
                            style={styles.buttonStyle}>
                            <Text style={styles.buttonText}>
                            Sign In
                            </Text>
                        </TouchableOpacity>
                        </View>
                    </Container>
                    </View>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </SafeAreaView>
      )
    }
  }