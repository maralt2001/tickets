/** @type {import('next').NextConfig} */

const nextConfig = {
    output: 'standalone',
    env: {
        API_URL: 'http://localhost:3000'
    }

};

export default nextConfig;
