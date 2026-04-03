#!/bin/bash
set -e

ACCOUNT=$(aws sts get-caller-identity --query Account --output text)
REGION="eu-north-1"
BUCKET="openapi-specs-${ACCOUNT}-${REGION}"

aws s3 cp "s3://${BUCKET}/customer-bff/customer-bff.oas.yaml" openapi/customer-bff.oas.yaml
openapi-typescript openapi/customer-bff.oas.yaml -o openapi/types.ts

BFF_URL=$(aws cloudformation describe-stacks \
  --stack-name CustomerBffStack \
  --region "$REGION" \
  --query 'Stacks[0].Outputs[?OutputKey==`ApiUrl`].OutputValue' \
  --output text)

echo "VITE_API_BASE_URL=${BFF_URL}" > .env.production
