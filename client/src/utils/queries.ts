// This will hold the query GET_ME, which will execute the me query set up using Apollo Server.
import { gql } from '@apollo/client';

export const GET_ME = gql`
  query Query {
  me {
    _id
    username
    email
    bookCount
    savedBooks {
      bookId
      authors
      description
      title
      image
      link
    }
  }
}`;