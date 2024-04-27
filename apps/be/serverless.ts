import type { AWS } from "@serverless/typescript";
import functions from "@functions/index";

const serverlessConfiguration: AWS = {
  service: "sonagbe",
  frameworkVersion: "3",
  plugins: ["serverless-esbuild", "serverless-offline"],
  provider: {
    name: "aws",
    runtime: "nodejs20.x",
    region: "ap-northeast-2",
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: "1",
      NODE_OPTIONS: "--enable-source-maps --stack-trace-limit=1000",
      DB_HOST: process.env.DB_HOST,
      DB_USER: process.env.DB_USER,
      DB_PASSWORD: process.env.DB_PASSWORD,
      DB_DATABASE: process.env.DB_DATABASE,
    },
    httpApi: {
      cors: {
        allowedOrigins: [process.env.CORS_ALLOW_ORIGIN!],
        allowedHeaders: ["Content-Type"],
        allowedMethods: ["GET", "POST", "DELETE", "PUT"],
        allowCredentials: true,
      },
    },
  },
  // import the function via paths
  functions,
  package: { individually: true },
  custom: {
    esbuild: {
      config: "./esbuild.config.js",
    },
  },
};

module.exports = serverlessConfiguration;
