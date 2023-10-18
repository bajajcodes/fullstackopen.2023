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
import { useSelector, useDispatch } from "react-redux";
import BlogForm from "./components/BlogForm";
import constants from "./utils/constants";
import blogService from "./service/blog.service";
import loginService from "./service/login.service";
import helpers from "./utils/helpers";
import BlogList from "./components/BlogList";
import Togglable from "./components/Togglable";
import { showNotification } from "./reducers/notification.reducer";
import * as blogActions from "./reducers/blogs.reducer";

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
  const notification = useSelector((state) => state.notification);
  const { data: blogs, status } = useSelector((state) => state.blogs);
  const isLoading = status === "loading";
  const dispatch = useDispatch();

  const blogFormRef = useRef();

  function handleLogout() {
    setUser(null);
    window.localStorage.removeItem(constants.BROWSER_STORAGE_USER_NAME_kEY);
  }

  function showNotificationWrapper(message) {
    dispatch(showNotification(message));
  }

  function getBlogsWrapper() {
    dispatch(blogActions.getBlogs());
  }

  const addBlog = async (blogObject) => {
    try {
      blogFormRef.current.toggleVisibility();
      dispatch(blogActions.saveNewBlog(blogObject));
      getBlogsWrapper();
      showNotificationWrapper(
        `successfully added ${blogObject.title} as blog list item`
      );
    } catch (error) {
      const message = helpers.getErrorMessage(error);
      showNotificationWrapper(message);
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
      showNotificationWrapper(`successfully logged in, ${user.name}`);
    } catch (error) {
      const message = helpers.getErrorMessage(error);
      showNotificationWrapper(message);
    }
  };

  // TODO: update likes on local first
  const increaseLikes = async (id, blogObject) => {
    try {
      dispatch(blogActions.updateBlog({ blogObject, id }));
      getBlogsWrapper();
      showNotificationWrapper(
        `successfully increased likes, for ${blogObject.title}`
      );
    } catch (error) {
      const message = helpers.getErrorMessage(error);
      showNotificationWrapper(message);
    }
  };

  const onRefresh = () => {
    getBlogsWrapper();
  };

  const removeBlog = async (id, blogObject) => {
    try {
      if (!window.confirm(`Remove blog ${blogObject.title}`)) return;
      dispatch(blogActions.removeBlog(id));
      showNotificationWrapper(`successfully deleted, ${blogObject.title}`);
    } catch (error) {
      const message = helpers.getErrorMessage(error);
      showNotificationWrapper(message);
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
    getBlogsWrapper();
  }, []);

  const sortedBlogs = [...blogs].sort((a, b) => b.likes - a.likes);

  return (
    <Container maxW="container.md" centerContent>
      <Heading as="h1">Blog Listing App</Heading>
      {notification.message && (
        <Alert status={notification.type || "info"}>
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
