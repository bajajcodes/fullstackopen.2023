const dummy = () => {
  return 1;
};

const totalLikes = (blogs) => {
  const reducer = (sum, item) => {
    return sum + item.likes;
  };

  return blogs.reduce(reducer, 0);
};

const favoriteBlog = (blogs) => {
  return blogs.reduce((acc, blog) => (blog.likes >= acc.likes ? blog : acc), {
    likes: 0,
  });
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
};
