import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";

const getStrapiUrl = () => {
  if (typeof window !== "undefined") {
    // If running in the browser, check the hostname.
    if (window.location.hostname === "localhost") {
      return "http://localhost:1337";
    } else {
      return "http://192.168.0.23:1337";
    }
  }
  // Fallback if window is undefined (e.g., during SSR)
  return process.env.STRAPI_GRAPHQL_API || "http://localhost:1337";
};

const client = new ApolloClient({
  link: new HttpLink({ uri: `${getStrapiUrl()}/graphql` }),
  cache: new InMemoryCache(),
});

export default client;
