import React, { useEffect, useState } from 'react';
import { useQuery, useLazyQuery, useMutation } from '@apollo/client';
import { GET_SCHEDULE, CREATE_SCHEDULE } from '../graphql/schedule'; 
import { SHIFTS, GET_SHIFTS_BY_IDS } from '../graphql/shifts'; 
import { EMPLOYEES } from '../graphql/employees';
import { QUERY_GPT } from '../graphql/openai';

interface SchedulePageProps {
  goToPage: (page: 'schedule' | 'employee' | 'gptQuery') => void;
}

const SchedulePage: React.FC<SchedulePageProps> = ({ goToPage }) => {
  const { data: scheduleData, loading: scheduleLoading, error: scheduleError } = useQuery(GET_SCHEDULE);
  const [shiftIds, setShiftIds] = useState<string[]>([]);
  const [days, setDays] = useState<any[]>([]);
  const [scheduleFeasible, setScheduleFeasible] = useState<boolean | null>(null); // To track feasibility
  
  const [queryText, setQueryText] = useState('');
  const [fetchGPTResponse, { data, loading, error }] = useLazyQuery(QUERY_GPT);

  const [createSchedule, { loading: createScheduleLoading, error: createScheduleError }] = useMutation(CREATE_SCHEDULE, {
    refetchQueries: [{ query: GET_SCHEDULE }],
  });

  const handleQuery = async () => {
    if (!queryText.trim()) return;
    fetchGPTResponse({ variables: { prompt: queryText } });
    setQueryText('');
  };

  const generateDaysBetweenDates = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const daysArray = [];

    for (let d = start; d <= end; d.setDate(d.getDate() + 1)) {
      const formattedDate = d.toISOString().split('T')[0];
      daysArray.push(formattedDate);
    }

    return daysArray;
  };

  useEffect(() => {
    if (!scheduleLoading && scheduleData && scheduleData.getSchedule) {
      setShiftIds(scheduleData.getSchedule.shiftIds || []);
      const { startDate, endDate } = scheduleData.getSchedule;
      if (startDate && endDate) {
        const generatedDays = generateDaysBetweenDates(startDate, endDate);
        setDays(generatedDays);
      }
    }
  }, [scheduleLoading, scheduleData]);

  const { data: shiftsData, loading: shiftsLoading, error: shiftsError } = useQuery(GET_SHIFTS_BY_IDS, {
    variables: { shiftIds: shiftIds },
  });

  const employeeIds = shiftsData?.shiftsByIds?.flatMap((shift: any) => shift.employeeIds) || [];

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

  // Handle Generate Schedule
  const handleGenerateSchedule = async () => {
    try {
      const { data } = await createSchedule(); // Call the mutation and get the result

      // Check if schedule creation is successful or not
      if (data.createSchedule.id && data.createSchedule.id !== "0") {
        setScheduleFeasible(true);  // Schedule was successfully created
      } else {
        setScheduleFeasible(false); // Schedule creation failed or was "not feasible"
      }
    } catch (error) {
      console.error('Error creating schedule:', error);
      setScheduleFeasible(false);  // Set to "not feasible" in case of an error
    }
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
              <button onClick={() => goToPage('gptQuery')} className="basis-auto">
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

            {/* New Schedule Table */}
            <div className="overflow-x-auto">
              {scheduleFeasible === false ? (
                <p className="text-red-500 text-xl font-bold">Not feasible</p>
              ) : (
                <table className="min-w-full table-auto border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-100 text-left text-sm uppercase tracking-wider">
                      <th className="border px-6 py-3 font-semibold text-gray-600">Day</th>
                      <th className="border px-6 py-3 font-semibold text-gray-600">Shift</th>
                      <th className="border px-6 py-3 font-semibold text-gray-600">Employees</th>
                    </tr>
                  </thead>
                  <tbody>
                    {days.length > 0 ? (
                      days.map((day: any, dayIndex: number) => (
                        <React.Fragment key={dayIndex}>
                          <tr className="bg-gray-50">
                            <td
                              className="border px-6 py-4 font-bold align-top"
                              rowSpan={shifts.length || 1}
                            >
                              {day}
                            </td>
                            {shifts.length > 0 ? (
                              shifts.map((shift: any, shiftIndex: number) => (
                                <tr key={shiftIndex} className="border-t">
                                  <td className="border px-6 py-4">
                                    {new Date(shift.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} -{' '}
                                    {new Date(shift.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                  </td>
                                  <td className="border px-6 py-4">
                                    {shift.employeeIds?.length > 0 ? (
                                      shift.employeeIds.map((id: any) => (
                                        <div key={id} className="mb-2">
                                          <p className="text-sm font-medium">
                                            Name: {getEmployeeById(id).name}
                                          </p>
                                          <p className="text-sm text-gray-500">
                                            Specialty: {getEmployeeById(id).speciality}
                                          </p>
                                        </div>
                                      ))
                                    ) : (
                                      <p className="text-sm text-gray-500">No employees</p>
                                    )}
                                  </td>
                                </tr>
                              ))
                            ) : (
                              <tr className="border-t">
                                <td colSpan={2} className="border px-6 py-4 text-gray-500 text-center">
                                  No shifts
                                </td>
                              </tr>
                            )}
                          </tr>
                        </React.Fragment>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={3} className="border px-6 py-4 text-center text-gray-500">
                          No schedule available
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          {/* Ask chat gpt text input */}
          <div className="flex flex-wrap gap-5 justify-between px-7 py-5 mt-10 text-base bg-zinc-100 rounded-[40px] text-stone-500 max-md:px-5 max-md:mr-2 max-md:max-w-full">
              <input
                type="text"
                value={queryText}
                onChange={(e) => setQueryText(e.target.value)}
                placeholder="Search for or ask me to do anything"
                className="bg-transparent border-none focus:outline-none flex-grow text-stone-500"
              />
              <img
                loading="lazy"
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/20d3779ace53450987f3d81961fc0222d012748b3eca00741d25951cea4d060e?placeholderIfAbsent=true&apiKey=4a298b04045740b88c962cc4cff65977"
                className="object-contain shrink-0 w-6 aspect-square transition-transform duration-300 ease-in-out hover:scale-150 hover:opacity-80 cursor-pointer"
                alt="search icon"
                onClick={handleQuery} // Optionally trigger submit on image click
                />
          </div>

          {/* Generate Schedule Button */}
          <div className="flex gap-2 justify-center text-base font-medium leading-none text-center mt-10">
            <button
              onClick={handleGenerateSchedule} 
              className="px-6 py-3 text-white bg-blue-500 rounded-lg hover:bg-blue-700"
            >
              {createScheduleLoading ? 'Generating...' : 'Generate schedule'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SchedulePage;
