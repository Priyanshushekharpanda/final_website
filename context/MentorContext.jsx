import React, { createContext, useContext, useState } from 'react';

const MentorContext = createContext();

export const useMentor = () => {
  const context = useContext(MentorContext);
  if (!context) {
    throw new Error('useMentor must be used within a MentorProvider');
  }
  return context;
};

export const MentorProvider = ({ children }) => {
  const [mentor, setMentor] = useState({
    id: '1',
    name: 'Ayman Shaltoni',
    email: 'ayman@example.com',
    phone: '1234567890',
    title: 'Senior Software Engineer',
    about: 'Passionate mentor and developer.',
    skills: ['React', 'Node.js', 'Python'],
    twitter: '@ayman',
    instagram: '@ayman_dev',
    linkedin: 'ayman-shaltoni',
    totalEarnings: '13,000',
    activeStudents: 24,
    sessionsCompleted: 142,
    rating: '4.9',
    responseTime: '2h',
    location: 'Riyadh, SA',
    experience: '5 Years'
  });

  const [profileImageUrl, setProfileImageUrl] = useState(null);

  return (
    <MentorContext.Provider value={{ mentor, setMentor, profileImageUrl, setProfileImageUrl }}>
      {children}
    </MentorContext.Provider>
  );
};