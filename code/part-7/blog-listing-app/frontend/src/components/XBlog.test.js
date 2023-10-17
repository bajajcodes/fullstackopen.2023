import React from "react";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Blog from "./Blog";

describe("<Blog />", () => {
  test("checks that the component displaying a blog renders the blog's title, but does not render its number of likes by default.", () => {
    const props = {
      title: "Component testing is done with react-testing-library",
      author: "shmbajaj",
      url: "https://shmbajaj.dev",
      likes: 11,
    };

    const { container } = render(<Blog {...props} />);
    const blogHeader = container.querySelector("[data-test-blog-header]");

    const likes = screen.queryByRole("textbox", { name: "blog-like" });

    expect(blogHeader).toHaveTextContent(props.title);
    expect(likes).toBeNull();
  });

  test("checks that the blog's number of likes are shown when the button controlling the shown details has been clicked.", async () => {
    const props = {
      title: "Component testing is done with react-testing-library",
      author: "shmbajaj",
      url: "https://shmbajaj.dev",
      likes: 11,
    };

    const user = userEvent.setup();
    const { container } = render(<Blog {...props} />);
    let toggleVisibilityButton = container.querySelector(".toggleVisibility");

    expect(toggleVisibilityButton).toHaveTextContent(/show/i);

    let likes = container.querySelector("[data-test-blog-likes]");

    expect(likes).toBeNull();

    await user.click(toggleVisibilityButton);

    expect(toggleVisibilityButton).toHaveTextContent(/hide/i);

    likes = container.querySelector("[data-test-blog-likes]");
    screen.debug(container.querySelector("[data-test-blog]"));
    expect(likes).not.toBeNull();
  });

  test("cheks that if the like button is clicked twice, the event handler the component received as props is called twice.", async () => {
    const props = {
      title: "Component testing is done with react-testing-library",
      author: "shmbajaj",
      url: "https://shmbajaj.dev",
      likes: 11,
    };
    const user = userEvent.setup();
    const mockOnIncreaseLikes = jest.fn();
    const { container } = render(
      <Blog {...props} onIncreaseLikes={mockOnIncreaseLikes} />
    );

    let toggleVisibilityButton = container.querySelector(".toggleVisibility");

    await user.click(toggleVisibilityButton);
    const likeButton = screen.getByRole("button", { name: /like-blog/i });
    await user.click(likeButton);
    await user.click(likeButton);

    expect(mockOnIncreaseLikes.mock.calls).toHaveLength(2);
  });
});
