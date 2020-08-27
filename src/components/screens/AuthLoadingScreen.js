// AWS Amplify
import Auth from '@aws-amplify/auth'

import React from 'react';
import { 
    StyleSheet,
    View,
    Text,
    AsyncStorage } from 'react-native';
import { Spinner } from 'native-base'

export default class AuthLoadingScreen extends React.Component {
    state = {
        userToken: null
    }
    componentDidMount = async() => {
        await this.loadApp()
    }

    loadApp = async() => {
        await Auth.currentAuthenticatedUser()
        .then(user => {
            this.setState({userToken:     user.signInUserSession.accessToken.jwtToken})
        })
        .catch(async (err) => {
            console.log(err)
            await Auth.currentUserInfo()
            .then(userInfo => {
                console.log('userInfo: ', userInfo)
            })
            .catch(userInfoError => console.log('userInfoError: ', userInfoError))
        })
        this.props.navigation.navigate(this.state.userToken ? 'App' : 'Auth')
    }

    render() {
      return (
        <View style={styles.container}>
          <Spinner size="large" color="#fff" />
        </View>
      )
    }
  };

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#aa73b7',
        alignItems: 'center',
        justifyContent: 'center',
    },
})
