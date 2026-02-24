import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { MentorProvider } from './context/MentorContext';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import CompanyProfile from './pages/CompanyProfile';
import MyMentor from './pages/MyMentor';
import Sessions from './pages/Sessions';
import EditProfile from './pages/EditProfile';
import ProfilePreview from './pages/ProfilePreview';
import Availability from './pages/Availability';

function App() {
  return (
    <BrowserRouter>
      <MentorProvider>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Navigate to="/profile" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="company" element={<CompanyProfile />} />
            <Route path="mentor" element={<MyMentor />} />
            <Route path="sessions" element={<Sessions />} />
            <Route path="availability" element={<Availability />} />
            <Route path="profile" element={<EditProfile />} />
            <Route path="profile/preview" element={<ProfilePreview />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </MentorProvider>
    </BrowserRouter>
  );
}

export default App;
