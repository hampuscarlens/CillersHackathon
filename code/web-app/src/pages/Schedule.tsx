import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface SchedulePageProps {
  goToPage: (page: 'schedule' | 'employee' | 'gptQuery') => void; // Generic navigation function
}
const SchedulePage: React.FC<SchedulePageProps> = ({ goToPage }) => {
    const [inputValue, setInputValue] = useState<string>('');
    const [showPopup, setShowPopup] = useState<boolean>(false);
  
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setInputValue(event.target.value);
    };
  
    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'Enter') {
        console.log('Input Value:', inputValue); // Log the input value to the console
        setShowPopup(true);
        setTimeout(() => setShowPopup(false), 3000); // Auto-hide after 3 seconds
      }
    };
  
    const handleSubmit = () => {
      console.log('Input Value:', inputValue);
    };
  
    const navigate = useNavigate();
  
    const handleClick = () => {
      navigate('/add-employee'); // This will navigate to the "/add-employee" URL
    };
    const handleEmployeeButton = () => {
      navigate('/employee-list'); // This will navigate to the "/add-employee" URL
    };
  
  return (
    <div className="overflow-hidden pr-16 bg-white max-md:pr-5">
      <div className="flex gap-5 max-md:flex-col">
        <div className="flex flex-col w-[18%] max-md:ml-0 max-md:w-full">
          <div className="flex flex-col items-start px-8 pt-32 mx-auto w-full text-xl leading-snug text-white whitespace-nowrap bg-black pb-[860px] max-md:px-5 max-md:py-24 max-md:mt-10">
          <div className="flex gap-2">
                <img
                  loading="lazy"
                  src="https://cdn.builder.io/api/v1/image/assets/TEMP/94060a3064c845408f6153da607b5ff4b693740b2d14c8b511279fe269260a90?placeholderIfAbsent=true&apiKey=4a298b04045740b88c962cc4cff65977"
                  className="object-contain shrink-0 my-auto w-6 aspect-square"
                />
                <div>Schedule</div>
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
                Employees</button>
              </div>
              <div className="flex gap-2 mt-6">
                <button
                onClick={() => goToPage('gptQuery')} 
                className="basis-auto">
                Ask chatGPT</button>
              </div>
            <img
              loading="lazy"
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/badf4d8062dd72f8c7638b372ab4ff3e53b167b8a49704b861a9f50aeaf4e891?placeholderIfAbsent=true&apiKey=4a298b04045740b88c962cc4cff65977"
              className="object-contain mt-1 max-w-full w-[130px]"
            />
          </div>
        </div>
        <div className="flex flex-col ml-5 w-[82%] max-md:ml-0 max-md:w-full">
          <div className="flex flex-col mt-6 w-full max-md:mt-10 max-md:max-w-full">
            <div className="flex gap-2 self-end text-base text-black max-md:mr-2">
              <img
                loading="lazy"
                srcSet="https://cdn.builder.io/api/v1/image/assets/TEMP/9e3cf9df4244ef6e9fac1d8e0081c4531e0c31e7816dfc008386891c911f5f23?placeholderIfAbsent=true&apiKey=4a298b04045740b88c962cc4cff65977&width=100 100w, https://cdn.builder.io/api/v1/image/assets/TEMP/9e3cf9df4244ef6e9fac1d8e0081c4531e0c31e7816dfc008386891c911f5f23?placeholderIfAbsent=true&apiKey=4a298b04045740b88c962cc4cff65977&width=200 200w, https://cdn.builder.io/api/v1/image/assets/TEMP/9e3cf9df4244ef6e9fac1d8e0081c4531e0c31e7816dfc008386891c911f5f23?placeholderIfAbsent=true&apiKey=4a298b04045740b88c962cc4cff65977&width=400 400w, https://cdn.builder.io/api/v1/image/assets/TEMP/9e3cf9df4244ef6e9fac1d8e0081c4531e0c31e7816dfc008386891c911f5f23?placeholderIfAbsent=true&apiKey=4a298b04045740b88c962cc4cff65977&width=800 800w, https://cdn.builder.io/api/v1/image/assets/TEMP/9e3cf9df4244ef6e9fac1d8e0081c4531e0c31e7816dfc008386891c911f5f23?placeholderIfAbsent=true&apiKey=4a298b04045740b88c962cc4cff65977&width=1200 1200w, https://cdn.builder.io/api/v1/image/assets/TEMP/9e3cf9df4244ef6e9fac1d8e0081c4531e0c31e7816dfc008386891c911f5f23?placeholderIfAbsent=true&apiKey=4a298b04045740b88c962cc4cff65977&width=1600 1600w, https://cdn.builder.io/api/v1/image/assets/TEMP/9e3cf9df4244ef6e9fac1d8e0081c4531e0c31e7816dfc008386891c911f5f23?placeholderIfAbsent=true&apiKey=4a298b04045740b88c962cc4cff65977&width=2000 2000w, https://cdn.builder.io/api/v1/image/assets/TEMP/9e3cf9df4244ef6e9fac1d8e0081c4531e0c31e7816dfc008386891c911f5f23?placeholderIfAbsent=true&apiKey=4a298b04045740b88c962cc4cff65977"
                className="object-contain shrink-0 w-10 rounded aspect-square"
              />
              <div className="flex gap-1 my-auto">
                <div className="grow">Rebecca Thomson</div>
                <img
                  loading="lazy"
                  src="https://cdn.builder.io/api/v1/image/assets/TEMP/ed3bc3071d5361e15a82db7e07ed864390bd6b483e166a9bfe6d68a70e8e8d20?placeholderIfAbsent=true&apiKey=4a298b04045740b88c962cc4cff65977"
                  className="object-contain shrink-0 self-start w-6 aspect-square"
                />
              </div>
            </div>
            <img
              loading="lazy"
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/4f58b2e3b807cd3c09750e2898d6a73f2df7cd2d05a21fda0768dc5953d99786?placeholderIfAbsent=true&apiKey=4a298b04045740b88c962cc4cff65977"
              className="object-contain mt-6 w-full aspect-[500] stroke-[1.5px] stroke-neutral-200 max-md:mr-2 max-md:max-w-full"
            />
            <div className="flex flex-wrap gap-5 justify-between mt-10 w-full max-md:mr-2 max-md:max-w-full">
              <div className="flex flex-col">
                <div className="mr-5 text-3xl font-semibold leading-none text-black max-md:mr-2.5">
                  Manage your scedules
                </div>
                <div className="mt-1 text-2xl leading-none text-stone-500">
                  How would you like to schedule?
                </div>
              </div>
              <div className="flex gap-2 self-start text-base font-medium leading-none text-center">
              <button
              onClick={() => goToPage('employee')} 
              className="px-6 py-3 text-white bg-blue-500 rounded-lg hover:bg-blue-700"
            >
              Add Employee
            </button>
                <div className="px-6 py-3 text-gray-800 rounded-lg border-rose-300 border-solid border-[1.5px] max-md:px-5">
                  Export schedule
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-10 mt-10 w-full text-base font-medium text-black max-md:max-w-full">
              <div className="flex flex-col grow shrink-0 basis-0 w-fit">
                <div className="flex gap-4 self-start text-right">
                  <div className="flex whitespace-nowrap">
                    <div className="grow">Filter</div>
                    <img
                      loading="lazy"
                      src="https://cdn.builder.io/api/v1/image/assets/TEMP/ed3bc3071d5361e15a82db7e07ed864390bd6b483e166a9bfe6d68a70e8e8d20?placeholderIfAbsent=true&apiKey=4a298b04045740b88c962cc4cff65977"
                      className="object-contain shrink-0 w-6 aspect-square"
                    />
                  </div>
                  <div className="flex">
                    <div className="grow">July 2024</div>
                    <img
                      loading="lazy"
                      src="https://cdn.builder.io/api/v1/image/assets/TEMP/ed3bc3071d5361e15a82db7e07ed864390bd6b483e166a9bfe6d68a70e8e8d20?placeholderIfAbsent=true&apiKey=4a298b04045740b88c962cc4cff65977"
                      className="object-contain shrink-0 w-6 aspect-square"
                    />
                  </div>
                </div>
                <div className="flex gap-5 justify-between mt-10 text-center">
                  <div className="text-right">Week 27</div>
                  <div>Mon 1</div>
                  <div>Tue 2</div>
                </div>
              </div>
              <div className="flex flex-wrap flex-auto gap-6 max-md:max-w-full">
                <div className="flex flex-col">
                  <div className="flex flex-col self-end text-right w-[67px]">
                    <div>Week 27</div>
                    <img
                      loading="lazy"
                      src="https://cdn.builder.io/api/v1/image/assets/TEMP/5b5828f7ffe9e0323d907dfb6b224c52733207976759139181afcbd8d8c40772?placeholderIfAbsent=true&apiKey=4a298b04045740b88c962cc4cff65977"
                      className="object-contain w-full"
                    />
                  </div>
                  <div className="flex gap-5 justify-between mt-10 max-w-full text-center w-[175px]">
                    <div>Wed 3</div>
                    <div>Thu 4</div>
                  </div>
                </div>
                <div className="flex flex-col">
                  <div className="text-right">Week 28</div>
                  <div className="self-start mt-10 ml-3 text-center max-md:ml-2.5">
                    Fri 5
                  </div>
                </div>
                <div className="flex flex-col">
                  <div className="flex gap-6 text-right">
                    <div className="grow">Week 29</div>
                    <div>Week 30</div>
                    <img
                      loading="lazy"
                      src="https://cdn.builder.io/api/v1/image/assets/TEMP/9ec4593af20db48f97e04c62ad29e94d13f14ccc3eeb5b87ea6395f8406a6ccf?placeholderIfAbsent=true&apiKey=4a298b04045740b88c962cc4cff65977"
                      className="object-contain shrink-0 w-16 aspect-[2.67]"
                    />
                  </div>
                  <div className="flex gap-5 justify-between self-center mt-10 max-w-full text-center w-[170px]">
                    <div>Sat 6</div>
                    <div>Sun 7</div>
                  </div>
                </div>
              </div>
            </div>
            <img
              loading="lazy"
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/41a65760c5b199f4f754adb35d019e7c73da07f563d90f836d9282f6c9a4361e?placeholderIfAbsent=true&apiKey=4a298b04045740b88c962cc4cff65977"
              className="object-contain mt-2 w-full aspect-[500] stroke-[1.5px] stroke-neutral-200 max-md:mr-2 max-md:max-w-full"
            />
            <div className="flex flex-wrap gap-10 mt-3 w-full font-medium max-md:mr-2 max-md:max-w-full">
              <div className="flex gap-2 my-auto text-xs leading-4 text-black whitespace-nowrap">
                <img
                  loading="lazy"
                  srcSet="https://cdn.builder.io/api/v1/image/assets/TEMP/ee1771618422069f1fcf5e4aa833970f413c35478081e2cba13a0b368508722f?placeholderIfAbsent=true&apiKey=4a298b04045740b88c962cc4cff65977&width=100 100w, https://cdn.builder.io/api/v1/image/assets/TEMP/ee1771618422069f1fcf5e4aa833970f413c35478081e2cba13a0b368508722f?placeholderIfAbsent=true&apiKey=4a298b04045740b88c962cc4cff65977&width=200 200w, https://cdn.builder.io/api/v1/image/assets/TEMP/ee1771618422069f1fcf5e4aa833970f413c35478081e2cba13a0b368508722f?placeholderIfAbsent=true&apiKey=4a298b04045740b88c962cc4cff65977&width=400 400w, https://cdn.builder.io/api/v1/image/assets/TEMP/ee1771618422069f1fcf5e4aa833970f413c35478081e2cba13a0b368508722f?placeholderIfAbsent=true&apiKey=4a298b04045740b88c962cc4cff65977&width=800 800w, https://cdn.builder.io/api/v1/image/assets/TEMP/ee1771618422069f1fcf5e4aa833970f413c35478081e2cba13a0b368508722f?placeholderIfAbsent=true&apiKey=4a298b04045740b88c962cc4cff65977&width=1200 1200w, https://cdn.builder.io/api/v1/image/assets/TEMP/ee1771618422069f1fcf5e4aa833970f413c35478081e2cba13a0b368508722f?placeholderIfAbsent=true&apiKey=4a298b04045740b88c962cc4cff65977&width=1600 1600w, https://cdn.builder.io/api/v1/image/assets/TEMP/ee1771618422069f1fcf5e4aa833970f413c35478081e2cba13a0b368508722f?placeholderIfAbsent=true&apiKey=4a298b04045740b88c962cc4cff65977&width=2000 2000w, https://cdn.builder.io/api/v1/image/assets/TEMP/ee1771618422069f1fcf5e4aa833970f413c35478081e2cba13a0b368508722f?placeholderIfAbsent=true&apiKey=4a298b04045740b88c962cc4cff65977"
                  className="object-contain shrink-0 w-8 rounded-sm aspect-square shadow-[0px_1px_1px_rgba(37,40,52,0.12)]"
                />
                <div>
                  Anton
                  <br />
                  Gustafsson
                </div>
              </div>
              <div className="flex flex-wrap flex-auto gap-2 text-base leading-5 text-stone-500 max-md:max-w-full">
                <div className="px-3 py-2 rounded-lg border-yellow-500 border-solid bg-yellow-500 bg-opacity-30 border-[1.5px] max-md:pr-5">
                  Shift 1<br />
                  <span className=" text-stone-500">11:00-17:00</span>
                </div>
                <div className="px-3 py-2 rounded-lg border-yellow-500 border-solid bg-yellow-500 bg-opacity-30 border-[1.5px]">
                  Shift 1<br />
                  <span className=" text-stone-500">11:00-22:00</span>
                </div>
                <div className="px-3 py-2 rounded-lg border-yellow-500 border-solid bg-yellow-500 bg-opacity-30 border-[1.5px] max-md:pr-5">
                  Shift 1<br />
                  <span className=" text-stone-500">11:00-17:00</span>
                </div>
                <div className="px-3 py-2 rounded-lg border-yellow-500 border-solid bg-yellow-500 bg-opacity-30 border-[1.5px]">
                  Shift 1<br />
                  <span className=" text-stone-500">11:00-22:00</span>
                </div>
                <div className="px-3 py-2 rounded-lg border-yellow-500 border-solid bg-yellow-500 bg-opacity-30 border-[1.5px] max-md:pr-5">
                  Shift 1<br />
                  <span className=" text-stone-500">11:00-17:00</span>
                </div>
                <div className="px-3 py-2 rounded-lg border-yellow-500 border-solid bg-yellow-500 bg-opacity-30 border-[1.5px]">
                  Shift 1<br />
                  <span className=" text-stone-500">11:00-22:00</span>
                </div>
                <div className="px-3 py-2 rounded-lg border-yellow-500 border-solid bg-yellow-500 bg-opacity-30 border-[1.5px]">
                  Shift 1<br />
                  <span className=" text-stone-500">11:00-22:00</span>
                </div>
              </div>
            </div>
            <img
              loading="lazy"
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/6bebb0a60f9f05c7e9b9156718c846c0bf940d3f0cde81191cbe7f216cea70ef?placeholderIfAbsent=true&apiKey=4a298b04045740b88c962cc4cff65977"
              className="object-contain mt-3 w-full aspect-[500] stroke-[1.5px] stroke-neutral-200 max-md:mr-2 max-md:max-w-full"
            />
            <div className="flex flex-wrap gap-10 mt-3 w-full font-medium max-md:mr-2 max-md:max-w-full">
              <div className="flex gap-2 my-auto text-xs leading-4 text-black whitespace-nowrap">
                <img
                  loading="lazy"
                  srcSet="https://cdn.builder.io/api/v1/image/assets/TEMP/c9e18f913013251c55481f4c8d9fc37d940593a4a7dce787eded1e639b764709?placeholderIfAbsent=true&apiKey=4a298b04045740b88c962cc4cff65977&width=100 100w, https://cdn.builder.io/api/v1/image/assets/TEMP/c9e18f913013251c55481f4c8d9fc37d940593a4a7dce787eded1e639b764709?placeholderIfAbsent=true&apiKey=4a298b04045740b88c962cc4cff65977&width=200 200w, https://cdn.builder.io/api/v1/image/assets/TEMP/c9e18f913013251c55481f4c8d9fc37d940593a4a7dce787eded1e639b764709?placeholderIfAbsent=true&apiKey=4a298b04045740b88c962cc4cff65977&width=400 400w, https://cdn.builder.io/api/v1/image/assets/TEMP/c9e18f913013251c55481f4c8d9fc37d940593a4a7dce787eded1e639b764709?placeholderIfAbsent=true&apiKey=4a298b04045740b88c962cc4cff65977&width=800 800w, https://cdn.builder.io/api/v1/image/assets/TEMP/c9e18f913013251c55481f4c8d9fc37d940593a4a7dce787eded1e639b764709?placeholderIfAbsent=true&apiKey=4a298b04045740b88c962cc4cff65977&width=1200 1200w, https://cdn.builder.io/api/v1/image/assets/TEMP/c9e18f913013251c55481f4c8d9fc37d940593a4a7dce787eded1e639b764709?placeholderIfAbsent=true&apiKey=4a298b04045740b88c962cc4cff65977&width=1600 1600w, https://cdn.builder.io/api/v1/image/assets/TEMP/c9e18f913013251c55481f4c8d9fc37d940593a4a7dce787eded1e639b764709?placeholderIfAbsent=true&apiKey=4a298b04045740b88c962cc4cff65977&width=2000 2000w, https://cdn.builder.io/api/v1/image/assets/TEMP/c9e18f913013251c55481f4c8d9fc37d940593a4a7dce787eded1e639b764709?placeholderIfAbsent=true&apiKey=4a298b04045740b88c962cc4cff65977"
                  className="object-contain shrink-0 w-8 rounded-sm aspect-square shadow-[0px_1px_1px_rgba(37,40,52,0.12)]"
                />
                <div>
                  Ibrahim
                  <br />
                  Ali
                </div>
              </div>
              <div className="flex flex-wrap flex-auto gap-2 text-base leading-5 text-stone-500 max-md:max-w-full">
                <div className="px-3 py-2 rounded-lg border-2 border-yellow-500 border-solid bg-yellow-500 bg-opacity-30 max-md:pr-5">
                  Shift 1<br />
                  <span className=" text-stone-500">11:00-17:00</span>
                </div>
                <div className="px-3 py-2 rounded-lg border-solid bg-stone-300 bg-opacity-30 border-[1.5px] border-stone-300 max-md:pr-5">
                  Unavailable
                  <br />
                  <span className=" text-stone-500">All day</span>
                </div>
                <div className="px-3 py-2 rounded-lg border-2 border-yellow-500 border-solid bg-yellow-500 bg-opacity-30 max-md:pr-5">
                  Shift 1<br />
                  <span className=" text-stone-500">11:00-17:00</span>
                </div>
                <div className="px-3 py-2 rounded-lg border-solid bg-stone-300 bg-opacity-30 border-[1.5px] border-stone-300 max-md:pr-5">
                  Unavailable
                  <br />
                  <span className=" text-stone-500">All day</span>
                </div>
                <div className="px-3 py-2 rounded-lg border-2 border-yellow-500 border-solid bg-yellow-500 bg-opacity-30 max-md:pr-5">
                  Shift 1<br />
                  <span className=" text-stone-500">11:00-17:00</span>
                </div>
                <div className="px-3 py-2 rounded-lg border-solid bg-stone-300 bg-opacity-30 border-[1.5px] border-stone-300 max-md:pr-5">
                  Unavailable
                  <br />
                  <span className=" text-stone-500">All day</span>
                </div>
                <div className="px-3 py-2 rounded-lg border-solid bg-stone-300 bg-opacity-30 border-[1.5px] border-stone-300 max-md:pr-5">
                  Unavailable
                  <br />
                  <span className=" text-stone-500">All day</span>
                </div>
              </div>
            </div>
            <img
              loading="lazy"
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/41a65760c5b199f4f754adb35d019e7c73da07f563d90f836d9282f6c9a4361e?placeholderIfAbsent=true&apiKey=4a298b04045740b88c962cc4cff65977"
              className="object-contain mt-3 w-full aspect-[500] stroke-[1.5px] stroke-neutral-200 max-md:mr-2 max-md:max-w-full"
            />
            <div className="flex flex-wrap gap-10 mt-3 w-full font-medium max-md:mr-2 max-md:max-w-full">
              <div className="flex gap-2 my-auto text-xs leading-4 text-black whitespace-nowrap">
                <img
                  loading="lazy"
                  srcSet="https://cdn.builder.io/api/v1/image/assets/TEMP/ecf52890b646fd2e35d5db76a92dbce2bb6cd7e99f3cf68b78aed9b2bdeb4fd2?placeholderIfAbsent=true&apiKey=4a298b04045740b88c962cc4cff65977&width=100 100w, https://cdn.builder.io/api/v1/image/assets/TEMP/ecf52890b646fd2e35d5db76a92dbce2bb6cd7e99f3cf68b78aed9b2bdeb4fd2?placeholderIfAbsent=true&apiKey=4a298b04045740b88c962cc4cff65977&width=200 200w, https://cdn.builder.io/api/v1/image/assets/TEMP/ecf52890b646fd2e35d5db76a92dbce2bb6cd7e99f3cf68b78aed9b2bdeb4fd2?placeholderIfAbsent=true&apiKey=4a298b04045740b88c962cc4cff65977&width=400 400w, https://cdn.builder.io/api/v1/image/assets/TEMP/ecf52890b646fd2e35d5db76a92dbce2bb6cd7e99f3cf68b78aed9b2bdeb4fd2?placeholderIfAbsent=true&apiKey=4a298b04045740b88c962cc4cff65977&width=800 800w, https://cdn.builder.io/api/v1/image/assets/TEMP/ecf52890b646fd2e35d5db76a92dbce2bb6cd7e99f3cf68b78aed9b2bdeb4fd2?placeholderIfAbsent=true&apiKey=4a298b04045740b88c962cc4cff65977&width=1200 1200w, https://cdn.builder.io/api/v1/image/assets/TEMP/ecf52890b646fd2e35d5db76a92dbce2bb6cd7e99f3cf68b78aed9b2bdeb4fd2?placeholderIfAbsent=true&apiKey=4a298b04045740b88c962cc4cff65977&width=1600 1600w, https://cdn.builder.io/api/v1/image/assets/TEMP/ecf52890b646fd2e35d5db76a92dbce2bb6cd7e99f3cf68b78aed9b2bdeb4fd2?placeholderIfAbsent=true&apiKey=4a298b04045740b88c962cc4cff65977&width=2000 2000w, https://cdn.builder.io/api/v1/image/assets/TEMP/ecf52890b646fd2e35d5db76a92dbce2bb6cd7e99f3cf68b78aed9b2bdeb4fd2?placeholderIfAbsent=true&apiKey=4a298b04045740b88c962cc4cff65977"
                  className="object-contain shrink-0 w-8 rounded-sm aspect-square shadow-[0px_1px_1px_rgba(37,40,52,0.12)]"
                />
                <div>
                  Irma
                  <br />
                  Torres
                </div>
              </div>
              <div className="flex flex-wrap flex-auto gap-2 text-base leading-5 text-stone-500 max-md:max-w-full">
                <div className="px-3 py-2 rounded-lg border-teal-700 border-solid bg-teal-700 bg-opacity-30 border-[1.5px]">
                  Shift 2<br />
                  <span className=" text-stone-500">17:00-22:00</span>
                </div>
                <div className="px-3 py-2 rounded-lg border-yellow-500 border-solid bg-yellow-500 bg-opacity-30 border-[1.5px] max-md:pr-5">
                  Shift 1<br />
                  <span className=" text-stone-500">11:00-17:00</span>
                </div>
                <div className="px-3 py-2 rounded-lg border-teal-700 border-solid bg-teal-700 bg-opacity-30 border-[1.5px]">
                  Shift 2<br />
                  <span className=" text-stone-500">17:00-22:00</span>
                </div>
                <div className="px-3 py-2 rounded-lg border-yellow-500 border-solid bg-yellow-500 bg-opacity-30 border-[1.5px] max-md:pr-5">
                  Shift 1<br />
                  <span className=" text-stone-500">11:00-17:00</span>
                </div>
                <div className="px-3 py-2 rounded-lg border-teal-700 border-solid bg-teal-700 bg-opacity-30 border-[1.5px]">
                  Shift 2<br />
                  <span className=" text-stone-500">17:00-22:00</span>
                </div>
                <div className="px-3 py-2 rounded-lg border-yellow-500 border-solid bg-yellow-500 bg-opacity-30 border-[1.5px] max-md:pr-5">
                  Shift 1<br />
                  <span className=" text-stone-500">11:00-17:00</span>
                </div>
                <div className="px-3 py-2 rounded-lg border-yellow-500 border-solid bg-yellow-500 bg-opacity-30 border-[1.5px] max-md:pr-5">
                  Shift 1<br />
                  <span className=" text-stone-500">11:00-17:00</span>
                </div>
              </div>
            </div>
            <img
              loading="lazy"
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/41a65760c5b199f4f754adb35d019e7c73da07f563d90f836d9282f6c9a4361e?placeholderIfAbsent=true&apiKey=4a298b04045740b88c962cc4cff65977"
              className="object-contain mt-3 w-full aspect-[500] stroke-[1.5px] stroke-neutral-200 max-md:mr-2 max-md:max-w-full"
            />
            <div className="flex flex-wrap gap-10 mt-3 w-full font-medium max-md:mr-2 max-md:max-w-full">
              <div className="flex gap-2 my-auto text-xs leading-4 text-black whitespace-nowrap">
                <img
                  loading="lazy"
                  srcSet="https://cdn.builder.io/api/v1/image/assets/TEMP/fef862a90b6ff1e4733ef38ff9244e2c22154df927f4ab8c0b15995f23ff647c?placeholderIfAbsent=true&apiKey=4a298b04045740b88c962cc4cff65977&width=100 100w, https://cdn.builder.io/api/v1/image/assets/TEMP/fef862a90b6ff1e4733ef38ff9244e2c22154df927f4ab8c0b15995f23ff647c?placeholderIfAbsent=true&apiKey=4a298b04045740b88c962cc4cff65977&width=200 200w, https://cdn.builder.io/api/v1/image/assets/TEMP/fef862a90b6ff1e4733ef38ff9244e2c22154df927f4ab8c0b15995f23ff647c?placeholderIfAbsent=true&apiKey=4a298b04045740b88c962cc4cff65977&width=400 400w, https://cdn.builder.io/api/v1/image/assets/TEMP/fef862a90b6ff1e4733ef38ff9244e2c22154df927f4ab8c0b15995f23ff647c?placeholderIfAbsent=true&apiKey=4a298b04045740b88c962cc4cff65977&width=800 800w, https://cdn.builder.io/api/v1/image/assets/TEMP/fef862a90b6ff1e4733ef38ff9244e2c22154df927f4ab8c0b15995f23ff647c?placeholderIfAbsent=true&apiKey=4a298b04045740b88c962cc4cff65977&width=1200 1200w, https://cdn.builder.io/api/v1/image/assets/TEMP/fef862a90b6ff1e4733ef38ff9244e2c22154df927f4ab8c0b15995f23ff647c?placeholderIfAbsent=true&apiKey=4a298b04045740b88c962cc4cff65977&width=1600 1600w, https://cdn.builder.io/api/v1/image/assets/TEMP/fef862a90b6ff1e4733ef38ff9244e2c22154df927f4ab8c0b15995f23ff647c?placeholderIfAbsent=true&apiKey=4a298b04045740b88c962cc4cff65977&width=2000 2000w, https://cdn.builder.io/api/v1/image/assets/TEMP/fef862a90b6ff1e4733ef38ff9244e2c22154df927f4ab8c0b15995f23ff647c?placeholderIfAbsent=true&apiKey=4a298b04045740b88c962cc4cff65977"
                  className="object-contain shrink-0 w-8 rounded-sm aspect-square shadow-[0px_1px_1px_rgba(37,40,52,0.12)]"
                />
                <div>
                  Olivia
                  <br />
                  Engström
                </div>
              </div>
              <div className="flex flex-wrap flex-auto gap-2 text-base leading-5 text-stone-500 max-md:max-w-full">
                <div className="px-3 py-2 rounded-lg border-yellow-500 border-solid bg-yellow-500 bg-opacity-30 border-[1.5px] max-md:pr-5">
                  Shift 1<br />
                  <span className=" text-stone-500">11:00-17:00</span>
                </div>
                <div className="px-3 py-2 rounded-lg border-teal-700 border-solid bg-teal-700 bg-opacity-30 border-[1.5px]">
                  Shift 2<br />
                  <span className=" text-stone-500">17:00-22:00</span>
                </div>
                <div className="px-3 py-2 rounded-lg border-yellow-500 border-solid bg-yellow-500 bg-opacity-30 border-[1.5px] max-md:pr-5">
                  Shift 1<br />
                  <span className=" text-stone-500">11:00-17:00</span>
                </div>
                <div className="px-3 py-2 rounded-lg border-teal-700 border-solid bg-teal-700 bg-opacity-30 border-[1.5px]">
                  Shift 2<br />
                  <span className=" text-stone-500">17:00-22:00</span>
                </div>
                <div className="px-3 py-2 rounded-lg border-yellow-500 border-solid bg-yellow-500 bg-opacity-30 border-[1.5px] max-md:pr-5">
                  Shift 1<br />
                  <span className=" text-stone-500">11:00-17:00</span>
                </div>
                <div className="px-3 py-2 rounded-lg border-teal-700 border-solid bg-teal-700 bg-opacity-30 border-[1.5px]">
                  Shift 2<br />
                  <span className=" text-stone-500">17:00-22:00</span>
                </div>
                <div className="px-3 py-2 rounded-lg border-teal-700 border-solid bg-teal-700 bg-opacity-30 border-[1.5px]">
                  Shift 2<br />
                  <span className=" text-stone-500">17:00-22:00</span>
                </div>
              </div>
            </div>
            <img
              loading="lazy"
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/41a65760c5b199f4f754adb35d019e7c73da07f563d90f836d9282f6c9a4361e?placeholderIfAbsent=true&apiKey=4a298b04045740b88c962cc4cff65977"
              className="object-contain mt-3 w-full aspect-[500] stroke-[1.5px] stroke-neutral-200 max-md:mr-2 max-md:max-w-full"
            />
            <div className="flex flex-wrap gap-10 mt-3 w-full font-medium max-md:mr-2 max-md:max-w-full">
              <div className="flex gap-2 my-auto text-xs leading-4 text-black whitespace-nowrap">
                <img
                  loading="lazy"
                  srcSet="https://cdn.builder.io/api/v1/image/assets/TEMP/8bd92e6623d2c822e13af38ba6607765879119ac14a844125ca36db0c79cfe68?placeholderIfAbsent=true&apiKey=4a298b04045740b88c962cc4cff65977&width=100 100w, https://cdn.builder.io/api/v1/image/assets/TEMP/8bd92e6623d2c822e13af38ba6607765879119ac14a844125ca36db0c79cfe68?placeholderIfAbsent=true&apiKey=4a298b04045740b88c962cc4cff65977&width=200 200w, https://cdn.builder.io/api/v1/image/assets/TEMP/8bd92e6623d2c822e13af38ba6607765879119ac14a844125ca36db0c79cfe68?placeholderIfAbsent=true&apiKey=4a298b04045740b88c962cc4cff65977&width=400 400w, https://cdn.builder.io/api/v1/image/assets/TEMP/8bd92e6623d2c822e13af38ba6607765879119ac14a844125ca36db0c79cfe68?placeholderIfAbsent=true&apiKey=4a298b04045740b88c962cc4cff65977&width=800 800w, https://cdn.builder.io/api/v1/image/assets/TEMP/8bd92e6623d2c822e13af38ba6607765879119ac14a844125ca36db0c79cfe68?placeholderIfAbsent=true&apiKey=4a298b04045740b88c962cc4cff65977&width=1200 1200w, https://cdn.builder.io/api/v1/image/assets/TEMP/8bd92e6623d2c822e13af38ba6607765879119ac14a844125ca36db0c79cfe68?placeholderIfAbsent=true&apiKey=4a298b04045740b88c962cc4cff65977&width=1600 1600w, https://cdn.builder.io/api/v1/image/assets/TEMP/8bd92e6623d2c822e13af38ba6607765879119ac14a844125ca36db0c79cfe68?placeholderIfAbsent=true&apiKey=4a298b04045740b88c962cc4cff65977&width=2000 2000w, https://cdn.builder.io/api/v1/image/assets/TEMP/8bd92e6623d2c822e13af38ba6607765879119ac14a844125ca36db0c79cfe68?placeholderIfAbsent=true&apiKey=4a298b04045740b88c962cc4cff65977"
                  className="object-contain shrink-0 w-8 rounded-sm aspect-square shadow-[0px_1px_1px_rgba(37,40,52,0.12)]"
                />
                <div>
                  Peter
                  <br />
                  Dahl
                </div>
              </div>
              <div className="flex flex-wrap flex-auto gap-2 text-base leading-5 text-stone-500 max-md:max-w-full">
                <div className="px-3 py-2 rounded-lg border-teal-700 border-solid bg-teal-700 bg-opacity-30 border-[1.5px]">
                  Shift 2<br />
                  <span className=" text-stone-500">17:00-22:00</span>
                </div>
                <div className="px-3 py-2 rounded-lg border-yellow-500 border-solid bg-yellow-500 bg-opacity-30 border-[1.5px] max-md:pr-5">
                  Shift 1<br />
                  <span className=" text-stone-500">11:00-17:00</span>
                </div>
                <div className="px-3 py-2 rounded-lg border-teal-700 border-solid bg-teal-700 bg-opacity-30 border-[1.5px]">
                  Shift 2<br />
                  <span className=" text-stone-500">17:00-22:00</span>
                </div>
                <div className="px-3 py-2 rounded-lg border-yellow-500 border-solid bg-yellow-500 bg-opacity-30 border-[1.5px] max-md:pr-5">
                  Shift 1<br />
                  <span className=" text-stone-500">11:00-17:00</span>
                </div>
                <div className="px-3 py-2 rounded-lg border-teal-700 border-solid bg-teal-700 bg-opacity-30 border-[1.5px]">
                  Shift 2<br />
                  <span className=" text-stone-500">17:00-22:00</span>
                </div>
                <div className="px-3 py-2 rounded-lg border-yellow-500 border-solid bg-yellow-500 bg-opacity-30 border-[1.5px] max-md:pr-5">
                  Shift 1<br />
                  <span className=" text-stone-500">11:00-17:00</span>
                </div>
                <div className="px-3 py-2 rounded-lg border-yellow-500 border-solid bg-yellow-500 bg-opacity-30 border-[1.5px] max-md:pr-5">
                  Shift 1<br />
                  <span className=" text-stone-500">11:00-17:00</span>
                </div>
              </div>
            </div>
            <img
              loading="lazy"
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/41a65760c5b199f4f754adb35d019e7c73da07f563d90f836d9282f6c9a4361e?placeholderIfAbsent=true&apiKey=4a298b04045740b88c962cc4cff65977"
              className="object-contain mt-3 w-full aspect-[500] stroke-[1.5px] stroke-neutral-200 max-md:mr-2 max-md:max-w-full"
            />
            <div className="flex flex-wrap gap-10 mt-3 w-full font-medium max-md:mr-2 max-md:max-w-full">
              <div className="flex gap-2 my-auto text-xs leading-4 text-black whitespace-nowrap">
                <img
                  loading="lazy"
                  srcSet="https://cdn.builder.io/api/v1/image/assets/TEMP/fb51e84c-a3ce-4ca6-aaf9-8cd271ae3802?placeholderIfAbsent=true&apiKey=4a298b04045740b88c962cc4cff65977&width=100 100w, https://cdn.builder.io/api/v1/image/assets/TEMP/fb51e84c-a3ce-4ca6-aaf9-8cd271ae3802?placeholderIfAbsent=true&apiKey=4a298b04045740b88c962cc4cff65977&width=200 200w, https://cdn.builder.io/api/v1/image/assets/TEMP/fb51e84c-a3ce-4ca6-aaf9-8cd271ae3802?placeholderIfAbsent=true&apiKey=4a298b04045740b88c962cc4cff65977&width=400 400w, https://cdn.builder.io/api/v1/image/assets/TEMP/fb51e84c-a3ce-4ca6-aaf9-8cd271ae3802?placeholderIfAbsent=true&apiKey=4a298b04045740b88c962cc4cff65977&width=800 800w, https://cdn.builder.io/api/v1/image/assets/TEMP/fb51e84c-a3ce-4ca6-aaf9-8cd271ae3802?placeholderIfAbsent=true&apiKey=4a298b04045740b88c962cc4cff65977&width=1200 1200w, https://cdn.builder.io/api/v1/image/assets/TEMP/fb51e84c-a3ce-4ca6-aaf9-8cd271ae3802?placeholderIfAbsent=true&apiKey=4a298b04045740b88c962cc4cff65977&width=1600 1600w, https://cdn.builder.io/api/v1/image/assets/TEMP/fb51e84c-a3ce-4ca6-aaf9-8cd271ae3802?placeholderIfAbsent=true&apiKey=4a298b04045740b88c962cc4cff65977&width=2000 2000w, https://cdn.builder.io/api/v1/image/assets/TEMP/fb51e84c-a3ce-4ca6-aaf9-8cd271ae3802?placeholderIfAbsent=true&apiKey=4a298b04045740b88c962cc4cff65977"
                  className="object-contain shrink-0 w-8 h-8 rounded-sm aspect-square bg-zinc-100"
                />
                <div>
                  Johan
                  <br />
                  Karlsson
                </div>
              </div>
              <div className="flex flex-wrap flex-auto gap-2 text-base leading-5 text-stone-500">
                <div className="px-3 py-2 rounded-lg border-teal-700 border-solid bg-teal-700 bg-opacity-30 border-[1.5px]">
                  Shift 2<br />
                  <span className=" text-stone-500">17:00-22:00</span>
                </div>
                <div className="px-3 py-2 rounded-lg border-teal-700 border-solid bg-teal-700 bg-opacity-30 border-[1.5px]">
                  Shift 2<br />
                  <span className=" text-stone-500">17:00-22:00</span>
                </div>
                <div className="px-3 py-2 rounded-lg border-teal-700 border-solid bg-teal-700 bg-opacity-30 border-[1.5px]">
                  Shift 2<br />
                  <span className=" text-stone-500">17:00-22:00</span>
                </div>
                <div className="px-3 py-2 rounded-lg border-teal-700 border-solid bg-teal-700 bg-opacity-30 border-[1.5px]">
                  Shift 2<br />
                  <span className=" text-stone-500">17:00-22:00</span>
                </div>
                <div className="px-3 py-2 rounded-lg border-teal-700 border-solid bg-teal-700 bg-opacity-30 border-[1.5px]">
                  Shift 2<br />
                  <span className=" text-stone-500">17:00-22:00</span>
                </div>
                <div className="px-3 py-2 rounded-lg border-teal-700 border-solid bg-teal-700 bg-opacity-30 border-[1.5px]">
                  Shift 2<br />
                  <span className=" text-stone-500">17:00-22:00</span>
                </div>
                <div className="px-3 py-2 rounded-lg border-teal-700 border-solid bg-teal-700 bg-opacity-30 border-[1.5px]">
                  Shift 2<br />
                  <span className=" text-stone-500">17:00-22:00</span>
                </div>
              </div>
            </div>
            <img
              loading="lazy"
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/41a65760c5b199f4f754adb35d019e7c73da07f563d90f836d9282f6c9a4361e?placeholderIfAbsent=true&apiKey=4a298b04045740b88c962cc4cff65977"
              className="object-contain mt-3 w-full aspect-[500] stroke-[1.5px] stroke-neutral-200 max-md:mr-2 max-md:max-w-full"
            />
            <img
              loading="lazy"
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/b20432d9594a5236b801818ac40545aed35e9e7a4fc87c8f292dfcc173fb357f?placeholderIfAbsent=true&apiKey=4a298b04045740b88c962cc4cff65977"
              className="object-contain mt-9 w-full aspect-[500] stroke-[1.5px] stroke-neutral-200 max-md:mr-2 max-md:max-w-full"
            />
            <div className="flex flex-wrap gap-5 justify-between px-7 py-5 mt-10 text-base bg-zinc-100 rounded-[40px] text-stone-500 max-md:px-5 max-md:mr-2 max-md:max-w-full">
              <input
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}  // Listen for keydown events
                placeholder="Search for or ask me to do anything"
                className="bg-transparent border-none focus:outline-none flex-grow text-stone-500"
              />
              <img
                loading="lazy"
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/20d3779ace53450987f3d81961fc0222d012748b3eca00741d25951cea4d060e?placeholderIfAbsent=true&apiKey=4a298b04045740b88c962cc4cff65977"
                className="object-contain shrink-0 w-6 aspect-square"
                alt="search icon"
                onClick={handleSubmit} // Optionally trigger submit on image click
              />
              {showPopup && (
                <div className="absolute top-16 left-1/2 transform -translate-x-1/2 p-4 bg-gray-800 text-white rounded-md shadow-lg">
                  You typed: {inputValue}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  }


  
  export default SchedulePage