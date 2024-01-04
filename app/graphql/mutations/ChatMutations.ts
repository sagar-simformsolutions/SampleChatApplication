import { gql } from '@apollo/client';

export const CREATE_MESSAGE = gql`
  mutation SendMessage($userIds: [String], $content: Contents) {
    sendMessage(userIds: $userIds, content: $content) {
      id
      content {
        message
        senderId
      }
      chatId
      chatUserIds
    }
  }
`;

export const GET_CHAT_LIST = gql`
  query GetUser {
    getUser {
      id
      name
      email
    }
  }
`;

export const GET_CHAT_MESSAGES = gql`
  mutation GetChatId($userIds: [String]) {
    getChatId(userIds: $userIds) {
      id
      userIds
      message {
        id
        content {
          message
          senderId
        }
        from {
          id
          username
        }
      }
    }
  }
`;
