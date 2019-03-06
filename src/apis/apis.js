import React, { Component } from "react";
const apiHost = 'https://q047981doj.execute-api.us-west-2.amazonaws.com/dev/'

import { awsmobile } from '../aws-exports';
import Auth from '@aws-amplify/auth';
import { stringify } from "qs";
import { Linking, Platform } from 'react-native'


export default {
    // Login/SignUp APIs
    
// Open URL in a browser
    async openURL (url) {
    // Use SafariView on iOS
        if (Platform.OS === 'ios') {
        SafariView.show({
            url: url,
            fromBottom: true,
        });
        }
        // Or Linking.openURL on Android
        else {
        Linking.openURL(url);
        }
    },
    
    async handleOpenURL ({ url }) {
        // Extract stringified user string out of the URL
        const [, code] = url.match(/code=([^#]+)/);
        if (code.indexOf("#") > -1) {
        const code1 = code.split('#');
        return code1;
        } else {
        console.log('code: ', code);
        return code;
        }
    },
  
    // Handle Sign Up with Facebook button tap
    async signUpWithFacebook() {
        this.openURL(
        'https://presentor.auth.us-west-2.amazoncognito.com/signup?redirect_uri=presentorRN://login&response_type=code&client_id=10eavoe3ufj2d70m5m3m2hl4pl&identity_provider=Facebook&scope=aws.cognito.signin.user.admin%20email%20openid%20phone%20profile'
    )
    },
    // Handle Login with Facebook button tap
    async loginWithFacebook() {
        this.openURL(
        'https://presentor.auth.us-west-2.amazoncognito.com/login?redirect_uri=presentorRN://login&response_type=code&client_id=10eavoe3ufj2d70m5m3m2hl4pl&identity_provider=Facebook&scope=aws.cognito.signin.user.admin%20email%20openid%20phone%20profile'
    )
    },
    async getPresentorInfo(token) {
        try {
            let apiCallOptions = {
                method: "GET",
                headers: {
                    Authorization: token
                }
            }
            let response = await fetch(
            apiHost + 'presentee', apiCallOptions
            );
            let gifteeJson = await response.json();
            return gifteeJson;
        } catch (error) {
            console.error(error);
        }
    },
    async updatePresentorInfo(token, presentorInfo) {
        try {
            let apiCallOptions = {
                method: "POST",
                headers: {
                    Authorization: token,
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(presentorInfo)
            }
            let response = await fetch(
            apiHost + 'presentee', apiCallOptions
            );
            let presentorJson = await response.json();
            return presentorJson;
        } catch (error) {
            console.error(error);
        }
    },
    async updatePresenteeInfo(token, presenteeInfo) {
        try {
            let apiCallOptions = {
                method: "POST",
                headers: {
                    Authorization: token,
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(presenteeInfo)
            }
            let response = await fetch(
            apiHost + 'presentee', apiCallOptions
            );
            let presenteeJson = await response.json();
            console.log('presenteeJson :', presenteeJson);
            return presenteeJson;
        } catch (error) {
            console.error(error);
        }
    },
    async giftSearch(token, giftSearchTerm) {
        console.log('giftSearchTerm :', giftSearchTerm);
        try {
            let apiCallOptions = {
                method: "GET",
                headers: {
                    Authorization: token,
                }
            }
            let response = await fetch(
            apiHost + 'gifts/' + giftSearchTerm, apiCallOptions
            );
            let giftSearchJson = await response.json();
            console.log('giftSearchJson :', giftSearchJson);
            return giftSearchJson;
        } catch (error) {
            console.error(error);
        }
    }
}