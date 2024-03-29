import { lazy } from 'react';
import { Layout } from '../components/Layout';
import { Navigate } from 'react-router-dom';

const Authors = lazy(() => import('../components/Authors'));
const Books = lazy(() => import('../components/Books'));
const NewBook = lazy(() => import('../components/NewBook'));
const Recommendations = lazy(() => import('../components/Recommendations'));

export function protectedRoutes() {
  return {
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <Authors />,
      },
      {
        element: <Authors />,
        path: 'authors',
      },
      {
        path: 'books',
        element: <Books />,
      },
      {
        path: 'add',
        element: <NewBook />,
      },
      {
        path: 'recommendations',
        element: <Recommendations />,
      },
      { path: '*', element: <Navigate to="/" replace /> },
    ],
  };
}
