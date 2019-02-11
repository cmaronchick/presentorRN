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

export default class HomeScreen extends React.Component {
  state = {
    user: null,
    userToken: ''
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
    await this.getPresentorInfo();
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>Screen name</Text>
        
        {/* refresh button  */}
        <Item rounded style={styles.itemStyle}>
          <TouchableOpacity onPress={() => this.getPresentorInfo()}>
            <Icon
            active
            name='refresh'
            style={styles.iconStyle}
            />
          </TouchableOpacity>
        </Item>
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
})