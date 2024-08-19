import { gql } from '@apollo/client';

// Define the GraphQL query to fetch the schedule
export const GET_SCHEDULE = gql`
  query GetSchedule {
    getSchedule {
      id
      name
      description
      startDate
      endDate
      shiftIds
    }
  }
`;

