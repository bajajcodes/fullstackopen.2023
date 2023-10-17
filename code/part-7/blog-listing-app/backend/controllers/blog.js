const blogRouter = require("express").Router();
const Blog = require("../models/blog");
const middleware = require("../utils/middleware");

blogRouter.get("/", async (_, response) => {
  const blogs = await Blog.find({}).populate("user", { username: 1, name: 1 });
  return response.json(blogs);
});

blogRouter.get("/:id", async (request, response) => {
  const id = request.params.id;
  const blog = await Blog.findById(id).populate("user", {
    username: 1,
    name: 1,
  });
  if (!blog) return response.status(404).end();
  return response.json(blog);
});

blogRouter.get("/info", async (_, response) => {
  const blogs = await Blog.find({});
  return response.send(
    `<p>Blogs has info for ${
      blogs.length
    } blogs</p> <br /> <p>${new Date().toLocaleString()}</p>`
  );
});

blogRouter.delete("/:id", middleware.verifyToken, async (request, response) => {
  const decodedToken = request.decodedToken;
  const id = request.params.id;
  const blog = await Blog.findById(id);
  if (!blog) return response.status(404).end();
  if (blog.user.toString() !== decodedToken.id) {
    return response.status(401).send({ error: "invalid user" });
  }
  const deletedBlog = await Blog.findByIdAndRemove(id);
  if (!deletedBlog) return response.status(404).end();
  return response.status(204).end();
});

blogRouter.post(
  "/",
  middleware.verifyToken,
  middleware.userExtractor,
  async (request, response) => {
    const payload = request.body;
    payload.likes = request.body.likes || 0;
    const user = request.user;
    const blog = new Blog({ ...payload, user: user.id });
    const savedBlog = await blog.save();
    user.blogs = user.blogs.concat(savedBlog._id);

    await user.save();

    return response.status(201).json(savedBlog);
  }
);

blogRouter.put("/:id", async (request, response) => {
  const id = request.params.id;
  const payload = request.body;

  const updatedBlog = await Blog.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
    context: "query",
  });
  if (!updatedBlog) return response.status(404).end();
  return response.json(updatedBlog);
});

module.exports = blogRouter;
