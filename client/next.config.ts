const nextConfig = {
  images: {
    domains: ["res.cloudinary.com", "images.pexels.com"],
  },

  typescript: {
    ignoreBuildErrors: true,
  },

  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
