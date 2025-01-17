// import './App.css';
import { Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';

// Create an Apollo Provider to make every request work with the Apollo Server.

// import React from 'react';
import { ApolloProvider, ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
// import SearchBooks from './pages/SearchBooks';
// import SavedBooks from './pages/SavedBooks';

const httpLink = createHttpLink({
  uri: '/graphql',
});

const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = localStorage.getItem('id_token');
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

function App() {
  return (
    <ApolloProvider client={client}>
      <Navbar />
      <Outlet />
    </ApolloProvider>
  );
}
// function App() {
//   return (
//     <ApolloProvider client={client}>
//       <Router>
//         <Routes>
//           <Route path="/" element={<SearchBooks />} />
//           <Route path="/saved" element={<SavedBooks />} />
//         </Routes>
//       </Router>
//     </ApolloProvider>
//   );
// }

export default App;