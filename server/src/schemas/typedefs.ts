// Define the necessary Query and Mutation types: me, login, addUser, saveBook, and removeBook.

const typeDefs = ` 
type Query {
me: User
}

type Mutation {
login(email: String!, password: String!): Auth
addUser(username: String!, email: String!, password: String!): Auth
saveBook(authors: [String!], description: String!, title: String!, bookId: String!, image: String!): User
removeBook(bookId: String!): User
}

type User {
_id: ID
username: String
email: String
bookCount: Int
savedBooks: [Book]
}

type Book {
bookId: ID
authors: [String]
description: String
title: String
image: String
link: String
}

type Auth {
token: ID!
user: User
}`;  

export default typeDefs;