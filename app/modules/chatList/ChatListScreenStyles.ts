import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  header: {
    alignItems: 'center',
    borderBottomWidth: 2,
    height: 90,
    justifyContent: 'center'
  },
  innerMessageContainer: {
    flexDirection: 'row',
    marginHorizontal: 15
  },
  messageContainer: {
    borderBottomWidth: 1,
    height: 70,
    justifyContent: 'center'
  }
});

export default styles;
