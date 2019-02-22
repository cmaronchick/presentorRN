import React, { Component } from "react";
import { 
    SafeAreaView,
    ScrollView,
    View,
    Text,
    StyleSheet,
    FlatList,
    Modal,
    TouchableOpacity,
    Alert,
    ActivityIndicator,
} from "react-native";
import DatePicker from 'react-native-datepicker'
import uuid from 'uuid'
import {
    Container,
    Content,
    Item,
    Input,
    Icon,
} from 'native-base'
import Auth from '@aws-amplify/auth'
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
        presentee: this.props.navigation.getParam('presentee', null).presentee,
        modalVisible: false,
        addingDate: false,
        addingDateUUID: null,
        addingDateName: null,
        addingDateDate: null,
        addingGift: false,
        addingGiftUUID: null,
        addingGiftName: null,
        addingGiftDate: null,
        searchingGifts: false,
        giftSearchResults: [],
    }

    onChangeText(key, value) {
        var tempPresentee = this.state.presentee;
        tempPresentee[key] = value
        this.setState({presentee: tempPresentee})
    }

    async onChangeTextGift(value) {
        this.setState({searchingGifts: true})
        await Auth.currentAuthenticatedUser()
        .then(async (user) => {
            await apis.giftSearch(user.signInUserSession.idToken.jwtToken,value)
            .then((giftSearchResults) => {
                console.log('giftSearchResults :', giftSearchResults);
                this.setState({ searchingGifts: false, giftSearchResults })

            })
        })
    }
    addItem = async (arrayName, addItem) => {
        var tempPresentee = this.state.presentee;
        var addItemObj;
        tempPresentee[arrayName].push(addItem)
        await this.setState({
            presentee: tempPresentee
        })
        console.log('this.state :', this.state);
    }
    updatePresentee = async () => {
        await Auth.currentAuthenticatedUser()
        .then(async (user) => {
            try {
                console.log('this.state.presentee :', this.state.presentee);
                await apis.updatePresenteeInfo(user.signInUserSession.idToken.jwtToken,this.state.presentee)
                .then((presenteeInfo) => {
                    this.hideModal();
                    this.setState({presentee: presenteeInfo})
                })
            } catch (error) {
                console.log('updatePresentee Error :', error);
            }
        })
        .catch(userError => console.log('userError :', userError))
    }
    showModal() {
        this.setState({ modalVisible: true })
        console.log('Modal Shown')
    }
    hideModal() {
        this.setState({ modalVisible: false })
        // Refocus on phone Input after modal is closed
        console.log('Modal Hidden')
    }
    async confirmDelete(index, arrayName) {
        console.log('index :', index);
        var tempPresentee = this.state.presentee;
        var tempArray = this.state.presentee[arrayName];
        console.log('tempArray1 :', tempArray);
        if (!tempArray) {
            await Alert.alert(
                'Sorry, there was an error with ' + arrayName,
                [
                    {text: 'OK'}
                ],
                {cancelable: false}
            )
        }
        tempArray.splice(index, 1);
        tempPresentee[arrayName] = tempArray
        this.setState({ presentee: tempPresentee})
    }
    componentDidMount() {
    }

    // Sign out from the app
    deleteAlert = async (index, itemName, arrayName) => {
        console.log('this.state.presentee[arrayName] :', this.state.presentee[arrayName]);
        await Alert.alert(
        'Delete ' + itemName + '',
        'Are you sure you want to delete ' + itemName + '?',
        [
            {text: 'Cancel', onPress: () => console.log('Canceled'), style: 'cancel'},
            // Calling signOut
            {text: 'OK', onPress: () => this.confirmDelete(index, arrayName)}, 
        ],
        { cancelable: false }
        )
    }
    render() {
        const { navigation } = this.props;
        const presentee = this.state.presentee
        
        //let { presentee } = this.props
        return (
            <SafeAreaView style={signInStyles.container}>
                <ScrollView style={styles.presenteeContainer}>
                    <View style={{flex: 1, flexDirection: 'row', justifyContent: "space-evenly"}}>
                        <Text>{presentee.firstName} {presentee.lastName}</Text>
                        <TouchableOpacity onPress={() => this.showModal()}><Text>Edit</Text></TouchableOpacity>
                    </View>
                    {presentee.keyDates ? (
                        <View style={signInStyles.container}>
                            <Text style={styles.sectionHeader}>Gift Occasions</Text>
                            <FlatList
                                data={presentee.keyDates.sort((a,b) => {
                                    if (a.date > b.date) return 1;
                                    return -1;
                                })}
                                keyExtractor={(item) => item.date}
                                renderItem={({item, index}) => (    
                                    <View style={styles.dateRow}>
                                        <Text>{item.name}</Text>
                                        <Text>
                                            {new Date(item.date).getMonth() + 1}
                                            /{new Date(item.date).getDate() + 1}
                                            /{new Date(item.date).getFullYear()}
                                        </Text>
                                        <Icon
                                        active
                                        name="remove-circle"
                                        style={[styles.iconStyle, { marginLeft: 0 }]} onPress={() => this.deleteAlert(index, item.name, 'keyDates')}
                                        />
                                    </View>
                                )
                            }
                            />
                        </View>
                    ) :
                        <TouchableOpacity onPress={() => {
                            var uuidVal = uuid();
                            this.setState({
                                addingDateUUID: uuidVal,
                                addingDate: true
                            })
                        }}
                        style={signInStyles.buttonStyle}>
                            <Text>Add a Gift Occasion for this Presentee</Text>
                        </TouchableOpacity>
                    }
                    <View style={styles.container}>
                        {this.state.addingDate ? (
                            <View style={{width: 300, height: 100, flexDirection: 'column', justifyContent: 'space-between', backgroundColor: ''}}>

                            <Item rounded style={[signInStyles.itemStyle, {height: 30}]}>
                                <Input
                                        style={[signInStyles.input, {flex: 1}]}
                                        placeholder='Gift Occasion'
                                        returnKeyType='done'
                                        autoCapitalize='words'
                                        autoCorrect={false}
                                        secureTextEntry={false}
                                        ref='FirstInput'
                                        onChangeText={(val) => {
                                            this.onChangeText('addingDateName', val)}
                                        }
                                        />
                            </Item>
                            <Item>
                                <DatePicker
                                        date={this.state.addingDateDate}
                                        mode="date"
                                        placeholder="select date"
                                        format="YYYY-MM-DD"
                                        confirmBtnText="Confirm"
                                        cancelBtnText="Cancel"
                                        customStyles={{
                                        dateIcon: {
                                            position: 'absolute',
                                            left: 0,
                                            top: 4,
                                            marginLeft: 0
                                        },
                                        dateInput: {
                                            marginLeft: 36
                                        }
                                        // ... You can check the source to find the other keys.
                                        }}
                                        onDateChange={(date) => {
                                            this.setState({
                                                addingDateDate: date
                                            })
                                        }}
                                    />
                            </Item>
                            <TouchableOpacity 
                            style={signInStyles.buttonStyle}
                            disabled={(!this.state.addingDateName || !this.state.addingDateDate)} 
                             onPress={async () => {
                                 await this.addDate()
                                 await this.updatePresentee()
                                } }>
                                <Text>Save</Text>
                            </TouchableOpacity>                            
                            </View>
                        ) : (
                            <TouchableOpacity onPress={() => {
                                var uuidVal = uuid();
                                this.setState({
                                    addingDateUUID: uuidVal,
                                    addingDate: true
                                })
                            }} style={signInStyles.buttonStyle}>
                                <Text>Add Gift Occasions</Text>
                            </TouchableOpacity>
                        )}
                    </View>

                    {presentee.gifts ? (
                        <View style={signInStyles.container}>
                            <Text style={styles.sectionHeader}>Gifts</Text>
                            <FlatList
                                data={presentee.gifts.sort((a,b) => {
                                    if (a.date > b.date) return 1;
                                    return -1;
                                })}
                                keyExtractor={({item, index}) => index}
                                renderItem={({item, index}) => (    
                                    <View style={styles.dateRow}>
                                        <Text>{item.name}</Text>
                                        <Icon
                                        active
                                        name="remove-circle"
                                        style={[styles.iconStyle, { marginLeft: 0 }]} onPress={() => this.deleteAlert(index, item.name, 'keyDates')}
                                        />
                                    </View>
                                )
                            }
                            />
                            <TouchableOpacity onPress={() => {
                                var uuidVal = uuid();
                                this.setState({
                                    addingGiftUUID: uuidVal,
                                    addingGift: true
                                })
                            }}
                            style={signInStyles.buttonStyle}>
                                <Text>Add a Gift for this Presentee</Text>
                            </TouchableOpacity>
                        </View>
                    ) :
                        <TouchableOpacity onPress={() => {
                            var uuidVal = uuid();
                            this.setState({
                                addingGiftUUID: uuidVal,
                                addingGift: true
                            })
                        }}
                        style={signInStyles.buttonStyle}>
                            <Text>Add a Gift for this Presentee</Text>
                        </TouchableOpacity>
                    }
                    <View style={styles.container}>
                        {this.state.addingGift ? (
                            <View style={{width: 300, height: 100, flexDirection: 'column', justifyContent: 'space-between', backgroundColor: ''}}>

                            <Item rounded style={[signInStyles.itemStyle, {height: 30}]}>
                                <Input
                                        style={[signInStyles.input, {flex: 1}]}
                                        placeholder='Gift'
                                        returnKeyType='done'
                                        autoCapitalize='words'
                                        autoCorrect={false}
                                        secureTextEntry={false}
                                        ref='FirstInput'
                                        onChangeText={(val) => {
                                            this.onChangeTextGift(val)}
                                        }
                                        />
                            </Item>
                            {this.state.searchingGifts ? (
                                <ActivityIndicator size="large" color="#fff" />
                            ) : null }
                            {this.state.giftSearchResults.length ? (
                                <View style={styles.container}>
                                    <FlatList
                                        data={this.state.giftSearchResults}
                                        keyExtractor={({item, index}) => index}
                                        renderItem={({item, index}) => (    
                                            <View style={styles.dateRow}>
                                                <Text>{item.name}</Text>
                                            </View>
                                        )
                                    }
                                    />

                                    {/* <TouchableOpacity 
                                    style={signInStyles.buttonStyle}
                                    disabled={(!this.state.addingDateName || !this.state.addingDateDate)} 
                                    onPress={async () => {
                                        await this.addDate()
                                        await this.updatePresentee()
                                        } }>
                                        <Text>Save</Text>
                                    </TouchableOpacity>  */}
                                </View>
                            ) : (
                                <View style={styles.container}>
                                    <Text>No Search Results</Text>
                                </View>
                            ) }                          
                            </View>
                        ) : (
                            <TouchableOpacity onPress={() => {
                                var uuidVal = uuid();
                                this.setState({
                                    addingDateUUID: uuidVal,
                                    addingDate: true
                                })
                            }} style={signInStyles.buttonStyle}>
                                <Text>Add Gift Occasions</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                    <Modal
                        style={styles.container}
                        animationStyle="slide"
                        transparent={false}
                        visible={this.state.modalVisible}
                        onRequestClose={() => { console.log('Modal closed')}}>
                        <View style={styles.container}>
                                <Text>First Name</Text>
                                <Input
                                style={signInStyles.input}
                                value={this.state.presentee.firstName}
                                returnKeyType='done'
                                autoCapitalize='words'
                                autoCorrect={false}
                                secureTextEntry={false}
                                ref='FirstInput'
                                onChangeText={(val) => this.onChangeText('firstName', val)}
                                />
                                <Text>Last Name</Text>
                                <Input
                                style={signInStyles.input}
                                value={this.state.presentee.lastName}
                                returnKeyType='done'
                                autoCapitalize='words'
                                autoCorrect={false}
                                secureTextEntry={false}
                                ref='FirstInput'
                                onChangeText={(val) => this.onChangeText('lastName', val)}
                                />
                            <View style={{padding: 20,flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>
                                <TouchableOpacity
                                    onPress={() => this.updatePresentee()}
                                    style={styles.closeButtonStyle}>
                                    <Text style={styles.textStyle}>
                                        Update {this.state.presentee.firstName}
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => {
                                        this.hideModal()
                                    }}
                                    style={styles.closeButtonStyle}>
                                    <Text style={styles.textStyle}>
                                        Close
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Modal>
                </ScrollView>
            </SafeAreaView>
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
        flex: 1,
    },
    dateRow: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        textAlignVertical: 'center',
        padding: 10,
    }
});