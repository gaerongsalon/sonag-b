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
    memorySize: 256,
    timeout: 6,
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
      JWT_SECRET_KEY: process.env.JWT_SECRET_KEY,
    },
    httpApi: {
      cors: {
        allowedOrigins: [process.env.CORS_ALLOW_ORIGIN!],
        allowedHeaders: ["Content-Type"],
        allowedMethods: ["GET", "POST", "DELETE", "PUT"],
        allowCredentials: true,
      },
      authorizers: {
        authorize: {
          type: "request",
          functionName: "authorize",
          enableSimpleResponses: true,
          identitySource: ["$request.header.cookie"],
        },
      },
    },
    logs: {
      httpApi: {
        format: `$context.identity.sourceIp - - [$context.requestTime] "$context.routeKey $context.protocol" $context.status $context.responseLength $context.requestId $context.authorizer.error`,
      },
    },
  },
  functions,
  package: { individually: true },
  custom: {
    esbuild: {
      config: "./esbuild.config.js",
    },
  },
};

module.exports = serverlessConfiguration;
