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

  import PresenteeScreen from './PresenteeScreen'

export default class HomeScreen extends React.Component {
  state = {
    user: null,
    userToken: '',
    presentorInfo: {}
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

  selectPresentee = (presentee) => {
    this.props.navigation.navigate('Presentee', { presentee: presentee})
  }



  render() {
    let { presentorInfo } = this.state;
    return (
      <View style={styles.container}>
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
        {presentorInfo && presentorInfo.Items && presentorInfo.Items[0].presentees ? 
          <FlatList
            data={
              presentorInfo.Items[0].presentees.L
            }
            keyExtractor={(item) => item.M.id.S}
            renderItem={({item}) => (
              <TouchableOpacity onPress={() => this.selectPresentee(item)}>
                <View key={item.M.id.S} style={styles.container}>
                  <Text>{item.M.firstName.S} {item.M.lastName.S}</Text>
                </View>
              </TouchableOpacity>
            )}

          />
          : 
          <Text>Add Giftees</Text>
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
})