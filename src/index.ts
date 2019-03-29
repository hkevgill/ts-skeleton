import { GraphQLServer } from "graphql-yoga";
import { createConnection, getRepository, LessThan } from "typeorm";
import { User } from "./entities/User";

export const typeDefs = `
  type User {
    id: ID!
    name: String!
    email: String!
  }
  type Query {
    user(id: ID!): User!
    users: [User]
  }
  type Mutation {
    addUser(name: String!, email: String!): User
  }
`;

export const resolvers = {
  Query: {
    // this is the user resolver
    user: (_, { id }) => {
      const userRepository = getRepository(User);
      return userRepository.findOne(id);
    },
    users: (_) => {
        const userRepository = getRepository(User);
        return userRepository.find();
    }
  },
  Mutation: {
    // this is the addUser resolver
    addUser: (_, { name, email }) => {
      const userRepository = getRepository(User);
      const user = new User();
      user.name = name;
      user.email = email;

      return userRepository.save(user);;
    }
  }
};

const server = new GraphQLServer({ typeDefs, resolvers });

createConnection()
  .then(() => {
    server.start(() => console.log("Server is running on localhost:4000"));
  })
  .catch(() => {
    console.log("Couldn't connect to the database.");
  });
