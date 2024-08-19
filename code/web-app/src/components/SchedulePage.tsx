import React, { useEffect, useState } from 'react';
import { useQuery } from '@apollo/client';
import { GET_SCHEDULE } from '../graphql/schedule'; 
import { SHIFTS, GET_SHIFTS_BY_IDS } from '../graphql/shifts'; 
import { EMPLOYEES } from '../graphql/employees';

interface SchedulePageProps {
  goToPage: (page: 'schedule' | 'employee' | 'gptQuery') => void;
}

const SchedulePage: React.FC<SchedulePageProps> = ({ goToPage }) => {
  const { data: scheduleData, loading: scheduleLoading, error: scheduleError } = useQuery(GET_SCHEDULE);
  const [shiftIds, setShiftIds] = useState<string[]>([]);
  const [days, setDays] = useState<any[]>([]);

    // Helper function to generate the days between two dates
  const generateDaysBetweenDates = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const daysArray = [];
    
    // Loop through each day from startDate to endDate
    for (let d = start; d <= end; d.setDate(d.getDate() + 1)) {
      const formattedDate = d.toISOString().split('T')[0]; // Format as yyyy-MM-dd
      daysArray.push(formattedDate);
    }

    return daysArray;
  };

 // useEffect that waits for scheduleData to be available
 useEffect(() => {
    if (!scheduleLoading && scheduleData && scheduleData.getSchedule) {
      // Set shiftIds and days once data is available
      setShiftIds(scheduleData.getSchedule.shiftIds || []);
      console.info("schedule data: ", scheduleData)
      // Convert startDate and endDate to days
      const { startDate, endDate } = scheduleData.getSchedule;
      if (startDate && endDate) {
        const generatedDays = generateDaysBetweenDates(startDate, endDate);
        setDays(generatedDays);
        console.info("days: ", days)
      }
    }
  }, [scheduleLoading, scheduleData]);

  
  console.info("shift ids: ", shiftIds)
  console.info("days: ", days)

  // Fetch shifts based on the shift IDs
  const { data: shiftsData, loading: shiftsLoading, error: shiftsError } = useQuery(GET_SHIFTS_BY_IDS, {
    variables: { shiftIds: shiftIds }, // Pass the shift IDs to fetch shifts
  });

  console.info("shift data: ", shiftsData)

  const employeeIds = shiftsData?.shiftsByIds?.flatMap((shift: any) => shift.employeeIds) || [];

  // Fetch all employees by the extracted employee IDs
  const { data: employeeData, loading: employeeLoading, error: employeeError } = useQuery(EMPLOYEES, {
    variables: { ids: employeeIds },
  });

  if (scheduleLoading || shiftsLoading || employeeLoading) return <p>Loading...</p>;
  if (scheduleError) return <p>Schedule Error: {scheduleError.message}</p>;
  if (shiftsError) return <p>Shifts Error: {shiftsError.message}</p>;
  if (employeeError) return <p>Employee Error: {employeeError.message}</p>;

  const shifts = shiftsData?.shiftsByIds || [];
  const employees = employeeData?.employees || [];

  const getEmployeeById = (id: string) => {
    const employee = employees.find((emp: any) => emp.id === id);
    return employee ? employee : 'Unknown Employee';
  };


  return (
    <div className="overflow-hidden pr-16 bg-white max-md:pr-5">
      <div className="flex gap-5 max-md:flex-col">
        {/* Sidebar */}
        <div className="flex flex-col w-[18%] max-md:ml-0 max-md:w-full">
          <div className="flex flex-col items-start px-8 pt-32 mx-auto w-full text-xl leading-snug text-white whitespace-nowrap bg-black pb-[808px] max-md:px-5 max-md:py-24 max-md:mt-10">
            <div className="flex gap-2">
              <img
                loading="lazy"
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/94060a3064c845408f6153da607b5ff4b693740b2d14c8b511279fe269260a90?placeholderIfAbsent=true&apiKey=4a298b04045740b88c962cc4cff65977"
                className="object-contain shrink-0 my-auto w-6 aspect-square"
              />
              <button onClick={() => goToPage('schedule')} className="basis-auto">
                Schedule
              </button>
            </div>
            <div className="flex gap-2 mt-6">
              <img
                loading="lazy"
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/8d3cdba5420069bcd4a047ac2c2f57d0a7e18d4bcd11dffae08b79b10aed70cc?placeholderIfAbsent=true&apiKey=4a298b04045740b88c962cc4cff65977"
                className="object-contain shrink-0 my-auto w-6 aspect-square"
              />
              <button onClick={() => goToPage('employee')} className="basis-auto">
                Employees
              </button>
            </div>
            <div className="flex gap-2 mt-6">
              <button
                onClick={() => goToPage('gptQuery')}
                className="basis-auto">
                Ask chatGPT
              </button>
            </div>
            <img
              loading="lazy"
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/3e5dff689c8d891f07734e8b8b21f1817c57f6754b40e3530abd1a1dc8df252d?placeholderIfAbsent=true&apiKey=4a298b04045740b88c962cc4cff65977"
              className="object-contain mt-1 max-w-full w-[130px]"
            />
          </div>
        </div>

        {/* Main Content */}
        <div className="flex flex-col ml-5 w-[82%] max-md:ml-0 max-md:w-full">
          <div className="flex flex-col items-start mt-6 w-full max-md:mt-10 max-md:max-w-full">
            <h1 className="text-3xl font-bold mb-6">Weekly Employee Schedule</h1>

            <table className="min-w-full border-collapse">
              <thead>
                <tr>
                  <th className="border px-4 py-2 bg-gray-200">Day</th>
                  <th className="border px-4 py-2 bg-gray-200">Shift</th>
                  <th className="border px-4 py-2 bg-gray-200">Employees</th>
                </tr>
              </thead>
              <tbody>
                {days.length > 0 ? ( // Only render if days array is not empty
                  days.map((day: any, dayIndex: number) => (
                    <React.Fragment key={dayIndex}>
                      <tr>
                        <td className="border px-4 py-2 font-bold" rowSpan={shifts.length || 1}>{day}</td>
                        {shifts.length > 0 ? (
                          shifts.map((shift: any, shiftIndex: number) => (
                            <tr key={shiftIndex}>
                              <td className="border px-4 py-2">
                                {new Date(shift.startTime).toLocaleTimeString()} - {new Date(shift.endTime).toLocaleTimeString()}
                              </td>
                              <td className="border px-4 py-2">
                                {shift.employeeIds?.length > 0 ? (
                                  shift.employeeIds.map((id: any) => (
                                    <div key={id}>
                                      <p>Name: {getEmployeeById(id).name}</p>
                                      <p>Speciality: {getEmployeeById(id).speciality}</p>
                                    </div>
                                  ))
                                ) : (
                                  <p>No employees</p>
                                )}
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={2} className="border px-4 py-2">No shifts</td>
                          </tr>
                        )}
                      </tr>
                    </React.Fragment>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="border px-4 py-2">No schedule available</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SchedulePage;
