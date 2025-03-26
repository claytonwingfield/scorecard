import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";

const STRAPI_URL = process.env.STRAPI_GRAPHQL_API || "http://localhost:1337";

const client = new ApolloClient({
  link: new HttpLink({ uri: `${STRAPI_URL}/graphql` }),
  cache: new InMemoryCache(),
});

export default client;
