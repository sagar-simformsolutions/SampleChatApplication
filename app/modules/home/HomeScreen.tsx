import React, { type FC } from 'react';
import { Button, Text, View } from 'react-native';
import { ROUTES, Strings } from '../../constants';
import { useTheme } from '../../hooks';
import { ThemeModeEnum } from '../../theme';
import { navigateWithParam } from '../../utils';
import styleSheet from './HomeStyles';

/**
 * The HomeScreen component with two buttons for navigation respected screen.
 * @returns {React.ReactElement} A React element.
 */
const HomeScreen: FC = (): React.ReactElement => {
  const { styles, changeTheme } = useTheme(styleSheet);

  return (
    <View style={styles.screenView}>
      <Text style={styles.textView}>{Strings.Home.homeScreenTitle}</Text>
      <Button title={Strings.Home.details} onPress={() => navigateWithParam(ROUTES.Details)} />
      <Button title={Strings.Home.signIn} onPress={() => navigateWithParam(ROUTES.SignIn)} />
      <Button title={Strings.Home.lightTheme} onPress={() => changeTheme(ThemeModeEnum.light)} />
      <Button title={Strings.Home.darkTheme} onPress={() => changeTheme(ThemeModeEnum.dark)} />
    </View>
  );
};

export default HomeScreen;
