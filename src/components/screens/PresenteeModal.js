import React, {  Component} from "react";
import { 
    View,
    Text,
    StyleSheet,
    Modal,
    TouchableOpacity
} from "react-native";

import {
    Input,
    Icon
} from 'native-base';

import signInStyles from '../styles/signIn';

class PresenteeModal extends Component {

    constructor(props) {
        super(props)
        this.state = {
            presentee: this.props.presentee,
            modalVisible: this.props.modalVisible,
            onSave: this.props.onSave,
            onClose: this.props.onClose,
        }
    }

    onChangeText(key, value) {
        var tempPresentee = this.state.presentee;
        tempPresentee[key] = value
        this.setState({presentee: tempPresentee, modalVisible: true})
    }

    render () {
        // console.log('presenteeModal props :', this.props);
        // console.log('presenteeModal state :', this.state);
        return (
            <Modal
            style={[styles.container, { margin: 20, justifyContent: 'space-around'}]}
            animationStyle="slide"
            transparent={false}
            visible={this.state.modalVisible}
            onRequestClose={() => { console.log('Modal closed')}}>
                <View style={signInStyles.container}>
                    <View style={[signInStyles.infoContainer, {alignItems: 'flex-start'}]}>
                        <Text>First Name</Text>
                        <Input
                        style={signInStyles.input}
                        value={this.state.presentee ? this.state.presentee.firstName : null}
                        returnKeyType='done'
                        autoCapitalize='words'
                        autoCorrect={false}
                        secureTextEntry={false}
                        ref='FirstInput'
                        onChangeText={(val) => this.onChangeText('firstName', val)}
                        />
                    </View>
                    <View style={[signInStyles.infoContainer, {alignItems: 'flex-start'}]}>
                        <Text>Last Name</Text>
                        <Input
                        style={signInStyles.input}
                        value={this.state.presentee ? this.state.presentee.lastName : null}
                        returnKeyType='done'
                        autoCapitalize='words'
                        autoCorrect={false}
                        secureTextEntry={false}
                        ref='FirstInput'
                        onChangeText={(val) => this.onChangeText('lastName', val)}
                        />
                    </View>
                </View>
                <View style={[signInStyles.infoContainer, { flex: 1}]}>
                    <View style={{padding: 20,flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>

                    {(this.state.presentee.firstName || this.state.presentee.lastName) ? (
                        <TouchableOpacity
                            onPress={() => this.state.onSave()}
                            style={signInStyles.buttonStyle}>
                            <Text style={signInStyles.buttonText}>
                                Update {this.state.presentee.firstName}
                            </Text>
                        </TouchableOpacity>
                    ) : null }
                        <TouchableOpacity
                            onPress={() => {
                                this.state.onClose()
                            }}
                            style={signInStyles.buttonStyle}>
                            <Text style={signInStyles.buttonText}>
                                Close
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        )
    }
}
export default PresenteeModal;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
});