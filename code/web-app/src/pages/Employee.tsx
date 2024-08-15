import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { EMPLOYEES_CREATE } from '../graphql/employees'; // Import your GraphQL mutation

interface EmployeePageProps {
  goToPage: (page: 'schedule' | 'employee' | 'gptQuery') => void; // Generic navigation function
}

// Function to calculate age based on the date of birth (dob)
const calculateAge = (dob: string): number => {
  const birthDate = new Date(dob);
  const difference = Date.now() - birthDate.getTime();
  const ageDate = new Date(difference);
  return Math.abs(ageDate.getUTCFullYear() - 1970);
};

const EmployeePage: React.FC<EmployeePageProps> = ({ goToPage }) => {
  // State to manage form inputs
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [dob, setDob] = useState('');
  const [preferences, setPreferences] = useState('');

  // GraphQL mutation for adding employees
  const [addEmployee] = useMutation(EMPLOYEES_CREATE, {
    onError: (error) => {
      alert(`Error: ${error.message}`);
    },
  });

  // Handle form submission
  const handleAddEmployee = async () => {
    if (name.trim() && email.trim() && address.trim() && dob.trim() && preferences.trim()) {
      const age = calculateAge(dob); // Calculate age based on dob
      try {
        await addEmployee({
          variables: {
            employees: [
              {
                name,
                location: address, // Assume address maps to location
                age, // Use calculated age based on dob
                preferences,
              },
            ],
          },
        });
        // Clear form fields after submission
        setName('');
        setEmail('');
        setAddress('');
        setDob('');
        setPreferences('');
        alert('Employee added successfully!');
      } catch (error) {
        console.error('Error adding employee:', error);
      }
    } else {
      alert('Please fill in all fields.');
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
              <button
                onClick={() => goToPage('employee')}
                className="basis-auto">
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
            {/* Form Fields */}
            <div className="px-7 py-5 mt-10 max-w-full text-base whitespace-nowrap rounded-xl bg-zinc-100 text-stone-500 w-[513px] max-md:px-5">
              <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-zinc-100 text-stone-500 outline-none"
              />
            </div>
            <div className="px-7 py-5 mt-5 max-w-full text-base whitespace-nowrap rounded-xl bg-zinc-100 text-stone-500 w-[513px] max-md:px-5">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-zinc-100 text-stone-500 outline-none"
              />
            </div>
            <div className="px-7 py-5 mt-5 max-w-full text-base whitespace-nowrap rounded-xl bg-zinc-100 text-stone-500 w-[513px] max-md:px-5">
              <input
                type="text"
                placeholder="Address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full bg-zinc-100 text-stone-500 outline-none"
              />
            </div>
            <div className="px-7 py-5 mt-5 max-w-full text-base whitespace-nowrap rounded-xl bg-zinc-100 text-stone-500 w-[513px] max-md:px-5">
              <input
                type="date"
                placeholder="Date of birth" // Ensure correct placeholder is shown
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className="w-full bg-zinc-100 text-stone-500 outline-none"
              />
            </div>
            <div className="px-7 py-5 mt-5 max-w-full text-base whitespace-nowrap rounded-xl bg-zinc-100 text-stone-500 w-[513px] max-md:px-5">
              <input
                type="text"
                placeholder="Preferences"
                value={preferences}
                onChange={(e) => setPreferences(e.target.value)}
                className="w-full bg-zinc-100 text-stone-500 outline-none"
              />
            </div>
            <div
              onClick={handleAddEmployee}
              className="self-center cursor-pointer px-6 py-3 mt-10 max-w-full text-base font-medium leading-none text-center text-black bg-rose-300 rounded-lg w-[158px] max-md:px-5"
            >
              Add Employee
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeePage;
