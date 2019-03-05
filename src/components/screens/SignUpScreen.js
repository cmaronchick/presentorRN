// AWS Amplify
import Auth from '@aws-amplify/auth'

import Expo, { Facebook } from 'expo'
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
      Button
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
        givenName: '',
        familyName: '',
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
                Alert.alert('Error when signing up: ', err)
            } else {
                console.log('Error when signing up: ', err, '; ', err.message)
                Alert.alert('Error when signing up: ', err.message)
            }
        })
    }
    
    async signUpwithFacebook() {
        try {
            const { type, token, expires } = await Facebook.logInWithReadPermissionsAsync('405055010060445', {
                permissions: ['public_profile','email','user_friends'],
                behavior: 'web'
            });
            console.log('type: ', type)
            if (type === 'success') {
            // sign in with federated identity
            Auth.federatedSignIn('facebook', { token, expires_at: expires}, { name: 'USER_NAME' })
                .then(credentials => {
                console.log('get aws credentials', credentials);
                }).catch(e => {
                console.log(e);
                });
            }
        }
        catch (FBError) {
            console.log('FBError: ', FBError)
        }
    }

    // ...
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
                    <Button onPress={() => this.signUpwithFacebook()} primary>
                        <Text>Sign Up with Facebook</Text>
                    </Button>
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
                    <TouchableOpacity
                        style={styles.buttonStyle} onPress={() => this.signUp()}>
                        <Text style={styles.buttonText}>
                        Sign Up
                        </Text>
                    </TouchableOpacity>
                    </ScrollView>
                </Container>
                </View>
            </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </SafeAreaView>
      )
    }
  }
