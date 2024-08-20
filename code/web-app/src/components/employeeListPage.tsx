import React, { useEffect, useState } from 'react';
import { useQuery, useLazyQuery, useMutation } from '@apollo/client';
import { GET_SCHEDULE, CREATE_SCHEDULE } from '../graphql/schedule'; 
import { SHIFTS, GET_SHIFTS_BY_IDS } from '../graphql/shifts'; 
import { EMPLOYEES } from '../graphql/employees';
import { QUERY_GPT } from '../graphql/openai';

interface SchedulePageProps {
  goToPage: (page: 'schedule' | 'employee' | 'gptQuery') => void;
}


const EmployeeListPage: React.FC<SchedulePageProps> = ({ goToPage }) => {
  

  
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
                    {/* Ask chat gpt text input */}
                <div className="flex flex-wrap gap-5 justify-between px-7 py-5 mt-10 text-base bg-zinc-100 rounded-[40px] text-stone-500 max-md:px-5 max-md:mr-2 max-md:max-w-full">
                    <input
                        type="text"
                        // value={queryText} //
                        //onChange={(e) => setQueryText(e.target.value)}//
                        placeholder="Search for or ask me to do anything"
                        className="bg-transparent border-none focus:outline-none flex-grow text-stone-500"
                    />
                    <img
                        loading="lazy"
                        src="https://cdn.builder.io/api/v1/image/assets/TEMP/20d3779ace53450987f3d81961fc0222d012748b3eca00741d25951cea4d060e?placeholderIfAbsent=true&apiKey=4a298b04045740b88c962cc4cff65977"
                        className="object-contain shrink-0 w-6 aspect-square transition-transform duration-300 ease-in-out hover:scale-150 hover:opacity-80 cursor-pointer"
                        alt="search icon"
                        // onClick={handleQuery} // Optionally trigger submit on image click
                        />
                </div>
                    <h1 className="text-3xl font-bold mb-6">Weekly Employee Schedule</h1>
                    <div className="flex justify-center items-center">
                        <button className="btn">
                        <span className="loading loading-spinner"></span>
                        Loading...
                        </button>
                    </div>
                </div>
            </div>
            </div>
            </div>
            );
  
};

export default EmployeeListPage
