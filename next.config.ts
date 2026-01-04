import type {NextConfig} from "next";

const nextConfig: NextConfig = {
    output: 'standalone',
    serverExternalPackages: ['sequelize'],
    outputFileTracingIncludes: {
        '*': ['./certs/**/*']
    },
};

export default nextConfig;
