import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Login';
import Dashboard from './Dashboard';
import AddReading from './AddReading';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/add-reading" element={<AddReading />} />
        <Route path="*" element={<Login />} />
      </Routes>
    </Router>
  );
};

export default App;