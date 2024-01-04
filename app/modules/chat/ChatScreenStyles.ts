/* eslint-disable react-native/no-color-literals */
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  flatlistParent: { backgroundColor: '#ece5dd', flex: 1 },
  message: { margin: 10 },
  safeAreaContainer: { flex: 1 },
  sendButton: { backgroundColor: 'blue', padding: 8 },
  sendText: { color: 'white' },
  textInputMessage: {
    borderColor: 'gray',
    borderWidth: 1,
    flex: 1,
    height: 40,
    marginRight: 8
  },
  userNameText: { color: '#34b7f1', fontWeight: '800' },
  usernameContainer: { marginLeft: 5, marginTop: 5 },
  usernameMessageUsername: { color: '#34b7f1' },
  usernameParent: {
    backgroundColor: 'white',
    borderRadius: 15,
    margin: 12,
    width: '50%'
  },
  usernameTextParent: {
    alignItems: 'center',
    backgroundColor: '#dcf8c6',
    borderRadius: 25,
    height: 50,
    justifyContent: 'center',
    marginLeft: 5,
    width: 50
  }
});

export default styles;
