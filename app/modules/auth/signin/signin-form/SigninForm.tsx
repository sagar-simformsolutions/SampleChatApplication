import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { CustomButton } from '../../../../components';
import { ROUTES, Strings } from '../../../../constants';
import { LOGIN } from '../../../../graphql';
import { useMutationWithCancelToken, useTheme } from '../../../../hooks';
import { Colors } from '../../../../theme';
import { navigateWithParam } from '../../../../utils';
import styleSheet from './SigninFormStyles';
import { isRemainingToFillForm } from './SigninFormUtils';
import type { SigninFormPropsType } from './SigninFormTypes';

/**
 * The sign in form component.
 * @param {SigninFormPropsType} props - The props for the sign in form.
 * @returns A sign in form component.
 */
export default function SigninForm({
  handleChange,
  values,
  errors
}: SigninFormPropsType): React.ReactElement {
  const { styles, theme } = useTheme(styleSheet);
  const inputPasswordRef: React.LegacyRef<TextInput> = React.createRef();
  const disabled: boolean = isRemainingToFillForm(values, errors);
  const fieldErrorEmail: string | undefined = values.email?.length ?? 0 ? errors.email : '';
  const fieldErrorPassword: string | undefined =
    values.password?.length ?? 0 ? errors.password : '';
  const [login, { data, loading }] = useMutationWithCancelToken(LOGIN);
  const [view] = useState('login');

  /**
   * this function handle auth actions
   */
  const handleAuthAction = async () => {
    if (view === 'login') {
      login({
        variables: {
          email: values?.email,
          password: values?.password
        }
      })
        .then(() => {})
        .catch(() => {});
    }
  };

  /**
   * this function handle auth actions login credentials
   */
  const handleLoginCreds = async (loginCred: any) => {
    await AsyncStorage.setItem('loginKey', JSON.stringify(loginCred)).then(() => {
      navigateWithParam(ROUTES.ChatListScreen);
    });
  };

  useEffect(() => {
    if (data?.login) {
      handleLoginCreds(data?.login);
    }
  }, [data?.login]);

  return (
    <View style={styles.formContainer}>
      <TextInput
        autoFocus
        autoCapitalize="none"
        returnKeyType="next"
        keyboardType="email-address"
        selectionColor={Colors[theme]?.white}
        placeholderTextColor={Colors[theme]?.white}
        underlineColorAndroid="transparent"
        placeholder={Strings.Auth.hintEmail}
        style={styles.textInput}
        onChangeText={handleChange('email')}
        onSubmitEditing={() => {
          inputPasswordRef.current?.focus();
        }}
      />
      <Text style={styles.errorMsg}>{fieldErrorEmail}</Text>
      <TextInput
        secureTextEntry
        autoCapitalize="none"
        ref={inputPasswordRef}
        returnKeyType="done"
        keyboardType="default"
        selectionColor={Colors[theme]?.white}
        placeholderTextColor={Colors[theme]?.white}
        underlineColorAndroid="transparent"
        placeholder={Strings.Auth.hintPassword}
        style={styles.textInput}
        onChangeText={handleChange('password')}
        onSubmitEditing={() => {
          handleAuthAction();
          // handleSubmit();
        }}
      />
      <Text style={styles.errorMsg}>{fieldErrorPassword}</Text>
      <CustomButton
        buttonContainer={StyleSheet.flatten([styles.buttonContainer, styles.buttonTopMargin])}
        buttonStyle={StyleSheet.flatten([styles.spinnerButton, styles.button])}
        disableStyle={styles.disabledButton}
        loaderColor={Colors[theme]?.white}
        disabled={disabled}
        isLoading={loading}
        buttonText={Strings.Auth.btnSignIn}
        onPress={handleAuthAction}
      />
    </View>
  );
}
