import { gql } from '@apollo/client';

export const CONTENT_FRAGMENT = gql`
  fragment ContentFields on ContentReturn {
    message
    senderId
  }
`;

export const CREATE_MESSAGE = gql`
  ${CONTENT_FRAGMENT}
  mutation SendMessage($userIds: [String], $content: Contents) {
    sendMessage(userIds: $userIds, content: $content) {
      id
      content {
        ...ContentFields
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
          ...ContentFields
        }
        from {
          id
          username
        }
      }
    }
  }
`;
