// AWS Amplify
import Auth from '@aws-amplify/auth'
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

import * as AuthSession from 'expo-auth-session';
import React from 'react'
import {
    TouchableOpacity,
    TouchableWithoutFeedback,
    StyleSheet,
    ScrollView,
    View,
    Text,
    SafeAreaView,
    StatusBar,
    KeyboardAvoidingView,
    Keyboard,
    Modal,
    FlatList,
    Animated,
  } from 'react-native'
  import {
      Container,
      Content,
      Item,
      Input,
      Icon,
      Button,
  } from 'native-base'
  import styles from '../styles/signIn'
  const logo = require('../images/logo.jpg')

  import countryCodeData from '../countryCode'
import apis from '../../apis/apis';
  // Default render of country flag
  const defaultFlag = countryCodeData.filter(
    obj => obj.name === 'United Kingdom'
  )[0].flag

  export default class SignUpScreen extends React.Component {
    state = {
        username: '',
        password: '',
        givenName: '',
        familyName: '',
        email: '',
        phoneNumber: '',
        authCode: '',
        flag: defaultFlag,
        modalVisible: false,
        fadeIn: new Animated.Value(0),  // Initial value for opacity: 0
        fadeOut: new Animated.Value(1),  // Initial value for opacity: 1
        isHidden: false,
        signUpURL: `https://presentor.auth.us-west-2.amazoncognito.com/signup?response_type=code&client_id=10eavoe3ufj2d70m5m3m2hl4pl&redirect_uri=${encodeURIComponent(AuthSession.getRedirectUrl())}&scope=aws.cognito.signin.user.admin%20email%20openid%20phone%20profile`
    }
    onChangeText(key, value) {
        this.setState({[key]: value})
    }

    // Sign up user with AWS Amplify Auth
    async signUp() {
        const { username, password, givenName, familyName, email, phoneNumber } = this.state
        // rename variable to conform with Amplify Auth field phone attribute
        const phone_number = phoneNumber
        const given_name = givenName;
        const family_name = familyName
        await Auth.signUp({
            username,
            password,
            attributes: { 
                given_name,
                family_name,
                email,
                phone_number }
            })
            .then((response) => {
            this.setState({user: response.user})
            this.props.navigation.navigate('ConfirmUser')
            })
            .catch(err => {
            if (! err.message) {
                console.log('Error when signing up: ', err)
                // Alert.alert('Error when signing up: ', err)
            } else {
                console.log('Error when signing up: ', err, '; ', err.message)
                // Alert.alert('Error when signing up: ', err.message)
            }
        })
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

        await fetch(
          'https://presentor.auth.us-west-2.amazoncognito.com/oauth2/token',
          {
            method: "POST",
            headers: {
              'Content-type': 'application/x-www-form-urlencoded;charset=UTF-8'
            },
            body: formBody
          }
        )
          .then(async (res) => {
            console.log('res: ', res)
            let tokenRequestJson = await res.json();
            console.log('tokenRequestJson: ', tokenRequestJson)
            const IdToken = new CognitoIdToken({ IdToken: tokenRequestJson.id_token });
            const AccessToken = new CognitoAccessToken({ AccessToken: tokenRequestJson.access_token });
            const RefreshToken = new CognitoRefreshToken({ RefreshToken: tokenRequestJson.refresh_token })
            try {
              let userSession = new CognitoUserSession({ IdToken, AccessToken, RefreshToken });
              console.log('userSession: ', userSession);
              const userData = {
                Username: userSession.idToken.payload.email,
                Pool: userPool
              };
              console.log('userData: ', userData);
              cognitoUser = new CognitoUser(userData);
              cognitoUser.setSignInUserSession(userSession);
              cognitoUser.getSession((err, session) => { // You must run this to verify that session (internally)
                if (session.isValid()) {
                  console.log('session is valid');
                  this.setState({user: cognitoUser})
                  // this.props.navigation.navigate('AuthLoading')
                } else {
                  console.log('session is not valid: ', session);
                }
              })
            }
            catch (FBSignInError) {
              console.log('FBSignInError: ', FBSignInError)
            }
          })
          .catch(error => {
            console.log('error: ', error);
          });
      }

    // Open URL in a browser
    openURL = async (url) => {
    let result = await AuthSession.startAsync({ authUrl: url })
    console.log('result: ', result)
    this.getTokenbyCode(result.params.code)
    };

    componentDidMount() {
        this.fadeIn();
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
    // Functions for Phone Input
    showModal() {
        this.setState({ modalVisible: true })
        console.log('Shown')
    }
    hideModal() {
        this.setState({ modalVisible: false })
        // Refocus on phone Input after modal is closed
        this.refs.FourthInput._root.focus()
        console.log('Hidden')
    }
    async getCountry(country) {
        // Get the country flag and phone code from users selection
        const countryData = await countryCodeData
        try {
        const countryCode = await countryData.filter(
            obj => obj.name === country
        )[0].dial_code
        const countryFlag = await countryData.filter(
            obj => obj.name === country
        )[0].flag
        // Set data from user choice of country
        this.setState({ phoneNumber: countryCode, flag: countryFlag })
        await this.hideModal()
        }
        catch (err) {
        console.log(err)
        }
    }
    render() {

        let { fadeOut, fadeIn, isHidden, flag } = this.state
        
      return (
        <SafeAreaView style={styles.container}>
            <StatusBar/>
            <KeyboardAvoidingView 
            style={styles.container} 
            behavior='padding' 
            enabled>
            <TouchableWithoutFeedback style={styles.container} onPress={Keyboard.dismiss}>
                <View style={styles.container}>
                {/* App Logo */}
                <View style={styles.logoContainer}>
                    {
                    isHidden ?
                    <Animated.Image 
                        source={logo} 
                        style={{ opacity: fadeIn, width: 110.46, height: 117 }}
                    />
                    :
                    <Animated.Image 
                        source={logo} 
                        style={{ opacity: fadeOut, width: 110.46, height: 117 }}
                    />
                    }
                </View>
                <Container style={styles.infoContainer}>
                    <ScrollView contentContainerStyle={styles.container}>
                    {/* username section  */}
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
                        onFocus={() => this.fadeOut()}
                        onEndEditing={() => this.fadeIn()}
                        />
                    </Item>
                    {/*  password section  */}
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
                        returnKeyType='next'
                        autoCapitalize='none'
                        autoCorrect={false}
                        secureTextEntry={true}
                        // ref={c => this.SecondInput = c}
                        ref='SecondInput'
                        onSubmitEditing={(event) => {this.refs.ThirdInput._root.focus()}}
                        onChangeText={value => this.onChangeText('password', value)}
                        onFocus={() => this.fadeOut()}
                        onEndEditing={() => this.fadeIn()}
                        />
                    </Item>
                    {/* email section */}
                    <Item rounded style={styles.itemStyle}>
                        <Icon
                        active
                        name='mail'
                        style={styles.iconStyle}
                        />
                        <Input
                        style={styles.input}
                        placeholder='Email'
                        placeholderTextColor='#adb4bc'
                        keyboardType={'email-address'}
                        returnKeyType='next'
                        autoCapitalize='none'
                        autoCorrect={false}
                        secureTextEntry={false}
                        ref='ThirdInput'
                        onSubmitEditing={(event) => {this.refs.FourthInput._root.focus()}}
                        onChangeText={value => this.onChangeText('email', value)}
                        onFocus={() => this.fadeOut()}
                        onEndEditing={() => this.fadeIn()}
                        />
                    </Item>
                    {/* name section */}
                    <Item rounded style={styles.itemStyle}>
                        <Icon
                        active
                        name='person'
                        style={styles.iconStyle}
                        />
                        <Input
                        style={styles.input}
                        placeholder='First Name'
                        placeholderTextColor='#adb4bc'
                        returnKeyType='next'
                        autoCapitalize='none'
                        autoCorrect={false}
                        secureTextEntry={false}
                        ref='FourthInput'
                        onSubmitEditing={(event) => {this.refs.FifthInput._root.focus()}}
                        onChangeText={value => this.onChangeText('givenName', value)}
                        onFocus={() => this.fadeOut()}
                        onEndEditing={() => this.fadeIn()}
                        />
                    </Item>
                    <Item rounded style={styles.itemStyle}>
                        <Icon
                        active
                        name='person'
                        style={styles.iconStyle}
                        />
                        <Input
                        style={styles.input}
                        placeholder='Last Name'
                        placeholderTextColor='#adb4bc'
                        returnKeyType='next'
                        autoCapitalize='none'
                        autoCorrect={false}
                        secureTextEntry={false}
                        ref='FifthInput'
                        onSubmitEditing={(event) => {this.refs.SixthInput._root.focus()}}
                        onChangeText={value => this.onChangeText('familyName', value)}
                        onFocus={() => this.fadeOut()}
                        onEndEditing={() => this.fadeIn()}
                        />
                    </Item>
                    {/* phone section  */}
                    <Item rounded style={styles.itemStyle}>
                        <Icon
                        active
                        name='call'
                        style={styles.iconStyle}
                        />
                        {/* country flag */}
                        <View><Text>{flag}</Text></View>
                        {/* open modal */}
                        <Icon
                            active
                            name='md-arrow-dropdown'
                            style={[styles.iconStyle, { marginLeft: 0 }]}
                            onPress={() => this.showModal()}
                        />
                        <Input
                        style={styles.input}
                        placeholder='+44766554433'
                        placeholderTextColor='#adb4bc'
                        keyboardType={'phone-pad'}
                        returnKeyType='done'
                        autoCapitalize='none'
                        autoCorrect={false}
                        secureTextEntry={false}
                        ref='SixthInput'
                        value={this.state.phoneNumber}
                        onChangeText={(val) => this.onChangeText('phoneNumber', val)}
                        onFocus={() => this.fadeOut()}
                        onEndEditing={() => this.fadeIn()}
                        />
                        <Modal
                            animationStyle="slide"
                            transparent={false}
                            visible={this.state.modalVisible}
                            onRequestClose={() => { console.log('Modal closed')}}>
                            <View style={{flex: 1}}>
                                <View style={{flex: 7, marginTop: 80 }}>
                                    <FlatList
                                        data={countryCodeData}
                                        keyExtractor={(item, index) => index.toString()}
                                        renderItem={
                                            ({item}) =>
                                                <TouchableWithoutFeedback onPress={() => this.getCountry(item.name)}>
                                                    <View style={styles.countryStyle}>
                                                        <Text style={styles.textStyle}>
                                                            {item.flag} {item.name} {item.dial_code}
                                                        </Text>
                                                    </View>
                                                </TouchableWithoutFeedback>
                                        }
                                    />
                                </View>
                                <TouchableOpacity
                                    onPress={() => this.hideModal()}
                                    style={styles.closeButtonStyle}>
                                    <Text style={styles.textStyle}>
                                        Close
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </Modal>

                    </Item>
                    {/* End of phone input */}
                    <Button
                        style={styles.buttonStyle} onPress={() => this.signUp()}  containerViewStyle={{width: '100%',marginLeft: 0}}>
                        <Text style={styles.buttonText}>
                        Sign Up
                        </Text>
                    </Button>
                    
                    <Button onPress={() => this.openURL(this.state.signUpURL)} primary style={[styles.buttonStyle, {backgroundColor: '#3b5998'}]} containerViewStyle={{width: '100%',marginLeft: 0}}>
                        <Text style={styles.buttonText}>Sign Up with Facebook</Text>
                    </Button>
                    </ScrollView>
                </Container>
                </View>
            </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </SafeAreaView>
      )
    }
  }
