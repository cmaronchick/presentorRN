import React, {useEffect, useState} from 'react';
import { StyleSheet } from 'react-native';

import { ExternalLink } from './ExternalLink';
import { MonoText } from './StyledText';
import { Text, View } from './Themed';
import { Input, InputField, InputIcon, InputSlot } from "@/components/ui/input"
import { Button, ButtonSpinner, ButtonText } from '@/components/ui/button';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore'
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { FontAwesome, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

import Colors from '@/constants/Colors';
import { Spinner } from './ui/spinner';
import Styles from '@/constants/Styles';

interface SignUpError {
  code: string;
  message: string;
}

export default function SignUp({ path }: { path: string }) {
  const [email, setEmail] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [isComplete, setIsComplete] = useState<boolean>(false);
  const [signUpError, setSignUpError] = useState<SignUpError>({ code: '', message: '' }); 

  useEffect(() => {
    function validateEmail(email: string): boolean {
      const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      return re.test(email);
    }
    if (email && firstName && lastName && password && confirmPassword && password === confirmPassword && validateEmail(email)) {
      setIsComplete(true);
    }
  }, [firstName, lastName, email, password, confirmPassword]);
  const handleSignUp = async () => {
    console.log('button clicked :>> ');
    if (isComplete) {
      try {
        setLoading(true);
        const userCredential = await auth().createUserWithEmailAndPassword(
          email, 
          password
        );
        console.log('userCredential :>> ', userCredential);
        await userCredential.user?.updateProfile({
          displayName: username
        });

        await firestore().collection('users').add({
          uid: userCredential.user?.uid,
          email: userCredential.user?.email,
          username: username,
          firstName,
          lastName
        });
        //doc() 

      } catch(error: any) {
          if (error.code === 'auth/email-already-in-use') {
            console.log('That email address is already in use!');
            setSignUpError({ code: error.code, message: 'That email address is already in use!'});
          }
      
          if (error.code === 'auth/invalid-email') {
            console.log('That email address is invalid!');
            setSignUpError({code: error.code, message: 'That email address is invalid!'});
          }
      
          console.error(error);
        } finally {
          setLoading(false);
        }
    }
  }


  return (
    <VStack>
      <VStack style={Styles.InputVStack}>
        <HStack style={Styles.InputFieldRow}>
          <Input
            variant="outline"
            size="md"
            isDisabled={false}
            isInvalid={false}
            isReadOnly={false}
            style={Styles.InputField}>
            <FontAwesome name="envelope" size={12} color={Colors.light.tint} style={Styles.InputIcon} />
            <InputField
              placeholder="E-mail Address"
              type='text'
              value={email}
              onChangeText={value => setEmail(value.toLocaleLowerCase())} />
          </Input>
        </HStack>
        <HStack style={Styles.InputFieldRow}>
          <Input
            variant="outline"
            size="md"
            isDisabled={false}
            isInvalid={false}
            isReadOnly={false}
            style={Styles.InputField}>
            <MaterialCommunityIcons name="account-box" size={12} color={Colors.light.tint} style={Styles.InputIcon} />
            <InputField
              placeholder="Username"
              type='text'
              value={username}
              onChangeText={value => setUsername(value.toLocaleLowerCase())} />
          </Input>
        </HStack>
        <HStack style={Styles.InputFieldRow}>
          <Input
            variant="outline"
            size="md"
            isDisabled={false}
            isInvalid={false}
            isReadOnly={false}
            style={Styles.InputField}>
            <Ionicons name="person" size={12} color={Colors.light.tint} style={Styles.InputIcon} />
            <InputField
              placeholder="First Name"
              type='text'
              value={firstName}
              onChangeText={value => setFirstName(value)} />
          </Input>
        </HStack>
        <HStack style={Styles.InputFieldRow}>
          <Input
            variant="outline"
            size="md"
            isDisabled={false}
            isInvalid={false}
            isReadOnly={false}
            style={Styles.InputField}>
            <Ionicons name="person" size={12} color={Colors.light.tint} style={Styles.InputIcon} />
            <InputField
              placeholder="Last Name"
              type='text'
              value={lastName}
              onChangeText={value => setLastName(value)} />
          </Input>
        </HStack>
        <HStack style={Styles.InputFieldRow}>
          <Input
            variant="outline"
            size="md"
            isDisabled={false}
            isInvalid={false}
            isReadOnly={false}
            style={Styles.InputField}>
            <Ionicons name="lock-closed" size={12} color={Colors.light.tint} style={Styles.InputIcon} />
            <InputField
              placeholder="Password"
              type='password'
              value={password}
              onChangeText={value => setPassword(value)} />
          </Input>
        </HStack>
        <HStack style={Styles.InputFieldRow}>
          <Input
            variant="outline"
            size="md"
            isDisabled={false}
            isInvalid={false}
            isReadOnly={false}
            style={Styles.InputField}>
            <Ionicons name="lock-closed" size={12} color={Colors.light.tint} style={Styles.InputIcon} />
            <InputField
              placeholder="Confirm Password"
              type='password'
              value={confirmPassword}
              onChangeText={value => setConfirmPassword(value)} />
          </Input>
        </HStack>
        <Button
          variant="solid"
          onPress={handleSignUp}
          isDisabled={!isComplete || loading}
          style={Styles.Button}
          >
          
          {loading ? (<Spinner
          
            color={Colors.dark.tint}
            size={20} />) : (
              <ButtonText style={Styles.ButtonText}>Sign Up</ButtonText>
            )}
        </Button>
        {/* <View
          style={[styles.codeHighlightContainer, styles.homeScreenFilename]}
          darkColor="rgba(255,255,255,0.05)"
          lightColor="rgba(0,0,0,0.05)">
          <MonoText>{path}</MonoText>
        </View>

        <Text
          style={styles.getStartedText}
          lightColor="rgba(0,0,0,0.8)"
          darkColor="rgba(255,255,255,0.8)">
          Change any of the text, save the file, and your app will automatically update.
        </Text>

      <View style={styles.helpContainer}>
        <ExternalLink
          style={styles.helpLink}
          href="https://docs.expo.io/get-started/create-a-new-app/#opening-the-app-on-your-phonetablet">
          <Text style={styles.helpLinkText} lightColor={Colors.light.tint}>
            Tap here if your app doesn't automatically update after making changes
          </Text>
        </ExternalLink>
      </View> */}
        </VStack>
        {signUpError.code !== '' && (<Text darkColor='red'>{signUpError.message}</Text>)}
    </VStack>
  );
}

const localstyles = StyleSheet.create({
  homeScreenFilename: {
    marginVertical: 7,
  },
  codeHighlightContainer: {
    borderRadius: 3,
    paddingHorizontal: 4,
  },
  getStartedText: {
    fontSize: 17,
    lineHeight: 24,
    textAlign: 'center',
  },
  helpContainer: {
    marginTop: 15,
    marginHorizontal: 20,
    alignItems: 'center',
  },
  helpLink: {
    paddingVertical: 15,
  },
  helpLinkText: {
    textAlign: 'center',
  },
});
