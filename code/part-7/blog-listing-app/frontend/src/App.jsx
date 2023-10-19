import {
  Alert,
  AlertIcon,
  Button,
  Container,
  Flex,
  Heading,
  Spacer,
  Text,
} from "@chakra-ui/react";
import LoginForm from "./components/LoginForm";
import { useContext, useEffect } from "react";
import helpers from "./utils/helpers";
import Togglable from "./components/Togglable";
import NotificationContext from "./contexts/notification.context";
import AuthContext from "./contexts/auth.context";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Root from "./routes/root";
import ErrorPage from "./routes/error-page";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
  },
]);

function App() {
  const { getNotification, setNotification } = useContext(NotificationContext);
  const { login, logout, reLoginUser, getLoggedInUserInfo } =
    useContext(AuthContext);

  const notification = getNotification();
  const user = getLoggedInUserInfo();

  const loginUser = async (credentials) => {
    try {
      // dispatch(userActions.loginUserAC(credentials));
      login(credentials);
      setNotification(`successfully logged in, ${user.name}`);
    } catch (error) {
      const message = helpers.getErrorMessage(error);
      setNotification(message);
    }
  };

  useEffect(() => {
    reLoginUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Container maxW="container.md" centerContent>
      <Heading as="h1">Blog Listing App</Heading>
      {notification && (
        <Alert status={notification.type || "info"}>
          <AlertIcon /> {notification}
        </Alert>
      )}
      {!user && (
        <Togglable buttonLabel="Login">
          <LoginForm loginUser={loginUser} />
        </Togglable>
      )}
      {user && (
        <>
          <Flex align={"center"} wrap="wrap" justify="center" gap={2} mt={2}>
            <Text>{user.name} logged in</Text> <Spacer />{" "}
            <Button onClick={() => logout()} variant="solid" size="xs">
              Logout
            </Button>
          </Flex>
        </>
      )}
      <RouterProvider router={router} />
    </Container>
  );
}

export default App;
