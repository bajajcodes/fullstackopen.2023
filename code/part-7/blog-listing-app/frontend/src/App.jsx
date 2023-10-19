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
import { useContext, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import BlogForm from "./components/BlogForm";
import helpers from "./utils/helpers";
import BlogList from "./components/BlogList";
import Togglable from "./components/Togglable";
import * as userActions from "./reducers/user.reducer";
import NotificationContext from "./contexts/notification.context";
import { useQuery, useMutation, useQueryClient } from "react-query";
import blogService from "./service/blog.service";

function App() {
  const queryClient = useQueryClient();
  const { getNotification, setNotification } = useContext(NotificationContext);
  const getBlogsResult = useQuery({
    queryKey: ["blogs"],
    queryFn: blogService.getAll,
  });
  const newBlogMutation = useMutation(blogService.create, {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
    },
  });
  const updateBlogMutation = useMutation(blogService.update, {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
    },
  });
  const deleteBlogMutation = useMutation(blogService.remove, {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
    },
  });
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const blogFormRef = useRef();

  const notification = getNotification();

  function logoutUserWrapper() {
    dispatch(userActions.logoutUser());
  }

  const addBlog = async (blogObject) => {
    try {
      blogFormRef.current.toggleVisibility();
      newBlogMutation.mutate(blogObject);
      setNotification(
        `successfully added ${blogObject.title} as blog list item`
      );
    } catch (error) {
      const message = helpers.getErrorMessage(error);
      setNotification(message);
    }
  };

  const loginUser = async (credentials) => {
    try {
      dispatch(userActions.loginUserAC(credentials));
      setNotification(`successfully logged in, ${user.name}`);
    } catch (error) {
      const message = helpers.getErrorMessage(error);
      setNotification(message);
    }
  };

  // TODO: update likes on local first
  const increaseLikes = async (id, blogObject) => {
    try {
      updateBlogMutation.mutate({ id, ...blogObject });
      setNotification(`successfully increased likes, for ${blogObject.title}`);
    } catch (error) {
      const message = helpers.getErrorMessage(error);
      setNotification(message);
    }
  };

  const onRefresh = () => {
    queryClient.invalidateQueries("blogs");
  };

  const removeBlog = async (id, blogObject) => {
    try {
      if (!window.confirm(`Remove blog ${blogObject.title}`)) return;
      deleteBlogMutation.mutate(id);
      setNotification(`successfully deleted, ${blogObject.title}`);
    } catch (error) {
      const message = helpers.getErrorMessage(error);
      setNotification(message);
    }
  };

  useEffect(() => {
    dispatch(userActions.reLoginUser());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const sortedBlogs = [...(getBlogsResult.data || [])].sort(
    (a, b) => b.likes - a.likes
  );

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
            <Button
              onClick={() => logoutUserWrapper()}
              variant="solid"
              size="xs"
            >
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
            isLoading={getBlogsResult.isLoading}
          />
        </>
      )}
    </Container>
  );
}

export default App;
