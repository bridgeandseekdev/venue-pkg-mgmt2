import {
  GetObjectCommand,
  PutObjectCommand,
  CreateMultipartUploadCommand,
  CompleteMultipartUploadCommand,
  UploadPartCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { s3Client, BUCKET_NAME } from './s3';

export async function generateUploadUrl(key: string, contentType: string) {
  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
    ContentType: contentType,
  });

  try {
    const signedUrl = await getSignedUrl(s3Client, command, {
      expiresIn: 3600,
    });
    return signedUrl;
  } catch (error) {
    console.error('Error generating upload URL:', error);
    throw error;
  }
}
export async function generatePresignedGetUrl(key: string) {
  const command = new GetObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
  });

  try {
    const signedUrl = await getSignedUrl(s3Client, command, {
      expiresIn: 3600,
    });
    return signedUrl;
  } catch (error) {
    console.error('Error generating presigned GET URL:', error);
    throw error;
  }
}

export async function initiateMultipartUpload(
  key: string,
  contentType: string,
) {
  const command = new CreateMultipartUploadCommand({
    Bucket: BUCKET_NAME,
    Key: key,
    ContentType: contentType,
  });

  try {
    const { UploadId } = await s3Client.send(command);
    return UploadId;
  } catch (error) {
    console.error('Error initiating multipart upload:', error);
    throw error;
  }
}
export async function generatePartUploadUrl(
  key: string,
  uploadId: string,
  partNumber: number,
) {
  const command = new UploadPartCommand({
    Bucket: BUCKET_NAME,
    Key: key,
    UploadId: uploadId,
    PartNumber: partNumber,
  });

  try {
    const signedUrl = await getSignedUrl(s3Client, command, {
      expiresIn: 3600,
    });
    return signedUrl;
  } catch (error) {
    console.error('Error generating part upload URL:', error);
    throw error;
  }
}

export async function completeMultipartUpload(
  key: string,
  uploadId: string,
  parts: { ETag: string; PartNumber: number }[],
) {
  const command = new CompleteMultipartUploadCommand({
    Bucket: BUCKET_NAME,
    Key: key,
    UploadId: uploadId,
    MultipartUpload: { Parts: parts },
  });

  try {
    await s3Client.send(command);
    const finalUrl = await generatePresignedGetUrl(key);
    return { key, finalUrl };
  } catch (error) {
    console.error('Error completing multipart upload:', error);
    throw error;
  }
}
