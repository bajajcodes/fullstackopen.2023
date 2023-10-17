describe("bloglist end to end testing step4 - step7", () => {
  beforeEach(function () {
    cy.request("POST", `${Cypress.env("BACKEND")}/testing/reset`);
    cy.addUser();
    cy.login({ username: "mockuser", password: "mockuser" });
  });

  it("creates a blog", () => {
    cy.contains("New Blog").click();
    cy.get("input[name=author]").type("mocked user");
    cy.get("input[name=title]").type("new blog using mocked user");
    cy.get("input[name=url]").type("https://mocked.user");

    cy.get("button[type=submit]").click();
    cy.contains(
      "successfully added new blog using mocked user as blog list item"
    );

    cy.contains("Show").click();
    cy.contains("button", "Like").click();
    cy.contains("Show").click();
    cy.get("[data-test-blog-likes]").should("have.text", 1);
  });

  it("ensuring that only the creator can see the delete button of a blog, not anyone else", () => {
    // user is already logged in
    cy.addBlog({
      author: "mockedUser",
      title: "Blog#1",
      url: "https://mocked.user",
    });
    cy.addBlog({
      author: "mockedUser",
      title: "Blog#2",
      url: "https://mocked.user",
    });

    cy.get("[data-test-blog]").then((blogs) => {
      console.log(`number of blogs: ${blogs.length}`);
      cy.wrap(blogs[0]).contains("Remove");
      cy.wrap(blogs[1]).contains("Remove");
    });

    // logout the user
    cy.contains("Logout").click();

    // then create new user and make it login
    cy.addUser({
      username: "satparkash",
      password: "satparkash",
      name: "satparkash",
    });

    cy.login({ username: "satparkash", password: "satparkash" });

    cy.get("[data-test-blog]").then((blogs) => {
      console.log(`number of blogs: ${blogs.length}`);
      cy.wrap(blogs[0]).contains("Remove").should("not.exist");
      cy.wrap(blogs[1]).contains("Remove").should("not.exist");
    });
  });

  it("checks that the blogs are ordered according to likes with the blog with the most likes being first", () => {
    const expectedBlogTitlesInSortOrder = [
      "Blog#1",
      "Blog#2",
      "Blog#4",
      "Blog#3",
    ];
    cy.addBlog({
      author: "mockedUser",
      title: "Blog#1",
      url: "https://mocked.user",
      likes: 10,
    });
    cy.addBlog({
      author: "mockedUser",
      title: "Blog#2",
      url: "https://mocked.user",
      likes: 8,
    });
    cy.addBlog({
      author: "mockedUser",
      title: "Blog#3",
      url: "https://mocked.user",
      likes: 1,
    });
    cy.addBlog({
      author: "mockedUser",
      title: "Blog#4",
      url: "https://mocked.user",
      likes: 2,
    });

    cy.visit("");

    cy.get("[data-test-blog]").then((blogs) => {
      console.log(`number of blogs: ${blogs.length}`);
      Array.from(blogs).forEach((blog, index) => {
        cy.wrap(blog)
          .get("[data-test-blog-header]")
          .contains(expectedBlogTitlesInSortOrder[index]);
      });
    });
  });
});
