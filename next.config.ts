import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["@prisma/client", "@prisma/adapter-libsql", "@libsql/client"],
  outputFileTracingIncludes: {
    "/api/**/*": ["./src/generated/prisma/**/*"],
    "/**/*": ["./src/generated/prisma/**/*"],
  },
};

export default nextConfig;
