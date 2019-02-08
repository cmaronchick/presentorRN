import React from 'react'
import {
  StyleSheet,
  View,
  Text,
} from 'react-native'
import {
  Container,
  Icon,
  Input,
  Item,
} from 'native-base'
import Auth from '@aws-amplify/auth'
import styles from '../styles/signIn'

export default class ProfileScreen extends React.Component {
  state = {
    user,
    attributes
  }
  async getCurrentUser () {
    await Auth.currentAuthenticatedUser()
    .then(async (user) => {
      this.setState({user})
    })
    .catch(this.props.navigation.navigate('SignIn'))
  }
  render() {
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
                    {/* email section */}
                    <Item rounded style={styles.itemStyle}>
                        <Icon
                        active
                        name='mail'
                        style={styles.iconStyle}
                        />
                        <Input
                        style={styles.input}
                        placeholder={this.state.user.email ? this.state.user.email : 'you@domain.com'}
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
                    {/* code confirmation section  */}
                    {/* <Item rounded style={styles.itemStyle}>
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
                    </TouchableOpacity> */}
                    </ScrollView>
                </Container>
                </View>
            </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
  }
}
