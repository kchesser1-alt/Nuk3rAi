/** @type {import('next').NextConfig} */
const nextConfig = {
  // App Router is enabled by default in Next.js 15.5.3
  
  // Configure TypeScript
  typescript: {
    ignoreBuildErrors: false,
  },
  
  // Configure ESLint
  eslint: {
    ignoreDuringBuilds: false,
  },
  
  // Configure images
  images: {
    domains: ['localhost'],
    unoptimized: true, // For Vercel deployment compatibility
  },
  
  // Configure headers for CORS and security
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET, POST, PUT, DELETE, OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization' },
        ],
      },
    ];
  },
  
  // Configure redirects for API routes
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: '/api/:path*',
      },
    ];
  },
  
  // Environment variables are handled automatically by Next.js
  // Server-side env vars are available via process.env on the server
  // Client-side env vars must be prefixed with NEXT_PUBLIC_
  
  // Configure webpack for better bundle optimization
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Configure webpack to handle imports properly
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
    };
    
    return config;
  },
  
  // Output configuration
  output: 'standalone',
  
  // Configure the build process
  generateEtags: false,
  
  // Configure static optimization
  staticPageGenerationTimeout: 1000,
  
  // Configure server runtime
  serverRuntimeConfig: {
    // Will only be available on the server side
  },
  
  // Configure public runtime
  publicRuntimeConfig: {
    // Will be available on both server and client
  },
};

export default nextConfig;