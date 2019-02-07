// AWS Amplify
import Auth from '@aws-amplify/auth'

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
    Alert,
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
  } from 'native-base'
  import styles from '../styles/signIn'
  const logo = require('../images/logo.jpg')

  import countryCodeData from '../countryCode'
  // Default render of country flag
  const defaultFlag = countryCodeData.filter(
    obj => obj.name === 'United Kingdom'
  )[0].flag

  export default class SignUpScreen extends React.Component {
    state = {
        username: '',
        password: '',
        firstname: '',
        lastname: '',
        email: '',
        phoneNumber: '',
        authCode: '',
        flag: defaultFlag,
        modalVisible: false,
        fadeIn: new Animated.Value(0),  // Initial value for opacity: 0
        fadeOut: new Animated.Value(1),  // Initial value for opacity: 1
        isHidden: false
    }
    onChangeText(key, value) {
        this.setState({[key]: value})
    }

    
    // Confirm users and redirect them to the SignIn page
    async confirmSignUp() {
        const { username, authCode } = this.state
        await Auth.confirmSignUp(username, authCode)
        .then(() => {
            this.props.navigation.navigate('SignIn')
            console.log('Confirm sign up successful')
            })
            .catch(err => {
            if (! err.message) {
                console.log('Error when entering confirmation code: ', err)
                Alert.alert('Error when entering confirmation code: ', err)
            } else {
                console.log('Error when entering confirmation code: ', err.message)
                Alert.alert('Error when entering confirmation code: ', err.message)
            }
        })
    }
    
    // Resend code if not received already
    async resendSignUp() {
        const { username } = this.state
        await Auth.resendSignUp(username)
        .then(() => console.log('Confirmation code resent successfully'))
        .catch(err => {
        if (! err.message) {
            console.log('Error requesting new confirmation code: ', err)
            Alert.alert('Error requesting new confirmation code: ', err)
        } else {
            console.log('Error requesting new confirmation code: ', err.message)
            Alert.alert('Error requesting new confirmation code: ', err.message)
        }
        })
    }
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
    render() {

        let { fadeOut, fadeIn, isHidden } = this.state
        
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
                    {/* code confirmation section  */}
                    <Item rounded style={styles.itemStyle}>
                        <Icon
                        active
                        name='md-apps'
                        style={styles.iconStyle}
                        />
                        <Input
                        style={styles.input}
                        placeholder='Confirmation code'
                        placeholderTextColor='#adb4bc'
                        keyboardType={'numeric'}
                        returnKeyType='done'
                        autoCapitalize='none'
                        autoCorrect={false}
                        secureTextEntry={false}
                        onChangeText={value => this.onChangeText('authCode', value)}
                        onFocus={() => this.fadeOut()}
                        onEndEditing={() => this.fadeIn()}
                        />
                    </Item>
                    <TouchableOpacity
                        style={styles.buttonStyle} onPress={() => this.confirmSignUp()}>
                        <Text style={styles.buttonText}>
                        Confirm Sign Up
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.buttonStyle} onPress={() => this.resendSignUp()}>
                        <Text style={styles.buttonText}>
                        Resend code
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
