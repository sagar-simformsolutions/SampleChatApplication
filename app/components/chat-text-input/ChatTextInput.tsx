import * as React from 'react';
import { Image, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Images } from '../../assets';
import { Strings } from '../../constants';
import { useTheme } from '../../hooks';
import { Colors } from '../../theme';
import chatTextInputStyles from './ChatTextInputStyles';

interface ChatTextInputProps {
  newMessage: string;
  setNewMessage: (text: string) => void;
  handleSend: () => void;
}

/**
 * Component to render TextInput
 */
const ChatTextInput = (props: ChatTextInputProps) => {
  const { styles } = useTheme(chatTextInputStyles);
  const { newMessage, setNewMessage, handleSend } = props;
  return (
    <View style={styles.container}>
      <TouchableOpacity>
        <Image source={Images.addIcon} style={styles.addIcon} />
      </TouchableOpacity>
      <TextInput
        style={styles.textInputMessage}
        value={newMessage}
        selectionColor={Colors.light.green}
        onChangeText={(text) => setNewMessage(text)}
      />
      <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
        <Text style={styles.sendText}>{Strings.Chat.send}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ChatTextInput;
