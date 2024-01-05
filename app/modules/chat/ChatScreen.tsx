/* eslint-disable react-native/no-inline-styles */
import { useSubscription } from '@apollo/client';
import React, { useEffect, useState } from 'react';
import { FlatList, SafeAreaView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { CREATE_MESSAGE, GET_CHAT_MESSAGES } from '../../graphql';
import { ON_CHAT_UPDATE } from '../../graphql/subscriptions/ChatSubscriptions';
import { useMutationWithCancelToken } from '../../hooks';
import { getToken } from '../../utils/utils';
import styles from './ChatScreenStyles';

interface ChatScreenProps {
  route?: {
    params: {
      id: string;
      currentUserId: string;
    };
  };
}

interface Messages {
  id?: string;
  content: {
    message: string;
    senderId: string;
  };
  from: {
    id: string;
    username: string;
  };
  text: string;
}

/**
 * A functional component that renders the Chat  screen.
 * @returns {React.ReactElement} A function component that returns a view with a text element.
 */
const ChatScreen = ({ ...props }: ChatScreenProps): React.ReactElement => {
  const [newMessage, setNewMessage] = useState<string>('');
  const [messages, setMessages] = useState<Messages[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string>('');
  const [currentUserName, setCurrentUserName] = useState<string>('');
  const [chatId, setChatId] = useState<string>('');
  const [getMessages, { data }] = useMutationWithCancelToken(GET_CHAT_MESSAGES);
  const subscribeData: any = useSubscription(ON_CHAT_UPDATE, {
    variables: { chatId: chatId }
  });

  const [createMessage] = useMutationWithCancelToken(CREATE_MESSAGE);

  /**
   * Function returns user details
   */
  const handleGetUser = async () => {
    const userData: any = await getToken();
    const getUserId = JSON.parse(userData)?.user?.id;
    const getUserName = JSON.parse(userData)?.user?.name;
    setCurrentUserName(getUserName);
    setCurrentUserId(getUserId);
  };

  useEffect(() => {
    const reversedData = data?.getChatId?.message ? data?.getChatId?.message?.reverse() : [];
    setChatId(data?.getChatId?.id);
    setMessages(reversedData);
  }, [data]);

  useEffect(() => {
    setMessages([
      {
        content: subscribeData?.data?.newMessage?.content,
        from: subscribeData?.data?.newMessage?.from,
        text: subscribeData?.data?.newMessage?.content?.message
      },
      ...messages
    ]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subscribeData?.data]);

  /**
   * Function to handle send message
   */
  const handleSend = () => {
    if (newMessage.length === 0) {
      return;
    }
    createMessage({
      variables: {
        userIds: [currentUserId, props?.route?.params?.id],
        content: {
          message: newMessage,
          senderId: currentUserId
        }
      }
    });

    setMessages(
      [
        ...messages,
        {
          content: {
            message: newMessage,
            senderId: currentUserId
          },
          from: { id: currentUserId, username: currentUserName },
          text: newMessage
        }
      ]?.reverse()
    );
    setNewMessage('');
  };

  useEffect(() => {
    const sendChatUserId = props?.route?.params?.id;
    const currentUserIdParams = props?.route?.params?.currentUserId;
    handleGetUser();
    getMessages({
      variables: {
        userIds: [sendChatUserId, currentUserIdParams]
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * Function renders react component
   */
  const renderItem = ({ item }: any) => {
    const isCurrentUser = item?.content?.senderId === currentUserId;

    return (
      <View
        style={{
          flexDirection: isCurrentUser ? 'row-reverse' : 'row',
          alignItems: 'center'
        }}
      >
        <View style={styles.usernameTextParent}>
          <Text style={styles.userNameText}>{item?.from?.username?.[0]}</Text>
        </View>
        <View style={styles.usernameParent}>
          <View style={styles.usernameContainer}>
            <Text style={styles.usernameMessageUsername}> {item?.from?.username}</Text>
          </View>
          <Text style={styles.message}>{item?.content?.message}</Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeAreaContainer}>
      <View style={styles.flatlistParent}>
        <FlatList
          inverted // To display the latest message at the bottom
          data={messages ?? []}
          renderItem={renderItem}
          keyExtractor={(item, index) => item?.id?.toString() ?? `${index}`}
        />
        <View style={{ flexDirection: 'row', alignItems: 'center', padding: 8 }}>
          <TextInput
            style={styles.textInputMessage}
            placeholder="Type a message..."
            value={newMessage}
            onChangeText={(text) => setNewMessage(text)}
          />
          <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
            <Text style={styles.sendText}>Send</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ChatScreen;
