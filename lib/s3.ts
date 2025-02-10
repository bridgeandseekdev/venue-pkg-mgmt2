import { S3Client } from "@aws-sdk/client-s3";

if(!process.env.AWS_ACCESS_KEY_ID) throw new Error('Missing AWS_ACCESS_KEY_ID');
if(!process.env.AWS_SECRET_ACCESS_KEY) throw new Error('Missing AWS_SECRET_ACCESS_KEY');
if(!process.env.AWS_REGION) throw new Error('Missing AWS_REGION');
if(!process.env.AWS_BUCKET_NAME) throw new Error('Missing AWS_BUCKET_NAME');

export const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

export const BUCKET_NAME = process.env.AWS_BUCKET_NAME;