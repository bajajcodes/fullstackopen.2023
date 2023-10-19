import React from "react";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Blog from "./Blog";

test("renders content", async () => {
  const props = {
    title: "Component testing is done with react-testing-library",
    author: "shmbajaj",
    url: "https://shmbajaj.dev",
    likes: 11,
  };
  const mockOnIncreaseLikes = jest.fn();
  const mockOnRemoveBlog = jest.fn();

  const { container } = render(
    <Blog
      {...props}
      onIncreaseLikes={mockOnIncreaseLikes}
      onRemoveBlog={mockOnRemoveBlog}
    />
  );
  const element = container.querySelector("[data-test-blog]");
  // screen.debug(element);

  const user = userEvent.setup();
  const showButton = screen.getByText(/show/i);
  await user.click(showButton);

  const likeButton = screen.getByRole("button", { name: /like-blog/i });
  await user.click(likeButton);

  expect(element).toHaveTextContent(props.title);
  expect(mockOnIncreaseLikes.mock.calls).toHaveLength(1);
});
