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
import { useEffect, useRef, useState } from "react";
import BlogForm from "./components/BlogForm";
import constants from "./utils/constants";
import blogService from "./service/blog.service";
import loginService from "./service/login.service";
import helpers from "./utils/helpers";
import BlogList from "./components/BlogList";
import Togglable from "./components/Togglable";

let notificationTimeoutId = null;

function App() {
  /**
   * token: string,
   * username: string,
   * name: string
   */
  const [user, setUser] = useState(null);
  /**
   * type: 'info'  | 'error'
   * message
   */
  const [notification, setNotification] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const blogFormRef = useRef();

  function handleLogout() {
    setUser(null);
    window.localStorage.removeItem(constants.BROWSER_STORAGE_USER_NAME_kEY);
  }

  function showNotification({ type = "info", message }) {
    if (!message || (message?.trim()?.length || 0) < 1) return;
    if (notificationTimeoutId) clearTimeout(notificationTimeoutId);
    setNotification({ type, message });
    notificationTimeoutId = setTimeout(() => setNotification(null), 5000);
  }

  const addBlog = async (blogObject) => {
    try {
      setIsLoading(true);
      blogFormRef.current.toggleVisibility();
      const response = await blogService.create(blogObject);
      showNotification({
        type: "info",
        message: `successfully added ${response.title} as blog list item`,
      });
      await getBlogs();
    } catch (error) {
      const message = helpers.getErrorMessage(error);
      showNotification({ type: "error", message });
    } finally {
      setIsLoading(false);
    }
  };

  const loginUser = async (credentials) => {
    try {
      const user = await loginService.login(credentials);
      window.localStorage.setItem(
        constants.BROWSER_STORAGE_USER_NAME_kEY,
        JSON.stringify(user)
      );
      blogService.setToken(user.token);
      setUser?.(user);
      showNotification({
        type: "info",
        message: `successfully logged in, ${user.name}`,
      });
    } catch (error) {
      const message = helpers.getErrorMessage(error);
      showNotification({ type: "error", message });
    }
  };

  // TODO: update likes on local first
  const increaseLikes = async (id, blogObject) => {
    try {
      setIsLoading(true);
      const response = await blogService.update(id, blogObject);
      showNotification({
        type: "info",
        message: `successfully increased likes, for ${response.title}`,
      });
      await getBlogs();
    } catch (error) {
      const message = helpers.getErrorMessage(error);
      showNotification({ type: "error", message });
    } finally {
      setIsLoading(false);
    }
  };

  const getBlogs = async () => {
    const blogList = await blogService.getAll();
    setBlogs(blogList);
    setIsLoading(false);
  };

  const onRefresh = async () => {
    setIsLoading(true);
    await getBlogs();
  };

  const removeBlog = async (id, blogObject) => {
    try {
      setIsLoading(true);
      if (!window.confirm(`Remove blog ${blogObject.title}`)) return;
      const response = await blogService.remove(id);
      showNotification({
        type: "info",
        message: `successfully deleted, ${response.title}`,
      });
      await getBlogs();
    } catch (error) {
      const message = helpers.getErrorMessage(error);
      showNotification({ type: "error", message });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem(
      constants.BROWSER_STORAGE_USER_NAME_kEY
    );
    if (!loggedUserJSON) return;
    const user = JSON.parse(loggedUserJSON);
    setUser(user);
    blogService.setToken(user.token);
    getBlogs();
  }, []);

  const sortedBlogs = [...blogs].sort((a, b) => b.likes - a.likes);

  return (
    <Container maxW="container.md" centerContent>
      <Heading as="h1">Blog Listing App</Heading>
      {notification && (
        <Alert status={notification.type}>
          <AlertIcon /> {notification.message}
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
            <Button onClick={handleLogout} variant="solid" size="xs">
              Logout
            </Button>
          </Flex>
          <Togglable buttonLabel="New Blog" ref={blogFormRef}>
            <BlogForm addBlog={addBlog} />
          </Togglable>
          <BlogList
            onRefresh={onRefresh}
            onIncreaseLikes={increaseLikes}
            onRemoveBlog={removeBlog}
            blogs={sortedBlogs}
            isLoading={isLoading}
          />
        </>
      )}
    </Container>
  );
}

export default App;
