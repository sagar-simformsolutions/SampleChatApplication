import { StyleSheet } from 'react-native';
import {
  ApplicationStyles,
  Colors,
  horizontalScale,
  moderateScale,
  verticalScale,
  type ThemeMode
} from '../../theme';

/**
 * Create a custom style sheet for the given theme.
 * @param {StyleSheetOption} theme - The theme to create the style sheet for.
 * @returns A custom style sheet that can be injected into the component.
 */
const styles = (theme: ThemeMode) =>
  StyleSheet.create({
    ...ApplicationStyles(theme),
    addIcon: {
      height: moderateScale(25),
      marginHorizontal: horizontalScale(5),
      tintColor: Colors.light.green,
      width: moderateScale(25)
    },
    container: { alignItems: 'center', flexDirection: 'row', padding: moderateScale(8) },
    sendButton: {
      backgroundColor: Colors.light.green,
      borderRadius: moderateScale(20),
      padding: moderateScale(8)
    },
    sendText: { color: Colors.light.white },
    textInputMessage: {
      borderColor: Colors.light.green,
      borderRadius: moderateScale(20),
      borderWidth: moderateScale(1),
      flex: 1,
      height: verticalScale(40),
      marginRight: horizontalScale(8),
      paddingHorizontal: horizontalScale(15)
    }
  });

export default styles;
