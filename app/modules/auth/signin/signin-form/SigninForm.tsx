import React, { useState } from 'react';
import { Alert, Image, Pressable, Switch, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Icons } from '../../../../assets';
import { Strings } from '../../../../constants';
import { useTheme } from '../../../../hooks';
import { Colors } from '../../../../theme';
import styleSheet from './SigninFormStyles';
import type { SigninFormPropsType } from './SigninFormTypes';

/**
 * The sign in form component.
 * @param {SigninFormPropsType} props - The props for the sign in form.
 * @returns A sign in form component.
 */
export default function SigninForm({
  handleSubmit,
  handleChange,
  values,
  errors
}: SigninFormPropsType): React.ReactElement {
  const { styles } = useTheme(styleSheet);
  const inputPasswordRef: React.LegacyRef<TextInput> = React.createRef();
  const fieldErrorEmail: string | undefined = values.email?.length ?? 0 ? errors.email : '';
  const fieldErrorPassword: string | undefined =
    values.password?.length ?? 0 ? errors.password : '';
  const [click, setClick] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>{Strings.Auth.login}</Text>
      <View style={styles.inputView}>
        <TextInput
          autoFocus
          cursorColor={Colors?.light?.green}
          autoCapitalize="none"
          returnKeyType="next"
          keyboardType="email-address"
          selectionColor={Colors?.light?.green}
          underlineColorAndroid="transparent"
          placeholder={Strings.Auth.hintEmail}
          style={styles.input}
          onChangeText={handleChange('email')}
          onSubmitEditing={() => {
            inputPasswordRef.current?.focus();
          }}
        />
        {fieldErrorEmail && <Text style={styles.errorMsg}>{fieldErrorEmail}</Text>}
        <TextInput
          secureTextEntry
          autoCapitalize="none"
          ref={inputPasswordRef}
          returnKeyType="done"
          keyboardType="default"
          cursorColor={Colors?.light?.green}
          selectionColor={Colors?.light?.green}
          underlineColorAndroid="transparent"
          placeholder={Strings.Auth.hintPassword}
          style={styles.input}
          onChangeText={handleChange('password')}
          onSubmitEditing={() => {
            handleSubmit();
          }}
        />
        {fieldErrorPassword && <Text style={styles.errorMsg}>{fieldErrorPassword}</Text>}
      </View>
      <View style={styles.rememberView}>
        <View style={styles.switch}>
          <Switch
            value={click}
            trackColor={{ true: 'green', false: 'gray' }}
            onValueChange={setClick}
          />
          <Text style={styles.rememberText}>{Strings.Auth.rememberMe}</Text>
        </View>
        <View>
          <Pressable onPress={() => Alert.alert('Forget Password!')}>
            <Text style={styles.forgetText}>{Strings.Auth.forgotPassword}</Text>
          </Pressable>
        </View>
      </View>
      <View style={styles.buttonView}>
        <Pressable style={styles.button} onPress={() => handleSubmit()}>
          <Text style={styles.buttonText}>{Strings.Auth.login}</Text>
        </Pressable>
        <Text style={styles.optionsText}>{Strings.Auth.loginWith}</Text>
      </View>
      <View style={styles.mediaIcons}>
        <Image source={Icons.facebook} style={styles.icons} />
        <Image source={Icons.linkedIn} style={styles.icons} />
      </View>
      <Text style={styles.footerText}>
        {Strings.Auth.dontHaveAccount}
        <Text style={styles.signup}>{Strings.Auth.signUp}</Text>
      </Text>
    </SafeAreaView>
  );
}
