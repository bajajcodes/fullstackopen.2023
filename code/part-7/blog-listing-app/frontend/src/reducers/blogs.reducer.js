import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
} from "@reduxjs/toolkit";
import blogService from "../service/blog.service";

const getBlogs = createAsyncThunk("blogs/getBlogs", async () => {
  return await blogService.getAll();
});

const saveNewBlog = createAsyncThunk(
  "blogs/saveNewBlog",
  async (blogObject) => {
    return await blogService.create(blogObject);
  }
);

const removeBlog = createAsyncThunk("blogs/removeBlog", async (id) => {
  await blogService.remove(id);
});

const updateBlog = createAsyncThunk(
  "blogs/updateBlog",
  async ({ id, blogObject }) => {
    console.log({ id, blogObject });
    try {
      return await blogService.update(id, blogObject);
    } catch (error) {
      console.log({ error });
    }
  }
);

const blogsAdapter = createEntityAdapter({
  selectId: (blog) => blog.id,
});
const initialState = blogsAdapter.getInitialState({ status: "idle", data: [] });

const blogsSlice = createSlice({
  name: "blogs",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getBlogs.pending, (state, _) => {
        state.status = "loading";
      })
      .addCase(getBlogs.rejected, (state, _) => {
        blogsAdapter.setAll(state, []);
        state.status = "failed";
      })
      .addCase(getBlogs.fulfilled, (state, action) => {
        state.data = action.payload;
        state.status = "idle";
      })
      .addCase(saveNewBlog.fulfilled, blogsAdapter.addOne)
      .addCase(removeBlog.fulfilled, blogsAdapter.removeOne)
      .addCase(updateBlog.fulfilled, blogsAdapter.updateOne);
  },
});

const blogsReducer = blogsSlice.reducer;

export default blogsReducer;
export { getBlogs, removeBlog, saveNewBlog, updateBlog };
