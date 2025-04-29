import { createContext, useEffect, useReducer } from "react";

// Create the AuthContext
export const AuthContext = createContext();

// Define the auth reducer with support for both regular users and admin users
export const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN':
      return { user: action.payload, admin: null };
    case 'ADMIN_LOGIN':
      return { user: null, admin: action.payload };
    case 'LOGOUT':
      return { user: null, admin: null };
    default:
      return state;
  }
};

// Auth Context Provider Component
export const AuthContextProvider = ({ children }) => {
  // Initialize state with both user and admin as null
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    admin: null,
  });

  // Check local storage on initial load
  useEffect(() => {
    // Try to get user data
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      dispatch({ type: 'LOGIN', payload: user });
    }
    
    // Try to get admin data
    const admin = JSON.parse(localStorage.getItem('admin'));
    if (admin) {
      dispatch({ type: 'ADMIN_LOGIN', payload: admin });
    }
  }, []);

  console.log('AuthContext state:', state);

  return (
    <AuthContext.Provider value={{ ...state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};