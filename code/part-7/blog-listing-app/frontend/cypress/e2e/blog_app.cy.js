describe("Blog app", () => {
  beforeEach(function () {
    cy.visit("http://localhost:5173");
  });

  it("front page can be openned", () => {
    cy.contains("Blog Listing App");
    cy.contains("Login");
  });

  it("login-form can be opened", function () {
    cy.contains("Login").click();
    cy.get("input[name=username]").type("satparkash");
    cy.get("input[name=password]").type("satparkash");
    cy.get("button[type=submit]").click();

    cy.contains("satparkash logged in");
  });
});

describe.only("when logged in", () => {
  beforeEach(function () {
    cy.login({ username: "mockuser", password: "mockuser" });
    cy.addBlog({
      title: "shubham bajaj",
      url: "https://shmbajaj.dev",
      author: "shubham bajaj",
    });
  });

  it("a new blog can be added", function () {
    cy.contains("New Blog").click();
    cy.get("input[name=author]").type("shubham bajaj");
    cy.get("input[name=title]").type("new blog using e2e cypress");
    cy.get("input[name=url]").type("https://shmbajaj.dev");

    cy.get("button[type=submit]").click();
    cy.contains(
      "successfully added new blog using e2e cypress as blog list item"
    );
  });
});

describe("controlling-the-state-of-the-database", () => {
  beforeEach(function () {
    cy.addUser();
    cy.login({ username: "mockuser", password: "mockuser" });
  });

  it("passed login test", () => {
    cy.get("html").should("contain", "mockuser logged in");
  });
});
