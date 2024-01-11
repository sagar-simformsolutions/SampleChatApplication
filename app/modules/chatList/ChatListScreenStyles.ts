import { StyleSheet } from 'react-native';
import { Fonts } from '../../assets';
import { Colors, horizontalScale, moderateScale, verticalScale } from '../../theme';

const styles = StyleSheet.create({
  buttonContainer: {
    paddingHorizontal: horizontalScale(20),
    paddingVertical: verticalScale(5)
  },
  container: {
    backgroundColor: Colors.light.white,
    flex: 1
  },
  header: {
    height: 70,
    justifyContent: 'center'
  },
  headerTextStyle: {
    fontFamily: Fonts.regular,
    fontSize: moderateScale(30),
    marginHorizontal: 15
  },
  innerMessageContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    marginHorizontal: 15
  },
  logoutContainer: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  logoutText: {
    color: Colors.light.green,
    fontFamily: Fonts.regular,
    fontSize: moderateScale(20)
  },
  messageContainer: {
    // borderBottomWidth: StyleSheet.hairlineWidth,
    height: 70,
    justifyContent: 'center'
  },
  profilePicParent: {},
  userName: {
    fontFamily: Fonts.italic,
    fontSize: moderateScale(18),
    marginHorizontal: horizontalScale(15)
  },
  userProfileImage: {
    borderRadius: moderateScale(30),
    height: moderateScale(50),
    width: moderateScale(50)
  }
});

export default styles;
