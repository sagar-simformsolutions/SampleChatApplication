import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import { AppConst, ROUTES } from '../constants';
import { useTheme } from '../hooks';
import { SigninScreen } from '../modules';
import ChatScreen from '../modules/chat/ChatScreen';
import ChatListScreen from '../modules/chatList/ChatListScreen';
import { Colors } from '../theme';
import { getLinkConfiguration, navigationRef } from '../utils';
import { getToken } from '../utils/utils';

/**
 * The type of the navigation prop for the RootStack.
 * @typedef {object} RootStackParamList is an object type with keys that are the route names
 * and values that are the route params
 * @property {undefined} [Home] - The Home screen.
 * @property {undefined} [Details] - The Details screen.
 * @property {undefined} [SignIn] - The SignIn screen.
 */
// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
type RootStackParamList = {
  // add types for route params here e.g. -
  // [ROUTES.Profile]: { id: string };
  [ROUTES.Home]: undefined;
  [ROUTES.Details]: undefined;
  [ROUTES.SignIn]: { setUser?: any };
  [ROUTES.ChatListScreen]: { setUser?: any };
  [ROUTES.ChatScreen]: undefined;
};

/**
 * Creating a stack navigator with the type of RootStackParamList.
 * @returns {StackNavigator} - The root stack navigator.
 */
const RootStack = createNativeStackNavigator<RootStackParamList>();

/**
 * Initializes the React Navigation DevTools.
 * @returns None
 */
function InitializeReactNavigationDevTools(): void {
  const { useFlipper, useReduxDevToolsExtension } = require('@react-navigation/devtools');
  useFlipper(navigationRef);
  useReduxDevToolsExtension(navigationRef);
}

/**
 * The main App container.
 * @returns {React.ReactNode} The main App container.
 */
const AppContainer = () => {
  const { theme, isDark } = useTheme();
  const [user, setUser] = useState<Boolean>(false);
  if (AppConst.isDevelopment) {
    InitializeReactNavigationDevTools();
  }

  /**
   * Function to check whether user is logged in or not
   */
  const handleUser = async () => {
    const rawData = await getToken();
    const data = JSON.parse(rawData);

    if (data?.user) {
      setUser(data);
    }
  };

  useEffect(() => {
    handleUser();
  }, []);

  return (
    <NavigationContainer
      ref={navigationRef}
      linking={getLinkConfiguration()}
      theme={{
        dark: isDark,
        colors: {
          primary: Colors[theme]?.black,
          background: Colors[theme]?.white,
          card: Colors[theme]?.white,
          text: Colors[theme]?.black,
          border: Colors[theme]?.black,
          notification: Colors[theme]?.white
        }
      }}
    >
      <RootStack.Navigator>
        {!user && (
          <RootStack.Screen
            name={ROUTES.SignIn}
            component={SigninScreen}
            initialParams={{ setUser }}
            options={{ headerShown: false, headerBackTitleVisible: false }}
          />
        )}
        <RootStack.Screen
          name={ROUTES.ChatListScreen}
          component={ChatListScreen}
          initialParams={{ setUser }}
          options={{ headerShown: false, headerBackTitleVisible: false }}
        />
        <RootStack.Screen
          name={ROUTES.ChatScreen}
          component={ChatScreen}
          options={{ headerBackTitleVisible: false }}
        />
      </RootStack.Navigator>
    </NavigationContainer>
  );
};

export default AppContainer;
