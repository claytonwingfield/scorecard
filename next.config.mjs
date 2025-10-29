const strapiHostname = process.env.NEXT_PUBLIC_STRAPI_HOSTNAME || "localhost";

const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      "localhost",
      // Include the deployed Strapi hostname
      strapiHostname,
    ],
  },
};

export default nextConfig;
