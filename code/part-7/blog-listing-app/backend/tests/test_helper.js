const Blog = require("../models/blog");
const User = require("../models/user");

const initialBlogs = [
  {
    title: "Blog #1",
    author: "Shubham Bajaj",
    url: "https://shmbajaj.dev",
    likes: 1,
    user: "65184f1a9f2d3cf433750f42",
  },
  {
    title: "Blog #2",
    author: "Shubham Bajaj",
    url: "https://shmbajaj.dev",
    likes: 12,
    user: "65184f1a9f2d3cf433750f42",
  },
];

const nonExistingId = async () => {
  const blog = new Blog({
    title: "will remove this soon",
    author: "Shubham Bajaj",
    url: "https://shmbajaj.dev",
    likes: 1,
  });
  await blog.save();
  await blog.deleteOne();

  return blog._id.toString();
};

const blogsInDB = async () => {
  const blogs = await Blog.find({});
  return blogs.map((blog) => blog.toJSON());
};

const usersInDB = async () => {
  const users = await User.find({});
  return users.map((user) => user.toJSON());
};

module.exports = {
  initialBlogs,
  nonExistingId,
  blogsInDB,
  usersInDB,
};
