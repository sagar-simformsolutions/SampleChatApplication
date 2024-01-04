import React, { type FC } from 'react';
import { Text, View } from 'react-native';
import { Strings } from '../../constants';
import { useTheme } from '../../hooks';
import styleSheet from './DetailsStyles';

/**
 * A functional component that renders the details screen.
 * @returns {React.ReactElement} A function component that returns a view with a text element.
 */
const DetailScreen: FC = (): React.ReactElement => {
  const { styles } = useTheme(styleSheet);
  return (
    <View style={styles.screenView}>
      <Text style={styles.textView}>{Strings.Details.detailsScreenTitle}</Text>
    </View>
  );
};

export default DetailScreen;
