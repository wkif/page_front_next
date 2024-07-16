/** @type {import('next').NextConfig} */
const isProd = ["production"].includes(process.env.NODE_ENV);
console.log("isProd", isProd, process.env.NEXT_PUBLIC_BASE_URL);
const nextConfig = {
    reactStrictMode: true,
    async rewrites() {
        return [
            {
                source: '/:path*',
                destination: `${process.env.NEXT_PUBLIC_BASE_URL}/:path*`
            },
            {
                source: '/hot-api/:path*',
                destination: `${process.env.NEXT_HOT_URL}/:path*`
            }
        ]
    }
};

export default nextConfig;
