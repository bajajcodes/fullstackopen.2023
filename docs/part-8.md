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

# `Resolvers` for responding to queries

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

const { ApolloServer } = require('@apollo/server')
const { startStandaloneServer } = require('@apollo/server/standalone')

let persons = [
  {
    name: "Arto Hellas",
    phone: "040-123543",
    street: "Tapiolankatu 5 A",
    city: "Espoo",
    id: "3d594650-3436-11e9-bc57-8b80ba54c431"
  },
  {
    name: "Matti Luukkainen",
    phone: "040-432342",
    street: "Malminkaari 10 A",
    city: "Helsinki",
    id: '3d599470-3436-11e9-bc57-8b80ba54c431'
  },
  {
    name: "Venla Ruuska",
    street: "Nallemäentie 22 C",
    city: "Helsinki",
    id: '3d599471-3436-11e9-bc57-8b80ba54c431'
  },
]

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
`

const resolvers = {
  Query: {
    personCount: () => persons.length,
    allPersons: () => persons,
    findPerson: (root, args) =>
      persons.find(p => p.name === args.name)
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

startStandaloneServer(server, {
  listen: { port: 4000 },
}).then(({ url }) => {
  console.log(`Server ready at ${url}`)
})

```

#### Open Questions

- What is `GraphQL`?
- Why `GraphQL` was created?
- How it is different from `REST`, and what benefits it offers over `REST`?
- How to choose what to use for project `REST` or `GraphQL`?
- What is `GraphQL` schema? How to differentiate between query and data-format
  in schema?
- Which are Good methods/techniques for describing Schema(Query, Mutatation, RecordStructure) and Resolvers?
- Schema Queries and Mutations with and without default resolvers?

