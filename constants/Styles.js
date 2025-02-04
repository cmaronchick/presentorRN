import { StyleSheet } from 'react-native';
import Colors from './Colors';

const styles = StyleSheet.create({
    InputVStack: {
        alignItems: 'flex-start',
        justifyContent: 'center',
        marginHorizontal: 50,
    },
    InputField: {
        padding: 3,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start'
    },
    InputText: {
        fontSize: 12
    },
    InputTextError: {
        fontSize: 12,
        color: 'red'
    },
    InputFieldRow: {
        alignItems: 'center',
        justifyContent: 'space-between',
        marginVertical: 3,
        paddingHorizontal: 5
    },
    InputIcon: {
        marginRight: 10
    },
    Button: {
        backgroundColor: Colors.light.tint,
        borderRadius: 5,
        padding: 10,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10
    },
    ButtonText: {
        color: Colors.dark.tint,
        fontSize: 16,
        fontWeight: '700',
    }
});

export default styles;