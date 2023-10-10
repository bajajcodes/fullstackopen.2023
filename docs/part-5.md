# Part5: Testing React Apps

This part teaches about Testing Driven Development, unit testing, and end to end testing driven development.

The gist of this part is to teach about testing, types of testing, and `How to development following TDD`.

This part contains total of 4 sections:
- Login in frontend
- props.children and prototypes
- Testing React apps
- End to end testing

## Login in frontend

This section had taught me, more good on how to use local storage for storing 
and using the tokens more effecticvely.

In short, better implementation than previously used to.

> [Login In Frontend](https://fullstackopen.com/en/part5/login_in_frontend)

## props.children and prototypes

This section had `useImperativeHandle` hook and `eslint` setup for me, for to be noted.

The `useImperativeHandle` function is a React hook, that is used for defining functions in a component, which can be invoked from outside of the component.

### ESlint Setup

> > file: .eslintrc.cjs

```js
module.exports = {
  root: true,
  env: {
    browser: true,
    es2020: true,
    "jest/globals": true
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
  settings: { react: { version: '18.2' } },
  plugins: ['react-refresh', 'jest'],
  rules: {
    "indent": [
        "error",
        2  
    ],
    "linebreak-style": [
        "error",
        "unix"
    ],
    "quotes": [
        "error",
        "single"
    ],
    "semi": [
        "error",
        "never"
    ],
    "eqeqeq": "error",
    "no-trailing-spaces": "error",
    "object-curly-spacing": [
        "error", "always"
    ],
    "arrow-spacing": [
        "error", { "before": true, "after": true }
    ],
    "no-console": 0,
    "react/prop-types": 0,
    "react/react-in-jsx-scope": "off",
    "react/prop-types": 0,
    "no-unused-vars": 0    
  },
}
```

```sh
touch .eslintignore
```


## Testing React apps
This section is all about unit testing react components using [jest](https://jestjs.io/) and [react-testing-library](https://github.com/testing-library/react-testing-library). Sections starts with teaching about how to setup both packages for testing react components, and then get starts with testing components.

<details>

<summary>
Steps to Setup Jest and RTL
</summary>
<br />

1. Install packages

```ts
npm install --save-dev @testing-library/react @testing-library/jest-dom jest-environment-jsdom @babel/preset-env @babel/preset-react
```

2. Create npm script
>> file: package.json
```ts
{
  scripts: {
    "test": "jest"
  },
  jest: {
    "testEnvironment": "jsdom"
  }
}
```

3. Create `.babelrc`

```sh
touch .babelrc
```

```ts
{
  "presets": [
    "@babel/preset-env",
    ["@babel/preset-react", { "runtime": "automatic" }]
  ]
}
```
</details>

### Notes
- Store test files and component code in same directory
- To print HTML of a component use (to debug tests)
```js
screen.debug();
```
- To find elements prefer data-tags over css, ids, others
- To become beast in testing, drink the following [EmberJS Guide on Testing](https://guides.emberjs.com/release/testing/)
- Check test coverage
```js
npm test -- --coverage --collectCoverageFrom='src/**/*.{jsx,js}'
```

## End to end testing

This section teaches how to test web apps end to end, from frontend to backend till to the database layer. For E2E testing, [Cypress](https://www.cypress.io/) is used. By the end, I learned how to setup cypress, write simple e2e tests, automate repeating stuff as `custom-commands`, and `Bypassing the UI`.

<details>
<summary>Steps to Setup Cypress</summary>

<br />

1. Install Packages

```sh
npm install --save-dev cypress
```

2. Adding an npm script to run tests

> We also made a small change to the script that starts the application, without the change Cypress can not access the app.

```js
{

  "scripts" : {
      "dev": "vite --host",
      "cypress:open" : "cypress open",
  }
}
```

> Add an npm script to the backend which starts it in test mode

> The tests require the tested system to be running. Unlike our backend integration tests, Cypress tests do not start the system when they are run.

>> file(BACKEND): package.json

```js
{
  "scripts" : {
    "start:test": "NODE_ENV=test node index.js"
  }
}
```

3. Install `eslint-plugin-cypress` to get rid of eslint-errors
When writing e2e tests one might get eslint errors, to get rid of these errors install the following package and configure eslint file.

```sh
npm install eslint-plugin-cypress --save-dev
```

>> file: eslintrc.cjs
```js
module.exports = {
  env:{ 
    ...,
    "jest/globals": true, 
    "cypress/globals": true,
  },
  plugins: ['react', 'jest', 'cypress' ]
}
```

4. Configure the cypress for E2E tests

</details>

### Notes
- Cypress require the tested system to be running.
- If tests need to modify server database situtation becomes complicated, as each time tests are run(ideally) the server database should be same. so, tests can be realiable and easy repetable.
> As with unit and integration tests, with E2E tests it is best to empty the database and possibly format it before the tests are run. The challenge with E2E tests is that they do not have access to the database.

> The solution is to create API endpoints for the backend tests. So they can empty the database using these endpoints.

> Contorlling the state of the database

1. Create a new route inside controllers directory named `TestingRouter`.
2. Import all the models required.
3. Write a post method, empty all model collections using method `model.deleteMany({})`.
4. Return status code `204`.
5. Check if `NODE_ENV === 'test'` then include the `TestingRouter` in the app.

- Writing custom commands in cypress to use the repeating code in multiple places

> process to create a custom command
1. open file `cypress/support/commands.js.`
2. write command name and callback function as:

Syntax

```js
Cypress.Commands.add({{command-name}}, callback);
```

Example

```js
Cypress.Commands.add('login', ({ username, password }) => {
  cy.request('POST', 'http://localhost:3001/api/login', {
    username, password
  }).then(({ body }) => {
    localStorage.setItem('loggedNoteappUser', JSON.stringify(body))
    cy.visit('http://localhost:5173')
  })
})
```

3. Using the custom command

```js

describe('when logged in', function() {
  beforeEach(function() {
    cy.login({ username: 'mluukkai', password: 'salainen' })
  }),
  ...
}
```

- Using cypress-env to configure hardcoded info
- Also possible to run cypress tests from command line, headless ui

>> file: package.json
```js
{
  scripts: {
    "cypress:run": "cypress run" // Alternate script name: "test:e2e" : "cypress run"
  }
}
```