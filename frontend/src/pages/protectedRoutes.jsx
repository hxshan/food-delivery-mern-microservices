import { Navigate } from 'react-router-dom';

const CustomerProtectedRoute = ({ children }) => {
  const userString = localStorage.getItem('user');

  if (!userString) {
    alert('No user found. Please log in.');
    return <Navigate to="/" replace />;
  }

  let user = null;
  try {
    user = JSON.parse(userString);
  } catch (error) {
    console.error("Failed to parse user from localStorage:", error);
    alert('User data corrupted. Please log in again.');
    return <Navigate to="/" replace />;
  }

  const token = user.token;
  const role = user.currentRole;

  // Check for valid token and role
  if (!token || role !== 'customer') {
    alert('Access denied. You must be logged in as a customer.');
    return <Navigate to="/" replace />;
  }

  return children;
};

export default CustomerProtectedRoute;
