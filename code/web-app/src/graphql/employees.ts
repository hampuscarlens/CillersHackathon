import { gql } from '@apollo/client';

// Query to get the list of employees with correct field names
export const EMPLOYEES = gql`
  query EmployeesGet {
    employees { 
      id
      name
      age
      location
      email
      speciality
      salary
      skillLevel
      preferences
      shiftIds
      unavailability {
        dayOfWeek
        startTime
        endTime
      }
    }
  }
`;

// Mutation to create employees with correct field names
export const EMPLOYEES_CREATE = gql`
  mutation EmployeeCreate($employees: [EmployeeInput!]!) {
    employeeCreate(employees: $employees) {
      id
      name
      age
      location
      email
      speciality
      salary
      skillLevel
      preferences
      shiftIds
      unavailability {
        dayOfWeek
        startTime
        endTime
      }
    }
  }
`;

// Mutation to remove employees by their IDs
export const EMPLOYEES_REMOVE = gql`
  mutation EmployeesRemove($ids: [ID!]!) {
    employeeRemove(ids: $ids)
  }
`;

// Subscription to listen for newly created employees with correct field names
export const EMPLOYEES_CREATED = gql`
  subscription OnEmployeeCreated {
    employeeCreated {
      id
      name
      age
      location
      email
      speciality
      salary
      skillLevel
      preferences
      shiftIds
      unavailability {
        dayOfWeek
        startTime
        endTime
      }
    }
  }
`;
