import React, { useEffect, useState } from 'react';
import { FlatList, Image, RefreshControl, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
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

  const [getChatList, { data, refetch, error }] = useLazyQueryWithCancelToken<
    ChatListTypes | undefined
  >(GET_CHAT_LIST, {
    fetchPolicy: 'no-cache'
  });

  const [currentUserData, setCurrentUserData] = useState<UserTypes | null>(null);
  const [chatUser, setChatUser] = useState<GetUser[]>([]);
  const [refreshing, setRefreshing] = useState(false);

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

  /**
   * This function uses to refresh chat list screen
   * */
  const onRefresh = () => {
    setRefreshing(true); // Set refreshing to true when the user pulls to refresh
    refetch();
    setRefreshing(false);
  };

  useEffect(() => {
    error &&
      Toast.show({
        type: 'error',
        text1: Strings.Chat.networkError,
        text2: error?.message
      });
  }, [error]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTextStyle}>{Strings.Chat.messages}</Text>
      </View>
      <FlatList
        data={chatUser}
        renderItem={({ item }) => {
          return <GroupItem item={item} currentUserData={currentUserData} {...props} />;
        }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            colors={['#1e90ff']}
            // Optional: Customize the color of the refresh indicator
            progressBackgroundColor="#fff"
            // Optional: Set the background color of the refresh indicator
            onRefresh={onRefresh}
          />
        }
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
