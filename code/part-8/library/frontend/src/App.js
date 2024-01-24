import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { protectedRoutes } from './routes/protected';
import { publicRoutes } from './routes/public';
import { useAuth } from './hooks/useAuth';

const App = () => {
  const router = createBrowserRouter([
    useAuth() ? protectedRoutes() : {},
    ...(useAuth() ? [] : publicRoutes()),
  ]);

  console.log({ router, useAuth: useAuth() });

  return <RouterProvider router={router} />;
};

export default App;
