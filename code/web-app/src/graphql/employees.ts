import { gql } from '@apollo/client';

export const EMPLOYEES = gql`
  query EmployeesGet {
    employees { 
      id
      name
      age
      location
      preferences
    }
  }
`;

export const EMPLOYEES_CREATE = gql`
  mutation EmployeeCreate($employees: [EmployeeCreateInput!]!) {
    employeeCreate(employees: $employees) {
      id
      name
      age
      location
      preferences
    }
  }
`;

export const EMPLOYEES_REMOVE = gql`
  mutation EmployeesRemove($ids: [String!]!) {
    employeeRemove(ids: $ids)
  }
`;

export const EMPLOYEES_CREATED = gql`
  subscription OnEmployeeCreated {
    employeeCreated {
      id
      name
      age
      location
      preferences
    }
  }
`;
