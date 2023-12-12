# Programming a server with NodeJS and Express

This part contains total of 4 sections:

- Node.js and Express

- Deploying app to internet

- Saving data to MongoDB

- Validation and ESLint


## Node.js and Express
### Introduction to Node.js
- Node.js as a runtime environment for JavaScript on the server.
- Utilizes the V8 engine for JavaScript.

### Creating a Simple Web Server
- Explanation of basic web server creation using the `Http` package.
- Transition to using the `Express` package for server creation.

### Package Management
- Instructions on installing the `express` package using `npm install`.
- Mention of transitive dependencies and the importance of versioning.

### Managing Project Dependencies
- Use of `npm update` to update project dependencies.
- Explanation of updating and installing dependencies with `npm update` and `npm install` when working on another computer.

### HTTP and HTTPS Servers
- Information on starting a simple HTTP server.
- Brief mention of hosting over SSL for an HTTPS server.

### Development Workflow
- Recommendation to use `nodemon` to avoid manual server restarts after each change.

### Introduction to REST
- Teasing about REST and a brief explanation of REST methodologies.
- Overview of REST endpoints and their current status in the exercise.

### Handling Responses and Status Codes
- Explanation of HTTP response codes, including 200 (success) and 404 (not found).
- Introducing the concept of returning 204 for successful resource deletion.

### API Testing
- Mention of tools like Postman, Webstorm HTTP client, and VS Code REST client for making API calls.

### Middleware
- Introduction to middleware and its role in handling request and response objects.
- Explanation of the built-in JSON parser middleware in Express.
- Demonstration of creating custom middleware functions.

### Middleware Exercises
- Creation of middleware functions, such as request logger and unknown endpoint handler.

### Logging with Morgan
- Introduction to the `Morgan` package for logging network requests.

### Section A Overview
- Summarization of the content covered in Section A of part three.


## Deploying app to internet


## Saving data to MongoDB

### Topic and Focus

The discussion revolves around fullstackopen.com, specifically Part Three, Section C, focusing on saving data to MongoDB.

### Sections and Subsections

- Section Two is briefly mentioned, with the intention to come back to it after going through Section D.
- The speaker plans to cover MongoDB-related topics, such as schema, model, document creation, update, delete, retrieval, and the use of packages like `env` and `MongoJS`.

### Introduction to MongoDB

- MongoDB is introduced as a NoSQL document-based database.
- Schema is explained as a way to define data structure, and models are used to create instances of records in a collection.

### Use of MongoDB Atlas

- MongoDB Atlas is mentioned as the tool used for this, emphasizing its NoSQL nature.

### Use of Mongoose

- Mongoose is introduced as an alternative to the official MongoDB Node.js driver, offering a high-level API and more abstraction.
- Mongoose is described as an Object Document Mapper (ODM).

### Connection Setup and Configuration

- The setup process is briefly mentioned, including the use of Mongoose instead of the official MongoDB driver.
- Connection setup, schema creation, model creation, and saving a note are explained.

### Database Operations

- Instructions on creating, updating, deleting, and fetching data from the database using models and methods like `find`.

### Database Configuration and Modules

- The process of moving the database configuration into separate modules is explained.

### Error Handling

- Error handling is discussed, and a middleware approach is introduced.
- Differentiating between server-side and user-side errors and assigning appropriate response codes (500 and 400) is explained.

### Middleware Order

- The importance of middleware order is highlighted, emphasizing the placement of the error handler before the unknown endpoints middleware.

### Module Usage

- The use of the `dotenv` library for storing critical information and accessing it through environment variables is explained.
- The integration of the library using `require('dotenv').config()` is mentioned.

### Server Structure

- The ideal order of middleware is provided, starting with static, then `express.json`, logger, API calls, unknown endpoint, error handler, and finally, specific operations like `findById` and `update`.

### Conclusion

The section concludes by summarizing the covered topics as a basic introduction to MongoDB, with a reference to fullstackopen.com.


## Validation and ESLint

### Validation with MongoDB Schema

- Discusses the importance of validating data before sending it to the database.
- Mentions two types of validators: inbuilt validation functions and custom validation functions.

### Eslint for Static Analysis

- Introduces ESLint as a delinting tool for running static analysis on the code.
- Emphasizes the importance of enforcing coding style standards.

### Preventing Improper Data

- Advises against putting data into the database before validation.
- Highlights the importance of prevention over cure in handling improper data.

### Mongoose Validation

- Recommends using Mongoose's validation functionality for validating data format.
- Suggests defining specific validation rules for each field in the schema.

### Validator Types

- Mentions both built-in functions and custom validator functionality for defining validation rules.

### Practical Exercise

- Describes a practical exercise related to using built-in and custom validator functionality.

### Error Handling in Middleware

- Adds a new if block in the error middleware to handle validation errors.

### Deployment (Skipped)

- Skips over the deployment part, which will be covered in the next section/part.

### ESLint Configuration

- Explains how to use ESLint, including installing it, creating a configuration file, and defining rules.
- Demonstrates the creation of a custom script for running ESLint.

### ESLint Ignore File

- Advises to skip the distribution folder in the ESLint ignore file.

### VS Code Plugin and Rules

- Introduces ESLint VS Code plugin and explains some rules and how they can be used.

### Transition to the Next Part

- Mentions that the next section will cover the deployment aspect.

### Acknowledgment

- Expresses gratitude to fullstackoper.com.
