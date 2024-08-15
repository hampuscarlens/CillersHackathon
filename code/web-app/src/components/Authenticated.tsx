import React, { useState } from 'react'; 
import { ApolloProvider } from '@apollo/client';
import create_api_client from '../utils/apolloClient';
import SchedulePage from '../pages/Schedule';
import EmployeePage from '../pages/Employee'; 
import Employees from './ListEmployees';
import GPTQuery from './QueryGpt';

interface AuthenticatedProps {
  userInfo: Record<string, any>; 
  logout: () => void; 
  csrf: string;
}

function on_graphql_error(messages: string[]) { 
    messages.forEach(message => alert(message)); 
} 

const Authenticated: React.FC<AuthenticatedProps> = ({ userInfo, logout, csrf }) => {
    // Update the state to include 'Employees'
    const [currentPage, setCurrentPage] = useState<'schedule' | 'employee' | 'gptQuery' | 'employees'>('schedule');
    
    const goToPage = (page: 'schedule' | 'employee' | 'gptQuery' | 'employees') => {
        setCurrentPage(page);
    };

    const renderPage = () => {
        switch (currentPage) {
            case 'schedule':
                return <SchedulePage goToPage={goToPage} />;
            case 'employee':
                return <EmployeePage goToPage={goToPage} />;
            case 'gptQuery':
                return <GPTQuery />;
            case 'employees':
                return <Employees />;  
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
                </div>

                {renderPage()}
            </div>
        </ApolloProvider>
    );
}

export default Authenticated;
