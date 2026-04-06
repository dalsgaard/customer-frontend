import * as cdk from "aws-cdk-lib";
import { FrontendStack } from "../lib/frontend-stack.js";

const app = new cdk.App();

new FrontendStack(app, "CustomerFrontendStack", {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: "us-east-1",
  },
});
