import React, { useEffect, useState } from 'react';
import { FlatList, Image, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MMKVKeys, ROUTES, Strings } from '../../constants';
import { GET_CHAT_LIST } from '../../graphql';
import { useLazyQueryWithCancelToken } from '../../hooks';
import { getStorageString, storage } from '../../services';
import { navigateWithParam } from '../../utils';
import styles from './ChatListScreenStyles';

interface GroupItemTypes {
  item: { id?: string; name?: string };
  currentUserData: {
    user: {
      id: string;
      name?: string;
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
          currentUserId: props.currentUserData?.user?.id,
          chatNamePerson: item
        });
      }}
    >
      <View style={styles.innerMessageContainer}>
        <View style={styles.profilePicParent}>
          <Image
            source={{
              uri: 'https://www.rattanhospital.in/wp-content/uploads/2020/03/user-dummy-pic.png'
            }}
            style={styles.userProfileImage}
          />
        </View>
        <Text style={styles.userName}>{item?.name}</Text>
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

interface ChatListProps {
  route?: { params?: { setUser?: Function } };
}

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
  const { setUser = () => {} } = props.route?.params ?? {};

  const [getChatList, { data }] = useLazyQueryWithCancelToken<ChatListTypes | undefined>(
    GET_CHAT_LIST,
    {
      fetchPolicy: 'no-cache'
    }
  );

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

  /**
   *  function to handle logout
   *
   */
  const handleLogout = async () => {
    await storage.clearAll();
    await setUser?.(false);
    navigateWithParam(ROUTES.SignIn);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTextStyle}>Messages</Text>
      </View>
      <FlatList
        data={chatUser}
        renderItem={({ item }) => {
          return <GroupItem item={item} currentUserData={currentUserData} {...props} />;
        }}
      />

      <View style={styles.logoutContainer}>
        <TouchableOpacity style={styles.buttonContainer} onPress={handleLogout}>
          <Text style={styles.logoutText}>{Strings.Auth.logout}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default ChatList;
