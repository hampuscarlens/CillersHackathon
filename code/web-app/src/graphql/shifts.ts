import { gql } from '@apollo/client';

// Query to get the list of shifts with all necessary fields
export const SHIFTS = gql`
  query Shifts {
    shifts {
      id
      startTime
      endTime
      location
      specialities {
        speciality
        numRequired
      }
      employeeIds
    }
  }
`;

// Mutation to create shifts with all necessary fields
export const SHIFTS_CREATE = gql`
  mutation CreateShifts($shifts: [ShiftInput!]!) {
    createShifts(shifts: $shifts) {
      id
      startTime
      endTime
      location
      specialities {
        speciality
        numRequired
      }
      employeeIds
    }
  }
`;

// Mutation to remove shifts by their IDs
export const SHIFTS_REMOVE = gql`
  mutation RemoveShifts($ids: [ID!]!) {
    removeShifts(ids: $ids)
  }
`;

// Subscription to listen for newly created shifts
export const SHIFTS_CREATED = gql`
  subscription OnShiftCreated {
    shiftCreated {
      id
      startTime
      endTime
      location
      specialities {
        speciality
        numRequired
      }
      employeeIds
    }
  }
`;
