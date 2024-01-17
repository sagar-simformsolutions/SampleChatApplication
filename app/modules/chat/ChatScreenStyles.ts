/* eslint-disable react-native/no-color-literals */
import { StyleSheet } from 'react-native';
import { Colors, horizontalScale, moderateScale, verticalScale } from '../../theme';

const styles = StyleSheet.create({
  flatlistParent: { backgroundColor: Colors.light.pearlBush, flex: 1 },
  keyboardAvoidingContainer: {
    flex: 1
  },
  message: { margin: moderateScale(10) },
  safeAreaContainer: { backgroundColor: Colors.light.pearlBush, flex: 1 },
  userNameText: { color: Colors.light.pictonBlue, fontWeight: '800' },
  usernameContainer: { marginLeft: horizontalScale(5), marginTop: verticalScale(5) },
  usernameMessageUsername: { color: Colors.light.pictonBlue },
  usernameParent: {
    backgroundColor: 'white',
    borderRadius: moderateScale(15),
    margin: moderateScale(12),
    width: '50%'
  },
  usernameTextParent: {
    alignItems: 'center',
    backgroundColor: Colors.light.gossip,
    borderRadius: moderateScale(25),
    height: moderateScale(50),
    justifyContent: 'center',
    marginLeft: 5,
    width: moderateScale(50)
  }
});

export default styles;
