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

export const GET_SHIFTS_BY_IDS = gql`
  query GetShiftsByIds($shiftIds: [ID!]!) {
    shiftsByIds(shiftIds: $shiftIds) {
      id
      startTime
      endTime
      employeeIds
      location
    }
  }
`;

// Mutation to create shifts with all necessary fields
export const SHIFTS_CREATE = gql`
  mutation CreateShifts($shifts: [ShiftInput!]!) {
    createShifts(shifts: $shifts) {
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

// Mutation to delete all shifts
export const SHIFTS_DELETE_ALL = gql`
  mutation DeleteAllShifts {
    deleteAllShifts
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

// Mutation to add employees to a shift
export const ADD_EMPLOYEES_TO_SHIFT = gql`
  mutation AddEmployeesToShift($shiftId: ID!, $employeeIds: [ID!]!) {
    addEmployeesToShift(shiftId: $shiftId, employeeIds: $employeeIds) {
      id
      employeeIds
    }
  }
`;
