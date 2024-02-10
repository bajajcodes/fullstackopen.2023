import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { protectedRoutes } from './routes/protected';
import { publicRoutes } from './routes/public';
import { useAuth } from './hooks/useAuth';
import { useSubscription } from '@apollo/client';
import { GET_FAVOURITE_GENRE_BOOKS, NEW_BOOK_ADDED } from './queries';

const App = () => {
  const router = createBrowserRouter([
    useAuth() ? protectedRoutes() : {},
    ...(useAuth() ? [] : publicRoutes()),
  ]);

  useSubscription(NEW_BOOK_ADDED, {
    onData: ({ data, client }) => {
      // window.alert(JSON.stringify(data.data.bookAdded));
      client.cache.updateQuery({ query: GET_FAVOURITE_GENRE_BOOKS }, (idk) => {
        console.log({ idk, data, client });
      });
    },
  });

  return <RouterProvider router={router} />;
};

export default App;
