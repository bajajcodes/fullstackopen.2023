import BlogList from "../components/BlogList";
import Togglable from "../components/Togglable";
import BlogForm from "../components/BlogForm";
import * as userActions from "../reducers/user.reducer";
import { useContext, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { useQuery, useMutation, useQueryClient } from "react-query";
import NotificationContext from "../contexts/notification.context";
import blogService from "../service/blog.service";
import helpers from "../utils/helpers";

export default function Root() {
  const queryClient = useQueryClient();
  const { setNotification } = useContext(NotificationContext);
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
  const dispatch = useDispatch();
  const blogFormRef = useRef();

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
    <>
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
  );
}
