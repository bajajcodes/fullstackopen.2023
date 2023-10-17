import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import BlogForm from "./BlogForm";
import userEvent from "@testing-library/user-event";

describe("<BlogForm />", () => {
  test("check, that the form calls the event handler it received as props with the right details when a new blog is created", async () => {
    const addBlog = jest.fn();
    const user = userEvent.setup();

    render(<BlogForm addBlog={addBlog} />);

    const authorInput = screen.getByRole("textbox", { name: "author" });
    const titleInput = screen.getByRole("textbox", { name: "title" });
    const urlInput = screen.getByRole("textbox", { name: "url" });
    const addButton = screen.getByRole("button", /add/i);

    await user.type(authorInput, "testing a form with author input...");
    await user.type(titleInput, "testing a form with title input...");
    await user.type(urlInput, "https://shmbajaj.dev");
    await user.click(addButton);

    expect(addBlog.mock.calls).toHaveLength(1);
    expect(addBlog.mock.calls[0][0].title).toBe(
      "testing a form with title input..."
    );
  });
});
