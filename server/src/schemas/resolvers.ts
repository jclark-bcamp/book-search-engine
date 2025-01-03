import User from "../models/User.js"; 
import { signToken } from "../services/auth.js"; 

// Define the query and mutation functionality to work with the Mongoose models.
const resolvers = { // Define the query and mutation functionality to work with the Mongoose models
  Query: {
    me: async (_: any, __: any, context: any) => {
      if (!context.user) { 
        throw new Error("Authentication failed. No user context.");
      } 

      const user = await User.findById(context.user._id).populate("savedBooks"); 
      if (!user) {
        throw new Error("User not found!");
      }

      return {
        ...user.toObject(),
        bookCount: user.savedBooks.length,
      };
    },
  },

  Mutation: { // Set up mutations to handle creating a new user, logging in, saving a book, and removing a book
    addUser: async (_: any, { username, email, password }: any) => {
      const user = await User.create({ username, email, password }); 
      const token = signToken(user.username, user.email, user._id); 
      return { token, user }; 
    },

    login: async (_: any, { email, password }: any) => { // Find a user by email and verify the user's password
      const user = await User.findOne({ email }); 
      if (!user) {
        throw new Error("User not found!"); 
      }

      const correctPw = await user.isCorrectPassword(password); // Check if the password is correct
      if (!correctPw) {
        throw new Error("Incorrect password!"); 
      }

      const token = signToken(user.username, user.email, user._id); // If user is found and password is correct, sign a token
      return { token, user }; 
    },

    saveBook: async (_: any, { book }: any, context: any) => { // Add a book to a user's savedBooks array
      if (!context.user) {
        throw new Error("Authentication failed. No user context."); 
      }

      const updatedUser = await User.findByIdAndUpdate( // If user is authenticated, add a new book to the user's savedBooks array
        context.user._id, 
        { $addToSet: { savedBooks: book } }, 
        { new: true, runValidators: true } 
      );

      return updatedUser; 
    },

    removeBook: async (_: any, { bookId }: any, context: any) => { // Remove a book from a user's savedBooks array
      if (!context.user) {
        throw new Error("Authentication failed.");
      }

      const updatedUser = await User.findByIdAndUpdate( // If user is authenticated, remove a book from the user's savedBooks array
        context.user._id, 
        { $pull: { savedBooks: { bookId } } }, 
        { new: true } 
      );

      if (!updatedUser) {
        throw new Error("No user found with this id!"); 
      }

      return updatedUser;
    },
  },
};

export default resolvers; 