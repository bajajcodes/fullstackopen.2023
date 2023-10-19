const listHelper = require("../utils/list_helper");

test("dummy returns one", () => {
  expect(listHelper.dummy([])).toBe(1);
});

describe("total likes", () => {
  test("of empty list is zero", () => {
    expect(listHelper.totalLikes([])).toBe(0);
  });

  test("when list has only blog equals the likes of that", () => {
    expect(
      listHelper.totalLikes([
        {
          likes: 10,
        },
      ])
    ).toBe(10);
  });

  test("of a bigger list is calculated right", () => {
    expect(
      listHelper.totalLikes([
        {
          likes: 8,
        },
        {
          likes: 4,
        },
        {
          likes: 2,
        },
        {
          likes: 1,
        },
      ])
    ).toBe(15);
  });
});

describe("Favourite blog", () => {
  const blogs = [
    {
      title: "Canonical string reduction",
      author: "Edsger W. Dijkstra",
      likes: 1,
    },
    {
      title: "Canonical string reduction",
      author: "Edsger W. Dijkstra",
      likes: 2,
    },
    {
      title: "Canonical string reduction",
      author: "Edsger W. Dijkstra",
      likes: 4,
    },
    {
      title: "Canonical string reduction",
      author: "Edsger W. Dijkstra",
      likes: 6,
    },
    {
      title: "Canonical string reduction",
      author: "Edsger W. Dijkstra",
      likes: 12,
    },
    {
      title: "Canonical string reduction",
      author: "Edsger W. Dijkstra",
      likes: 10,
    },
    {
      title: "Canonical string reduction",
      author: "Edsger W. Dijkstra",
      likes: 8,
    },
  ];

  test("running for fun, already familar with simple automated testing", () => {
    expect(listHelper.favoriteBlog(blogs)).toEqual({
      title: "Canonical string reduction",
      author: "Edsger W. Dijkstra",
      likes: 12,
    });
  });
});
