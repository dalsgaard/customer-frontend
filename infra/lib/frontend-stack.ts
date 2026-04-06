import * as cdk from "aws-cdk-lib";
import * as s3 from "aws-cdk-lib/aws-s3";
import * as cloudfront from "aws-cdk-lib/aws-cloudfront";
import * as origins from "aws-cdk-lib/aws-cloudfront-origins";
import * as s3deploy from "aws-cdk-lib/aws-s3-deployment";
import * as acm from "aws-cdk-lib/aws-certificatemanager";
import * as route53 from "aws-cdk-lib/aws-route53";
import * as targets from "aws-cdk-lib/aws-route53-targets";
import * as path from "path";
import { fileURLToPath } from "url";
import { Construct } from "constructs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const HOSTED_ZONE_ID = "Z049936014ZW6VR19CWV";
const DOMAIN_NAME = "dalsgaard.cloud";
const SUBDOMAIN = "app.dalsgaard.cloud";

export class FrontendStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const hostedZone = route53.HostedZone.fromHostedZoneAttributes(this, "HostedZone", {
      hostedZoneId: HOSTED_ZONE_ID,
      zoneName: DOMAIN_NAME,
    });

    const certificate = new acm.Certificate(this, "Certificate", {
      domainName: SUBDOMAIN,
      validation: acm.CertificateValidation.fromDns(hostedZone),
    });

    const bucket = new s3.Bucket(this, "FrontendBucket", {
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });

    const distribution = new cloudfront.Distribution(this, "Distribution", {
      defaultBehavior: {
        origin: origins.S3BucketOrigin.withOriginAccessControl(bucket),
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        cachePolicy: cloudfront.CachePolicy.CACHING_OPTIMIZED,
      },
      domainNames: [SUBDOMAIN],
      certificate,
      defaultRootObject: "index.html",
      errorResponses: [
        {
          httpStatus: 404,
          responseHttpStatus: 200,
          responsePagePath: "/index.html",
        },
      ],
    });

    new route53.ARecord(this, "AliasRecord", {
      zone: hostedZone,
      recordName: SUBDOMAIN,
      target: route53.RecordTarget.fromAlias(new targets.CloudFrontTarget(distribution)),
    });

    new s3deploy.BucketDeployment(this, "Deploy", {
      sources: [s3deploy.Source.asset(path.join(__dirname, "../../dist"))],
      destinationBucket: bucket,
      distribution,
      distributionPaths: ["/*"],
      memoryLimit: 1024,
      ephemeralStorageSize: cdk.Size.mebibytes(1024),
    });

    new cdk.CfnOutput(this, "URL", {
      value: `https://${SUBDOMAIN}`,
    });
  }
}
