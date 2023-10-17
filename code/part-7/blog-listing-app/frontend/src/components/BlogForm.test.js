import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import BlogForm from "./BlogForm";
import userEvent from "@testing-library/user-event";

test("<BlogForm /> updates parent state and calls onSubmit", async () => {
  const addBlog = jest.fn();
  const user = userEvent.setup();

  const { container } = render(<BlogForm addBlog={addBlog} />);
  //   const element = container.querySelector("[data-test-blog-form]");

  const authorInput = screen.getByRole("textbox", { name: "author" });
  const titleInput = screen.getByRole("textbox", { name: "title" });
  const urlInput = screen.getByRole("textbox", { name: "url" });
  const sendButton = screen.getByRole("button", /add/i);

  await user.type(authorInput, "testing a form with author input...");
  await user.type(titleInput, "testing a form with title input...");
  await user.type(urlInput, "https://shmbajaj.dev");
  //   screen.debug(element);
  await user.click(sendButton);

  expect(addBlog.mock.calls).toHaveLength(1);
  expect(addBlog.mock.calls[0][0].title).toBe(
    "testing a form with title input..."
  );
});
