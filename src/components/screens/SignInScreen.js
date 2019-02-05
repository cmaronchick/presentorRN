// AWS Amplify
import Auth from '@aws-amplify/auth'

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
  } from 'react-native'
import { Container, Item, Input, Icon } from 'native-base';
import styles from '../styles/signIn';
const logo = require('../images/logo.jpg')

  export default class SignInScreen extends React.Component {
      state = {
          username: '',
          password: '',
          fadeIn: new Animated.Value(0),
          fadeOut: new Animated.Value(0),
          isHidden: false
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

      onChangeText(key, value) {
          this.setState({[key]: value})
      }
      async signIn () {
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
            console.log('Error when signing in: ', err.message)
            Alert.alert('Error when signing in: ', err.message)
            }
        })
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