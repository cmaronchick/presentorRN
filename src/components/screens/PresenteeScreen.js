import React, { Component } from "react";
import { 
    SafeAreaView,
    ScrollView,
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
    Button,
    Card,
    CardItem,
    Container,
    Content,
    Header,
    Body,
    Left,
    Right,
    Title,
    Icon,
    Input,
    Item,
    List,
    ListItem,
    Text,
    View,
} from 'native-base'
import Auth from '@aws-amplify/auth'
import apis from '../../apis/apis'

import signInStyles from '../styles/signIn'
import PresenteeModal from './PresenteeModal'
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
        searchTerm: null,
        giftSearchResults: [],
        selectedSearchResult: null,
    }

    onChangeText(key, value) {
        var tempPresentee = this.state.presentee;
        tempPresentee[key] = value
        this.setState({presentee: tempPresentee})
    }

    onChangeTextDate(key, value) {
        this.setState({ [key]: value }) 
    }

    async onChangeTextGift(value) {
        this.setState({searchingGifts: true, addingGiftName: value})
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
        tempPresentee[arrayName].push(addItem)
        await this.setState({
            presentee: tempPresentee
        })
        if (arrayName === 'gifts') {
            this.clearGift();
        }
        if (arrayName === 'keyDates') {
            this.clearDate()
        }
    }
    clearGift() {
        this.setState({
            addingGift: false,
            addingGiftUUID: null,
            addingGiftName: null,
            addingGiftDate: null,
            searchingGifts: false,
            searchTerm: null,
            giftSearchResults: [],
            selectedSearchResult: null,
        })
    }
    clearDate() {
        this.setState({
            addingDate: false,
            addingDateUUID: null,
            addingDateName: null,
            addingDateDate: null,
        })
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
            <Container>
                    <Header>
                        <Body>
                            <Title>{presentee.firstName} {presentee.lastName}</Title>
                        </Body>
                        <Right>
                            <Button 
                                style={signInStyles.buttonStyle}
                                onPress={() => this.showModal()}>
                                <Text style={signInStyles.buttonText}>Edit</Text>
                            </Button>
                        </Right>
                    </Header>
                    <Content>
                        {presentee.keyDates ? (
                            <Card style={signInStyles.container}>
                                <CardItem header>
                                    <Text style={styles.sectionHeader}>Gift Occasions</Text>
                                </CardItem>
                                        
                                        <FlatList
                                            data={presentee.keyDates.sort((a,b) => {
                                                if (a.date > b.date) return 1;
                                                return -1;
                                            })}
                                            keyExtractor={(item) => item.date}
                                            renderItem={({item, index}) => (    
                                                <ListItem>
                                                    <Left>
                                                        <Text>{item.name}</Text>
                                                    </Left>
                                                    <Body>
                                                        <Text>
                                                            {new Date(item.date).getMonth() + 1}
                                                            /{new Date(item.date).getDate() + 1}
                                                            /{new Date(item.date).getFullYear()}
                                                        </Text>
                                                    </Body>
                                                    <Right>
                                                        <Icon
                                                        active
                                                        name="remove-circle"
                                                        style={[styles.iconStyle, { marginLeft: 0 }]} onPress={() => this.deleteAlert(index, item.name, 'keyDates')}
                                                        />
                                                    </Right>
                                                </ListItem>
                                            )
                                        }
                                        />
                            </Card>
                        ) :
                            <Button onPress={() => {
                                var uuidVal = uuid();
                                this.setState({
                                    addingDateUUID: uuidVal,
                                    addingDate: true
                                })
                            }}
                            style={signInStyles.buttonStyle}>
                                <Text>Add a Gift Occasion for this Presentee</Text>
                            </Button>
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
                                                this.onChangeTextDate('addingDateName', val)}
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
                                <Button 
                                style={signInStyles.buttonStyle}
                                disabled={(!this.state.addingDateName || !this.state.addingDateDate)} 
                                onPress={async () => {
                                    await this.addItem('keyDates', { name: this.state.addingDateName, date: this.state.addingDateDate, id: this.state.addingDateUUID })
                                    await this.updatePresentee()
                                    } }>
                                    <Text>Save</Text>
                                </Button>                            
                                </View>
                            ) : (
                                <Button onPress={() => {
                                    var uuidVal = uuid();
                                    this.setState({
                                        addingDateUUID: uuidVal,
                                        addingDate: true
                                    })
                                }} style={signInStyles.buttonStyle}>
                                    <Text>Add Gift Occasions</Text>
                                </Button>
                            )}
                        </View>

                        {this.state.presentee.gifts ? (
                            <View style={signInStyles.container}>
                                <Text style={styles.sectionHeader}>Gifts</Text>
                                <FlatList
                                    data={this.state.presentee.gifts}
                                    keyExtractor={({item, index}) => index}
                                    renderItem={({item, index}) => (    
                                        <ListItem>
                                            <Body>
                                                <Text>{item.name}</Text>
                                            </Body>
                                            <Right>
                                                <Icon
                                                active
                                                name="remove-circle"
                                                style={[styles.iconStyle, { marginLeft: 0 }]} onPress={() => this.deleteAlert(index, item.name, 'gifts')}
                                                />
                                            </Right>
                                        </ListItem>
                                    )
                                }
                                />
                            </View>
                        ) : null
                        }

                        {!this.state.addingGift ? (
                                <Button onPress={() => {
                                    var uuidVal = uuid();
                                    this.setState({
                                        addingGiftUUID: uuidVal,
                                        addingGift: true
                                    })
                                }}
                                style={signInStyles.buttonStyle}>
                                    <Text>Add a Gift for this Presentee</Text>
                                </Button>
                        ) : null }
                        <View style={styles.container}>
                            {this.state.addingGift ? (
                                <View style={{flex: 1, flexDirection: 'column', justifyContent: 'space-between', width: 300}}>

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
                                                    
                                                    <Button onPress={() => {
                                                        this.setState({selectedSearchResult: item})
                                                    }
                                                    } style={[signInStyles.itemStyle, (this.state.selectedSearchResult === item) ? {backgroundColor: 'rgba(80,94,104,0)'} : {}]}>
                                                        <Text style={signInStyles.textStyle}>{item.name}</Text>
                                                    </Button>
                                                )
                                            }
                                            />
                                        {/* <View style={{padding: 20,flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                                            <View style={signInStyles.container}> */}
                                            <Container style={[signInStyles.infoContainer, { alignItems: 'flex-start', justifyContent: 'space-between'}]}>
                                                <Button 
                                                style={[signInStyles.buttonStyle, styles.presenteeButtonStyle]}
                                                disabled={!this.state.addingGiftName}
                                                onPress={async () => {
                                                    await this.addItem('gifts', this.state.selectedSearchResult ? this.state.selectedSearchResult : { name: this.state.addingGiftName, id: this.state.addingDateUUID })
                                                    await this.updatePresentee()
                                                    } }>
                                                    <Text style={signInStyles.buttonText}>Save</Text>
                                                </Button> 
                                            {/* </View>
                                            <View style={signInStyles.container}> */}
                                                <Button
                                                    onPress={() => {
                                                        this.clearGift()
                                                    }}
                                                    style={[signInStyles.buttonStyle, styles.presenteeButtonStyle]}>
                                                    <Text style={signInStyles.buttonText}>
                                                        Cancel
                                                    </Text>
                                                </Button>
                                            {/* </View>
                                        </View> */}
                                            </Container>
                                    </View>
                                ) : (
                                    <View style={styles.container}>
                                        <Text>No Search Results</Text>
                                        <Button 
                                        style={[signInStyles.buttonStyle, styles.presenteeButtonStyle]}
                                        disabled={!this.state.addingGiftName}
                                        onPress={async () => {
                                            await this.addItem('gifts', { name: this.state.addingGiftName, id: this.state.addingDateUUID })
                                            await this.updatePresentee()
                                            } }>
                                            <Text style={signInStyles.buttonText}>Save</Text>
                                        </Button> 
                                    {/* </View>
                                    <View style={signInStyles.container}> */}
                                        <Button
                                            onPress={() => {
                                                this.clearGift()
                                            }}
                                            style={[signInStyles.buttonStyle, styles.presenteeButtonStyle]}>
                                            <Text style={signInStyles.buttonText}>
                                                Cancel
                                            </Text>
                                        </Button>
                                    </View>
                                ) }                          
                                </View>
                            ) : null}
                        </View>
                    </Content>
                    <PresenteeModal modalVisible={this.state.modalVisible} presentee={this.state.presentee} onSave={() => this.updatePresentee()} onClose={() => this.hideModal()} />
            </Container>
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
    },
    dateRowSelected: {
        backgroundColor: '#ccc'
    },
    presenteeButtonStyle: {
        marginHorizontal: 5
    },
});