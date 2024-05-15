/** @type {import('next').NextConfig} */
const isProd = ["production"].includes(process.env.NODE_ENV);
console.log("isProd", isProd);
const nextConfig = {
    async rewrites() {
        return [
            {
                source: '/:path*',
                destination: `${process.env.NEXT_PUBLIC_BASE_URL}/:path*`
            },
        ]
    }
};

export default nextConfig;
