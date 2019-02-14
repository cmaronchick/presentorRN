import React, { Component } from "react";
const apiHost = 'https://q047981doj.execute-api.us-west-2.amazonaws.com/dev/'

import { awsmobile } from '../aws-exports';
import Auth from '@aws-amplify/auth';
import { stringify } from "qs";


export default {
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
                body: JSON.stringify(presenteeInfo)
            }
            let response = await fetch(
            apiHost + 'presentee', apiCallOptions
            );
            let gifteeJson = await response.json();
            return gifteeJson;
        } catch (error) {
            console.error(error);
        }
    }
}