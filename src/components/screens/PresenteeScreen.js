import React, { Component } from "react";
import { 
    View,
    Text,
    StyleSheet
} from "react-native";

import {
    Container,
    Content,
    Item,
    Input,
    Icon,
} from 'native-base'
import { FlatList } from "react-native-gesture-handler";

class PresenteeScreen extends Component {
    // constructor(props) {
    //     super(props)
    // }

    state = {
        presentee: this.props.presentee
    }
    render() {
        let { presentee } = this.props
        return (
            <View style={styles.container}>
                <Text>{presentee.M.firstName.S} {presentee.M.lastName.S}</Text>
                {presentee.M.keyDates ?
                    <FlatList
                        data={presentee.M.keyDates.L}
                        renderItem={({item}) => <Text>{new Date(item.M.date.N * 1000).getYear()}/{new Date(item.M.date.N * 1000).getMonth()}/{new Date(item.M.date.N * 1000).getYear()} - {item.M.name.S}</Text>}
                    />
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
    }
});