import Main from './pages/Main';

import AuthCallback from './components/AuthCallback';
import { loadErrorMessages, loadDevMessages } from "@apollo/client/dev";

import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';


const isDev = process.env.NODE_ENV === 'development';



const App: React.FC = () => {
    return (
      <Router>
        <Routes>
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path="*" element={<Main />} />
        </Routes>
      </Router>
    )
}


if (isDev) {
  loadDevMessages();
  loadErrorMessages();
}


export default App;
