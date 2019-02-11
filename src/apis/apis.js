import React, { Component } from "react";
const apiHost = 'https://q047981doj.execute-api.us-west-2.amazonaws.com/dev/'

import { awsmobile } from '../aws-exports';
import Auth from '@aws-amplify/auth';


export default {
    async getPresentorInfo(token) {
        try {
            let apiCallOptions = {
                headers: {
                    Authorization: token
                }
            }
            let response = await fetch(
            apiHost + 'giftee', apiCallOptions
            );
            let gifteeJson = await response.json();
            return gifteeJson;
        } catch (error) {
            console.error(error);
        }
    }
}