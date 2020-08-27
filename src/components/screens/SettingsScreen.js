// AWS Amplify
import Auth from '@aws-amplify/auth'

import React from 'react'
import {
  AsyncStorage,
  TouchableOpacity,
  TouchableWithoutFeedback,
  StyleSheet,
  Text,
  SafeAreaView,
  StatusBar,
  KeyboardAvoidingView,
  Keyboard,
  View,
} from 'react-native'
import {
    Container,
    Item,
    Input,
    Icon
} from 'native-base'

import styles from '../styles/signIn'

export default class SettingsScreen extends React.Component {
    state = {
        password1: '',
        password2: ''
    }
    onChangeText(key, value) {
        this.setState({[key]: value})
    }
    // Sign out from the app
    signOutAlert = async () => {
        // await Alert.alert(
        // 'Sign Out',
        // 'Are you sure you want to sign out from the app?',
        // [
        //     {text: 'Cancel', onPress: () => console.log('Canceled'), style: 'cancel'},
        //     // Calling signOut
        //     {text: 'OK', onPress: () => this.signOut()}, 
        // ],
        // { cancelable: false }
        // )
    }
    // Confirm sign out
    signOut = async () => {
        await Auth.signOut()
        .then(() => {
        console.log('Sign out complete')
        this.props.navigation.navigate('AuthLoading')
        })
        .catch(err => console.log('Error while signing out!', err))
    }
  render() {
    return (
        <SafeAreaView style={styles.container}>
            <StatusBar/>
            <KeyboardAvoidingView style={styles.container} behavior='padding' enabled>
            <TouchableWithoutFeedback style={styles.container} onPress={Keyboard.dismiss}>
                <View style={styles.container}>
                {/*Infos*/}
                <Container style={styles.infoContainer}>
                    <View style={styles.container}>
                    <View 
                        style={
                        [styles.buttonStyle, {borderRadius: 4, marginBottom: 20}]
                        }>
                        <Text style={styles.buttonText}>Change password</Text>              
                    </View>
                    {/* Old password */}
                    <Item rounded style={styles.itemStyle}>
                        <Icon
                        active
                        name='lock'
                        style={styles.iconStyle}
                        />
                        <Input
                        style={styles.input}
                        placeholder='Old password'
                        placeholderTextColor='#adb4bc'
                        returnKeyType='next'
                        autoCapitalize='none'
                        autoCorrect={false}
                        secureTextEntry={true}
                        onSubmitEditing={(event) => { this.refs.SecondInput._root.focus()}}
                        onChangeText={value => this.onChangeText('password1', value)}
                        />
                    </Item>    
                    {/* New password */}              
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
                        returnKeyType='go'
                        autoCapitalize='none'
                        autoCorrect={false}
                        secureTextEntry={true}
                        ref='SecondInput'
                        onChangeText={value => this.onChangeText('password2', value)}
                        />
                    </Item>
                    <TouchableOpacity
                        style={styles.buttonStyle}>
                        <Text style={styles.buttonText}>
                        Submit
                        </Text>
                    </TouchableOpacity>
                    <View 
                        style={
                        {
                            justifyContent: 'center', 
                            alignItems: 'center', 
                            paddingBottom: 100
                        }
                        }
                    />
                    <TouchableOpacity
                        style={
                        [styles.buttonStyle, 
                            {
                            flexDirection: 'row', 
                            justifyContent: 'center'
                            }
                        ]
                        }
                        onPress={() => this.signOutAlert()}>
                        <Icon name='md-power' style={{color: '#fff', paddingRight: 10}}/>
                        <Text style={styles.buttonText}>
                        Sign out
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
