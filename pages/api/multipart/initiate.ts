import { initiateMultipartUpload } from '@/lib/uploadUtils';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { key, contentType } = req.body;

    if (!key || !contentType) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const uploadId = await initiateMultipartUpload(key, contentType);
    return res.status(200).json({ uploadId });
  } catch (error) {
    console.error('Error initiating multipart upload:', error);
    return res
      .status(500)
      .json({ message: 'Failed to initiate multipart upload' });
  }
}
