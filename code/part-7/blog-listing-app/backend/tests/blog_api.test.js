const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const supertest = require("supertest");
const app = require("../app");
const Blog = require("../models/blog");
const User = require("../models/user");
const helper = require("./test_helper");

const api = supertest(app);

beforeEach(async () => {
  await Blog.deleteMany({});
  await User.deleteMany({});
  const passwordHash = await bcrypt.hash("sekret", 10);
  const user = new User({ username: "root", name: "root", passwordHash });
  const savedUser = await user.save();
  const userID = savedUser._id.toString();
  await Blog.insertMany(
    helper.initialBlogs.map((blog) => ({ ...blog, user: userID }))
  );
}, 100000);

test("blogs are returned as json", async () => {
  await api
    .get("/api/blogs")
    .expect(200)
    .expect("Content-Type", /application\/json/);
});

test("all blogs are returned", async () => {
  const response = await api.get("/api/blogs");
  expect(response.body).toHaveLength(helper.initialBlogs.length);
});

test("a specific blog is within the returned blogs", async () => {
  const response = await api.get("/api/blogs");

  const titles = response.body.map((b) => b.title);
  expect(titles).toContain("Blog #1");
});

test("a valid blog can be added", async () => {
  const newBlog = {
    title: "async/await simplifies making async calls",
    author: "fullstackopen",
    url: "https://fullstackopen.com/en/part4/testing_the_backend#more-tests-and-refactoring-the-backend",
    likes: 100,
  };

  const response = await api.post("/api/login").send({
    username: "root",
    password: "sekret",
  });

  await api
    .post("/api/blogs")
    .set("Authorization", `Bearer ${response.body.token}`)
    .send(newBlog)
    .expect(201)
    .expect("Content-Type", /application\/json/);

  const blogsAtEnd = await helper.blogsInDB();
  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1);

  const titles = blogsAtEnd.map((b) => b.title);
  expect(titles).toContain("async/await simplifies making async calls");
});

test("blog without title is not added", async () => {
  const newBlog = {
    author: "fullstackopen",
    url: "https://fullstackopen.com/en/part4/testing_the_backend#more-tests-and-refactoring-the-backend",
    likes: 100,
  };

  const response = await api.post("/api/login").send({
    username: "root",
    password: "sekret",
  });

  await api
    .post("/api/blogs")
    .set("Authorization", `Bearer ${response.body.token}`)
    .send(newBlog)
    .expect(400);

  const blogsAtEnd = await helper.blogsInDB();
  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length);
});

// INFO: cheap shot
test("a specific blog can be viewed", async () => {
  const blogsAtStart = await helper.blogsInDB();

  const blogToView = blogsAtStart[0];
  blogToView.user = blogToView.user.toString();

  const resultBlog = await api
    .get(`/api/blogs/${blogToView.id}`)
    .expect(200)
    .expect("Content-Type", /application\/json/);

  resultBlog.body.user = resultBlog.body.user.id;
  expect(resultBlog.body).toEqual(blogToView);
});

test("a blog can be deleted", async () => {
  const blogsAtStart = await helper.blogsInDB();
  const blogToBeDelted = blogsAtStart[0];

  const response = await api.post("/api/login").send({
    username: "root",
    password: "sekret",
  });

  await api
    .delete(`/api/blogs/${blogToBeDelted.id}`)
    .set("Authorization", `Bearer ${response.body.token}`)
    .expect(204);

  const blogsAtEnd = await helper.blogsInDB();

  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length - 1);

  const titles = blogsAtEnd.map((r) => r.title);

  expect(titles).not.toContain(blogToBeDelted.title);
});

test("Blog list tests, step4", async () => {
  const blogToBeAdded = {
    title: "new blog",
    author: "unknnown",
    url: "https://google.com",
  };

  const response = await api.post("/api/login").send({
    username: "root",
    password: "sekret",
  });

  await api
    .post("/api/blogs")
    .set("Authorization", `Bearer ${response.body.token}`)
    .send(blogToBeAdded);
  const blogsAtEnd = await helper.blogsInDB();
  const blogToView = blogsAtEnd[helper.initialBlogs.length];
  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1);
  expect(blogToView.likes).toBe(0);
});

afterAll(async () => {
  await mongoose.connection.close();
});
