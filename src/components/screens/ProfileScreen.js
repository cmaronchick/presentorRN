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
  Icon,
  Input,
  Item,
} from 'native-base'
import Auth from '@aws-amplify/auth'
import CognitoUser from 'amazon-cognito-identity-js'
import styles from '../styles/signIn'

import countryCodeData from '../countryCode'
// Default render of country flag
const defaultFlag = countryCodeData.filter(
  obj => obj.name === 'United Kingdom'
)[0].flag

export default class ProfileScreen extends React.Component {
  state = {
    user: null,
    username: '',
    password: '', 
    givenName: '',
    familyName: '',
    email: '',
    phoneNumber: '',
    updatingProfile: false,
    flag: defaultFlag,
    modalVisible: false,
    fadeIn: new Animated.Value(0),  // Initial value for opacity: 0
    fadeOut: new Animated.Value(1),  // Initial value for opacity: 1
    isHidden: false
  }
  onChangeText(key, value) {
      this.setState({[key]: value})
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
    getCurrentUser = async () => {
        await Auth.currentAuthenticatedUser()
        .then((user) => {
            console.log('user :', user);
            this.setState({user, username: user.username, givenName: user.attributes.given_name, familyName: user.attributes.family_name, phoneNumber: user.attributes.phone_number, email: user.attributes.email})
            //console.log('this.state:', this.state)
        })
    }
    componentDidMount = async () => {
        await this.getCurrentUser()
    }

    updateUserProfile = async () => {
        this.setState({updatingProfile: !this.state.updatingProfile});
        const { username, password, givenName, familyName, email, phoneNumber } = this.state
        const given_name = givenName
        const family_name = familyName
        const phone_number = phoneNumber
        await Auth.currentAuthenticatedUser()
        .then(async (user) => {
            await Auth.updateUserAttributes(user, { email, given_name, family_name, phone_number })
            .then(async (updateResult) => {
                console.log('updateResult :', updateResult);
                this.setState({updatingProfile: !this.state.updatingProfile});
                await Auth.currentUserInfo()
                .then(user => this.setState({user}))
                .catch(error => console.log('error :', error))
            })
            .catch(authError => console.log('authError :', authError))
        })
        .catch(updateError => console.log('updateError ', updateError));
    }

  render() {
    let { fadeOut, fadeIn, isHidden, flag, user, phoneNumber, givenName, familyName, email } = this.state
    const phone_number = phoneNumber
        const given_name = givenName;
        const family_name = familyName
    return (
      <SafeAreaView style={styles.container}>
            <StatusBar/>
            <KeyboardAvoidingView 
            style={styles.container} 
            behavior='padding' 
            enabled>
            <TouchableWithoutFeedback style={styles.container} onPress={Keyboard.dismiss}>
                <View style={styles.container}>
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
                        value={user ? user.username : ''}
                        disabled={true}
                        placeholderTextColor='#adb4bc'
                        keyboardType={'email-address'}
                        returnKeyType='next'
                        autoCapitalize='none'
                        autoCorrect={false}
                        onChangeText={value => this.onChangeText('username', value)}
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
                        value={email ? email : user ? user.attributes.email : ''}
                        placeholderTextColor='#adb4bc'
                        keyboardType={'email-address'}
                        returnKeyType='next'
                        autoCapitalize='none'
                        autoCorrect={false}
                        secureTextEntry={false}
                        ref='ThirdInput'
                        onChangeText={value => this.onChangeText('email', value)}
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
                        value={givenName ? givenName : user ? user.attributes.given_name : ''}
                        placeholderTextColor='#adb4bc'
                        returnKeyType='next'
                        autoCapitalize='none'
                        autoCorrect={false}
                        secureTextEntry={false}
                        ref='FourthInput'
                        onChangeText={value => this.onChangeText('givenName', value)}
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
                        value={familyName ? familyName : user ? user.attributes.family_name : ''}
                        placeholderTextColor='#adb4bc'
                        returnKeyType='next'
                        autoCapitalize='none'
                        autoCorrect={false}
                        secureTextEntry={false}
                        ref='FifthInput'
                        onChangeText={value => this.onChangeText('familyName', value)}
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
                        value={phoneNumber ? phoneNumber : user ? user.attributes.phone_number : ''}
                        placeholderTextColor='#adb4bc'
                        keyboardType={'phone-pad'}
                        returnKeyType='done'
                        autoCapitalize='none'
                        autoCorrect={false}
                        secureTextEntry={false}
                        ref='SixthInput'
                        value={this.state.phoneNumber}
                        onChangeText={(val) => this.onChangeText('phoneNumber', val)}
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
                        style={styles.buttonStyle} onPress={() => this.updateUserProfile()} disabled={this.state.updatingProfile}>
                        <Text style={styles.buttonText}>
                        Save Changes
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
