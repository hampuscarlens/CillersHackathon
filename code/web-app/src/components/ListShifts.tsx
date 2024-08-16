import React, { useState, useEffect } from 'react'
import { useQuery, useMutation } from '@apollo/client'
import {
  SHIFTS,
  SHIFTS_CREATE,
  SHIFTS_REMOVE,
  SHIFTS_CREATED,
} from '../graphql/shifts'

interface SpecialityRequirement {
  speciality: string
  numRequired: number
}

interface Shift {
  id: string
  startTime: string
  endTime: string
  location: string
  specialities: SpecialityRequirement[]
  employeeIds: string[]
}

interface GetShiftsQuery {
  shifts: Shift[]
}

const Shifts: React.FC = () => {
  const [newShiftStartTime, setNewShiftStartTime] = useState('')
  const [newShiftEndTime, setNewShiftEndTime] = useState('')
  const [newShiftLocation, setNewShiftLocation] = useState('')
  
  // Define the type for newShiftspecialities using the SpecialityRequirement interface
  const [newShiftspecialities, setNewShiftspecialities] = useState<SpecialityRequirement[]>([
    { speciality: '', numRequired: 0 }
  ])
  
  const { data, loading, error, subscribeToMore } = useQuery(SHIFTS)
  const [addShift] = useMutation(SHIFTS_CREATE, { errorPolicy: 'all' })
  const [removeShift] = useMutation(SHIFTS_REMOVE)

  useEffect(() => {
    subscribeToMore({
      document: SHIFTS_CREATED,
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev
        const newShift = subscriptionData.data.shiftCreated

        if (prev.shifts.some((shift: Shift) => shift.id === newShift.id)) {
          return prev
        }
        return Object.assign({}, prev, {
          shifts: [...prev.shifts, newShift],
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

  const handleAddShift = async () => {
    if (
      !newShiftStartTime.trim() ||
      !newShiftEndTime.trim() ||
      !newShiftLocation.trim() ||
      newShiftspecialities.some(speciality => !speciality.speciality.trim() || speciality.numRequired <= 0)
    ) return

    await addShift({
      variables: {
        shifts: [{
          startTime: newShiftStartTime,
          endTime: newShiftEndTime,
          location: newShiftLocation,
          specialities: newShiftspecialities,
          employeeIds: [] // Assuming no employees assigned initially
        }]
      }
    })

    // Reset form fields after submission
    setNewShiftStartTime('')
    setNewShiftEndTime('')
    setNewShiftLocation('')
    setNewShiftspecialities([{ speciality: '', numRequired: 0 }])
  }

  const handleRemoveShift = async (id: string) => {
    await removeShift({
      variables: { ids: [id] },
      update(cache) {
        const existingShifts = cache.readQuery<GetShiftsQuery>({ query: SHIFTS })
        if (existingShifts?.shifts) {
          cache.writeQuery({
            query: SHIFTS,
            data: {
              shifts: existingShifts.shifts.filter((shift) => shift.id !== id),
            },
          })
        }
      },
    })
  }

  const handleSpecialityChange = (index: number, field: keyof SpecialityRequirement, value: string | number) => {
    const updatedspecialities = [...newShiftspecialities]

    // Ensure the type is properly narrowed for the field value
    if (field === 'numRequired') {
      updatedspecialities[index][field] = Number(value);
    } else {
      updatedspecialities[index][field] = String(value);
    }
    
    setNewShiftspecialities(updatedspecialities)
  }

  const handleAddSpeciality = () => {
    setNewShiftspecialities([...newShiftspecialities, { speciality: '', numRequired: 0 }])
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="navbar bg-base-300 text-neutral-content">
        <div className="flex-1">
          <a href="/" className="p-2 normal-case text-xl">
            Shifts
          </a>
        </div>
      </div>

      <div className="flex flex-grow justify-center items-center bg-neutral">
        <div className="card card-compact w-full max-w-lg bg-base-100 shadow-xl">
          <div className="card-body items-stretch text-center">
            <h1 className="card-title self-center text-2xl font-bold mb-4">
              Shift List
            </h1>
            <div className="form-control w-full">
              <div className="space-y-2">
                <input
                  type="datetime-local"
                  placeholder="Shift start time..."
                  className="input input-bordered input-md input-primary"
                  value={newShiftStartTime}
                  onChange={(e) => setNewShiftStartTime(e.target.value)}
                />
                <input
                  type="datetime-local"
                  placeholder="Shift end time..."
                  className="input input-bordered input-md input-primary"
                  value={newShiftEndTime}
                  onChange={(e) => setNewShiftEndTime(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Shift location..."
                  className="input input-bordered input-md input-primary"
                  value={newShiftLocation}
                  onChange={(e) => setNewShiftLocation(e.target.value)}
                />

                <h2 className="text-lg font-semibold">Specialities</h2>
                {newShiftspecialities.map((speciality, index) => (
                  <div key={index} className="space-y-2">
                    <input
                      type="text"
                      placeholder="Speciality..."
                      className="input input-bordered input-md input-primary"
                      value={speciality.speciality}
                      onChange={(e) => handleSpecialityChange(index, 'speciality', e.target.value)}
                    />
                    <input
                      type="number"
                      placeholder="numRequired number of employees..."
                      className="input input-bordered input-md input-primary"
                      value={speciality.numRequired}
                      onChange={(e) => handleSpecialityChange(index, 'numRequired', Number(e.target.value))}
                    />
                  </div>
                ))}
                <button className="btn btn-square btn-md btn-secondary" onClick={handleAddSpeciality}>
                  Add Speciality
                </button>

                <button
                  className="btn btn-square btn-md btn-primary"
                  onClick={handleAddShift}
                >
                  Add Shift
                </button>
              </div>
            </div>
            <div className="space-y-2 w-full mt-4">
              {data.shifts.map(({ id, startTime, endTime, location, specialities }: Shift) => (
                <div
                  key={id}
                  className="card card-compact w-full bg-base-200 flex-row items-center justify-between"
                >
                  <div className="card-body">
                    <div className="flex justify-between items-center w-full">
                      <span>Shift from {new Date(startTime).toLocaleString()} to {new Date(endTime).toLocaleString()} at {location}</span>
                      <div>
                        <h3>Specialities:</h3>
                        {specialities.map((speciality, idx) => (
                          <p key={idx}>{speciality.speciality} - {speciality.numRequired} employees</p>
                        ))}
                      </div>
                      <button
                        className="btn btn-xs btn-circle btn-error"
                        onClick={() => handleRemoveShift(id)}
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

export default Shifts
