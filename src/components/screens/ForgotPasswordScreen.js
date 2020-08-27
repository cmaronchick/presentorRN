// AWS Amplify
import Auth from '@aws-amplify/auth'

import React from 'react'
import {
    TouchableOpacity,
    TouchableWithoutFeedback,
    StyleSheet,
    Text,
    SafeAreaView,
    StatusBar,
    KeyboardAvoidingView,
    Keyboard,
    View,
    Animated
  } from 'react-native'
  import {
      Container,
      Item,
      Input,
      Icon
  } from 'native-base'
  import styles from '../styles/signIn'
  const logo = require('../images/logo.jpg')

  export default class ForgotPasswordScreen extends React.Component {
    state = {
        username: '',
        authCode: '',
        newPassword: '',
        fadeIn: new Animated.Value(0),  // Initial value for opacity: 0
        fadeOut: new Animated.Value(1),  // Initial value for opacity: 1
        isHidden: false
    }
    onChangeText(key, value) {
        this.setState({[key]: value})
    }

    // Request a new password
    async forgotPassword() {
        const { username } = this.state
        await Auth.forgotPassword(username)
        .then(data => console.log('New code sent', data))
        .catch(err => {
        if (! err.message) {
            console.log('Error while setting up the new password: ', err)
            // Alert.alert('Error while setting up the new password: ', err)
        } else {
            console.log('Error while setting up the new password: ', err.message)
            // Alert.alert('Error while setting up the new password: ', err.message)
        }
        })
    }
    
    // Upon confirmation redirect the user to the Sign In page
    async forgotPasswordSubmit() {
        const { username, authCode, newPassword } = this.state
        await Auth.forgotPasswordSubmit(username, authCode, newPassword)
        .then(() => {
        this.props.navigation.navigate('SignIn')
        console.log('the New password submitted successfully')
        })
        .catch(err => {
        if (! err.message) {
            console.log('Error while confirming the new password: ', err)
            // Alert.alert('Error while confirming the new password: ', err)
        } else {
            console.log('Error while confirming the new password: ', err.message)
            // Alert.alert('Error while confirming the new password: ', err.message)
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
            enabled 
            keyboardVerticalOffset={23}>
            <TouchableWithoutFeedback style={styles.container} onPress={Keyboard.dismiss}>
                <View style={styles.container}>
                {/* App Logo */}
                <View style={styles.logoContainer}>
                    {
                    isHidden ?
                    <Animated.Image source={logo} style={{ opacity: fadeIn }}/>
                    :
                    <Animated.Image source={logo} style={{ opacity: fadeOut }}/>
                    }
                </View>
                {/* Infos */}
                <Container style={styles.infoContainer}>
                    <View style={styles.container}>
                    {/* Username */}
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
                        returnKeyType='go'
                        autoCapitalize='none'
                        autoCorrect={false}
                        onChangeText={value => this.onChangeText('username', value)}
                        onFocus={() => this.fadeOut()}
                        onEndEditing={() => this.fadeIn()}
                        />
                    </Item>
                    <TouchableOpacity
                        style={styles.buttonStyle} onPress={() => this.forgotPassword()}>
                        <Text style={styles.buttonText}>
                        Send Code
                        </Text>
                    </TouchableOpacity>
                    {/* the New password section  */}
                    <Item rounded style={styles.itemStyle}>
                        <Icon
                        active
                        name='lock'
                        style={styles.iconStyle}
                        />
                        <Input
                        style={styles.input}
                        placeholder='New password'
                        placeholderTextColor='#adb4bc'
                        returnKeyType='next'
                        autoCapitalize='none'
                        autoCorrect={false}
                        secureTextEntry={true}
                        onSubmitEditing={(event) => { this.refs.SecondInput._root.focus()}}
                        onChangeText={value => this.onChangeText('newPassword', value)}
                        onFocus={() => this.fadeOut()}
                        onEndEditing={() => this.fadeIn()}
                        />
                    </Item>
                    {/* Code confirmation section  */}
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
                        ref='SecondInput'
                        onChangeText={value => this.onChangeText('authCode', value)}
                        onFocus={() => this.fadeOut()}
                        onEndEditing={() => this.fadeIn()}
                        />
                    </Item>
                    <TouchableOpacity
                        style={styles.buttonStyle} onPress={() => this.forgotPasswordSubmit()}>
                        <Text style={styles.buttonText}>
                        Confirm the new password
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
  