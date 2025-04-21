import { ApolloClient, InMemoryCache, createHttpLink, ApolloLink } from "@apollo/client";
import { setContext } from '@apollo/client/link/context';

const httpLink = createHttpLink({
  uri: '/api/shopify/graphql',
  credentials: 'same-origin'
});

const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
    }
  }
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

export default client; 