import resources from "./s3-cloudfront";
import type { AWS } from "@serverless/typescript";

const serverlessConfiguration: AWS = {
  service: "hoppipolla-sonagb-cdn-stack",
  frameworkVersion: "3",
  provider: {
    name: "aws",
    region: "ap-northeast-2",
  },
  plugins: ["serverless-s3-sync"],
  custom: {
    s3Sync: [
      {
        bucketName: process.env.BUCKET_NAME!,
        localDir: "../../apps/fe/dist",
        params: [
          { "index.html": { CacheControl: "no-cache" } },
          { "assets/**/*": { CacheControl: "public, max-age=31536000" } },
        ],
      },
    ],
  },
  resources,
};

module.exports = serverlessConfiguration;
