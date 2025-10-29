import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";

const getStrapiUrl = () => {
  // Use the public env var (https://backend-scorecard.onrender.com)
  // or fallback to localhost if it's not set (e.g., during local development without a .env file)
  return process.env.NEXT_PUBLIC_STRAPI_BASE_URL || "http://localhost:1337";
};

// This will now use: https://backend-scorecard.onrender.com/graphql
const client = new ApolloClient({
  link: new HttpLink({ uri: `${getStrapiUrl()}/graphql` }),
  cache: new InMemoryCache(),
});

export default client;
