const SonagbOAI = {
  Type: "AWS::CloudFront::CloudFrontOriginAccessIdentity",
  Properties: {
    CloudFrontOriginAccessIdentityConfig: {
      Comment: "소낙비 프론트엔드 페이지용 OAI",
    },
  },
};

const SonagbFileBucket = {
  Type: "AWS::S3::Bucket",
  Properties: {
    BucketName: process.env.BUCKET_NAME!,
  },
};

const SonagbFileBucketOAIPolicy = {
  Type: "AWS::S3::BucketPolicy",
  Properties: {
    Bucket: { Ref: "SonagbFileBucket" },
    PolicyDocument: {
      Statement: [
        {
          Action: "s3:GetObject",
          Effect: "Allow",
          Resource: `arn:aws:s3:::${process.env.BUCKET_NAME}/*`,
          Principal: {
            CanonicalUser: { "Fn::GetAtt": ["OAI", "S3CanonicalUserId"] },
          },
        },
      ],
    },
  },
};

const SonagbS3Origin = {
  Id: "SonagbS3Origin",
  DomainName: `${process.env.BUCKET_NAME}.s3.ap-northeast-2.amazonaws.com`,
  S3OriginConfig: {
    OriginAccessIdentity: {
      "Fn::Join": ["", ["origin-access-identity/cloudfront/", { Ref: "OAI" }]],
    },
  },
};

const SonagbAPIOrigin = {
  Id: "SonagbAPIOrigin",
  DomainName: process.env.API_DOMAIN!,
  CustomOriginConfig: {
    OriginProtocolPolicy: "https-only",
    OriginSSLProtocols: ["TLSv1.2"],
  },
};

const DefaultCacheBehavior = {
  TargetOriginId: "SonagbS3Origin",
  ViewerProtocolPolicy: "redirect-to-https",
  Compress: true,
  CachePolicyId: "658327ea-f89d-4fab-a63d-7e88639e58f6",
};

const SonagbAPIOriginRequestPolicy = {
  Type: "AWS::CloudFront::OriginRequestPolicy",
  Properties: {
    OriginRequestPolicyConfig: {
      Name: "AllViewerExceptHostHeader",
      Comment:
        "Host 헤더를 제외하고 나머지 모든 정보를 오리진으로 전달하는 정책",
      CookiesConfig: {
        CookieBehavior: "all",
      },
      HeadersConfig: {
        HeaderBehavior: "whitelist",
        Headers: [
          "Accept-Charset",
          "Origin",
          "Access-Control-Request-Method",
          "Access-Control-Request-Headers",
          "Referer",
          "Accept-Language",
        ],
      },
      QueryStringsConfig: {
        QueryStringBehavior: "all",
      },
    },
  },
};

const SonagbAPIOriginCacheBehavior = {
  TargetOriginId: "SonagbAPIOrigin",
  PathPattern: "/api/*",
  ViewerProtocolPolicy: "https-only",
  AllowedMethods: ["GET", "HEAD", "OPTIONS", "PUT", "PATCH", "POST", "DELETE"],
  CachePolicyId: "4135ea2d-6df8-44a3-9df3-4b5a84be39ad",
  OriginRequestPolicyId: { Ref: "SonagbAPIOriginRequestPolicy" },
};

const Sonagb = `${process.env.SUB_DOMAIN}.${process.env.ROOT_DOMAIN}`;
const ViewerCertificate = {
  AcmCertificateArn: process.env.ACM_CERTIFICATE_ARN!,
  MinimumProtocolVersion: "TLSv1.2_2021",
  SslSupportMethod: "sni-only",
};

const SonagbCustomErrorResponse = {
  ErrorCode: 403,
  ResponseCode: 200,
  ResponsePagePath: "/index.html",
};

const SonagbFileCdn = {
  Type: "AWS::CloudFront::Distribution",
  Properties: {
    DistributionConfig: {
      Comment: "알라딘램프 - 소낙비",
      Enabled: true,
      DefaultRootObject: "index.html",
      CustomErrorResponses: [SonagbCustomErrorResponse],
      Origins: [SonagbS3Origin, SonagbAPIOrigin],
      DefaultCacheBehavior,
      CacheBehaviors: [SonagbAPIOriginCacheBehavior],
      HttpVersion: "http2",
      Aliases: [Sonagb],
      ViewerCertificate,
    },
  },
};

const SonagbFileCdnDns = {
  Type: "AWS::Route53::RecordSet",
  Properties: {
    AliasTarget: {
      DNSName: { "Fn::GetAtt": ["SonagbFileCdn", "DomainName"] },
      HostedZoneId: "Z2FDTNDATAQYW2",
    },
    HostedZoneName: `${process.env.ROOT_DOMAIN}.`,
    Name: Sonagb,
    Type: "A",
  },
};

const resources = {
  AWSTemplateFormatVersion: "2010-09-09",
  Resources: {
    OAI: SonagbOAI,
    SonagbFileBucket,
    SonagbFileBucketOAIPolicy,
    SonagbAPIOriginRequestPolicy,
    SonagbFileCdn,
    SonagbFileCdnDns,
  },
};

export default resources;
