/**
 * Legacy entry: redirects to the new profile page.
 * The app now uses Layout + routes (see App.jsx).
 * Profile editing: pages/EditProfile.jsx
 * Profile preview: pages/ProfilePreview.jsx
 */
import { Navigate } from 'react-router-dom';

export default function MentorProfile() {
  return <Navigate to="/profile" replace />;
}
