import { LoginForm } from '../components/Login';
import { Navigate } from 'react-router-dom';

export function publicRoutes() {
  return [
    { path: '/login', element: <LoginForm /> },
    { path: '*', element: <Navigate to="/login" replace /> },
  ];
}
