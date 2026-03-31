#!/bin/bash
set -e

ACCOUNT=$(aws sts get-caller-identity --query Account --output text)
REGION="eu-north-1"
BUCKET="openapi-specs-${ACCOUNT}-${REGION}"

openapi-typescript \
  "https://${BUCKET}.s3.${REGION}.amazonaws.com/customer-service/customer.oas.yaml" \
  -o openapi/types.ts
