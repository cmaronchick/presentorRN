import React, { Component } from "react";
import { 
    View,
    Text,
    StyleSheet,
    FlatList
} from "react-native";

import {
    Container,
    Content,
    Item,
    Input,
    Icon,
} from 'native-base'
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
    render() {
        const { navigation } = this.props;
        const presentee = this.state.presentee
        
        //let { presentee } = this.props
        return (
            <View style={styles.container, styles.presenteeContainer}>
                <Text>{presentee.M.firstName.S} {presentee.M.lastName.S}</Text>
                {presentee.M.keyDates ?
                    <FlatList
                        data={presentee.M.keyDates.L.sort((a,b) => {
                            if (a.M.date.S > b.M.date.S) return 1;
                            return -1;
                        })}
                        keyExtractor={(item) => item.M.date.S}
                        renderItem={({item}) => (    
                            <View style={styles.dateRow}><Text>{item.M.name.S}</Text><Text>{new Date(item.M.date.S).getMonth() + 1}/{new Date(item.M.date.S).getDate() + 1}/{new Date(item.M.date.S).getFullYear()}</Text></View>
                        )
                    }
                    />
                    // <AccordionList data={presentee.M.keyDates.L.sort((a,b) => {
                    //             if (a.M.date.S > b.M.date.S) return 1;
                    //             return -1;
                    // })}
                    // />
                :
                    <Text>Add Key Dates</Text>
                }
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