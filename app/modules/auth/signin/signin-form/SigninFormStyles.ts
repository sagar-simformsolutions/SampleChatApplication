import { StyleSheet } from 'react-native';
import {
  ApplicationStyles,
  Colors,
  horizontalScale,
  moderateScale,
  verticalScale,
  type ThemeMode
} from '../../../../theme';

/**
 * A StyleSheet object that contains all of the sign in form styles.
 * @param {ThemeMode} theme - The theme to use for the styles.
 * @returns {StyleSheet} A StyleSheet object containing all of the sign in form styles.
 */
const styles = (theme: ThemeMode) =>
  StyleSheet.create({
    ...ApplicationStyles(theme),
    button: {
      alignItems: 'center',
      backgroundColor: Colors.light.green,
      borderRadius: moderateScale(5),
      height: verticalScale(45),
      justifyContent: 'center'
    },
    buttonText: {
      color: Colors[theme]?.white,
      fontSize: moderateScale(18),
      fontWeight: 'bold'
    },
    buttonView: {
      marginVertical: verticalScale(20),
      paddingHorizontal: horizontalScale(50),
      width: '100%'
    },
    container: {
      alignItems: 'center',
      paddingTop: verticalScale(70)
    },
    disabledButton: {
      backgroundColor: Colors[theme]?.gray
    },
    errorMsg: {
      color: Colors[theme]?.red,
      fontSize: moderateScale(14),
      marginBottom: verticalScale(20)
    },
    footerText: {
      color: Colors.light.black,
      textAlign: 'center'
    },
    forgetText: {
      color: Colors.light.green,
      fontSize: 11
    },
    formContainer: {
      flex: 1,
      paddingHorizontal: horizontalScale(20),
      paddingTop: verticalScale(50)
    },
    icons: {
      height: moderateScale(40),
      width: moderateScale(40)
    },
    image: {
      height: verticalScale(160),
      width: horizontalScale(170)
    },
    input: {
      borderColor: Colors.light.green,
      borderRadius: moderateScale(7),
      borderWidth: moderateScale(1),
      height: verticalScale(50),
      paddingHorizontal: horizontalScale(20)
    },
    inputView: {
      gap: moderateScale(15),
      marginBottom: verticalScale(5),
      paddingHorizontal: horizontalScale(40),
      width: '100%'
    },
    mediaIcons: {
      alignItems: 'center',
      flexDirection: 'row',
      gap: moderateScale(15),
      justifyContent: 'center',
      marginBottom: verticalScale(23)
    },
    optionsText: {
      color: Colors.light.green,
      fontSize: moderateScale(13),
      marginBottom: verticalScale(6),
      paddingVertical: verticalScale(10),
      textAlign: 'center'
    },
    rememberText: {
      fontSize: moderateScale(13),
      marginHorizontal: horizontalScale(10)
    },
    rememberView: {
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: verticalScale(8),
      marginVertical: verticalScale(10),
      paddingHorizontal: horizontalScale(50),
      width: '100%'
    },
    signup: {
      color: Colors.light.green,
      fontSize: moderateScale(13),
      marginLeft: horizontalScale(20)
    },
    switch: {
      alignItems: 'center',
      flexDirection: 'row',
      gap: 1,
      justifyContent: 'center'
    },
    textInput: {
      backgroundColor: Colors[theme]?.black,
      borderRadius: horizontalScale(5),
      color: Colors[theme]?.white,
      fontSize: moderateScale(16),
      paddingHorizontal: horizontalScale(10),
      paddingVertical: verticalScale(10)
    },
    title: {
      color: Colors.light.green,
      fontSize: moderateScale(30),
      fontWeight: 'bold',
      paddingVertical: verticalScale(40),
      textAlign: 'center',
      textTransform: 'uppercase'
    }
  });

export default styles;
