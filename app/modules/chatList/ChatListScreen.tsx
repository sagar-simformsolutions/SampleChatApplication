import { useLazyQuery } from '@apollo/client';

import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ROUTES } from '../../constants';
import { GET_CHAT_LIST } from '../../graphql';
import { navigateWithParam } from '../../utils';
import styles from './ChatListScreenStyles';

/**
 * A functional component that renders the GroupItem screen.
 * @returns {React.ReactElement} A function component that returns a view with a text element.
 */
const GroupItem = ({ item, ...props }: any) => {
  return (
    <TouchableOpacity
      style={styles.messageContainer}
      onPress={() => {
        navigateWithParam(ROUTES.ChatScreen, {
          id: item?.id,
          currentUserId: props.currentUserData?.user?.id
        });

        // props?.navigation.navigate('Chat', {
        //   id: item?.id,
        //   currentUserId: props.currentUserData?.user?.id
        // });
      }}
    >
      <View style={styles.innerMessageContainer}>
        <Text>{item?.name}</Text>
      </View>
    </TouchableOpacity>
  );
};

/**
 * A functional component that renders the ChatList screen.
 * @returns {React.ReactElement} A function component that returns a view with a text element.
 */
const ChatList = ({ ...props }: any) => {
  const [getChatList, { data }] = useLazyQuery(GET_CHAT_LIST);
  const [currentUserData, setCurrentUserData] = useState(null);
  const [chatUser, setChatUser] = useState([]);

  /**
   * A functional method to handle current user
   */
  const handleCurrentUser = async () => {
    const user: any = JSON.parse((await AsyncStorage.getItem('loginKey')) ?? '');
    const filterData = data?.getUser?.filter((item: any) => item?.id !== user?.user?.id);
    setChatUser(filterData);
    setCurrentUserData(user);
  };

  useEffect(() => {
    getChatList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    handleCurrentUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text>Chats </Text>
      </View>
      <FlatList
        data={chatUser}
        renderItem={({ item }) => {
          return <GroupItem item={item} currentUserData={currentUserData} {...props} />;
        }}
      />
    </SafeAreaView>
  );
};

export default ChatList;
