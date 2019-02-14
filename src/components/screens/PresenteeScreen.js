import React, { Component } from "react";
import { 
    View,
    Text,
    StyleSheet,
    FlatList,
    Modal,
} from "react-native";

import {
    Container,
    Content,
    Item,
    Input,
    Icon,
} from 'native-base'
import Auth from '@aws-amplify/core'
import apis from '../../apis/apis'

import signInStyles from '../styles/signIn'
//import Accordion from 'react-native-accordion'
// import { FlatList } from "react-native-gesture-handler";

// const AccordionList = React.createClass({
//     getInitialState() {
//       const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
//       return {
//         dataSource: ds.cloneWithRows(range(20)),
//       };
//     },
  
//     render() {
//       return (
//         <View style={{ flex: 1 }}>
//           <ListView
//             dataSource={this.state.dataSource}
//             renderRow={this._renderRow}
//           />
//         </View>
//       );
//     },
  
//     _renderHeader() {
//       return (
//         <View style={{
//           paddingTop: 15,
//           paddingRight: 15,
//           paddingLeft: 15,
//           paddingBottom: 15,
//           borderBottomWidth: 1,
//           borderBottomColor: '#a9a9a9',
//           backgroundColor: '#f9f9f9',
//         }}>
//           <Text>Click to Expand</Text>
//         </View>
//       );
//     },
  
//     _renderContent() {
//       return (
//         <View style={{
//           backgroundColor: '#31363D'
//         }}>
//           <Text style={{
//             paddingTop: 15,
//             paddingRight: 15,
//             paddingBottom: 15,
//             paddingLeft: 15,
//             color: '#fff',
//           }}>
//             This content is hidden in the accordion
//           </Text>
//         </View>
//       );
//     },
  
//     _renderRow(rowData) {
//       return (
//         <Accordion
//           header={this._renderHeader()}
//           content={this._renderContent()}
//           duration={300}
//           easing="easeOutCubic"
//         />
//       );
//     }
//   });
class PresenteeScreen extends Component {
    // constructor(props) {
    //     super(props)
    // }
    state = {
        presentee: this.props.navigation.getParam('presentee', null)
    }

    onChangeText(key, value) {
        this.setState({[key]: value})
    }

    updatePresentee = async () => {
        await Auth.currentAuthenticatedUser()
        .then(async (user) => {
            await apis.updatePresentorInfo(user.signInUserSession.idToken.jwtToken,this.state)
        })
    }
    showModal() {
        this.setState({ modalVisible: true })
        console.log('Shown')
    }
    hideModal() {
        this.setState({ modalVisible: false })
        // Refocus on phone Input after modal is closed
        console.log('Hidden')
    }

    render() {
        const { navigation } = this.props;
        const presentee = this.state.presentee
        
        //let { presentee } = this.props
        return (
            <View style={styles.container, styles.presenteeContainer}>
                <Text>{presentee.firstName} {presentee.lastName}</Text>
                {presentee.keyDates ?
                    <FlatList
                        data={presentee.keyDates.sort((a,b) => {
                            if (a.date > b.date) return 1;
                            return -1;
                        })}
                        keyExtractor={(item) => item.date}
                        renderItem={({item}) => (    
                            <View style={styles.dateRow}>
                                <Text>{item.name}</Text>
                                <Text>
                                    {new Date(item.date).getMonth() + 1}
                                    /{new Date(item.date).getDate() + 1}
                                    /{new Date(item.date).getFullYear()}
                                </Text>
                            </View>
                        )
                    }
                    />
                :
                    <Text>Add Key Dates</Text>
                }
                <Modal
                    animationStyle="slide"
                    transparent={false}
                    visible={this.state.modalVisible}
                    onRequestClose={() => { console.log('Modal closed')}}>
                    <View style={{flex: 1}}>
                        <View style={{flex: 7, marginTop: 80 }}>
                            
                            <Input
                            style={signInStyles.input}
                            value={presentee.firstName}
                            returnKeyType='done'
                            autoCapitalize={true}
                            autoCorrect={false}
                            secureTextEntry={false}
                            ref='FirstInput'
                            onChangeText={(val) => this.onChangeText(presentee['firstName'], val)}
                            onFocus={() => this.fadeOut()}
                            onEndEditing={() => this.fadeIn()}
                            />
                        </View>
                        <TouchableOpacity
                            onPress={() => {
                                this.updatePresentee()
                            }}
                            style={styles.closeButtonStyle}>
                            <Text style={styles.textStyle}>
                                Close
                            </Text>
                        </TouchableOpacity>
                    </View>
                </Modal>
            </View>
        );
    }
}
export default PresenteeScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    presenteeContainer: {
        margin: 10,
    },
    dateRow: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
    }
});