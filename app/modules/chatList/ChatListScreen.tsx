import { useLazyQuery } from '@apollo/client';
import React, { useEffect, useState } from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MMKVKeys, ROUTES } from '../../constants';
import { GET_CHAT_LIST } from '../../graphql';
import { getStorageString } from '../../services';
import { navigateWithParam } from '../../utils';
import styles from './ChatListScreenStyles';

interface GroupItemTypes {
  item: { id?: string; name?: string };
  currentUserData: {
    user: {
      id: string;
    };
  } | null;
}

/**
 * A functional component that renders the GroupItem component.
 * @returns {React.ReactElement} A function component that returns a view with a text element.
 */
const GroupItem = ({ item, ...props }: GroupItemTypes) => {
  return (
    <TouchableOpacity
      style={styles.messageContainer}
      onPress={() => {
        navigateWithParam(ROUTES.ChatScreen, {
          id: item?.id,
          currentUserId: props.currentUserData?.user?.id
        });
      }}
    >
      <View style={styles.innerMessageContainer}>
        <Text>{item?.name}</Text>
      </View>
    </TouchableOpacity>
  );
};

interface GetUser {
  id?: string;
  name?: string;
  item?: {
    id?: string;
  };
}

interface ChatListTypes {
  getUser: GetUser[] | [];
}

interface ChatListProps {}

interface UserTypes {
  user: {
    id: string;
  };
}

/**
 * A functional component that renders the ChatList screen.
 * @returns {React.ReactElement} A function component that returns a view with a text element.
 */
const ChatList = ({ ...props }: ChatListProps) => {
  const [getChatList, { data }] = useLazyQuery<ChatListTypes | undefined>(GET_CHAT_LIST);
  const [currentUserData, setCurrentUserData] = useState<UserTypes | null>(null);
  const [chatUser, setChatUser] = useState<GetUser[]>([]);

  /**
   * A functional method to handle current user
   */
  const handleCurrentUser = async () => {
    const user: UserTypes = JSON.parse(getStorageString(MMKVKeys.loginDetail, '{}'));
    const filterData: GetUser[] | undefined =
      data?.getUser?.filter((item) => item?.id !== user?.user?.id) ?? [];
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
