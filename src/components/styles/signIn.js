import { StyleSheet } from 'react-native';
const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#aa73b7',
      justifyContent: 'center',
      flexDirection: 'column'
    },
    input: {
      flex: 1,
      fontSize: 17,
      fontWeight: 'bold',
      color: '#5a52a5',
    },
    infoContainer: {
      position: 'absolute',
      left: 0,
      right: 0,
      height: 370,
      bottom: 25,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 30,
      backgroundColor: '#aa73b7',
    },
    itemStyle: {
      marginBottom: 10,
    },
    iconStyle: {
      color: '#5a52a5',
      fontSize: 28,
      marginLeft: 15
    },
    buttonStyle: {
      alignItems: 'center',
      backgroundColor: '#667292',
      padding: 14,
      marginBottom: 10,
      borderRadius: 24,
    },
    buttonText: {
      fontSize: 18,
      fontWeight: 'bold',
      color: "#fff",
    },
    logoContainer: {
      position: 'absolute',
      left: 0,
      right: 0,
      height: 600,
      bottom: 270,
      alignItems: 'center',
      justifyContent: 'center',
      flex: 1,
    },
    textStyle: {
      padding: 5,
      fontSize: 18
    },
    countryStyle: {
      flex: 1,
      backgroundColor: '#99ff',
      borderTopColor: '#211f',
      borderTopWidth: 1,
      padding: 12,
    },
    closeButtonStyle: {
      flex: 1,
      padding: 12,
      alignItems: 'center', 
      borderTopWidth: 1,
      borderTopColor: '#211f',
      backgroundColor: '#fff3',
    }
  })

  export default styles;