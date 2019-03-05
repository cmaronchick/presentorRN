import React from 'react'
import {
    TouchableOpacity,
    TouchableWithoutFeedback,
    StyleSheet,
    ScrollView,
    View,
    Text,
    SafeAreaView,
    StatusBar,
    KeyboardAvoidingView,
    Keyboard,
    Alert,
    Modal,
    FlatList,
    Animated,
    ActivityIndicator,
  } from 'react-native'
  import {
      Container,
      Content,
      Item,
      Input,
      Icon,
  } from 'native-base'

  import Auth from '@aws-amplify/auth'
  import apis from '../../apis/apis'

  import PresenteeScreen from './PresenteeScreen'
  import PresenteeModal from './PresenteeModal'
  import signInStyles from '../styles/signIn'

export default class HomeScreen extends React.Component {
  state = {
    user: null,
    userToken: '',
    presentorInfo: {},
    gettingPresentorInfo: true,
    modalVisible: false
  }

  getPresentorInfo = async () => {
    await Auth.currentAuthenticatedUser()
    .then(async (user) => {
      this.setState({ user, userToken: user.signInUserSession.idToken.jwtToken })
        
      await apis.getPresentorInfo(user.signInUserSession.idToken.jwtToken)
      .then((presentorInfo) => {
        console.log('presentorInfo: ', presentorInfo)
        this.setState({ presentorInfo })
      })
      .catch(presentorInfoError => console.log('presentorInfoError :', presentorInfoError))
    })
  }
  componentDidMount = async () => {
    await this.getPresentorInfo()
    .then(() => this.setState({gettingPresentorInfo: false}))
  }

  selectPresentee = (presentee) => {
    this.props.navigation.navigate('Presentee', { presentorInfo: this.state.presentorInfo, presentee})
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
      console.log('modal state :', this.state)
  }
  hideModal() {
      this.setState({ modalVisible: false })
      // Refocus on phone Input after modal is closed
      console.log('Modal Hidden')
  }



  render() {
    let { presentorInfo } = this.state;
    return (
      <SafeAreaView style={signInStyles.container}>
        <View style={styles.container}>
        {/* refresh button  */}
          {!this.state.gettingPresentorInfo ? (
            <Item rounded style={styles.itemStyle}>
              <TouchableOpacity onPress={() => this.getPresentorInfo()}>
                <Icon
                active
                name='refresh'
                style={styles.iconStyle}
                />
              </TouchableOpacity>
            </Item>
          ) : null}
          {presentorInfo && presentorInfo.presentees ? (
              <View style={styles.container}>
                <FlatList
                  data={presentorInfo.presenteesArray}
                  keyExtractor={(item) => item.id}
                  renderItem={({item}) => (
                    <Item style={styles.inputStyle}>
                      <TouchableOpacity onPress={() => this.selectPresentee({ presentee: item})}>
                        <View key={item.id} style={[styles.container, styles.listItem]}>
                          <Text>{item.firstName} {item.lastName}</Text>
                        </View>
                      </TouchableOpacity>
                    </Item>
                  )}
                  />
                  <TouchableOpacity style={signInStyles.buttonStyle} onPress={() => this.showModal()}>
                    <Text style={signInStyles.buttonText}>Add Giftees</Text>
                  </TouchableOpacity>
                </View>

            )
            : this.state.gettingPresentorInfo ? 
              <View style={styles.container}>
                <ActivityIndicator size="large" color="#fff" />
              </View>
              : null
          }
          
          <PresenteeModal modalVisible={this.state.modalVisible} presentee={{}} onSave={() => this.updatePresentee()} onClose={() => this.hideModal()} />
        </View>
      </SafeAreaView>
    )
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#aa73b7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  listItem: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    fontSize: 16,
  }
})