// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   reactStrictMode: true,
//   images: {
//     domains: ["localhost"],
//   },
// };

// export default nextConfig;
/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["localhost", process.env.NEXT_PUBLIC_STRAPI_HOSTNAME],
  },
};

export default nextConfig;
