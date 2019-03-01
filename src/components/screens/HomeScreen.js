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

export default class HomeScreen extends React.Component {
  state = {
    user: null,
    userToken: '',
    presentorInfo: {},
    gettingPresentorInfo: true,
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



  render() {
    let { presentorInfo } = this.state;
    return (
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
        {presentorInfo && presentorInfo.presentees ? 
          <FlatList
            data={presentorInfo.presenteesArray}
            keyExtractor={(item) => item.id}
            renderItem={({item}) => (
              <TouchableOpacity onPress={() => this.selectPresentee({ presentee: item})}>
                <View key={item.id} style={[styles.container, styles.listItem]}>
                  <Text>{item.firstName} {item.lastName}</Text>
                </View>
              </TouchableOpacity>
            )}

          />
          : this.state.gettingPresentorInfo ? 
            <View style={styles.container}>
              <ActivityIndicator size="large" color="#fff" />
            </View>
            :
            <View style={styles.container}>
              <Text>Add Giftees</Text>
            </View>
        }
        
      </View>
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