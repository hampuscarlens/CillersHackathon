import React, { useState, useEffect } from 'react'; 
import { ApolloProvider } from '@apollo/client';
import create_api_client from '../utils/apolloClient';
import EmployeePage from '../pages/Employee'; 
import Employees from './ListEmployees';
import GPTQuery from './QueryGpt';
import Shifts from './ListShifts';
import SchedulePage from './SchedulePage';

interface AuthenticatedProps {
  userInfo: Record<string, any>; 
  logout: () => void; 
  csrf: string;
}

function on_graphql_error(messages: string[]) { 
    messages.forEach(message => alert(message)); 
} 

const Authenticated: React.FC<AuthenticatedProps> = ({ userInfo, logout, csrf }) => {
    // Load the initial state from localStorage or default to 'schedule'
    const [currentPage, setCurrentPage] = useState<'schedule' | 'employee' | 'gptQuery' | 'employees' | 'shifts'>(
        () => localStorage.getItem('currentPage') as 'schedule' | 'employee' | 'gptQuery' | 'employees' | 'shifts' || 'schedule'
    );
    
    // Whenever the page changes, save it to localStorage
    useEffect(() => {
        localStorage.setItem('currentPage', currentPage);
    }, [currentPage]);

    const goToPage = (page: 'schedule' | 'employee' | 'gptQuery' | 'employees' | 'shifts') => {
        setCurrentPage(page);
    };

    const renderPage = () => {
        switch (currentPage) {
            case 'schedule':
                return <SchedulePage goToPage={goToPage}/>;
            case 'employee':
                return <EmployeePage goToPage={goToPage} />;
            case 'gptQuery':
                return <GPTQuery />;
            case 'employees':
                return <Employees />;
            case 'shifts': // Render the Shifts component
                return <Shifts />;
            default:
                return <div>Select a page</div>;
        }
    };

    return (
        <ApolloProvider client={create_api_client(csrf, on_graphql_error)}>
            <div>
                <div className="flex justify-center space-x-4 my-4">
                    {/* Navigation buttons for page switching */}
                    <button
                        className="btn btn-primary"
                        onClick={() => goToPage('schedule')}
                    >
                        Go to Schedule
                    </button>
                    <button
                        className="btn btn-secondary"
                        onClick={() => goToPage('employee')}
                    >
                        Go to Employee
                    </button>
                    <button
                        className="btn btn-accent"
                        onClick={() => goToPage('employees')}
                    >
                        Go to Employee List
                    </button>
                    <button
                        className="btn btn-info"
                        onClick={() => goToPage('gptQuery')}
                    >
                        Go to GPT Query
                    </button>
                    <button
                        className="btn btn-warning"
                        onClick={() => goToPage('shifts')}
                    >
                        Go to Shifts
                    </button>
                </div>

                {renderPage()}
            </div>
        </ApolloProvider>
    );
}

export default Authenticated;
