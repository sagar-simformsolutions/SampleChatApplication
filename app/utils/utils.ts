import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * A functional component that return token function
 */
const getToken = async () => {
  const tokenRaw = await AsyncStorage.getItem('loginKey');

  if (tokenRaw) {
    return tokenRaw;
  }
  return null;
};

export { getToken };
