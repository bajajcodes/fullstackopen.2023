# Part4: Testing Express servers, user administration


This part contains total of 4 sections:
- Strutcutre of backend application, introduction to testing
- Testing the backend
- User administration
- Token authentication

## Strutcutre of backend application, introduction to testing

This section started with `project strucutre`, how to strcuture the app and why to strutucte the way it is suggested. 
Few Good Why's:
- Extracting logging into its own module is a good idea in more ways than one.
- The Express app and the code taking care of the web server are separated from each other following the best practices. One of the advantages of this method is that the application can now be tested at the level of HTTP API calls without actually making calls via HTTP over the network, this makes the execution of tests faster.
- Read More on this (last point above) from here: [Always separate app and server files !
](https://dev.to/nermineslimane/always-separate-app-and-server-files--1nc7)

```js
├── index.js
├── app.js
├── build
│   └── ...
├── controllers
│   └── notes.js
├── models
│   └── note.js
├── package-lock.json
├── package.json
├── utils
│   ├── config.js
│   ├── logger.js
│   └── middleware.js  
```

Now comes the heart❤️ `Automated Testing` of the node applications, here `TDD` is followed and testing is done using `jest`. This is all about introduction to unit testing, and testing services and apis.

### Steps to setup `jest`
1. Install the dependancy

```js
npm install --save-dev jest
```

2. Append the script

>> file: package.json
```js
scripts:{
    "test": "jest --verbose"
}
```

3. Specifying the execution environment

More: Jest requires one to specify that the execution environment is Node.
>> file: package.json
```js
{
 //...
 "jest": {
   "testEnvironment": "node"
 }
}
```

What Next?

Create a directory named `tests`, and create file in format {{filname}}.test.js, to start testing.


## Testing the backend

This section teached me small simple good things, like setting node-environment.

This section starts with teaching about test environment, explains how to set different environments and configuring database for different environments. Also explains why it is important for each test to have independent database environment.

```js
{
  // ...
  "scripts": {

    "start": "NODE_ENV=production node index.js",
    "dev": "NODE_ENV=development nodemon index.js",
    "build:ui": "rm -rf build && cd ../frontend/ && npm run build && cp -r build ../backend",
    "deploy": "fly deploy",
    "deploy:full": "npm run build:ui && npm run deploy",
    "logs:prod": "fly logs",
    "lint": "eslint .",

    "test": "NODE_ENV=test jest --verbose --runInBand"
  },
  // ...
}
```

Testing the apis using `supertest`.

```sh
npm install --save-dev supertest
```

```js
const app = require('../app')

const api = supertest(app)
```

Initializing and Reseting the database before tests

>> Snippet: Initialize and Reset DB

```js
beforeEach(async () => {
  await Note.deleteMany({})
  let noteObject = new Note(initialNotes[0])
  await noteObject.save()
  noteObject = new Note(initialNotes[1])
  await noteObject.save()
})
```

Running a single test file

```js
npm test -- tests/note_api.test.js
```

Running set of tests which contain `name` in tests

```js
npm test -- -t "a specific note is within the returned notes"
npm test -- -t "notes"
```

Elmininate the need of writing `try/catch` everywhere

Install the following package:

```sh
npm install express-async-errors
```

```js
require('express-async-errors')
```

>> Snippet: Before `express-async-errors`

```js
notesRouter.delete('/:id', async (request, response, next) => {
  try {
    await Note.findByIdAndRemove(request.params.id)
    response.status(204).end()
  } catch (exception) {
    next(exception)
  }
})
```

>> Snippet: After `express-async-errors`

```js
notesRouter.delete('/:id', async (request, response) => {
  await Note.findByIdAndRemove(request.params.id)
  response.status(204).end()
})
```

## User administration

This section teaches about how to add auhorization and authentication to the application. 

>> `More info:` 
Users are stored in the database and every resource be linked to the user who created it. Deleting and editing a resource should only be allowed for the user who created it.

>> `Important Words On Mongo:`
Traditionally document databases like Mongo do not support join queries that are available in relational databases, used for aggregating data from multiple tables. However, starting from version 3.2. Mongo has supported lookup aggregation queries. We will not be taking a look at this functionality in this course.

If we need functionality similar to join queries, we will implement it in our application code by making multiple queries. In certain situations, Mongoose can take care of joining and aggregating data, which gives the appearance of a join query. However, even in these situations, Mongoose makes multiple queries to the database in the background.


>> `To Store reference of one document inside another via mongoDB`

User storing info a about list of resources

```js
const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  username: String,
  name: String,
  passwordHash: String,
  resources: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Resource'
    }
  ],
})

const User = mongoose.model('User', userSchema)

module.exports = User
```

Parsing the response from mongodb, in appropriate format for frontend
```js

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
    // the passwordHash should not be revealed
    delete returnedObject.passwordHash
  }
})
```

Resource with reference to the user

```js
const resourceSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
    minlength: 5
  },
  important: Boolean,

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
})
```

>> `Authenticating for the user`

Users have a unique username, a name and something called a passwordHash. The password hash is the output of a one-way hash function applied to the user's password. It is never wise to store unencrypted plain text passwords in the database!

```sh
npm install bcrypt
```

Converting plain password to encrypted password

```js
  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({
    username,
    name,
    passwordHash,
  })

  const savedUser = await user.save()
```

>> `Adding uniqueness to mongodb schema fileds`

Install the package, mark the field as unique and use the plugin with the schema.

```sh
npm install mongoose-unique-validator
```

```js
const uniqueValidator = require('mongoose-unique-validator')

const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  name: String,
  passwordHash: String,
  notes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Note'
    }
  ],
})

userSchema.plugin(uniqueValidator)
```

`IMPORTANT{{DO READ AGAIN}}:`
[Creating a new note](https://fullstackopen.com/en/part4/user_administration#creating-a-new-note)

>> `Populate, `

The populate method is chaimed after the find method or other method making the initial query. The paramter given to the populate method defines that the ids referencing `resource` objects in the `resources` field of the user document will be replaced by the referenced `resource` documnets.

It's important to understand that the database does not know that the ids stored in the user field of `resources` reference documents in the user collection.

The functionality of the populate method of Mongoose is based on the fact that we have defined "types" to the references in the Mongoose schema with the ref option:

## Token authentication

This section explain about auth-tokens generated post authentication. User enters the username and the password, backend verifys the password hash, if succeeds generates the token and sends to the browser for further communication.
Post expiry of this token, required to regenerate for user authentication. 

When the user creates a new note (or does some other operation requiring identification), the React code sends the token to the server with the request.
The server uses the token to identify the user.

>> Snippet: For login

```js
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const loginRouter = require('express').Router()
const User = require('../models/user')

loginRouter.post('/', async (request, response) => {
  const { username, password } = request.body

  const user = await User.findOne({ username })
  const passwordCorrect = user === null
    ? false
    : await bcrypt.compare(password, user.passwordHash)

  if (!(user && passwordCorrect)) {
    return response.status(401).json({
      error: 'invalid username or password'
    })
  }

  const userForToken = {
    username: user.username,
    id: user._id,
  }

  const token = jwt.sign(userForToken, process.env.SECRET)

  response
    .status(200)
    .send({ token, username: user.username, name: user.name })
})

```

>> `Verifying token for Post requests`

```js
const jwt = require('jsonwebtoken')

// ...

const getTokenFrom = request => {
  const authorization = request.get('authorization')
  if (authorization && authorization.startsWith('Bearer ')) {
    return authorization.replace('Bearer ', '')
  }
  return null
}

notesRouter.post('/', async (request, response) => {
  const body = request.body

  const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }
  const user = await User.findById(decodedToken.id)

  const note = new Note({
    content: body.content,
    important: body.important === undefined ? false : body.important,
    user: user._id
  })

  const savedNote = await note.save()
  user.notes = user.notes.concat(savedNote._id)
  await user.save()

  response.json(savedNote)
})
```

>> `Problems with Token Based Auth`
Do Read Again

[Problems OF Token Based Auth](https://fullstackopen.com/en/part4/token_authentication#problems-of-token-based-authentication)