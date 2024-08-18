import React, { useState, useEffect } from 'react'
import { useQuery, useMutation } from '@apollo/client'
import {
  EMPLOYEES,
  EMPLOYEES_CREATE,
  EMPLOYEES_REMOVE,
  EMPLOYEES_CREATED,
} from '../graphql/employees'

interface Employee {
  id: string
  name: string
  age: number
  location: string
  email: string
  speciality: string
  salary: number
  skillLevel: number
  preferences: string
}

interface GetEmployeesQuery {
  employees: Employee[]
}

const Employees: React.FC = () => {
  const [newEmployeeName, setNewEmployeeName] = useState('')
  const [newEmployeeAge, setNewEmployeeAge] = useState(0)
  const [newEmployeeLocation, setNewEmployeeLocation] = useState('')
  const [newEmployeeEmail, setNewEmployeeEmail] = useState('')
  const [newEmployeespeciality, setNewEmployeespeciality] = useState('')
  const [newEmployeeSalary, setNewEmployeeSalary] = useState(0)
  const [newEmployeeSkillLevel, setNewEmployeeSkillLevel] = useState(100) // Default skill level to 100
  const [newEmployeePreferences, setNewEmployeePreferences] = useState('')
  
  const { data, loading, error, subscribeToMore } = useQuery(EMPLOYEES)
  const [addEmployee] = useMutation(EMPLOYEES_CREATE, { errorPolicy: 'all' })
  const [removeEmployee] = useMutation(EMPLOYEES_REMOVE)

  useEffect(() => {
    subscribeToMore({
      document: EMPLOYEES_CREATED,
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev
        const newEmployee = subscriptionData.data.employeeCreated

        if (prev.employees.some((employee: Employee) => employee.id === newEmployee.id)) {
          return prev
        }
        return Object.assign({}, prev, {
          employees: [...prev.employees, newEmployee],
        })
      },
    })
  }, [subscribeToMore])

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen bg-base-300">
        <button className="btn">
          <span className="loading loading-spinner"></span>
          Loading...
        </button>
      </div>
    )
  if (error) return <p>{'Error: ' + error}</p>

  const handleAddEmployee = async () => {
    if (
      !newEmployeeName.trim() || 
      newEmployeeAge <= 0 || 
      !newEmployeeLocation.trim() || 
      !newEmployeeEmail.trim() ||
      !newEmployeespeciality.trim() || 
      newEmployeeSalary <= 0 ||
      !newEmployeePreferences.trim()
    ) return
    
    await addEmployee({ 
      variables: { 
        employees: [{
          name: newEmployeeName,
          age: newEmployeeAge,
          location: newEmployeeLocation,
          email: newEmployeeEmail,
          speciality: newEmployeespeciality,
          salary: newEmployeeSalary,
          skillLevel: newEmployeeSkillLevel,
          preferences: newEmployeePreferences,
        }]
      }
    })
    setNewEmployeeName('')
    setNewEmployeeAge(0)
    setNewEmployeeLocation('')
    setNewEmployeeEmail('')
    setNewEmployeespeciality('')
    setNewEmployeeSalary(0)
    setNewEmployeeSkillLevel(100)
    setNewEmployeePreferences('')
  }

  const handleRemoveEmployee = async (id: string) => {
    await removeEmployee({
      variables: { ids: [id] },
      update(cache) {
        const existingEmployees = cache.readQuery<GetEmployeesQuery>({ query: EMPLOYEES })
        if (existingEmployees?.employees) {
          cache.writeQuery({
            query: EMPLOYEES,
            data: {
              employees: existingEmployees.employees.filter((employee) => employee.id !== id),
            },
          })
        }
      },
    })
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="navbar bg-base-300 text-neutral-content">
        <div className="flex-1">
          <a href="/" className="p-2 normal-case text-xl">
            Employees
          </a>
        </div>
      </div>

      <div className="flex flex-grow justify-center items-center bg-neutral">
        <div className="card card-compact w-full max-w-lg bg-base-100 shadow-xl">
          <div className="card-body items-stretch text-center">
            <h1 className="card-title self-center text-2xl font-bold mb-4">
              Employee List
            </h1>
            <div className="form-control w-full">
              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="Employee name..."
                  className="input input-bordered input-md input-primary"
                  value={newEmployeeName}
                  onChange={(e) => setNewEmployeeName(e.target.value)}
                />
                <input
                  type="number"
                  placeholder="Employee age..."
                  className="input input-bordered input-md input-primary"
                  value={newEmployeeAge}
                  onChange={(e) => setNewEmployeeAge(Number(e.target.value))}
                />
                <input
                  type="text"
                  placeholder="Employee location..."
                  className="input input-bordered input-md input-primary"
                  value={newEmployeeLocation}
                  onChange={(e) => setNewEmployeeLocation(e.target.value)}
                />
                <input
                  type="email"
                  placeholder="Employee email..."
                  className="input input-bordered input-md input-primary"
                  value={newEmployeeEmail}
                  onChange={(e) => setNewEmployeeEmail(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Employee speciality..."
                  className="input input-bordered input-md input-primary"
                  value={newEmployeespeciality}
                  onChange={(e) => setNewEmployeespeciality(e.target.value)}
                />
                <input
                  type="number"
                  placeholder="Employee salary..."
                  className="input input-bordered input-md input-primary"
                  value={newEmployeeSalary}
                  onChange={(e) => setNewEmployeeSalary(Number(e.target.value))}
                />
                <input
                  type="number"
                  placeholder="Employee skill level (default 100)..."
                  className="input input-bordered input-md input-primary"
                  value={newEmployeeSkillLevel}
                  onChange={(e) => setNewEmployeeSkillLevel(Number(e.target.value))}
                />
                <input
                  type="text"
                  placeholder="Employee preferences..."
                  className="input input-bordered input-md input-primary"
                  value={newEmployeePreferences}
                  onChange={(e) => setNewEmployeePreferences(e.target.value)}
                />
                <button
                  className="btn btn-square btn-md btn-primary"
                  onClick={handleAddEmployee}
                >
                  Add
                </button>
              </div>
            </div>
            <div className="space-y-2 w-full mt-4">
              {data.employees.map(({ name, id, age, location, email, speciality, salary, skillLevel, preferences }: Employee) => (
                <div
                  key={id}
                  className="card card-compact w-full bg-base-200 flex-row items-center justify-between"
                >
                  <div className="card-body">
                    <div className="flex justify-between items-center w-full">
                      <span>{name} (Age: {age}) - {location} | Email: {email} | speciality: {speciality} | Salary: {salary} | Skill Level: {skillLevel} | Preferences: {preferences}</span>
                      <button
                        className="btn btn-xs btn-circle btn-error"
                        onClick={() => handleRemoveEmployee(id)}
                      >
                        x
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Employees
