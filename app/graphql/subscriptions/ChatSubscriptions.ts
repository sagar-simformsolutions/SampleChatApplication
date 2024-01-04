import { gql } from '@apollo/client';

export const ON_CHAT_UPDATE = gql`
  subscription NewMessage($chatId: String) {
    newMessage(chatId: $chatId) {
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
`;
