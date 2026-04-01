#!/bin/bash
set -e

ACCOUNT=$(aws sts get-caller-identity --query Account --output text)
REGION="eu-north-1"
BUCKET="openapi-specs-${ACCOUNT}-${REGION}"

aws s3 cp "s3://${BUCKET}/customer-service/customer.oas.yaml" openapi/customer.oas.yaml
openapi-typescript openapi/customer.oas.yaml -o openapi/types.ts

API_ID=$(grep 'default:' openapi/customer.oas.yaml | head -1 | awk '{print $2}')
echo "VITE_API_BASE_URL=https://${API_ID}.execute-api.${REGION}.amazonaws.com" > .env.production
