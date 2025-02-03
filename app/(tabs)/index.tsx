import { useState } from 'react';
import { StyleSheet } from 'react-native';

import EditScreenInfo from '@/components/EditScreenInfo';
import { Text, View } from '@/components/Themed';
import { Input, InputField } from "@/components/ui/input"
import { Button, ButtonText } from '@/components/ui/button';

import auth from '@react-native-firebase/auth';



export default function TabOneScreen() {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleLogin = async () => {
    try {
      await auth().signInWithEmailAndPassword(username, password);
      alert('Login successful');
    } catch (error) {
      alert(error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Presentor!</Text>
      {/* <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <EditScreenInfo path="app/(tabs)/index.tsx" /> */}
      <Input
      variant="outline"
      size="md"
      isDisabled={false}
      isInvalid={false}
      isReadOnly={false}
      
    >
      <InputField placeholder="E-mail Address"
      type='text'
      value={username}
      onChangeText={value => setUsername(value)} />
    </Input>
      <Input
      variant="outline"
      size="md"
      isDisabled={false}
      isInvalid={false}
      isReadOnly={false}
    >
      <InputField placeholder="Password"
      type='password'
      value={password}
      onChangeText={value => setPassword(value)} />
    </Input>
    <Button size="md" variant="solid" action="primary"
    isDisabled={!username || !password}
    onPress={handleLogin}>
      <ButtonText>Log In</ButtonText>
    </Button>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
