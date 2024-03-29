# Part8: GraphQL

## SectionA: GraphQL-server

### Introduction to `GraphQL`

`GraphQL` says code on the browser must form a query describing the data wanted,
and send it to the API with an HTTP Post request. Unlike ` REST`, all `GraphQL`
queries are sent to the same address, and their type is POST. <br />

`GraphQL` query has direct linked with returned JSON Object(data). `GraphQL`
query describes only the data moving between a server and the client. On the
server, the data can be organized and saved any way we like. <br />

> In the heart of all GraphQL applications is a schema, which describes the data
> sent between the client and the server. ~fullstackopen[dot]com

### `Schema` for defining queries

`Schema` main purpose is to define `Query` which tells what kind of queries can
be made to the API, and type of data will be recieved. Same `Schema` is used to
define data structure/type.

```js
//create typeDefs to create schemas for queries and data-format(models-format)
//Below I have created for The Real Man

const typeDefs = `
type Qualities {
  Fit: Boolean,
  Rich: Boolean,
  Smarter: Boolean
}

type Man {
  name: String!,
  emailId: String!,
  username: String!,
  qualities: Qualities!
}

type Query {
  getRealMans: [Man!]
}
`;
```

### `Resolvers` for responding to queries

`Resolvers` determine/define how `GraphQL` queries are responded to. `Resolvers`
correspond to queries defined in the `Schema`. If `Resolver` is not provided,
then default resolver is used. So, there will be field under `Query` for every
`query` described in the schema.(in our case only one)

<pre>Override default resolvers to create own custom resolvers</pre>

```js
//realMans is prefiltered array of real mans
const resolvers = {
  Query: {
    getRealMans: () => realMans,
  },
};
```

### Mutations

`Mutations` are types/query for defining operations to cause changes in the
data.

> In GraphQL, all operations which cause a change are done with mutations.
> ~fulstackopen[dot]com

`Mutations` are desribed in the schema as the keys of type `Mutation`.

<br />
The schema for adding a new RealMan looks as follows:

```js
type Mutation{
  addRealMan(
    name: String!,
    email: String!,
    username: String!,
    qualities: Qualities!
  ): RealMan
}
```

The Mutation is given the details of the real-man as parameters.The Mutation
also has a return value. The return value is type `RealMan`, the idea being that
the details of the added real-man are returned if the operation is successful
and if not, null. Value for the field id is not given as a parameter. Generating
an id is better left for the server. <br />

`Mutations` also require resolvers to define how to respond to query. Default
resolvers return `null` as expected.

### Misc

- Define and throw GraphQLError

```js
if(!true){
  throw new GraphQLError({{message}}, {
    extensions: {
      code: {{code}},
      invalidArgs: {{invalidArgs}},
      //for more check docs...
    }
  })
}
```

- Define enum inside schemas using `enum` keyword

```js
enum YesNo{
  YES
  NO
}
```

### Implement GraphQL server using Apollo Server

```sh
mkdir {{folder_name}}
cd {{folder_name}}
npm init -y
npm i @apollo/server graphql
touch index.js
```

```js
//source: fullstackopen[dot]com
//index.js

const { ApolloServer } = require('@apollo/server');
const { startStandaloneServer } = require('@apollo/server/standalone');

let persons = [
  {
    name: 'Arto Hellas',
    phone: '040-123543',
    street: 'Tapiolankatu 5 A',
    city: 'Espoo',
    id: '3d594650-3436-11e9-bc57-8b80ba54c431',
  },
  {
    name: 'Matti Luukkainen',
    phone: '040-432342',
    street: 'Malminkaari 10 A',
    city: 'Helsinki',
    id: '3d599470-3436-11e9-bc57-8b80ba54c431',
  },
  {
    name: 'Venla Ruuska',
    street: 'Nallemäentie 22 C',
    city: 'Helsinki',
    id: '3d599471-3436-11e9-bc57-8b80ba54c431',
  },
];

const typeDefs = `
  type Person {
    name: String!
    phone: String
    street: String!
    city: String! 
    id: ID!
  }

  type Query {
    personCount: Int!
    allPersons: [Person!]!
    findPerson(name: String!): Person
  }
`;

const resolvers = {
  Query: {
    personCount: () => persons.length,
    allPersons: () => persons,
    findPerson: (root, args) => persons.find((p) => p.name === args.name),
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

startStandaloneServer(server, {
  listen: { port: 4000 },
}).then(({ url }) => {
  console.log(`Server ready at ${url}`);
});
```

### Open Questions

- What is `GraphQL`?
- Why `GraphQL` was created?
- How it is different from `REST`, and what benefits it offers over `REST`?
- How to choose what to use for project `REST` or `GraphQL`?
- What is `GraphQL` schema? How to differentiate between query and data-format
  in schema?
- Which are Good methods/techniques for describing Schema(Query, Mutatation,
  RecordStructure) and Resolvers?
- Schema Queries and Mutations with and without default resolvers?

## SectionB: React and GraphQL

This section helps in understanding how to make queries, mutations, cache
revalidation from frontend using react-apollo-client.

```sh
# install depedancies
npm i @apollo/client graphql
```

```ts
//import depedancies and create client or query-client
import { ApolloClient, InMemoryCache, gql } from '@apollo/client';

const client = new ApolloClient({
  uri: 'http://localhost:4000',
  cache: new InMemoryCache(),
});
```

```ts
//provide it to application

ReactDOM.createRoot(document.getElementById('root')).render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
);
```

### Make `Queries` to GraphQL Server

Using `useQuery` hook to make queries.

```ts
useQuery(QUERY, {{OPTIONS}})
```

Define a query using `gql`

```ts
//queries.ts

const ALL_VERSIONS = gql`
query AllVersions {
  allVersions{
    version
    createdAt
    ...
  }
}
`;

export { ALL_VERSIONS };
```

To get loading-state, error and data desctructre useQuery returnType.

```ts
//alterative-1
 const result = useQuery(ALL_PERSONS)
 //alternative-2
 const {loading, data, error} = useQuery(ALL_PERSONS)
 //alternative-3
  const {loading, data} = useQuery(ALL_PERSONS, {
    onError: () => void
  })
```

To pass variables to a query, pass it inside the options.

```ts
//queries.ts
export const FIND_PERSON = gql`
  query findPersonByName($nameToSearch: String!) {
    findPerson(name: $nameToSearch) {
      name
      phone
      id
      address {
        street
        city
      }
    }
  }
`;
```

```ts
  const result = useQuery(FIND_PERSON, {
    variables: {{variables}},
  })
```

### Handle Mutations

To do mutations `useMutation` hook is used. This hooks takes the mutation query
and options and returns array type return value. In which extract out property
of name of `muation` query. <br />

The extracted property is used to send mutation query.

```ts
//define-query
//queries.ts

const CREATE_PERSON = gql`
  mutation createPerson(
    $name: String!
    $street: String!
    $city: String!
    $phone: String
  ) {
    addPerson(name: $name, street: $street, city: $city, phone: $phone) {
      name
      phone
      id
      address {
        street
        city
      }
    }
  }
`;
```

```ts
const [createPerson] = useMutation(CREATE_PERSON)

function handler(){
  createPerson({variables: {{variables}}})
}
```

After each mutation cache is invalid or out of sync to server state. To validate
cache or to keep the cache in sync to the server state we have following
options:

- **pollInterval:** repeatedly make the query after `x` miliseconds

```ts
useQuery(QUERY, {
  pollInterval: {{milliseconds}}
})
```

- **refetchQueries:** It is option pass to `useMutation` hook which takes the
  queries to refetch post succesful mutation action/side-effect/operation.

```ts
useMutation(MUTATION, {
  refetchQueries: [{ query: QUERY }],
});
```

### Application state and Apollo Client Relationship

> management of the applications state has mostly become the responsibility of
> Apollo Client. This is a quite typical solution for GraphQL applications.

~fullstackopen[dot]com

### Open Questions

- use of reactrouterv6 and apollo client?
- How GraphQL Helps or What help does it provide to frontend?
  (https://fullstackopen.com/en/part8/react_and_graph_ql#cache,
  https://fullstackopen.com/en/part8/react_and_graph_ql#updating-a-phone-number,
  https://fullstackopen.com/en/part8/react_and_graph_ql#apollo-client-and-the-applications-state)
- How GraphQL helps with frontend application state?

## SectionC: Database and User Administration

This section is simple introduction to using authentication with graphql and
mongodb with graphql. <br />

```sh
npm install mongoose dotenv
npm install mongoose-unique-validator
```

Firstly define all the schemas in the `src/models` folder and export the model.
Using 3rd party plugin `mongoose-unique-validator` for ensuring records are
unqiue. To make sure a field is unique add `unique: true` to the field.

```js
import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
  },
  phone: {
    type: String,
    minlength: 5,
  },
  street: {
    type: String,
    required: true,
    minlength: 5,
  },
  city: {
    type: String,
    required: true,
    minlength: 3,
  },
});
schema.use(unqiueValidator);

const User = mongoose.model('User', userSchema);
export { User };
```

The collection name will be saved as `Users`, automatically done by mongoose
because collection named are saved plularly. <br /> Now instead of variables,
`mongodb` will be used. <br />

After this use `Models` inside resolvers to resolve query, mutation and types.
Apollo Server will resolve and return promise value for us. <br />

> The changes are pretty straightforward. However, there are a few noteworthy
> things. As we remember, in Mongo, the identifying field of an object is called
> \_id and we previously had to parse the name of the field to id ourselves. Now
> GraphQL can do this automatically. Another noteworthy thing is that the
> resolver functions now return a promise, when they previously returned normal
> objects. When a resolver returns a promise, Apollo server sends back the value
> which the promise resolves to. ~fullstackopen[dot]com

If validations use GraphQL Error **Ferociously**.

### User and Login

- For all mutations which require authenitcation check if user is authorized. By
  check if currentUser object of type `User` exists on third parameter of
  mutation request.

```ts
Mutation: {
  ...,
  addUser: async (root, args, context) => {
    if(!context.currentUser){
              throw new GraphQLError('not authenticated', {
          extensions: {
            code: 'BAD_USER_INPUT',
          }
        })
    }
    try{
      //...
    }catch(error){
        //...
    }
  }
}
```

- Now wondering what is `currentUser` and `context`. Now let's add mutation for
  `login` and `createUser` before `currentUser`.

```ts
//login is simple one password for all make it strong following part-4
const resolver = {
  Mutation: {
    login: async (root, args) => {
      const user = await User.findOne({ username: args.username });

      if (!user || args.password !== 'secret') {
        throw new GraphQLError('wrong credentials', {
          extensions: {
            code: 'BAD_USER_INPUT',
          },
        });
      }

      const userForToken = {
        username: user.username,
        id: user._id,
      };

      return { value: jwt.sign(userForToken, process.env.JWT_SECRET) };
    },
    createUser: async (root, args) => {
      const user = new User({ username: args.username });

      return user.save().catch((error) => {
        throw new GraphQLError('Creating the user failed', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.username,
            error,
          },
        });
      });
    },
  },
};
```

- Let's revil `currentUser`.

```ts
startStandaloneServer(_, {
  //...
  context: async ({ req, res }) => {
    const auth = req ? req.headers.authorization : null;
    if (auth && auth.startsWith('Bearer ')) {
      const decodedToken = jwt.verify(
        auth.substring(7),
        process.env.JWT_SECRET
      );
      const currentUser = await User.findById(decodedToken.id).populate(
        'friends'
      );
      return { currentUser };
    }
  },
});
```

### Open Questions

- What are the paramters authetication using REST and GraphQL?
- What are the paramters to compare CRUD operations(forDB) using REST and
  GraphQL?
- Compare Part4 and Part8 on the topic in context in both parts which choice
  REST or GraphQL stands on top of whom(Fight Declared Virtually)?
- Is TDD with GraphQL a good choice?

### Misc

- Implement Following user_adminstration using GRAPHQL.
  (https://fullstackopen.com/en/part4/user_administration)

## SectionD: Login and Updating the Cache

### Open Questions

### Misc

## SectionE: Fragments and Subscriptions

### Open Questions

### Misc
