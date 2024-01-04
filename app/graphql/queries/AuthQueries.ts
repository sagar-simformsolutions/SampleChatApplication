import { gql } from '@apollo/client';

export const GET_TODO = gql`
  query Todo {
    todo {
      id
      title
      desc
    }
  }
`;
