import React, {useState} from 'react';
import { StyleSheet } from 'react-native';

import { ExternalLink } from './ExternalLink';
import { MonoText } from './StyledText';
import { Text, View } from './Themed';
import { Input, InputField, InputIcon, InputSlot } from "@/components/ui/input"
import { Button, ButtonText } from '@/components/ui/button';
import auth from '@react-native-firebase/auth';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { FontAwesome, Ionicons } from '@expo/vector-icons';

import Colors from '@/constants/Colors';

export default function SignUp({ path }: { path: string }) {
  const [email, setEmail] = useState<string>("");
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  return (
    <VStack>
      <VStack style={styles.inputVStack}>
        <HStack style={styles.inputFieldRow}>
          <Input
            variant="outline"
            size="md"
            isDisabled={false}
            isInvalid={false}
            isReadOnly={false}
            style={styles.inputField}>
            <FontAwesome name="envelope" size={12} color={Colors.light.tint} style={styles.inputIcon} />
            <InputField
              placeholder="E-mail Address"
              type='text'
              value={email}
              onChangeText={value => setEmail(value)} />
          </Input>
        </HStack>
        <HStack style={styles.inputFieldRow}>
          <Input
            variant="outline"
            size="md"
            isDisabled={false}
            isInvalid={false}
            isReadOnly={false}
            style={styles.inputField}>
            <Ionicons name="person" size={12} color={Colors.light.tint} style={styles.inputIcon} />
            <InputField
              placeholder="First Name"
              type='text'
              value={firstName}
              onChangeText={value => setFirstName(value)} />
          </Input>
        </HStack>
        <HStack style={styles.inputFieldRow}>
          <Input
            variant="outline"
            size="md"
            isDisabled={false}
            isInvalid={false}
            isReadOnly={false}
            style={styles.inputField}>
            <Ionicons name="person" size={12} color={Colors.light.tint} style={styles.inputIcon} />
            <InputField
              placeholder="Last Name"
              type='text'
              value={lastName}
              onChangeText={value => setLastName(value)} />
          </Input>
        </HStack>
        <HStack style={styles.inputFieldRow}>
          <Input
            variant="outline"
            size="md"
            isDisabled={false}
            isInvalid={false}
            isReadOnly={false}
            style={styles.inputField}>
            <Ionicons name="lock-closed" size={12} color={Colors.light.tint} style={styles.inputIcon} />
            <InputField
              placeholder="Password"
              type='password'
              value={password}
              onChangeText={value => setPassword(value)} />
          </Input>
        </HStack>
        <HStack style={styles.inputFieldRow}>
          <Input
            variant="outline"
            size="md"
            isDisabled={false}
            isInvalid={false}
            isReadOnly={false}
            style={styles.inputField}>
            <Ionicons name="lock-closed" size={12} color={Colors.light.tint} style={styles.inputIcon} />
            <InputField
              placeholder="Confirm Password"
              type='password'
              value={confirmPassword}
              onChangeText={value => setConfirmPassword(value)} />
          </Input>
        </HStack>
        <Button>
          <ButtonText>Sign Up</ButtonText>
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
    </VStack>
  );
}

const styles = StyleSheet.create({
  inputVStack: {
    alignItems: 'flex-start',
    justifyContent: 'center',
    marginHorizontal: 50,
  },
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
  inputFieldRow: {
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 3,
    paddingHorizontal: 5
  },
  inputField: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start'
  },
  inputIcon: {
    marginRight: 10
  }
});
