const DEFAULT_USER_CREDENTIALS = {
  username: "mockuser",
  password: "mockuser",
  name: "mockuser",
};

Cypress.Commands.add("login", (credentials) => {
  cy.request("POST", `${Cypress.env("BACKEND")}/login`, credentials).then(
    ({ body }) => {
      localStorage.setItem("loggedBlogListappUser", JSON.stringify(body));
      cy.visit("");
    }
  );
});

Cypress.Commands.add("addUser", (user = DEFAULT_USER_CREDENTIALS) => {
  // cy.request("POST", `${Cypress.env("BACKEND")}/testing/reset`);
  // const user = {
  //   username: "mockuser",
  //   password: "mockuser",
  //   name: "mockuser",
  // };
  cy.request("POST", `${Cypress.env("BACKEND")}/users`, user).then(() =>
    cy.visit("")
  );
});

Cypress.Commands.add("addBlog", (payload) => {
  cy.request({
    url: `${Cypress.env("BACKEND")}/blogs`,
    method: "POST",
    body: payload,
    headers: {
      Authorization: `Bearer ${
        JSON.parse(window.localStorage.getItem("loggedBlogListappUser")).token
      }`,
    },
  });
  // cy.visit("");
});
