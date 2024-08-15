import { gql } from '@apollo/client';

export const QUERY_GPT = gql`
  query getOpenAi($prompt: String!) {
    getOpenAi(prompt: $prompt) {
        message
    }
  }
`;

