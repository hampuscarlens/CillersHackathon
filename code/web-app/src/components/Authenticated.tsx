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
                {renderPage()}
            </div>
        </ApolloProvider>
    );
}

export default Authenticated;
